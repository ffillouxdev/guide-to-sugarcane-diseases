import './style.css'
import { applyBrowserLanguage, initRouter, navigateTo } from './router'
import { initOffline } from './layout'
import { showWelcomePopup } from './components/welcome_popup'

const app = document.querySelector<HTMLDivElement>('#app')!
applyBrowserLanguage()
initRouter(app)
initOffline()
showWelcomePopup((path) => navigateTo(path, app))
