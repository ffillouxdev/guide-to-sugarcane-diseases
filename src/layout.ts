import i18next from './i18n'

const languages = [
  { code: 'en', label: '🇬🇧 en' },
  { code: 'fr', label: '🇫🇷 fr' },
  { code: 'es', label: '🇪🇸 es' },
]

const localizedPaths: Record<string, Record<string, string>> = {
  catalogue: { en: '/catalogue', fr: '/catalogue', es: '/catalogo' },
  privacy:   { en: '/privacy',   fr: '/confidentialite', es: '/privacidad' },
  legal:     { en: '/legal',     fr: '/mentions-legales', es: '/aviso-legal' },
}

function lp(key: string): string {
  return localizedPaths[key]?.[i18next.language] ?? localizedPaths[key]?.en ?? '/'
}

export function header(): string {
  const current = i18next.language

  const options = languages.map(({ code, label }) =>
    `<option value="${code}" ${code === current ? 'selected' : ''}>${label}</option>`
  ).join('')

  return /*html*/`
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-green-700 rounded flex items-center justify-center text-white text-xs font-bold">D</div>
          <span class="font-semibold text-gray-900">D-CAS v2.0</span>
        </div>
        <select id="lang-select" class="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer">
          ${options}
        </select>
      </div>
    </header>
  `
}

export function navbar(): string {
  const t = i18next.t.bind(i18next)
  const pathname = window.location.pathname

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path) ||
           Object.values(localizedPaths[path] || {}).some(p => pathname === p)
  }

  const navClass = (active: boolean) =>
    active
      ? 'flex flex-col items-center gap-1 text-green-700'
      : 'flex flex-col items-center gap-1 text-gray-500'

  return /*html*/`
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16">
      <a href="/" class="${navClass(isActive('/'))} hover:text-green-600 flex-1 justify-center">
        <span class="text-2xl">🏠</span>
        <span class="text-xs">${t('nav.home')}</span>
      </a>
      <a href="${lp('catalogue')}" class="${navClass(isActive('catalogue'))} hover:text-green-600 flex-1 justify-center">
        <span class="text-2xl">📚</span>
        <span class="text-xs">${t('nav.catalogue')}</span>
      </a>
      <button id="menu-btn" class="${navClass(false)} hover:text-green-600 flex-1 justify-center">
        <span class="text-2xl">⋯</span>
        <span class="text-xs">${t('nav.more')}</span>
      </button>
    </nav>

    <!-- Menu dropdown -->
    <div id="menu-dropdown" class="hidden fixed bottom-16 right-4 bg-white border border-gray-200 rounded shadow-lg z-40 w-40">
      <a href="${lp('privacy')}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200">${t('nav.privacy')}</a>
      <a href="${lp('legal')}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">${t('nav.legal')}</a>
    </div>
  `
}

export function nav(): string {
  return `${header()}${navbar()}`
}
