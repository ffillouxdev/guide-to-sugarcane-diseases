export function questionButton(label: string, next: string): string {
  return /*html*/`
    <button data-next="${next}" class="question-btn w-full text-left px-4 py-3 border rounded bg-white hover:bg-gray-50 text-sm md:text-base lg:text-lg cursor-pointer transition-colors">
      ${label}
    </button>
  `
}
