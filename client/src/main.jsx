import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Set initial theme class
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme') || 'dark'
  document.documentElement.classList.add(theme)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
