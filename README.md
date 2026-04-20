# D-CAS 2.0 — A Guide to Sugarcane Diseases

> Offline-first Progressive Web App for identifying sugarcane diseases, built for [CIRAD](https://www.cirad.fr/).

D-CAS 2.0 (*Détermination et Catalogue des Affections de la canne à Sucre*) is a trilingual (EN / FR / ES) field tool that helps agronomists and growers identify sugarcane diseases through a guided questionnaire or a searchable catalog of referenced pathologies.

## Features

- **Guided diagnosis** — Answer a few questions about observed symptoms to narrow down possible diseases.
- **Disease catalog** — Browse, search and sort all referenced diseases with their pathogens, symptoms, images and geographical distribution.
- **Fully offline** — Once loaded, the app works without connectivity thanks to a Service Worker that caches the identification key and disease images.
- **Trilingual** — Interface and content available in English, French and Spanish, with per-language disease trees.
- **Mobile-friendly** — Responsive layout optimized for both portrait and landscape phone usage in the field.

## Tech Stack

| Concern        | Choice                                                    |
| -------------- | --------------------------------------------------------- |
| Language       | TypeScript (strict mode)                                  |
| Bundler        | [Vite 5](https://vitejs.dev/)                             |
| Styling        | [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS      |
| i18n           | [i18next](https://www.i18next.com/) + browser detector    |
| Routing        | Custom client-side router (`src/router.ts`)               |
| Offline        | Native Service Worker (`public/sw.js`)                    |
| Framework      | None — vanilla DOM manipulation                           |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone git@github.com:ffillouxdev/D-CAS-2.0.git
cd D-CAS-2.0
npm install
```

### Development

```bash
npm run dev
```

The dev server starts on [http://localhost:5173](http://localhost:5173).

### Production build

```bash
npm run build     # Type-check with tsc, then bundle to dist/
npm run preview   # Preview the production build locally
```

## Project Structure

```
D-CAS-2.0/
├── public/
│   ├── assets/                # Static images (logos, backgrounds, CTA)
│   ├── datas/                 # Identification keys + disease images (gitignored)
│   └── sw.js                  # Service Worker
├── src/
│   ├── components/            # Reusable UI pieces (header, questionnaire, ...)
│   ├── data/                  # Data loaders (key-loader.ts)
│   ├── views/                 # Page-level views (home, catalog, privacy, legal)
│   ├── i18n.ts                # Translation resources & language detection
│   ├── layout.ts              # Shared layout exports
│   ├── router.ts              # Client-side router
│   ├── main.ts                # Entry point
│   └── style.css              # Tailwind directives
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Confidential Assets

The `public/datas/` folder is **gitignored** and must be provided separately by CIRAD. It contains:

- `identification-key.json` — English disease tree (primary source)
- `cle-identification.json` — French disease tree
- `clave-de-identificacion.json` — Spanish disease tree
- `diseases-img/` — Disease photographs (confidential, CIRAD property)

The loader (`src/data/key-loader.ts`) falls back to the English key when a translated key is empty.

## Browser Support

Modern evergreen browsers (Chromium ≥ 100, Firefox ≥ 100, Safari ≥ 15). Service Worker support is required for offline functionality.

## Credits

Based on the book *A Guide to Sugarcane Diseases*, edited by Philippe Rott, Jean-Claude Girard and Jean Heinrich Daugrois, published by [Éditions Quæ](https://www.quae.com/produit/78/9782876143869/a-guide-to-sugarcane-diseases).

## License

Proprietary — © CIRAD. All rights reserved. Disease content and images are the property of CIRAD and contributing photographers.

## Author

Developed by **[ffillouxdev](https://github.com/ffillouxdev)** for CIRAD.

## Related Documents

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guidelines
- [CHANGELOG.md](./CHANGELOG.md) — Release history
