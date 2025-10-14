import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Card, CardHeader, CardBody, StatusBadge } from '../components/ui'
import { FileUploadZone } from '../components/upload'
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
          {analyses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Brak analiz
              </h3>
              <p className="text-neutral-500 mb-4">
                Przeciągnij plik powyżej aby rozpocząć automatyczną analizę
              </p>
              <StatusBadge status="info">
                System automatycznie pobierze i przeanalizuje wskazany plik
              </StatusBadge>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Wykonane analizy ({analyses.length})
                </h3>
                <StatusBadge status="success">
                  Kliknij analizę aby zobaczyć szczegóły
                </StatusBadge>
              </div>
              
              <div className="space-y-2">
                {analyses.map((analysis) => {
                  const linkTo = location.pathname.startsWith('/paleta') ? `/paleta/analysis/${analysis.id}` : `/analysis/${analysis.id}`
                  
                  return (
                    <Link
                      key={analysis.id}
                      to={linkTo}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 text-neutral-500">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-base">{analysis.name}</p>
                        <p className="text-sm text-neutral-500">
                          {new Date(analysis.createdAt).toLocaleString('pl-PL')}
                        </p>
                        <p className="text-sm text-primary-600">
                          {analysis.totalProducts} produktów • {analysis.files.length} plików
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <StatusBadge 
                        status={
                          analysis.status === 'completed' ? 'success' :
                          analysis.status === 'in_progress' ? 'warning' :
                          analysis.status === 'failed' ? 'danger' : 'info'
                        }
                      >
                        {analysis.status === 'completed' ? 'Zakończona' :
                         analysis.status === 'in_progress' ? 'W toku' :
                         analysis.status === 'failed' ? 'Błąd' : 'Oczekująca'}
                      </StatusBadge>
                      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Analysis
