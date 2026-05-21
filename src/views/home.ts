import { callToAction } from '../components/call_to_action'
import { ciradCorner } from '../components/cirad_corner'

export function homeView(): string {
  return /*html*/`
    <main class="relative w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 min-h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-no-repeat bg-fixed mt-2">
      ${ciradCorner()}
      <div id="questionnaire"></div>
      ${callToAction()}
    </main>
  `
}
