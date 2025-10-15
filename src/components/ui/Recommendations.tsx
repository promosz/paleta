import React from 'react'
import type { ProductEvaluation, Recommendation } from '../../types/rules'
import { Card, CardHeader, CardBody, StatusBadge } from './index'

interface RecommendationsProps {
  evaluations: ProductEvaluation[]
  className?: string
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  evaluations,
  className = ''
}) => {
  // Generowanie rekomendacji dla wszystkich ocen
  const generateRecommendations = (evaluation: ProductEvaluation): Recommendation[] => {
    const recommendations: Recommendation[] = []

    // Rekomendacje na podstawie statusu
    if (evaluation.status === 'blocked') {
      recommendations.push({
        type: 'action',
        title: 'Produkt zablokowany',
        description: 'Ten produkt nie spełnia wymagań i został zablokowany',
        priority: 'high',
        action: 'Usuń produkt z zestawu'
      })
    } else if (evaluation.status === 'warning') {
      recommendations.push({
        type: 'warning',
        title: 'Produkt z ostrzeżeniem',
        description: 'Ten produkt ma pewne problemy, rozważ alternatywy',
        priority: 'medium',
        action: 'Przejrzyj szczegóły ostrzeżeń'
      })
    } else if (evaluation.score > 80) {
      recommendations.push({
        type: 'action',
        title: 'Produkt rekomendowany',
        description: 'Ten produkt spełnia wszystkie wymagania',
        priority: 'low',
        action: 'Dodaj do zestawu'
      })
    }

    // Rekomendacje na podstawie zastosowanych reguł
    evaluation.appliedRules.forEach(appliedRule => {
      if (appliedRule.action === 'prefer') {
        recommendations.push({
          type: 'info',
          title: 'Preferencja',
          description: appliedRule.reason,
          priority: 'low'
        })
      } else if (appliedRule.action === 'warn') {
        recommendations.push({
          type: 'warning',
          title: 'Ostrzeżenie',
          description: appliedRule.reason,
          priority: 'medium'
        })
      }
    })

    return recommendations
  }

  // Renderowanie ikony typu rekomendacji
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'action':
        return '🎯'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '📋'
    }
  }

  // Renderowanie koloru priorytetu
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'info'
    }
  }

  // Renderowanie nazwy priorytetu
  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Wysoki'
      case 'medium':
        return 'Średni'
      case 'low':
        return 'Niski'
      default:
        return 'Nieznany'
    }
  }

  // Statystyki rekomendacji
  const stats = {
    total: evaluations.length,
    blocked: evaluations.filter(e => e.status === 'blocked').length,
    warnings: evaluations.filter(e => e.status === 'warning').length,
    ok: evaluations.filter(e => e.status === 'ok').length,
    averageScore: evaluations.length > 0 
      ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
      : 0
  }

  if (evaluations.length === 0) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Brak rekomendacji
            </h3>
            <p className="text-neutral-500">
              Załaduj i przeanalizuj produkty aby zobaczyć rekomendacje
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Statystyki */}
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-800">
            Podsumowanie analizy
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-800">{stats.total}</div>
              <div className="text-sm text-neutral-600">Produktów</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-500">{stats.ok}</div>
              <div className="text-sm text-neutral-600">OK</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-500">{stats.warnings}</div>
              <div className="text-sm text-neutral-600">Ostrzeżenia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger-500">{stats.blocked}</div>
              <div className="text-sm text-neutral-600">Zablokowane</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">{stats.averageScore}</div>
              <div className="text-sm text-neutral-600">Średnia ocena</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Lista rekomendacji */}
      <div className="space-y-4">
        {evaluations.map((evaluation) => {
          const recommendations = generateRecommendations(evaluation)
          
          return (
            <Card key={evaluation.productId}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-neutral-800">
                    Produkt #{evaluation.productId.split('-').pop()}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <StatusBadge 
                      status={
                        evaluation.status === 'ok' ? 'success' :
                        evaluation.status === 'warning' ? 'warning' : 'danger'
                      }
                    >
                      {evaluation.status === 'ok' ? 'OK' :
                       evaluation.status === 'warning' ? 'Ostrzeżenie' : 'Zablokowany'}
                    </StatusBadge>
                    <span className="text-sm font-medium text-neutral-600">
                      Ocena: {evaluation.score}/100
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {/* Zastosowane reguły */}
                  {evaluation.appliedRules.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-neutral-700 mb-2">
                        Zastosowane reguły:
                      </h5>
                      <div className="space-y-2">
                        {evaluation.appliedRules.map((rule, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                            <span className="text-neutral-600">{rule.ruleName}</span>
                            <span className="text-neutral-500">({rule.reason})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rekomendacje */}
                  {recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-neutral-700 mb-2">
                        Rekomendacje:
                      </h5>
                      <div className="space-y-2">
                        {recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                            <span className="text-lg">{getRecommendationIcon(recommendation.type)}</span>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h6 className="text-sm font-medium text-neutral-800">
                                  {recommendation.title}
                                </h6>
                                <StatusBadge status={getPriorityColor(recommendation.priority)}>
                                  {getPriorityName(recommendation.priority)}
                                </StatusBadge>
                              </div>
                              <p className="text-sm text-neutral-600 mb-2">
                                {recommendation.description}
                              </p>
                              {recommendation.action && (
                                <div className="text-sm text-primary-600 font-medium">
                                  💡 {recommendation.action}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brak rekomendacji */}
                  {recommendations.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-sm text-neutral-500">
                        Brak rekomendacji dla tego produktu
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
