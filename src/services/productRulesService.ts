import { supabase, getSupabaseClient } from '../lib/supabase'
import type { ProductRule, OldProductRule } from '../types/rules'
import type { Database } from '../types/supabase'

type ProductRulesRow = Database['public']['Tables']['product_rules']['Row']
type ProductRulesInsert = Database['public']['Tables']['product_rules']['Insert']
type ProductRulesUpdate = Database['public']['Tables']['product_rules']['Update']

class ProductRulesService {
  private static instance: ProductRulesService
  private supabaseClient = supabase

  static getInstance(): ProductRulesService {
    if (!ProductRulesService.instance) {
      ProductRulesService.instance = new ProductRulesService()
    }
    return ProductRulesService.instance
  }

  // Konwersja z bazy danych do typu aplikacji
  private rowToRule(row: ProductRulesRow): ProductRule {
    return {
      id: row.id,
      userId: row.user_id,
      ruleType: row.rule_type as 'category' | 'product' | 'phrase',
      ruleValue: row.rule_value,
      warningLevel: row.warning_level as 'LOW' | 'MEDIUM' | 'HIGH',
      description: row.description || undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    }
  }

  // Konwersja z typu aplikacji do bazy danych
  private ruleToInsert(rule: Omit<ProductRule, 'id' | 'createdAt' | 'updatedAt'>, userId: string): ProductRulesInsert {
    return {
      user_id: userId,
      rule_type: rule.ruleType,
      rule_value: rule.ruleValue,
      warning_level: rule.warningLevel,
      description: rule.description,
      is_active: rule.isActive
    }
  }

  // Pobieranie reguł użytkownika
  async getRules(userId: string): Promise<ProductRule[]> {
    if (!this.supabaseClient) {
      console.warn('Supabase not configured - returning empty rules array')
      return []
    }

    try {
      const { data, error } = await this.supabaseClient
        .from('product_rules')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching product rules:', error)
        throw error
      }

      return data.map(row => this.rowToRule(row))
    } catch (error) {
      console.error('Failed to get rules:', error)
      throw error
    }
  }

  // Dodawanie reguły
  async addRule(rule: Omit<ProductRule, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ProductRule> {
    if (!this.supabaseClient) {
      throw new Error('Supabase not configured')
    }

    try {
      const insertData = this.ruleToInsert(rule, userId)

      const { data, error } = await this.supabaseClient
        .from('product_rules')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error adding rule:', error)
        throw error
      }

      return this.rowToRule(data)
    } catch (error) {
      console.error('Failed to add rule:', error)
      throw error
    }
  }

  // Aktualizacja reguły
  async updateRule(ruleId: string, updates: Partial<ProductRule>, userId: string): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase not configured')
    }

    try {
      const updateData: ProductRulesUpdate = {}

      if (updates.ruleType !== undefined) updateData.rule_type = updates.ruleType
      if (updates.ruleValue !== undefined) updateData.rule_value = updates.ruleValue
      if (updates.warningLevel !== undefined) updateData.warning_level = updates.warningLevel
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive

      const { error } = await this.supabaseClient
        .from('product_rules')
        .update(updateData)
        .eq('id', ruleId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating rule:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to update rule:', error)
      throw error
    }
  }

  // Usuwanie reguły (soft delete)
  async deleteRule(ruleId: string, userId: string): Promise<void> {
    if (!this.supabaseClient) {
      throw new Error('Supabase not configured')
    }

    try {
      const { error } = await this.supabaseClient
        .from('product_rules')
        .update({ is_active: false })
        .eq('id', ruleId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting rule:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to delete rule:', error)
      throw error
    }
  }

  // Synchronizacja z LocalStorage (migracja starych reguł)
  async syncWithLocalStorage(userId: string): Promise<void> {
    if (!this.supabaseClient) {
      console.warn('Supabase not configured - skipping sync')
      return
    }

    try {
      // Pobierz stare reguły z LocalStorage
      const oldRulesJson = localStorage.getItem('analysis-rules')
      if (!oldRulesJson) {
        console.log('No old rules to migrate')
        return
      }

      const oldRules: OldProductRule[] = JSON.parse(oldRulesJson)
      console.log(`Migrating ${oldRules.length} old rules to Supabase`)

      // Sprawdź czy użytkownik ma już jakieś reguły w Supabase
      const existingRules = await this.getRules(userId)
      if (existingRules.length > 0) {
        console.log('User already has rules in Supabase - skipping migration')
        return
      }

      // Migruj stare reguły do nowego formatu
      const newRules = oldRules.map(oldRule => ({
        ruleType: oldRule.type as 'category' | 'product',
        ruleValue: oldRule.name,
        warningLevel: 'MEDIUM' as const,  // Domyślnie MEDIUM dla starych reguł
        description: oldRule.description,
        isActive: true
      }))

      // Dodaj wszystkie reguły do Supabase
      for (const rule of newRules) {
        await this.addRule(rule, userId)
      }

      console.log(`Migrated ${newRules.length} rules to Supabase`)

      // Usuń stare reguły z LocalStorage po udanej migracji
      localStorage.removeItem('analysis-rules')
      console.log('Removed old rules from LocalStorage')

      // Zapisz kopię w LocalStorage dla offline use
      await this.saveToLocalStorage(userId)
    } catch (error) {
      console.error('Failed to sync with LocalStorage:', error)
      throw error
    }
  }

  // Zapisywanie reguł do LocalStorage (dla trybu offline)
  async saveToLocalStorage(userId: string): Promise<void> {
    try {
      const rules = await this.getRules(userId)
      localStorage.setItem(`product-rules-${userId}`, JSON.stringify(rules))
    } catch (error) {
      console.error('Failed to save rules to LocalStorage:', error)
    }
  }

  // Pobieranie reguł z LocalStorage (gdy Supabase niedostępny)
  async getFromLocalStorage(userId: string): Promise<ProductRule[]> {
    try {
      const rulesJson = localStorage.getItem(`product-rules-${userId}`)
      if (!rulesJson) {
        return []
      }
      const rules = JSON.parse(rulesJson) as ProductRule[]
      // Konwertuj daty z stringów
      return rules.map(rule => ({
        ...rule,
        createdAt: new Date(rule.createdAt),
        updatedAt: new Date(rule.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load rules from LocalStorage:', error)
      return []
    }
  }
}

export const productRulesService = ProductRulesService.getInstance()

