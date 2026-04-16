import i18next from '../i18n'

export function callToAction(): string {
  const t = i18next.t.bind(i18next)

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
        </div>
        <img src="/assets/a_guide_to_sugarcane-img.png" alt="${t('cta.bookTitle')}" class="w-24 rounded" />
      </div>
    </section>
  `
}
