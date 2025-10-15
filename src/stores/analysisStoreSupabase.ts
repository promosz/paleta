import { create } from 'zustand'
import { supabaseAnalysisService } from '../services/supabaseAnalysisService'
import type { 
  Analysis, 
  AnalysisFile, 
  AnalysisFilters,
  AnalysisSorting,
  AnalysisExport,
  ExportResult,
  DashboardStats,
  AnalysisStatus,
  AnalysisType
} from '../types/analysis'
import type { ParsedProduct } from '../types/parser'
import type { ProductEvaluation } from '../types/rules'

// Interfejs stanu store
interface AnalysisState {
  // Stan
  analyses: Analysis[]
  currentAnalysis: Analysis | null
  dashboardStats: DashboardStats
  loading: boolean
  error: string | null
  
  // Filtry i sortowanie
  filters: AnalysisFilters
  sorting: AnalysisSorting
  
  // Akcje CRUD - TERAZ WYMAGAJĄ userId
  createAnalysis: (name: string, description: string | undefined, type: AnalysisType | undefined, userId: string, files?: AnalysisFile[]) => Promise<Analysis>
  updateAnalysis: (id: string, updates: Partial<Analysis>, userId: string) => Promise<void>
  deleteAnalysis: (id: string, userId: string) => Promise<void>
  duplicateAnalysis: (id: string, userId: string) => Promise<Analysis>
  
  // Zarządzanie plikami
  addFileToAnalysis: (analysisId: string, file: AnalysisFile, userId: string) => Promise<void>
  removeFileFromAnalysis: (analysisId: string, fileId: string, userId: string) => Promise<void>
  updateFileStatus: (analysisId: string, fileId: string, status: AnalysisFile['status'], userId: string, error?: string) => Promise<void>
  
  // Zarządzanie produktami
  addProductsToAnalysis: (analysisId: string, products: ParsedProduct[]) => Promise<void>
  addEvaluationsToAnalysis: (analysisId: string, evaluations: ProductEvaluation[]) => Promise<void>
  
  // Aktualizacja statystyk
  updateAnalysisStats: (analysisId: string) => Promise<void>
  updateDashboardStats: () => Promise<void>
  
  // Filtry i sortowanie
  setFilters: (filters: Partial<AnalysisFilters>) => void
  setSorting: (sorting: AnalysisSorting) => void
  getFilteredAnalyses: () => Analysis[]
  
  // Eksport
  exportAnalysis: (analysisId: string, options: AnalysisExport) => Promise<ExportResult>
  exportAllAnalyses: (options: AnalysisExport) => Promise<ExportResult>
  
  // Pobieranie danych
  getAnalysis: (id: string) => Analysis | undefined
  getAnalysesByStatus: (status: AnalysisStatus) => Analysis[]
  getAnalysesByType: (type: AnalysisType) => Analysis[]
  getRecentAnalyses: (limit?: number) => Analysis[]
  
  // Ładowanie danych
  loadAnalyses: (userId: string) => Promise<void>
  loadAnalysis: (id: string, userId: string) => Promise<void>
  
  // Czyszczenie
  clearAnalyses: () => void
  clearCurrentAnalysis: () => void
  clearError: () => void
}

