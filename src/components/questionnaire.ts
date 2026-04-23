import { useT } from '../i18n'
import { loadKey, type IdentificationKey } from '../data/key-loader'
import { questionButton } from './question_button'
import { breadcrumb, type BreadcrumbItem } from './breadcrumb'
import { diseaseResult, bindCarousel } from './disease_result'

interface State {
  key: IdentificationKey | null
  currentNodeId: string
  history: BreadcrumbItem[]
  listenerAttached: boolean
}

const state: State = {
  key: null,
  currentNodeId: 'root',
  history: [],
  listenerAttached: false,
}

function backButton(): string {
  if (state.history.length === 0) return ''
  const t = useT()
  return /*html*/`
    <button type="button" data-go-back
      class="inline-flex items-center gap-1.5 px-4 py-2 mb-3 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors shadow-sm">
      ${t('questionnaire.prevQuestion')}
    </button>
  `
}

function goBack(): void {
  if (state.history.length <= 1) {
    navigateToBreadcrumb('root')
  } else {
    const prev = state.history[state.history.length - 2]
    navigateToBreadcrumb(prev.nodeId)
  }
}

function renderQuestion(): string {
  if (!state.key) return ''

  const node = state.key.nodes[state.currentNodeId]
  if (!node) return ''

  const buttons = node.options.map(opt => questionButton(opt.label, opt.next)).join('')

  return /*html*/`
    ${backButton()}
    ${breadcrumb(state.history)}
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
      ${node.text}
    </h1>
    <div class="flex flex-col gap-3 mx-auto">
      ${buttons}
    </div>
  `
}

function lookupDisease(id: string) {
  if (!state.key) return undefined
  return state.key.diseases[id] ?? state.key.other_causes?.[id]
}

function renderDisease(): string {
  const disease = lookupDisease(state.currentNodeId)
  if (!disease) return ''

  return diseaseResult(disease, { topSlot: backButton() + breadcrumb(state.history) })
}

function update(): void {
  const container = document.getElementById('questionnaire')
  if (!container) return

  const isDisease = state.currentNodeId.startsWith('D_')
  const html = isDisease ? renderDisease() : renderQuestion()

  // Create temporary container and parse HTML to preserve event listeners on container
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Replace container's children while keeping the container itself intact
  container.replaceChildren(...temp.childNodes)

  if (isDisease) {
    const disease = lookupDisease(state.currentNodeId)
    if (disease) bindCarousel(container, disease.image ?? [])
  }
}

function navigateTo(nodeId: string, label: string): void {
  state.currentNodeId = nodeId

  // For diseases, add result item to breadcrumb only
  if (nodeId.startsWith('D_') && state.key) {
    const diseaseName = lookupDisease(nodeId)?.name || label
    const resultLabel = `result_${diseaseName.replace(/\s+/g, '_')}`
    state.history.push({ label: resultLabel, nodeId })
  } else {
    state.history.push({ label, nodeId })
  }

  update()
}

function truncateBreadcrumbLabel(label: string, maxLength: number = 40): string {
  // Find first punctuation mark (period, comma, semicolon)
  const punctIndex = label.search(/[.,;]/)
  if (punctIndex > 0 && punctIndex < maxLength) {
    return label.substring(0, punctIndex)
  }
  // Otherwise truncate at maxLength
  if (label.length > maxLength) {
    return label.substring(0, maxLength)
  }
  return label
}

function navigateToBreadcrumb(nodeId: string): void {
  if (nodeId === 'root') {
    state.history = []
    state.currentNodeId = 'root'
  } else {
    const idx = state.history.findIndex(item => item.nodeId === nodeId)
    if (idx >= 0) {
      state.history = state.history.slice(0, idx + 1)
      state.currentNodeId = nodeId
    }
  }
  update()
}

function handleClick(e: MouseEvent): void {
  // Handle back button click
  if ((e.target as HTMLElement).closest('[data-go-back]')) {
    e.preventDefault()
    e.stopPropagation()
    goBack()
    return
  }

  // Handle question button click
  const btn = (e.target as HTMLElement).closest('.question-btn') as HTMLElement | null
  if (btn) {
    const next = btn.dataset.next
    let label = btn.textContent?.trim() ?? ''
    // Truncate label for breadcrumb (only for questions, not diseases)
    if (next && !next.startsWith('D_')) {
      label = truncateBreadcrumbLabel(label)
    }
    if (next) navigateTo(next, label)
    return
  }

  // Handle breadcrumb click — stop propagation so the router doesn't intercept
  const crumb = (e.target as HTMLElement).closest('[data-breadcrumb]') as HTMLElement | null
  if (crumb) {
    e.preventDefault()
    e.stopPropagation()
    const nodeId = crumb.dataset.breadcrumb
    if (nodeId) navigateToBreadcrumb(nodeId)
  }
}

export async function initQuestionnaire(): Promise<void> {
  // Reset state on each home render
  state.currentNodeId = 'root'
  state.history = []
  state.listenerAttached = false

  state.key = await loadKey()
  update()

  const container = document.getElementById('questionnaire')
  if (!container || state.listenerAttached) return

  container.addEventListener('click', handleClick)
  state.listenerAttached = true
}
