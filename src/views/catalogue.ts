import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function catalogueView(): string {
  return /*html*/`
    ${header()}
    <main class="max-w-5xl mx-auto px-6 py-10 md:h-[93vh] bg-[url('/assets/main-bg.png')] bg-cover bg-center">
      ${callToAction()}
    </main>
  `
}
