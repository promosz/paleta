import { useCallback, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUploadStore, validateFile } from '../stores/uploadStore'
import { useAnalysisStore } from '../stores/analysisStoreSupabase'
import { useCurrentUser } from './useCurrentUser'
import { parserService } from '../utils/parserService'
import { supabaseProductsService } from '../services/supabaseProductsService'

/**
 * Hook do obsługi uploadu i analizy plików
 * Zapewnia spójną funkcjonalność w całej aplikacji
 */
export const useFileAnalysis = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { supabaseUserId, isLoaded, isSignedIn } = useCurrentUser()
  
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
  
  const { createAnalysis } = useAnalysisStore()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Główna funkcja przetwarzania plików
   */
  const processFiles = useCallback(async (files: File[]) => {
    if (!supabaseUserId) {
      setError('Brak userId - użytkownik nie jest zalogowany')
      console.error('❌ Brak userId - użytkownik nie jest zalogowany')
      return null
    }

    setIsProcessing(true)
    setError(null)
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
      if (currentParsedProducts.length === 0) {
        throw new Error('Nie znaleziono produktów do analizy')
      }

      console.log('🎯 Rozpoczynam ocenę produktów...')
      await evaluateProducts()
      
      // Utwórz analizę z produktami - użyj nazwy pierwszego pliku
      const analysisName = files.length === 1 
        ? files[0].name.replace(/\.[^/.]+$/, "") // Usuń rozszerzenie
        : `${files[0].name.replace(/\.[^/.]+$/, "")} i ${files.length - 1} innych`
      
      // Konwersja przetworzonych plików na AnalysisFile
      const analysisFiles = processedFiles.map(({ file, result, fileId }) => ({
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        status: 'completed' as const,
        productCount: result.products.length
      }))
      
      console.log('🚀 Tworzenie analizy z plikami:', analysisFiles.length)
      console.log('📁 Pliki:', analysisFiles.map(f => ({ name: f.name, size: f.size })))
      
      // Tworzenie analizy
      const analysis = await createAnalysis(
        analysisName,
        `Analiza utworzona automatycznie z ${files.map(f => f.name).join(', ')}`,
        'file_upload',
        supabaseUserId,
        analysisFiles
      )
      
      console.log('✅ Analiza utworzona:', analysis.id)
      
      // Zapisz produkty do bazy danych
      console.log('💾 Zapisuję produkty do bazy danych...')
      const currentEvaluations = getAllEvaluations()
      console.log('📊 Produkty:', currentParsedProducts.length, 'Oceny:', currentEvaluations.length)
      
      try {
        const savedProducts = await supabaseProductsService.addProducts(
          currentParsedProducts,
          analysis.id,
          supabaseUserId,
          currentEvaluations
        )
        
        console.log('✅ Produkty zapisane w bazie:', savedProducts.length)
        
        // Aktualizuj statystyki analizy
        const stats = await supabaseProductsService.getProductStats(analysis.id, supabaseUserId)
        console.log('📈 Statystyki:', stats)
        
      } catch (error) {
        console.error('❌ Błąd zapisu produktów:', error)
        // Nie przerywamy - analiza jest utworzona, produkty można dodać później
      }

      return {
        analysis,
        processedFiles: processedFiles.map(pf => ({
          name: pf.file.name,
          size: pf.file.size,
          type: pf.file.type,
          productsCount: pf.result.products.length,
          fileId: pf.fileId
        }))
      }
    } catch (error) {
      console.error('Błąd przetwarzania plików:', error)
      setError(error instanceof Error ? error.message : 'Błąd przetwarzania plików')
      return null
    } finally {
      setIsProcessing(false)
      setUploading(false)
      setParsing(false)
    }
  }, [supabaseUserId, getAllParsedProducts, getAllEvaluations, evaluateProducts, addFiles, setParsing, setParseResult, setUploading, createAnalysis])

  /**
   * Funkcja obsługująca drop/upload plików
   */
  const handleFileDrop = useCallback(async (acceptedFiles: File[], options?: {
    navigateToDashboard?: boolean
    onSuccess?: (analysisId: string) => void
  }) => {
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
      setError(errors.join('\n'))
    }

    if (validFiles.length === 0) return

    // Dodaj pliki do store
    addFiles(validFiles)
    
    // Rozpocznij przetwarzanie
    const result = await processFiles(validFiles)
    
    if (result) {
      // Wywołaj callback sukcesu jeśli jest podany
      if (options?.onSuccess) {
        options.onSuccess(result.analysis.id)
      }
      
      // Nawiguj do Dashboard jeśli jest wymagane
      if (options?.navigateToDashboard) {
        const dashboardPath = location.pathname.startsWith('/paleta') ? '/paleta/dashboard' : '/dashboard'
        navigate(dashboardPath, { 
          state: { 
            selectedAnalysisId: result.analysis.id,
            processedFiles: result.processedFiles
          }
        })
      }
    }
  }, [addFiles, processFiles, navigate, location])

  return {
    handleFileDrop,
    processFiles,
    isProcessing,
    isEvaluating,
    error,
    isLoaded,
    isSignedIn,
    supabaseUserId
  }
}

