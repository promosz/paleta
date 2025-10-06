import React, { useState } from 'react'
import type { Rule, RuleType, RuleAction } from '../../types/rules'
import { useRulesStore } from '../../stores/rulesStore'
import { Button, Card, CardBody, StatusBadge } from '../ui'

interface RulesListProps {
  rules: Rule[]
  onEdit?: (rule: Rule) => void
  onDelete?: (rule: Rule) => void
  className?: string
}

export const RulesList: React.FC<RulesListProps> = ({
  rules,
  onEdit,
  onDelete,
  className = ''
}) => {
  const { toggleRuleStatus, duplicateRule } = useRulesStore()
  const [filterType, setFilterType] = useState<RuleType | 'all'>('all')
  const [filterAction, setFilterAction] = useState<RuleAction | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // Filtrowanie reguł
  const filteredRules = rules.filter(rule => {
    if (filterType !== 'all' && rule.type !== filterType) return false
    if (filterAction !== 'all' && rule.action !== filterAction) return false
    if (filterStatus !== 'all' && rule.status !== filterStatus) return false
    return true
  })

  // Renderowanie ikony typu reguły
  const getTypeIcon = (type: RuleType) => {
    switch (type) {
      case 'budget':
        return '💰'
      case 'category':
        return '🏷️'
      case 'quality':
        return '⭐'
      default:
        return '📋'
    }
  }

  // Renderowanie koloru akcji
  const getActionColor = (action: RuleAction) => {
    switch (action) {
      case 'block':
        return 'danger'
      case 'warn':
        return 'warning'
      case 'prefer':
        return 'success'
      default:
        return 'info'
    }
  }

  // Renderowanie nazwy akcji
  const getActionName = (action: RuleAction) => {
    switch (action) {
      case 'block':
        return 'Blokada'
      case 'warn':
        return 'Ostrzeżenie'
      case 'prefer':
        return 'Preferencja'
      default:
        return 'Nieznana'
    }
  }

  // Renderowanie warunków reguły
  const renderConditions = (rule: Rule) => {
    const conditions = rule.conditions as any
    
    switch (rule.type) {
      case 'budget':
        return (
          <div className="text-sm text-neutral-600">
            {conditions.maxPrice && (
              <div>Max cena: {conditions.maxPrice} PLN</div>
            )}
            {conditions.maxPricePerUnit && (
              <div>Max cena/szt: {conditions.maxPricePerUnit} PLN</div>
            )}
            {conditions.maxTotalBudget && (
              <div>Max budżet: {conditions.maxTotalBudget} PLN</div>
            )}
          </div>
        )

      case 'category':
        return (
          <div className="text-sm text-neutral-600">
            {conditions.blacklist && conditions.blacklist.length > 0 && (
              <div>Zakazane: {conditions.blacklist.join(', ')}</div>
            )}
            {conditions.whitelist && conditions.whitelist.length > 0 && (
              <div>Preferowane: {conditions.whitelist.join(', ')}</div>
            )}
            {conditions.warningList && conditions.warningList.length > 0 && (
              <div>Ostrzeżenia: {conditions.warningList.join(', ')}</div>
            )}
          </div>
        )

      case 'quality':
        return (
          <div className="text-sm text-neutral-600">
            {conditions.minRating && (
              <div>Min ocena: {conditions.minRating}</div>
            )}
            {conditions.minReviews && (
              <div>Min opinie: {conditions.minReviews}</div>
            )}
            {conditions.requiredCertifications && conditions.requiredCertifications.length > 0 && (
              <div>Certyfikaty: {conditions.requiredCertifications.join(', ')}</div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (rules.length === 0) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Brak reguł
            </h3>
            <p className="text-neutral-500">
              Dodaj reguły aby automatycznie analizować produkty
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Filtry */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Typ reguły
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as RuleType | 'all')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Wszystkie typy</option>
                <option value="budget">💰 Budżetowe</option>
                <option value="category">🏷️ Kategorii</option>
                <option value="quality">⭐ Jakościowe</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Akcja
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value as RuleAction | 'all')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Wszystkie akcje</option>
                <option value="block">❌ Blokada</option>
                <option value="warn">⚠️ Ostrzeżenie</option>
                <option value="prefer">✅ Preferencja</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Wszystkie statusy</option>
                <option value="active">Aktywne</option>
                <option value="inactive">Nieaktywne</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Lista reguł */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(rule.type)}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800">
                        {rule.name}
                      </h3>
                      {rule.description && (
                        <p className="text-sm text-neutral-600">
                          {rule.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <StatusBadge status={rule.status === 'active' ? 'success' : 'info'}>
                      {rule.status === 'active' ? 'Aktywna' : 'Nieaktywna'}
                    </StatusBadge>
                    <StatusBadge status={getActionColor(rule.action)}>
                      {getActionName(rule.action)}
                    </StatusBadge>
                    <span className="text-sm text-neutral-500">
                      Waga: {rule.weight}/10
                    </span>
                  </div>

                  {renderConditions(rule)}

                  <div className="text-xs text-neutral-400 mt-2">
                    Utworzona: {new Date(rule.createdAt).toLocaleString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {rule.updatedAt !== rule.createdAt && (
                      <span className="ml-2">
                        • Zaktualizowana: {new Date(rule.updatedAt).toLocaleString('pl-PL', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleRuleStatus(rule.id)}
                  >
                    {rule.status === 'active' ? 'Dezaktywuj' : 'Aktywuj'}
                  </Button>
                  
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(rule)}
                    >
                      Edytuj
                    </Button>
                  )}
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => duplicateRule(rule.id)}
                  >
                    Duplikuj
                  </Button>
                  
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(rule)}
                    >
                      Usuń
                    </Button>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Brak reguł spełniających kryteria
              </h3>
              <p className="text-neutral-500">
                Zmień filtry aby zobaczyć więcej reguł
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