// Tworzenie store
export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // Stan początkowy
  analyses: [],
  currentAnalysis: null,
  dashboardStats: {
    totalAnalyses: 0,
    completedAnalyses: 0,
    failedAnalyses: 0,
    pendingAnalyses: 0,
    totalProducts: 0,
    averageProductsPerAnalysis: 0,
    totalRules: 0,
    activeRules: 0,
    averageProcessingTime: 0,
    analysesTrend: {
      last7Days: 0,
      last30Days: 0,
      growth: 0
    },
    topCategories: [],
    topRules: []
  },
  loading: false,
  error: null,
  filters: {},
  sorting: {
    field: 'createdAt',
    direction: 'desc'
  },

  // Ładowanie analiz
  loadAnalyses: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const analyses = await supabaseAnalysisService.getAnalyses(userId)
      set({ analyses, loading: false })
      get().updateDashboardStats()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analyses'
      set({ error: errorMessage, loading: false })
      console.error('Error loading analyses:', error)
    }
  },

  // Ładowanie pojedynczej analizy
  loadAnalysis: async (id: string, userId: string) => {
    set({ loading: true, error: null })
    try {
      const analysis = await supabaseAnalysisService.getAnalysis(id, userId)
      set({ currentAnalysis: analysis, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error loading analysis:', error)
    }
  },

  // Tworzenie nowej analizy
  createAnalysis: async (name, description, type = 'file_upload', userId, files = []) => {
    set({ loading: true, error: null })
    try {
      
      const newAnalysis: Omit<Analysis, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        description,
        type,
        status: 'pending',
        files: files,
        products: [],
        totalProducts: 0,
        validProducts: 0,
        invalidProducts: 0,
        evaluations: [],
        averageScore: 0,
        stats: {
          totalProducts: 0,
          validProducts: 0,
          invalidProducts: 0,
          averageScore: 0,
          blockedProducts: 0,
          warningProducts: 0,
          okProducts: 0,
          categoryStats: {},
          priceStats: {
            min: 0,
            max: 0,
            average: 0,
            median: 0,
            total: 0
          },
          rulesStats: {
            totalRules: 0,
            activeRules: 0,
            appliedRules: 0
          },
          processingTime: 0,
          filesProcessed: 0
        },
        metadata: {
          version: '1.0.0',
          rulesVersion: '1.0.0',
          parserVersion: '1.0.0',
          tags: [],
          notes: ''
        }
      }
      
      console.log('🔧 Tworzenie analizy w Supabase:', { name, userId, filesCount: files.length })
      const createdAnalysis = await supabaseAnalysisService.createAnalysis(newAnalysis, userId)
      console.log('✅ Analiza utworzona w Supabase:', createdAnalysis.id)
      
      set(state => ({
        analyses: [createdAnalysis, ...state.analyses],
        loading: false
      }))
      
      get().updateDashboardStats()
      return createdAnalysis
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error creating analysis:', error)
      throw error
    }
  },

  // Aktualizacja analizy
  updateAnalysis: async (id, updates, userId) => {
    set({ loading: true, error: null })
    try {
      await supabaseAnalysisService.updateAnalysis(id, updates, userId)
      
      set(state => ({
        analyses: state.analyses.map(analysis =>
          analysis.id === id
            ? { ...analysis, ...updates, updatedAt: new Date() }
            : analysis
        ),
        currentAnalysis: state.currentAnalysis?.id === id
          ? { ...state.currentAnalysis, ...updates, updatedAt: new Date() }
          : state.currentAnalysis,
        loading: false
      }))
      
      get().updateDashboardStats()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error updating analysis:', error)
      throw error
    }
  },

  // Usuwanie analizy
  deleteAnalysis: async (id, userId) => {
    set({ loading: true, error: null })
    try {
      await supabaseAnalysisService.deleteAnalysis(id, userId)
      
      set(state => ({
        analyses: state.analyses.filter(analysis => analysis.id !== id),
        currentAnalysis: state.currentAnalysis?.id === id ? null : state.currentAnalysis,
        loading: false
      }))
      
      get().updateDashboardStats()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting analysis:', error)
      throw error
    }
  },

  // Duplikowanie analizy
  duplicateAnalysis: async (id, userId) => {
    set({ loading: true, error: null })
    try {
      const analysis = get().analyses.find(a => a.id === id)
      if (!analysis) {
        throw new Error('Analysis not found')
      }
      
      const duplicatedAnalysis = await get().createAnalysis(
        `${analysis.name} (kopia)`,
        analysis.description,
        analysis.type,
        userId
      )
      
      // Kopiowanie danych
      await get().updateAnalysis(duplicatedAnalysis.id, {
        files: analysis.files,
        products: analysis.products,
        evaluations: analysis.evaluations,
        metadata: {
          ...analysis.metadata,
          tags: [...analysis.metadata.tags, 'kopia']
        }
      }, userId)
      
      set({ loading: false })
      return duplicatedAnalysis
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error duplicating analysis:', error)
      throw error
    }
  },

  // Dodawanie pliku do analizy
  addFileToAnalysis: async (analysisId, file, userId) => {
    set({ loading: true, error: null })
    try {
      await supabaseAnalysisService.addFilesToAnalysis(analysisId, [file], userId)
      
      set(state => ({
        analyses: state.analyses.map(analysis =>
          analysis.id === analysisId
            ? { 
                ...analysis, 
                files: [...analysis.files, file],
                updatedAt: new Date()
              }
            : analysis
        ),
        loading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add file to analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error adding file to analysis:', error)
      throw error
    }
  },

  // Usuwanie pliku z analizy
  removeFileFromAnalysis: async (analysisId, fileId, userId) => {
    set({ loading: true, error: null })
    try{
      await supabaseAnalysisService.removeFileFromAnalysis(analysisId, fileId, userId)
      
      set(state => ({
        analyses: state.analyses.map(analysis =>
          analysis.id === analysisId
            ? { 
                ...analysis, 
                files: analysis.files.filter(file => file.id !== fileId),
                updatedAt: new Date()
              }
            : analysis
        ),
        loading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove file from analysis'
      set({ error: errorMessage, loading: false })
      console.error('Error removing file from analysis:', error)
      throw error
    }
  },

  // Aktualizacja statusu pliku
  updateFileStatus: async (analysisId, fileId, status, userId, error) => {
    set({ loading: true, error: null })
    try {
      await supabaseAnalysisService.updateFileStatus(analysisId, fileId, status, error, userId)
      
      set(state => ({
        analyses: state.analyses.map(analysis =>
          analysis.id === analysisId
            ? { 
                ...analysis, 
                files: analysis.files.map(file =>
                  file.id === fileId
                    ? { ...file, status, error }
                    : file
                ),
                updatedAt: new Date()
              }
            : analysis
        ),
        loading: false
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update file status'
      set({ error: errorMessage, loading: false })
      console.error('Error updating file status:', error)
      throw error
    }
  },

  // Dodawanie produktów do analizy
  addProductsToAnalysis: async (analysisId, products) => {
    // TODO: Implementować zapisywanie produktów w bazie danych
    set(state => ({
      analyses: state.analyses.map(analysis =>
        analysis.id === analysisId
          ? { 
              ...analysis, 
              products: [...analysis.products, ...products],
              totalProducts: analysis.totalProducts + products.length,
              validProducts: analysis.validProducts + products.length, // TODO: Implement proper validation
              invalidProducts: analysis.invalidProducts,
              updatedAt: new Date()
            }
          : analysis
      )
    }))
    
    get().updateAnalysisStats(analysisId)
  },

  // Dodawanie ocen do analizy
  addEvaluationsToAnalysis: async (analysisId, evaluations) => {
    // TODO: Implementować zapisywanie ocen w bazie danych
    set(state => ({
      analyses: state.analyses.map(analysis =>
        analysis.id === analysisId
          ? { 
              ...analysis, 
              evaluations: [...analysis.evaluations, ...evaluations],
              averageScore: evaluations.length > 0 
                ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length 
                : 0,
              updatedAt: new Date()
            }
          : analysis
      )
    }))
    
    get().updateAnalysisStats(analysisId)
  },

  // Aktualizacja statystyk analizy
  updateAnalysisStats: async (analysisId) => {
    const analysis = get().analyses.find(a => a.id === analysisId)
    if (!analysis) return

    // TODO: Implement stats update in Supabase - Currently disabled
    console.log('Stats update for analysis:', analysisId, '- Currently disabled')
  },

  // Aktualizacja statystyk dashboard
  updateDashboardStats: async () => {
    const analyses = get().analyses
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const stats: DashboardStats = {
      totalAnalyses: analyses.length,
      completedAnalyses: analyses.filter(a => a.status === 'completed').length,
      failedAnalyses: analyses.filter(a => a.status === 'failed').length,
      pendingAnalyses: analyses.filter(a => a.status === 'pending' || a.status === 'in_progress').length,
      totalProducts: analyses.reduce((sum, a) => sum + a.totalProducts, 0),
      averageProductsPerAnalysis: analyses.length > 0 
        ? analyses.reduce((sum, a) => sum + a.totalProducts, 0) / analyses.length 
        : 0,
      totalRules: 0, // TODO: Pobierać z rules store
      activeRules: 0, // TODO: Pobierać z rules store
      averageProcessingTime: analyses.length > 0
        ? analyses.reduce((sum, a) => sum + a.stats.processingTime, 0) / analyses.length
        : 0,
      lastAnalysisAt: analyses.length > 0 ? analyses[0].createdAt : undefined,
      analysesTrend: {
        last7Days: analyses.filter(a => a.createdAt >= last7Days).length,
        last30Days: analyses.filter(a => a.createdAt >= last30Days).length,
        growth: 0 // TODO: Obliczyć wzrost
      },
      topCategories: (() => {
        const categoryCounts = analyses.reduce((acc, analysis) => {
          Object.entries(analysis.stats.categoryStats).forEach(([category, count]) => {
            acc[category] = (acc[category] || 0) + count
          })
          return acc
        }, {} as Record<string, number>)
        
        return Object.entries(categoryCounts)
          .map(([name, count]) => ({
            name,
            count,
            percentage: 0 // TODO: Obliczyć procent
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      })(),
      topRules: [] // TODO: Implementować
    }

    set({ dashboardStats: stats })
  },

  // Ustawianie filtrów
  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }))
  },

  // Ustawianie sortowania
  setSorting: (sorting) => {
    set({ sorting })
  },

  // Pobieranie przefiltrowanych analiz
  getFilteredAnalyses: () => {
    const { analyses, filters, sorting } = get()
    let filtered = [...analyses]

    // Filtrowanie
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(a => filters.status!.includes(a.status))
    }
    
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(a => filters.type!.includes(a.type))
    }
    
    if (filters.dateRange) {
      filtered = filtered.filter(a => 
        a.createdAt >= filters.dateRange!.from && 
        a.createdAt <= filters.dateRange!.to
      )
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(a => 
        filters.tags!.some(tag => a.metadata.tags.includes(tag))
      )
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search)
      )
    }

    // Sortowanie
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sorting.field) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'createdAt':
          aValue = a.createdAt
          bValue = b.createdAt
          break
        case 'updatedAt':
          aValue = a.updatedAt
          bValue = b.updatedAt
          break
        case 'totalProducts':
          aValue = a.totalProducts
          bValue = b.totalProducts
          break
        case 'averageScore':
          aValue = a.averageScore
          bValue = b.averageScore
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sorting.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sorting.direction === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  },

  // Eksport analizy
  exportAnalysis: async (analysisId, options) => {
    const analysis = get().analyses.find(a => a.id === analysisId)
    if (!analysis) {
      return {
        success: false,
        error: 'Analiza nie została znaleziona',
        exportedAt: new Date()
      }
    }

    try {
      // TODO: Implementować eksport
      const fileName = `analysis-${analysis.name}-${new Date().toISOString().split('T')[0]}.${options.format}`
      
      return {
        success: true,
        fileName,
        fileSize: 0, // TODO: Obliczyć rozmiar
        exportedAt: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd',
        exportedAt: new Date()
      }
    }
  },

  // Eksport wszystkich analiz
  exportAllAnalyses: async (options) => {
    try {
      // TODO: Implementować eksport wszystkich analiz
      const fileName = `all-analyses-${new Date().toISOString().split('T')[0]}.${options.format}`
      
      return {
        success: true,
        fileName,
        fileSize: 0, // TODO: Obliczyć rozmiar
        exportedAt: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd',
        exportedAt: new Date()
      }
    }
  },

  // Pobieranie analizy
  getAnalysis: (id) => {
    return get().analyses.find(a => a.id === id)
  },

  // Pobieranie analiz według statusu
  getAnalysesByStatus: (status) => {
    return get().analyses.filter(a => a.status === status)
  },

  // Pobieranie analiz według typu
  getAnalysesByType: (type) => {
    return get().analyses.filter(a => a.type === type)
  },

  // Pobieranie ostatnich analiz
  getRecentAnalyses: (limit = 10) => {
    return get().analyses
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  },

  // Czyszczenie analiz
  clearAnalyses: () => {
    set({ analyses: [] })
    get().updateDashboardStats()
  },

  // Czyszczenie bieżącej analizy
  clearCurrentAnalysis: () => {
    set({ currentAnalysis: null })
  },

  // Czyszczenie błędu
  clearError: () => {
    set({ error: null })
  }
}))
