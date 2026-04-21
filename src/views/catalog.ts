import { useT } from '../i18n'
import { header } from '../layout'
import { callToAction } from '../components/call_to_action'
import { loadKey } from '../data/key-loader'
import { diseaseResult, bindCarousel } from '../components/disease_result'

export function catalogueView(): string {
  const t = useT()

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 [@media(orientation:landscape)_and_(max-height:480px)]:h-[200vh] portrait:h-screen md:h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center bg-fixed mt-2 flex flex-col overflow-hidden">
      <div id="catalogue-list-view" class="flex flex-col min-h-80 flex-1">
        <div class="mb-4 shrink-0">
          <input id="catalogue-search" type="text" placeholder="${t('catalogue.searchPlaceholder')}" class="w-full px-4 py-2 border bg-gray-300/60 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
        </div>

        <div class="bg-white rounded border overflow-auto flex-1 portrait:min-h-0">
          <table class="w-full table-fixed text-sm">
            <thead class="sticky top-0 bg-white">
              <tr class="border-b border-gray-300">
                <th data-sort="name" class="text-left px-4 py-2 md:py-3 text-xs md:text-sm font-semibold cursor-pointer select-none hover:bg-gray-50">
                  ${t('catalogue.diseaseNameColumn')} <span id="sort-name" class="text-gray-400">↕</span>
                </th>
                <th data-sort="pathogen" class="text-left px-4 py-2 md:py-3 text-xs md:text-sm font-semibold cursor-pointer select-none hover:bg-gray-50" title="${t('catalogue.pathogenColumn')}">
                  ${t('catalogue.pathogenColumnShort')} <span class="hidden md:inline">${t('catalogue.pathogenSynonym')}</span> <span id="sort-pathogen" class="text-gray-400">↕</span>
                </th>
                <th class="text-left px-4 py-3 font-semibold w-24"></th>
              </tr>
            </thead>
            <tbody id="catalogue-list" class="divide-y divide-gray-100">
              <tr><td colspan="3" class="px-4 py-6 text-gray-400 text-center">…</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="catalogue-result-view" class="hidden"></div>

      ${callToAction()}
    </main>
  `
}

export async function initCatalogue(): Promise<void> {
  // loadKey() caches the JSON in memory — called once here for the list, and
  // reused without refetch when rendering each disease result.
  const key = await loadKey()
  const t = useT()

  type Disease = (typeof key.diseases)[string]
  type Entry = Disease & { id: string; section: string }
  type SortKey = 'name' | 'pathogen'
  type SortDir = 'asc' | 'desc'

  const diseases: Entry[] = Object.entries(key.diseases).map(([id, d]) => ({ ...d, id, section: t('catalogue.sectionDiseases') }))
  const otherCauses: Entry[] = Object.entries(key.other_causes ?? {}).map(([id, d]) => ({ ...d, id, section: t('catalogue.sectionOtherCauses') }))
  let sortKey: SortKey = 'name'
  let sortDir: SortDir = 'asc'
  let query = ''
  let selectedSection: string | null = null

  function sortEntries(list: Entry[]): Entry[] {
    return list.slice().sort((a, b) => {
      const av = (sortKey === 'name' ? a.name : (a.pathogen ?? '')).toLowerCase()
      const bv = (sortKey === 'name' ? b.name : (b.pathogen ?? '')).toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }

  function filterEntries(list: Entry[]): Entry[] {
    if (!query) return list
    return list.filter(d =>
      d.name.toLowerCase().includes(query) ||
      (d.pathogen ?? '').toLowerCase().includes(query) ||
      d.section.toLowerCase().includes(query)
    )
  }

  function updateSortIndicators(): void {
    const nameEl = document.getElementById('sort-name')
    const pathEl = document.getElementById('sort-pathogen')
    if (nameEl) nameEl.textContent = sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'
    if (pathEl) pathEl.textContent = sortKey === 'pathogen' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'
  }

  function renderEntryRow(d: Entry): string {
    return /*html*/`
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2">${d.name}</td>
        <td class="px-4 py-2 text-gray-500 italic truncate max-w-[8rem] sm:max-w-[12rem] md:max-w-[16rem]" title="${d.pathogen ?? ''}">${d.pathogen ?? '—'}</td>
        <td class="px-4 py-2">
          <button type="button" data-disease-id="${d.id}" class="disease-link-btn bg-black text-white text-xs font-medium w-full py-1.5 rounded hover:bg-gray-800 transition-colors">
            ${t('catalogue.linkLabel')}
          </button>
        </td>
      </tr>
    `
  }

  function renderSection(heading: string, list: Entry[]): string {
    if (list.length === 0) return ''
    const isSelected = selectedSection === heading
    return /*html*/`
      <tr class="${isSelected ? 'bg-amber-100' : 'bg-gray-100'}">
        <td colspan="3" class="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-700 cursor-pointer hover:bg-amber-200 transition-colors" data-section-filter="${heading}">
          ${heading}
        </td>
      </tr>
      ${list.map(renderEntryRow).join('')}
    `
  }

  function renderRows(): string {
    let diseasesView = sortEntries(filterEntries(diseases))
    let otherView = sortEntries(filterEntries(otherCauses))

    if (selectedSection !== null) {
      diseasesView = selectedSection === t('catalogue.sectionDiseases') ? diseasesView : []
      otherView = selectedSection === t('catalogue.sectionOtherCauses') ? otherView : []
    }

    if (diseasesView.length === 0 && otherView.length === 0) {
      return `<tr><td colspan="3" class="px-4 py-6 text-gray-400 text-center">${t('catalogue.empty')}</td></tr>`
    }
    return (
      renderSection(t('catalogue.sectionDiseases'), diseasesView) +
      renderSection(t('catalogue.sectionOtherCauses'), otherView)
    )
  }

  function refresh(): void {
    const tbody = document.getElementById('catalogue-list')
    if (tbody) tbody.innerHTML = renderRows()
    updateSortIndicators()
  }

  function showResult(diseaseId: string): void {
    const disease = key.diseases[diseaseId] ?? key.other_causes?.[diseaseId]
    if (!disease) return

    const main = document.querySelector('main')
    const listView = document.getElementById('catalogue-list-view')
    const resultView = document.getElementById('catalogue-result-view')
    if (!main || !listView || !resultView) return

    const resultLabel = `result_${disease.name.replace(/\s+/g, '_')}`
    const topSlot = /*html*/`
      <nav class="text-xs text-gray-500 mb-4 flex items-center justify-between gap-4">
        <button type="button" id="catalogue-back" class="hover:underline text-gray-700">${t('catalogue.backToList')}</button>
        <span class="truncate">${resultLabel}</span>
      </nav>
    `

    resultView.innerHTML = diseaseResult(disease, { topSlot })
    bindCarousel(resultView, disease.image ?? [])

    main.classList.remove('md:h-[calc(100vh-4.5rem)]', 'portrait:h-screen', '[@media(orientation:landscape)_and_(max-height:480px)]:h-[200vh]', 'overflow-hidden', 'flex', 'flex-col')
    main.classList.add('min-h-[calc(100vh-4.5rem)]')
    listView.classList.add('hidden')
    resultView.classList.remove('hidden')

    const back = document.getElementById('catalogue-back')
    if (back) back.addEventListener('click', showList)
  }

  function showList(): void {
    const main = document.querySelector('main')
    const listView = document.getElementById('catalogue-list-view')
    const resultView = document.getElementById('catalogue-result-view')
    if (!main || !listView || !resultView) return

    main.classList.add('md:h-[calc(100vh-4.5rem)]', 'portrait:h-screen', '[@media(orientation:landscape)_and_(max-height:480px)]:h-[200vh]', 'overflow-hidden', 'flex', 'flex-col')
    main.classList.remove('min-h-[calc(100vh-4.5rem)]')
    resultView.classList.add('hidden')
    resultView.innerHTML = ''
    listView.classList.remove('hidden')
  }

  refresh()

  const search = document.getElementById('catalogue-search') as HTMLInputElement | null
  if (search) {
    search.addEventListener('input', () => {
      query = search.value.toLowerCase()
      refresh()
    })
  }

  const thead = document.querySelector('thead')
  if (thead) {
    thead.addEventListener('click', (e) => {
      const th = (e.target as HTMLElement).closest('th[data-sort]') as HTMLElement | null
      if (!th) return
      const clicked = th.dataset.sort as SortKey
      if (sortKey === clicked) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey = clicked
        sortDir = 'asc'
      }
      refresh()
    })
  }

  const tbody = document.getElementById('catalogue-list')
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const sectionFilter = (e.target as HTMLElement).closest('[data-section-filter]') as HTMLElement | null
      if (sectionFilter) {
        const section = sectionFilter.dataset.sectionFilter
        if (section) {
          selectedSection = selectedSection === section ? null : section
          refresh()
        }
        return
      }

      const btn = (e.target as HTMLElement).closest('.disease-link-btn') as HTMLElement | null
      if (!btn) return
      const id = btn.dataset.diseaseId
      if (id) showResult(id)
    })
  }
}
