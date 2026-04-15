import i18next from '../i18n'

const languages = [
  { code: 'en', flag: '🇬🇧', label: 'english' },
  { code: 'fr', flag: '🇫🇷', label: 'français' },
  { code: 'es', flag: '🇪🇸', label: 'español' },
]

const localizedPaths: Record<string, Record<string, string>> = {
  catalogue: { en: '/catalogue', fr: '/catalogue', es: '/catalogo' },
  privacy:   { en: '/privacy',   fr: '/confidentialite', es: '/privacidad' },
  legal:     { en: '/legal',     fr: '/mentions-legales', es: '/aviso-legal' },
}

function lp(key: string): string {
  return localizedPaths[key]?.[i18next.language] ?? localizedPaths[key]?.en ?? '/'
}

function isActive(path: string): boolean {
  const pathname = window.location.pathname
  if (path === '/') return pathname === '/'
  return Object.values(localizedPaths[path] || {}).some(p => pathname === p)
}

export function header(): string {
  const t = i18next.t.bind(i18next)
  const lang = languages.find(l => l.code === i18next.language) ?? languages[0]

  const options = languages.map(({ code, flag, label }) =>
    `<option value="${code}" ${code === lang.code ? 'selected' : ''}>${label} ${flag}</option>`
  ).join('')

  const linkClass = (key: string) => {
    const active = isActive(key)
    return active
      ? 'text-green-700 font-bold'
      : 'text-gray-700 hover:text-green-700'
  }

  return /*html*/`
    <header class="bg-white sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">

        <!-- Logo -->
        <a href="/" class="flex flex-col gap-1 mr-8 shrink-0">
          <span class="font-bold text-lg text-gray-900 leading-none">D-CAS</span>
          <span class="text-xs text-gray-500 leading-none">v2.0.0</span>
        </a>

        <!-- Nav links -->
        <nav class="flex items-center gap-6 text-sm">
          <a href="/" class="flex items-center gap-1.5 ${linkClass('/')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"/></svg>
            ${t('nav.home')}
          </a>
          <a href="${lp('catalogue')}" class="flex items-center gap-1.5 ${linkClass('catalogue')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            ${t('nav.catalogue')}
          </a>

          <!-- More dropdown -->
          <div class="relative">
            <button id="menu-btn" class="flex items-center gap-1.5 text-sm text-gray-700 hover:text-green-700 cursor-pointer">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              ${t('nav.more')}
            </button>
            <div id="menu-dropdown" class="hidden absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <a href="${lp('privacy')}" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">${t('nav.privacy')}</a>
              <a href="${lp('legal')}" class="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">${t('nav.legal')}</a>
            </div>
          </div>
        </nav>

        <!-- Language selector -->
        <select id="lang-select" class="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer">
          ${options}
        </select>
      </div>
      <hr class="max-w-7xl mx-auto"/>
    </header>
  `
}

export function bindHeaderEvents(onLangChange: () => void): void {
  const select = document.getElementById('lang-select') as HTMLSelectElement | null
  select?.addEventListener('change', () => {
    i18next.changeLanguage(select.value).then(() => onLangChange())
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
