import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Rule, 
  RuleTemplate, 
  ProductEvaluation, 
  RulesStats, 
  RuleValidation,
  RuleTest,
  RuleType,
  RuleAction
} from '../types/rules'
import type { ParsedProduct } from '../types/parser'

// Predefiniowane szablony reguł
const defaultTemplates: RuleTemplate[] = [
  {
    id: 'budget-1000',
    name: 'Budżet do 1000 PLN',
    description: 'Ostrzeżenie dla produktów przekraczających 1000 PLN',
    type: 'budget',
    action: 'warn',
    weight: 8,
    conditions: {
      maxPrice: 1000,
      currency: 'PLN'
    },
    category: 'Budżet',
    tags: ['budżet', 'cena', 'ostrzeżenie']
  },
  {
    id: 'budget-500',
    name: 'Budżet do 500 PLN',
    description: 'Blokada produktów przekraczających 500 PLN',
    type: 'budget',
    action: 'block',
    weight: 10,
    conditions: {
      maxPrice: 500,
      currency: 'PLN'
    },
    category: 'Budżet',
    tags: ['budżet', 'cena', 'blokada']
  },
  {
    id: 'avoid-electronics',
    name: 'Unikaj elektroniki',
    description: 'Ostrzeżenie dla produktów elektronicznych',
    type: 'category',
    action: 'warn',
    weight: 6,
    conditions: {
      blacklist: ['elektronika', 'komputer', 'telefon', 'laptop', 'tablet'],
      caseSensitive: false
    },
    category: 'Kategoria',
    tags: ['kategoria', 'elektronika', 'ostrzeżenie']
  },
  {
    id: 'prefer-high-rating',
    name: 'Preferuj produkty z oceną > 4.0',
    description: 'Bonus dla produktów z wysoką oceną',
    type: 'quality',
    action: 'prefer',
    weight: 7,
    conditions: {
      minRating: 4.0
    },
    category: 'Jakość',
    tags: ['jakość', 'ocena', 'preferencja']
  },
  {
    id: 'warn-no-reviews',
    name: 'Ostrzeżenie dla produktów bez opinii',
    description: 'Ostrzeżenie dla produktów bez opinii użytkowników',
    type: 'quality',
    action: 'warn',
    weight: 5,
    conditions: {
      minReviews: 1
    },
    category: 'Jakość',
    tags: ['jakość', 'opinie', 'ostrzeżenie']
  }
]

// Interfejs stanu store
interface RulesState {
  // Stan
  rules: Rule[]
  templates: RuleTemplate[]
  evaluations: ProductEvaluation[]
  stats: RulesStats
  
