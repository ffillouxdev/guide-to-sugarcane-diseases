// Language-aware routing model shared by the runtime router (router.ts),
// the header (header.ts) and the build-time prerenderer (scripts/prerender.mjs).
//
// URL scheme: English at the root, French under /fr/, Spanish under /es/.
// Each page has a localized slug per language so URLs stay meaningful, e.g.
//   EN /catalog   FR /fr/catalogue   ES /es/catalogo
// This file is pure data + helpers — no browser or i18next imports — so it can
// run unchanged in Node during prerendering.

export const LANGS = ['en', 'fr', 'es'] as const
export type Lang = (typeof LANGS)[number]

export type PageKey = 'home' | 'catalogue' | 'about' | 'privacy' | 'legal'

export interface PageMeta {
  key: PageKey
  titleKey: string
  descKey: string
  /** Path AFTER the language prefix; empty string for the home page. */
  slug: Record<Lang, string>
}

export const SITE_ORIGIN = 'https://canedr.cirad.fr'
export const OG_LOCALES: Record<Lang, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' }

export const PAGES: PageMeta[] = [
  { key: 'home',      titleKey: 'seo.titleHome',   descKey: 'seo.descHome',      slug: { en: '',         fr: '',                  es: '' } },
  { key: 'catalogue', titleKey: 'catalogue.title', descKey: 'seo.descCatalogue', slug: { en: '/catalog', fr: '/catalogue',        es: '/catalogo' } },
  { key: 'about',     titleKey: 'about.title',     descKey: 'seo.descAbout',     slug: { en: '/about',   fr: '/a-propos',         es: '/acerca-de' } },
  { key: 'privacy',   titleKey: 'privacy.title',   descKey: 'seo.descPrivacy',   slug: { en: '/privacy', fr: '/confidentialite',  es: '/privacidad' } },
  { key: 'legal',     titleKey: 'legal.title',     descKey: 'seo.descLegal',     slug: { en: '/legal',   fr: '/mentions-legales', es: '/aviso-legal' } },
]

export function pageByKey(key: PageKey): PageMeta {
  const page = PAGES.find((p) => p.key === key)
  if (!page) throw new Error(`Unknown page key: ${key}`)
  return page
}

/** Language carried by a pathname's prefix ('/fr/...' -> 'fr', else 'en'). */
export function langFromPath(pathname: string): Lang {
  const m = pathname.match(/^\/(fr|es)(\/|$)/)
  return m ? (m[1] as Lang) : 'en'
}

/** Absolute (origin-less) URL of a page in a given language. */
export function urlFor(page: PageMeta, lang: Lang): string {
  if (page.key === 'home') return lang === 'en' ? '/' : `/${lang}/`
  // Trailing slash so the canonical URL matches what nginx serves for a
  // prerendered directory (/fr/catalogue/index.html) — no 301 redirect.
  return (lang === 'en' ? '' : `/${lang}`) + page.slug[lang] + '/'
}

export interface Resolved {
  lang: Lang
  /** null when the pathname matches no known page (404). */
  page: PageMeta | null
}

/** Map a pathname to its language and page, honouring the language prefix. */
export function resolvePath(pathname: string): Resolved {
  let lang: Lang = 'en'
  let rest = pathname
  const m = pathname.match(/^\/(fr|es)(\/.*)?$/)
  if (m) {
    lang = m[1] as Lang
    rest = m[2] ?? '/'
  }
  if (rest.length > 1 && rest.endsWith('/')) rest = rest.slice(0, -1)
  if (rest === '' || rest === '/') return { lang, page: pageByKey('home') }
  const page = PAGES.find((p) => p.key !== 'home' && p.slug[lang] === rest) ?? null
  return { lang, page }
}
