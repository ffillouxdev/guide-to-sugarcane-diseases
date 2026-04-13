import i18next from './i18n'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
]

export function nav(): string {
  const t = i18next.t.bind(i18next)
  const current = i18next.language

  const options = languages.map(({ code, label }) =>
    `<option value="${code}" ${code === current ? 'selected' : ''}>${label}</option>`
  ).join('')

  return /*html*/`
    <nav class="flex items-center gap-6 px-6 py-4 border-b border-gray-200 text-sm">
      <a href="#/" class="font-semibold text-green-800 hover:text-green-600">${t('nav.home')}</a>
      <a href="#/catalogue" class="text-gray-600 hover:text-green-700">${t('nav.catalogue')}</a>
      <span class="flex-1"></span>
      <a href="#/privacy" class="text-gray-400 hover:text-gray-600 text-xs">${t('nav.privacy')}</a>
      <a href="#/legal" class="text-gray-400 hover:text-gray-600 text-xs">${t('nav.legal')}</a>
      <select id="lang-select" class="ml-2 text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700">
        ${options}
      </select>
    </nav>
  `
}
