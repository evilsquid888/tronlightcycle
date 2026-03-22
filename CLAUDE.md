# CLAUDE.md

## Project Overview

Tron Light Cycle is a single-player Electron desktop game written in TypeScript. The player controls a light cycle and races against 3-5 AI opponents across 5 rounds of increasing difficulty. The game renders on an HTML5 canvas with a retro cyberpunk aesthetic.

## Tech Stack

- **Runtime:** Electron 28
- **Language:** TypeScript 5.3 (strict mode, ES2020 target)
- **Bundler:** esbuild (renderer) + tsc (main process)
- **Test Framework:** Jest 29 with ts-jest
- **Platform:** Desktop (Electron); best supported on native Windows

## Build & Run Commands

```bash
npm install          # Install dependencies
npm run build        # Compile main process (tsc) + bundle renderer (esbuild)
npm start            # Launch the Electron app (requires prior build)
npm run dev          # Build then start in one step
npm run watch        # Watch mode — rebuilds renderer on file changes
```

## Test Commands

```bash
npm test             # Run all tests (63 tests expected to pass)
npm run test:watch   # Run tests in watch mode
```

Tests live alongside source files as `*.test.ts` files. Jest is configured with `ts-jest` preset and runs in a Node environment. Coverage excludes `main.ts` and `renderer.ts`.

## Repository Structure

```
src/
  main.ts              # Electron main process entry point
  renderer.ts          # Canvas renderer, input handling, game loop (browser bundle)
  types.ts             # Shared type definitions (Cycle, Direction, GameState, etc.)
  ui.test.ts           # UI-related tests
  ai/
    aiController.ts    # AI opponent logic (Defensive/Balanced/Aggressive strategies)
    aiController.test.ts
  game/
    gameEngine.ts      # Core game engine (state management, round progression)
    gameEngine.test.ts
  utils/
    collision.ts       # Collision detection (walls, trails, self-collision)
    collision.test.ts
assets/                # Game images (cycle sprites, arena background, explosion)
index.html             # Single-page HTML shell with inline CSS
build.js               # esbuild config for bundling renderer.ts
```

## Architecture Notes

- **Two-process model:** `main.ts` runs in Electron's main process (compiled via `tsc -p tsconfig.main.json`). `renderer.ts` is bundled by esbuild into `dist/renderer.js` and loaded by `index.html` in the renderer process.
- **Game loop:** The renderer drives a 60 FPS game loop on the canvas, managing state transitions (MENU, PLAYING, PAUSED, ROUND_OVER, GAME_OVER).
- **AI strategies:** Three AI behavior profiles — Defensive, Balanced, and Aggressive — implemented in `aiController.ts`.
- **Image rendering:** Custom cycle and arena images load from `assets/images/`. A `USE_IMAGES` flag in `renderer.ts` toggles between image rendering and colored geometric shape fallback.
- **Type system:** Core game types are centralized in `types.ts` — `Cycle`, `Position`, `Direction`, `GameState`, `GameConfig`, and `Trail`.

## Coding Conventions

- Strict TypeScript (`strict: true`) with CommonJS modules.
- Test files are co-located with source files using the `*.test.ts` naming pattern.
- No linter or formatter is configured in the project.
- Output goes to the `dist/` directory (git-ignored).
- The default branch is `master`.
