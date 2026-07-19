# BPM Tap

A tiny, installable web app for tapping out a song's tempo.

[Open BPM Tap](https://bpm-tap-0.netlify.app/)

## Features

- Tap, click, or press Space to measure BPM
- Save and lock the previous reading
- Responsive colour feedback
- Offline-capable PWA for mobile and desktop

## Development

Requires Node.js 20.19 or newer.

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm run type-check
npm run build
```

Run `npm run format` to format `src/`.

## Stack

Vue 3, TypeScript, Vite, CSS, and `vite-plugin-pwa`.

## License

[MIT](LICENSE). Bundled third-party assets retain their original licenses in
`public/licenses/`.
