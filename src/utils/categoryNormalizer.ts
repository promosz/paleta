/**
 * Category Normalizer - Inteligentna normalizacja nazw kategorii
 * 
 * Funkcjonalności:
 * - Usuwanie prefiksów (gl_, cat_, kategoria_)
 * - Normalizacja wielkości liter
 * - Fuzzy matching (Levenshtein distance)
 * - Automatyczne mapowanie podobnych kategorii
 */

export interface CategoryMapping {
  original: string
  normalized: string
  confidence: number
  method: 'exact' | 'prefix' | 'fuzzy' | 'manual'
  similarityScore?: number
}

export class CategoryNormalizer {
  // Regex patterns dla prefiksów do usunięcia
  private static PREFIX_PATTERNS = [
    /^gl_/i,           // gl_pc → pc
    /^cat_/i,          // cat_kitchen → kitchen
    /^kategoria_/i,    // kategoria_agd → agd
    /^category_/i,     // category_home → home
    /^kat_/i,          // kat_garden → garden
  ]

  /**
   * Normalizuje nazwę kategorii
   * Przykłady:
   *  - "gl_pc" → "PC"
   *  - "GL_KITCHEN" → "KITCHEN"
   *  - "kategoria_AGD" → "AGD"
   *  - "  home & garden  " → "HOME_GARDEN"
   */
  static normalize(category: string): string {
    if (!category || category.trim() === '') return 'INNE'
    
    let normalized = category.trim()
    
    // 1. Usuń prefiksy (gl_, cat_, etc.)
    for (const pattern of this.PREFIX_PATTERNS) {
      normalized = normalized.replace(pattern, '')
    }
    
    // 2. Uppercase dla spójności
    normalized = normalized.toUpperCase()
    
    // 3. Zamień znaki specjalne i spacje na podkreślenia
    normalized = normalized.replace(/[^A-Z0-9]+/g, '_')
    
    // 4. Usuń podwójne podkreślenia
    normalized = normalized.replace(/_+/g, '_')
    
    // 5. Usuń podkreślenia z początku/końca
    normalized = normalized.replace(/^_|_$/g, '')
    
    return normalized || 'INNE'
  }

  /**
   * Oblicza podobieństwo między dwoma stringami używając Levenshtein distance
   * Zwraca wartość 0-1, gdzie 1 = identyczne
   */
  static similarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase()
    const s2 = str2.toLowerCase()
    
    if (s1 === s2) return 1.0
    
    const len1 = s1.length
    const len2 = s2.length
    
    if (len1 === 0) return len2 === 0 ? 1.0 : 0.0
    if (len2 === 0) return 0.0
    
    const matrix: number[][] = []

    // Inicjalizacja macierzy
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j
    }

    // Obliczanie odległości Levenshtein
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        )
      }
    }

    const distance = matrix[len1][len2]
    const maxLen = Math.max(len1, len2)
    
    return 1 - (distance / maxLen)
  }

  /**
   * Znajdź najbardziej podobną kategorię z listy kandydatów
   */
  static findBestMatch(
    target: string, 
    candidates: string[], 
    threshold: number = 0.7
  ): CategoryMapping | null {
    if (!target || candidates.length === 0) return null
    
    const normalized = this.normalize(target)
    
    let bestMatch: CategoryMapping | null = null
    let bestScore = 0

    for (const candidate of candidates) {
      const candNormalized = this.normalize(candidate)
      
      // Exact match po normalizacji
      if (normalized === candNormalized) {
        return {
          original: target,
          normalized: candNormalized,
          confidence: 1.0,
          method: 'exact',
          similarityScore: 1.0
        }
      }
      
      // Fuzzy match
      const score = this.similarity(normalized, candNormalized)
      if (score > bestScore && score >= threshold) {
        bestScore = score
        bestMatch = {
          original: target,
          normalized: candNormalized,
          confidence: score,
          method: 'fuzzy',
          similarityScore: score
        }
      }
    }

    return bestMatch
  }

  /**
   * Grupuje podobne kategorie razem
   * Zwraca mapę: oryginalna → znormalizowana
   */
  static groupSimilarCategories(
    categories: string[],
    threshold: number = 0.75
  ): Map<string, string> {
    const groupMap = new Map<string, string>()
    const processedNormalized = new Set<string>()
    
    // Sortuj kategorie alfabetycznie dla spójności
    const sortedCategories = [...categories].sort()
    
    for (const category of sortedCategories) {
      if (!category) continue
      
      const normalized = this.normalize(category)
      
      // Sprawdź czy już mamy podobną znormalizowaną kategorię
      const existingNormalized = Array.from(processedNormalized)
      const bestMatch = this.findBestMatch(category, existingNormalized, threshold)
      
      if (bestMatch) {
        // Znaleziono podobną - użyj jej
        groupMap.set(category, bestMatch.normalized)
      } else {
        // Nowa unikalna kategoria
        groupMap.set(category, normalized)
        processedNormalized.add(normalized)
      }
    }
    
    return groupMap
  }

  /**
   * Statystyki kategorii
   */
  static getCategoryStats(categories: string[]): {
    total: number
    unique: number
    normalized: number
    duplicates: number
    groupings: Array<{ normalized: string; originals: string[]; count: number }>
  } {
    const groupMap = this.groupSimilarCategories(categories)
    const uniqueOriginals = new Set(categories.filter(Boolean)).size
    const normalizedGroups = new Map<string, string[]>()
    
    // Grupuj oryginały według znormalizowanych
    for (const [original, normalized] of groupMap) {
      if (!normalizedGroups.has(normalized)) {
        normalizedGroups.set(normalized, [])
      }
      normalizedGroups.get(normalized)!.push(original)
    }
    
    const groupings = Array.from(normalizedGroups.entries()).map(([normalized, originals]) => ({
      normalized,
      originals,
      count: originals.length
    })).sort((a, b) => b.count - a.count)
    
    return {
      total: categories.length,
      unique: uniqueOriginals,
      normalized: normalizedGroups.size,
      duplicates: uniqueOriginals - normalizedGroups.size,
      groupings
    }
  }

  /**
   * Preview zmian przed zastosowaniem
   */
  static previewNormalization(categories: string[]): Array<{
    original: string
    normalized: string
    action: 'keep' | 'merge' | 'rename'
  }> {
    const groupMap = this.groupSimilarCategories(categories)
    const uniqueCategories = Array.from(new Set(categories.filter(Boolean)))
    
    return uniqueCategories.map(original => {
      const normalized = groupMap.get(original) || this.normalize(original)
      const action = original === normalized ? 'keep' :
                    this.normalize(original) === normalized ? 'rename' :
                    'merge'
      
      return { original, normalized, action }
    })
  }
}

