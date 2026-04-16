export function callToAction(): string {
  return /*html*/`
    <section class="w-full px-6 py-10 pb-20">
      <div class="flex items-start gap-6">
        <div class="[flex:2] text-left">
          <p class="text-sm text-green-700">
            For additionnal information, please see the book
            <span class="font-semibold text-green-700">"A guide to sugarcane diseases"</span>
            edited by <span class="font-semibold text-green-700">Philippe ROTT</span>, <span class="font-semibold text-green-700">Jean-Claude GIRARD</span> and <span class="font-semibold text-green-700">Jean Heinrich DAUGROIS</span>
          </p>
          <a href="https://www.quae.com/produit/78/9782876143869/a-guide-to-sugarcane-diseases" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
            <span class="md:hidden">Web book →</span>
            <span class="hidden md:inline">The free web book →</span>
          </a>
        </div>
        <img src="/assets/a_guide_to_sugarcane-img.png" alt="A guide to sugarcane diseases" class="w-24 rounded" />
      </div>
    </section>
  `
}
