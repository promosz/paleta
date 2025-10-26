import React, { useState, useEffect } from 'react'
import { X, AlertCircle, Package, Tag, Search, Info } from 'lucide-react'
import type { ProductRuleType, ProductWarningLevel, ProductRule } from '../types/rules'

interface Product {
  nazwa: string
  kategoria: string
  [key: string]: any
}

interface AddRuleModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
  onSave: (rule: Omit<ProductRule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [warningLevel, setWarningLevel] = useState<ProductWarningLevel>('MEDIUM')
  const [ruleType, setRuleType] = useState<ProductRuleType>('product')
  const [ruleValue, setRuleValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Aktualizuj wartość reguły na podstawie wybranego produktu i typu
  useEffect(() => {
    if (!product) {
      setRuleValue('')
      return
    }

    switch (ruleType) {
      case 'category':
        setRuleValue(product.kategoria || '')
        break
      case 'product':
        setRuleValue(product.nazwa || '')
        break
      case 'phrase':
        setRuleValue('')
        break
    }
  }, [product, ruleType])

  // Walidacja formularza
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!ruleValue || ruleValue.trim() === '') {
      newErrors.ruleValue = 'Wartość reguły nie może być pusta'
    }

    if (ruleType === 'phrase' && ruleValue.length < 3) {
      newErrors.ruleValue = 'Fraza musi mieć co najmniej 3 znaki'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Zapisanie reguły
  const handleSave = () => {
    if (!validate()) {
      return
    }

    onSave({
      ruleType,
      ruleValue: ruleValue.trim(),
      warningLevel,
      description: description.trim() || undefined,
      isActive: true
    })

    // Reset formularza
    setWarningLevel('MEDIUM')
    setRuleType('product')
    setRuleValue('')
    setDescription('')
    setErrors({})
    onClose()
  }

  // Anulowanie
  const handleCancel = () => {
    setWarningLevel('MEDIUM')
    setRuleType('product')
    setRuleValue('')
    setDescription('')
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Dodaj regułę ostrzeżenia</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Poziom ostrzeżenia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poziom ostrzeżenia *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { level: 'LOW' as ProductWarningLevel, label: 'Niski', icon: Info, color: 'yellow' },
                { level: 'MEDIUM' as ProductWarningLevel, label: 'Średni', icon: AlertCircle, color: 'orange' },
                { level: 'HIGH' as ProductWarningLevel, label: 'Wysoki', icon: X, color: 'red' }
              ].map(({ level, label, icon: Icon, color }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setWarningLevel(level)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all ${
                    warningLevel === level
                      ? `border-${color}-500 bg-${color}-50`
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${
                    warningLevel === level ? `text-${color}-600` : 'text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    warningLevel === level ? `text-${color}-700` : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Typ reguły */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typ reguły *
            </label>
            <div className="space-y-2">
              {[
                { type: 'category' as ProductRuleType, label: 'Kategoria', icon: Tag },
                { type: 'product' as ProductRuleType, label: 'Produkt', icon: Package },
                { type: 'phrase' as ProductRuleType, label: 'Fraza tekstowa', icon: Search }
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRuleType(type)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                    ruleType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    ruleType === type ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className={`font-medium ${
                    ruleType === type ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Wartość reguły */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {ruleType === 'category' ? 'Kategoria' : ruleType === 'product' ? 'Nazwa produktu' : 'Fraza'} *
            </label>
            <input
              type="text"
              value={ruleValue}
              onChange={(e) => setRuleValue(e.target.value)}
              placeholder={
                ruleType === 'category' ? 'np. Elektronika' : 
                ruleType === 'product' ? 'np. iPhone 13' : 
                'np. uszkodzony'
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ruleValue ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={ruleType === 'category' || (ruleType === 'product' && !!product)}
            />
            {errors.ruleValue && (
              <p className="mt-1 text-sm text-red-600">{errors.ruleValue}</p>
            )}
          </div>

          {/* Opis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opis (opcjonalny)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dodatkowe informacje o regule..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Dodaj regułę
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddRuleModal

