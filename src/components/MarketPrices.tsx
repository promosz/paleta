import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface PriceData {
  product_name: string
  price: number
  currency: string
  source: string
  url: string
  timestamp: string
  condition: string
  seller_rating?: number
  availability: boolean
}

interface MarketInsight {
  product_name: string
  median_price: number
  average_price: number
  price_range: number
  market_volatility: number
  best_deal_ratio: number
  market_trend: string
  confidence_score: number
  data_quality: string
  recommendations: string[]
  last_updated: string
}

interface MarketPricesProps {
  products: string[]
  onClose: () => void
}

const MarketPrices: React.FC<MarketPricesProps> = ({ products, onClose }) => {
  const [priceData, setPriceData] = useState<Record<string, PriceData[]>>({})
  const [marketInsights, setMarketInsights] = useState<Record<string, MarketInsight>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (products.length > 0) {
      collectMarketPrices()
    }
  }, [products])

  const collectMarketPrices = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Collect prices from AI service
      const response = await fetch('http://localhost:8000/ai/collect-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: products,
          max_results_per_product: 5
        })
      })

      if (!response.ok) {
        throw new Error(`Price collection failed: ${response.statusText}`)
      }

      const result = await response.json()
      setPriceData(result.price_data)

      // Analyze prices for each product
      const insights: Record<string, MarketInsight> = {}
      for (const [productName, prices] of Object.entries(result.price_data)) {
        if (Array.isArray(prices) && prices.length > 0) {
          try {
            const analysisResponse = await fetch('http://localhost:8000/ai/analyze-prices', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                product_name: productName,
                prices: prices
              })
            })

            if (analysisResponse.ok) {
              const analysis = await analysisResponse.json()
              insights[productName] = analysis
            }
          } catch (error) {
            console.error(`Analysis failed for ${productName}:`, error)
          }
        }
      }

      setMarketInsights(insights)
      
      // Select first product by default
      if (Object.keys(insights).length > 0) {
        setSelectedProduct(Object.keys(insights)[0])
      }

    } catch (error) {
      console.error('Error collecting market prices:', error)
      setError('Nie udało się pobrać danych cenowych. Sprawdź połączenie z AI service.')
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'falling':
        return <TrendingDown className="h-4 w-4 text-green-600" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-red-600 bg-red-50'
      case 'falling':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getDataQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600 bg-green-50'
      case 'good':
        return 'text-blue-600 bg-blue-50'
      case 'fair':
        return 'text-yellow-600 bg-yellow-50'
      case 'poor':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatPrice = (price: number, currency: string = 'PLN') => {
    return `${price.toLocaleString('pl-PL')} ${currency}`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pl-PL')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Market Prices Analysis</h2>
              <p className="text-sm text-gray-600">Analiza cen rynkowych produktów</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={collectMarketPrices}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Pobieranie danych cenowych...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={collectMarketPrices}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : Object.keys(marketInsights).length === 0 ? (
            <div className="text-center py-12">
              <Info className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Brak danych cenowych dla wybranych produktów</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Selection */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(marketInsights).map((productName) => (
                  <button
                    key={productName}
                    onClick={() => setSelectedProduct(productName)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedProduct === productName
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {productName}
                  </button>
                ))}
              </div>

              {/* Market Insights */}
              {selectedProduct && marketInsights[selectedProduct] && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Analiza rynkowa: {selectedProduct}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Cena mediana</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(marketInsights[selectedProduct].median_price)}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Średnia cena</p>
                          <p className="text-xl font-bold text-gray-900">
                            {formatPrice(marketInsights[selectedProduct].average_price)}
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Trend rynkowy</p>
                          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(marketInsights[selectedProduct].market_trend)}`}>
                            {getTrendIcon(marketInsights[selectedProduct].market_trend)}
                            <span>{marketInsights[selectedProduct].market_trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Jakość danych</p>
                          <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getDataQualityColor(marketInsights[selectedProduct].data_quality)}`}>
                            <CheckCircle className="h-3 w-3" />
                            <span>{marketInsights[selectedProduct].data_quality}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {marketInsights[selectedProduct].recommendations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Rekomendacje</h4>
                      <div className="space-y-2">
                        {marketInsights[selectedProduct].recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-800">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price List */}
                  {priceData[selectedProduct] && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">
                        Znalezione ceny ({priceData[selectedProduct].length})
                      </h4>
                      <div className="space-y-2">
                        {priceData[selectedProduct]
                          .sort((a, b) => a.price - b.price)
                          .map((price, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center space-x-4">
                              <div className="text-lg font-semibold text-gray-900">
                                {formatPrice(price.price, price.currency)}
                              </div>
                              <div className="text-sm text-gray-600">
                                {price.source} • {price.condition}
                              </div>
                              {price.seller_rating && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-600">
                                    {price.seller_rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(price.timestamp)}
                              </span>
                              <a
                                href={price.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <span className="text-sm">Zobacz</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketPrices



