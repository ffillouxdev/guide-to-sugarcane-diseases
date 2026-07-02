import i18next from './i18n'
import { bindHeaderEvents, header } from './layout'
import { homeView } from './views/home'
import { catalogueView, initCatalogue } from './views/catalog'
import { aboutView } from './views/about'
import { privacyView } from './views/privacy'
import { legalView } from './views/legal'
import { initQuestionnaire } from './components/questionnaire'
import { isFirstVisit } from './components/welcome_popup'
import {
  type Lang,
  type PageKey,
  type PageMeta,
  LANGS,
  SITE_ORIGIN,
  OG_LOCALES,
  langFromPath,
  pageByKey,
  resolvePath,
  urlFor,
} from './routes'

const VIEWS: Record<PageKey, { view: () => string; init?: () => void }> = {
  home:      { view: homeView, init: initQuestionnaire },
  catalogue: { view: catalogueView, init: initCatalogue },
  about:     { view: aboutView },
  privacy:   { view: privacyView },
  legal:     { view: legalView },
}

const notFoundView = () => {
  const t = i18next.t.bind(i18next)
  const homeUrl = urlFor(pageByKey('home'), i18next.language as Lang)
  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-no-repeat mt-2">
      <img src="/assets/icon-512.png" alt="CaneDr" class="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-6" />
      <h1 class="text-3xl text-center font-bold text-gray-900">${t('notFound')}</h1>
      <a href="${homeUrl}" class="mt-6 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors block mx-auto w-fit">${t('backHome')}</a>
    </main>
  `
}

function setMeta(selector: string, attr: string, content: string): void {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [name, value] = attr.split('=')
    el.setAttribute(name, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string, hreflang?: string): void {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function updateMetaTags(page: PageMeta | null, lang: Lang, title: string): void {
  const t = i18next.t.bind(i18next)
  const url = SITE_ORIGIN + globalThis.location.pathname
  const desc = page ? t(page.descKey) : t('seo.descHome')

  setMeta('meta[name="description"]', 'name=description', desc)
  setLink('canonical', url)
  setMeta('meta[property="og:title"]', 'property=og:title', title)
  setMeta('meta[property="og:description"]', 'property=og:description', desc)
  setMeta('meta[property="og:url"]', 'property=og:url', url)
  setMeta('meta[property="og:locale"]', 'property=og:locale', OG_LOCALES[lang])
  setMeta('meta[name="twitter:title"]', 'name=twitter:title', title)
  setMeta('meta[name="twitter:description"]', 'name=twitter:description', desc)

  // Per-page hreflang alternates (only meaningful for a real page).
  if (page) {
    for (const l of LANGS) setLink('alternate', SITE_ORIGIN + urlFor(page, l), l)
    setLink('alternate', SITE_ORIGIN + urlFor(page, 'en'), 'x-default')
  }
}

export function render(app: HTMLElement): void {
  const { lang, page } = resolvePath(globalThis.location.pathname)
  if (i18next.language !== lang) i18next.changeLanguage(lang)
  document.documentElement.lang = lang

  const t = i18next.t.bind(i18next)
  const title = page ? `${t(page.titleKey)} — CaneDr` : `${t('notFound')} — CaneDr`

  document.title = title
  updateMetaTags(page, lang, title)

  app.innerHTML = page ? VIEWS[page.key].view() : notFoundView()

  bindHeaderEvents((path) => navigateTo(path, app))

  if (page) VIEWS[page.key].init?.()
}

export function navigateTo(path: string, app: HTMLElement): void {
  history.pushState(null, '', path)
  render(app)
}

// First visit on an unprefixed (English) URL: honour the browser language for
// fr/es by rewriting the URL before the first render. Explicit /fr/ and /es/
// URLs always win, and any browser language other than fr/es stays English.
export function applyBrowserLanguage(): void {
  if (!isFirstVisit()) return
  if (langFromPath(globalThis.location.pathname) !== 'en') return
  const browser = (globalThis.navigator?.language ?? '').toLowerCase()
  const lang = browser.startsWith('fr') ? 'fr' : browser.startsWith('es') ? 'es' : null
  if (!lang) return
  const { page } = resolvePath(globalThis.location.pathname)
  if (page) history.replaceState(null, '', urlFor(page, lang))
}

const EXTERNAL_HREF_RE = /^(https?:|\/\/|#|mailto:|tel:)/

export function initRouter(app: HTMLElement): void {
  globalThis.addEventListener('popstate', () => render(app))

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return
    if (e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor) return
    if (anchor.target && anchor.target !== '_self') return
    if (anchor.hasAttribute('download')) return
    const href = anchor.getAttribute('href')
    if (!href || EXTERNAL_HREF_RE.test(href)) return
    e.preventDefault()
    navigateTo(href, app)
  })

  render(app)
}
