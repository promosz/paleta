import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, FileSpreadsheet, TrendingUp, Package, AlertTriangle, CheckCircle, Table, BarChart3, DollarSign, Brain, Loader, ExternalLink } from 'lucide-react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import MarketPrices from '../components/MarketPrices'
import ProductFilter from '../components/ProductFilter'
import ProductActions from '../components/ProductActions'
import RulesManager from '../components/RulesManager'
import { hybridAIService } from '../services/hybridAIService'

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

interface AnalysisResult {
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

const AnalysisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'content' | 'profitability'>('content')
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [showMarketPrices, setShowMarketPrices] = useState(false)
  const [showRulesManager, setShowRulesManager] = useState(false)
  const [productsWithStatus, setProductsWithStatus] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [rules, setRules] = useState<any[]>([])
  const [aiReport, setAiReport] = useState<{
    summary: string
    productAnalysis: string
    recommendations: string
    buyDecision: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'CAUTION' | 'AVOID'
    confidenceScore: number
  } | null>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)

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

  const analyzeProductsWithRules = useCallback(() => {
    if (!analysisData) return

    const updatedProducts = analysisData.products.map(product => {
      let status: 'warning' | 'allowed' = 'allowed'
      let appliedRule: string | undefined = undefined

      // Check product rules first (higher priority) - only warning rules
      const productRule = rules.find(rule => 
        rule.type === 'product' && 
        rule.name.toLowerCase() === product.nazwa.toLowerCase() &&
        rule.action === 'warning'
      )
      
      if (productRule) {
        status = 'warning'
        appliedRule = 'Produkt'
      } else {
        // Check category rules if no product rule found - only warning rules
        const categoryRule = rules.find(rule => 
          rule.type === 'category' && 
          rule.name.toLowerCase() === product.kategoria.toLowerCase() &&
          rule.action === 'warning'
        )
        
        if (categoryRule) {
          status = 'warning'
          appliedRule = 'Kategoria'
        }
      }

      const result = { ...product, status, appliedRule }
      if (status !== 'allowed') {
        console.log(`Product ${product.nazwa} - Status: ${status}, Rule: ${appliedRule}`)
      }
      return result
    })
    
    // Store products with status
    setProductsWithStatus(updatedProducts)
  }, [analysisData, rules])

  useEffect(() => {
    loadRules()
  }, [])

  // Update products with status when analysis data or rules change
  useEffect(() => {
    analyzeProductsWithRules()
  }, [analyzeProductsWithRules])

  // Generate AI report when analysis data is available
  useEffect(() => {
    if (analysisData && analysisData.products.length > 0 && !aiReport) {
      generateAIReport()
    }
  }, [analysisData])

  const generateAIReport = async () => {
    if (!analysisData || analysisData.products.length === 0) return
    
    setIsLoadingReport(true)
    try {
      const report = await hybridAIService.generatePaletteReport(analysisData.products)
      setAiReport(report)
    } catch (error) {
      console.error('Failed to generate AI report:', error)
      // If AI fails, still show a basic report using mock data
      const report = await hybridAIService.generatePaletteReport(analysisData.products)
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
      description: `Dodano z analizy ${analysisData?.fileName}`,
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
      description: `Dodano z analizy ${analysisData?.fileName}`,
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

  // Pobierz dane analizy z localStorage lub mock data
  React.useEffect(() => {
    if (id) {
      // Spróbuj pobrać z localStorage
      const savedAnalyses = localStorage.getItem('pallet-analyses')
      if (savedAnalyses) {
        const analyses: AnalysisResult[] = JSON.parse(savedAnalyses)
        const foundAnalysis = analyses.find(analysis => analysis.id === id)
        if (foundAnalysis) {
          setAnalysisData(foundAnalysis)
          return
        }
      }
      
      // Fallback do mock data jeśli nie znaleziono w localStorage
      const mockData: AnalysisResult = {
    id: id || '1',
    fileName: 'Przykładowy_plik_do_analizy.xlsx',
    uploadDate: '2024-01-15',
    status: 'completed',
    profitability: 78.5,
    productCount: 15,
    issues: 2,
    products: [
      { 
        paleta: 'F20351', 
        nazwa: 'Electric Car Charger [11kW, Three Phase, 7m, 6-16A] with Schuko dé Type 2 Adapter CEE Socket EV Charger Mobile / Wallbox Charging Station with Digital Display', 
        foto: 'https://example.com/charger.jpg', 
        ean: '6975828000119', 
        kod1: 'LPNHE979260590', 
        kod2: 'B0C4TPG8P8', 
        packId: '1Z7E45296840145543', 
        kategoria: 'AUTOMOTIVE', 
        pcs: 1, 
        cenaRegularnaBrutto: 1073.6, 
        waluta: 'PLN', 
        cenaSprzedazyNetto: 193.25, 
        walutaSprzedazy: 'PLN', 
        link: '', 
        fcSku: 'X001TNT5NN', 
        wartoscSprzedazyNetto: 193.25, 
        marza: 880.35, 
        rentownosc: 82.0 
      },
      { 
        paleta: 'F20351', 
        nazwa: 'dé Typ 2 Verlängerungskabel [15m, 22kW, 32A] 3-Phasen Ladekabel 400V, Schutzart IP54, kompatibel mit Allen IEC62196-2 BEV und HPEV, mit Tragetasche', 
        foto: 'https://example.com/cable.jpg', 
        ean: '6975828001802', 
        kod1: 'LPNHE997930890', 
        kod2: 'B0DLNN9TFH', 
        packId: '1Z7E45296840145543', 
        kategoria: 'AUTOMOTIVE', 
        pcs: 1, 
        cenaRegularnaBrutto: 1002, 
        waluta: 'PLN', 
        cenaSprzedazyNetto: 180.36, 
        walutaSprzedazy: 'PLN', 
        link: '', 
        fcSku: 'X002DJWW5P', 
        wartoscSprzedazyNetto: 180.36, 
        marza: 821.64, 
        rentownosc: 82.0 
      },
      { 
        paleta: 'F20351', 
        nazwa: 'FreeTec 21-Piece Pneumatic Injector Puller, Diesel Injector Extractor for Diesel Engines, Diesel Injectors Puller Set (21 Pieces)', 
        foto: 'https://example.com/puller.jpg', 
        ean: '', 
        kod1: 'LPNHE829891552', 
        kod2: 'B0D7PS5V3H', 
        packId: '1ZV8K9116840037616', 
        kategoria: 'AUTOMOTIVE', 
        pcs: 1, 
        cenaRegularnaBrutto: 465.12, 
        waluta: 'PLN', 
        cenaSprzedazyNetto: 83.72, 
        walutaSprzedazy: 'PLN', 
        link: '', 
        fcSku: 'X002CFMZCF', 
        wartoscSprzedazyNetto: 83.72, 
        marza: 381.4, 
        rentownosc: 82.0 
      }
    ],
    summary: {
      totalRevenue: 0,
      totalCost: 0,
      averageProfitability: 0,
      lowProfitability: [],
      mediumProfitability: [],
      highProfitability: []
    }
      }
      setAnalysisData(mockData)
    }
  }, [id])

  // Jeśli nie ma danych, pokaż loading
  if (!analysisData) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie szczegółów analizy...</p>
        </div>
      </div>
    )
  }

  // Oblicz podsumowanie
  const totalRevenue = analysisData.products.reduce((sum, p) => sum + p.cenaRegularnaBrutto, 0)
  const totalCost = analysisData.products.reduce((sum, p) => sum + p.cenaSprzedazyNetto, 0)

  const tabs = [
    { id: 'content', label: 'Zawartość pliku', icon: Table },
    { id: 'profitability', label: 'Analiza rentowności', icon: BarChart3 },
  ]

  const renderContentTab = () => {
    // Use productsWithStatus if available, otherwise use analysisData.products
    const displayProducts = productsWithStatus.length > 0 ? productsWithStatus : analysisData?.products || []
    
    return (
      <div className="space-y-6">
        {/* Product Filter */}
        {displayProducts.length > 0 && (
          <ProductFilter
            products={displayProducts}
            onFilteredProducts={setFilteredProducts}
            onCategorySelect={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Wszystkie produkty z pliku ({filteredProducts.length})
          </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zdjęcie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa produktu / Kategoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cena (brutto/netto PLN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marża (PLN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcje
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
                      <div onClick={(e) => e.stopPropagation()}>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="font-medium">{product.cenaRegularnaBrutto.toLocaleString('pl-PL')} zł</div>
                        <div className="text-xs text-gray-400">{product.cenaSprzedazyNetto.toLocaleString('pl-PL')} zł</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.marza.toLocaleString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {productStatus === 'warning' && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs text-yellow-600 font-medium">
                            {product.appliedRule || 'Ostrzeżenie'}
                          </span>
                        </div>
                      )}
                      {productStatus === 'allowed' && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">Dozwolony</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div onClick={(e) => e.stopPropagation()}>
                        <ProductActions
                          product={product}
                          onAddToRules={handleAddToRules}
                          onAddCategoryToRules={handleAddCategoryToRules}
                          onRemoveRule={handleRemoveRule}
                          existingRules={rules}
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
          to={location.pathname.startsWith('/paleta') ? '/paleta/dashboard' : '/dashboard'}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Powrót do listy</span>
        </Link>
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                   <h1 className="text-2xl font-bold text-gray-900">
                     Szczegóły analizy - {analysisData.fileName}
                   </h1>
                 </div>
                 
                 {/* Market Prices Button */}
                 <button
                   onClick={() => setShowMarketPrices(true)}
                   className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                 >
                   <DollarSign className="h-4 w-4" />
                   <span>Market Prices</span>
                 </button>
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
              {analysisData.profitability}%
            </h4>
            <p className="text-green-600 text-sm">Średnia rentowność</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-blue-800">
              {analysisData.productCount}
            </h4>
            <p className="text-blue-600 text-sm">Liczba produktów</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Package className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-purple-800">
              {analysisData.products.reduce((sum, product) => sum + product.pcs, 0)}
            </h4>
            <p className="text-purple-600 text-sm">Łączna liczba sztuk</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-orange-800">
              {analysisData.issues}
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

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'content' | 'profitability')}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'content' && renderContentTab()}
          {activeTab === 'profitability' && renderProfitabilityTab()}
        </div>
      </div>

      {/* File Info - moved to bottom */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileSpreadsheet className="h-12 w-12 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {analysisData.fileName}
              </h2>
              <p className="text-gray-600">
                Przesłano: {new Date(analysisData.uploadDate).toLocaleString('pl-PL', {
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
            <span className="text-green-600 font-medium">Analiza zakończona</span>
          </div>
        </div>
      </div>

      {/* Market Prices Modal */}
      {showMarketPrices && (
        <MarketPrices
          products={analysisData.products.map(p => p.nazwa)}
          onClose={() => setShowMarketPrices(false)}
        />
      )}

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

