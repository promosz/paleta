import React from 'react'
import { Link } from 'react-router-dom'
import { FileSpreadsheet, Clock, CheckCircle, AlertCircle, TrendingUp, Package, AlertTriangle } from 'lucide-react'

interface Product {
  paleta: string
  nazwa: string
  foto: string
  ean: string
  kod1: string
  kod2: string
  packId: string
  kategoria: string
  pcs: number
  cenaRegularnaBrutto: number
  waluta: string
  cenaSprzedazyNetto: number
  walutaSprzedazy: string
  link: string
  fcSku: string
  wartoscSprzedazyNetto: number
  // Obliczone pola
  marza: number
  rentownosc: number
}

interface Analysis {
  id: string
  fileName: string
  uploadDate: string
  status: 'processing' | 'completed' | 'error'
  profitability: number | null
  productCount: number | null
  issues: number | null
  products: Product[]
  summary: {
    totalRevenue: number
    totalCost: number
    averageProfitability: number
    lowProfitability: Product[]
    mediumProfitability: Product[]
    highProfitability: Product[]
  }
}

interface AnalysisListProps {
  analyses: Analysis[]
}

const AnalysisList: React.FC<AnalysisListProps> = ({ analyses }) => {
  const getStatusIcon = (status: Analysis['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = (status: Analysis['status']) => {
    switch (status) {
      case 'processing':
        return 'W trakcie analizy'
      case 'completed':
        return 'Zakończona'
      case 'error':
        return 'Błąd analizy'
    }
  }

  const getStatusColor = (status: Analysis['status']) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-600 bg-yellow-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'error':
        return 'text-red-600 bg-red-100'
    }
  }

  // Funkcja do bezpiecznego wyświetlania liczby produktów
  const formatProductCount = (count: number | null): string => {
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

  // Funkcja do obliczania liczby produktów z ostrzeżeniami
  const getWarningCount = (analysis: Analysis): number => {
    if (analysis.status !== 'completed' || !analysis.products) return 0
    
    // Załaduj reguły z localStorage
    const savedRules = localStorage.getItem('analysis-rules')
    if (!savedRules) return 0
    
    try {
      const rules = JSON.parse(savedRules)
      
      return analysis.products.filter(product => {
        // Sprawdź reguły produktów
        const productRule = rules.find((rule: any) => 
          rule.type === 'product' && 
          rule.name.toLowerCase() === product.nazwa.toLowerCase() &&
          rule.action === 'warning'
        )
        
        if (productRule) return true
        
        // Sprawdź reguły kategorii
        const categoryRule = rules.find((rule: any) => 
          rule.type === 'category' && 
          rule.name.toLowerCase() === product.kategoria.toLowerCase() &&
          rule.action === 'warning'
        )
        
        return !!categoryRule
      }).length
    } catch (error) {
      console.error('Błąd ładowania reguł:', error)
      return 0
    }
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => {
        const warningCount = getWarningCount(analysis)
        
        return (
          <Link 
            key={analysis.id} 
            to={`/analysis/${analysis.id}`}
            className="block card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{analysis.fileName}</h4>
                  <p className="text-sm text-gray-500">
                    Przesłano: {new Date(analysis.uploadDate).toLocaleString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Metrics for completed analyses */}
                {analysis.status === 'completed' && (
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-gray-600">
                        Rentowność: <span className="font-medium text-green-600">{analysis.profitability?.toFixed(1)}%</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="text-gray-600">
                        Produkty: <span className="font-medium text-blue-600">{formatProductCount(analysis.productCount)}</span>
                      </span>
                    </div>
                    {warningCount > 0 && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-gray-600">
                          Ostrzeżenia: <span className="font-medium text-yellow-600">{warningCount}</span>
                        </span>
                      </div>
                    )}
                    {analysis.issues && analysis.issues > 0 && (
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-gray-600">
                          Problemy: <span className="font-medium text-orange-600">{analysis.issues}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Status - moved to second to last position */}
                <div className="flex items-center space-x-2">
                  {getStatusIcon(analysis.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                    {getStatusText(analysis.status)}
                  </span>
                </div>

                {/* Action button - now last */}
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