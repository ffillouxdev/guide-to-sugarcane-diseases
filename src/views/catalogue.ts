import i18next from '../i18n'
import { header } from '../layout'
import { callToAction } from '../components/call_to_action'
import { loadKey } from '../data/key-loader'

export function catalogueView(): string {
  const t = i18next.t.bind(i18next)

  return /*html*/`
    ${header()}
    <main class="w-full md:max-w-5xl md:mx-auto px-4 md:px-28 py-10 h-[calc(100vh-4.5rem)] bg-[url('/assets/main-bg.png')] bg-cover bg-center mt-2">
      <div class="mb-4">
        <input id="catalogue-search" type="text" placeholder="${t('catalogue.searchPlaceholder')}" class="w-full px-4 py-2 border bg-gray-300/60 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-700" />
      </div>

      <div class="bg-white rounded border overflow-auto h-[calc(100%-4rem)]">
        <table class="w-full text-sm">
          <thead class="sticky top-0 bg-white">
            <tr class="border-b border-gray-300">
              <th data-sort="name" class="text-left px-4 py-3 font-semibold cursor-pointer select-none hover:bg-gray-50">
                ${t('catalogue.diseaseNameColumn')} <span id="sort-name" class="text-gray-400">↕</span>
              </th>
              <th data-sort="pathogen" class="text-left px-4 py-3 font-semibold cursor-pointer select-none hover:bg-gray-50">
                ${t('catalogue.pathogenColumn')} <span id="sort-pathogen" class="text-gray-400">↕</span>
              </th>
            </tr>
          </thead>
          <tbody id="catalogue-list" class="divide-y divide-gray-100">
            <tr><td colspan="2" class="px-4 py-6 text-gray-400 text-center">…</td></tr>
          </tbody>
        </table>
      </div>

      ${callToAction()}
    </main>
  `
}

export async function initCatalogue(): Promise<void> {
  const key = await loadKey()
  const t = i18next.t.bind(i18next)

  type Disease = (typeof key.diseases)[string]
  type SortKey = 'name' | 'pathogen'
  type SortDir = 'asc' | 'desc'

  const allDiseases: Disease[] = Object.values(key.diseases)
  let sortKey: SortKey = 'name'
  let sortDir: SortDir = 'asc'
  let query = ''

  function getSorted(list: Disease[]): Disease[] {
    return list.slice().sort((a, b) => {
      const av = (sortKey === 'name' ? a.name : (a.pathogen ?? '')).toLowerCase()
      const bv = (sortKey === 'name' ? b.name : (b.pathogen ?? '')).toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
  }

  function getFiltered(): Disease[] {
    if (!query) return allDiseases
    return allDiseases.filter(d =>
      d.name.toLowerCase().includes(query) ||
      (d.pathogen ?? '').toLowerCase().includes(query)
    )
  }

  function updateSortIndicators(): void {
    const nameEl = document.getElementById('sort-name')
    const pathEl = document.getElementById('sort-pathogen')
    if (nameEl) nameEl.textContent = sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'
    if (pathEl) pathEl.textContent = sortKey === 'pathogen' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'
  }

  function renderRows(list: Disease[]): string {
    if (list.length === 0) {
      return `<tr><td colspan="2" class="px-4 py-6 text-gray-400 text-center">${t('catalogue.empty')}</td></tr>`
    }
    return list.map(d => /*html*/`
      <tr class="hover:bg-gray-50">
        <td class="px-4 py-2">${d.name}</td>
        <td class="px-4 py-2 text-gray-500 italic truncate max-w-xs" title="${d.pathogen ?? ''}">${d.pathogen ?? '—'}</td>
      </tr>
    `).join('')
  }

  function refresh(): void {
    const tbody = document.getElementById('catalogue-list')
    if (tbody) tbody.innerHTML = renderRows(getSorted(getFiltered()))
    updateSortIndicators()
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
}
