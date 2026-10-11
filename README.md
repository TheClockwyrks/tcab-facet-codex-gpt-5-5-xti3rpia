# Facet

Facet is a browser gem-matching puzzle about pressure. Swap neighboring gems to
make lines of three or more, then watch the clear strain the stones around it.
Enough strain flaws a gem; flawed gems shatter when a clear touches them and
score double, turning a careful swap into a longer chain.

Runs of four create brilliant gems, runs of five or more create prisms, and
crossed runs create stars. Those cut stones are animated and dangerous:
brilliants clear the surrounding ring, stars clear their row and column, and a
prism swapped with a gem clears every gem of that kind.

The game runs entirely in the browser on the Simple 2D engine. Its sprites,
break animations, particle-system files, sound effects, and music are committed
under `public/assets/`, so production builds do not need any external generator
tools.

## Install

```sh
npm ci
```

## Run In Development

```sh
npm run dev
```

Vite prints the local URL. Open it in a browser and play from the title screen.

## Build

```sh
npm run build
```

The complete static site is written to `dist/`. You can serve it with:

```sh
npm run preview
```

## Controls

Use a mouse, pen, or finger to play the board. Press a gem, move onto an
orthogonally adjacent neighbor, and release to request the swap. Carrying back
to the original cell withdraws the offer.

Menus work with the pointer and keyboard:

- `ArrowUp` / `ArrowDown`: move the menu highlight
- `Enter` / `Space`: confirm
- `Escape` / `P`: pause or resume during play
- `Escape`: back out of How To Play and Game Over
- `M`: mute

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```
