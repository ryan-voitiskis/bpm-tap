# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Type-check + production build
npm run type-check   # TypeScript check only (vue-tsc --build --force)
npm run lint         # ESLint with autofix
npm run format       # Prettier (src/ only)
npm run preview      # Preview production build
```

## Architecture

Minimal Vue 3 PWA for tapping out song tempo.

**Stack:** Vue 3 (Composition API) + TypeScript + Vite + SCSS + vite-plugin-pwa

**Structure:**
- `src/App.vue` - Main component: tap button, BPM calculation, color interpolation
- `src/components/LockButton.vue` - Toggle to lock last BPM reading
- `src/main.ts` - App entry point
- `src/main.css` - Global styles, Sono font
- `vite.config.ts` - Vite + PWA manifest config

**BPM Logic:** Tracks tap timestamps, calculates average interval, resets after 2s inactivity. Color gradient (80-170 BPM range) uses `d3-interpolate` cubehelix.

**PWA:** Auto-updating service worker via vite-plugin-pwa. Icons in `public/`.

## Conventions

- Use `@/` alias for src imports
- Prettier: no semicolons
- Conventional Commits for semantic-release (feat/fix trigger releases)
- ESLint flat config with Vue + TypeScript
