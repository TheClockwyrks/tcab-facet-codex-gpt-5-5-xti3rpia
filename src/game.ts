import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  BACK_LABEL,
  BASE_SCORE,
  BEST_CHAIN_LABEL,
  BEST_MOVE_LABEL,
  BINDINGS,
  BOARD_CX,
  BOARD_CY,
  CELL_PITCH,
  CUES,
  FALL_SECONDS_PER_ROW,
  FACET_DEBUG_VERSION,
  FLAWED_SCORE,
  GAMEOVER_ITEMS,
  GAMEOVER_TITLE_TEXT,
  GEM_HIT_R,
  GEM_KIND_COUNT,
  GEM_KINDS,
  GEM_R,
  GRID_COLS,
  GRID_ROWS,
  HUD_CHAIN_LABEL,
  HUD_LEVEL_LABEL,
  HUD_SCORE_LABEL,
  LAND_MIN_ROWS,
  LEVELCLEAR_ITEMS,
  LEVELCLEAR_TITLE_TEXT,
  LEVEL_TARGET_STEP,
  MATCH_MIN,
  MAX_MULTIPLIER,
  MAX_STRAIN,
  PAUSED_ITEMS,
  PAUSED_TITLE_TEXT,
  PAUSE_LABEL,
  REFUSAL_SECONDS,
  STAGE_CX,
  STAGE_H,
  STAGE_W,
  STEP_SECONDS,
  SWAP_SECONDS,
  TAGLINE_TEXT,
  TARGET_MIN_H,
  TARGET_MIN_W,
  TITLE_ITEMS,
  TITLE_TEXT,
  WAVE_SECONDS,
} from "./constants";

export type GemKind =
  "ruby" | "amber" | "citrine" | "jade" | "beryl" | "sapphire" | "amethyst";

export type Cut = "plain" | "brilliant" | "star" | "prism";

export type Screen =
  "title" | "howto" | "playing" | "paused" | "levelclear" | "gameover";

export type Phase = "idle" | "swapping" | "resolving";

export type PointerDevice = "mouse" | "pen" | "touch";

export interface CellRef {
  readonly col: number;
  readonly row: number;
}

export interface GemState {
  readonly col: number;
  readonly row: number;
  readonly kind: GemKind | null;
  readonly cut: Cut;
  readonly strain: number;
  readonly fell: number;
}

export interface BoardState {
  readonly cols: number;
  readonly rows: number;
  readonly cells: readonly GemState[];
}

export interface RefusalState {
  readonly a: CellRef;
  readonly b: CellRef;
  readonly timer: number;
}

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
  readonly device: PointerDevice;
}

export interface FacetState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly board: BoardState;
  readonly phase: Phase;
  readonly chainStep: number;
  readonly swapTimer: number;
  readonly stepTimer: number;
  readonly score: number;
  readonly level: number;
  readonly levelScore: number;
  readonly lastCleared: number;
  readonly lastPoints: number;
  readonly lastWaves: number;
  readonly moveScore: number;
  readonly bestMove: number;
  readonly bestChain: number;
  readonly selection: CellRef | null;
  readonly offer: CellRef | null;
  readonly refusal: RefusalState | null;
  readonly armedTarget: string | null;
  readonly pointer: PointerState;
  readonly simTime: number;
  readonly muted: boolean;
  readonly refillKinds: readonly string[];
}

interface TargetRect {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

interface SnapshotCell extends GemState {
  readonly x: number;
  readonly y: number;
}

interface FacetSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly score: number;
  readonly level: number;
  readonly levelScore: number;
  readonly levelTarget: number;
  readonly phase: Phase;
  readonly chainStep: number;
  readonly multiplier: number;
  readonly swapTimer: number;
  readonly stepTimer: number;
  readonly stepHold: number;
  readonly board: {
    readonly cols: number;
    readonly rows: number;
    readonly cells: readonly SnapshotCell[];
  };
  readonly selection: CellRef | null;
  readonly offer: CellRef | null;
  readonly refusal: { readonly a: CellRef; readonly b: CellRef } | null;
  readonly lastCleared: number;
  readonly lastPoints: number;
  readonly lastWaves: number;
  readonly lastFall: number;
  readonly moveScore: number;
  readonly bestMove: number;
  readonly bestChain: number;
  readonly legalSwap: boolean;
  readonly refillKinds: readonly string[];
  readonly pointer: PointerState;
  readonly armedTarget: string | null;
  readonly targets: readonly TargetRect[];
  readonly muted: boolean;
  readonly simTime: number;
}

export interface FacetDebugApi {
  readonly version: number;
  reset(state: DeepReadonly<FacetState>): FacetState;
  reconcile(state: DeepReadonly<FacetState>): FacetState;
  snapshot(state: DeepReadonly<FacetState>): FacetSnapshot;
  setScreen(state: DeepReadonly<FacetState>, screen: Screen): FacetState;
  setMenuIndex(state: DeepReadonly<FacetState>, index: number): FacetState;
  loadBoard(
    state: DeepReadonly<FacetState>,
    rows: readonly string[],
  ): FacetState;
  dealBoard(state: DeepReadonly<FacetState>): FacetState;
  clearBoard(state: DeepReadonly<FacetState>): FacetState;
  setGem(
    state: DeepReadonly<FacetState>,
    col: number,
    row: number,
    token: string,
  ): FacetState;
  setRefillKinds(
    state: DeepReadonly<FacetState>,
    col: number,
    kinds: string,
  ): FacetState;
  clearRefillKinds(state: DeepReadonly<FacetState>): FacetState;
  setScore(state: DeepReadonly<FacetState>, points: number): FacetState;
  setLevel(state: DeepReadonly<FacetState>, level: number): FacetState;
  setLevelScore(state: DeepReadonly<FacetState>, points: number): FacetState;
  setBestChain(state: DeepReadonly<FacetState>, chainStep: number): FacetState;
  setBestMove(state: DeepReadonly<FacetState>, points: number): FacetState;
  setMoveScore(state: DeepReadonly<FacetState>, points: number): FacetState;
  setSelection(
    state: DeepReadonly<FacetState>,
    col: number,
    row: number,
  ): FacetState;
  clearSelection(state: DeepReadonly<FacetState>): FacetState;
  setOffer(
    state: DeepReadonly<FacetState>,
    col: number,
    row: number,
  ): FacetState;
  clearOffer(state: DeepReadonly<FacetState>): FacetState;
  clearRefusal(state: DeepReadonly<FacetState>): FacetState;
  clearChain(state: DeepReadonly<FacetState>): FacetState;
  requestSwap(
    state: DeepReadonly<FacetState>,
    colA: number,
    rowA: number,
    colB: number,
    rowB: number,
  ): FacetState;
  pointerDown(
    state: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerMove(
    state: DeepReadonly<FacetState>,
    x: number,
    y: number,
    device?: PointerDevice,
  ): FacetState;
  pointerUp(
    state: DeepReadonly<FacetState>,
    device?: PointerDevice,
  ): FacetState;
}

export const BACKGROUND = "#07111f";

const KIND_LETTERS: Readonly<Record<string, GemKind>> = {
  R: "ruby",
  A: "amber",
  C: "citrine",
  J: "jade",
  B: "beryl",
  S: "sapphire",
  M: "amethyst",
};
const EMPTY_BOARD: BoardState = { cols: 0, rows: 0, cells: [] };
const GEM_ASSET_KEYS = [
  ...GEM_KINDS.flatMap((kind) =>
    [0, 1, 2, 3].map((strain) => `${kind}-${strain}`),
  ),
  "prism-0",
  "prism-1",
  "prism-2",
  "prism-3",
  "brilliant",
  "star",
  "board-frame",
] as const;
const BREAK_FRAMES = 6;
const PRISM_FRAMES = 8;

const images = new Map<string, CanvasImageSource>();
let effectSerial = 0;
let pendingSwap: CellRef[] | null = null;
const visualEffects: Array<{
  id: number;
  kind: string;
  x: number;
  y: number;
  t: number;
}> = [];

type MutableGem = GemState | null;
interface RunInfo {
  readonly cells: readonly CellRef[];
  readonly kind: GemKind;
  readonly horizontal: boolean;
}
interface StepResult {
  readonly state: FacetState;
  readonly clearedCells: readonly CellRef[];
  readonly cutCreated: boolean;
  readonly flawCreated: boolean;
  readonly landRows: number;
}

export function cellX(col: number): number {
  return BOARD_CX - ((GRID_COLS - 1) * CELL_PITCH) / 2 + col * CELL_PITCH;
}

export function cellY(row: number): number {
  return BOARD_CY - ((GRID_ROWS - 1) * CELL_PITCH) / 2 + row * CELL_PITCH;
}

function idx(col: number, row: number, cols = GRID_COLS): number {
  return row * cols + col;
}

function sameCell(a: CellRef | null, b: CellRef | null): boolean {
  return !!a && !!b && a.col === b.col && a.row === b.row;
}

function adjacent(a: CellRef, b: CellRef): boolean {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row) === 1;
}

