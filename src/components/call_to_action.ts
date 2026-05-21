import { useT } from '../i18n'

export function callToAction(showCiradBadge = false): string {
  const t = useT()

  const ciradBadge = showCiradBadge ? /*html*/`
    <a href="https://www.cirad.fr/" target="_blank" rel="noopener noreferrer"
       class="mt-4 inline-flex items-center gap-2 bg-white/80 rounded border border-gray-200 px-3 py-1.5 shadow-sm hover:bg-white transition-colors">
      <img src="/assets/logo-cirad.svg" alt="CIRAD" class="h-6 w-auto" />
    </a>
  ` : ''

  return /*html*/`
    <section class="w-full py-10 pb-20">
      <div class="flex items-start gap-6">
        <div class="[flex:2] text-left">
          <p class="text-sm text-green-700">
            ${t('cta.intro')}
            <span class="font-semibold text-green-700">"${t('cta.bookTitle')}"</span>
            ${t('cta.authors')}
          </p>
          <a href="https://www.quae.com/produit/78/9782876143869/a-guide-to-sugarcane-diseases" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
            <span class="md:hidden">${t('cta.buttonMobile')}</span>
            <span class="hidden md:inline">${t('cta.buttonDesktop')}</span>
          </a>
          ${ciradBadge}
        </div>
        <img src="/assets/a_guide_to_sugarcane-img.png" alt="${t('cta.bookTitle')}" class="w-24 rounded" />
      </div>
    </section>
  `
}
