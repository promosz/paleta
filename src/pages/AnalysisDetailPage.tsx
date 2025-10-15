import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, FileSpreadsheet, TrendingUp, Package, AlertTriangle, CheckCircle, BarChart3, Brain, Loader, ExternalLink } from 'lucide-react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import ProductFilter from '../components/ProductFilter'
import ProductActions from '../components/ProductActions'
import RulesManager from '../components/RulesManager'
import { hybridAIService } from '../services/hybridAIService'
import { useAnalysisStore } from '../stores/analysisStoreSupabase'
import { useProducts } from '../hooks/useProducts'
import { useCurrentUser } from '../hooks/useCurrentUser'

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
  status?: 'warning' | 'allowed' | 'blocked'
  appliedRule?: string
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

const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { supabaseUserId } = useCurrentUser()
  const { analyses, loadAnalyses } = useAnalysisStore()
  const { products: dbProducts, loading: productsLoading } = useProducts(id || '', supabaseUserId || '')
  
  const [showRulesManager, setShowRulesManager] = useState(false)
  const [productsWithStatus, setProductsWithStatus] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [rules, setRules] = useState<any[]>([])
  const [aiReport, setAiReport] = useState<{
    summary: string
    productAnalysis: string
    recommendations: string
    buyDecision: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'CAUTION' | 'AVOID'
    confidenceScore: number
  } | null>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  
  // Pobierz dane analizy z store
  const analysis = analyses.find(a => a.id === id)
  
  // Załaduj analizy jeśli nie są załadowane
  useEffect(() => {
    if (supabaseUserId && analyses.length === 0) {
      loadAnalyses(supabaseUserId)
    }
  }, [supabaseUserId, analyses.length, loadAnalyses])

  // Load rules on component mount
  const loadRules = () => {
    const savedRules = localStorage.getItem('analysis-rules')
    if (savedRules) {
      try {
        setRules(JSON.parse(savedRules))
      } catch (error) {
        console.error('Failed to load rules:', error)
      }
    }
  }

  // Funkcja sortowania produktów
  const sortProducts = useCallback((products: Product[], field: string | null, direction: 'asc' | 'desc') => {
    if (!field) return products

    return [...products].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (field) {
        case 'name':
          aValue = a.nazwa.toLowerCase()
          bValue = b.nazwa.toLowerCase()
          break
        case 'category':
          aValue = (a.kategoria || '').toLowerCase()
          bValue = (b.kategoria || '').toLowerCase()
          break
        case 'pcs':
          aValue = a.pcs || 0
          bValue = b.pcs || 0
          break
        case 'cenaBrutto':
          aValue = a.cenaRegularnaBrutto || 0
          bValue = b.cenaRegularnaBrutto || 0
          break
        case 'cenaNetto':
          aValue = a.cenaSprzedazyNetto || 0
          bValue = b.cenaSprzedazyNetto || 0
          break
        case 'marza':
          aValue = a.marza || 0
          bValue = b.marza || 0
          break
        case 'rentownosc':
          aValue = a.rentownosc || 0
          bValue = b.rentownosc || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    })
  }, [])

  // Funkcja obsługi kliknięcia w nagłówek tabeli
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Jeśli kliknięto ten sam nagłówek, zmień kierunek
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Jeśli kliknięto nowy nagłówek, ustaw jako asc
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Funkcja renderowania ikony sortowania
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕️</span>
    }
    return sortDirection === 'asc' ? <span className="text-blue-600">↑</span> : <span className="text-blue-600">↓</span>
  }

  const analyzeProductsWithRules = useCallback(() => {
    if (dbProducts.length === 0) return

    console.log('🔍 Mapowanie produktów z bazy, przykładowy produkt:', dbProducts[0])

    const updatedProducts = dbProducts.map(product => {
      // Debug - sprawdź pierwsze 3 produkty
      if (dbProducts.indexOf(product) < 3) {
        console.log('📦 Produkt z bazy:', {
          name: product.name,
          priceGross: product.priceGross,
          priceNet: product.priceNet,
          quantity: product.quantity,
          rawData: product.rawData
        })
      }

      const productForRules = {
        nazwa: product.name,
        kategoria: product.category || 'Brak kategorii',
        paleta: product.paletaId || '',
        foto: product.foto || '',
        ean: product.ean || '',
        kod1: product.code1 || '',
        kod2: product.code2 || '',
        packId: product.packId || '',
        pcs: product.quantity || 1,
        cenaRegularnaBrutto: product.priceGross || 0,
        waluta: product.currency || 'PLN',
        cenaSprzedazyNetto: product.priceNet || 0,
        walutaSprzedazy: product.currency || 'PLN',
        link: product.link || '',
        fcSku: product.fcSku || '',
        wartoscSprzedazyNetto: product.priceNet || 0,
        marza: (product.priceGross || 0) - (product.priceNet || 0),
        rentownosc: product.priceGross ? (((product.priceGross - (product.priceNet || 0)) / product.priceGross) * 100) : 0
      }
      
      // Debug wynik mapowania
      if (dbProducts.indexOf(product) < 3) {
        console.log('📊 Zmapowany produkt:', {
          nazwa: productForRules.nazwa,
          pcs: productForRules.pcs,
          cenaRegularnaBrutto: productForRules.cenaRegularnaBrutto,
          cenaSprzedazyNetto: productForRules.cenaSprzedazyNetto,
          marza: productForRules.marza,
          rentownosc: productForRules.rentownosc
        })
      }
      let status: 'warning' | 'allowed' = 'allowed'
      let appliedRule: string | undefined = undefined

      // Check product rules first (higher priority) - only warning rules
      const productRule = rules.find(rule => 
        rule.type === 'product' && 
        rule.name.toLowerCase() === productForRules.nazwa.toLowerCase() &&
        rule.action === 'warning'
      )
      
      if (productRule) {
        status = 'warning'
        appliedRule = 'Produkt'
      } else {
        // Check category rules if no product rule found - only warning rules
        const categoryRule = rules.find(rule => 
          rule.type === 'category' && 
          rule.name.toLowerCase() === productForRules.kategoria.toLowerCase() &&
          rule.action === 'warning'
        )
        
        if (categoryRule) {
          status = 'warning'
          appliedRule = 'Kategoria'
        }
      }

      const result = { ...productForRules, status, appliedRule }
      if (status !== 'allowed') {
        console.log(`Product ${productForRules.nazwa} - Status: ${status}, Rule: ${appliedRule}`)
      }
      return result
    })
    
    // Store products with status
    setProductsWithStatus(updatedProducts)
  }, [dbProducts, rules])

  useEffect(() => {
    loadRules()
  }, [])

  // Update products with status when analysis data or rules change
  useEffect(() => {
    analyzeProductsWithRules()
  }, [analyzeProductsWithRules])

  // Generate AI report when products are loaded
  useEffect(() => {
    if (productsWithStatus.length > 0 && !aiReport && !isLoadingReport) {
      generateAIReport()
    }
  }, [productsWithStatus])

  const generateAIReport = async () => {
    if (productsWithStatus.length === 0) return
    
    setIsLoadingReport(true)
    try {
      const report = await hybridAIService.generatePaletteReport(productsWithStatus)
      setAiReport(report)
    } catch (error) {
      console.error('Failed to generate AI report:', error)
      // If AI fails, still show a basic report using mock data
      const report = await hybridAIService.generatePaletteReport(productsWithStatus)
      setAiReport(report)
    } finally {
      setIsLoadingReport(false)
    }
  }

  const handleAddToRules = (product: Product, action: 'block' | 'warning') => {
    const newRule = {
      id: Date.now().toString(),
      type: 'product',
      name: product.nazwa,
      action,
      description: `Dodano z analizy ${analysis?.name || 'nieznana'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedRules = [...rules, newRule]
    localStorage.setItem('analysis-rules', JSON.stringify(updatedRules))
    setRules(updatedRules)
  }

  const handleAddCategoryToRules = (category: string, action: 'block' | 'warning') => {
    const newRule = {
      id: Date.now().toString(),
      type: 'category',
      name: category,
      action,
      description: `Dodano z analizy ${analysis?.name || 'nieznana'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedRules = [...rules, newRule]
    localStorage.setItem('analysis-rules', JSON.stringify(updatedRules))
    setRules(updatedRules)
  }

  const handleRemoveRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId)
    localStorage.setItem('analysis-rules', JSON.stringify(updatedRules))
    setRules(updatedRules)
  }

  // Jeśli ładuje dane, pokaż loading
  if (productsLoading || !analysis) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie szczegółów analizy...</p>
        </div>
      </div>
    )
  }

  // Oblicz podsumowanie z prawdziwych produktów z bazy
  const totalRevenue = productsWithStatus.reduce((sum, p) => sum + p.cenaRegularnaBrutto, 0)
  const totalCost = productsWithStatus.reduce((sum, p) => sum + p.cenaSprzedazyNetto, 0)
  const avgProfitability = productsWithStatus.length > 0 
    ? productsWithStatus.reduce((sum, p) => sum + p.rentownosc, 0) / productsWithStatus.length 
    : 0
  const issuesCount = productsWithStatus.filter(p => p.status === 'warning').length

  const renderContentTab = () => {
    // Użyj produktów z Supabase
    let displayProducts = filteredProducts.length > 0 ? filteredProducts : productsWithStatus
    
    // Zastosuj sortowanie
    displayProducts = sortProducts(displayProducts, sortField, sortDirection)
    
    // Sprawdź czy są produkty bez cen
    const productsWithoutPrices = displayProducts.filter(p => 
      !p.cenaRegularnaBrutto || p.cenaRegularnaBrutto === 0
    ).length
    
    return (
      <div className="space-y-6">
        {/* Info o brakujących danych */}
        {productsWithoutPrices > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800">Uwaga</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {productsWithoutPrices} produktów nie ma pełnych danych cenowych. 
                  Jeśli to nowa analiza z zaktualizowanym parserem, ceny powinny być widoczne.
                  Jeśli to stara analiza, prześlij plik ponownie aby zaktualizować dane.
                </p>
              </div>
            </div>
          </div>
        )}
      
        {/* Product Filter */}
        {productsWithStatus.length > 0 && (
          <ProductFilter
            products={productsWithStatus}
            onFilteredProducts={setFilteredProducts}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Wszystkie produkty z analizy ({displayProducts.length})
          </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zdjęcie
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nazwa produktu / Kategoria</span>
                    {renderSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('pcs')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Liczba sztuk</span>
                    {renderSortIcon('pcs')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('cenaBrutto')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Cena brutto</span>
                    {renderSortIcon('cenaBrutto')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('cenaNetto')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Cena netto</span>
                    {renderSortIcon('cenaNetto')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('marza')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Marża</span>
                    {renderSortIcon('marza')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('rentownosc')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Rentowność</span>
                    {renderSortIcon('rentownosc')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status / Akcje
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayProducts.map((product, index) => {
                // Ensure product has status, default to 'allowed' if not present
                const productStatus = product.status || 'allowed'
                
                return (
                  <tr 
                    key={index} 
                    className={`${productStatus === 'warning' ? 'bg-yellow-50' : ''} hover:bg-gray-50 cursor-pointer transition-colors group`}
                    onClick={() => {
                      console.log('🖱️ Kliknięto w produkt:', { analysisId: id, productIndex: index, productName: product.nazwa })
                      const basePath = location.pathname.startsWith('/paleta') ? '/paleta' : ''
                      navigate(`${basePath}/analysis/${id}/product/${index}`)
                    }}
                    title="Kliknij aby zobaczyć szczegóły produktu"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        onClick={(e) => {
                          e.stopPropagation()
                          if (product.foto) {
                            window.open(product.foto, '_blank', 'noopener,noreferrer')
                          }
                        }}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        title="Kliknij aby zobaczyć zdjęcie w nowej karcie"
                      >
                        <ProductImage 
                          foto={product.foto} 
                          nazwa={product.nazwa} 
                          className="w-16 h-16" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                      <div className="space-y-1">
                        <div className="truncate font-medium hover:text-blue-600 transition-colors flex items-center space-x-1" title={product.nazwa}>
                          <span>{product.nazwa}</span>
                          <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.kategoria}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4 text-purple-600" />
                        <span className="font-bold text-purple-700">{product.pcs}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold text-green-700">
                        {product.cenaRegularnaBrutto.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {product.cenaSprzedazyNetto.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold text-blue-700">
                        {product.marza.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className={`font-bold ${
                        product.rentownosc >= 80 ? 'text-green-700' :
                        product.rentownosc >= 60 ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {product.rentownosc.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div onClick={(e) => e.stopPropagation()}>
                        <ProductActions
                          product={product}
                          onAddToRules={handleAddToRules}
                          onAddCategoryToRules={handleAddCategoryToRules}
                          onRemoveRule={handleRemoveRule}
                          existingRules={rules}
                          showStatusInButton={true}
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    )
  }

  const renderProfitabilityTab = () => {
    if (isLoadingReport) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600">AI analizuje zestawienie...</p>
        </div>
      )
    }

    if (!aiReport) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Brak dostępnej analizy AI</p>
          <button
            onClick={generateAIReport}
            className="mt-4 btn-primary"
          >
            Wygeneruj analizę
          </button>
        </div>
      )
    }

    const getBuyDecisionColor = (decision: string) => {
      switch (decision) {
        case 'STRONG_BUY': return 'bg-green-100 text-green-800 border-green-300'
        case 'BUY': return 'bg-green-50 text-green-700 border-green-200'
        case 'HOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
        case 'CAUTION': return 'bg-orange-100 text-orange-800 border-orange-300'
        case 'AVOID': return 'bg-red-100 text-red-800 border-red-300'
        default: return 'bg-gray-100 text-gray-800 border-gray-300'
      }
    }

    return (
      <div className="space-y-6">
        {/* AI Header */}
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-gray-900">Analiza AI</h3>
                <p className="text-sm text-gray-600">Inteligentna ocena zestawienia produktów</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 ${getBuyDecisionColor(aiReport.buyDecision)}`}>
              <div className="text-xs font-medium mb-1">Rekomendacja</div>
              <div className="text-lg font-bold">{aiReport.buyDecision.replace('_', ' ')}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${aiReport.confidenceScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Pewność: {aiReport.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Podsumowanie */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-600" />
            Podsumowanie zestawienia
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{aiReport.summary}</p>
          </div>
        </div>

        {/* Analiza produktów */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Analiza produktów
          </h3>
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-line space-y-2">
              {aiReport.productAnalysis.split('\n').map((line, idx) => {
                if (line.startsWith('**')) {
                  return <div key={idx} className="font-semibold text-gray-900 mt-3">{line.replace(/\*\*/g, '')}</div>
                }
                if (line.startsWith('•')) {
                  return <div key={idx} className="ml-4 text-gray-700">{line}</div>
                }
                if (line.match(/^\d+\./)) {
                  return <div key={idx} className="ml-4 text-gray-700">{line}</div>
                }
                if (line.trim() === '') {
                  return <div key={idx} className="h-2"></div>
                }
                return <div key={idx} className="ml-6 text-gray-600 text-sm">{line}</div>
              })}
            </div>
          </div>
        </div>

        {/* Rekomendacje */}
        <div className="card border-2 border-blue-200 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Rekomendacje zakupu
          </h3>
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-line space-y-2">
              {aiReport.recommendations.split('\n').map((line, idx) => {
                if (line.startsWith('**Rekomendacja')) {
                  return <div key={idx} className="text-xl font-bold text-gray-900 mb-4">{line.replace(/\*\*/g, '')}</div>
                }
                if (line.startsWith('**')) {
                  return <div key={idx} className="font-semibold text-gray-900 mt-3">{line.replace(/\*\*/g, '')}</div>
                }
                if (line.startsWith('✅') || line.startsWith('⚠️') || line.startsWith('🔴')) {
                  return <div key={idx} className="text-base font-medium text-gray-800 mt-2">{line}</div>
                }
                if (line.startsWith('•')) {
                  return <div key={idx} className="ml-4 text-gray-700">{line}</div>
                }
                if (line.trim() === '') {
                  return <div key={idx} className="h-2"></div>
                }
                return <div key={idx} className="text-gray-600">{line}</div>
              })}
            </div>
          </div>
        </div>

        {/* Refresh button */}
        <div className="flex justify-center">
          <button
            onClick={generateAIReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>Wygeneruj ponownie analizę AI</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to={location.pathname.startsWith('/paleta') ? '/paleta/analysis' : '/analysis'}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Powrót do listy analiz</span>
        </Link>
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                   <h1 className="text-2xl font-bold text-gray-900">
                     Szczegóły analizy - {analysis.name}
                   </h1>
                 </div>
               </div>
      </div>

      {/* Combined Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Podsumowanie analizy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-green-800">
              {avgProfitability.toFixed(1)}%
            </h4>
            <p className="text-green-600 text-sm">Średnia rentowność</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-blue-800">
              {productsWithStatus.length}
            </h4>
            <p className="text-blue-600 text-sm">Liczba produktów</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Package className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-purple-800">
              {productsWithStatus.reduce((sum, product) => sum + product.pcs, 0)}
            </h4>
            <p className="text-purple-600 text-sm">Łączna liczba sztuk</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-orange-800">
              {issuesCount}
            </h4>
            <p className="text-orange-600 text-sm">Wykryte problemy</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-green-800">
              {(totalRevenue / 1000).toFixed(0)}k PLN
            </h4>
            <p className="text-green-600 text-sm">Całkowity przychód</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-red-800">
              {(totalCost / 1000).toFixed(0)}k PLN
            </h4>
            <p className="text-red-600 text-sm">Całkowity koszt</p>
          </div>
        </div>
      </div>

      {/* Analiza AI */}
      {renderProfitabilityTab()}

      {/* Wszystkie produkty */}
      {renderContentTab()}

      {/* File Info - moved to bottom */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileSpreadsheet className="h-12 w-12 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {analysis.name}
              </h2>
              {analysis.description && (
                <p className="text-gray-600">{analysis.description}</p>
              )}
              <p className="text-gray-500 text-sm">
                Utworzona: {new Date(analysis.createdAt).toLocaleString('pl-PL', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-600 font-medium">
              {analysis.status === 'completed' ? 'Analiza zakończona' : 'W toku'}
            </span>
          </div>
        </div>
      </div>


      {/* Rules Manager Modal */}
      {showRulesManager && (
        <RulesManager
          onClose={() => setShowRulesManager(false)}
          onAddCategoryRule={handleAddCategoryToRules}
          onAddProductRule={(product: any, action: 'block' | 'warning') => handleAddToRules(product, action)}
          onRemoveRule={handleRemoveRule}
        />
      )}

    </div>
  )
}

 export default AnalysisDetailPage

