import React, { useState } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  X, 
  Tag,
  Package,
  CheckCircle,
  Info
} from 'lucide-react'

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
  status?: 'blocked' | 'warning' | 'allowed'
  waluta: string
  cenaSprzedazyNetto: number
  walutaSprzedazy: string
  link: string
  fcSku: string
  rentownosc: number
  wartoscSprzedazyNetto: number
  marza: number
}

interface ProductActionsProps {
  product: Product
  onAddToRules: (product: Product, action: 'block' | 'warning') => void
  onAddCategoryToRules: (category: string, action: 'block' | 'warning') => void
  onRemoveRule: (ruleId: string) => void
  existingRules: Array<{
    id: string
    type: 'category' | 'product'
    name: string
    action: 'block' | 'warning'
  }>
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  onAddToRules,
  onAddCategoryToRules,
  onRemoveRule,
  existingRules
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleAction = (type: 'product' | 'category', action: 'block' | 'warning') => {
    // Sprawdź czy reguła już istnieje
    const existingRule = existingRules.find(rule => 
      rule.type === type && 
      rule.name.toLowerCase() === (type === 'product' ? product.nazwa.toLowerCase() : product.kategoria.toLowerCase()) &&
      rule.action === action
    )
    
    if (existingRule) {
      // Usuń istniejącą regułę
      onRemoveRule(existingRule.id)
    } else {
      // Dodaj nową regułę
      if (type === 'product') {
        onAddToRules(product, action)
      } else {
        onAddCategoryToRules(product.kategoria, action)
      }
    }
    setIsOpen(false)
  }

  const getButtonText = (type: 'product' | 'category', action: 'block' | 'warning') => {
    const existingRule = existingRules.find(rule => 
      rule.type === type && 
      rule.name.toLowerCase() === (type === 'product' ? product.nazwa.toLowerCase() : product.kategoria.toLowerCase()) &&
      rule.action === action
    )
    
    const actionText = action === 'block' ? 'Zablokuj' : 'Ostrzeż'
    const removeText = action === 'block' ? 'Odblokuj' : 'Usuń ostrzeżenie'
    
    return existingRule ? removeText : actionText
  }


  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Shield className="h-5 w-5 mr-2" />
          Reguły
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="none">
            <span className="block px-4 py-2 text-xs text-gray-500">Zarządzaj regułami analizy:</span>
            
            <button
              onClick={() => handleAction('product', 'warning')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 hover:text-yellow-900"
              role="menuitem"
            >
              <Package className="h-4 w-4 mr-2" /> {getButtonText('product', 'warning')} ten produkt
            </button>
            
            <button
              onClick={() => handleAction('product', 'block')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
              role="menuitem"
            >
              <X className="h-4 w-4 mr-2" /> {getButtonText('product', 'block')} ten produkt
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => handleAction('category', 'warning')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-50 hover:text-yellow-900"
              role="menuitem"
            >
              <Tag className="h-4 w-4 mr-2" /> {getButtonText('category', 'warning')} kategorię "{product.kategoria}"
            </button>
            
            <button
              onClick={() => handleAction('category', 'block')}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
              role="menuitem"
            >
              <Tag className="h-4 w-4 mr-2" /> {getButtonText('category', 'block')} kategorię "{product.kategoria}"
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductActions
