import { useT } from '../i18n'
import { header } from '../layout'

export function aboutView(): string {
  const t = useT()

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-fixed mt-2">
      <h1 class="text-2xl font-bold text-gray-900 text-center mb-8">${t('about.title')}</h1>
    </main>
  `
}
