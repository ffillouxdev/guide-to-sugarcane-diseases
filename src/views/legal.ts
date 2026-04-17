import i18next from '../i18n'
import { header } from '../layout'

export function legalView(): string {
  const t = i18next.t.bind(i18next)

  const sections: Array<{ heading: string; body: string }> = [
    { heading: t('legal.publisherHeading'), body: t('legal.publisherBody') },
    { heading: t('legal.hostingHeading'),   body: t('legal.hostingBody') },
    { heading: t('legal.creditsHeading'),   body: t('legal.creditsBody') },
  ]

  const sectionsHtml = sections.map(({ heading, body }) => /*html*/`
    <section class="mb-6">
      <h2 class="text-base font-semibold text-gray-800 mb-1">${heading}</h2>
      <p class="text-sm text-gray-600">${body}</p>
    </section>
  `).join('')

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-fixed mt-2">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-8">${t('legal.title')}</h1>
      ${sectionsHtml}
    </main>
  `
}
