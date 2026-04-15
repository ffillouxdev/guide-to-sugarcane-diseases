import i18next from '../i18n'
import { header } from '../layout'

export function privacyView(): string {
  const t = i18next.t.bind(i18next)

  const sections: Array<{ heading: string; body: string }> = [
    { heading: t('privacy.dataHeading'),       body: t('privacy.dataBody') },
    { heading: t('privacy.offlineHeading'),    body: t('privacy.offlineBody') },
    { heading: t('privacy.controllerHeading'), body: t('privacy.controllerBody') },
  ]

  const sectionsHtml = sections.map(({ heading, body }) => /*html*/`
    <section class="mb-6">
      <h2 class="text-base font-semibold text-gray-800 mb-1">${heading}</h2>
      <p class="text-sm text-gray-600">${body}</p>
    </section>
  `).join('')

  return /*html*/`
    ${header()}
    <main class="max-w-2xl mx-auto px-6 py-10">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-8">${t('privacy.title')}</h1>
      ${sectionsHtml}
    </main>
  `
}
