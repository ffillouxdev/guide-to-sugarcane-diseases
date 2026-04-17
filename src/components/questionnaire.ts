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

function renderQuestion(): string {
  if (!state.key) return ''

  const node = state.key.nodes[state.currentNodeId]
  if (!node) return ''

  const buttons = node.options.map(opt => questionButton(opt.label, opt.next)).join('')

  return /*html*/`
    ${breadcrumb(state.history)}
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
      ${node.text}
    </h1>
    <div class="flex flex-col gap-3 mx-auto">
      ${buttons}
    </div>
  `
}

function renderDisease(): string {
  if (!state.key) return ''

  const disease = state.key.diseases[state.currentNodeId]
  if (!disease) return ''

  return diseaseResult(disease, { topSlot: breadcrumb(state.history) })
}

function update(): void {
  const container = document.getElementById('questionnaire')
  if (!container) return

  const isDisease = state.currentNodeId.startsWith('D_')
  container.innerHTML = isDisease ? renderDisease() : renderQuestion()

  if (isDisease && state.key) {
    const disease = state.key.diseases[state.currentNodeId]
    if (disease) bindCarousel(container, disease.image ?? [])
  }
}

function navigateTo(nodeId: string, label: string): void {
  state.currentNodeId = nodeId

  // For diseases, add result item to breadcrumb only
  if (nodeId.startsWith('D_') && state.key) {
    const diseaseName = state.key.diseases[nodeId]?.name || label
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
