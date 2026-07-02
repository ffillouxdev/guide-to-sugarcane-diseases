import i18next, { useT } from '../i18n'
import { type Lang, pageByKey, resolvePath, urlFor } from '../routes'

// Technical preference only (same category as 'dcas-offline' / language):
// remembers that the first-visit popup was dismissed, never leaves the device.
const STORAGE_KEY = 'dcas-welcome-seen'

const LANG_CODES: Lang[] = ['en', 'fr', 'es']

function content(): string {
  const t = useT()

  const langBar = LANG_CODES.map((code) =>
    code === i18next.language
      ? `<span class="font-semibold text-green-700">${code}</span>`
      : `<button data-welcome-lang="${code}" class="text-gray-400 hover:text-green-700 transition-colors cursor-pointer">${code}</button>`
  ).join('<span class="text-gray-300">|</span>')

  return /*html*/`
    <div class="relative bg-white rounded shadow-md border border-gray-200 w-full max-w-md p-6 md:p-8 text-center">
      <button data-welcome-close aria-label="${t('welcome.close')}"
        class="absolute top-2 right-3 text-3xl leading-none text-gray-400 hover:text-gray-700 transition-colors">&times;</button>
      <div class="flex items-center justify-center gap-2 text-sm mb-4">${langBar}</div>
      <img src="/assets/icon-512.png" alt="CaneDr" class="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4" />
      <h2 class="text-xl font-bold text-gray-900 mb-3">${t('welcome.title')}</h2>
      <p class="text-sm text-gray-600 mb-6">${t('welcome.body')}</p>
      <button data-welcome-enter
        class="px-6 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition-colors">${t('welcome.enter')}</button>
    </div>
  `
}

/** True until the welcome popup has been dismissed once. */
export function isFirstVisit(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== 'true'
}

/** Shows the first-visit welcome popup unless it was already dismissed. */
export function showWelcomePopup(navigate: (path: string) => void): void {
  if (!isFirstVisit()) return

  const overlay = document.createElement('div')
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4'
  overlay.setAttribute('role', 'dialog')
  overlay.setAttribute('aria-modal', 'true')
  overlay.innerHTML = content()

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    overlay.remove()
  }

  overlay.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const langBtn = target.closest<HTMLElement>('[data-welcome-lang]')
    if (langBtn) {
      // Same-page navigation in the chosen language: the router re-renders the
      // app behind the popup, then the popup re-renders itself in that language.
      const page = resolvePath(globalThis.location.pathname).page ?? pageByKey('home')
      navigate(urlFor(page, langBtn.dataset.welcomeLang as Lang))
      overlay.innerHTML = content()
      return
    }
    if (target.closest('[data-welcome-close], [data-welcome-enter]')) dismiss()
  })

  document.body.appendChild(overlay)
}