  // Akcje CRUD
  addRule: (rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRule: (id: string, updates: Partial<Rule>) => void
  deleteRule: (id: string) => void
  toggleRuleStatus: (id: string) => void
  duplicateRule: (id: string) => void
  
  // Szablony
  createRuleFromTemplate: (templateId: string) => void
  getTemplatesByType: (type: RuleType) => RuleTemplate[]
  
  // Ocena produktów
  evaluateProducts: (products: ParsedProduct[]) => ProductEvaluation[]
  evaluateProduct: (product: ParsedProduct) => ProductEvaluation
  
  // Statystyki
  updateStats: () => void
  getStats: () => RulesStats
  
  // Walidacja
  validateRule: (rule: Partial<Rule>) => RuleValidation
  testRule: (ruleId: string, testData: any[]) => RuleTest
  applyRule: (rule: Rule, product: ParsedProduct) => any
  
  // Filtry i sortowanie
  getRulesByType: (type: RuleType) => Rule[]
  getRulesByAction: (action: RuleAction) => Rule[]
  getActiveRules: () => Rule[]
  getInactiveRules: () => Rule[]
  
  // Czyszczenie
  clearAllRules: () => void
  clearEvaluations: () => void
}

// Tworzenie store z persistencją
export const useRulesStore = create<RulesState>()(
  persist(
    (set, get) => ({
      // Stan początkowy
      rules: [],
      templates: defaultTemplates,
      evaluations: [],
      stats: {
        totalRules: 0,
        activeRules: 0,
        inactiveRules: 0,
        rulesByType: { budget: 0, category: 0, quality: 0 },
        rulesByAction: { block: 0, warn: 0, prefer: 0 },
        averageWeight: 0
      },

      // Dodawanie reguły
      addRule: (ruleData) => {
        const newRule: Rule = {
          ...ruleData,
          id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        set(state => ({
          rules: [...state.rules, newRule]
        }))
        
        get().updateStats()
      },

      // Aktualizacja reguły
      updateRule: (id, updates) => {
        set(state => ({
          rules: state.rules.map(rule =>
            rule.id === id
              ? { ...rule, ...updates, updatedAt: new Date() }
              : rule
          )
        }))
        
        get().updateStats()
      },

      // Usuwanie reguły
      deleteRule: (id) => {
        set(state => ({
          rules: state.rules.filter(rule => rule.id !== id)
        }))
        
        get().updateStats()
      },

      // Przełączanie statusu reguły
      toggleRuleStatus: (id) => {
        set(state => ({
          rules: state.rules.map(rule =>
            rule.id === id
              ? { 
                  ...rule, 
                  status: rule.status === 'active' ? 'inactive' : 'active',
                  updatedAt: new Date()
                }
              : rule
          )
        }))
        
        get().updateStats()
      },

      // Duplikowanie reguły
      duplicateRule: (id) => {
        const rule = get().rules.find(r => r.id === id)
        if (rule) {
          const duplicatedRule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'> = {
            ...rule,
            name: `${rule.name} (kopia)`,
            status: 'inactive'
          }
          get().addRule(duplicatedRule)
        }
      },

      // Tworzenie reguły z szablonu
      createRuleFromTemplate: (templateId) => {
        const template = get().templates.find(t => t.id === templateId)
        if (template) {
          const ruleData: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'> = {
            name: template.name,
            description: template.description,
            type: template.type,
            action: template.action,
            weight: template.weight,
            status: 'inactive',
            conditions: template.conditions
          }
          get().addRule(ruleData)
        }
      },

      // Pobieranie szablonów według typu
      getTemplatesByType: (type) => {
        return get().templates.filter(template => template.type === type)
      },

      // Ocena produktów
      evaluateProducts: (products) => {
        const evaluations = products.map(product => get().evaluateProduct(product))
        set({ evaluations })
        return evaluations
      },

      // Ocena pojedynczego produktu
      evaluateProduct: (product) => {
        const activeRules = get().getActiveRules()
        let score = 50 // Domyślna ocena
        const appliedRules: any[] = []
        const recommendations: string[] = []
        const warnings: string[] = []
        const blocks: string[] = []

        // Aplikowanie reguł
        activeRules.forEach(rule => {
          const result = get().applyRule(rule, product)
          if (result.matched) {
            appliedRules.push(result)
            
            // Aktualizacja oceny
            if (rule.action === 'prefer') {
              score += result.score * (rule.weight / 10)
            } else if (rule.action === 'warn') {
              score -= result.score * (rule.weight / 10)
            } else if (rule.action === 'block') {
              score = 0
            }

            // Dodawanie komunikatów
            if (rule.action === 'prefer') {
              recommendations.push(result.reason)
            } else if (rule.action === 'warn') {
              warnings.push(result.reason)
            } else if (rule.action === 'block') {
              blocks.push(result.reason)
            }
          }
        })

        // Ograniczenie oceny do zakresu 0-100
        score = Math.max(0, Math.min(100, score))

        // Określenie statusu
        let status: 'ok' | 'warning' | 'blocked' = 'ok'
        if (blocks.length > 0) {
          status = 'blocked'
        } else if (warnings.length > 0 || score < 30) {
          status = 'warning'
        }

        return {
          productId: product.id,
          score: Math.round(score),
          status,
          appliedRules,
          recommendations,
          warnings,
          blocks
        }
      },


      // Aktualizacja statystyk
      updateStats: () => {
        const rules = get().rules
        const activeRules = rules.filter(r => r.status === 'active')
        const inactiveRules = rules.filter(r => r.status === 'inactive')

        const rulesByType = rules.reduce((acc, rule) => {
          acc[rule.type] = (acc[rule.type] || 0) + 1
          return acc
        }, {} as Record<RuleType, number>)

        const rulesByAction = rules.reduce((acc, rule) => {
          acc[rule.action] = (acc[rule.action] || 0) + 1
          return acc
        }, {} as Record<RuleAction, number>)

        const averageWeight = rules.length > 0 
          ? rules.reduce((sum, rule) => sum + rule.weight, 0) / rules.length 
          : 0

        set({
          stats: {
            totalRules: rules.length,
            activeRules: activeRules.length,
            inactiveRules: inactiveRules.length,
            rulesByType,
            rulesByAction,
            averageWeight: Math.round(averageWeight * 10) / 10
          }
        })
      },

      // Pobieranie statystyk
      getStats: () => {
        return get().stats
      },

      // Walidacja reguły
      validateRule: (rule) => {
        console.log('validateRule called with:', rule)
        const errors: string[] = []
        const warnings: string[] = []
        const conflicts: string[] = []

        // Walidacja podstawowa
        console.log('rule.name:', rule.name, 'type:', typeof rule.name)
        if (!rule.name || (typeof rule.name === 'string' && rule.name.trim().length === 0)) {
          errors.push('Nazwa reguły jest wymagana')
        }

        if (!rule.type) {
          errors.push('Typ reguły jest wymagany')
        }

        if (!rule.action) {
          errors.push('Akcja reguły jest wymagana')
        }

        if (rule.weight && (rule.weight < 1 || rule.weight > 10)) {
          errors.push('Waga reguły musi być między 1 a 10')
        }

        // Walidacja warunków
        if (rule.conditions) {
          if (rule.type === 'budget') {
            const conditions = rule.conditions as any
            if (!conditions.maxPrice && !conditions.maxPricePerUnit && !conditions.maxTotalBudget) {
              warnings.push('Brak zdefiniowanych warunków budżetowych')
            }
          }

          if (rule.type === 'category') {
            const conditions = rule.conditions as any
            if (!conditions.blacklist && !conditions.whitelist && !conditions.warningList) {
              warnings.push('Brak zdefiniowanych list kategorii')
            }
          }

          if (rule.type === 'quality') {
            const conditions = rule.conditions as any
            if (!conditions.minRating && !conditions.minReviews && !conditions.requiredCertifications) {
              warnings.push('Brak zdefiniowanych warunków jakościowych')
            }
          }
        }

        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          conflicts
        }
      },

      // Test reguły
      testRule: (ruleId, testData) => {
        const rule = get().rules.find(r => r.id === ruleId)
        if (!rule) {
          throw new Error('Reguła nie została znaleziona')
        }

        const results = testData.map(data => {
          const result = get().applyRule(rule, data)
          return {
            data,
            result: result.matched,
            reason: result.reason
          }
        })

        const passed = results.filter(r => r.result).length
        const failed = results.length - passed

        return {
          ruleId,
          testData,
          results: {
            passed,
            failed,
            total: results.length,
            details: results
          }
        }
      },

      // Filtry i sortowanie
      getRulesByType: (type) => {
        return get().rules.filter(rule => rule.type === type)
      },

      getRulesByAction: (action) => {
        return get().rules.filter(rule => rule.action === action)
      },

      getActiveRules: () => {
        return get().rules.filter(rule => rule.status === 'active')
      },

      getInactiveRules: () => {
        return get().rules.filter(rule => rule.status === 'inactive')
      },

      // Czyszczenie
      clearAllRules: () => {
        set({ rules: [] })
        get().updateStats()
      },

      clearEvaluations: () => {
        set({ evaluations: [] })
      },

      // Funkcja pomocnicza do aplikowania reguł
      applyRule: (rule: Rule, product: ParsedProduct) => {
        let matched = false
        let reason = ''
        let score = 0

        switch (rule.type) {
          case 'budget':
            const budgetConditions = rule.conditions as any
            if (product.price && budgetConditions.maxPrice) {
              if (product.price > budgetConditions.maxPrice) {
                matched = true
                reason = `Cena ${product.price} PLN przekracza limit ${budgetConditions.maxPrice} PLN`
                score = Math.min(50, (product.price - budgetConditions.maxPrice) / 10)
              }
            }
            break

          case 'category':
            const categoryConditions = rule.conditions as any
            if (product.category && categoryConditions.blacklist) {
              const categoryLower = product.category.toLowerCase()
              const blacklistLower = categoryConditions.blacklist.map((c: string) => c.toLowerCase())
              
              if (blacklistLower.some((cat: string) => categoryLower.includes(cat))) {
                matched = true
                reason = `Kategoria "${product.category}" jest na liście zakazanych`
                score = 30
              }
            }
            break

          case 'quality':
            const qualityConditions = rule.conditions as any
            // Symulacja oceny jakości (w rzeczywistej aplikacji byłaby prawdziwa ocena)
            if (qualityConditions.minRating && Math.random() < 0.3) {
              matched = true
              reason = `Produkt nie spełnia wymagań jakościowych`
              score = 20
            }
            break
        }

        return {
          ruleId: rule.id,
          ruleName: rule.name,
          action: rule.action,
          weight: rule.weight,
          score,
          reason,
          matched
        }
      }
    }),
    {
      name: 'rules-store',
      partialize: (state) => ({ 
        rules: state.rules,
        templates: state.templates
      })
    }
  )
)
