import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function homeView(): string {
  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-fixed mt-2">
      <div id="questionnaire"></div>
      ${callToAction()}
    </main>
  `
}
