import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ComplaintProvider } from './context/ComplaintContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ComplaintProvider>
      <BrowserRouter>
    <App />
    </BrowserRouter>
    </ComplaintProvider>
    </AuthProvider>
  </StrictMode>,
)
