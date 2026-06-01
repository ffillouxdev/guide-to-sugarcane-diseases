import i18next, { useT } from '../i18n'
import type { Disease } from '../data/key-loader'

const IMG_EXT_RE = /\.(jpe?g|png|webp|gif)$/i
const NUM_PREFIX_RE = /^[\d.]+\s+/
const FIGURE_RE = /Figure\s+\d+\s*/gi

function formatFilename(path: string): string {
  const base = (path.split('/').pop() ?? path).replace(IMG_EXT_RE, '')
  const sep = base.lastIndexOf('_')
  if (sep === -1) return base
  const disease = base.slice(0, sep)
    .replace(NUM_PREFIX_RE, '')
    .replace(FIGURE_RE, '')
    .trim()
  const photographer = base.slice(sep + 1).trim().replace(IMG_EXT_RE, '')
  if (!disease) return base
  return `(© ${photographer})`
}

export interface DiseaseResultOptions {
  // Optional markup rendered above the title (e.g. breadcrumb for home,
  // simple `result_DiseaseName` label for catalogue).
  topSlot?: string
}

function carousel(images: string[], diseaseName: string): string {
  const t = useT()
  const hasImages = images.length > 0
  const hasMultiple = images.length > 1
  const firstSrc = hasImages ? images[0] : ''

  const frame = /*html*/`
    <div class="aspect-[4/3] bg-gray-100 border rounded overflow-hidden flex items-center justify-center">
      ${hasImages
        ? /*html*/`<img data-carousel-img src="${firstSrc}" alt="${diseaseName} image" class="w-full h-full object-cover" />`
        : /*html*/`<span class="text-gray-400 text-sm italic text-center px-6">${t('result.noImage')}</span>`
      }
    </div>
  `

  // Single image or no images: just the frame, no navigation controls.
  if (!hasMultiple) {
    return /*html*/`
      <div class="w-full max-w-xl mx-auto mb-6">
        ${frame}
        ${hasImages ? /*html*/`<div class="text-center text-xs text-gray-500 mt-2">${formatFilename(images[0])}</div>` : ''}
      </div>
    `
  }

  // Multiple images: full carousel with arrows.
  return /*html*/`
    <div class="w-full max-w-xl mx-auto mb-6" data-carousel>
      <div class="relative">
        <button type="button" data-carousel-prev aria-label="${t('result.prevImage')}"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-300 shadow flex items-center justify-center hover:bg-white">
          <span class="text-lg leading-none">‹</span>
        </button>

        ${frame}

        <button type="button" data-carousel-next aria-label="${t('result.nextImage')}"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-9 h-9 rounded-full bg-white/90 border border-gray-300 shadow flex items-center justify-center hover:bg-white">
          <span class="text-lg leading-none">›</span>
        </button>
      </div>

      <div class="text-center text-xs text-gray-500 mt-2">
        <div><span data-carousel-index>1</span> / ${images.length}</div>
        <div data-carousel-filename>${images.length > 0 ? formatFilename(images[0]) : ''}</div>
      </div>
    </div>
  `
}

function geoZones(geo: Disease['geo_locations']): string {
  const t = useT()
  if (!geo || geo.length === 0) return ''

  const details: string[] = []
  for (const entry of geo) {
    for (const [continent, countries] of Object.entries(entry)) {
      const countries_html = countries.map(c => /*html*/`<li class="text-sm text-gray-700">${c}</li>`).join('')
      details.push(/*html*/`
        <details class="border-b border-gray-400 py-2">
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
      <p class="my-4 text-xs font-semibold text-green-700">⚠️ — ${t('result.geoWarning')} <strong class="text-sm">${t('result.geoWarningEmail')}</strong></p>
      ${details.join('')}
    </section>
  `
}

export function renderPathogen(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

// Builds the `result_<name>` breadcrumb label shown above the disease view.
// Strips cross-reference parentheticals (e.g. "(see also X; Y)") that bloat
// names like "Basal stem, root and sheath rot(see also ...; ...; ...)", then
// caps to 40 chars with an ellipsis as a safety net.
const RESULT_LABEL_MAX = 40
function stripParentheticals(str: string): string {
  let out = ''
  let depth = 0
  for (const ch of str) {
    if (ch === '(') { depth++; continue }
    if (ch === ')') { depth = Math.max(0, depth - 1); continue }
    if (depth === 0) out += ch
  }
  return out
}
export function formatResultLabel(name: string): string {
  let compact = stripParentheticals(name).replace(/\s+/g, ' ').trim()
  if (compact.length > RESULT_LABEL_MAX) {
    compact = compact.slice(0, RESULT_LABEL_MAX).trimEnd() + '…'
  }
  return `${i18next.t('result.prefix')}_${compact}`
}

export function diseaseResult(disease: Disease, opts: DiseaseResultOptions = {}): string {
  const top = opts.topSlot ?? ''

  return /*html*/`
    ${top}
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
      ${disease.name}
    </h1>
    ${disease.pathogen ? /*html*/`<p class="text-sm text-gray-600 text-center mb-6">${renderPathogen(disease.pathogen)}</p>` : '<div class="mb-6"></div>'}
    ${carousel(disease.image ?? [], disease.name)}
    ${geoZones(disease.geo_locations)}
  `
}

// Attach carousel navigation behaviour to a root element containing a
// [data-carousel] block rendered by `diseaseResult`. Safe to call when no
// carousel is present — it will no-op.
export function bindCarousel(root: ParentNode, images: string[]): void {
  if (images.length <= 1) return

  const container = root.querySelector('[data-carousel]')
  if (!container) return

  const img = container.querySelector('[data-carousel-img]') as HTMLImageElement | null
  const idxEl = container.querySelector('[data-carousel-index]')
  const filenameEl = container.querySelector('[data-carousel-filename]')
  const prev = container.querySelector('[data-carousel-prev]') as HTMLButtonElement | null
  const next = container.querySelector('[data-carousel-next]') as HTMLButtonElement | null

  let idx = 0

  function show(i: number): void {
    idx = (i + images.length) % images.length
    if (img) img.src = images[idx]
    if (idxEl) idxEl.textContent = String(idx + 1)
    if (filenameEl) filenameEl.textContent = formatFilename(images[idx])
  }

  prev?.addEventListener('click', () => show(idx - 1))
  next?.addEventListener('click', () => show(idx + 1))
}
