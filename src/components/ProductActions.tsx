import React, { useState } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  X, 
  Plus, 
  Tag,
  Package,
  CheckCircle,
  Info
} from 'lucide-react'

interface Product {
  paleta: string
  nazwa: string
  kategoria: string
  cena: number
  ilosc: number
  opis?: string
  status?: 'blocked' | 'warning' | 'allowed'
}

interface ProductActionsProps {
  product: Product
  onAddToRules: (product: Product, action: 'block' | 'warning') => void
  onAddCategoryToRules: (category: string, action: 'block' | 'warning') => void
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onAddToRules,
  onAddCategoryToRules
}) => {
  const [showActions, setShowActions] = useState(false)
  const [selectedAction, setSelectedAction] = useState<'block' | 'warning'>('warning')

  const handleAddProduct = () => {
    onAddToRules(product, selectedAction)
    setShowActions(false)
  }

  const handleAddCategory = () => {
    onAddCategoryToRules(product.kategoria, selectedAction)
    setShowActions(false)
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'blocked': return <X className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'allowed': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'blocked': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'allowed': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'blocked': return 'Zablokowany'
      case 'warning': return 'Ostrzeżenie'
      case 'allowed': return 'Dozwolony'
      default: return 'Nieznany'
    }
  }

  return (
    <div className="relative">
      {/* Action Button */}
      <button
        onClick={() => setShowActions(!showActions)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
      >
        <Shield className="h-4 w-4" />
        <span className="text-sm">Reguły</span>
        <svg 
          className={`h-3 w-3 transition-transform ${showActions ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Status Indicator */}
      {product.status && (
        <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
          <div className="flex items-center space-x-1">
            {getStatusIcon(product.status)}
            <span>{getStatusLabel(product.status)}</span>
          </div>
        </div>
      )}

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h4 className="font-medium text-gray-900 mb-3">Dodaj do reguł analizy</h4>
            
            {/* Action Type Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ działania
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedAction('warning')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedAction === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Ostrzeżenie</span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedAction('block')}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedAction === 'block'
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <X className="h-4 w-4" />
                    <span>Blokowanie</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h5 className="font-medium text-gray-900 mb-2">Produkt:</h5>
              <p className="text-sm text-gray-700 mb-1">{product.nazwa}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Tag className="h-3 w-3" />
                <span>Kategoria: {product.kategoria}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleAddProduct}
                className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Dodaj ten produkt do reguł</span>
              </button>
              
              <button
                onClick={handleAddCategory}
                className="w-full flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Tag className="h-4 w-4" />
                <span>Dodaj kategorię "{product.kategoria}" do reguł</span>
              </button>
            </div>

            {/* Info */}
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p><strong>Ostrzeżenie:</strong> Produkty będą oznaczone ale dozwolone</p>
                  <p><strong>Blokowanie:</strong> Produkty będą całkowicie zablokowane</p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowActions(false)}
              className="w-full mt-3 px-3 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductActions
