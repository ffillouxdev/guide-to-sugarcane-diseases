import i18next from './i18n'
import { bindHeaderEvents, header } from './layout'
import { homeView } from './views/home'
import { catalogueView, initCatalogue } from './views/catalogue'
import { privacyView } from './views/privacy'
import { legalView } from './views/legal'
import { initQuestionnaire } from './components/questionnaire'

type Route = {
  path: string
  titleKey: string
  view: () => string
}

const notFoundView = () => {
  const t = i18next.t.bind(i18next)
  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-2">
      <h1 class="text-3xl font-bold text-gray-900">${t('notFound')}</h1>
    </main>
  `
}

const routes: Route[] = [
  // Home
  { path: '/',                titleKey: 'home.title',      view: homeView },
  // Catalogue — en / fr / es
  { path: '/catalogue',       titleKey: 'catalogue.title', view: catalogueView },
  { path: '/catalog',         titleKey: 'catalogue.title', view: catalogueView },
  { path: '/catalogo',        titleKey: 'catalogue.title', view: catalogueView },
  // Privacy — en / fr / es
  { path: '/privacy',         titleKey: 'privacy.title',   view: privacyView },
  { path: '/confidentialite', titleKey: 'privacy.title',   view: privacyView },
  { path: '/privacidad',      titleKey: 'privacy.title',   view: privacyView },
  // Legal — en / fr / es
  { path: '/legal',           titleKey: 'legal.title',     view: legalView },
  { path: '/mentions-legales', titleKey: 'legal.title',    view: legalView },
  { path: '/aviso-legal',     titleKey: 'legal.title',     view: legalView },
]

function resolve(pathname: string): Route {
  return routes.find(r => r.path === pathname) ?? { path: pathname, titleKey: 'notFound', view: notFoundView }
}

function render(app: HTMLElement): void {
  const route = resolve(window.location.pathname)
  const t = i18next.t.bind(i18next)

  document.title = `${t(route.titleKey)} — D-CAS 2.0`
  document.documentElement.lang = i18next.language

  app.innerHTML = route.view()

  bindHeaderEvents(() => render(app))

  if (route.path === '/') {
    initQuestionnaire()
  }

  if (['/catalogue', '/catalog', '/catalogo'].includes(route.path)) {
    initCatalogue()
  }
}

export function navigateTo(path: string, app: HTMLElement): void {
  history.pushState(null, '', path)
  render(app)
}

export function initRouter(app: HTMLElement): void {
  window.addEventListener('popstate', () => render(app))

  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement).closest('a')
    if (!anchor) return
    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) return
    e.preventDefault()
    navigateTo(href, app)
  })

  render(app)
}
