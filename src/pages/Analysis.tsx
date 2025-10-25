
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '../components/ui'
import { FileUploadZone } from '../components/upload'
import AnalysisList from '../components/AnalysisList'
import { useAnalysisStore } from '../stores/analysisStoreSupabase'
import { useCurrentUser } from '../hooks/useCurrentUser'

const Analysis: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { supabaseUserId, isLoaded, isSignedIn, loading, error } = useCurrentUser()
  const { analyses } = useAnalysisStore()
  
  // Debug logging
  console.log('🔍 Analysis component loaded:', { supabaseUserId, isLoaded, isSignedIn, loading, error })

  // Show loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie użytkownika...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Błąd ładowania użytkownika</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Odśwież stronę
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Analizy
        </h1>
        <p className="text-neutral-600">
          Zarządzaj analizami zestawów produktów
        </p>
      </div>

      {/* Upload Zone - używa wspólnego komponentu */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Nowa analiza
          </h2>
        </CardHeader>
        <CardBody>
          <FileUploadZone 
            navigateToDashboard={false}
            onSuccess={(analysisId) => {
              // Przekieruj do szczegółów analizy
              const basePath = location.pathname.startsWith('/paleta') ? '/paleta' : ''
              navigate(`${basePath}/analysis/${analysisId}`)
            }}
          />
        </CardBody>
      </Card>

      {/* Analysis List */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Wykonane analizy
          </h2>
        </CardHeader>
        <CardBody>
          <AnalysisList analyses={analyses} />
        </CardBody>
      </Card>
    </div>
  )
}

export default Analysis
