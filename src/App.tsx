import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import AnalysisDetailPage from './pages/AnalysisDetailPage'
import HelpPage from './pages/HelpPage'
import AboutPage from './pages/AboutPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <Routes>
      {/* Public routes - no layout */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      
      {/* Protected routes - with layout */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}

export default App

