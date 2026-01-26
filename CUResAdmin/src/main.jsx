import { StrictMode } from 'react' // Added StrictMode import for development checks
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './firebase.js' // Import firebase config
import { AuthProvider } from './context/AuthContext.jsx' // Import AuthProvider for authentication context
import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter for routing

createRoot(document.getElementById('root')).render(
  /* Added StrictMode for highlighting potential problems in an application */
  <StrictMode> 
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
