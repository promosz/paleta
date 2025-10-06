import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import SettingsPage from './pages/SettingsPage'
import AnalysisDetailPage from './pages/AnalysisDetailPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
      </Routes>
    </Layout>
  )
}

export default App

