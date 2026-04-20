# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A web-based guide to sugarcane diseases, built for CIRAD. Early-stage development.

## Commands

```bash
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Type-check (tsc) then build to dist/
npm run preview   # Preview production build locally
```

There is no test runner or linter configured.

## Stack

- **TypeScript** (strict mode) — no framework, vanilla DOM manipulation
- **Vite 5** — bundler and dev server
- **Tailwind CSS 4** — loaded via browser Play CDN (`@tailwindcss/browser@4` in `index.html`), not installed as an npm package

## Architecture

The app has a single entry point: `src/main.ts` injects HTML into `#app` in `index.html`. All UI is currently built by setting `.innerHTML` directly.

Tailwind classes work in any file because the Play CDN scans the DOM at runtime — no build step or config file is needed for styles.

TypeScript is compiled with `noEmit: true` (type-checking only); Vite handles the actual transpilation via `moduleResolution: "Bundler"`.

## Internationalization

The app supports English, French, and Spanish via i18n. **Always add text translations** to `src/i18n.ts` whenever you add visible text to the UI — do not hardcode text in components.

## Confidential assets

`public/datas/` is gitignored (entire folder). It contains:
- `identification-key.json` — the disease tree (EN, used by the app; FR/ES JSONs are empty placeholders, code falls back to EN via `key-loader.ts`)
- `diseases-img/` — disease photos (confidential, provided by CIRAD). Referenced from `identification-key.json` via `/datas/diseases-img/<filename>` paths. Never commit or push this folder.

## Git

All commit messages must be in English.

Always push to `origin claude` branch only, unless explicitly asked to push elsewhere.

Do not add `Co-Authored-By` trailers to commit messages.
