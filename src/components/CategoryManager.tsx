/**
 * Category Manager - UI do zarządzania mapowaniami kategorii
 * 
 * Funkcjonalności:
 * - Wyświetlanie wszystkich kategorii z produktów
 * - Preview auto-mapowania przed zastosowaniem
 * - Ręczna edycja mapowań
 * - Statystyki i wizualizacje
 */

import React, { useState, useEffect, useMemo } from 'react'
import { X, Tag, TrendingUp, CheckCircle, AlertCircle, Zap, Save, RefreshCw, Info } from 'lucide-react'
import { CategoryMapperService } from '../services/categoryMapperService'
import type { CategoryMappingDB } from '../services/categoryMapperService'

interface Product {
  id?: string
  kategoria: string
  [key: string]: any
}

interface CategoryManagerProps {
  userId: string
  analysisId: string
  products: Product[]
  onClose: () => void
  onMappingsUpdate: () => void
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  userId,
  analysisId,
  products,
  onClose,
  onMappingsUpdate
}) => {
  const [mappings, setMappings] = useState<CategoryMappingDB[]>([])
  const [preview, setPreview] = useState<Array<{
    original: string
    normalized: string
    action: 'existing' | 'new' | 'fuzzy_match'
    confidence: number
    productCount: number
  }>>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedMappings, setEditedMappings] = useState<Map<string, string>>(new Map())
  const [activeTab, setActiveTab] = useState<'preview' | 'mappings'>('preview')

  // Statystyki kategorii
  const categoryStats = useMemo(() => {
    const stats = new Map<string, number>()
    products.forEach(p => {
      if (p.kategoria) {
        const count = stats.get(p.kategoria) || 0
        stats.set(p.kategoria, count + 1)
      }
    })
    return stats
  }, [products])

  const uniqueCategories = Array.from(categoryStats.keys()).sort()
  const totalProducts = products.length

  // Load preview
  useEffect(() => {
    loadPreview()
    loadMappings()
  }, [userId, products])

  const loadPreview = async () => {
    try {
      setLoading(true)
      const previewData = await CategoryMapperService.previewAutoMapping(userId, products)
      setPreview(previewData)
    } catch (error) {
      console.error('Failed to load preview:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMappings = async () => {
    try {
      const mappingsData = await CategoryMapperService.getUserMappings(userId)
      setMappings(mappingsData)
    } catch (error) {
      console.error('Failed to load mappings:', error)
    }
  }

  const handleAutoMap = async () => {
    try {
      setSaving(true)
      
      // Auto-map categories
      const categoryMap = await CategoryMapperService.autoMapCategories(
        userId,
        analysisId,
        products
      )
      
      // Update products in database
      await CategoryMapperService.updateProductCategories(analysisId, categoryMap)
      
      // Refresh data
      await loadMappings()
      await loadPreview()
      
      // Notify parent
      onMappingsUpdate()
      
      alert(`✅ Auto-mapowanie zakończone!\n\nZmapowano ${categoryMap.size} kategorii.`)
    } catch (error) {
      console.error('Auto-mapping failed:', error)
      alert('❌ Błąd podczas auto-mapowania: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleManualEdit = (original: string, normalized: string) => {
    const newEditedMappings = new Map(editedMappings)
    newEditedMappings.set(original, normalized)
    setEditedMappings(newEditedMappings)
  }

  const handleSaveManual = async () => {
    if (editedMappings.size === 0) {
      alert('Brak zmian do zapisania')
      return
    }

    try {
      setSaving(true)
      
      const mappingsArray = Array.from(editedMappings.entries()).map(([original, normalized]) => ({
        original,
        normalized,
        isManual: true
      }))
      
      const result = await CategoryMapperService.batchUpdateMappings(
        userId,
        mappingsArray,
        analysisId
      )
      
      // Update products
      await CategoryMapperService.updateProductCategories(analysisId, editedMappings)
      
      // Refresh
      await loadMappings()
      await loadPreview()
      setEditedMappings(new Map())
      
      onMappingsUpdate()
      
      alert(`✅ Zapisano zmiany!\n\n${result.success} mapowań zaktualizowanych${result.errors > 0 ? `, ${result.errors} błędów` : ''}`)
    } catch (error) {
      console.error('Failed to save mappings:', error)
      alert('❌ Błąd podczas zapisywania: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'existing':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Istniejące</span>
      case 'fuzzy_match':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Dopasowanie</span>
      case 'new':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Nowe</span>
      default:
        return null
    }
  }

  const getConfidenceBadge = (confidence: number) => {
    const percentage = Math.round(confidence * 100)
    const color = confidence >= 0.9 ? 'green' : confidence >= 0.7 ? 'yellow' : 'red'
    return (
      <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 text-xs rounded-full font-medium`}>
        {percentage}%
      </span>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Ładowanie mapowań kategorii...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Tag className="h-6 w-6" />
            <div>
              <h2 className="text-2xl font-bold">Zarządzanie kategoriami</h2>
              <p className="text-blue-100 text-sm">
                {uniqueCategories.length} kategorii · {totalProducts} produktów
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-1 p-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Podgląd auto-mapowania
            </button>
            <button
              onClick={() => setActiveTab('mappings')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'mappings'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-white hover:bg-opacity-50'
              }`}
            >
              <Tag className="h-4 w-4 inline mr-2" />
              Wszystkie mapowania ({mappings.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Jak działa auto-mapowanie?</h3>
                  <p className="text-sm text-blue-700">
                    System automatycznie grupuje podobne kategorie (np. "gl_pc" i "PC") i mapuje je na jedną znormalizowaną nazwę.
                    Wykorzystuje algorytm Levenshtein distance do znajdowania podobieństw.
                  </p>
                </div>
              </div>

              {/* Preview Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Oryginalna kategoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Produktów
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        →
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Zmapowana na
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Pewność
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Typ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preview.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.original}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.productCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          →
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="font-semibold text-blue-700">{item.normalized}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getConfidenceBadge(item.confidence)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getActionBadge(item.action)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Istniejące</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {preview.filter(p => p.action === 'existing').length}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Dopasowane</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {preview.filter(p => p.action === 'fuzzy_match').length}
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Nowe</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {preview.filter(p => p.action === 'new').length}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mappings' && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Oryginalna
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Produktów
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Zmapowana na
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Typ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {uniqueCategories.map(category => {
                      const mapping = mappings.find(m => m.original_category === category)
                      const productCount = categoryStats.get(category) || 0
                      const currentNormalized = editedMappings.get(category) || mapping?.normalized_category || category
                      
                      return (
                        <tr key={category} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {productCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              value={currentNormalized}
                              onChange={(e) => handleManualEdit(category, e.target.value.toUpperCase())}
                              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {mapping?.is_manual ? (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                Ręczne
                              </span>
                            ) : mapping ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Auto
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                Brak
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {editedMappings.size > 0 && (
              <span className="text-blue-600 font-medium">
                {editedMappings.size} zmian do zapisania
              </span>
            )}
          </div>
          <div className="flex space-x-3">
            {activeTab === 'preview' && (
              <button
                onClick={handleAutoMap}
                disabled={saving}
                className="btn-primary flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Mapowanie...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Zastosuj auto-mapowanie</span>
                  </>
                )}
              </button>
            )}
            {activeTab === 'mappings' && (
              <button
                onClick={handleSaveManual}
                disabled={saving || editedMappings.size === 0}
                className="btn-primary flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Zapisywanie...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Zapisz zmiany</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryManager

