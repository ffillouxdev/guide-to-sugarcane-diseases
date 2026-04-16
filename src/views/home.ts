import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function homeView(): string {
  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-6 py-10 md:h-[93vh] bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-2">
      <h1 class="text-3xl font-bold text-gray-900 text-center mb-8">
        What types of symptoms do you observe on sugarcane?
      </h1>
      ${callToAction()}
    </main>
  `
}
