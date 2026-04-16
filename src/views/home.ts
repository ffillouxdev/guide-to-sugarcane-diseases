import i18next from '../i18n'
import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function homeView(): string {
  const t = i18next.t.bind(i18next)

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 md:h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-2">
      <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
        ${t('home.title')}
      </h1>
      ${callToAction()}
    </main>
  `
}
