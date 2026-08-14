import { useT } from '../i18n'
import { header } from '../layout'

export function aboutView(): string {
  const t = useT()

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed mt-2">
      <article class="bg-white rounded shadow-md border border-gray-200 p-6 md:p-8">
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-8">${t('about.title')}</h1>
        <section class="mb-8">
          <h2 class="text-base font-semibold text-gray-800 mb-2">${t('about.introHeading')}</h2>
          <p class="text-sm text-gray-700">${t('about.introBody')}</p>
        </section>

        <section>
          <h2 class="text-base font-semibold text-gray-800 mb-2">${t('about.creditsHeading')}</h2>
          <p class="text-sm text-gray-700 mb-2">${t('about.creditsDevelopment')}</p>
          <p class="text-sm text-gray-700 mb-4">${t('about.creditsPhotographers')}</p>

          <h2 class="text-base font-semibold text-gray-800 mt-6 mb-2">${t('contact.heading')}</h2>
          <p class="text-sm text-gray-700 mb-4">
            ${t('contact.body')}
            <a href="mailto:canedr@cirad.fr" class="font-semibold text-green-700 hover:underline">canedr@cirad.fr</a>
          </p>

          <div class="flex items-center gap-4 bg-gray-200 rounded border border-gray-300 p-4 mt-4">
            <div class="text-sm text-gray-700 flex-1">
              <p class="mb-1">
                <span>${t('about.creditsCiradIntro')}</span>
                <a href="https://www.cirad.fr/" target="_blank" rel="noopener noreferrer" class="font-semibold text-green-700 hover:underline">${t('about.creditsCiradName')}</a>
              </p>
              <p class="text-xs text-gray-600 mb-1">${t('about.creditsCiradDescription')}</p>
              <a href="https://www.cirad.fr/" target="_blank" rel="noopener noreferrer" class="text-xs text-green-700 hover:underline">${t('about.creditsCiradLink')} →</a>
            </div>
            <a href="https://www.cirad.fr/" target="_blank" rel="noopener noreferrer" class="shrink-0">
              <img src="/assets/logo-cirad.svg" alt="CIRAD" class="h-10 sm:h-16 w-auto" />
            </a>
          </div>
        </section>
      </article>
    </main>
  `
}
