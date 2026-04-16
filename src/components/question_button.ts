export function questionButton(label: string, next: string): string {
  return /*html*/`
    <button data-next="${next}" class="question-btn w-full text-left px-4 py-3 border border-gray-400 rounded bg-white hover:bg-gray-50 text-sm cursor-pointer transition-colors">
      ${label}
    </button>
  `
}
