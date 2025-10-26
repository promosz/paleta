
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Import funkcji testowych (tylko w trybie deweloperskim gdy Supabase jest skonfigurowane)
if (import.meta.env.DEV) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (supabaseUrl && supabaseAnonKey) {
    import('./utils/testSupabase')
  }
}

// Get Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk is configured (exclude placeholder values)
const isClerkConfigured = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY !== 'YOUR_PUBLISHABLE_KEY_HERE' && 
  PUBLISHABLE_KEY !== 'pk_test_your_key_here' &&
  PUBLISHABLE_KEY.startsWith('pk_')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignInUrl="/dashboard"
        afterSignOutUrl="/"
      >
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

