import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function homeView(): string {
  return /*html*/`
    ${header()}
    <main class="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[80vh] px-6 text-center gap-6 bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-auto">
      ${callToAction()}
    </main>
  `
}
