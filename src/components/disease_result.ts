import i18next from '../i18n'
import type { Disease } from '../data/key-loader'

export interface DiseaseResultOptions {
  // Optional markup rendered above the title (e.g. breadcrumb for home,
  // simple `result_DiseaseName` label for catalogue).
  topSlot?: string
}

function carousel(images: string[]): string {
  const t = i18next.t.bind(i18next)
  const hasImages = images.length > 0
  const firstSrc = hasImages ? images[0] : ''

  return /*html*/`
    <div class="relative w-full max-w-xl mx-auto mb-6" data-carousel>
      <button type="button" data-carousel-prev aria-label="${t('result.prevImage')}"
        class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-300 shadow flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
        ${hasImages ? '' : 'disabled'}>
        <span class="text-lg leading-none">‹</span>
      </button>

      <div class="aspect-[4/3] bg-gray-100 border rounded overflow-hidden flex items-center justify-center">
        ${hasImages
          ? /*html*/`<img data-carousel-img src="${firstSrc}" alt="" class="w-full h-full object-cover" />`
          : /*html*/`<span class="text-gray-400 text-sm italic">${t('result.noImage')}</span>`
        }
      </div>

      <button type="button" data-carousel-next aria-label="${t('result.nextImage')}"
        class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-300 shadow flex items-center justify-center hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
        ${hasImages ? '' : 'disabled'}>
        <span class="text-lg leading-none">›</span>
      </button>

      ${hasImages && images.length > 1 ? /*html*/`
        <div data-carousel-indicator class="text-center text-xs text-gray-500 mt-2">
          <span data-carousel-index>1</span> / ${images.length}
        </div>
      ` : ''}
    </div>
  `
}

function geoZones(geo: Disease['geo_locations']): string {
  const t = i18next.t.bind(i18next)
  if (!geo || geo.length === 0) return ''

  const details: string[] = []
  for (const entry of geo) {
    for (const [continent, countries] of Object.entries(entry)) {
      const countries_html = countries.map(c => /*html*/`<li class="text-sm text-gray-700">${c}</li>`).join('')
      details.push(/*html*/`
        <details class="border-b border-white py-2">
          <summary class="font-medium cursor-pointer hover:text-green-700">${continent}</summary>
          <ul class="list-disc list-inside mt-2 ml-2 space-y-0.5">
            ${countries_html}
          </ul>
        </details>
      `)
    }
  }

  return /*html*/`
    <section class="mt-6">
      <h2 class="font-semibold text-gray-900 mb-2">${t('result.geoLocations')} 🌐 :</h2>
      ${details.join('')}
      <p class="mt-4 text-xs text-amber-700">⚠️ — ${t('result.geoWarning')}</p>
    </section>
  `
}

export function diseaseResult(disease: Disease, opts: DiseaseResultOptions = {}): string {
  const top = opts.topSlot ?? ''

  return /*html*/`
    ${top}
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
      ${disease.name}
    </h1>
    ${disease.pathogen ? /*html*/`<p class="text-sm text-gray-600 text-center italic mb-6">${disease.pathogen}</p>` : '<div class="mb-6"></div>'}
    ${carousel(disease.image ?? [])}
    ${geoZones(disease.geo_locations)}
  `
}

// Attach carousel navigation behaviour to a root element containing a
// [data-carousel] block rendered by `diseaseResult`. Safe to call when no
// carousel is present — it will no-op.
export function bindCarousel(root: ParentNode, images: string[]): void {
  if (images.length === 0) return

  const container = root.querySelector('[data-carousel]')
  if (!container) return

  const img = container.querySelector('[data-carousel-img]') as HTMLImageElement | null
  const idxEl = container.querySelector('[data-carousel-index]')
  const prev = container.querySelector('[data-carousel-prev]') as HTMLButtonElement | null
  const next = container.querySelector('[data-carousel-next]') as HTMLButtonElement | null

  let idx = 0

  function show(i: number): void {
    idx = (i + images.length) % images.length
    if (img) img.src = images[idx]
    if (idxEl) idxEl.textContent = String(idx + 1)
  }

  prev?.addEventListener('click', () => show(idx - 1))
  next?.addEventListener('click', () => show(idx + 1))
}
