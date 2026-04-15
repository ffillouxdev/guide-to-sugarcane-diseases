import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function catalogueView(): string {
  return /*html*/`
    ${header()}
    <main class="max-w-3xl mx-auto px-6 py-10">
      ${callToAction()}
    </main>
  `
}
