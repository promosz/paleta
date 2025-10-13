import React, { useState, useEffect } from 'react'
import { ArrowLeft, Package, Tag, DollarSign, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Link, useParams, useLocation } from 'react-router-dom'
import ProductImage from '../components/ProductImage'
import { imageService, ImageSearchResult } from '../services/imageService'

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
  marza: number
  rentownosc: number
  status?: 'warning' | 'allowed' | 'blocked'
  appliedRule?: string
}

interface AnalysisResult {
  id: string
  fileName: string
  uploadDate: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  profitability: number
  productCount: number
  issues: number
  products: Product[]
}

const ProductDetailPage: React.FC = () => {
  const { analysisId, productIndex } = useParams<{ analysisId: string; productIndex: string }>()
  const location = useLocation()
  const [product, setProduct] = useState<Product | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null)
  const [additionalImages, setAdditionalImages] = useState<ImageSearchResult[]>([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  useEffect(() => {
    console.log('📄 ProductDetailPage loaded:', { analysisId, productIndex })
    if (analysisId && productIndex !== undefined) {
      loadProductDetails()
    }
  }, [analysisId, productIndex])

  const loadProductDetails = () => {
    if (!analysisId || productIndex === undefined) return

    try {
      // Pobierz dane analizy z localStorage
      const savedAnalyses = localStorage.getItem('analysis-results')
      if (savedAnalyses) {
        const analyses: AnalysisResult[] = JSON.parse(savedAnalyses)
        const analysis = analyses.find(a => a.id === analysisId)
        
        if (analysis && analysis.products[parseInt(productIndex)]) {
          setAnalysisData(analysis)
          setProduct(analysis.products[parseInt(productIndex)])
          
          // Załaduj dodatkowe zdjęcia produktu
          if (analysis.products[parseInt(productIndex)].nazwa) {
            loadAdditionalImages(analysis.products[parseInt(productIndex)].nazwa)
          }
        }
      }
    } catch (error) {
      console.error('Błąd ładowania szczegółów produktu:', error)
    }
  }

  const loadAdditionalImages = async (productName: string) => {
    setIsLoadingImages(true)
    try {
      const images = await imageService.searchProductImages(productName)
      setAdditionalImages(images)
    } catch (error) {
      console.error('Błąd ładowania dodatkowych zdjęć:', error)
      setAdditionalImages([])
    } finally {
      setIsLoadingImages(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'blocked': return 'text-red-600 bg-red-100'
      case 'allowed': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'blocked': return <AlertTriangle className="h-4 w-4" />
      case 'allowed': return <CheckCircle className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getProfitabilityColor = (profitability: number) => {
    if (profitability >= 70) return 'text-green-600'
    if (profitability >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!product || !analysisData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ładowanie szczegółów produktu...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to={location.pathname.startsWith('/paleta') ? `/paleta/analysis/${analysisId}` : `/analysis/${analysisId}`}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Powrót do analizy</span>
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Szczegóły produktu</h1>
              <p className="text-sm text-gray-600">Z analizy: {analysisData.fileName}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getStatusColor(product.status || 'allowed')}`}>
            {getStatusIcon(product.status || 'allowed')}
            <span className="text-sm font-medium">
              {product.status === 'warning' ? 'Ostrzeżenie' : 
               product.status === 'blocked' ? 'Zablokowany' : 'Dozwolony'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Product Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Product Image & Basic Info */}
          <div className="card">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <ProductImage 
                  foto={product.foto} 
                  nazwa={product.nazwa} 
                  className="w-48 h-48 mx-auto" 
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {product.nazwa}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Tag className="h-4 w-4" />
                    <span>{product.kategoria}</span>
                  </div>
                </div>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Cena sprzedaży</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {product.cenaRegularnaBrutto.toLocaleString('pl-PL')} zł
                    </div>
                    <div className="text-xs text-blue-600">
                      netto: {product.cenaSprzedazyNetto.toLocaleString('pl-PL')} zł
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Marża</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {product.marza.toLocaleString('pl-PL')} zł
                    </div>
                    <div className={`text-xs font-medium ${getProfitabilityColor(product.rentownosc)}`}>
                      {product.rentownosc.toFixed(1)}% rentowność
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          {additionalImages.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
                Dodatkowe zdjęcia produktu
              </h3>
              {isLoadingImages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {additionalImages.slice(0, 8).map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`${product.nazwa} - zdjęcie ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.open(image.url, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <ExternalLink className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Technical Details */}
        <div className="space-y-6">
          
          {/* Technical Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacje techniczne</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">EAN</span>
                <span className="text-sm font-medium">{product.ean}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Kod 1</span>
                <span className="text-sm font-medium">{product.kod1}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Kod 2</span>
                <span className="text-sm font-medium">{product.kod2}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Pack ID</span>
                <span className="text-sm font-medium">{product.packId}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">FC SKU</span>
                <span className="text-sm font-medium">{product.fcSku}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Sztuk</span>
                <span className="text-sm font-medium">{product.pcs}</span>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Szczegóły finansowe</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Cena brutto</span>
                <span className="text-sm font-medium">{product.cenaRegularnaBrutto.toLocaleString('pl-PL')} {product.waluta}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Cena netto</span>
                <span className="text-sm font-medium">{product.cenaSprzedazyNetto.toLocaleString('pl-PL')} {product.walutaSprzedazy}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Wartość sprzedaży</span>
                <span className="text-sm font-medium">{product.wartoscSprzedazyNetto.toLocaleString('pl-PL')} {product.walutaSprzedazy}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Marża</span>
                <span className="text-sm font-medium text-green-600">{product.marza.toLocaleString('pl-PL')} zł</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Rentowność</span>
                <span className={`text-sm font-medium ${getProfitabilityColor(product.rentownosc)}`}>
                  {product.rentownosc.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Analysis Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacje o analizie</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Plik źródłowy</span>
                <span className="text-sm font-medium">{analysisData.fileName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Data uploadu</span>
                <span className="text-sm font-medium">{analysisData.uploadDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status analizy</span>
                <span className="text-sm font-medium capitalize">{analysisData.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Pozycja w pliku</span>
                <span className="text-sm font-medium">#{parseInt(productIndex || '0') + 1}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {product.link && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Linki</h3>
              <div className="space-y-2">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">Zobacz w sklepie</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
