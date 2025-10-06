import React, { useState } from 'react'
import { ArrowLeft, FileSpreadsheet, TrendingUp, Package, AlertTriangle, CheckCircle, Table, BarChart3, DollarSign } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import MarketPrices from '../components/MarketPrices'

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
  const [activeTab, setActiveTab] = useState<'content' | 'profitability'>('content')
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [showMarketPrices, setShowMarketPrices] = useState(false)

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
  const averageProfitability = analysisData.products.reduce((sum, p) => sum + p.rentownosc, 0) / analysisData.products.length

  // Podziel produkty na kategorie rentowności
  const lowProfitability = analysisData.products.filter(p => p.rentownosc < 60)
  const mediumProfitability = analysisData.products.filter(p => p.rentownosc >= 60 && p.rentownosc < 80)
  const highProfitability = analysisData.products.filter(p => p.rentownosc >= 80)

  const tabs = [
    { id: 'content', label: 'Zawartość pliku', icon: Table },
    { id: 'profitability', label: 'Analiza rentowności', icon: BarChart3 },
  ]

  const renderContentTab = () => (
    <div className="space-y-6">

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Wszystkie produkty z pliku
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zdjęcie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nazwa produktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paleta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cena brutto (PLN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cena netto (PLN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marża (PLN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rentowność (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategoria
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analysisData.products.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ProductImage 
                      foto={product.foto} 
                      nazwa={product.nazwa} 
                      className="w-16 h-16" 
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    <div className="truncate" title={product.nazwa}>
                      {product.nazwa}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.paleta}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.ean || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.cenaRegularnaBrutto.toLocaleString('pl-PL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.cenaSprzedazyNetto.toLocaleString('pl-PL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.marza.toLocaleString('pl-PL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`font-medium ${
                      product.rentownosc >= 80 ? 'text-green-600' : 
                      product.rentownosc >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.rentownosc.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.kategoria}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderProfitabilityTab = () => (
    <div className="space-y-6">
      {/* Podsumowanie kategorii */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-900">Niska rentowność</h3>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-2">
            {lowProfitability.length}
          </div>
          <p className="text-gray-600">produktów (&lt; 60%)</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-900">Średnia rentowność</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {mediumProfitability.length}
          </div>
          <p className="text-gray-600">produktów (60-80%)</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-gray-900">Wysoka rentowność</h3>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">
            {highProfitability.length}
          </div>
          <p className="text-gray-600">produktów (&gt; 80%)</p>
        </div>
      </div>

      {/* Produkty o niskiej rentowności */}
      {lowProfitability.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Produkty o niskiej rentowności ({lowProfitability.length})
          </h3>
          <div className="space-y-3">
            {lowProfitability.map((product, index) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.nazwa}</h4>
                    <p className="text-sm text-gray-600">Kategoria: {product.kategoria}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">{product.rentownosc.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">
                      {product.cenaRegularnaBrutto.toLocaleString('pl-PL')} PLN
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produkty o średniej rentowności */}
      {mediumProfitability.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Produkty o średniej rentowności ({mediumProfitability.length})
          </h3>
          <div className="space-y-3">
            {mediumProfitability.map((product, index) => (
              <div key={index} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.nazwa}</h4>
                    <p className="text-sm text-gray-600">Kategoria: {product.kategoria}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600">{product.rentownosc.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">
                      {product.cenaRegularnaBrutto.toLocaleString('pl-PL')} PLN
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produkty o wysokiej rentowności */}
      {highProfitability.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Produkty o wysokiej rentowności ({highProfitability.length})
          </h3>
          <div className="space-y-3">
            {highProfitability.map((product, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{product.nazwa}</h4>
                    <p className="text-sm text-gray-600">Kategoria: {product.kategoria}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{product.rentownosc.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">
                      {product.cenaRegularnaBrutto.toLocaleString('pl-PL')} PLN
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/"
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
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-blue-800">
              {averageProfitability.toFixed(1)}%
            </h4>
            <p className="text-blue-600 text-sm">Średnia rentowność</p>
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
    </div>
  )
}

 export default AnalysisDetailPage

