import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { Analysis, AnalysisExport } from '../../types/analysis'
import { useAnalysisStore } from '../../stores/analysisStore'
import { Button, Card, CardHeader, CardBody, StatusBadge, DataTable, Recommendations } from '../ui'

interface AnalysisDetailsProps {
  analysis: Analysis
  onClose?: () => void
  className?: string
  processedFiles?: any[]
}

export const AnalysisDetails: React.FC<AnalysisDetailsProps> = ({
  analysis,
  onClose,
  className = '',
  processedFiles = []
}) => {
  const location = useLocation()
  const { exportAnalysis } = useAnalysisStore()
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<AnalysisExport['format']>('json')
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  
  // Użyj przekazanych processedFiles lub fallback do location state
  const filesToShow = processedFiles.length > 0 ? processedFiles : (location.state?.processedFiles || [])

  // Debug - sprawdź dane analizy
  console.log('AnalysisDetails: Otrzymana analiza:', {
    id: analysis.id,
    name: analysis.name,
    productsCount: analysis.products.length,
    products: analysis.products.slice(0, 3), // Pierwsze 3 produkty
    filesCount: analysis.files.length,
    processedFiles: processedFiles,
    filesToShow: filesToShow
  })

  // Funkcja formatowania rozmiaru pliku
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Funkcja pobierania produktów dla wybranego pliku
  const getProductsForFile = () => {
    // TODO: Implementować pobieranie produktów dla konkretnego pliku
    // Na razie zwracamy wszystkie produkty
    return analysis.products
  }

  // Obsługa eksportu
  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportAnalysis(analysis.id, {
        format: exportFormat,
        includeProducts: true,
        includeEvaluations: true,
        includeStats: true,
        includeMetadata: true
      })
      
      if (result.success) {
        // TODO: Pobieranie pliku
        console.log('Eksport zakończony:', result.fileName)
      } else {
        console.error('Błąd eksportu:', result.error)
      }
    } catch (error) {
      console.error('Błąd eksportu:', error)
    } finally {
      setIsExporting(false)
    }
  }

  // Renderowanie ikony typu
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file_upload':
        return '📁'
      case 'manual':
        return '✏️'
      case 'scheduled':
        return '⏰'
      default:
        return '📋'
    }
  }

  // Renderowanie koloru statusu
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in_progress':
        return 'warning'
      case 'failed':
        return 'danger'
      case 'pending':
        return 'info'
      default:
        return 'info'
    }
  }

  // Renderowanie nazwy statusu
  const getStatusName = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Zakończona'
      case 'in_progress':
        return 'W toku'
      case 'failed':
        return 'Błąd'
      case 'pending':
        return 'Oczekująca'
      default:
        return 'Nieznany'
    }
  }

  return (
    <div className={className}>
      {/* Nagłówek */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getTypeIcon(analysis.type)}</span>
              <div>
                <h1 className="text-2xl font-bold text-neutral-800">
                  {analysis.name}
                </h1>
                {analysis.description && (
                  <p className="text-neutral-600">
                    {analysis.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={getStatusColor(analysis.status)}>
                {getStatusName(analysis.status)}
              </StatusBadge>
              {onClose && (
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Zamknij
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statystyki ogólne */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">{analysis.totalProducts}</div>
              <div className="text-sm text-neutral-600">Produktów</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500 mb-2">{analysis.validProducts}</div>
              <div className="text-sm text-neutral-600">Ważnych</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-500 mb-2">{analysis.stats.warningProducts}</div>
              <div className="text-sm text-neutral-600">Ostrzeżeń</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-danger-500 mb-2">{analysis.stats.blockedProducts}</div>
              <div className="text-sm text-neutral-600">Zablokowanych</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Informacje o analizie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Podstawowe informacje */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Informacje podstawowe
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">ID:</span>
                <span className="font-mono text-sm">{analysis.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Typ:</span>
                <span>{analysis.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Status:</span>
                <StatusBadge status={getStatusColor(analysis.status)}>
                  {getStatusName(analysis.status)}
                </StatusBadge>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Utworzona:</span>
                <span>{new Date(analysis.createdAt).toLocaleString('pl-PL')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Zaktualizowana:</span>
                <span>{new Date(analysis.updatedAt).toLocaleString('pl-PL')}</span>
              </div>
              {analysis.completedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-600">Zakończona:</span>
                  <span>{new Date(analysis.completedAt).toLocaleString('pl-PL')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">Czas przetwarzania:</span>
                <span>{Math.round(analysis.stats.processingTime / 1000)}s</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Statystyki cenowe */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Statystyki cenowe
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Minimalna cena:</span>
                <span>{analysis.stats.priceStats.min.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Maksymalna cena:</span>
                <span>{analysis.stats.priceStats.max.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Średnia cena:</span>
                <span>{analysis.stats.priceStats.average.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Mediana:</span>
                <span>{analysis.stats.priceStats.median.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Suma:</span>
                <span>{analysis.stats.priceStats.total.toFixed(2)} PLN</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Sparsowane pliki */}
      {filesToShow.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Sparsowane pliki ({filesToShow.length})
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {filesToShow.map((file: any) => (
                <div 
                  key={file.fileId} 
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedFileId === file.fileId 
                      ? 'bg-primary-50 border-2 border-primary-200' 
                      : 'bg-neutral-50 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedFileId(selectedFileId === file.fileId ? null : file.fileId)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-neutral-600">
                        {formatFileSize(file.size)} • {file.productsCount} produktów
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status="success">
                      Sparsowany
                    </StatusBadge>
                    <svg 
                      className={`w-5 h-5 text-neutral-400 transition-transform ${
                        selectedFileId === file.fileId ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Szczegóły wybranego pliku */}
      {selectedFileId && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-800">
                Szczegóły pliku
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedFileId(null)}
              >
                Zamknij
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {(() => {
              const selectedFile = filesToShow.find((f: any) => f.fileId === selectedFileId)
              const fileProducts = getProductsForFile()
              
              if (!selectedFile) return null
              
              return (
                <div className="space-y-4">
                  {/* Informacje o pliku */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-lg">
                    <div>
                      <div className="text-sm text-neutral-600">Nazwa pliku</div>
                      <div className="font-medium">{selectedFile.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-600">Rozmiar</div>
                      <div className="font-medium">{formatFileSize(selectedFile.size)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-600">Produktów</div>
                      <div className="font-medium">{selectedFile.productsCount}</div>
                    </div>
                  </div>
                  
                  {/* Produkty z tego pliku */}
                  {fileProducts.length > 0 && (
                    <div>
                      <h4 className="text-md font-semibold text-neutral-800 mb-3">
                        Produkty z pliku ({fileProducts.length})
                      </h4>
                      <DataTable
                        products={fileProducts}
                        showSource={true}
                        showRawData={true}
                        maxRows={100}
                      />
                    </div>
                  )}
                </div>
              )
            })()}
          </CardBody>
        </Card>
      )}

      {/* Pliki (stara sekcja) */}
      {analysis.files.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Pliki analizy ({analysis.files.length})
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {analysis.files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">📄</span>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-neutral-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.productCount} produktów
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge 
                      status={
                        file.status === 'parsed' ? 'success' :
                        file.status === 'parsing' ? 'warning' :
                        file.status === 'failed' ? 'danger' : 'info'
                      }
                    >
                      {file.status === 'parsed' ? 'Sparsowany' :
                       file.status === 'parsing' ? 'Parsowanie' :
                       file.status === 'failed' ? 'Błąd' : 'Oczekujący'}
                    </StatusBadge>
                    {file.error && (
                      <span className="text-sm text-danger-600" title={file.error}>
                        ⚠️
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Kategorie */}
      {Object.keys(analysis.stats.categoryStats).length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Kategorie produktów
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {Object.entries(analysis.stats.categoryStats)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-neutral-700">{category}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${(count / analysis.totalProducts) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-neutral-600 w-12 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tagi */}
      {analysis.metadata.tags.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Tagi
            </h3>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {analysis.metadata.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Notatki */}
      {analysis.metadata.notes && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Notatki
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-neutral-700 whitespace-pre-wrap">
              {analysis.metadata.notes}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Podsumowanie produktów */}
      {analysis.products.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Podsumowanie produktów
            </h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500 mb-2">
                  {analysis.products.length}
                </div>
                <div className="text-sm text-neutral-600">Łącznie produktów</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-500 mb-2">
                  {analysis.products.filter(p => p.price && p.price > 0).length}
                </div>
                <div className="text-sm text-neutral-600">Z ceną</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning-500 mb-2">
                  {new Set(analysis.products.map(p => p.category).filter(Boolean)).size}
                </div>
                <div className="text-sm text-neutral-600">Unikalnych kategorii</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Produkty */}
      {analysis.products.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Wszystkie produkty ({analysis.products.length})
            </h3>
          </CardHeader>
          <CardBody>
            <DataTable
              products={analysis.products}
              showSource={true}
              showRawData={true}
              maxRows={1000}
            />
          </CardBody>
        </Card>
      )}

      {/* Rekomendacje */}
      {analysis.evaluations.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Rekomendacje
            </h3>
          </CardHeader>
          <CardBody>
            <Recommendations
              evaluations={analysis.evaluations}
            />
          </CardBody>
        </Card>
      )}

      {/* Eksport */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-800">
            Eksport wyników
          </h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-center space-x-4">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as AnalysisExport['format'])}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="pdf">PDF</option>
            </select>
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? 'Eksportowanie...' : 'Eksportuj'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
