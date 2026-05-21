import './style.css'
import { initRouter, render } from './router'
import { initOffline, header, bindHeaderEvents } from './layout'

const headerMount = document.getElementById('header-mount')!
const app = document.querySelector<HTMLDivElement>('#app')!

function refreshHeader(): void {
  headerMount.innerHTML = header()
  bindHeaderEvents(() => {
    refreshHeader()
    render(app)
  })
}

initOffline()
refreshHeader()
initRouter(app)
