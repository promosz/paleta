import { create } from 'zustand'
import { productRulesService } from '../services/productRulesService'
import { productWarningEngine } from '../services/productWarningEngine'
import type { ProductRule, ProductWarningLevel, ProductRuleType } from '../types/rules'

interface ProductRulesState {
  // Stan
  rules: ProductRule[]
  loading: boolean
  error: string | null
  
  // Akcje CRUD
  loadRules: (userId: string) => Promise<void>
  addRule: (rule: Omit<ProductRule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, userId: string) => Promise<void>
  updateRule: (ruleId: string, updates: Partial<ProductRule>, userId: string) => Promise<void>
  deleteRule: (ruleId: string, userId: string) => Promise<void>
  toggleRuleActive: (ruleId: string, userId: string) => Promise<void>
  
  // Synchronizacja
  syncWithLocalStorage: (userId: string) => Promise<void>
  
  // Filtrowanie i statystyki
  getRulesByType: (type: ProductRuleType) => ProductRule[]
  getRulesByLevel: (level: ProductWarningLevel) => ProductRule[]
  getActiveRules: () => ProductRule[]
  getStats: () => {
    total: number
    low: number
    medium: number
    high: number
    byType: {
      category: number
      product: number
      phrase: number
    }
  }
  
  // Czyszczenie
  clearRules: () => void
  clearError: () => void
}

export const useProductRulesStore = create<ProductRulesState>((set, get) => ({
  // Stan początkowy
  rules: [],
  loading: false,
  error: null,

  // Ładowanie reguł
  loadRules: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const rules = await productRulesService.getRules(userId)
      
      // Zapisz kopię do LocalStorage dla offline use
      if (rules.length > 0) {
        localStorage.setItem(`product-rules-${userId}`, JSON.stringify(rules))
      }
      
      set({ rules, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load rules'
      console.error('Failed to load rules:', error)
      
      // Próba pobrania z LocalStorage
      try {
        const localRules = await productRulesService.getFromLocalStorage(userId)
        set({ rules: localRules, loading: false, error: 'Using cached rules (offline mode)' })
      } catch (localError) {
        set({ error: errorMessage, loading: false })
      }
    }
  },

  // Dodawanie reguły
  addRule: async (rule, userId) => {
    set({ loading: true, error: null })
    try {
      const newRule = await productRulesService.addRule(rule, userId)
      const currentRules = get().rules
      
      set({ 
        rules: [newRule, ...currentRules],
        loading: false 
      })
      
      // Aktualizuj LocalStorage
      await productRulesService.saveToLocalStorage(userId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add rule'
      console.error('Failed to add rule:', error)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  // Aktualizacja reguły
  updateRule: async (ruleId, updates, userId) => {
    set({ loading: true, error: null })
    try {
      await productRulesService.updateRule(ruleId, updates, userId)
      const currentRules = get().rules
      
      set({ 
        rules: currentRules.map(rule => 
          rule.id === ruleId ? { ...rule, ...updates } : rule
        ),
        loading: false 
      })
      
      // Aktualizuj LocalStorage
      await productRulesService.saveToLocalStorage(userId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update rule'
      console.error('Failed to update rule:', error)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  // Usuwanie reguły
  deleteRule: async (ruleId, userId) => {
    set({ loading: true, error: null })
    try {
      await productRulesService.deleteRule(ruleId, userId)
      const currentRules = get().rules
      
      set({ 
        rules: currentRules.filter(rule => rule.id !== ruleId),
        loading: false 
      })
      
      // Aktualizuj LocalStorage
      await productRulesService.saveToLocalStorage(userId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete rule'
      console.error('Failed to delete rule:', error)
      set({ error: errorMessage, loading: false })
      throw error
    }
  },

  // Przełączanie aktywnej statusu reguły
  toggleRuleActive: async (ruleId, userId) => {
    const currentRules = get().rules
    const rule = currentRules.find(r => r.id === ruleId)
    if (!rule) return
    
    await get().updateRule(ruleId, { isActive: !rule.isActive }, userId)
  },

  // Synchronizacja z LocalStorage
  syncWithLocalStorage: async (userId) => {
    set({ loading: true, error: null })
    try {
      await productRulesService.syncWithLocalStorage(userId)
      await get().loadRules(userId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync'
      console.error('Failed to sync:', error)
      set({ error: errorMessage, loading: false })
    }
  },

  // Filtrowanie reguł
  getRulesByType: (type) => {
    return get().rules.filter(rule => rule.ruleType === type)
  },

  getRulesByLevel: (level) => {
    return get().rules.filter(rule => rule.warningLevel === level)
  },

  getActiveRules: () => {
    return get().rules.filter(rule => rule.isActive)
  },

  // Statystyki
  getStats: () => {
    const rules = get().rules
    return {
      total: rules.length,
      low: rules.filter(r => r.warningLevel === 'LOW').length,
      medium: rules.filter(r => r.warningLevel === 'MEDIUM').length,
      high: rules.filter(r => r.warningLevel === 'HIGH').length,
      byType: {
        category: rules.filter(r => r.ruleType === 'category').length,
        product: rules.filter(r => r.ruleType === 'product').length,
        phrase: rules.filter(r => r.ruleType === 'phrase').length
      }
    }
  },

  // Czyszczenie
  clearRules: () => {
    set({ rules: [], error: null })
  },

  clearError: () => {
    set({ error: null })
  }
}))

