import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Rule, RuleType, RuleAction, RuleValidation } from '../../types/rules'
import { useRulesStore } from '../../stores/rulesStoreSupabase'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { Button, Card, CardHeader, CardBody, Input } from '../ui'

interface RuleFormProps {
  rule?: Rule
  onSave?: (rule: Rule) => void
  onCancel?: () => void
  className?: string
}

interface RuleFormData {
  name: string
  description: string
  type: RuleType
  action: RuleAction
  weight: number
  status: 'active' | 'inactive'
  conditions: any
}

export const RuleForm: React.FC<RuleFormProps> = ({
  rule,
  onSave,
  onCancel,
  className = ''
}) => {
  const { supabaseUserId } = useCurrentUser()
  const { addRule, updateRule, validateRule } = useRulesStore()
  const [validation, setValidation] = useState<RuleValidation | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<RuleFormData>({
    mode: 'onChange', // Walidacja podczas wpisywania
    defaultValues: {
      name: rule?.name || '',
      description: rule?.description || '',
      type: rule?.type || 'budget',
      action: rule?.action || 'warn',
      weight: rule?.weight || 5,
      status: rule?.status || 'inactive',
      conditions: rule?.conditions || {}
    }
  })

  const watchedType = watch('type')
  const watchedName = watch('name')
  
  // Debug - sprawdź wartości
  console.log('Form values:', { 
    name: watchedName, 
    nameType: typeof watchedName,
    nameLength: watchedName?.length,
    isValid, 
    errors: errors.name?.message,
    validation: validation?.isValid 
  })

  // Walidacja formularza
  useEffect(() => {
    const subscription = watch((value) => {
      console.log('Watch value:', value)
      try {
        const validation = validateRule(value as Partial<Rule>)
        console.log('Validation result:', validation)
        setValidation(validation)
      } catch (error) {
        console.error('Validation error:', error)
        setValidation({ isValid: false, errors: ['Błąd walidacji'], warnings: [], conflicts: [] })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, validateRule])

  // Obsługa zapisywania
  const onSubmit = async (data: RuleFormData) => {
    console.log('onSubmit called with:', data)
    setIsSubmitting(true)
    
    try {
      const ruleData = {
        ...data,
        conditions: getConditionsForType(data.type, data.conditions)
      }
      console.log('ruleData prepared:', ruleData)

      if (supabaseUserId) {
        if (rule) {
          console.log('Updating rule:', rule.id)
          updateRule(rule.id, ruleData, supabaseUserId)
        } else {
          console.log('Adding new rule')
          addRule(ruleData, supabaseUserId)
        }
      }

      console.log('Calling onSave with:', ruleData)
      onSave?.(ruleData as Rule)
    } catch (error) {
      console.error('Błąd zapisywania reguły:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pobieranie warunków dla typu reguły
  const getConditionsForType = (type: RuleType, conditions: any) => {
    switch (type) {
      case 'budget':
        return {
          maxPrice: conditions.maxPrice || undefined,
          maxPricePerUnit: conditions.maxPricePerUnit || undefined,
          maxTotalBudget: conditions.maxTotalBudget || undefined,
          currency: conditions.currency || 'PLN'
        }
      case 'category':
        return {
          blacklist: conditions.blacklist || [],
          whitelist: conditions.whitelist || [],
          warningList: conditions.warningList || [],
          caseSensitive: conditions.caseSensitive || false
        }
      case 'quality':
        return {
          minRating: conditions.minRating || undefined,
          minReviews: conditions.minReviews || undefined,
          requiredCertifications: conditions.requiredCertifications || [],
          requiredBrands: conditions.requiredBrands || []
        }
      default:
        return {}
    }
  }

  // Renderowanie warunków dla typu reguły
  const renderConditions = () => {
    switch (watchedType) {
      case 'budget':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Maksymalna cena (PLN)
              </label>
              <Input
                type="number"
                placeholder="np. 1000"
                {...register('conditions.maxPrice', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Maksymalna cena za sztukę (PLN)
              </label>
              <Input
                type="number"
                placeholder="np. 100"
                {...register('conditions.maxPricePerUnit', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Maksymalny budżet zestawu (PLN)
              </label>
              <Input
                type="number"
                placeholder="np. 5000"
                {...register('conditions.maxTotalBudget', { valueAsNumber: true })}
              />
            </div>
          </div>
        )

      case 'category':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lista zakazanych kategorii (oddzielone przecinkami)
              </label>
              <Input
                placeholder="np. elektronika, komputery, telefony"
                {...register('conditions.blacklist')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lista preferowanych kategorii (oddzielone przecinkami)
              </label>
              <Input
                placeholder="np. książki, ubrania, sport"
                {...register('conditions.whitelist')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lista ostrzegających kategorii (oddzielone przecinkami)
              </label>
              <Input
                placeholder="np. kosmetyki, żywność"
                {...register('conditions.warningList')}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="caseSensitive"
                {...register('conditions.caseSensitive')}
                className="mr-2"
              />
              <label htmlFor="caseSensitive" className="text-sm text-neutral-700">
                Uwzględniaj wielkość liter
              </label>
            </div>
          </div>
        )

      case 'quality':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Minimalna ocena (1-5)
              </label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                placeholder="np. 4.0"
                {...register('conditions.minRating', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Minimalna liczba opinii
              </label>
              <Input
                type="number"
                min="0"
                placeholder="np. 10"
                {...register('conditions.minReviews', { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Wymagane certyfikaty (oddzielone przecinkami)
              </label>
              <Input
                placeholder="np. CE, ISO, FSC"
                {...register('conditions.requiredCertifications')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Preferowane marki (oddzielone przecinkami)
              </label>
              <Input
                placeholder="np. Apple, Samsung, Nike"
                {...register('conditions.requiredBrands')}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-800">
          {rule ? 'Edytuj regułę' : 'Nowa reguła'}
        </h3>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Podstawowe informacje */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nazwa reguły *
              </label>
              <Input
                placeholder="np. Budżet do 1000 PLN"
                {...register('name', { 
                  required: 'Nazwa reguły jest wymagana',
                  minLength: { value: 1, message: 'Nazwa reguły jest wymagana' }
                })}
                error={errors.name?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Opis reguły
              </label>
              <textarea
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
                placeholder="Opis działania reguły..."
                {...register('description')}
              />
            </div>
          </div>

          {/* Typ i akcja reguły */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Typ reguły *
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('type', { required: 'Typ reguły jest wymagany' })}
              >
                <option value="budget">💰 Budżetowa</option>
                <option value="category">🏷️ Kategorii</option>
                <option value="quality">⭐ Jakościowa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Akcja reguły *
              </label>
              <select
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                {...register('action', { required: 'Akcja reguły jest wymagana' })}
              >
                <option value="warn">⚠️ Ostrzeżenie</option>
                <option value="block">❌ Blokada</option>
                <option value="prefer">✅ Preferencja</option>
              </select>
            </div>
          </div>

          {/* Waga reguły */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Waga reguły (1-10): {watch('weight')}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full"
              {...register('weight', { valueAsNumber: true })}
            />
            <div className="flex justify-between text-xs text-neutral-500 mt-1">
              <span>1 - Niska</span>
              <span>10 - Wysoka</span>
            </div>
          </div>

          {/* Warunki reguły */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Warunki reguły
            </label>
            {renderConditions()}
          </div>

          {/* Status reguły */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Status reguły
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="active"
                  {...register('status')}
                  className="mr-2"
                />
                <span className="text-sm">Aktywna</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="inactive"
                  {...register('status')}
                  className="mr-2"
                />
                <span className="text-sm">Nieaktywna</span>
              </label>
            </div>
          </div>

          {/* Walidacja */}
          {validation && (
            <div className="space-y-2">
              {validation.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-danger-600 mb-1">Błędy:</h4>
                  {validation.errors.map((error, index) => (
                    <div key={index} className="text-sm text-danger-600">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
              {validation.warnings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-warning-600 mb-1">Ostrzeżenia:</h4>
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-warning-600">
                      • {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Przyciski */}
          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
              >
                Anuluj
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={(() => {
                const disabled = !isValid || isSubmitting || (validation ? !validation.isValid : true)
                console.log('Button disabled state:', { 
                  isValid, 
                  isSubmitting, 
                  validationIsValid: validation?.isValid, 
                  disabled 
                })
                return disabled
              })()}
            >
              {isSubmitting ? 'Zapisywanie...' : rule ? 'Zaktualizuj' : 'Utwórz regułę'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
