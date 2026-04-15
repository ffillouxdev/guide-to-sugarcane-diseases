import i18next from '../i18n'
import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function catalogueView(): string {
  const t = i18next.t.bind(i18next)
  return /*html*/`
    ${header()}
    <main class="max-w-3xl mx-auto px-6 py-10">
      <h1 class="text-3xl font-bold text-gray-900 text-center mb-2">${t('catalogue.title')}</h1>
      <p class="text-gray-500 mb-8">${t('catalogue.subtitle')}</p>
      <p class="text-sm text-gray-400 italic">${t('catalogue.empty')}</p>
      ${callToAction()}
    </main>
  `
}
