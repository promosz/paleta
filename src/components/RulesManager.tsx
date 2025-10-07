import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  X, 
  Plus, 
  Trash2, 
  Tag,
  Package
} from 'lucide-react'

interface Rule {
  id: string
  type: 'category' | 'product'
  name: string
  action: 'warning'
  description?: string
  createdAt: Date
  updatedAt: Date
}

interface RulesManagerProps {
  onClose: () => void
  onAddCategoryRule?: (category: string, action: 'warning') => void
  onAddProductRule?: (product: string, action: 'warning') => void
  onRemoveRule?: (ruleId: string) => void
}

const RulesManager: React.FC<RulesManagerProps> = ({
  onClose,
  onAddCategoryRule,
  onAddProductRule,
  onRemoveRule
}) => {
  const [rules, setRules] = useState<Rule[]>([])
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories')
  const [showAddRule, setShowAddRule] = useState(false)
  const [newRuleType, setNewRuleType] = useState<'category' | 'product'>('category')
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleAction, setNewRuleAction] = useState<'warning'>('warning')
  const [newRuleDescription, setNewRuleDescription] = useState('')

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = () => {
    // Load rules from localStorage
    const savedRules = localStorage.getItem('analysis-rules')
    if (savedRules) {
      try {
        const parsedRules = JSON.parse(savedRules).map((rule: any) => ({
          ...rule,
          createdAt: new Date(rule.createdAt),
          updatedAt: new Date(rule.updatedAt)
        }))
        setRules(parsedRules)
      } catch (error) {
        console.error('Failed to load rules:', error)
      }
    }
  }

  const addRule = () => {
    if (!newRuleName.trim()) return

    // Call parent callbacks to handle the rule addition
    if (newRuleType === 'category' && onAddCategoryRule) {
      onAddCategoryRule(newRuleName.trim(), newRuleAction)
    } else if (newRuleType === 'product' && onAddProductRule) {
      onAddProductRule({ nazwa: newRuleName.trim() } as any, newRuleAction)
    }

    // Reset form
    setNewRuleName('')
    setNewRuleDescription('')
    setShowAddRule(false)
  }

  const removeRule = (ruleId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę regułę?')) {
      if (onRemoveRule) {
        onRemoveRule(ruleId)
      }
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return null
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'warning': return 'Ostrzeżenie'
      default: return 'Nieznane'
    }
  }

  const categoryRules = rules.filter(rule => rule.type === 'category')
  const productRules = rules.filter(rule => rule.type === 'product')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Zarządzanie regułami analizy</h2>
              <p className="text-sm text-gray-600">Konfiguracja blokowanych kategorii i produktów</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4" />
                  <span>Kategorie ({categoryRules.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4" />
                  <span>Produkty ({productRules.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Add Rule Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'categories' ? 'Reguły kategorii' : 'Reguły produktów'}
            </h3>
            <button
              onClick={() => setShowAddRule(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Dodaj regułę</span>
            </button>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {(activeTab === 'categories' ? categoryRules : productRules).map(rule => (
              <div key={rule.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {activeTab === 'categories' ? (
                      <Tag className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Package className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{rule.name}</h4>
                      {rule.description && (
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Utworzona: {rule.createdAt.toLocaleString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getActionColor(rule.action)}`}>
                      <div className="flex items-center space-x-1">
                        {getActionIcon(rule.action)}
                        <span>{getActionLabel(rule.action)}</span>
                      </div>
                    </span>
                    <button
                      onClick={() => removeRule(rule.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'categories' ? categoryRules : productRules).length === 0 && (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-3">
                  {activeTab === 'categories' ? (
                    <Tag className="h-12 w-12 text-gray-400" />
                  ) : (
                    <Package className="h-12 w-12 text-gray-400" />
                  )}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Brak reguł {activeTab === 'categories' ? 'kategorii' : 'produktów'}
                    </h4>
                    <p className="text-gray-500">
                      Dodaj pierwszą regułę, aby rozpocząć konfigurację analizy
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddRule(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Dodaj pierwszą regułę</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{rules.length}</div>
              <div className="text-sm text-blue-700">Wszystkie reguły</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                0
              </div>
              <div className="text-sm text-red-700">Blokujące</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {rules.filter(r => r.action === 'warning').length}
              </div>
              <div className="text-sm text-yellow-700">Ostrzeżenia</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{categoryRules.length}</div>
              <div className="text-sm text-green-700">Kategorie</div>
            </div>
          </div>
        </div>

        {/* Add Rule Modal */}
        {showAddRule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Dodaj nową regułę</h3>
                <button
                  onClick={() => setShowAddRule(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ reguły
                  </label>
                  <select
                    value={newRuleType}
                    onChange={(e) => setNewRuleType(e.target.value as 'category' | 'product')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="category">Kategoria produktu</option>
                    <option value="product">Konkretny produkt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newRuleType === 'category' ? 'Nazwa kategorii' : 'Nazwa produktu'}
                  </label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder={newRuleType === 'category' ? 'np. Elektronika' : 'np. iPhone 13'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Działanie
                  </label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as 'warning')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="warning">Ostrzeżenie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis (opcjonalny)
                  </label>
                  <textarea
                    value={newRuleDescription}
                    onChange={(e) => setNewRuleDescription(e.target.value)}
                    placeholder="Dodatkowe informacje o regule..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddRule(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={addRule}
                    disabled={!newRuleName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Dodaj regułę
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RulesManager