function assertCell(col: number, row: number): void {
  if (
    !Number.isInteger(col) ||
    !Number.isInteger(row) ||
    col < 0 ||
    row < 0 ||
    col >= GRID_COLS ||
    row >= GRID_ROWS
  ) {
    throw new Error(`Facet: invalid cell (${col}, ${row})`);
  }
}

function assertWhole(value: number, name: string, min = 0): void {
  if (!Number.isInteger(value) || value < min)
    throw new Error(`Facet: invalid ${name}`);
}

function cloneState(state: DeepReadonly<FacetState>): FacetState {
  return {
    ...state,
    board: {
      ...state.board,
      cells: state.board.cells.map((gem) => ({ ...gem })),
    },
    selection: state.selection ? { ...state.selection } : null,
    offer: state.offer ? { ...state.offer } : null,
    refusal: state.refusal
      ? {
          a: { ...state.refusal.a },
          b: { ...state.refusal.b },
          timer: state.refusal.timer,
        }
      : null,
    pointer: { ...state.pointer },
    refillKinds: [...state.refillKinds],
  };
}

function initialState(muted = false): FacetState {
  return {
    screen: "title",
    menuIndex: 0,
    board: EMPTY_BOARD,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    score: 0,
    level: 1,
    levelScore: 0,
    lastCleared: 0,
    lastPoints: 0,
    lastWaves: 0,
    moveScore: 0,
    bestMove: 0,
    bestChain: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
    pointer: { x: 0, y: 0, down: false, device: "mouse" },
    simTime: 0,
    muted,
    refillKinds: Array.from({ length: GRID_COLS }, () => ""),
  };
}

function gemAt(
  board: DeepReadonly<BoardState>,
  col: number,
  row: number,
): GemState {
  const gem = board.cells[idx(col, row, board.cols)];
  if (!gem) throw new Error(`Facet: missing gem (${col}, ${row})`);
  return { ...gem };
}

function withGem(board: DeepReadonly<BoardState>, gem: GemState): BoardState {
  assertCell(gem.col, gem.row);
  const cells = board.cells.map((cell) => ({ ...cell }));
  cells[idx(gem.col, gem.row, board.cols)] = gem;
  return { cols: board.cols, rows: board.rows, cells };
}

function tokenToGem(token: string, col: number, row: number): GemState {
  const match = /^([RACJBSMX])([0-3])([bs])?$/.exec(token);
  if (!match) throw new Error(`Facet: invalid cell token ${token}`);
  const [, letter, strainText, cutLetter] = match;
  const strain = Number(strainText);
  if (letter === "X") {
    if (cutLetter)
      throw new Error("Facet: prism token cannot carry a cut suffix");
    return { col, row, kind: null, cut: "prism", strain, fell: 0 };
  }
  return {
    col,
    row,
    kind: KIND_LETTERS[letter],
    cut: cutLetter === "b" ? "brilliant" : cutLetter === "s" ? "star" : "plain",
    strain,
    fell: 0,
  };
}

function parseBoard(rows: readonly string[]): BoardState {
  if (rows.length !== GRID_ROWS)
    throw new Error("Facet: board must have 8 rows");
  const cells: GemState[] = [];
  rows.forEach((line, row) => {
    const tokens = line.trim().split(/\s+/u);
    if (tokens.length !== GRID_COLS)
      throw new Error("Facet: board row must have 8 cells");
    tokens.forEach((token, col) => cells.push(tokenToGem(token, col, row)));
  });
  return { cols: GRID_COLS, rows: GRID_ROWS, cells };
}

function randomKind(): GemKind {
  return GEM_KINDS[Math.floor(Math.random() * GEM_KIND_COUNT)] as GemKind;
}

function dealOpeningBoard(): BoardState {
  for (let attempts = 0; attempts < 2000; attempts += 1) {
    const cells: GemState[] = [];
    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let col = 0; col < GRID_COLS; col += 1) {
        const forbidden = new Set<GemKind>();
        if (col >= 2) {
          const a = cells[idx(col - 1, row)]?.kind;
          const b = cells[idx(col - 2, row)]?.kind;
          if (a && a === b) forbidden.add(a);
        }
        if (row >= 2) {
          const a = cells[idx(col, row - 1)]?.kind;
          const b = cells[idx(col, row - 2)]?.kind;
          if (a && a === b) forbidden.add(a);
        }
        const choices = GEM_KINDS.filter((kind) => !forbidden.has(kind));
        const kind = choices[
          Math.floor(Math.random() * choices.length)
        ] as GemKind;
        cells.push({
          col,
          row,
          kind,
          cut: "plain",
          strain: 0,
          fell: row + 1 + Math.floor(Math.random() * 3),
        });
      }
    }
    const board = { cols: GRID_COLS, rows: GRID_ROWS, cells };
    if (findRuns(board).length === 0 && hasLegalSwap(board)) return board;
  }
  return parseBoard([
    "R0 A0 C0 J0 B0 S0 M0 R0",
    "C0 J0 B0 S0 M0 R0 A0 C0",
    "B0 S0 M0 R0 A0 C0 J0 B0",
    "M0 R0 A0 C0 J0 B0 S0 M0",
    "A0 C0 J0 B0 S0 M0 R0 A0",
    "J0 B0 S0 M0 R0 A0 C0 J0",
    "S0 M0 R0 A0 C0 J0 B0 S0",
    "R0 A0 C0 J0 B0 S0 M0 R0",
  ]).cells.length
    ? dealOpeningBoardFallback()
    : EMPTY_BOARD;
}

function dealOpeningBoardFallback(): BoardState {
  return parseBoard([
    "R0 A0 C0 J0 B0 S0 M0 R0",
    "C0 J0 B0 S0 M0 R0 A0 C0",
    "B0 S0 M0 R0 A0 C0 J0 B0",
    "M0 R0 A0 C0 J0 B0 S0 M0",
    "A0 C0 J0 B0 S0 M0 R0 A0",
    "J0 B0 S0 M0 R0 A0 C0 J0",
    "S0 M0 R0 A0 C0 J0 B0 S0",
    "R0 A0 C0 J0 B0 S0 M0 R0",
  ]);
}

function findRuns(board: DeepReadonly<BoardState>): RunInfo[] {
  if (board.cols !== GRID_COLS || board.rows !== GRID_ROWS) return [];
  const runs: RunInfo[] = [];
  for (let row = 0; row < GRID_ROWS; row += 1) {
    let col = 0;
    while (col < GRID_COLS) {
      const kind = board.cells[idx(col, row)]?.kind;
      let end = col + 1;
      while (
        kind &&
        end < GRID_COLS &&
        board.cells[idx(end, row)]?.kind === kind
      )
        end += 1;
      if (kind && end - col >= MATCH_MIN)
        runs.push({
          kind,
          horizontal: true,
          cells: range(col, end).map((c) => ({ col: c, row })),
        });
      col = Math.max(end, col + 1);
    }
  }
  for (let col = 0; col < GRID_COLS; col += 1) {
    let row = 0;
    while (row < GRID_ROWS) {
      const kind = board.cells[idx(col, row)]?.kind;
      let end = row + 1;
      while (
        kind &&
        end < GRID_ROWS &&
        board.cells[idx(col, end)]?.kind === kind
      )
        end += 1;
      if (kind && end - row >= MATCH_MIN)
        runs.push({
          kind,
          horizontal: false,
          cells: range(row, end).map((r) => ({ col, row: r })),
        });
      row = Math.max(end, row + 1);
    }
  }
  return runs;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}

function swappedBoard(
  board: DeepReadonly<BoardState>,
  a: CellRef,
  b: CellRef,
): BoardState {
  const cells = board.cells.map((gem) => ({ ...gem, fell: 0 }));
  const ai = idx(a.col, a.row, board.cols);
  const bi = idx(b.col, b.row, board.cols);
  const ga = cells[ai];
  const gb = cells[bi];
  cells[ai] = { ...gb, col: a.col, row: a.row, fell: 0 };
  cells[bi] = { ...ga, col: b.col, row: b.row, fell: 0 };
  return { cols: board.cols, rows: board.rows, cells };
}

function productiveSwap(
  board: DeepReadonly<BoardState>,
  a: CellRef,
  b: CellRef,
): boolean {
  if (board.cols !== GRID_COLS || board.rows !== GRID_ROWS) return false;
  const ga = gemAt(board, a.col, a.row);
  const gb = gemAt(board, b.col, b.row);
  if (ga.cut === "prism" || gb.cut === "prism") return true;
  return findRuns(swappedBoard(board, a, b)).length > 0;
}

function hasLegalSwap(board: DeepReadonly<BoardState>): boolean {
  if (board.cols !== GRID_COLS || board.rows !== GRID_ROWS) return false;
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const a = { col, row };
      if (
        col + 1 < GRID_COLS &&
        productiveSwap(board, a, { col: col + 1, row })
      )
        return true;
      if (
        row + 1 < GRID_ROWS &&
        productiveSwap(board, a, { col, row: row + 1 })
      )
        return true;
    }
  }
  return false;
}

function requestSwapCore(
  state: DeepReadonly<FacetState>,
  a: CellRef,
  b: CellRef,
  play?: UpdateApi["audio"],
): FacetState {
  assertCell(a.col, a.row);
  assertCell(b.col, b.row);
  if (
    state.phase !== "idle" ||
    !adjacent(a, b) ||
    !productiveSwap(state.board, a, b)
  ) {
    play?.play(CUES.refuse);
    return { ...cloneState(state), refusal: { a, b, timer: 0 } };
  }
  play?.play(CUES.swap);
  pendingSwap = [{ ...a }, { ...b }];
  return {
    ...cloneState(state),
    board: swappedBoard(state.board, a, b),
    phase: "swapping",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    moveScore: 0,
    selection: null,
    offer: null,
    refusal: null,
  };
}

function prismSeed(
  board: DeepReadonly<BoardState>,
  swap: CellRef[] | null,
): CellRef[] | null {
  if (!swap) return null;
  const [a, b] = swap;
  const ga = gemAt(board, a.col, a.row);
  const gb = gemAt(board, b.col, b.row);
  if (ga.cut !== "prism" && gb.cut !== "prism") return null;
  if (ga.cut === "prism" && gb.cut === "prism")
    return board.cells.map((g) => ({ col: g.col, row: g.row }));
  const kind = ga.cut === "prism" ? gb.kind : ga.kind;
  if (!kind) return [];
  return board.cells
    .filter((gem) => gem.kind === kind || gem.cut === "prism")
    .map((gem) => ({ col: gem.col, row: gem.row }));
}

function keyOf(cell: CellRef): string {
  return `${cell.col},${cell.row}`;
}

function neighbors4(cell: CellRef): CellRef[] {
  return [
    { col: cell.col - 1, row: cell.row },
    { col: cell.col + 1, row: cell.row },
    { col: cell.col, row: cell.row - 1 },
    { col: cell.col, row: cell.row + 1 },
  ].filter(
    (c) => c.col >= 0 && c.row >= 0 && c.col < GRID_COLS && c.row < GRID_ROWS,
  );
}

function neighbors8(cell: CellRef): CellRef[] {
  const cells: CellRef[] = [];
  for (let dy = -1; dy <= 1; dy += 1)
    for (let dx = -1; dx <= 1; dx += 1)
      if (dx || dy) {
        const col = cell.col + dx;
        const row = cell.row + dy;
        if (col >= 0 && row >= 0 && col < GRID_COLS && row < GRID_ROWS)
          cells.push({ col, row });
      }
  return cells;
}

function seedForStep(
  board: DeepReadonly<BoardState>,
  chainStep: number,
  swap: CellRef[] | null,
): { seed: CellRef[]; runs: RunInfo[] } {
  if (chainStep === 1) {
    const pSeed = prismSeed(board, swap);
    if (pSeed) return { seed: pSeed, runs: [] };
  }
  const runs = findRuns(board);
  const seen = new Set<string>();
  const seed: CellRef[] = [];
  for (const run of runs)
    for (const cell of run.cells)
      if (!seen.has(keyOf(cell))) {
        seen.add(keyOf(cell));
        seed.push(cell);
      }
  return { seed, runs };
}

function expandClearSet(
  board: DeepReadonly<BoardState>,
  seed: readonly CellRef[],
): Map<string, number> {
  const waves = new Map<string, number>();
  const queue: CellRef[] = [];
  for (const cell of seed) {
    const key = keyOf(cell);
    if (!waves.has(key)) {
      waves.set(key, 0);
      queue.push(cell);
    }
  }
  for (let qi = 0; qi < queue.length; qi += 1) {
    const cell = queue[qi];
    const wave = waves.get(keyOf(cell)) ?? 0;
    const gem = gemAt(board, cell.col, cell.row);
    const additions: CellRef[] = [];
    if (gem.cut === "brilliant") additions.push(...neighbors8(cell));
    if (gem.cut === "star") {
      for (let c = 0; c < GRID_COLS; c += 1)
        additions.push({ col: c, row: cell.row });
      for (let r = 0; r < GRID_ROWS; r += 1)
        additions.push({ col: cell.col, row: r });
    }
    for (const n of neighbors4(cell))
      if (gemAt(board, n.col, n.row).strain >= MAX_STRAIN) additions.push(n);
    for (const next of additions) {
      const key = keyOf(next);
      if (!waves.has(key) || (waves.get(key) ?? 0) > wave + 1) {
        waves.set(key, wave + 1);
        queue.push(next);
      }
    }
  }
  return waves;
}

function chooseRunCell(run: RunInfo, swap: CellRef[] | null): CellRef {
  const cells = [...run.cells];
  const inRun = swap?.filter((s) => cells.some((c) => sameCell(c, s))) ?? [];
  if (inRun.length > 0) {
    return [...inRun].sort((a, b) =>
      run.horizontal ? a.col - b.col : a.row - b.row,
    )[0] as CellRef;
  }
  return cells[Math.floor((cells.length - 1) / 2)] as CellRef;
}

function createdCuts(
  runs: readonly RunInfo[],
  swap: CellRef[] | null,
): Map<string, GemState> {
  const result = new Map<string, GemState>();
  const horizontals = runs.filter((r) => r.horizontal);
  const verticals = runs.filter((r) => !r.horizontal);
  for (const h of horizontals)
    for (const v of verticals) {
      const cross = h.cells.find((hc) =>
        v.cells.some((vc) => sameCell(hc, vc)),
      );
      if (cross)
        result.set(keyOf(cross), {
          col: cross.col,
          row: cross.row,
          kind: h.kind,
          cut: "star",
          strain: 0,
          fell: 0,
        });
    }
  for (const run of runs) {
    const place = chooseRunCell(run, swap);
    const key = keyOf(place);
    const existing = result.get(key);
    if (run.cells.length >= 5)
      result.set(key, {
        col: place.col,
        row: place.row,
        kind: null,
        cut: "prism",
        strain: 0,
        fell: 0,
      });
    else if (
      run.cells.length === 4 &&
      (!existing || existing.cut === "brilliant")
    ) {
      result.set(key, {
        col: place.col,
        row: place.row,
        kind: run.kind,
        cut: "brilliant",
        strain: 0,
        fell: 0,
      });
    }
  }
  return result;
}

function refillKindFor(
  state: DeepReadonly<FacetState>,
  col: number,
  row: number,
): GemKind {
  const posed = state.refillKinds[col]?.[row];
  if (posed && KIND_LETTERS[posed]) return KIND_LETTERS[posed];
  return randomKind();
}

function settleBoard(
  state: DeepReadonly<FacetState>,
  cells: MutableGem[],
  creations: Map<string, GemState>,
): { board: BoardState; fall: number } {
  const next: GemState[] = Array.from({ length: GRID_COLS * GRID_ROWS });
  let fall = 0;
  for (let col = 0; col < GRID_COLS; col += 1) {
    let writeRow = GRID_ROWS - 1;
    for (let row = GRID_ROWS - 1; row >= 0; row -= 1) {
      const made = creations.get(keyOf({ col, row }));
      const gem = made ?? cells[idx(col, row)];
      if (gem) {
        const fell = made ? 0 : Math.max(0, writeRow - row);
        fall = Math.max(fall, fell);
        next[idx(col, writeRow)] = { ...gem, col, row: writeRow, fell };
        writeRow -= 1;
      }
    }
    for (let row = writeRow; row >= 0; row -= 1) {
      const fell = row + 1 + (writeRow - row);
      fall = Math.max(fall, fell);
      next[idx(col, row)] = {
        col,
        row,
        kind: refillKindFor(state, col, row),
        cut: "plain",
        strain: 0,
        fell,
      };
    }
  }
  return { board: { cols: GRID_COLS, rows: GRID_ROWS, cells: next }, fall };
}

function resolveStep(
  state: DeepReadonly<FacetState>,
  step: number,
  swap: CellRef[] | null,
): StepResult | null {
  const { seed, runs } = seedForStep(state.board, step, swap);
  if (seed.length === 0) return null;
  const wavesByKey = expandClearSet(state.board, seed);
  const clearKeys = new Set(wavesByKey.keys());
  const clearCells = [...clearKeys].map((key) => {
    const [col, row] = key.split(",").map(Number);
    return { col, row };
  });
  let points = 0;
  for (const cell of clearCells) {
    const gem = gemAt(state.board, cell.col, cell.row);
    points +=
      (gem.strain >= MAX_STRAIN ? FLAWED_SCORE : BASE_SCORE) *
      Math.min(step, MAX_MULTIPLIER);
  }
  const mutable: MutableGem[] = state.board.cells.map((gem) => ({ ...gem }));
  let flawCreated = false;
  for (const cell of clearCells) {
    for (const n of neighbors4(cell)) {
      const key = keyOf(n);
      const ni = idx(n.col, n.row);
      const gem = mutable[ni];
      if (gem && !clearKeys.has(key)) {
        const strain = Math.min(MAX_STRAIN, gem.strain + 1);
        if (strain === MAX_STRAIN && gem.strain < MAX_STRAIN)
          flawCreated = true;
        mutable[ni] = { ...gem, strain };
      }
    }
  }
  for (const cell of clearCells) mutable[idx(cell.col, cell.row)] = null;
  const creations = createdCuts(runs, swap);
  const { board, fall } = settleBoard(state, mutable, creations);
  const lastWaves = Math.max(0, ...wavesByKey.values());
  return {
    state: {
      ...cloneState(state),
      board,
      phase: "resolving",
      chainStep: step,
      stepTimer: 0,
      swapTimer: 0,
      score: state.score + points,
      levelScore: state.levelScore + points,
      moveScore: state.moveScore + points,
      bestChain: Math.max(state.bestChain, step),
      lastCleared: clearCells.length,
      lastPoints: points,
      lastWaves,
      selection: null,
      offer: null,
    },
    clearedCells: clearCells,
    cutCreated: creations.size > 0,
    flawCreated,
    landRows: fall,
  };
}

function stepHold(state: DeepReadonly<FacetState>): number {
  return (
    state.lastWaves * WAVE_SECONDS +
    lastFall(state.board) * FALL_SECONDS_PER_ROW +
    STEP_SECONDS
  );
}

function lastFall(board: DeepReadonly<BoardState>): number {
  return board.cells.reduce((max, gem) => Math.max(max, gem.fell), 0);
}

function addVisual(kind: string, x: number, y: number): void {
  visualEffects.push({ id: effectSerial, kind, x, y, t: 0 });
  effectSerial += 1;
  if (visualEffects.length > 160)
    visualEffects.splice(0, visualEffects.length - 160);
}

function playStepCues(audio: UpdateApi["audio"], result: StepResult): void {
  audio.play(`chain-${Math.min(result.state.chainStep, MAX_MULTIPLIER)}`);
  audio.play("shatter");
  if (result.flawCreated) audio.play(CUES.flaw);
  if (result.cutCreated) audio.play(CUES.cut);
  if (result.landRows > LAND_MIN_ROWS) audio.play(CUES.land);
  for (const cell of result.clearedCells)
    addVisual("clear", cellX(cell.col), cellY(cell.row));
}

function updateResolving(
  state: FacetState,
  dt: number,
  audio: UpdateApi["audio"],
): FacetState {
  const timer = state.stepTimer + dt;
  if (timer < stepHold(state)) return { ...state, stepTimer: timer };
  const nextStep = resolveStep(
    { ...state, stepTimer: 0 },
    state.chainStep + 1,
    null,
  );
  if (nextStep) {
    playStepCues(audio, nextStep);
    return nextStep.state;
  }
  const bestMove = Math.max(state.bestMove, state.moveScore);
  let settled: FacetState = {
    ...state,
    phase: "idle",
    chainStep: 0,
    stepTimer: 0,
    swapTimer: 0,
    bestMove,
  };
  if (settled.levelScore >= LEVEL_TARGET_STEP * settled.level) {
    audio.play(CUES.levelUp);
    settled = {
      ...settled,
      screen: "levelclear",
      menuIndex: 0,
      armedTarget: null,
    };
  } else if (!hasLegalSwap(settled.board)) {
    audio.play(CUES.gameOver);
    settled = {
      ...settled,
      screen: "gameover",
      menuIndex: 0,
      armedTarget: null,
    };
  }
  return settled;
}

function updateBoardTimers(
  state: FacetState,
  dt: number,
  audio: UpdateApi["audio"],
): FacetState {
  let next = state;
  if (next.refusal) {
    const timer = next.refusal.timer + dt;
    next = {
      ...next,
      refusal: timer >= REFUSAL_SECONDS ? null : { ...next.refusal, timer },
    };
  }
  if (next.phase === "swapping") {
    const swapTimer = next.swapTimer + dt;
    if (swapTimer >= SWAP_SECONDS) {
      const result = resolveStep({ ...next, swapTimer: 0 }, 1, pendingSwap);
      pendingSwap = null;
      if (result) {
        playStepCues(audio, result);
        return result.state;
      }
      return { ...next, phase: "idle", swapTimer: 0 };
    }
    return { ...next, swapTimer };
  }
  if (next.phase === "resolving") return updateResolving(next, dt, audio);
  return next;
}

function targetRects(screen: Screen): TargetRect[] {
  const menuX = STAGE_CX - 150;
  const menuY = 390;
  const menuW = 300;
  const menuH = TARGET_MIN_H;
  const gap = 18;
  const menu = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: `menu-${i}`,
      x: menuX,
      y: menuY + i * (menuH + gap),
      w: menuW,
      h: menuH,
    }));
  if (screen === "title") return menu(TITLE_ITEMS.length);
  if (screen === "paused") return menu(PAUSED_ITEMS.length);
  if (screen === "levelclear") return menu(LEVELCLEAR_ITEMS.length);
  if (screen === "gameover") return menu(GAMEOVER_ITEMS.length);
  if (screen === "howto")
    return [{ id: "back", x: 44, y: 34, w: TARGET_MIN_W, h: TARGET_MIN_H }];
  if (screen === "playing")
    return [{ id: "pause", x: 1088, y: 32, w: 140, h: TARGET_MIN_H }];
  return [];
}

function hitTarget(screen: Screen, x: number, y: number): TargetRect | null {
  return (
    targetRects(screen).find(
      (t) => x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h,
    ) ?? null
  );
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "paused") return PAUSED_ITEMS;
  if (screen === "levelclear") return LEVELCLEAR_ITEMS;
  if (screen === "gameover") return GAMEOVER_ITEMS;
  return [];
}

function abandonRound(state: DeepReadonly<FacetState>): FacetState {
  return {
    ...cloneState(state),
    screen: "title",
    menuIndex: 0,
    board: EMPTY_BOARD,
    phase: "idle",
    chainStep: 0,
    swapTimer: 0,
    stepTimer: 0,
    selection: null,
    offer: null,
    refusal: null,
    armedTarget: null,
  };
}

function startRound(state: DeepReadonly<FacetState>): FacetState {
  return {
    ...initialState(state.muted),
    screen: "playing",
    board: dealOpeningBoard(),
  };
}

function continueLevel(state: DeepReadonly<FacetState>): FacetState {
  return {
    ...cloneState(state),
    screen: "playing",
    menuIndex: 0,
    level: state.level + 1,
    levelScore: 0,
    bestChain: 0,
    bestMove: 0,
    board: dealOpeningBoard(),
    phase: "idle",
    chainStep: 0,
    stepTimer: 0,
    swapTimer: 0,
  };
}

function takeConfirm(state: DeepReadonly<FacetState>): FacetState {
  const index = state.menuIndex;
  if (state.screen === "title")
    return index === 0
      ? startRound(state)
      : { ...cloneState(state), screen: "howto", armedTarget: null };
  if (state.screen === "paused")
    return index === 0
      ? {
          ...cloneState(state),
          screen: "playing",
          menuIndex: 0,
          armedTarget: null,
        }
      : abandonRound(state);
  if (state.screen === "levelclear")
    return index === 0 ? continueLevel(state) : abandonRound(state);
  if (state.screen === "gameover")
    return index === 0 ? startRound(state) : abandonRound(state);
  return cloneState(state);
}

function applyBack(state: DeepReadonly<FacetState>): FacetState {
  if (state.screen === "howto")
    return {
      ...cloneState(state),
      screen: "title",
      menuIndex: 1,
      armedTarget: null,
    };
  if (state.screen === "gameover")
    return {
      ...cloneState(state),
      screen: "title",
      menuIndex: 0,
      armedTarget: null,
    };
  return cloneState(state);
}

function applyPause(state: DeepReadonly<FacetState>): FacetState {
  if (state.screen === "playing")
    return {
      ...cloneState(state),
      screen: "paused",
      menuIndex: 0,
      armedTarget: null,
    };
  if (state.screen === "paused")
    return {
      ...cloneState(state),
      screen: "playing",
      menuIndex: 0,
      armedTarget: null,
    };
  return cloneState(state);
}

function cellFromPoint(x: number, y: number): CellRef | null {
  let best: CellRef | null = null;
  let bestDist = Infinity;
  for (let row = GRID_ROWS - 1; row >= 0; row -= 1) {
    for (let col = GRID_COLS - 1; col >= 0; col -= 1) {
      const d = (cellX(col) - x) ** 2 + (cellY(row) - y) ** 2;
      if (d <= GEM_HIT_R ** 2 && d < bestDist) {
        best = { col, row };
        bestDist = d;
      }
    }
  }
  return best;
}

function pointerPress(
  state: DeepReadonly<FacetState>,
  x: number,
  y: number,
  device: PointerDevice,
  audio?: UpdateApi["audio"],
): FacetState {
  const pointer = { x, y, down: true, device };
  const target = hitTarget(state.screen, x, y);
  if (target) {
    const menuMatch = /^menu-(\d+)$/u.exec(target.id);
    return {
      ...cloneState(state),
      pointer,
      menuIndex: menuMatch ? Number(menuMatch[1]) : state.menuIndex,
      armedTarget: target.id,
    };
  }
  if (state.screen !== "playing")
    return { ...cloneState(state), pointer, armedTarget: null };
  const cell = cellFromPoint(x, y);
  if (!cell)
    return {
      ...cloneState(state),
      pointer,
      selection: null,
      offer: null,
      armedTarget: null,
    };
  if (!state.selection) {
    audio?.play(CUES.select);
    return {
      ...cloneState(state),
      pointer,
      selection: cell,
      offer: null,
      armedTarget: null,
    };
  }
  if (sameCell(state.selection, cell))
    return { ...cloneState(state), pointer, offer: null, armedTarget: null };
  if (adjacent(state.selection, cell))
    return { ...cloneState(state), pointer, offer: cell, armedTarget: null };
  audio?.play(CUES.select);
  return {
    ...cloneState(state),
    pointer,
    selection: cell,
    offer: null,
    armedTarget: null,
  };
}

function pointerMove(
  state: DeepReadonly<FacetState>,
  x: number,
  y: number,
  device: PointerDevice,
): FacetState {
  const pointer = { x, y, down: state.pointer.down, device };
  const target = hitTarget(state.screen, x, y);
  if (target && !state.pointer.down) {
    const menuMatch = /^menu-(\d+)$/u.exec(target.id);
    return {
      ...cloneState(state),
      pointer,
      menuIndex: menuMatch ? Number(menuMatch[1]) : state.menuIndex,
    };
  }
  if (state.screen === "playing" && state.pointer.down && state.selection) {
    const cell = cellFromPoint(x, y);
    if (cell && sameCell(state.selection, cell))
      return { ...cloneState(state), pointer, offer: null };
    if (cell && adjacent(state.selection, cell))
      return { ...cloneState(state), pointer, offer: cell };
  }
  return { ...cloneState(state), pointer };
}

function pointerRelease(
  state: DeepReadonly<FacetState>,
  device: PointerDevice,
  audio?: UpdateApi["audio"],
): FacetState {
  const pointer = { ...state.pointer, down: false, device };
  const target = hitTarget(state.screen, state.pointer.x, state.pointer.y);
  if (target && state.armedTarget === target.id) {
    let next =
      target.id === "pause"
        ? applyPause(state)
        : target.id === "back"
          ? applyBack(state)
          : takeConfirm({
              ...state,
              menuIndex: Number(target.id.split("-")[1] ?? state.menuIndex),
            });
    next = { ...next, pointer, armedTarget: null };
    return next;
  }
  if (state.screen === "playing" && state.selection && state.offer) {
    return {
      ...requestSwapCore(
        { ...state, pointer },
        state.selection,
        state.offer,
        audio,
      ),
      pointer,
      armedTarget: null,
    };
  }
  return { ...cloneState(state), pointer, armedTarget: null };
}

function advanceInput(state: FacetState, api: UpdateApi): FacetState {
  let next = state;
  if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
  const items = menuItems(next.screen);
  if (items.length > 0) {
    if (api.input.pressed("up"))
      next = {
        ...next,
        menuIndex: (next.menuIndex + items.length - 1) % items.length,
      };
    if (api.input.pressed("down"))
      next = { ...next, menuIndex: (next.menuIndex + 1) % items.length };
    if (api.input.pressed("confirm")) next = takeConfirm(next);
  }
  if (api.input.pressed("back")) next = applyBack(next);
  if (api.input.pressed("pause")) next = applyPause(next);
  for (const sample of api.input.pointerSamples().filter((s) => s.primary)) {
    if (sample.type === "down")
      next = pointerPress(next, sample.x, sample.y, sample.device, api.audio);
    else if (sample.type === "move")
      next = pointerMove(next, sample.x, sample.y, sample.device);
    else next = pointerRelease(next, sample.device, api.audio);
  }
  const pointer = api.input.pointer();
  return {
    ...next,
    pointer: {
      x: pointer.x,
      y: pointer.y,
      down: pointer.down,
      device: pointer.device,
    },
    muted: api.audio.muted(),
  };
}

function snapshot(state: DeepReadonly<FacetState>): FacetSnapshot {
  return {
    version: FACET_DEBUG_VERSION,
    screen: state.screen,
    menuIndex: state.menuIndex,
    score: state.score,
    level: state.level,
    levelScore: state.levelScore,
    levelTarget: LEVEL_TARGET_STEP * state.level,
    phase: state.phase,
    chainStep: state.chainStep,
    multiplier: Math.min(state.chainStep, MAX_MULTIPLIER),
    swapTimer: state.swapTimer,
    stepTimer: state.stepTimer,
    stepHold: stepHold(state),
    board: {
      cols: state.board.cols,
      rows: state.board.rows,
      cells: state.board.cells.map((gem) => ({
        ...gem,
        x: cellX(gem.col),
        y: cellY(gem.row),
      })),
    },
    selection: state.selection ? { ...state.selection } : null,
    offer: state.offer ? { ...state.offer } : null,
    refusal: state.refusal
      ? { a: { ...state.refusal.a }, b: { ...state.refusal.b } }
      : null,
    lastCleared: state.lastCleared,
    lastPoints: state.lastPoints,
    lastWaves: state.lastWaves,
    lastFall: lastFall(state.board),
    moveScore: state.moveScore,
    bestMove: state.bestMove,
    bestChain: state.bestChain,
    legalSwap: hasLegalSwap(state.board),
    refillKinds: [...state.refillKinds],
    pointer: { ...state.pointer },
    armedTarget: state.armedTarget,
    targets: targetRects(state.screen),
    muted: state.muted,
    simTime: state.simTime,
  };
}

function makeDebug(): FacetDebugApi {
  return {
    version: FACET_DEBUG_VERSION,
    reset: (state) => initialState(state.muted),
    reconcile: (state) => cloneState(state),
    snapshot,
    setScreen: (state, screen) => ({ ...cloneState(state), screen }),
    setMenuIndex: (state, index) => {
      assertWhole(index, "menu index");
      return { ...cloneState(state), menuIndex: index };
    },
    loadBoard: (state, rows) => ({
      ...cloneState(state),
      board: parseBoard(rows),
    }),
    dealBoard: (state) => ({ ...cloneState(state), board: dealOpeningBoard() }),
    clearBoard: (state) => ({ ...cloneState(state), board: EMPTY_BOARD }),
    setGem: (state, col, row, token) =>
      withGem(state.board, tokenToGem(token, col, row)) && {
        ...cloneState(state),
        board: withGem(state.board, tokenToGem(token, col, row)),
      },
    setRefillKinds: (state, col, kinds) => {
      if (
        !Number.isInteger(col) ||
        col < 0 ||
        col >= GRID_COLS ||
        !/^[RACJBSM]*$/u.test(kinds)
      )
        throw new Error("Facet: invalid refill pose");
      const refillKinds = [...state.refillKinds];
      refillKinds[col] = kinds;
      return { ...cloneState(state), refillKinds };
    },
    clearRefillKinds: (state) => ({
      ...cloneState(state),
      refillKinds: Array.from({ length: GRID_COLS }, () => ""),
    }),
    setScore: (state, points) => {
      assertWhole(points, "score");
      return { ...cloneState(state), score: points };
    },
    setLevel: (state, level) => {
      assertWhole(level, "level", 1);
      return { ...cloneState(state), level };
    },
    setLevelScore: (state, points) => {
      assertWhole(points, "level score");
      return { ...cloneState(state), levelScore: points };
    },
    setBestChain: (state, chainStep) => {
      assertWhole(chainStep, "best chain");
      return { ...cloneState(state), bestChain: chainStep };
    },
    setBestMove: (state, points) => {
      assertWhole(points, "best move");
      return { ...cloneState(state), bestMove: points };
    },
    setMoveScore: (state, points) => {
      assertWhole(points, "move score");
      return { ...cloneState(state), moveScore: points };
    },
    setSelection: (state, col, row) => {
      assertCell(col, row);
      return { ...cloneState(state), selection: { col, row } };
    },
    clearSelection: (state) => ({ ...cloneState(state), selection: null }),
    setOffer: (state, col, row) => {
      assertCell(col, row);
      return { ...cloneState(state), offer: { col, row } };
    },
    clearOffer: (state) => ({ ...cloneState(state), offer: null }),
    clearRefusal: (state) => ({ ...cloneState(state), refusal: null }),
    clearChain: (state) => ({
      ...cloneState(state),
      phase: "idle",
      chainStep: 0,
      swapTimer: 0,
      stepTimer: 0,
    }),
    requestSwap: (state, colA, rowA, colB, rowB) =>
      requestSwapCore(
        state,
        { col: colA, row: rowA },
        { col: colB, row: rowB },
      ),
    pointerDown: (state, x, y, device = "mouse") =>
      pointerPress(state, x, y, device),
    pointerMove: (state, x, y, device = "mouse") =>
      pointerMove(state, x, y, device),
    pointerUp: (state, device = "mouse") => pointerRelease(state, device),
  };
}

async function loadImage(
  api: InitApi<FacetState>,
  key: string,
  path: string,
): Promise<void> {
  try {
    images.set(key, await api.assets.loadImage(path));
  } catch {
    // Tests may initialize without a browser asset server; rendering degrades to code chrome only there.
  }
}

