import { describe, expect, it, vi } from "vitest";
import type { InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import { game, type FacetDebugApi, type FacetState } from "./game";
import {
  SWAP_SECONDS,
  WAVE_SECONDS,
  FALL_SECONDS_PER_ROW,
  STEP_SECONDS,
} from "./constants";

function initApi(): InitApi<FacetState> {
  return {
    input: {
      register: vi.fn(),
      layout: () => null,
    },
    audio: {
      define: vi.fn(),
      load: vi.fn(() => Promise.resolve()),
    },
    assets: {
      loadImage: vi.fn(() =>
        Promise.reject(new Error("no image server in unit test")),
      ),
      loadAudio: vi.fn(() => Promise.reject(new Error("unused"))),
      load: vi.fn(() => Promise.resolve(new Blob())),
      resolve: (path: string) => `assets/${path}`,
    },
    diagnostics: {
      register: vi.fn(),
    },
    events: { on: vi.fn(() => vi.fn()) },
    viewport: () => ({
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
      scale: 1,
      dpr: 1,
    }),
  } as unknown as InitApi<FacetState>;
}

function updateApi() {
  const loops = new Set<string>();
  const played: string[] = [];
  const api = {
    input: {
      pressed: vi.fn(() => false),
      pointerSamples: vi.fn(() => []),
      pointer: vi.fn(() => ({
        x: 0,
        y: 0,
        down: false,
        device: "mouse",
        buttons: [],
      })),
    },
    audio: {
      play: vi.fn((cue: string) => played.push(cue)),
      loop: vi.fn((cue: string) => {
        loops.add(cue);
      }),
      stop: vi.fn((cue: string) => {
        loops.delete(cue);
      }),
      looping: vi.fn((cue: string) => loops.has(cue)),
      setMuted: vi.fn(),
      muted: vi.fn(() => false),
    },
    played,
  };
  return api as unknown as UpdateApi & { played: string[] };
}

async function initialized(): Promise<[FacetState, FacetDebugApi]> {
  return game.initialize(initApi());
}

describe("Facet simulation", () => {
  it("reports debug snapshots with posed boards and targets", async () => {
    const [state, debug] = await initialized();
    const posed = debug.loadBoard(state, [
      "R0 A0 C0 J0 B0 S0 M0 R0",
      "C0 J0 B0 S0 M0 R0 A0 C0",
      "B0 S0 M0 R0 A0 C0 J0 B0",
      "M0 R0 A0 C0 J0 B0 S0 M0",
      "A0 C0 J0 B0 S0 M0 R0 A0",
      "J0 B0 S0 M0 R0 A0 C0 J0",
      "S0 M0 R0 A0 C0 J0 B0 S0",
      "R0 A0 C0 J0 B0 S0 M0 R0",
    ]);

    const snap = debug.snapshot(debug.setScreen(posed, "playing"));

    expect(snap.version).toBe(1);
    expect(snap.board.cells).toHaveLength(64);
    expect(snap.board.cells[0]).toMatchObject({
      col: 0,
      row: 0,
      x: 388,
      y: 144,
    });
    expect(snap.targets.map((target) => target.id)).toEqual(["pause"]);
  });

  it("accepts a productive swap and scores the first clear", async () => {
    const [state, debug] = await initialized();
    let current = debug.setScreen(
      debug.loadBoard(state, [
        "R0 A0 R0 J0 B0 S0 M0 R0",
        "A0 R0 C0 S0 M0 R0 A0 C0",
        "B0 S0 M0 R0 A0 C0 J0 B0",
        "M0 R0 A0 C0 J0 B0 S0 M0",
        "A0 C0 J0 B0 S0 M0 R0 A0",
        "J0 B0 S0 M0 R0 A0 C0 J0",
        "S0 M0 R0 A0 C0 J0 B0 S0",
        "R0 A0 C0 J0 B0 S0 M0 R0",
      ]),
      "playing",
    );
    current = debug.requestSwap(current, 1, 0, 1, 1);
    expect(current.phase).toBe("swapping");

    const api = updateApi();
    current = game.update(current, api, SWAP_SECONDS);

    expect(current.phase).toBe("resolving");
    expect(current.chainStep).toBe(1);
    expect(current.lastCleared).toBeGreaterThanOrEqual(3);
    expect(current.score).toBeGreaterThanOrEqual(30);
    expect(api.played).toContain("chain-1");
  });

  it("refuses a nonproductive adjacent swap", async () => {
    const [state, debug] = await initialized();
    const board = debug.loadBoard(state, [
      "R0 A0 C0 J0 B0 S0 M0 R0",
      "C0 J0 B0 S0 M0 R0 A0 C0",
      "B0 S0 M0 R0 A0 C0 J0 B0",
      "M0 R0 A0 C0 J0 B0 S0 M0",
      "A0 C0 J0 B0 S0 M0 R0 A0",
      "J0 B0 S0 M0 R0 A0 C0 J0",
      "S0 M0 R0 A0 C0 J0 B0 S0",
      "R0 A0 C0 J0 B0 S0 M0 R0",
    ]);

    const refused = debug.requestSwap(board, 0, 0, 1, 0);

    expect(refused.phase).toBe("idle");
    expect(refused.refusal).toMatchObject({
      a: { col: 0, row: 0 },
      b: { col: 1, row: 0 },
    });
  });

  it("settles a resolving step back to idle after its hold", async () => {
    const [state, debug] = await initialized();
    let current = debug.setScreen(
      debug.loadBoard(state, [
        "R0 A0 R0 J0 B0 S0 M0 R0",
        "A0 R0 C0 S0 M0 R0 A0 C0",
        "B0 S0 M0 R0 A0 C0 J0 B0",
        "M0 R0 A0 C0 J0 B0 S0 M0",
        "A0 C0 J0 B0 S0 M0 R0 A0",
        "J0 B0 S0 M0 R0 A0 C0 J0",
        "S0 M0 R0 A0 C0 J0 B0 S0",
        "R0 A0 C0 J0 B0 S0 M0 R0",
      ]),
      "playing",
    );
    current = debug.requestSwap(current, 1, 0, 1, 1);
    const api = updateApi();
    current = game.update(current, api, SWAP_SECONDS);
    const hold =
      current.lastWaves * WAVE_SECONDS +
      debug.snapshot(current).lastFall * FALL_SECONDS_PER_ROW +
      STEP_SECONDS;
    current = game.update(current, api, hold + 0.01);

    expect(["idle", "resolving", "levelclear", "gameover"]).toContain(
      current.phase === "idle" ? current.phase : current.screen,
    );
    expect(current.swapTimer).toBe(0);
  });
});
