import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Card, CardHeader, CardBody, StatusBadge, Button } from '../components/ui'
import { useUploadStore, validateFile } from '../stores/uploadStore'
import { useAnalysisStore } from '../stores/analysisStore'
import { parserService } from '../utils/parserService'

const Analysis: React.FC = () => {
  const navigate = useNavigate()
  const { 
    getAllParsedProducts, 
    getAllEvaluations, 
    evaluateProducts, 
    isEvaluating,
    addFiles,
    setParsing,
    setParseResult,
    setUploading
  } = useUploadStore()
  const { analyses, createAnalysis, addProductsToAnalysis, addEvaluationsToAnalysis } = useAnalysisStore()

  // Funkcja obsługująca automatyczny upload i analizę
  const handleFileDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    // Walidacja plików
    const validFiles: File[] = []
    const errors: string[] = []

    acceptedFiles.forEach(file => {
      const validation = validateFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })

    if (errors.length > 0) {
      console.warn('Błędy walidacji plików:', errors)
      // TODO: Dodać toast notifications
    }

    if (validFiles.length === 0) return

    // Dodaj pliki do store
    addFiles(validFiles)
    
    // Rozpocznij automatyczny upload i parsowanie
    await processFiles(validFiles)
  }, [addFiles])

  // Funkcja przetwarzania plików
  const processFiles = async (files: File[]) => {
    setUploading(true)
    setParsing(true)

    try {
      const processedFiles: { file: File; result: any; fileId: string }[] = []

      // Symulacja uploadu i parsowania dla każdego pliku
      for (const file of files) {
        // Symulacja postępu uploadu
        await new Promise(resolve => {
          let currentProgress = 0
          const progressInterval = setInterval(() => {
            currentProgress += Math.random() * 15 + 5
            currentProgress = Math.min(currentProgress, 100)
            
            if (currentProgress >= 100) {
              clearInterval(progressInterval)
              resolve(undefined)
            }
          }, 200)
        })

        // Parsowanie pliku
        const result = await parserService.parseFile(
          file,
          (progress, status) => {
            console.log(`Parsowanie ${file.name}: ${progress}% - ${status}`)
          }
        )

        // Zapisanie wyniku parsowania
        const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        setParseResult(fileId, result)
        
        processedFiles.push({ file, result, fileId })
      }

      // Automatyczna ocena produktów po parsowaniu
      const currentParsedProducts = getAllParsedProducts()
      if (currentParsedProducts.length > 0) {
        await evaluateProducts()
        
        // Utwórz analizę z produktami - użyj nazwy pierwszego pliku
        const analysisName = files.length === 1 
          ? files[0].name.replace(/\.[^/.]+$/, "") // Usuń rozszerzenie
          : `${files[0].name.replace(/\.[^/.]+$/, "")} i ${files.length - 1} innych`
        
        const analysis = createAnalysis(
          analysisName,
          `Analiza utworzona automatycznie z ${files.map(f => f.name).join(', ')}`
        )
        
        // Dodaj produkty do analizy
        addProductsToAnalysis(analysis.id, currentParsedProducts)
        
        // Dodaj oceny do analizy
        const currentEvaluations = getAllEvaluations()
        if (currentEvaluations.length > 0) {
          addEvaluationsToAnalysis(analysis.id, currentEvaluations)
        }
        
        // Przekieruj do Dashboard z otwartą analizą i informacją o sparsowanych plikach
        navigate('/dashboard', { 
          state: { 
            selectedAnalysisId: analysis.id,
            processedFiles: processedFiles.map(pf => ({
              name: pf.file.name,
              size: pf.file.size,
              type: pf.file.type,
              productsCount: pf.result.products.length,
              fileId: pf.fileId
            }))
          } 
        })
      }
    } catch (error) {
      console.error('Błąd przetwarzania plików:', error)
    } finally {
      setUploading(false)
      setParsing(false)
    }
  }

  // Konfiguracja react-dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    multiple: true,
    disabled: isEvaluating
  })


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

      {/* Dropzone Section */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold text-neutral-800">
            Nowa analiza
          </h2>
        </CardHeader>
        <CardBody>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive && !isDragReject
                ? 'border-primary-500 bg-primary-50 text-primary-600'
                : isDragReject
                ? 'border-danger-500 bg-danger-50 text-danger-600'
                : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
              }
              ${isEvaluating ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              {/* Ikona uploadu */}
              <div className="mx-auto w-16 h-16 text-neutral-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              {/* Tekst instrukcji */}
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Upuść pliki tutaj...'
                    : 'Przeciągnij pliki tutaj lub kliknij aby wybrać'}
                </p>
                <p className="text-sm text-neutral-600 mt-2">
                  Obsługiwane formaty: XLSX, XLS, CSV, PDF
                </p>
                <p className="text-sm text-neutral-500">
                  Maksymalny rozmiar: 10MB na plik • Automatyczna analiza po wskazaniu
                </p>
              </div>

              {/* Przycisk wyboru plików */}
              {!isEvaluating && (
                <Button variant="secondary" size="sm">
                  Wybierz pliki
                </Button>
              )}
            </div>
          </div>
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
                {analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
                    onClick={() => navigate('/dashboard', { 
                      state: { selectedAnalysisId: analysis.id } 
                    })}
                  >
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
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Analysis
