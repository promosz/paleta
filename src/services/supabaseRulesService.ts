import { supabase } from '../lib/supabase'
import type { Rule, RuleTemplate } from '../types/rules'
import type { Database } from '../types/supabase'

type RuleRow = Database['public']['Tables']['rules']['Row']
type RuleInsert = Database['public']['Tables']['rules']['Insert']
type RuleUpdate = Database['public']['Tables']['rules']['Update']
type RuleTemplateRow = Database['public']['Tables']['rule_templates']['Row']

export class SupabaseRulesService {
  private async getClient() {
    // TODO: W przyszłości pobierać token z Clerk
    return supabase
  }

  // Pobieranie wszystkich reguł użytkownika
  async getRules(userId: string): Promise<Rule[]> {
    const client = await this.getClient()
    
        const { data, error } = await client
          .from('rules')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching rules:', error)
      throw new Error(`Failed to fetch rules: ${error.message}`)
    }

    return (data || []).map(row => this.mapRowToRule(row))
  }

  // Pobieranie pojedynczej reguły
  async getRule(id: string, userId: string): Promise<Rule | null> {
    const client = await this.getClient()
    
        const { data, error } = await client
          .from('rules')
          .select('*')
          .eq('id', id)
          .eq('user_id', userId)
          .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Not found
      }
      console.error('Error fetching rule:', error)
      throw new Error(`Failed to fetch rule: ${error.message}`)
    }

    return this.mapRowToRule(data)
  }

  // Tworzenie nowej reguły
  async createRule(rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Rule> {
    const client = await this.getClient()
    
    const ruleData: RuleInsert = {
      user_id: userId,
      name: rule.name,
      description: rule.description || null,
      type: rule.type,
      action: rule.action,
      weight: rule.weight,
      status: rule.status,
      conditions: rule.conditions as any,
    }

    const { data, error } = await client
      .from('rules')
      .insert(ruleData)
      .select()
      .single()

    if (error) {
      console.error('Error creating rule:', error)
      throw new Error(`Failed to create rule: ${error.message}`)
    }

    return this.mapRowToRule(data)
  }

  // Aktualizacja reguły
  async updateRule(id: string, updates: Partial<Rule>, userId: string): Promise<void> {
    const client = await this.getClient()
    
    const updateData: RuleUpdate = {
      name: updates.name,
      description: updates.description || null,
      type: updates.type,
      action: updates.action,
      weight: updates.weight,
      status: updates.status,
      conditions: updates.conditions as any,
      updated_at: new Date().toISOString(),
    }

    // Usuwanie null/undefined wartości
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined && value !== null)
    )

    const { error } = await client
      .from('rules')
      .update(cleanedData)
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating rule:', error)
      throw new Error(`Failed to update rule: ${error.message}`)
    }
  }

  // Usuwanie reguły (hard delete)
  async deleteRule(id: string, userId: string): Promise<void> {
    const client = await this.getClient()
    
    const { error } = await client
      .from('rules')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting rule:', error)
      throw new Error(`Failed to delete rule: ${error.message}`)
    }
  }

  // Pobieranie szablonów reguł (globalne)
  async getRuleTemplates(): Promise<RuleTemplate[]> {
    const client = await this.getClient()
    
    const { data, error } = await client
      .from('rule_templates')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching rule templates:', error)
      throw new Error(`Failed to fetch rule templates: ${error.message}`)
    }

    return (data || []).map(row => this.mapRowToRuleTemplate(row))
  }

  // Tworzenie reguły z szablonu
  async createRuleFromTemplate(templateId: string, userId: string): Promise<Rule> {
    const client = await this.getClient()
    
    // Pobierz szablon
    const { data: template, error: templateError } = await client
      .from('rule_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      throw new Error('Template not found')
    }

    // Utwórz regułę z szablonu
    const ruleData: RuleInsert = {
      user_id: userId,
      name: template.name,
      description: template.description,
      type: template.type,
      action: template.action,
      weight: template.weight,
      status: 'active',
      conditions: template.conditions,
    }

    const { data, error } = await client
      .from('rules')
      .insert(ruleData)
      .select()
      .single()

    if (error) {
      console.error('Error creating rule from template:', error)
      throw new Error(`Failed to create rule from template: ${error.message}`)
    }

    return this.mapRowToRule(data)
  }

  // Mapowanie wiersza bazy danych na obiekt Rule
  private mapRowToRule(row: RuleRow): Rule {
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      type: row.type as any,
      action: row.action as any,
      weight: row.weight,
      status: row.status as any,
      conditions: row.conditions as any,
      createdAt: new Date(row.created_at || new Date()),
      updatedAt: new Date(row.updated_at || new Date()),
    }
  }

  // Mapowanie wiersza bazy danych na obiekt RuleTemplate
  private mapRowToRuleTemplate(row: RuleTemplateRow): RuleTemplate {
    return {
      id: row.id,
      name: row.name,
      description: row.description || '',
      type: row.type as any,
      action: row.action as any,
      weight: row.weight,
      conditions: row.conditions as any,
      category: row.category || '',
      tags: row.tags || [],
    }
  }
}

export const supabaseRulesService = new SupabaseRulesService()