function registerDiagnostics(api: InitApi<FacetState>): void {
  const d = api.diagnostics;
  d.register("screen", (s) => s.screen);
  d.register("phase", (s) => s.phase);
  d.register("board", (s) => `${s.board.cols}x${s.board.rows}`);
  d.register("score", (s) => s.score);
  d.register("level", (s) => s.level);
  d.register(
    "levelScore",
    (s) => `${s.levelScore}/${LEVEL_TARGET_STEP * s.level}`,
  );
  d.register(
    "chain",
    (s) => `${s.chainStep} x${Math.min(s.chainStep, MAX_MULTIPLIER)}`,
  );
  d.register("cleared", (s) => s.lastCleared);
  d.register("points", (s) => s.lastPoints);
  d.register("waves", (s) => s.lastWaves);
  d.register("fall", (s) => lastFall(s.board));
  d.register("selection", (s) =>
    s.selection ? `${s.selection.col},${s.selection.row}` : "none",
  );
  d.register("offer", (s) =>
    s.offer ? `${s.offer.col},${s.offer.row}` : "none",
  );
  d.register("bestMove", (s) => s.bestMove);
  d.register("bestChain", (s) => s.bestChain);
  d.register("legalSwap", (s) => hasLegalSwap(s.board));
  d.register(
    "pointer",
    (s) =>
      `${s.pointer.device} ${s.pointer.x.toFixed(0)},${s.pointer.y.toFixed(0)}`,
  );
}

async function initializeAssets(api: InitApi<FacetState>): Promise<void> {
  for (const action of ACTIONS)
    api.input.register(action, { keys: [...BINDINGS[action]] });
  for (const cue of Object.values(CUES))
    api.audio.define(cue, { freq: 440, durationMs: 80, gain: 0.01 });
  api.audio.define("shatter", { freq: 90, durationMs: 180, gain: 0.01 });
  for (let i = 1; i <= MAX_MULTIPLIER; i += 1)
    api.audio.define(`chain-${i}`, {
      freq: 220 + i * 70,
      durationMs: 120,
      gain: 0.01,
    });
  await Promise.allSettled([
    ...GEM_ASSET_KEYS.map((key) =>
      loadImage(
        api,
        key,
        key === "board-frame" ? "gems/board-frame.png" : `gems/${key}.png`,
      ),
    ),
    ...GEM_KINDS.flatMap((kind) =>
      range(0, BREAK_FRAMES).map((f) =>
        loadImage(
          api,
          `break-${kind}-${f}`,
          `gems/break/${kind}/${String(f).padStart(2, "0")}.png`,
        ),
      ),
    ),
    ...range(0, PRISM_FRAMES).map((f) =>
      loadImage(
        api,
        `prism-turn-${f}`,
        `gems/prism-turn/${String(f).padStart(2, "0")}.png`,
      ),
    ),
    ...Object.entries({
      [CUES.select]: "audio/select.wav",
      [CUES.swap]: "audio/swap.wav",
      [CUES.refuse]: "audio/refuse.wav",
      [CUES.land]: "audio/land.wav",
      [CUES.flaw]: "audio/flaw.wav",
      [CUES.cut]: "audio/cut.wav",
      [CUES.levelUp]: "audio/levelup.wav",
      [CUES.gameOver]: "audio/gameover.wav",
      shatter: "audio/shatter.wav",
      title: "audio/title-theme.wav",
      play: "audio/play-bed.wav",
    }).map(([cue, path]) => api.audio.load(cue, path).catch(() => undefined)),
    ...range(1, MAX_MULTIPLIER + 1).map((i) =>
      api.audio
        .load(`chain-${i}`, `audio/chain-${i}.wav`)
        .catch(() => undefined),
    ),
    ...["clear-burst", "flawed-detonation", "cut-flash", "cut-aura"].map(
      (name) =>
        api.assets.load(`fx/${name}.system.json`).catch(() => undefined),
    ),
  ]);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  align: CanvasTextAlign = "left",
  color = "#eaf8ff",
): void {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px system-ui, Segoe UI, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  target: TargetRect,
  label: string,
  active: boolean,
): void {
  ctx.fillStyle = active ? "#d9f6ff" : "#10243b";
  ctx.strokeStyle = active ? "#ffffff" : "#4d7595";
  ctx.lineWidth = 2;
  ctx.fillRect(target.x, target.y, target.w, target.h);
  ctx.strokeRect(target.x, target.y, target.w, target.h);
  drawText(
    ctx,
    label,
    target.x + target.w / 2,
    target.y + target.h / 2,
    25,
    "center",
    active ? "#07111f" : "#eaf8ff",
  );
}

function gemDrawPosition(
  state: DeepReadonly<FacetState>,
  gem: GemState,
): { x: number; y: number } {
  const x = cellX(gem.col);
  let y = cellY(gem.row);
  if (state.phase === "resolving") {
    const shatterEnd = state.lastWaves * WAVE_SECONDS;
    const fallSpan = gem.fell * FALL_SECONDS_PER_ROW;
    if (state.stepTimer >= shatterEnd && fallSpan > 0) {
      const t = Math.min(1, (state.stepTimer - shatterEnd) / fallSpan);
      y -= (1 - easeOut(t)) * gem.fell * CELL_PITCH;
    }
  }
  if (state.phase === "idle" && gem.fell > 0 && state.simTime < 2) {
    const t = Math.min(
      1,
      state.simTime / Math.max(0.2, gem.fell * FALL_SECONDS_PER_ROW),
    );
    y -= (1 - easeOut(t)) * gem.fell * CELL_PITCH;
  }
  return { x, y };
}

function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

function drawBoard(
  state: DeepReadonly<FacetState>,
  ctx: CanvasRenderingContext2D,
  quiet = false,
): void {
  ctx.save();
  if (quiet) ctx.globalAlpha = 0.38;
  ctx.fillStyle = "#0a1728";
  ctx.fillRect(300, 56, 680, 648);
  const frame = images.get("board-frame");
  if (frame) ctx.drawImage(frame, 280, 36, 720, 720);
  else {
    ctx.strokeStyle = "#d9f6ff";
    ctx.strokeRect(352, 108, 576, 576);
  }
  for (const gem of state.board.cells) drawGem(state, ctx, { ...gem });
  if (state.selection) markCell(ctx, state.selection, "#eaf8ff", 4);
  if (state.offer) markCell(ctx, state.offer, "#ffdc7a", 4);
  if (state.refusal) {
    markCell(ctx, state.refusal.a, "#ff5370", 5);
    markCell(ctx, state.refusal.b, "#ff5370", 5);
  }
  ctx.restore();
}

function offeredGem(state: DeepReadonly<FacetState>, gem: GemState): GemState {
  if (state.offer && state.selection) {
    if (sameCell(gem, state.selection))
      return { ...gem, col: state.offer.col, row: state.offer.row };
    if (sameCell(gem, state.offer))
      return { ...gem, col: state.selection.col, row: state.selection.row };
  }
  return gem;
}

function swappedMotionGem(
  state: DeepReadonly<FacetState>,
  gem: GemState,
): { x: number; y: number } | null {
  if (state.phase !== "swapping") return null;
  const t = Math.min(1, state.swapTimer / SWAP_SECONDS);
  const eased = easeOut(t);
  return {
    x: cellX(gem.col),
    y: cellY(gem.row) + Math.sin(eased * Math.PI) * -8,
  };
}

function drawGem(
  state: DeepReadonly<FacetState>,
  ctx: CanvasRenderingContext2D,
  original: GemState,
): void {
  const gem = offeredGem(state, original);
  const moving = swappedMotionGem(state, gem);
  const pos = moving ?? gemDrawPosition(state, gem);
  const prismFrame =
    gem.cut === "prism"
      ? images.get(
          `prism-turn-${Math.floor(state.simTime * 12) % PRISM_FRAMES}`,
        )
      : null;
  const base =
    prismFrame ??
    images.get(
      gem.cut === "prism" ? `prism-${gem.strain}` : `${gem.kind}-${gem.strain}`,
    );
  ctx.imageSmoothingEnabled = false;
  if (base) ctx.drawImage(base, pos.x - 32, pos.y - 32, 64, 64);
  else {
    ctx.fillStyle = gem.kind ? "#78d7ff" : "#ffffff";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, GEM_R, 0, Math.PI * 2);
    ctx.fill();
  }
  if (gem.cut === "brilliant" || gem.cut === "star") {
    const overlay = images.get(gem.cut);
    if (overlay) ctx.drawImage(overlay, pos.x - 32, pos.y - 32, 64, 64);
  }
  if (gem.cut !== "plain") {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "rgba(160, 245, 255, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 32 + Math.sin(state.simTime * 5) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function markCell(
  ctx: CanvasRenderingContext2D,
  cell: CellRef,
  color: string,
  width: number,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.strokeRect(cellX(cell.col) - 36, cellY(cell.row) - 36, 72, 72);
}

