import './style.css'
import { initRouter } from './router'
import { initOffline } from './layout'

const app = document.querySelector<HTMLDivElement>('#app')!
initRouter(app)
initOffline()
