import { loadKey, type IdentificationKey } from '../data/key-loader'
import { questionButton } from './question_button'
import { breadcrumb, type BreadcrumbItem } from './breadcrumb'

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

  return /*html*/`
    ${breadcrumb(state.history)}
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
      ${disease.name}
    </h1>
    ${disease.pathogen ? /*html*/`<p class="text-sm text-gray-600 text-center mb-4"><em>${disease.pathogen}</em></p>` : ''}
  `
}

function update(): void {
  const container = document.getElementById('questionnaire')
  if (!container) return

  const isDisease = state.currentNodeId.startsWith('D_')
  container.innerHTML = isDisease ? renderDisease() : renderQuestion()
}

function navigateTo(nodeId: string, label: string): void {
  state.history.push({ label, nodeId })
  state.currentNodeId = nodeId
  update()
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
    const label = btn.textContent?.trim() ?? ''
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
