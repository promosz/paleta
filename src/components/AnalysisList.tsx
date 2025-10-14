import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileSpreadsheet, Clock, CheckCircle, AlertCircle, Package, AlertTriangle, TrendingUp } from 'lucide-react'
import type { Analysis } from '../types/analysis'

interface AnalysisListProps {
  analyses: Analysis[]
}

const AnalysisList: React.FC<AnalysisListProps> = ({ analyses }) => {
  const location = useLocation()
  
  const getStatusIcon = (status: Analysis['status']) => {
    switch (status) {
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusText = (status: Analysis['status']) => {
    switch (status) {
      case 'in_progress':
        return 'W trakcie analizy'
      case 'completed':
        return 'Zakończona'
      case 'failed':
        return 'Błąd analizy'
      case 'pending':
        return 'Oczekująca'
    }
  }

  const getStatusColor = (status: Analysis['status']) => {
    switch (status) {
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-blue-600 bg-blue-100'
    }
  }

  // Funkcja do bezpiecznego wyświetlania liczby produktów
  const formatProductCount = (count: number): string => {
    if (count === null || count === undefined) return '0'
    
    // Konwertuj na liczbę i usuń wszystkie niepotrzebne znaki
    const num = parseInt(String(count).replace(/[^0-9]/g, ''), 10)
    
    // Sprawdź czy liczba jest poprawna
    if (isNaN(num) || num < 0) return '0'
    
    return String(num)
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Brak analiz
        </h3>
        <p className="text-gray-500">
          Prześlij pierwszy dokument, aby rozpocząć analizę
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => {
        const warningCount = analysis.stats?.warningProducts || 0
        const blockedCount = analysis.stats?.blockedProducts || 0
        const avgPrice = analysis.stats?.priceStats?.average || 0
        
        const linkTo = location.pathname.startsWith('/paleta') ? `/paleta/analysis/${analysis.id}` : `/analysis/${analysis.id}`
        
        return (
          <Link
            key={analysis.id}
            to={linkTo}
            className="block card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{analysis.name}</h4>
                  <p className="text-sm text-gray-500">
                    Utworzona: {new Date(analysis.createdAt).toLocaleString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {analysis.description && (
                    <p className="text-xs text-gray-400 mt-1">{analysis.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Metrics for completed analyses */}
                {analysis.status === 'completed' && (
                  <div className="flex items-center space-x-4">
                    {warningCount > 0 && (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                        title={`Ostrzeżenia: ${warningCount} ${warningCount === 1 ? 'produkt wymaga' : 'produktów wymaga'} uwagi`}
                      >
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-lg font-bold text-yellow-700">{warningCount}</span>
                      </div>
                    )}
                    {blockedCount > 0 && (
                      <div 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                        title={`Problemy: ${blockedCount} ${blockedCount === 1 ? 'produkt z' : 'produktów z'} błędami lub brakującymi danymi`}
                      >
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="text-lg font-bold text-orange-700">{blockedCount}</span>
                      </div>
                    )}
                    <div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                      title={`Średnia cena: ${avgPrice.toFixed(2)} PLN`}
                    >
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-bold text-green-700">{avgPrice.toFixed(1)} PLN</span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50 shadow-sm hover:shadow-md transition-shadow cursor-help"
                      title={`Liczba produktów: łącznie ${formatProductCount(analysis.totalProducts)} ${parseInt(formatProductCount(analysis.totalProducts)) === 1 ? 'produkt' : 'produktów'} w analizie`}
                    >
                      <Package className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-bold text-blue-700">{formatProductCount(analysis.totalProducts)}</span>
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(analysis.status)}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                    {getStatusText(analysis.status)}
                  </span>
                </div>

                {/* Action button */}
                <div className="btn-primary">
                  Szczegóły
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default AnalysisList
