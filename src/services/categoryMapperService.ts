/**
 * Category Mapper Service - Serwis do zarządzania mapowaniami kategorii
 * 
 * Funkcjonalności:
 * - Automatyczne mapowanie kategorii z produktów
 * - Zapisywanie i ładowanie mapowań z Supabase
 * - Aktualizacja kategorii produktów w bazie
 * - Statystyki i raporty
 */

import { supabase } from '../lib/supabase'
import { CategoryNormalizer } from '../utils/categoryNormalizer'

export interface CategoryMappingDB {
  id: string
  user_id: string
  analysis_id: string | null
  original_category: string
  normalized_category: string
  confidence_score: number
  is_manual: boolean
  mapping_algorithm: string
  similarity_score: number | null
  created_at: string
  updated_at: string
}

export interface Product {
  id?: string
  kategoria: string
  [key: string]: any
}

export class CategoryMapperService {
  /**
   * Pobierz wszystkie mapowania użytkownika
   */
  static async getUserMappings(userId: string): Promise<CategoryMappingDB[]> {
    const { data, error } = await (supabase as any)
      .from('category_mappings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load category mappings:', error)
      throw error
    }
    
    return (data || []) as CategoryMappingDB[]
  }

  /**
   * Pobierz mapowania dla konkretnej analizy
   */
  static async getAnalysisMappings(analysisId: string): Promise<CategoryMappingDB[]> {
    const { data, error } = await (supabase as any)
      .from('category_mappings')
      .select('*')
      .eq('analysis_id', analysisId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load analysis mappings:', error)
      throw error
    }
    
    return (data || []) as CategoryMappingDB[]
  }

  /**
   * Znajdź mapowanie dla kategorii
   */
  static async findMapping(
    userId: string, 
    category: string
  ): Promise<CategoryMappingDB | null> {
    const { data, error } = await (supabase as any)
      .from('category_mappings')
      .select('*')
      .eq('user_id', userId)
      .eq('original_category', category)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('Failed to find mapping:', error)
      throw error
    }
    
    return data as CategoryMappingDB | null
  }

  /**
   * Utwórz lub zaktualizuj mapowanie
   */
  static async upsertMapping(
    userId: string,
    original: string,
    normalized: string,
    isManual: boolean = false,
    analysisId?: string,
    similarityScore?: number
  ): Promise<CategoryMappingDB> {
    const mappingData = {
      user_id: userId,
      analysis_id: analysisId || null,
      original_category: original,
      normalized_category: normalized,
      is_manual: isManual,
      mapping_algorithm: isManual ? 'manual' : 'auto_fuzzy',
      confidence_score: isManual ? 1.0 : (similarityScore || 0.8),
      similarity_score: similarityScore || null,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await (supabase as any)
      .from('category_mappings')
      .upsert(mappingData, {
        onConflict: 'user_id,original_category'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to upsert mapping:', error)
      throw error
    }
    
    return data as CategoryMappingDB
  }

  /**
   * Usuń mapowanie
   */
  static async deleteMapping(mappingId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('category_mappings')
      .delete()
      .eq('id', mappingId)

    if (error) {
      console.error('Failed to delete mapping:', error)
      throw error
    }
  }

  /**
   * Auto-mapowanie kategorii dla analizy
   * Główna funkcja do inteligentnego mapowania
   */
  static async autoMapCategories(
    userId: string,
    analysisId: string,
    products: Product[]
  ): Promise<Map<string, string>> {
    console.log('🔄 Starting auto-mapping for analysis:', analysisId)
    
    // 1. Pobierz istniejące mapowania użytkownika
    const existingMappings = await this.getUserMappings(userId)
    const mappingMap = new Map<string, string>()

    // 2. Zbierz unikalne kategorie z produktów
    const categories = Array.from(
      new Set(products.map(p => p.kategoria).filter(Boolean))
    )

    console.log('📊 Found unique categories:', categories.length, categories)

    // 3. Pobierz już znormalizowane kategorie z istniejących mapowań
    const normalizedCategories = Array.from(
      new Set(existingMappings.map(m => m.normalized_category))
    )

    console.log('📋 Existing normalized categories:', normalizedCategories.length, normalizedCategories)

    // 4. Dla każdej kategorii znajdź lub utwórz mapowanie
    for (const category of categories) {
      // Sprawdź czy już jest mapowanie
      const existing = existingMappings.find(
        m => m.original_category === category
      )

      if (existing) {
        console.log(`✓ Using existing mapping: ${category} → ${existing.normalized_category}`)
        mappingMap.set(category, existing.normalized_category)
        continue
      }

      // Znormalizuj automatycznie
      const normalized = CategoryNormalizer.normalize(category)
      
      // Znajdź najbardziej podobną kategorię
      const bestMatch = CategoryNormalizer.findBestMatch(
        category,
        normalizedCategories,
        0.75 // threshold 75%
      )

      const finalNormalized = bestMatch?.normalized || normalized
      const similarityScore = bestMatch?.similarityScore

      console.log(`🆕 Creating new mapping: ${category} → ${finalNormalized}`, {
        method: bestMatch ? 'fuzzy_match' : 'normalize',
        similarity: similarityScore
      })

      // Zapisz mapowanie w bazie
      try {
        await this.upsertMapping(
          userId,
          category,
          finalNormalized,
          false, // nie jest ręczne
          analysisId,
          similarityScore
        )
      } catch (error) {
        console.error(`Failed to save mapping for ${category}:`, error)
      }

      mappingMap.set(category, finalNormalized)
      
      // Dodaj do listy znormalizowanych dla kolejnych iteracji
      if (!normalizedCategories.includes(finalNormalized)) {
        normalizedCategories.push(finalNormalized)
      }
    }

    console.log('✅ Auto-mapping completed:', mappingMap.size, 'mappings created')
    
    return mappingMap
  }

  /**
   * Zaktualizuj kategorie produktów w analizie
   */
  static async updateProductCategories(
    analysisId: string,
    categoryMap: Map<string, string>
  ): Promise<{ updated: number; errors: number }> {
    console.log('📝 Updating product categories in database...')
    
    let updated = 0
    let errors = 0

    for (const [original, normalized] of categoryMap) {
      if (original === normalized) {
        // Pomijamy jeśli kategoria już jest znormalizowana
        continue
      }

      try {
        const { error } = await supabase
          .from('products')
          .update({ category: normalized })
          .eq('analysis_id', analysisId)
          .eq('category', original)

        if (error) {
          console.error(`Failed to update category ${original} → ${normalized}:`, error)
          errors++
        } else {
          console.log(`✓ Updated: ${original} → ${normalized}`)
          updated++
        }
      } catch (error) {
        console.error(`Exception updating category ${original}:`, error)
        errors++
      }
    }

    console.log(`✅ Category update completed: ${updated} updated, ${errors} errors`)
    
    return { updated, errors }
  }

  /**
   * Pobierz statystyki mapowań użytkownika
   */
  static async getMappingStats(userId: string): Promise<{
    totalMappings: number
    uniqueOriginals: number
    uniqueNormalized: number
    manualMappings: number
    autoMappings: number
    avgConfidence: number
    recentMappings: CategoryMappingDB[]
  }> {
    const mappings = await this.getUserMappings(userId)
    
    const uniqueOriginals = new Set(mappings.map(m => m.original_category)).size
    const uniqueNormalized = new Set(mappings.map(m => m.normalized_category)).size
    const manualMappings = mappings.filter(m => m.is_manual).length
    const autoMappings = mappings.filter(m => !m.is_manual).length
    const avgConfidence = mappings.length > 0
      ? mappings.reduce((sum, m) => sum + m.confidence_score, 0) / mappings.length
      : 0
    
    return {
      totalMappings: mappings.length,
      uniqueOriginals,
      uniqueNormalized,
      manualMappings,
      autoMappings,
      avgConfidence,
      recentMappings: mappings.slice(0, 10)
    }
  }

  /**
   * Batch update - zaktualizuj wiele mapowań naraz
   */
  static async batchUpdateMappings(
    userId: string,
    mappings: Array<{ original: string; normalized: string; isManual?: boolean }>,
    analysisId?: string
  ): Promise<{ success: number; errors: number }> {
    let success = 0
    let errors = 0

    for (const mapping of mappings) {
      try {
        await this.upsertMapping(
          userId,
          mapping.original,
          mapping.normalized,
          mapping.isManual || false,
          analysisId
        )
        success++
      } catch (error) {
        console.error(`Failed to update mapping ${mapping.original}:`, error)
        errors++
      }
    }

    return { success, errors }
  }

  /**
   * Preview zmian przed zastosowaniem
   */
  static async previewAutoMapping(
    userId: string,
    products: Product[]
  ): Promise<Array<{
    original: string
    normalized: string
    action: 'existing' | 'new' | 'fuzzy_match'
    confidence: number
    productCount: number
  }>> {
    const existingMappings = await this.getUserMappings(userId)
    const categories = Array.from(
      new Set(products.map(p => p.kategoria).filter(Boolean))
    )
    
    const normalizedCategories = Array.from(
      new Set(existingMappings.map(m => m.normalized_category))
    )

    const preview = []
    
    for (const category of categories) {
      const productCount = products.filter(p => p.kategoria === category).length
      const existing = existingMappings.find(m => m.original_category === category)
      
      if (existing) {
        preview.push({
          original: category,
          normalized: existing.normalized_category,
          action: 'existing' as const,
          confidence: existing.confidence_score,
          productCount
        })
      } else {
        const normalized = CategoryNormalizer.normalize(category)
        const bestMatch = CategoryNormalizer.findBestMatch(
          category,
          normalizedCategories,
          0.75
        )
        
        preview.push({
          original: category,
          normalized: bestMatch?.normalized || normalized,
          action: bestMatch ? 'fuzzy_match' as const : 'new' as const,
          confidence: bestMatch?.confidence || 0.8,
          productCount
        })
      }
    }
    
    return preview.sort((a, b) => b.productCount - a.productCount)
  }
}

