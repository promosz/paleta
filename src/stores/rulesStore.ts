import { create } from 'zustand'
import { supabaseRulesService } from '../services/supabaseRulesService'
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

// Interfejs stanu store
interface RulesState {
  // Stan
  rules: Rule[]
  templates: RuleTemplate[]
  evaluations: ProductEvaluation[]
  stats: RulesStats
  loading: boolean
  error: string | null
  
  // Akcje CRUD
  addRule: (rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Rule>
  updateRule: (id: string, updates: Partial<Rule>) => Promise<void>
  deleteRule: (id: string) => Promise<void>
  toggleRuleStatus: (id: string) => Promise<void>
  duplicateRule: (id: string) => Promise<Rule>
  
  // Szablony
  createRuleFromTemplate: (templateId: string) => Promise<Rule>
  getTemplatesByType: (type: RuleType) => RuleTemplate[]
  
  // Ewaluacja
  evaluateProducts: (products: ParsedProduct[]) => ProductEvaluation[]
  evaluateProduct: (product: ParsedProduct) => ProductEvaluation
  
  // Statystyki
  updateStats: () => Promise<void>
  getStats: () => RulesStats
  
  // Walidacja i testy
  validateRule: (rule: Partial<Rule>) => RuleValidation
  testRule: (ruleId: string, testData: any[]) => RuleTest
  applyRule: (rule: Rule, product: ParsedProduct) => any
  
  // Pobieranie danych
  getRulesByType: (type: RuleType) => Rule[]
  getRulesByAction: (action: RuleAction) => Rule[]
  getActiveRules: () => Rule[]
  getInactiveRules: () => Rule[]
  
  // Ładowanie danych
  loadRules: (userId: string) => Promise<void>
  loadTemplates: () => Promise<void>
  loadRule: (id: string, userId: string) => Promise<void>
  
  // Czyszczenie
  clearAllRules: () => void
  clearEvaluations: () => void
  clearError: () => void
}

// Helper do pobierania userId z Clerk (temporary)
const getCurrentUserId = (): string => {
  // TODO: Integracja z Clerk - pobieranie aktualnego użytkownika
  // Na razie zwracamy przykładowy ID
  return 'temp-user-id'
}

// Tworzenie store
export const useRulesStore = create<RulesState>((set, get) => ({
  // Stan początkowy
  rules: [],
  templates: [],
  evaluations: [],
  stats: {
    totalRules: 0,
    activeRules: 0,
    inactiveRules: 0,
    rulesByType: {
      budget: 0,
      category: 0,
      quality: 0
    },
    rulesByAction: {
      block: 0,
      warn: 0,
      prefer: 0
    },
    averageWeight: 0
  },
  loading: false,
  error: null,

  // Ładowanie reguł
  loadRules: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const rules = await supabaseRulesService.getRules(userId)
      set({ rules, loading: false })
      get().updateStats()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load rules'
      set({ error: errorMessage, loading: false })
      console.error('Error loading rules:', error)
    }
  },

  // Ładowanie szablonów
  loadTemplates: async () => {
    set({ loading: true, error: null })
    try {
      const templates = await supabaseRulesService.getRuleTemplates()
      set({ templates, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load templates'
      set({ error: errorMessage, loading: false })
      console.error('Error loading templates:', error)
    }
  },

  // Ładowanie pojedynczej reguły
  loadRule: async (id: string, userId: string) => {
    set({ loading: true, error: null })
    try {
      await supabaseRulesService.getRule(id, userId)
      set({ loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load rule'
      set({ error: errorMessage, loading: false })
      console.error('Error loading rule:', error)
    }
  },

  // Dodawanie reguły
  addRule: async (rule) => {
    set({ loading: true, error: null })
    try {
      const userId = getCurrentUserId()
      const createdRule = await supabaseRulesService.createRule(rule, userId)
      
      set(state => ({
        rules: [createdRule, ...state.rules],
        loading: false
      }))
      
      get().updateStats()
      return createdRule
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add rule'
      set({ error: errorMessage, loading: false })
      console.error('Error adding rule:', error)
      throw error
    }
  },

  // Aktualizacja reguły
  updateRule: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const userId = getCurrentUserId()
      await supabaseRulesService.updateRule(id, updates, userId)
      
      set(state => ({
        rules: state.rules.map(rule =>
          rule.id === id
            ? { ...rule, ...updates, updatedAt: new Date() }
            : rule
        ),
        loading: false
      }))
      
      get().updateStats()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update rule'
      set({ error: errorMessage, loading: false })
      console.error('Error updating rule:', error)
      throw error
    }
  },

  // Usuwanie reguły
  deleteRule: async (id) => {
    set({ loading: true, error: null })
    try {
      const userId = getCurrentUserId()
      await supabaseRulesService.deleteRule(id, userId)
      
      set(state => ({
        rules: state.rules.filter(rule => rule.id !== id),
        loading: false
      }))
      
      get().updateStats()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete rule'
      set({ error: errorMessage, loading: false })
      console.error('Error deleting rule:', error)
      throw error
    }
  },

  // Przełączanie statusu reguły
  toggleRuleStatus: async (id) => {
    const rule = get().rules.find(r => r.id === id)
    if (rule) {
      await get().updateRule(id, { status: rule.status === 'active' ? 'inactive' : 'active' })
    }
  },

  // Duplikowanie reguły
  duplicateRule: async (id) => {
    const rule = get().rules.find(r => r.id === id)
    if (!rule) {
      throw new Error('Rule not found')
    }
    
    const duplicatedRule = await get().addRule({
      ...rule,
      name: `${rule.name} (kopia)`,
      status: 'inactive'
    })
    
    return duplicatedRule
  },

  // Tworzenie reguły z szablonu
  createRuleFromTemplate: async (templateId) => {
    set({ loading: true, error: null })
    try {
      const userId = getCurrentUserId()
      const rule = await supabaseRulesService.createRuleFromTemplate(templateId, userId)
      
      set(state => ({
        rules: [rule, ...state.rules],
        loading: false
      }))
      
      get().updateStats()
      return rule
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create rule from template'
      set({ error: errorMessage, loading: false })
      console.error('Error creating rule from template:', error)
      throw error
    }
  },

  // Pobieranie szablonów według typu
  getTemplatesByType: (type) => {
    return get().templates.filter(template => template.type === type)
  },

  // Ewaluacja produktów
  evaluateProducts: (products) => {
    const evaluations: ProductEvaluation[] = []
    
    for (const product of products) {
      const evaluation = get().evaluateProduct(product)
      evaluations.push(evaluation)
    }
    
    set({ evaluations })
    get().updateStats()
    return evaluations
  },

  // Ewaluacja pojedynczego produktu
  evaluateProduct: (product) => {
    const activeRules = get().getActiveRules()
    const appliedRules: any[] = []
    const recommendations: string[] = []
    const warnings: string[] = []
    const blocks: string[] = []
    let totalScore = 0
    let status: 'ok' | 'warning' | 'blocked' = 'ok'
    
    for (const rule of activeRules) {
      try {
        const result = get().applyRule(rule, product)
        if (result !== null) {
          appliedRules.push({
            ruleId: rule.id,
            ruleName: rule.name,
            action: rule.action,
            weight: rule.weight,
            score: rule.weight,
            reason: result.reason || 'Reguła zastosowana',
            matched: true
          })
          
          if (rule.action === 'block') {
            status = 'blocked'
            blocks.push(result.reason || 'Produkt zablokowany')
            totalScore += rule.weight * -2 // Blokada ma większą wagę
          } else if (rule.action === 'warn') {
            if (status !== 'blocked') {
              status = 'warning'
            }
            warnings.push(result.reason || 'Ostrzeżenie')
            totalScore += rule.weight * -1 // Ostrzeżenie ma mniejszą wagę
          } else if (rule.action === 'prefer') {
            recommendations.push(result.reason || 'Rekomendacja')
            totalScore += rule.weight * 1 // Preferencja dodaje punkty
          }
        }
      } catch (error) {
        console.warn(`Error applying rule ${rule.id}:`, error)
      }
    }
    
    const score = Math.max(0, Math.min(100, 50 + totalScore)) // Normalizacja do 0-100
    
    return {
      productId: product.id,
      score,
      status,
      appliedRules,
      recommendations,
      warnings,
      blocks
    }
  },

  // Aktualizacja statystyk
  updateStats: async () => {
    const rules = get().rules
    const evaluations = get().evaluations
    
    const rulesByType: Record<RuleType, number> = {
      budget: 0,
      category: 0,
      quality: 0
    }
    
    const rulesByAction: Record<RuleAction, number> = {
      block: 0,
      warn: 0,
      prefer: 0
    }
    
    rules.forEach(rule => {
      rulesByType[rule.type] = (rulesByType[rule.type] || 0) + 1
      rulesByAction[rule.action] = (rulesByAction[rule.action] || 0) + 1
    })
    
    const activeRules = rules.filter(r => r.status === 'active')
    const inactiveRules = rules.filter(r => r.status === 'inactive')
    
    const averageWeight = rules.length > 0 
      ? rules.reduce((sum, r) => sum + r.weight, 0) / rules.length 
      : 0
    
    const stats: RulesStats = {
      totalRules: rules.length,
      activeRules: activeRules.length,
      inactiveRules: inactiveRules.length,
      rulesByType,
      rulesByAction,
      averageWeight,
      lastUsed: evaluations.length > 0 ? new Date() : undefined
    }
    
    set({ stats })
  },

  // Pobieranie statystyk
  getStats: () => {
    return get().stats
  },

  // Walidacja reguły
  validateRule: (rule) => {
    const validation: RuleValidation = {
      isValid: true,
      errors: [],
      warnings: [],
      conflicts: []
    }
    
    if (!rule.name || rule.name.trim().length === 0) {
      validation.isValid = false
      validation.errors.push('Nazwa reguły jest wymagana')
    }
    
    if (!rule.type) {
      validation.isValid = false
      validation.errors.push('Typ reguły jest wymagany')
    }
    
    if (!rule.action) {
      validation.isValid = false
      validation.errors.push('Akcja reguły jest wymagana')
    }
    
    if (rule.weight === undefined || rule.weight < 1 || rule.weight > 10) {
      validation.isValid = false
      validation.errors.push('Waga reguły musi być między 1 a 10')
    }
    
    if (!rule.conditions || Object.keys(rule.conditions).length === 0) {
      validation.isValid = false
      validation.errors.push('Warunki reguły są wymagane')
    }
    
    return validation
  },

  // Test reguły
  testRule: (ruleId, testData) => {
    const rule = get().rules.find(r => r.id === ruleId)
    if (!rule) {
      return {
        ruleId,
        testData,
        results: {
          passed: 0,
          failed: 0,
          total: 0,
          details: []
        }
      }
    }
    
    const details = testData.map(item => {
      try {
        const result = get().applyRule(rule, item)
        return {
          data: item,
          result: result !== null,
          reason: result ? result.reason : 'Reguła nie zastosowana'
        }
      } catch (error) {
        return {
          data: item,
          result: false,
          reason: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    })
    
    const passed = details.filter(d => d.result).length
    const failed = details.filter(d => !d.result).length
    
    return {
      ruleId,
      testData,
      results: {
        passed,
        failed,
        total: details.length,
        details
      }
    }
  },

  // Zastosowanie reguły do produktu
  applyRule: (rule, product) => {
    // TODO: Implementować logikę reguł
    // Na razie zwracamy prostą implementację
    
    switch (rule.type) {
      case 'budget':
        const budgetConditions = rule.conditions as any
        if (budgetConditions.maxPrice && product.price && product.price > budgetConditions.maxPrice) {
          return {
            matched: true,
            reason: `Cena ${product.price} przekracza limit ${budgetConditions.maxPrice}`,
            action: rule.action
          }
        }
        break
        
      case 'category':
        const categoryConditions = rule.conditions as any
        if (categoryConditions.blacklist && product.category && categoryConditions.blacklist.includes(product.category)) {
          return {
            matched: true,
            reason: `Kategoria ${product.category} jest na czarnej liście`,
            action: rule.action
          }
        }
        if (categoryConditions.whitelist && product.category && !categoryConditions.whitelist.includes(product.category)) {
          return {
            matched: true,
            reason: `Kategoria ${product.category} nie jest na białej liście`,
            action: rule.action
          }
        }
        break
        
      case 'quality':
        const qualityConditions = rule.conditions as any
        if (qualityConditions.keywords) {
          const productName = product.name.toLowerCase()
          const matchedKeywords = qualityConditions.keywords.filter((keyword: string) => 
            productName.includes(keyword.toLowerCase())
          )
          
          if (matchedKeywords.length > 0) {
            return {
              matched: true,
              reason: `Nazwa zawiera słowa kluczowe: ${matchedKeywords.join(', ')}`,
              action: rule.action
            }
          }
        }
        break
    }
    
    return null
  },

  // Pobieranie reguł według typu
  getRulesByType: (type) => {
    return get().rules.filter(rule => rule.type === type)
  },

  // Pobieranie reguł według akcji
  getRulesByAction: (action) => {
    return get().rules.filter(rule => rule.action === action)
  },

  // Pobieranie aktywnych reguł
  getActiveRules: () => {
    return get().rules.filter(rule => rule.status === 'active')
  },

  // Pobieranie nieaktywnych reguł
  getInactiveRules: () => {
    return get().rules.filter(rule => rule.status === 'inactive')
  },

  // Czyszczenie reguł
  clearAllRules: () => {
    set({ rules: [] })
    get().updateStats()
  },

  // Czyszczenie ocen
  clearEvaluations: () => {
    set({ evaluations: [] })
    get().updateStats()
  },

  // Czyszczenie błędu
  clearError: () => {
    set({ error: null })
  }
}))

