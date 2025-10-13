import React, { useState } from 'react'
import type { Analysis, AnalysisStatus, AnalysisType } from '../../types/analysis'
import { useAnalysisStore } from '../../stores/analysisStoreSupabase'
import { Button, Card, CardHeader, CardBody, StatusBadge } from '../ui'
import { useUser } from '@clerk/clerk-react'

interface AnalysisListProps {
  analyses: Analysis[]
  onSelect?: (analysis: Analysis) => void
  onEdit?: (analysis: Analysis) => void
  onDelete?: (analysis: Analysis) => void
  className?: string
}

export const AnalysisList: React.FC<AnalysisListProps> = ({
  analyses,
  onSelect,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { user } = useUser()
  const { 
    setFilters, 
    setSorting, 
    getFilteredAnalyses, 
    filters, 
    sorting,
    deleteAnalysis
  } = useAnalysisStore()
  
  const [showFilters, setShowFilters] = useState(false)

  // Renderowanie ikony typu analizy
  const getTypeIcon = (type: AnalysisType) => {
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
  const getStatusColor = (status: AnalysisStatus) => {
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
  const getStatusName = (status: AnalysisStatus) => {
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

  // Renderowanie nazwy typu
  const getTypeName = (type: AnalysisType) => {
    switch (type) {
      case 'file_upload':
        return 'Upload plików'
      case 'manual':
        return 'Ręczna'
      case 'scheduled':
        return 'Zaplanowana'
      default:
        return 'Nieznany'
    }
  }

  // Obsługa filtrowania
  const handleStatusFilter = (status: AnalysisStatus) => {
    const currentStatuses = filters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    setFilters({ status: newStatuses.length > 0 ? newStatuses : undefined })
  }

  const handleTypeFilter = (type: AnalysisType) => {
    const currentTypes = filters.type || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    
    setFilters({ type: newTypes.length > 0 ? newTypes : undefined })
  }

  const handleSearch = (search: string) => {
    setFilters({ search: search || undefined })
  }

  const handleSort = (field: typeof sorting.field) => {
    setSorting({
      field,
      direction: sorting.field === field && sorting.direction === 'asc' ? 'desc' : 'asc'
    })
  }

  // Obsługa usuwania
  const handleDelete = (analysis: Analysis) => {
    if (!user?.id) return
    
    if (window.confirm(`Czy na pewno chcesz usunąć analizę "${analysis.name}"?`)) {
      deleteAnalysis(analysis.id, user.id)
      onDelete?.(analysis)
    }
  }


  if (analyses.length === 0) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Brak analiz
            </h3>
            <p className="text-neutral-500">
              Utwórz pierwszą analizę aby rozpocząć pracę
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Filtry i sortowanie */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-800">
              Filtry i sortowanie
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardBody>
            <div className="space-y-4">
              {/* Wyszukiwanie */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Wyszukiwanie
                </label>
                <input
                  type="text"
                  placeholder="Szukaj po nazwie lub opisie..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Filtry statusu */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['pending', 'in_progress', 'completed', 'failed'] as AnalysisStatus[]).map(status => (
                    <Button
                      key={status}
                      variant={filters.status?.includes(status) ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleStatusFilter(status)}
                    >
                      {getStatusName(status)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filtry typu */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Typ
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['file_upload', 'manual', 'scheduled'] as AnalysisType[]).map(type => (
                    <Button
                      key={type}
                      variant={filters.type?.includes(type) ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleTypeFilter(type)}
                    >
                      {getTypeIcon(type)} {getTypeName(type)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sortowanie */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sortowanie
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { field: 'createdAt' as const, label: 'Data utworzenia' },
                    { field: 'name' as const, label: 'Nazwa' },
                    { field: 'totalProducts' as const, label: 'Liczba produktów' },
                    { field: 'averageScore' as const, label: 'Średnia ocena' }
                  ].map(({ field, label }) => (
                    <Button
                      key={field}
                      variant={sorting.field === field ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleSort(field)}
                    >
                      {label} {sorting.field === field && (sorting.direction === 'asc' ? '↑' : '↓')}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        )}
      </Card>

      {/* Lista analiz */}
      <div className="space-y-4">
        {getFilteredAnalyses().map((analysis) => (
          <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(analysis.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">
                        {analysis.name}
                      </h3>
                      {analysis.description && (
                        <p className="text-sm text-neutral-600">
                          {analysis.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center flex-wrap gap-3 mb-3">
                    <StatusBadge status={getStatusColor(analysis.status)}>
                      {getStatusName(analysis.status)}
                    </StatusBadge>
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors cursor-help"
                      title={`Typ analizy: ${getTypeName(analysis.type)}`}
                    >
                      <span className="text-lg">{getTypeIcon(analysis.type)}</span>
                      <span className="text-sm font-medium text-neutral-700">{getTypeName(analysis.type)}</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200/50 hover:shadow-md transition-shadow cursor-help"
                      title={`Liczba produktów: łącznie ${analysis.totalProducts} ${analysis.totalProducts === 1 ? 'produkt' : 'produktów'} w analizie`}
                    >
                      <span className="text-lg">📦</span>
                      <span className="text-sm font-bold text-purple-700">{analysis.totalProducts}</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-200/50 hover:shadow-md transition-shadow cursor-help"
                      title={`Średnia ocena: ${Math.round(analysis.averageScore)} punktów na 100 możliwych`}
                    >
                      <span className="text-lg">⭐</span>
                      <span className="text-sm font-bold text-indigo-700">{Math.round(analysis.averageScore)}/100</span>
                    </div>
                  </div>

                  {/* Statystyki */}
                  <div className="flex flex-wrap gap-3 mb-3">
                    {analysis.stats.warningProducts > 0 && (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                        title={`Ostrzeżenia: ${analysis.stats.warningProducts} ${analysis.stats.warningProducts === 1 ? 'produkt wymaga' : 'produktów wymaga'} uwagi`}
                      >
                        <span className="text-2xl">⚠️</span>
                        <span className="text-xl font-bold text-yellow-700">{analysis.stats.warningProducts}</span>
                      </div>
                    )}
                    {analysis.stats.blockedProducts > 0 && (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border border-red-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                        title={`Zablokowane: ${analysis.stats.blockedProducts} ${analysis.stats.blockedProducts === 1 ? 'produkt jest zablokowany' : 'produktów jest zablokowanych'} i nie może być sprzedawany`}
                      >
                        <span className="text-2xl">🚫</span>
                        <span className="text-xl font-bold text-red-700">{analysis.stats.blockedProducts}</span>
                      </div>
                    )}
                    <div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                      title={`Produkty ważne: ${analysis.validProducts} ${analysis.validProducts === 1 ? 'produkt spełnia' : 'produktów spełnia'} wszystkie wymagania`}
                    >
                      <span className="text-2xl">✓</span>
                      <span className="text-xl font-bold text-green-700">{analysis.validProducts}</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                      title={`Liczba plików: ${analysis.files.length} ${analysis.files.length === 1 ? 'plik' : 'plików'} przeanalizowano`}
                    >
                      <span className="text-2xl">📄</span>
                      <span className="text-xl font-bold text-blue-700">{analysis.files.length}</span>
                    </div>
                  </div>

                  {/* Tagi */}
                  {analysis.metadata.tags.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {analysis.metadata.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-neutral-400">
                    Utworzona: {new Date(analysis.createdAt).toLocaleString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {analysis.updatedAt !== analysis.createdAt && (
                      <span className="ml-2">
                        • Zaktualizowana: {new Date(analysis.updatedAt).toLocaleString('pl-PL', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                    {analysis.completedAt && (
                      <span className="ml-2">
                        • Zakończona: {new Date(analysis.completedAt).toLocaleString('pl-PL', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {onSelect && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelect(analysis)}
                    >
                      Otwórz
                    </Button>
                  )}
                  
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(analysis)}
                    >
                      Edytuj
                    </Button>
                  )}
                  
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(analysis)}
                    >
                      Usuń
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {getFilteredAnalyses().length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Brak analiz spełniających kryteria
              </h3>
              <p className="text-neutral-500">
                Zmień filtry aby zobaczyć więcej analiz
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
