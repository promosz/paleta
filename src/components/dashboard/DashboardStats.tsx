import React from 'react'
import type { DashboardStats as DashboardStatsType } from '../../types/analysis'
import { Card, CardHeader, CardBody } from '../ui'

interface DashboardStatsProps {
  stats: DashboardStatsType
  className?: string
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  className = ''
}) => {
  // Formatowanie liczby z trendem
  const formatWithTrend = (current: number, previous: number) => {
    const trend = previous > 0 ? ((current - previous) / previous) * 100 : 0
    const trendIcon = trend > 0 ? '↗️' : trend < 0 ? '↘️' : '➡️'
    const trendColor = trend > 0 ? 'text-success-500' : trend < 0 ? 'text-danger-500' : 'text-neutral-500'
    
    return (
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold">{current}</span>
        <span className={`text-sm ${trendColor}`}>
          {trendIcon} {Math.abs(trend).toFixed(1)}%
        </span>
      </div>
    )
  }

  // Formatowanie czasu
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}min`
  }

  return (
    <div className={className}>
      {/* Główne statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">{stats.totalAnalyses}</div>
              <div className="text-sm text-neutral-600">Wszystkich analiz</div>
              <div className="text-xs text-neutral-500 mt-1">
                {stats.analysesTrend.last7Days} w ostatnich 7 dniach
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-success-500 mb-2">{stats.completedAnalyses}</div>
              <div className="text-sm text-neutral-600">Zakończonych</div>
              <div className="text-xs text-neutral-500 mt-1">
                {stats.totalAnalyses > 0 ? Math.round((stats.completedAnalyses / stats.totalAnalyses) * 100) : 0}% sukcesu
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning-500 mb-2">{stats.pendingAnalyses}</div>
              <div className="text-sm text-neutral-600">Oczekujących</div>
              <div className="text-xs text-neutral-500 mt-1">
                {stats.failedAnalyses} nieudanych
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="text-center">
              <div className="text-3xl font-bold text-info-500 mb-2">{stats.totalProducts}</div>
              <div className="text-sm text-neutral-600">Produktów</div>
              <div className="text-xs text-neutral-500 mt-1">
                Średnio {Math.round(stats.averageProductsPerAnalysis)} na analizę
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Statystyki wydajności */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Wydajność systemu
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Średni czas przetwarzania:</span>
                <span className="font-semibold">{formatTime(stats.averageProcessingTime)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Aktywne reguły:</span>
                <span className="font-semibold">{stats.activeRules}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Ostatnia analiza:</span>
                <span className="font-semibold">
                  {stats.lastAnalysisAt 
                    ? new Date(stats.lastAnalysisAt).toLocaleDateString('pl-PL')
                    : 'Brak'
                  }
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Trendy analiz
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Ostatnie 7 dni:</span>
                {formatWithTrend(stats.analysesTrend.last7Days, stats.analysesTrend.last30Days / 4)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Ostatnie 30 dni:</span>
                <span className="text-2xl font-bold">{stats.analysesTrend.last30Days}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Wzrost:</span>
                <span className={`text-lg font-semibold ${
                  stats.analysesTrend.growth > 0 ? 'text-success-500' : 
                  stats.analysesTrend.growth < 0 ? 'text-danger-500' : 'text-neutral-500'
                }`}>
                  {stats.analysesTrend.growth > 0 ? '+' : ''}{stats.analysesTrend.growth.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top kategorie */}
      {stats.topCategories.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Najpopularniejsze kategorie
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {stats.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-neutral-400 w-6">#{index + 1}</span>
                    <span className="text-neutral-700">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-neutral-600 w-16 text-right">
                      {category.count} ({category.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Top reguły */}
      {stats.topRules.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-lg font-semibold text-neutral-800">
              Najczęściej naruszane reguły
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {stats.topRules.map((rule, index) => (
                <div key={rule.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-neutral-400 w-6">#{index + 1}</span>
                    <span className="text-neutral-700">{rule.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-warning-500 h-2 rounded-full" 
                        style={{ width: `${rule.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-neutral-600 w-16 text-right">
                      {rule.violations} ({rule.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

    </div>
  )
}
