import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Analysis, 
  AnalysisFile, 
  AnalysisStats, 
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
  
  // Filtry i sortowanie
  filters: AnalysisFilters
  sorting: AnalysisSorting
  
  // Akcje CRUD
  createAnalysis: (name: string, description?: string, type?: AnalysisType) => Analysis
  updateAnalysis: (id: string, updates: Partial<Analysis>) => void
  deleteAnalysis: (id: string) => void
  duplicateAnalysis: (id: string) => void
  
  // Zarządzanie plikami
  addFileToAnalysis: (analysisId: string, file: AnalysisFile) => void
  removeFileFromAnalysis: (analysisId: string, fileId: string) => void
  updateFileStatus: (analysisId: string, fileId: string, status: AnalysisFile['status'], error?: string) => void
  
  // Zarządzanie produktami
  addProductsToAnalysis: (analysisId: string, products: ParsedProduct[]) => void
  addEvaluationsToAnalysis: (analysisId: string, evaluations: ProductEvaluation[]) => void
  
  // Aktualizacja statystyk
  updateAnalysisStats: (analysisId: string) => void
  updateDashboardStats: () => void
  
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
  
  // Czyszczenie
  clearAnalyses: () => void
  clearCurrentAnalysis: () => void
}

// Tworzenie store z persistencją
export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set, get) => ({
      // Stan początkowy z przykładowymi analizami
      analyses: [
        {
          id: 'sample-analysis-1',
          name: 'F20351 FBA MIX FBA PLN',
          description: 'Przykładowa analiza pliku FBA MIX',
          type: 'file_upload' as const,
          status: 'completed' as const,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dni temu
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          files: [
            {
              id: 'file-1',
              name: 'F20351 FBA MIX FBA PLN.xlsx',
              size: 22528,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              status: 'parsed' as const,
              productCount: 45,
              uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
          ],
          products: [
            {
              id: 'prod-1',
              name: 'Produkt 1',
              category: 'Elektronika',
              price: 299.99,
              description: 'Opis produktu 1',
              source: 'F20351 FBA MIX FBA PLN.xlsx',
              rawData: { 'Nazwa': 'Produkt 1', 'Kategoria': 'Elektronika', 'Cena': 299.99 }
            },
            {
              id: 'prod-2',
              name: 'Produkt 2',
              category: 'Dom i ogród',
              price: 149.50,
              description: 'Opis produktu 2',
              source: 'F20351 FBA MIX FBA PLN.xlsx',
              rawData: { 'Nazwa': 'Produkt 2', 'Kategoria': 'Dom i ogród', 'Cena': 149.50 }
            }
          ],
          totalProducts: 45,
          validProducts: 42,
          invalidProducts: 3,
          evaluations: [],
          averageScore: 85,
          stats: {
            totalProducts: 45,
            validProducts: 42,
            invalidProducts: 3,
            averageScore: 85,
            blockedProducts: 2,
            warningProducts: 5,
            okProducts: 38,
            categoryStats: {
              'Elektronika': 15,
              'Dom i ogród': 12,
              'Moda': 8,
              'Sport': 6,
              'Książki': 4
            } as Record<string, number>,
            priceStats: {
              min: 9.99,
              max: 1299.99,
              average: 245.67,
              median: 199.99,
              total: 11055.15
            },
            rulesStats: {
              totalRules: 8,
              activeRules: 6,
              appliedRules: 45
            },
            processingTime: 2500,
            filesProcessed: 1
          },
          metadata: {
            version: '1.0.0',
            rulesVersion: '1.0.0',
            parserVersion: '1.0.0',
            tags: ['przykład', 'fba'],
            notes: 'Przykładowa analiza z pliku FBA MIX'
          }
        },
        {
          id: 'sample-analysis-2',
          name: 'F20353 FBA MIX FBA PLN',
          description: 'Przykładowa analiza pliku FBA MIX v2',
          type: 'file_upload' as const,
          status: 'completed' as const,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dzień temu
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          files: [
            {
              id: 'file-2',
              name: 'F20353 FBA MIX FBA PLN.xlsx',
              size: 19456,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              status: 'parsed' as const,
              productCount: 38,
              uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            }
          ],
          products: [
            {
              id: 'prod-3',
              name: 'Produkt 3',
              category: 'Moda',
              price: 89.99,
              description: 'Opis produktu 3',
              source: 'F20353 FBA MIX FBA PLN.xlsx',
              rawData: { 'Nazwa': 'Produkt 3', 'Kategoria': 'Moda', 'Cena': 89.99 }
            },
            {
              id: 'prod-4',
              name: 'Produkt 4',
              category: 'Sport',
              price: 199.99,
              description: 'Opis produktu 4',
              source: 'F20353 FBA MIX FBA PLN.xlsx',
              rawData: { 'Nazwa': 'Produkt 4', 'Kategoria': 'Sport', 'Cena': 199.99 }
            }
          ],
          totalProducts: 38,
          validProducts: 35,
          invalidProducts: 3,
          evaluations: [],
          averageScore: 78,
          stats: {
            totalProducts: 38,
            validProducts: 35,
            invalidProducts: 3,
            averageScore: 78,
            blockedProducts: 1,
            warningProducts: 7,
            okProducts: 30,
            categoryStats: {
              'Moda': 12,
              'Sport': 10,
              'Elektronika': 8,
              'Dom i ogród': 5,
              'Książki': 3
            } as Record<string, number>,
            priceStats: {
              min: 15.99,
              max: 899.99,
              average: 198.45,
              median: 149.99,
              total: 7541.10
            },
            rulesStats: {
              totalRules: 8,
              activeRules: 6,
              appliedRules: 38
            },
            processingTime: 2100,
            filesProcessed: 1
          },
          metadata: {
            version: '1.0.0',
            rulesVersion: '1.0.0',
            parserVersion: '1.0.0',
            tags: ['przykład', 'fba'],
            notes: 'Przykładowa analiza z pliku FBA MIX v2'
          }
        },
        {
          id: 'sample-analysis-3',
          name: 'M00216 RETOURWARE NARZĘDZIA PLN',
          description: 'Przykładowa analiza pliku narzędzi',
          type: 'file_upload' as const,
          status: 'completed' as const,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 godziny temu
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          files: [
            {
              id: 'file-3',
              name: 'M00216 RETOURWARE NARZĘDZIA PLN.xlsx',
              size: 15360,
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              status: 'parsed' as const,
              productCount: 28,
              uploadedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
            }
          ],
          products: [
            {
              id: 'prod-5',
              name: 'Produkt 5',
              category: 'Narzędzia',
              price: 349.99,
              description: 'Opis produktu 5',
              source: 'M00216 RETOURWARE NARZĘDZIA PLN.xlsx',
              rawData: { 'Nazwa': 'Produkt 5', 'Kategoria': 'Narzędzia', 'Cena': 349.99 }
            },
            {
              id: 'prod-6',
              name: 'Produkt 6',
              category: 'Narzędzia',
              price: 89.99,
              description: 'Opis produktu 6',
              source: 'M00216 RETOURWARE NARZĘDZIA PLN.xlsx',
              rawData: { 'Nazwa': 'Produkt 6', 'Kategoria': 'Narzędzia', 'Cena': 89.99 }
            }
          ],
          totalProducts: 28,
          validProducts: 26,
          invalidProducts: 2,
          evaluations: [],
          averageScore: 92,
          stats: {
            totalProducts: 28,
            validProducts: 26,
            invalidProducts: 2,
            averageScore: 92,
            blockedProducts: 0,
            warningProducts: 2,
            okProducts: 26,
            categoryStats: {
              'Narzędzia': 20,
              'Elektronika': 5,
              'Dom i ogród': 3
            } as Record<string, number>,
            priceStats: {
              min: 29.99,
              max: 599.99,
              average: 156.78,
              median: 129.99,
              total: 4389.84
            },
            rulesStats: {
              totalRules: 8,
              activeRules: 6,
              appliedRules: 28
            },
            processingTime: 1800,
            filesProcessed: 1
          },
          metadata: {
            version: '1.0.0',
            rulesVersion: '1.0.0',
            parserVersion: '1.0.0',
            tags: ['przykład', 'narzędzia'],
            notes: 'Przykładowa analiza z pliku narzędzi'
          }
        }
      ],
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
      filters: {},
      sorting: {
        field: 'createdAt',
        direction: 'desc'
      },

      // Tworzenie nowej analizy
      createAnalysis: (name, description, type = 'file_upload') => {
        const newAnalysis: Analysis = {
          id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          description,
          type,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
          files: [],
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
        
        set(state => ({
          analyses: [newAnalysis, ...state.analyses]
        }))
        
        get().updateDashboardStats()
        return newAnalysis
      },

      // Aktualizacja analizy
      updateAnalysis: (id, updates) => {
        set(state => ({
          analyses: state.analyses.map(analysis =>
            analysis.id === id
              ? { ...analysis, ...updates, updatedAt: new Date() }
              : analysis
          )
        }))
        
        get().updateDashboardStats()
      },

      // Usuwanie analizy
      deleteAnalysis: (id) => {
        set(state => ({
          analyses: state.analyses.filter(analysis => analysis.id !== id)
        }))
        
        get().updateDashboardStats()
      },

      // Duplikowanie analizy
      duplicateAnalysis: (id) => {
        const analysis = get().analyses.find(a => a.id === id)
        if (analysis) {
          const duplicatedAnalysis = get().createAnalysis(
            `${analysis.name} (kopia)`,
            analysis.description,
            analysis.type
          )
          
          // Kopiowanie danych
          get().updateAnalysis(duplicatedAnalysis.id, {
            files: analysis.files,
            products: analysis.products,
            evaluations: analysis.evaluations,
            metadata: {
              ...analysis.metadata,
              tags: [...analysis.metadata.tags, 'kopia']
            }
          })
        }
      },

      // Dodawanie pliku do analizy
      addFileToAnalysis: (analysisId, file) => {
        set(state => ({
          analyses: state.analyses.map(analysis =>
            analysis.id === analysisId
              ? { 
                  ...analysis, 
                  files: [...analysis.files, file],
                  updatedAt: new Date()
                }
              : analysis
          )
        }))
      },

      // Usuwanie pliku z analizy
      removeFileFromAnalysis: (analysisId, fileId) => {
        set(state => ({
          analyses: state.analyses.map(analysis =>
            analysis.id === analysisId
              ? { 
                  ...analysis, 
                  files: analysis.files.filter(file => file.id !== fileId),
                  updatedAt: new Date()
                }
              : analysis
          )
        }))
      },

      // Aktualizacja statusu pliku
      updateFileStatus: (analysisId, fileId, status, error) => {
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
          )
        }))
      },

      // Dodawanie produktów do analizy
      addProductsToAnalysis: (analysisId, products) => {
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
      addEvaluationsToAnalysis: (analysisId, evaluations) => {
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
      updateAnalysisStats: (analysisId) => {
        const analysis = get().analyses.find(a => a.id === analysisId)
        if (!analysis) return

        const stats: AnalysisStats = {
          totalProducts: analysis.products.length,
          validProducts: analysis.validProducts,
          invalidProducts: analysis.invalidProducts,
          averageScore: analysis.averageScore,
          blockedProducts: analysis.evaluations.filter(e => e.status === 'blocked').length,
          warningProducts: analysis.evaluations.filter(e => e.status === 'warning').length,
          okProducts: analysis.evaluations.filter(e => e.status === 'ok').length,
          categoryStats: analysis.products.reduce((acc, product) => {
            if (product.category) {
              acc[product.category] = (acc[product.category] || 0) + 1
            }
            return acc
          }, {} as Record<string, number>),
          priceStats: (() => {
            const prices = analysis.products
              .filter(p => p.price)
              .map(p => p.price!)
              .sort((a, b) => a - b)
            
            if (prices.length === 0) {
              return { min: 0, max: 0, average: 0, median: 0, total: 0 }
            }
            
            const min = prices[0]
            const max = prices[prices.length - 1]
            const average = prices.reduce((sum, price) => sum + price, 0) / prices.length
            const median = prices[Math.floor(prices.length / 2)]
            const total = prices.reduce((sum, price) => sum + price, 0)
            
            return { min, max, average, median, total }
          })(),
          rulesStats: {
            totalRules: 0, // TODO: Pobierać z rules store
            activeRules: 0, // TODO: Pobierać z rules store
            appliedRules: analysis.evaluations.reduce((sum, e) => sum + e.appliedRules.length, 0)
          },
          processingTime: analysis.completedAt 
            ? analysis.completedAt.getTime() - analysis.createdAt.getTime()
            : 0,
          filesProcessed: analysis.files.length
        }

        get().updateAnalysis(analysisId, { stats })
      },

      // Aktualizacja statystyk dashboard
      updateDashboardStats: () => {
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
      }
    }),
    {
      name: 'analysis-store',
      partialize: (state) => ({ 
        analyses: state.analyses,
        filters: state.filters,
        sorting: state.sorting
      })
    }
  )
)
