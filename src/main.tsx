import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Import funkcji testowych (tylko w trybie deweloperskim)
if (import.meta.env.DEV) {
  import('./utils/testSupabase')
}

// Get Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk is configured
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'YOUR_PUBLISHABLE_KEY_HERE'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </React.StrictMode>,
)

