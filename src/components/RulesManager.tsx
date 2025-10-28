import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  X, 
  Plus, 
  Trash2, 
  Tag,
  Package,
  Info,
  XCircle
} from 'lucide-react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { useProductRulesStore } from '../stores/productRulesStore'
import type { ProductRule, ProductRuleType, ProductWarningLevel } from '../types/rules'

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
  // NOWY: Hooks dla nowego systemu ostrzeżeń
  const { supabaseUserId } = useCurrentUser()
  const { 
    rules: productRules, 
    loadRules, 
    addRule: addProductRule, 
    updateRule, 
    deleteRule: deleteProductRule 
  } = useProductRulesStore()
  
  // Karty dla filtrów poziomów ostrzeżeń
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories')
  const [activeLevelFilter, setActiveLevelFilter] = useState<'ALL' | 'LOW' | 'MEDIUM' | 'HIGH'>('ALL')
  
  const [showAddRule, setShowAddRule] = useState(false)
  const [newRuleType, setNewRuleType] = useState<ProductRuleType>('category')
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleWarningLevel, setNewRuleWarningLevel] = useState<ProductWarningLevel>('MEDIUM')
  const [newRuleDescription, setNewRuleDescription] = useState('')

  // Ładowanie reguł z Supabase
  useEffect(() => {
    if (supabaseUserId) {
      console.log('📥 RulesManager: Loading product rules for user:', supabaseUserId)
      loadRules(supabaseUserId)
    } else {
      console.warn('⚠️ RulesManager: No supabaseUserId - user not logged in')
    }
  }, [supabaseUserId, loadRules])

  const handleAddRule = async () => {
    if (!newRuleName.trim() || !supabaseUserId) {
      alert('Proszę zalogować się, aby dodawać reguły.')
      return
    }

    try {
      await addProductRule({
        ruleType: newRuleType,
        ruleValue: newRuleName.trim(),
        warningLevel: newRuleWarningLevel,
        description: newRuleDescription.trim() || undefined,
        isActive: true
      }, supabaseUserId)
      
      console.log('✅ Rule added successfully')
      
      // Reset form
      setNewRuleName('')
      setNewRuleDescription('')
      setNewRuleWarningLevel('MEDIUM')
      setShowAddRule(false)
    } catch (error) {
      console.error('❌ Failed to add rule:', error)
      alert('Nie udało się dodać reguły.')
    }
  }

  const handleRemoveRule = async (ruleId: string) => {
    if (!supabaseUserId) {
      alert('Proszę zalogować się, aby usuwać reguły.')
      return
    }

    if (window.confirm('Czy na pewno chcesz usunąć tę regułę?')) {
      try {
        await deleteProductRule(ruleId, supabaseUserId)
        console.log('✅ Rule deleted successfully')
      } catch (error) {
        console.error('❌ Failed to delete rule:', error)
        alert('Nie udało się usunąć reguły.')
      }
    }
  }

  // Funkcje pomocnicze dla nowego systemu
  const getWarningIcon = (level: ProductWarningLevel) => {
    switch (level) {
      case 'LOW': return <Info className="h-4 w-4 text-yellow-500" />
      case 'MEDIUM': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'HIGH': return <XCircle className="h-4 w-4 text-red-500" />
      default: return null
    }
  }

  const getWarningColor = (level: ProductWarningLevel) => {
    switch (level) {
      case 'LOW': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'MEDIUM': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getWarningLabel = (level: ProductWarningLevel) => {
    switch (level) {
      case 'LOW': return 'Niski'
      case 'MEDIUM': return 'Średni'
      case 'HIGH': return 'Wysoki'
      default: return 'Nieznany'
    }
  }

  // Filtrowanie reguł
  const filteredRules = activeLevelFilter === 'ALL' 
    ? productRules 
    : productRules.filter(rule => rule.warningLevel === activeLevelFilter)

  const categoryRules = filteredRules.filter(rule => rule.ruleType === 'category')
  const productRulesFiltered = filteredRules.filter(rule => rule.ruleType === 'product' || rule.ruleType === 'phrase')
  
  // Statystyki
  const stats = {
    total: productRules.length,
    low: productRules.filter(r => r.warningLevel === 'LOW').length,
    medium: productRules.filter(r => r.warningLevel === 'MEDIUM').length,
    high: productRules.filter(r => r.warningLevel === 'HIGH').length,
    categories: productRules.filter(r => r.ruleType === 'category').length,
    products: productRules.filter(r => r.ruleType === 'product').length,
    phrases: productRules.filter(r => r.ruleType === 'phrase').length
  }

  // Show login message if user is not logged in
  if (!supabaseUserId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6 text-center">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Wymagane logowanie
            </h3>
            <p className="text-gray-600 mb-6">
              Zaloguj się, aby korzystać z funkcji zarządzania regułami.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    )
  }

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
          {/* Tabs - Filtry poziomów ostrzeżeń */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveLevelFilter('ALL')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLevelFilter === 'ALL'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>Wszystkie ({stats.total})</span>
              </button>
              <button
                onClick={() => setActiveLevelFilter('HIGH')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLevelFilter === 'HIGH'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4" />
                  <span>Wysoki ({stats.high})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveLevelFilter('MEDIUM')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLevelFilter === 'MEDIUM'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Średni ({stats.medium})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveLevelFilter('LOW')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLevelFilter === 'LOW'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4" />
                  <span>Niski ({stats.low})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Tabs - Typy reguł */}
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
                  <span>Kategorie ({stats.categories})</span>
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
                  <span>Produkty/Frazy ({stats.products + stats.phrases})</span>
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
            {(activeTab === 'categories' ? categoryRules : productRulesFiltered).map((rule: ProductRule) => (
              <div key={rule.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {rule.ruleType === 'category' ? (
                      <Tag className="h-5 w-5 text-blue-600" />
                    ) : rule.ruleType === 'product' ? (
                      <Package className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-purple-600" />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{rule.ruleValue}</h4>
                      {rule.description && (
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        Utworzona: {new Date(rule.createdAt).toLocaleString('pl-PL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getWarningColor(rule.warningLevel)}`}>
                      <div className="flex items-center space-x-1">
                        {getWarningIcon(rule.warningLevel)}
                        <span>{getWarningLabel(rule.warningLevel)}</span>
                      </div>
                    </span>
                    <button
                      onClick={() => handleRemoveRule(rule.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === 'categories' ? categoryRules : productRulesFiltered).length === 0 && (
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-700">Wszystkie</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.high}</div>
              <div className="text-sm text-red-700">Wysoki</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.medium}</div>
              <div className="text-sm text-orange-700">Średni</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.low}</div>
              <div className="text-sm text-yellow-700">Niski</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
              <div className="text-sm text-green-700">Kategorie</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.products + stats.phrases}</div>
              <div className="text-sm text-purple-700">Produkty/Frazy</div>
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
                    onChange={(e) => setNewRuleType(e.target.value as ProductRuleType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="category">Kategoria produktu</option>
                    <option value="product">Konkretny produkt</option>
                    <option value="phrase">Fraza w nazwie/opisie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newRuleType === 'category' ? 'Nazwa kategorii' : newRuleType === 'product' ? 'Nazwa produktu' : 'Fraza do wyszukania'}
                  </label>
                  <input
                    type="text"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder={
                      newRuleType === 'category' ? 'np. Elektronika' :
                      newRuleType === 'product' ? 'np. iPhone 13' :
                      'np. uszkodzony, zwrot'
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poziom ostrzeżenia
                  </label>
                  <select
                    value={newRuleWarningLevel}
                    onChange={(e) => setNewRuleWarningLevel(e.target.value as ProductWarningLevel)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="LOW">Niski (żółty)</option>
                    <option value="MEDIUM">Średni (pomarańczowy)</option>
                    <option value="HIGH">Wysoki (czerwony)</option>
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
                    onClick={handleAddRule}
                    disabled={!newRuleName.trim() || !supabaseUserId}
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
