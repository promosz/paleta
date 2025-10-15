import React, { useState } from 'react'
import type { RuleTemplate, RuleType } from '../../types/rules'
import { useRulesStore } from '../../stores/rulesStoreSupabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { Button, Card, CardHeader, CardBody, StatusBadge } from '../ui'

interface RuleTemplatesProps {
  templates: RuleTemplate[]
  onSelectTemplate?: (template: RuleTemplate) => void
  className?: string
}

export const RuleTemplates: React.FC<RuleTemplatesProps> = ({
  templates,
  onSelectTemplate,
  className = ''
}) => {
  const { supabaseUserId } = useCurrentUser()
  const { createRuleFromTemplate } = useRulesStore()
  const [selectedType, setSelectedType] = useState<RuleType | 'all'>('all')

  // Filtrowanie szablonów
  const filteredTemplates = templates.filter(template => 
    selectedType === 'all' || template.type === selectedType
  )

  // Renderowanie ikony typu
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
  const getActionColor = (action: string) => {
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
  const getActionName = (action: string) => {
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

  // Renderowanie warunków szablonu
  const renderTemplateConditions = (template: RuleTemplate) => {
    const conditions = template.conditions as any
    
    switch (template.type) {
      case 'budget':
        return (
          <div className="text-sm text-neutral-600">
            {conditions.maxPrice && (
              <div>• Maksymalna cena: {conditions.maxPrice} PLN</div>
            )}
            {conditions.maxPricePerUnit && (
              <div>• Maksymalna cena za sztukę: {conditions.maxPricePerUnit} PLN</div>
            )}
            {conditions.maxTotalBudget && (
              <div>• Maksymalny budżet: {conditions.maxTotalBudget} PLN</div>
            )}
          </div>
        )

      case 'category':
        return (
          <div className="text-sm text-neutral-600">
            {conditions.blacklist && conditions.blacklist.length > 0 && (
              <div>• Zakazane kategorie: {conditions.blacklist.join(', ')}</div>
            )}
            {conditions.whitelist && conditions.whitelist.length > 0 && (
              <div>• Preferowane kategorie: {conditions.whitelist.join(', ')}</div>
            )}
            {conditions.warningList && conditions.warningList.length > 0 && (
              <div>• Ostrzegające kategorie: {conditions.warningList.join(', ')}</div>
            )}
          </div>
        )

      case 'quality':
        return (
          <div className="text-sm text-neutral-600">
            {conditions.minRating && (
              <div>• Minimalna ocena: {conditions.minRating}</div>
            )}
            {conditions.minReviews && (
              <div>• Minimalna liczba opinii: {conditions.minReviews}</div>
            )}
            {conditions.requiredCertifications && conditions.requiredCertifications.length > 0 && (
              <div>• Wymagane certyfikaty: {conditions.requiredCertifications.join(', ')}</div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Obsługa wyboru szablonu
  const handleSelectTemplate = (template: RuleTemplate) => {
    if (supabaseUserId) {
      createRuleFromTemplate(template.id, supabaseUserId)
      onSelectTemplate?.(template)
    }
  }

  if (templates.length === 0) {
    return (
      <Card className={className}>
        <CardBody>
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Brak szablonów
            </h3>
            <p className="text-neutral-500">
              Nie ma dostępnych szablonów reguł
            </p>
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className={className}>
      {/* Filtry */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            Wszystkie
          </Button>
          <Button
            variant={selectedType === 'budget' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('budget')}
          >
            💰 Budżetowe
          </Button>
          <Button
            variant={selectedType === 'category' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('category')}
          >
            🏷️ Kategorii
          </Button>
          <Button
            variant={selectedType === 'quality' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setSelectedType('quality')}
          >
            ⭐ Jakościowe
          </Button>
        </div>
      </div>

      {/* Lista szablonów */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(template.type)}</span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {template.name}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {template.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <StatusBadge status={getActionColor(template.action)}>
                    {getActionName(template.action)}
                  </StatusBadge>
                  <span className="text-sm text-neutral-500">
                    Waga: {template.weight}/10
                  </span>
                </div>

                <div>
                  <div className="text-sm font-medium text-neutral-700 mb-1">
                    Warunki:
                  </div>
                  {renderTemplateConditions(template)}
                </div>

                {template.tags && template.tags.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-neutral-700 mb-1">
                      Tagi:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => handleSelectTemplate(template)}
                >
                  Użyj szablonu
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Brak szablonów dla wybranego typu
              </h3>
              <p className="text-neutral-500">
                Wybierz inny typ aby zobaczyć więcej szablonów
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
