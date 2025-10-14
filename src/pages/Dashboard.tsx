import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody } from '../components/ui'
import { DashboardStats } from '../components/dashboard'
import { AnalysisDetails } from '../components/analysis'
import AnalysisList from '../components/AnalysisList'
import { FileUploadZone } from '../components/upload'
import { useAnalysisStore } from '../stores/analysisStoreSupabase'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Analysis } from '../types/analysis'

const Dashboard: React.FC = () => {
  const location = useLocation()
  const { supabaseUserId, loading: userLoading } = useCurrentUser()
  const { 
    analyses, 
    dashboardStats, 
    updateDashboardStats,
    loadAnalyses,
    loading: analysisLoading
  } = useAnalysisStore()
  
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null)
  const [processedFiles, setProcessedFiles] = useState<any[]>([])

  // Ładowanie analiz z Supabase przy starcie
  useEffect(() => {
    if (supabaseUserId && !userLoading) {
      console.log('Dashboard: Ładowanie analiz dla użytkownika:', supabaseUserId)
      loadAnalyses(supabaseUserId)
    }
  }, [supabaseUserId, userLoading, loadAnalyses])

  // Aktualizacja statystyk przy załadowaniu
  useEffect(() => {
    updateDashboardStats()
  }, [analyses, updateDashboardStats])

  // Obsługa przekierowania z otwartą analizą
  React.useEffect(() => {
    const selectedAnalysisId = location.state?.selectedAnalysisId
    const filesFromState = location.state?.processedFiles
    
    if (selectedAnalysisId) {
      const analysis = analyses.find(a => a.id === selectedAnalysisId)
      if (analysis) {
        console.log('Dashboard: Otwieranie analizy z przekierowania:', analysis.id)
        console.log('Dashboard: Sparsowane pliki:', filesFromState)
        setSelectedAnalysis(analysis)
        setProcessedFiles(filesFromState || [])
      }
    }
  }, [location.state, analyses])

  // Obsługa sukcesu uploadu
  const handleUploadSuccess = (analysisId: string) => {
    // Odśwież listę analiz
    if (supabaseUserId) {
      loadAnalyses(supabaseUserId)
    }
    
    // Otwórz nowo utworzoną analizę
    const analysis = analyses.find(a => a.id === analysisId)
    if (analysis) {
      setSelectedAnalysis(analysis)
    }
  }

  // Obsługa zamknięcia szczegółów
  const handleCloseDetails = () => {
    setSelectedAnalysis(null)
  }

  if (selectedAnalysis) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-2">
            Szczegóły analizy
          </h1>
          <p className="text-neutral-600">
            {selectedAnalysis.name}
          </p>
        </div>
        
        <AnalysisDetails
          analysis={selectedAnalysis}
          onClose={handleCloseDetails}
          processedFiles={processedFiles}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">
          Dashboard
        </h1>
        <p className="text-neutral-600">
          Przegląd analiz i statystyk
        </p>
      </div>

      {/* Wskaźnik ładowania */}
      {(userLoading || analysisLoading) && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-neutral-600">Ładowanie danych...</p>
        </div>
      )}

      {!userLoading && !analysisLoading && (
        <>
          {/* Statystyki dashboard */}
          <DashboardStats
            stats={dashboardStats}
            className="mb-8"
          />

          {/* Upload Zone - dodawanie nowych plików */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-800">
                Dodaj pliki do analizy
              </h2>
            </CardHeader>
            <CardBody>
              <FileUploadZone 
                navigateToDashboard={false}
                onSuccess={handleUploadSuccess}
                showButton={true}
              />
            </CardBody>
          </Card>

          {/* Ostatnie analizy */}
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-neutral-800">
                Ostatnie analizy
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
                Przeciągnij plik powyżej aby rozpocząć pierwszą analizę
              </p>
            </div>
          ) : (
            <AnalysisList
              analyses={analyses.slice(0, 5)} // Pokaż tylko 5 ostatnich
            />
          )}
        </CardBody>
      </Card>
        </>
      )}
    </div>
  )
}

export default Dashboard
