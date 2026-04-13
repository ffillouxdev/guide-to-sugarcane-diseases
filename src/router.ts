import i18next from './i18n'
import { nav } from './layout'
import { homeView } from './views/home'
import { catalogueView } from './views/catalogue'
import { privacyView } from './views/privacy'
import { legalView } from './views/legal'

type Route = {
  paths: string[]
  view: () => string
  titleKey: string
}

const routes: Route[] = [
  { paths: ['/', ''],                   view: homeView,      titleKey: 'home.title' },
  { paths: ['/catalogue', '/catalog'],  view: catalogueView, titleKey: 'catalogue.title' },
  { paths: ['/privacy'],                view: privacyView,   titleKey: 'privacy.title' },
  { paths: ['/legal'],                  view: legalView,     titleKey: 'legal.title' },
]

function getHash(): string {
  return window.location.hash.slice(1) || '/'
}

function notFoundView(): string {
  const t = i18next.t.bind(i18next)
  return /*html*/`
    ${nav()}
    <main class="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-8">
      <h1 class="text-6xl font-bold text-gray-300">404</h1>
      <p class="text-gray-500">${t('notFound')}</p>
      <a href="#/" class="text-green-700 hover:text-green-800 underline text-sm">${t('backHome')}</a>
    </main>
  `
}

function matchRoute(path: string): { html: string; titleKey: string } {
  const route = routes.find(r => r.paths.includes(path))
  if (route) {
    return { html: route.view(), titleKey: route.titleKey }
  }
  return { html: notFoundView(), titleKey: 'notFound' }
}

function render(app: HTMLElement): void {
  const path = getHash()
  const { html, titleKey } = matchRoute(path)
  app.innerHTML = html
  document.title = `${i18next.t(titleKey)} — D-CAS 2.0`
  document.documentElement.lang = i18next.language

  const select = document.getElementById('lang-select') as HTMLSelectElement | null
  select?.addEventListener('change', () => {
    i18next.changeLanguage(select.value).then(() => render(app))
  })
}

export function initRouter(app: HTMLElement): void {
  window.addEventListener('hashchange', () => render(app))
  render(app)
}
