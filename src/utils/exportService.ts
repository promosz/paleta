import type { Analysis, AnalysisExport, ExportResult } from '../types/analysis'

// Klasa serwisu eksportu
export class ExportService {
  // Eksport analizy do JSON
  private exportToJSON(analysis: Analysis, options: AnalysisExport): string {
    const exportData: any = {
      analysis: {
        id: analysis.id,
        name: analysis.name,
        description: analysis.description,
        type: analysis.type,
        status: analysis.status,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt,
        completedAt: analysis.completedAt
      }
    }

    if (options.includeStats) {
      exportData.stats = analysis.stats
    }

    if (options.includeMetadata) {
      exportData.metadata = analysis.metadata
    }

    if (options.includeProducts) {
      exportData.products = analysis.products
    }

    if (options.includeEvaluations) {
      exportData.evaluations = analysis.evaluations
    }

    return JSON.stringify(exportData, null, 2)
  }

  // Eksport analizy do CSV
  private exportToCSV(analysis: Analysis, options: AnalysisExport): string {
    if (!options.includeProducts || analysis.products.length === 0) {
      return 'Brak produktów do eksportu'
    }

    const headers = [
      'ID',
      'Nazwa',
      'Kategoria',
      'Cena',
      'Ilość',
      'SKU',
      'Opis',
      'Plik źródłowy',
      'Status',
      'Ocena',
      'Ostrzeżenia',
      'Blokady'
    ]

    const rows = analysis.products.map(product => {
      const evaluation = analysis.evaluations.find(e => e.productId === product.id)
      
      return [
        product.id,
        product.name || '',
        product.category || '',
        product.price || '',
        product.quantity || '',
        product.sku || '',
        product.description || '',
        '', // TODO: Add sourceFile to ParsedProduct type
        evaluation?.status || '',
        evaluation?.score || '',
        evaluation?.warnings.join('; ') || '',
        evaluation?.blocks.join('; ') || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    })

    return [headers.join(','), ...rows].join('\n')
  }

  // Eksport analizy do XLSX
  private async exportToXLSX(analysis: Analysis, _options: AnalysisExport): Promise<Blob> {
    // TODO: Implementować eksport do XLSX używając biblioteki xlsx
    // Na razie zwracamy pusty blob
    const csvData = this.exportToCSV(analysis, _options)
    return new Blob([csvData], { type: 'text/csv' })
  }

  // Eksport analizy do PDF
  private async exportToPDF(analysis: Analysis, _options: AnalysisExport): Promise<Blob> {
    // TODO: Implementować eksport do PDF używając biblioteki jsPDF
    // Na razie zwracamy pusty blob
    const textData = `Raport analizy: ${analysis.name}\n\n` +
      `Data: ${new Date().toLocaleDateString('pl-PL')}\n` +
      `Produkty: ${analysis.totalProducts}\n` +
      `Status: ${analysis.status}\n\n` +
      `Szczegóły w załączonym pliku JSON.`
    
    return new Blob([textData], { type: 'text/plain' })
  }

  // Główna metoda eksportu
  async exportAnalysis(analysis: Analysis, options: AnalysisExport): Promise<ExportResult> {
    try {
      let blob: Blob
      let fileExtension: string

      switch (options.format) {
        case 'json':
          const jsonData = this.exportToJSON(analysis, options)
          blob = new Blob([jsonData], { type: 'application/json' })
          fileExtension = 'json'
          break

        case 'csv':
          const csvData = this.exportToCSV(analysis, options)
          blob = new Blob([csvData], { type: 'text/csv' })
          fileExtension = 'csv'
          break

        case 'xlsx':
          blob = await this.exportToXLSX(analysis, options)
          fileExtension = 'xlsx'
          break

        case 'pdf':
          blob = await this.exportToPDF(analysis, options)
          fileExtension = 'pdf'
          break

        default:
          throw new Error(`Nieobsługiwany format eksportu: ${options.format}`)
      }

      // Generowanie nazwy pliku
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `analysis-${analysis.name.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.${fileExtension}`

      // Tworzenie URL do pobrania
      const url = URL.createObjectURL(blob)

      return {
        success: true,
        fileUrl: url,
        fileName,
        fileSize: blob.size,
        exportedAt: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd eksportu',
        exportedAt: new Date()
      }
    }
  }

  // Eksport wszystkich analiz
  async exportAllAnalyses(analyses: Analysis[], options: AnalysisExport): Promise<ExportResult> {
    try {
      const exportData = {
        exportedAt: new Date(),
        totalAnalyses: analyses.length,
        analyses: analyses.map(analysis => ({
          id: analysis.id,
          name: analysis.name,
          type: analysis.type,
          status: analysis.status,
          createdAt: analysis.createdAt,
          totalProducts: analysis.totalProducts,
          averageScore: analysis.averageScore,
          ...(options.includeStats && { stats: analysis.stats }),
          ...(options.includeMetadata && { metadata: analysis.metadata }),
          ...(options.includeProducts && { products: analysis.products }),
          ...(options.includeEvaluations && { evaluations: analysis.evaluations })
        }))
      }

      const jsonData = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      
      const timestamp = new Date().toISOString().split('T')[0]
      const fileName = `all-analyses-${timestamp}.json`

      const url = URL.createObjectURL(blob)

      return {
        success: true,
        fileUrl: url,
        fileName,
        fileSize: blob.size,
        exportedAt: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Nieznany błąd eksportu',
        exportedAt: new Date()
      }
    }
  }

  // Pobieranie pliku
  downloadFile(url: string, fileName: string): void {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Zwolnienie pamięci
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  // Walidacja opcji eksportu
  validateExportOptions(options: AnalysisExport): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!options.format) {
      errors.push('Format eksportu jest wymagany')
    }

    if (!['json', 'csv', 'xlsx', 'pdf'].includes(options.format)) {
      errors.push('Nieobsługiwany format eksportu')
    }

    if (options.dateRange) {
      if (options.dateRange.from > options.dateRange.to) {
        errors.push('Data początkowa nie może być późniejsza niż końcowa')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// Eksport domyślnej instancji
export const exportService = new ExportService()
