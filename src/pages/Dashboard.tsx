import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardHeader, CardBody, Button } from '../components/ui'
import { DashboardStats } from '../components/dashboard'
import { AnalysisList, AnalysisDetails } from '../components/analysis'
import { useAnalysisStore } from '../stores/analysisStoreSupabase'
import { useCurrentUser } from '../hooks/useCurrentUser'
import type { Analysis } from '../types/analysis'

const Dashboard: React.FC = () => {
  const location = useLocation()
  const { supabaseUserId, loading: userLoading } = useCurrentUser()
  const { 
    analyses, 
    dashboardStats, 
    createAnalysis, 
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

  // Obsługa tworzenia nowej analizy
  const handleCreateAnalysis = async () => {
    if (!supabaseUserId) {
      console.error('Brak userId - użytkownik nie jest zalogowany')
      return
    }
    const newAnalysis = await createAnalysis(
      `Analiza ${new Date().toLocaleDateString('pl-PL')}`,
      'Nowa analiza utworzona z dashboard',
      'file_upload',
      supabaseUserId
    )
    setSelectedAnalysis(newAnalysis)
  }

  // Obsługa wyboru analizy
  const handleSelectAnalysis = (analysis: Analysis) => {
    setSelectedAnalysis(analysis)
  }

  // Obsługa zamknięcia szczegółów
  const handleCloseDetails = () => {
    setSelectedAnalysis(null)
  }

  // Obsługa edycji analizy
  const handleEditAnalysis = (analysis: Analysis) => {
    setSelectedAnalysis(analysis)
  }

  // Obsługa usuwania analizy
  const handleDeleteAnalysis = (analysis: Analysis) => {
    console.log('Usuwanie analizy:', analysis.name)
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

          {/* Ostatnie analizy */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-neutral-800">
                  Ostatnie analizy
                </h2>
                <Button
                  variant="primary"
                  onClick={handleCreateAnalysis}
                >
                  ➕ Nowa analiza
                </Button>
              </div>
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
                Utwórz pierwszą analizę aby rozpocząć pracę
              </p>
              <Button 
                variant="primary"
                onClick={handleCreateAnalysis}
              >
                Rozpocznij analizę
              </Button>
            </div>
          ) : (
            <AnalysisList
              analyses={analyses.slice(0, 5)} // Pokaż tylko 5 ostatnich
              onSelect={handleSelectAnalysis}
              onEdit={handleEditAnalysis}
              onDelete={handleDeleteAnalysis}
            />
          )}
        </CardBody>
      </Card>

      {/* Szybkie akcje */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Szybkie akcje
          </h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
              onClick={handleCreateAnalysis}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="font-medium text-primary-700">Nowa analiza</div>
                <div className="text-sm text-primary-600">Rozpocznij analizę plików</div>
              </div>
            </button>
            
            <button className="p-4 bg-success-50 hover:bg-success-100 rounded-lg transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-success-700">Raport</div>
                <div className="text-sm text-success-600">Wygeneruj raport</div>
              </div>
            </button>
            
            <button className="p-4 bg-warning-50 hover:bg-warning-100 rounded-lg transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-medium text-warning-700">Ustawienia</div>
                <div className="text-sm text-warning-600">Konfiguracja reguł</div>
              </div>
            </button>
          </div>
        </CardBody>
      </Card>
        </>
      )}
    </div>
  )
}

export default Dashboard
