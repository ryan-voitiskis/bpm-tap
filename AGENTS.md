# Repository guide

BPM Tap is a small Vue 3 Vapor PWA for measuring tempo. Keep changes focused,
accessible, and dependency-light.

## Commands

- `npm ci` — install dependencies
- `npm run dev` — start Vite
- `npm run type-check` — check TypeScript
- `npm run lint` — check lint rules
- `npm run lint:fix` — fix lint issues
- `npm run format` — format `src/`
- `npm run build` — type-check and build for production

## Code map

- `src/App.vue` — tap timing, BPM state, and main UI
- `src/components/LockButton.vue` — saved-tempo lock control
- `src/main.css` — global styles and font
- `vite.config.ts` — Vite aliases and PWA configuration

## Conventions

- Use Vue Composition API, TypeScript, and Vapor-mode components.
- Prefer `@/` imports for files under `src/`.
- Follow Prettier's no-semicolon style.
- Preserve keyboard, touch, and screen-reader support.
- Use Conventional Commits.
- Before handoff, run `npm run lint` and `npm run build`.
