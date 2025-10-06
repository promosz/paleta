// Typy dla systemu reguł

// Typy reguł
export type RuleType = 'budget' | 'category' | 'quality'

// Akcje reguł
export type RuleAction = 'block' | 'warn' | 'prefer'

// Status reguły
export type RuleStatus = 'active' | 'inactive'

// Reguła budżetowa
export interface BudgetRule {
  type: 'budget'
  conditions: {
    maxPrice?: number
    maxPricePerUnit?: number
    maxTotalBudget?: number
    currency?: string
  }
}

// Reguła kategorii
export interface CategoryRule {
  type: 'category'
  conditions: {
    blacklist?: string[]
    whitelist?: string[]
    warningList?: string[]
    caseSensitive?: boolean
  }
}

// Reguła jakościowa
export interface QualityRule {
  type: 'quality'
  conditions: {
    minRating?: number
    minReviews?: number
    requiredCertifications?: string[]
    requiredBrands?: string[]
  }
}

// Unia typów reguł
export type RuleConditions = BudgetRule | CategoryRule | QualityRule

// Główny interfejs reguły
export interface Rule {
  id: string
  name: string
  description?: string
  type: RuleType
  action: RuleAction
  weight: number // 1-10
  status: RuleStatus
  conditions: RuleConditions['conditions']
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

// Szablon reguły
export interface RuleTemplate {
  id: string
  name: string
  description: string
  type: RuleType
  action: RuleAction
  weight: number
  conditions: RuleConditions['conditions']
  category: string
  tags: string[]
}

// Wynik oceny produktu
export interface ProductEvaluation {
  productId: string
  score: number // 0-100
  status: 'ok' | 'warning' | 'blocked'
  appliedRules: AppliedRule[]
  recommendations: string[]
  warnings: string[]
  blocks: string[]
}

// Zastosowana reguła
export interface AppliedRule {
  ruleId: string
  ruleName: string
  action: RuleAction
  weight: number
  score: number
  reason: string
  matched: boolean
}

// Rekomendacja
export interface Recommendation {
  type: 'action' | 'warning' | 'info'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  action?: string
}

// Konfiguracja silnika reguł
export interface RulesEngineConfig {
  defaultScore: number // Domyślna ocena (50)
  maxScore: number // Maksymalna ocena (100)
  minScore: number // Minimalna ocena (0)
  blockThreshold: number // Próg blokady (0)
  warningThreshold: number // Próg ostrzeżenia (30)
}

// Statystyki reguł
export interface RulesStats {
  totalRules: number
  activeRules: number
  inactiveRules: number
  rulesByType: Record<RuleType, number>
  rulesByAction: Record<RuleAction, number>
  averageWeight: number
  lastUsed?: Date
}

// Walidacja reguły
export interface RuleValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  conflicts: string[]
}

// Test reguły
export interface RuleTest {
  ruleId: string
  testData: any[]
  results: {
    passed: number
    failed: number
    total: number
    details: Array<{
      data: any
      result: boolean
      reason: string
    }>
  }
}

// Callback dla postępu oceny
export type EvaluationProgressCallback = (progress: number, status: string) => void

// Callback dla zakończenia oceny
export type EvaluationCompleteCallback = (results: ProductEvaluation[]) => void
