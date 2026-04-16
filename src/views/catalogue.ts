import { header } from '../layout'
import { callToAction } from '../components/call_to_action'

export function catalogueView(): string {
  return /*html*/`
    ${header()}
    <main class="max-w-5xl mx-auto px-6 py-10 md:h-[93vh] bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-2">
      <div class="mb-8">
        <input type="text" placeholder="Search for a disease by name..." class="w-full px-4 py-2 border bg-gray-300/60 rounded text-sm" />
      </div>

      <div class="bg-white rounded border">
        <div class="grid grid-cols-2 gap-4 p-4 font-semibold text-sm">
          <div>disease name</div>
          <div>pathogen</div>
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
