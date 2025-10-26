import type { ProductRule, AppliedProductRule, ProductWarningLevel } from '../types/rules'

interface Product {
  nazwa: string
  kategoria: string
  description?: string
  [key: string]: any  // Inne pola produktu
}

interface ProductWithWarning {
  [key: string]: any
  warningLevel?: ProductWarningLevel
  appliedRules?: AppliedProductRule[]
}

class ProductWarningEngine {
  private static instance: ProductWarningEngine

  static getInstance(): ProductWarningEngine {
    if (!ProductWarningEngine.instance) {
      ProductWarningEngine.instance = new ProductWarningEngine()
    }
    return ProductWarningEngine.instance
  }

  // Priorytety poziomów ostrzeżeń
  private readonly priorityMap: Record<ProductWarningLevel, number> = {
    'LOW': 1,
    'MEDIUM': 2,
    'HIGH': 3
  }

  // Porównanie poziomów ostrzeżeń
  private compareLevels(level1: ProductWarningLevel, level2: ProductWarningLevel): ProductWarningLevel {
    return this.priorityMap[level1] >= this.priorityMap[level2] ? level1 : level2
  }

  // Dopasowanie kategorii (case-insensitive, dokładne)
  private matchesCategory(product: Product, ruleValue: string): boolean {
    return product.kategoria?.toLowerCase().trim() === ruleValue.toLowerCase().trim()
  }

  // Dopasowanie produktu (case-insensitive, dokładne)
  private matchesProduct(product: Product, ruleValue: string): boolean {
    return product.nazwa?.toLowerCase().trim() === ruleValue.toLowerCase().trim()
  }

  // Dopasowanie frazy (case-insensitive, częściowe)
  private matchesPhrase(product: Product, ruleValue: string): boolean {
    const phrase = ruleValue.toLowerCase().trim()
    const nameMatch = product.nazwa?.toLowerCase().includes(phrase) || false
    const descriptionMatch = product.description?.toLowerCase().includes(phrase) || false
    return nameMatch || descriptionMatch
  }

  // Sprawdzenie czy reguła pasuje do produktu
  private ruleMatchesProduct(product: Product, rule: ProductRule): boolean {
    if (!rule.isActive) {
      return false
    }

    switch (rule.ruleType) {
      case 'category':
        return this.matchesCategory(product, rule.ruleValue)
      case 'product':
        return this.matchesProduct(product, rule.ruleValue)
      case 'phrase':
        return this.matchesPhrase(product, rule.ruleValue)
      default:
        return false
    }
  }

  // Ocena pojedynczego produktu
  evaluateProduct(product: Product, rules: ProductRule[]): ProductWithWarning {
    const appliedRules: AppliedProductRule[] = []
    let highestLevel: ProductWarningLevel | undefined = undefined

    // Iteruj przez wszystkie reguły
    for (const rule of rules) {
      if (this.ruleMatchesProduct(product, rule)) {
        // Dodaj regułę do listy zastosowanych
        appliedRules.push({
          ruleId: rule.id,
          ruleType: rule.ruleType,
          ruleValue: rule.ruleValue,
          warningLevel: rule.warningLevel,
          description: rule.description
        })

        // Aktualizuj najwyższy poziom ostrzeżenia
        if (!highestLevel) {
          highestLevel = rule.warningLevel
        } else {
          highestLevel = this.compareLevels(highestLevel, rule.warningLevel)
        }
      }
    }

    // Zwróć produkt z informacją o ostrzeżeniu
    return {
      ...product,
      warningLevel: highestLevel,
      appliedRules: appliedRules.length > 0 ? appliedRules : undefined
    }
  }

  // Ocena listy produktów
  evaluateProducts(products: Product[], rules: ProductRule[]): ProductWithWarning[] {
    if (rules.length === 0) {
      // Jeśli brak reguł, zwróć produkty bez zmian
      return products
    }

    return products.map(product => this.evaluateProduct(product, rules))
  }

  // Pobranie koloru dla poziomu ostrzeżenia (Tailwind CSS classes)
  getWarningColor(warningLevel: ProductWarningLevel): { bg: string; text: string; icon: string } {
    switch (warningLevel) {
      case 'LOW':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          icon: 'text-yellow-600'
        }
      case 'MEDIUM':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-800',
          icon: 'text-orange-600'
        }
      case 'HIGH':
        return {
          bg: 'bg-red-50',
          text: 'text-red-800',
          icon: 'text-red-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        }
    }
  }

  // Pobranie nazwy poziomu ostrzeżenia
  getWarningLabel(warningLevel: ProductWarningLevel): string {
    switch (warningLevel) {
      case 'LOW':
        return 'Niski'
      case 'MEDIUM':
        return 'Średni'
      case 'HIGH':
        return 'Wysoki'
      default:
        return 'Nieznany'
    }
  }

  // Pobranie listy etykiet zastosowanych reguł
  getAppliedRulesLabels(appliedRules?: AppliedProductRule[]): string[] {
    if (!appliedRules || appliedRules.length === 0) {
      return []
    }

    return appliedRules.map(rule => {
      const typeLabel = rule.ruleType === 'category' ? 'Kategoria' : 
                       rule.ruleType === 'product' ? 'Produkt' : 'Fraza'
      const levelLabel = this.getWarningLabel(rule.warningLevel)
      return `${typeLabel}: ${rule.ruleValue} (${levelLabel})`
    })
  }
}

export const productWarningEngine = ProductWarningEngine.getInstance()