function drawHud(
  state: DeepReadonly<FacetState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawText(ctx, HUD_SCORE_LABEL, 64, 50, 20, "left", "#91b7cc");
  drawText(ctx, String(state.score), 64, 84, 34);
  drawText(ctx, HUD_LEVEL_LABEL, 258, 50, 20, "left", "#91b7cc");
  drawText(ctx, String(state.level), 258, 84, 34);
  ctx.fillStyle = "#112a43";
  ctx.fillRect(452, 54, 376, 22);
  ctx.fillStyle = "#62e6be";
  ctx.fillRect(
    452,
    54,
    376 * Math.min(1, state.levelScore / (LEVEL_TARGET_STEP * state.level)),
    22,
  );
  ctx.strokeStyle = "#d9f6ff";
  ctx.strokeRect(452, 54, 376, 22);
  if (state.phase === "resolving") {
    drawText(ctx, HUD_CHAIN_LABEL, 930, 50, 20, "left", "#91b7cc");
    drawText(
      ctx,
      `x${Math.min(state.chainStep, MAX_MULTIPLIER)}`,
      930,
      84,
      36,
      "left",
      "#ffdc7a",
    );
  }
  const pause = targetRects("playing")[0];
  if (pause) drawButton(ctx, pause, PAUSE_LABEL, false);
}

function drawEffects(ctx: CanvasRenderingContext2D, dt: number): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const fx of visualEffects) {
    fx.t += dt;
    const life = fx.kind === "clear" ? 0.55 : 0.8;
    const p = Math.min(1, fx.t / life);
    const n = fx.kind === "clear" ? 12 : 22;
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2 + fx.id;
      const r = p * (fx.kind === "clear" ? 44 : 70) * (0.7 + (i % 3) * 0.15);
      ctx.fillStyle = `rgba(${fx.kind === "clear" ? "137,247,255" : "255,83,112"},${1 - p})`;
      ctx.beginPath();
      ctx.arc(
        fx.x + Math.cos(a) * r,
        fx.y + Math.sin(a) * r,
        (1 - p) * 4 + 1,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  ctx.restore();
  for (let i = visualEffects.length - 1; i >= 0; i -= 1)
    if (visualEffects[i].t > 0.9) visualEffects.splice(i, 1);
}

function drawMenu(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<FacetState>,
  title: string,
  items: readonly string[],
  subtitle = "",
): void {
  drawText(ctx, title, STAGE_CX, 184, 74, "center", "#ffffff");
  if (subtitle) drawText(ctx, subtitle, STAGE_CX, 252, 24, "center", "#9bd0e4");
  const targets = targetRects(state.screen);
  items.forEach((item, i) => {
    const target = targets.find((t) => t.id === `menu-${i}`);
    if (target) drawButton(ctx, target, item, i === state.menuIndex);
  });
}

function drawHowTo(ctx: CanvasRenderingContext2D): void {
  drawText(ctx, "HOW TO PLAY", STAGE_CX, 86, 46, "center");
  const lines = [
    "Take hold of a gem, carry it onto a neighbor, and let go to swap.",
    "Three or more matching kinds shatter. Empty swaps are refused.",
    "Clears strain nearby stones; flawed stones break with a touching clear and score double.",
    "Four makes a brilliant, five makes a prism, and crossed runs make a star.",
    "Brilliants burst around themselves, stars take row and column, and prisms harvest a kind.",
    "Falling gems can chain again. Later chain steps climb the multiplier.",
    "Reach the level target to continue. A round ends when no scoring swap remains.",
    "Pointer plays the board. Menus use pointer, arrows, Enter, Space, Esc/P, and M for mute.",
  ];
  ctx.fillStyle = "#dcefff";
  ctx.font = "24px system-ui, Segoe UI, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  lines.forEach((line, i) => ctx.fillText(line, 210, 160 + i * 48));
  const back = targetRects("howto")[0];
  if (back) drawButton(ctx, back, BACK_LABEL, false);
}

function drawScreen(
  state: DeepReadonly<FacetState>,
  ctx: CanvasRenderingContext2D,
): void {
  if (state.screen === "title")
    drawMenu(ctx, state, TITLE_TEXT, TITLE_ITEMS, TAGLINE_TEXT);
  if (state.screen === "howto") drawHowTo(ctx);
  if (state.screen === "paused")
    drawMenu(ctx, state, PAUSED_TITLE_TEXT, PAUSED_ITEMS);
  if (state.screen === "levelclear") {
    drawMenu(
      ctx,
      state,
      LEVELCLEAR_TITLE_TEXT,
      LEVELCLEAR_ITEMS,
      `LEVEL ${state.level}  •  ${BEST_CHAIN_LABEL}: ${state.bestChain}  •  ${BEST_MOVE_LABEL}: ${state.bestMove}`,
    );
  }
  if (state.screen === "gameover")
    drawMenu(
      ctx,
      state,
      GAMEOVER_TITLE_TEXT,
      GAMEOVER_ITEMS,
      `SCORE ${state.score}  •  LEVEL ${state.level}`,
    );
}

export const game: Game<FacetState, FacetDebugApi> = {
  async initialize(
    api: InitApi<FacetState>,
  ): Promise<[FacetState, FacetDebugApi]> {
    await initializeAssets(api);
    registerDiagnostics(api);
    return [initialState(false), makeDebug()];
  },

  update(
    state: DeepReadonly<FacetState>,
    api: UpdateApi,
    dt: number,
  ): FacetState {
    let next: FacetState = {
      ...cloneState(state),
      simTime: state.simTime + dt,
    };
    next = advanceInput(next, api);
    if (next.screen === "playing")
      next = updateBoardTimers(next, dt, api.audio);
    if (
      (next.screen === "title" || next.screen === "howto") &&
      !api.audio.looping("title")
    )
      api.audio.loop("title");
    if (
      next.screen !== "title" &&
      next.screen !== "howto" &&
      api.audio.looping("title")
    )
      api.audio.stop("title");
    if (!["title", "howto"].includes(next.screen) && !api.audio.looping("play"))
      api.audio.loop("play");
    if (["title", "howto"].includes(next.screen) && api.audio.looping("play"))
      api.audio.stop("play");
    return { ...next, muted: api.audio.muted() };
  },

  render(state: DeepReadonly<FacetState>, api: RenderApi): void {
    const ctx = api.ctx;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    ctx.fillStyle = "#0c1b2c";
    for (let i = 0; i < 80; i += 1) {
      const x = (i * 157 + Math.sin(state.simTime * 0.2 + i) * 18) % STAGE_W;
      const y = (i * 89) % STAGE_H;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.globalAlpha = 1;
    if (
      state.board.cells.length > 0 &&
      state.screen !== "title" &&
      state.screen !== "howto"
    )
      drawBoard(state, ctx, state.screen !== "playing");
    if (state.screen === "playing") {
      drawBoard(state, ctx);
      drawHud(state, ctx);
    }
    drawEffects(ctx, 1 / 60);
    if (state.screen !== "playing") drawScreen(state, ctx);
  },
};
