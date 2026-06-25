import i18next from './i18n'
import { bindHeaderEvents, header } from './layout'
import { homeView } from './views/home'
import { catalogueView, initCatalogue } from './views/catalog'
import { aboutView } from './views/about'
import { privacyView } from './views/privacy'
import { legalView } from './views/legal'
import { initQuestionnaire } from './components/questionnaire'

type Route = {
  path: string
  titleKey: string
  descKey?: string
  view: () => string
  init?: () => void
}

const SITE_ORIGIN = 'https://canedr.cirad.fr'
const OG_LOCALES: Record<string, string> = { en: 'en_US', fr: 'fr_FR', es: 'es_ES' }

const notFoundView = () => {
  const t = i18next.t.bind(i18next)
  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-no-repeat mt-2">
      <h1 class="text-3xl text-center font-bold text-gray-900">${t('notFound')}</h1>
      <button onclick="history.back()" class="mt-6 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors block mx-auto">${t('backHome')}</button>
    </main>
  `
}

const routes: Route[] = [
  { path: '/',                 titleKey: 'seo.titleHome',   descKey: 'seo.descHome',      view: homeView,      init: initQuestionnaire },
  { path: '/catalogue',        titleKey: 'catalogue.title', descKey: 'seo.descCatalogue', view: catalogueView, init: initCatalogue },
  { path: '/catalog',          titleKey: 'catalogue.title', descKey: 'seo.descCatalogue', view: catalogueView, init: initCatalogue },
  { path: '/catalogo',         titleKey: 'catalogue.title', descKey: 'seo.descCatalogue', view: catalogueView, init: initCatalogue },
  { path: '/about',            titleKey: 'about.title',     descKey: 'seo.descAbout',     view: aboutView },
  { path: '/a-propos',         titleKey: 'about.title',     descKey: 'seo.descAbout',     view: aboutView },
  { path: '/acerca-de',        titleKey: 'about.title',     descKey: 'seo.descAbout',     view: aboutView },
  { path: '/privacy',          titleKey: 'privacy.title',   descKey: 'seo.descPrivacy',   view: privacyView },
  { path: '/confidentialite',  titleKey: 'privacy.title',   descKey: 'seo.descPrivacy',   view: privacyView },
  { path: '/privacidad',       titleKey: 'privacy.title',   descKey: 'seo.descPrivacy',   view: privacyView },
  { path: '/legal',            titleKey: 'legal.title',     descKey: 'seo.descLegal',     view: legalView },
  { path: '/mentions-legales', titleKey: 'legal.title',     descKey: 'seo.descLegal',     view: legalView },
  { path: '/aviso-legal',      titleKey: 'legal.title',     descKey: 'seo.descLegal',     view: legalView },
]

function resolve(pathname: string): Route {
  return routes.find(r => r.path === pathname) ?? { path: pathname, titleKey: 'notFound', view: notFoundView }
}

function updateMetaTags(route: Route, title: string): void {
  const t = i18next.t.bind(i18next)
  const lang = i18next.language?.split('-')[0] ?? 'en'
  const url = SITE_ORIGIN + globalThis.location.pathname
  const desc = route.descKey ? t(route.descKey) : t('seo.descHome')

  const setMeta = (selector: string, attr: string, content: string) => {
    let el = document.head.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      const [name, value] = attr.split('=')
      el.setAttribute(name, value)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  const setLink = (rel: string, href: string) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`)
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', rel)
      document.head.appendChild(el)
    }
    el.setAttribute('href', href)
  }

  setMeta('meta[name="description"]', 'name=description', desc)
  setLink('canonical', url)
  setMeta('meta[property="og:title"]', 'property=og:title', title)
  setMeta('meta[property="og:description"]', 'property=og:description', desc)
  setMeta('meta[property="og:url"]', 'property=og:url', url)
  setMeta('meta[property="og:locale"]', 'property=og:locale', OG_LOCALES[lang] ?? 'en_US')
  setMeta('meta[name="twitter:title"]', 'name=twitter:title', title)
  setMeta('meta[name="twitter:description"]', 'name=twitter:description', desc)
}

export function render(app: HTMLElement): void {
  const route = resolve(globalThis.location.pathname)
  const title = `${i18next.t.bind(i18next)(route.titleKey)} — CaneDr`

  document.title = title
  document.documentElement.lang = i18next.language?.split('-')[0] ?? 'en'
  updateMetaTags(route, title)

  app.innerHTML = route.view()

  bindHeaderEvents(() => render(app))

  route.init?.()
}

export function navigateTo(path: string, app: HTMLElement): void {
  history.pushState(null, '', path)
  render(app)
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
