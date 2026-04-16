import i18next from '../i18n'
import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function catalogueView(): string {
  const t = i18next.t.bind(i18next)

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-2">
      <div class="mb-8">
        <input type="text" placeholder="${t('catalogue.searchPlaceholder')}" class="w-full px-4 py-2 border bg-gray-300/60 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>

      <div class="bg-white rounded border">
        <div class="grid grid-cols-2 gap-4 p-4 font-semibold text-sm">
          <div>${t('catalogue.diseaseNameColumn')}</div>
          <div>${t('catalogue.pathogenColumn')}</div>
        </div>
        <hr class="border-b border-gray-300 w-[97%] mx-auto mb-6" />
        <div class="divide-y divide-gray-200">
          <!-- Disease items will go here -->
        </div>
      </div>

      ${callToAction()}
    </main>
  `
}
