import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

const root = document.getElementById('root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .catch((err) => console.warn('Service worker registration failed', err))
  })
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  window.dispatchEvent(
    new CustomEvent('app-install-prompt', {
      detail: event,
    }),
  )
})
