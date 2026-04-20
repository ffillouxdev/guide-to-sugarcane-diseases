# Architecture Overview

D-CAS 2.0 is a client-side, framework-free single-page application built with TypeScript, Vite, and Tailwind CSS. This document describes how the system is organized and how its key features work.

## Directory Structure

```
src/
├── main.ts              # Entry point: initializes router & offline support
├── router.ts            # Client-side router & route definitions
├── layout.ts            # Header component & shared layout utilities
├── style.css            # Tailwind directives
├── i18n.ts              # Translation resources (EN/FR/ES) & language detection
│
├── views/               # Page-level components (return HTML strings)
│   ├── home.ts          # Interactive questionnaire
│   ├── catalog.ts       # Disease list with search & sorting
│   ├── privacy.ts       # Privacy policy
│   └── legal.ts         # Legal notice & copyright
│
├── components/          # Reusable UI pieces (return HTML strings)
│   ├── header.ts        # Navigation, language selector, offline toggle
│   ├── questionnaire.ts # Question tree navigation & disease results
│   ├── disease_result.ts # Disease detail view with carousel
│   ├── call_to_action.ts # CTA for sugarcane diseases book
│   ├── breadcrumb.ts    # Navigation breadcrumb
│   └── question_button.ts # Styled question button
│
├── data/
│   └── key-loader.ts    # Loads & caches disease JSON from public/datas/
│
└── vite-env.d.ts        # Vite type definitions
```

## Routing

**Client-side router** in `router.ts` with three-language URL aliases:

```ts
const routes: Route[] = [
  { path: '/',                titleKey: 'home.title',      view: homeView },
  { path: '/catalogue',       titleKey: 'catalogue.title', view: catalogueView },
  { path: '/catalog',         titleKey: 'catalogue.title', view: catalogueView },
  { path: '/catalogo',        titleKey: 'catalogue.title', view: catalogueView },
  // ... etc for privacy, legal
]
```

**Navigation flow:**
1. User clicks an internal `<a>` tag.
2. Router intercepts the click, prevents default, calls `navigateTo()`.
3. `navigateTo()` pushes state to history and re-renders the app.
4. `window.popstate` listener handles back/forward buttons.

No framework: views are plain functions returning HTML strings that are injected via `app.innerHTML = view()`.

**Route initialization:**
- Home page → calls `initQuestionnaire()` to set up event listeners.
- Catalog page → calls `initCatalogue()` to load disease data and bind search/sort handlers.

## Internationalization (i18n)

**Language detection** in `i18n.ts`:
1. Browser's language detector (`i18next-browser-languagedetector`) reads `navigator.language`.
2. Falls back to English if user's language is not supported.

**Translation resources:**
- Single object with three languages (EN, FR, ES).
- Nested keys: `t('catalogue.diseaseNameColumn')`.
- All visible text must be added here — never hardcoded in views.

**Changing language:**
- User selects from dropdown in header.
- `i18next.changeLanguage()` updates the language.
- Page re-renders with new translations.
- Service Worker is notified to precache the selected language's image assets.

**URL paths are localized:**
```
/catalogue  (English)
/catalogo   (Spanish)
/catalogue  (French, same as English by convention)
```

The header component (`header.ts`) maps these paths based on current language via `lp(key)` helper.

## Data Loading & Caching

**Disease data** is loaded from JSON files in `public/datas/`:

```
identification-key.json       (English)
cle-identification.json       (French)
clave-de-identificacion.json  (Spanish)
diseases-img/                 (Disease photographs)
```

**Key loader** (`data/key-loader.ts`):
- Single fetch per session (cached in memory).
- If a translated key file is empty, falls back to English.
- Used by both questionnaire and catalog views.

## Offline Support (Service Worker)

**Service Worker** in `public/sw.js` implements a cache-first strategy:

1. **App shell** (HTML, CSS, JS) — cached at install time.
2. **Identification keys** — cached at install time (all three languages).
3. **Disease images** — lazy-loaded and cached on-demand via `precacheImages()`.
4. **Cache busting** — `CACHE_NAME = 'dcas-v3'` is updated when cache strategy changes. Old caches are deleted on activation.

**Image precaching:**
- When user selects a language, Service Worker is sent a message.
- SW fetches and caches images for that language's disease set.
- Progress is reported back and displayed to the user ("Downloading 45/120").

**User can toggle offline mode** via header switch (`offline-toggle`). This controls whether SW is registered.

## Component Patterns

All views and components follow the same pattern:

```ts
export function myComponent(): string {
  const t = i18next.t.bind(i18next)
  
  return /*html*/`
    <div class="...">
      ${t('my.key')}
    </div>
  `
}

export function initMyComponent(): void {
  // Set up event listeners
  document.querySelector('.my-class')?.addEventListener('click', ...)
}
```

**Why this pattern?**
- No JSX, no virtual DOM, no build complexity.
- Easy to modify styling (Tailwind utilities in the HTML template).
- Event listeners bound explicitly (no magic).
- Type-safe (TypeScript strict mode).

## Adding a New Page

1. **Create view** in `src/views/mypage.ts`:
   ```ts
   export function myPageView(): string { return `...` }
   export function initMyPage(): void { /* listeners */ }
   ```

2. **Add translations** to `src/i18n.ts` (EN, FR, ES).

3. **Register route** in `src/router.ts`:
   ```ts
   { path: '/mypage', titleKey: 'mypage.title', view: myPageView }
   ```

4. **Add navigation link** in `src/components/header.ts` (if needed).

5. **Call init function** in `src/router.ts` `render()`:
   ```ts
   if (route.path === '/mypage') initMyPage()
   ```

## Key Technical Decisions

| Decision | Rationale |
| -------- | --------- |
| No framework | Minimal bundle, easy to modify, direct DOM control |
| TypeScript strict | Catch errors at build time, no `any` escapes |
| Tailwind CSS | Responsive design, utility-first, zero unused CSS |
| Service Worker | Full offline support for field use |
| i18next | Standard i18n library, easy to add languages |
| String HTML templates | No build step for views, fast iteration |
| Client-side router | No backend needed, static hosting compatible |

## Performance Considerations

- **Initial load** — ~200KB gzipped (Vite optimizes JS, Tailwind purges unused classes).
- **Disease images** — Downloaded on-demand by Service Worker, cached for offline use.
- **Catalog search** — Linear scan of disease list (fast enough for <200 diseases).
- **Mobile landscape** — Special height handling (`max-md:landscape:h-[200vh]`) to prevent table clipping.

## Confidential Assets

`public/datas/` is **gitignored** and must be provided by CIRAD. Without it:
- Questionnaire loads empty data (shows "Downloading...").
- Catalog shows empty list.
- Images are not available.

The app degrades gracefully; it doesn't crash.

---

**Last updated:** April 2026  
**Maintained by:** [ffillouxdev](https://github.com/ffillouxdev)
