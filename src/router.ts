import i18next from './i18n'
import { nav } from './layout'

type Route = {
  path: string
  titleKey: string
}

const routes: Route[] = [
  // Home
  { path: '/',                titleKey: 'home.title' },
  // Catalogue — en / fr / es
  { path: '/catalogue',       titleKey: 'catalogue.title' },
  { path: '/catalog',         titleKey: 'catalogue.title' },
  { path: '/catalogo',        titleKey: 'catalogue.title' },
  // Privacy — en / fr / es
  { path: '/privacy',         titleKey: 'privacy.title' },
  { path: '/confidentialite', titleKey: 'privacy.title' },
  { path: '/privacidad',      titleKey: 'privacy.title' },
  // Legal — en / fr / es
  { path: '/legal',           titleKey: 'legal.title' },
  { path: '/mentions-legales', titleKey: 'legal.title' },
  { path: '/aviso-legal',     titleKey: 'legal.title' },
]

function resolve(pathname: string): { titleKey: string } {
  const route = routes.find(r => r.path === pathname)
  return { titleKey: route ? route.titleKey : 'notFound' }
}

function render(app: HTMLElement): void {
  const { titleKey } = resolve(window.location.pathname)
  const t = i18next.t.bind(i18next)
  const title = t(titleKey)

  document.title = `${title} — D-CAS 2.0`
  document.documentElement.lang = i18next.language

  app.innerHTML = /*html*/`
    ${nav()}
    <main class="max-w-5xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold text-gray-900">${title}</h1>
    </main>
  `

  const select = document.getElementById('lang-select') as HTMLSelectElement | null
  select?.addEventListener('change', () => {
    i18next.changeLanguage(select.value).then(() => render(app))
  })

  const menuBtn = document.getElementById('menu-btn')
  const menuDropdown = document.getElementById('menu-dropdown')
  menuBtn?.addEventListener('click', (e) => {
    e.stopPropagation()
    menuDropdown?.classList.toggle('hidden')
  })
  document.addEventListener('click', () => {
    menuDropdown?.classList.add('hidden')
  })
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
    if (!href || href.startsWith('http') || href.startsWith('//')) return
    e.preventDefault()
    navigateTo(href, app)
  })

  render(app)
}
