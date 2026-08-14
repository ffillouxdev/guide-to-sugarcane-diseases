import { useT } from '../i18n'

export interface BreadcrumbItem {
  label: string
  nodeId: string
}

export function breadcrumb(history: BreadcrumbItem[]): string {
  const t = useT()
  const isHomeOnly = history.length === 0
  const home = /*html*/`<a href="#" data-breadcrumb="root" class="${isHomeOnly ? 'font-bold text-green-700' : 'hover:underline'}">${t('nav.home')}</a>`

  const items = history.map((item, i) => {
    const isLast = i === history.length - 1
    if (isLast) {
      return /*html*/`<span class="font-bold text-green-700 truncate max-w-[6rem] sm:max-w-[8rem] md:max-w-[12rem]" title="${item.label}">${item.label}</span>`
    }
    return /*html*/`<a href="#" data-breadcrumb="${item.nodeId}" class="hover:underline truncate max-w-[6rem] sm:max-w-[8rem] md:max-w-[12rem]" title="${item.label}">${item.label}</a>`
  })

  return /*html*/`
    <nav class="text-xs sm:text-sm text-gray-500 mb-4 overflow-hidden">
      ${home}${items.length ? ' &gt; ' + items.join(' &gt; ') : ''}
    </nav>
  `
}
