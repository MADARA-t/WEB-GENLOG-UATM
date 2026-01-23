if (window.location.hostname === "web-genlog-uatm-11.netlify.app") {
  window.location.replace("https://setice.onrender.com");
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
