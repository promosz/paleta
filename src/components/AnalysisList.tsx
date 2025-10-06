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
      {analyses.map((analysis) => (
        <div key={analysis.id} className="card hover:shadow-md transition-shadow">
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
              {/* Status */}
              <div className="flex items-center space-x-2">
                {getStatusIcon(analysis.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                  {getStatusText(analysis.status)}
                </span>
              </div>

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
                      Produkty: <span className="font-medium">{analysis.productCount}</span>
                    </span>
                  </div>
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

              {/* Action button */}
              <Link
                to={`/analysis/${analysis.id}`}
                className="btn-primary"
              >
                Szczegóły
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnalysisList
