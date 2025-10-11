import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import AnalysisDetailPage from './pages/AnalysisDetailPage'
import HelpPage from './pages/HelpPage'
import AboutPage from './pages/AboutPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isSignedIn } = useAuth()

  return (
    <Routes>
      {/* Public routes - no layout */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      
      {/* Routes with layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            {/* Root redirect based on auth status */}
            <Route 
              path="/" 
              element={
                isSignedIn ? <HomePage /> : <Navigate to="/about" replace />
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analysis/:id" 
              element={
                <ProtectedRoute>
                  <AnalysisDetailPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Public routes */}
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App

