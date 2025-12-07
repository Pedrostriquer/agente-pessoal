import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'; // Importe aqui

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider> {/* Envolva o App */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)