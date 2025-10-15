import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileSpreadsheet } from 'lucide-react'
import type { Analysis } from '../types/analysis'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { supabase } from '../lib/supabase'

interface AnalysisListProps {
  analyses: Analysis[]
}

interface AnalysisStatsExtended {
  avgProfitability: number
  totalQuantity: number
  totalRevenue: number
  issuesCount: number
}

const AnalysisList: React.FC<AnalysisListProps> = ({ analyses }) => {
  const location = useLocation()
  const { supabaseUserId } = useCurrentUser()
  const [statsMap, setStatsMap] = useState<Map<string, AnalysisStatsExtended>>(new Map())

  // Pobierz rozszerzone statystyki dla każdej analizy
  useEffect(() => {
    const fetchStats = async () => {
      if (!supabaseUserId || analyses.length === 0) return

      const newStatsMap = new Map<string, AnalysisStatsExtended>()
      
      // Pobierz reguły z localStorage (tak jak w AnalysisDetailPage)
      let rules: any[] = []
      try {
        const savedRules = localStorage.getItem('analysis-rules')
        if (savedRules) {
          rules = JSON.parse(savedRules)
        }
      } catch (error) {
        console.error('Failed to load rules:', error)
      }

      for (const analysis of analyses) {
        try {
          // Pobierz produkty dla analizy i oblicz statystyki
          const { data: products } = await supabase
            .from('products')
            .select('name, category, quantity, price_gross, price_net, status, evaluation_data')
            .eq('analysis_id', analysis.id)
            .eq('user_id', supabaseUserId)

          if (products && products.length > 0) {
            
            // Mapuj produkty i zastosuj reguły (tak jak w AnalysisDetailPage)
            const mappedProducts = products.map(p => {
              const priceGross = p.price_gross || 0
              const priceNet = p.price_net || 0
              const quantity = p.quantity || 1
              
              // Zastosuj reguły do określenia statusu (tak jak w AnalysisDetailPage)
              let status: 'warning' | 'allowed' = 'allowed'
              
              // Sprawdź reguły produktu
              const productRule = rules.find(rule => 
                rule.type === 'product' && 
                rule.name.toLowerCase() === (p.name || '').toLowerCase() &&
                rule.action === 'warning'
              )
              
              if (productRule) {
                status = 'warning'
              } else {
                // Sprawdź reguły kategorii
                const categoryRule = rules.find(rule => 
                  rule.type === 'category' && 
                  rule.name.toLowerCase() === (p.category || '').toLowerCase() &&
                  rule.action === 'warning'
                )
                
                if (categoryRule) {
                  status = 'warning'
                }
              }
              
              return {
                pcs: quantity,
                cenaRegularnaBrutto: priceGross,
                cenaSprzedazyNetto: priceNet,
                marza: priceGross - priceNet,
                rentownosc: priceGross ? (((priceGross - priceNet) / priceGross) * 100) : 0,
                status: status
              }
            })
            
            // Oblicz statystyki używając zmapowanych danych
            const totalQuantity = mappedProducts.reduce((sum, p) => sum + p.pcs, 0)
            const totalRevenue = mappedProducts.reduce((sum, p) => sum + (p.cenaRegularnaBrutto * p.pcs), 0)
            
            // Oblicz średnią rentowność
            const avgProfitability = mappedProducts.length > 0 
              ? mappedProducts.reduce((sum, p) => sum + p.rentownosc, 0) / mappedProducts.length 
              : 0
            
            // Oblicz problemy - tak samo jak w AnalysisDetailPage (tylko warning)
            const issuesCount = mappedProducts.filter(p => p.status === 'warning').length

            newStatsMap.set(analysis.id, {
              avgProfitability,
              totalQuantity,
              totalRevenue,
              issuesCount
            })
          }
        } catch (error) {
          console.error(`Failed to fetch stats for analysis ${analysis.id}:`, error)
        }
      }

      setStatsMap(newStatsMap)
    }

    fetchStats()
  }, [analyses, supabaseUserId])

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Brak analiz
        </h3>
        <p className="text-gray-500">
          Prześlij pierwszy dokument, aby rozpocząć analizę
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => {
        // Pobierz statystyki z mapy (jeśli dostępne) lub użyj domyślnych
        const stats = statsMap.get(analysis.id)
        
        const totalProducts = analysis.totalProducts || 0
        const avgProfitability = stats?.avgProfitability || analysis.stats?.avgProfitability || 0
        const totalQuantity = stats?.totalQuantity || analysis.stats?.totalQuantity || 0
        const issuesCount = stats?.issuesCount || 
          (analysis.stats?.warningProducts || 0) + (analysis.stats?.blockedProducts || 0)
        const totalRevenue = stats?.totalRevenue || analysis.stats?.totalRevenue || 0
        
        const linkTo = location.pathname.startsWith('/paleta') ? `/paleta/analysis/${analysis.id}` : `/analysis/${analysis.id}`
        
        return (
          <Link
            key={analysis.id}
            to={linkTo}
            className="block card hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between">
              {/* Lewa strona - nazwa i data */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{analysis.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(analysis.createdAt).toLocaleString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {/* Prawa strona - dane z podsumowania */}
              <div className="flex items-center space-x-3">
                {/* Rentowność */}
                <div 
                  className="flex flex-col items-center px-3 py-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200/50"
                  title={`Rentowność: ${avgProfitability.toFixed(1)}%`}
                >
                  <span className="text-sm font-bold text-purple-700">{avgProfitability.toFixed(1)}%</span>
                  <span className="text-xs text-purple-600">Rentowność</span>
                </div>

                {/* Liczba produktów / Łączna liczba sztuk */}
                <div 
                  className="flex flex-col items-center px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50"
                  title={`${totalProducts} produktów / ${totalQuantity} sztuk`}
                >
                  <span className="text-sm font-bold text-blue-700">{totalProducts} / {totalQuantity}</span>
                  <span className="text-xs text-blue-600">Produkty / Sztuki</span>
                </div>

                {/* Wykryte problemy */}
                <div 
                  className="flex flex-col items-center px-3 py-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200/50"
                  title={`Wykryte problemy: ${issuesCount}`}
                >
                  <span className="text-sm font-bold text-yellow-700">{issuesCount}</span>
                  <span className="text-xs text-yellow-600">Problemy</span>
                </div>

                {/* Całkowity przychód */}
                <div 
                  className="flex flex-col items-center px-3 py-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200/50"
                  title={`Całkowity przychód: ${totalRevenue.toLocaleString('pl-PL', { minimumFractionDigits: 2 })} PLN`}
                >
                  <span className="text-sm font-bold text-green-700">{(totalRevenue / 1000).toFixed(1)}k</span>
                  <span className="text-xs text-green-600">Przychód</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default AnalysisList
