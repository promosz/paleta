// Typy dla systemu analiz i dashboard

// Status analizy
export type AnalysisStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

// Typ analizy
export type AnalysisType = 'file_upload' | 'manual' | 'scheduled'

// Główny interfejs analizy
export interface Analysis {
  id: string
  name: string
  description?: string
  type: AnalysisType
  status: AnalysisStatus
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  
  // Pliki
  files: AnalysisFile[]
  
  // Produkty
  products: ParsedProduct[]
  totalProducts: number
  validProducts: number
  invalidProducts: number
  
  // Oceny
  evaluations: ProductEvaluation[]
  averageScore: number
  
  // Statystyki
  stats: AnalysisStats
  
  // Metadane
  metadata: AnalysisMetadata
}

// Plik w analizie
export interface AnalysisFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: Date
  parsedAt?: Date
  status: 'uploaded' | 'parsing' | 'parsed' | 'failed'
  error?: string
  productCount: number
}

// Statystyki analizy
export interface AnalysisStats {
  // Podstawowe statystyki
  totalProducts: number
  validProducts: number
  invalidProducts: number
  averageScore: number
  
  // Statystyki według statusu
  blockedProducts: number
  warningProducts: number
  okProducts: number
  
  // Statystyki według kategorii
  categoryStats: Record<string, number>
  
  // Statystyki cenowe
  priceStats: {
    min: number
    max: number
    average: number
    median: number
    total: number
  }
  
  // Statystyki reguł
  rulesStats: {
    totalRules: number
    activeRules: number
    appliedRules: number
    mostViolatedRule?: string
  }
  
  // Statystyki czasowe
  processingTime: number // w milisekundach
  filesProcessed: number
}

// Metadane analizy
export interface AnalysisMetadata {
  version: string
  rulesVersion: string
  parserVersion: string
  userAgent?: string
  ipAddress?: string
  sessionId?: string
  tags: string[]
  notes?: string
}

// Filtry analiz
export interface AnalysisFilters {
  status?: AnalysisStatus[]
  type?: AnalysisType[]
  dateRange?: {
    from: Date
    to: Date
  }
  tags?: string[]
  search?: string
}

// Sortowanie analiz
export interface AnalysisSorting {
  field: 'name' | 'createdAt' | 'updatedAt' | 'totalProducts' | 'averageScore'
  direction: 'asc' | 'desc'
}

// Eksport analizy
export interface AnalysisExport {
  format: 'json' | 'csv' | 'xlsx' | 'pdf'
  includeProducts: boolean
  includeEvaluations: boolean
  includeStats: boolean
  includeMetadata: boolean
  dateRange?: {
    from: Date
    to: Date
  }
}

// Wynik eksportu
export interface ExportResult {
  success: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
  error?: string
  exportedAt: Date
}

// Dashboard stats
export interface DashboardStats {
  // Ogólne statystyki
  totalAnalyses: number
  completedAnalyses: number
  failedAnalyses: number
  pendingAnalyses: number
  
  // Statystyki produktów
  totalProducts: number
  averageProductsPerAnalysis: number
  
  // Statystyki reguł
  totalRules: number
  activeRules: number
  
  // Statystyki czasowe
  lastAnalysisAt?: Date
  averageProcessingTime: number
  
  // Trendy
  analysesTrend: {
    last7Days: number
    last30Days: number
    growth: number // procentowy wzrost
  }
  
  // Top kategorie
  topCategories: Array<{
    name: string
    count: number
    percentage: number
  }>
  
  // Top reguły
  topRules: Array<{
    name: string
    violations: number
    percentage: number
  }>
}

// Callback dla postępu analizy
export type AnalysisProgressCallback = (progress: number, status: string) => void

// Callback dla zakończenia analizy
export type AnalysisCompleteCallback = (analysis: Analysis) => void

// Import typów z innych modułów
import type { ParsedProduct } from './parser'
import type { ProductEvaluation } from './rules'
