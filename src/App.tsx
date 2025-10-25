
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import PreLaunchPage from './pages/PreLaunchPage'
import HomePage from './pages/HomePage'
import Analysis from './pages/Analysis'
import Dashboard from './pages/Dashboard'
import Rules from './pages/Rules'
import SettingsPage from './pages/SettingsPage'
import AnalysisDetailPage from './pages/AnalysisDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import HelpPage from './pages/HelpPage'
import AboutPage from './pages/AboutPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isSignedIn } = useAuth()

  return (
    <Routes>
      {/* Landing Page - without layout */}
      <Route 
        path="/" 
        element={
          isSignedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />
        } 
      />

      {/* GitHub Pages base path route */}
      <Route 
        path="/paleta" 
        element={
          isSignedIn ? <Navigate to="/paleta/dashboard" replace /> : <LandingPage />
        } 
      />

      {/* Public routes - no layout */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      
      {/* Pre-launch page - standalone (no layout) */}
      <Route path="/pre-launch" element={<PreLaunchPage />} />
      <Route path="/paleta/pre-launch" element={<PreLaunchPage />} />
      
      {/* Routes with layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            {/* Home - protected */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/analysis" 
              element={
                <ProtectedRoute>
                  <Analysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/paleta/analysis" 
              element={
                <ProtectedRoute>
                  <Analysis />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/paleta/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rules" 
              element={
                <ProtectedRoute>
                  <Rules />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/paleta/rules" 
              element={
                <ProtectedRoute>
                  <Rules />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/paleta/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analysis/:analysisId/product/:productIndex" 
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/paleta/analysis/:analysisId/product/:productIndex" 
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
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
            <Route 
              path="/paleta/analysis/:id" 
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

