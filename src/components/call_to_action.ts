export function callToAction(): string {
  return /*html*/`
    <section class="max-w-2xl mx-auto px-6 py-10 pb-20">
      <div class="flex items-start gap-6">
        <!-- Image placeholder -->
        <div class="flex-1 h-32 bg-gray-200 border border-gray-300 rounded"></div>
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
      </div>
    </section>
  `
}
