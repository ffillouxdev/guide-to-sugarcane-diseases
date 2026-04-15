import i18next from '../i18n'
import { header } from '../layout'

export function homeView(): string {
  const t = i18next.t.bind(i18next)
  return /*html*/`
    ${header()}
    <main class="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6">
      <p class="text-xs uppercase tracking-widest text-green-700 font-medium">CIRAD · D-CAS 2.0</p>
      <h1 class="text-4xl font-bold text-gray-900">${t('home.title')}</h1>
      <p class="text-lg text-gray-500">${t('home.subtitle')}</p>
      <p class="text-sm text-gray-400 max-w-sm whitespace-pre-line">${t('home.hint')}</p>
      <button class="mt-2 px-8 py-3 bg-green-700 text-white rounded-xl text-sm font-medium hover:bg-green-800 transition-colors">
        ${t('home.cta')}
      </button>
    </main>
  `
}
