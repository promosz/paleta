import type { 
  Rule, 
  ProductEvaluation, 
  AppliedRule, 
  Recommendation,
  RulesEngineConfig,
  EvaluationProgressCallback
} from '../types/rules'
import type { ParsedProduct } from '../types/parser'

// Domyślna konfiguracja silnika reguł
const defaultConfig: RulesEngineConfig = {
  defaultScore: 50,
  maxScore: 100,
  minScore: 0,
  blockThreshold: 0,
  warningThreshold: 30
}

// Klasa silnika reguł
export class RulesEngine {
  private config: RulesEngineConfig

  constructor(config: Partial<RulesEngineConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // Główna metoda oceny produktów
  async evaluateProducts(
    products: ParsedProduct[],
    rules: Rule[],
    onProgress?: EvaluationProgressCallback
  ): Promise<ProductEvaluation[]> {
    const activeRules = rules.filter(rule => rule.status === 'active')
    const evaluations: ProductEvaluation[] = []

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const progress = Math.round((i / products.length) * 100)
      
      onProgress?.(progress, `Ocenianie produktu: ${product.name}`)
      
      const evaluation = this.evaluateProduct(product, activeRules)
      evaluations.push(evaluation)
    }

    onProgress?.(100, 'Ocena zakończona')
    return evaluations
  }

  // Ocena pojedynczego produktu
  evaluateProduct(product: ParsedProduct, rules: Rule[]): ProductEvaluation {
    let score = this.config.defaultScore
    const appliedRules: AppliedRule[] = []
    const recommendations: string[] = []
    const warnings: string[] = []
    const blocks: string[] = []

    // Aplikowanie reguł
    rules.forEach(rule => {
      const result = this.applyRule(rule, product)
      if (result.matched) {
        appliedRules.push(result)
        
        // Aktualizacja oceny na podstawie akcji reguły
        switch (rule.action) {
          case 'prefer':
            score += this.calculateBonus(result.score, rule.weight)
            recommendations.push(result.reason)
            break
          case 'warn':
            score -= this.calculatePenalty(result.score, rule.weight)
            warnings.push(result.reason)
            break
          case 'block':
            score = this.config.blockThreshold
            blocks.push(result.reason)
            break
        }
      }
    })

    // Ograniczenie oceny do zakresu
    score = Math.max(this.config.minScore, Math.min(this.config.maxScore, score))

    // Określenie statusu
    let status: 'ok' | 'warning' | 'blocked' = 'ok'
    if (blocks.length > 0) {
      status = 'blocked'
    } else if (warnings.length > 0 || score < this.config.warningThreshold) {
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
  }

  // Aplikowanie reguły do produktu
  private applyRule(rule: Rule, product: ParsedProduct): AppliedRule {
    let matched = false
    let reason = ''
    let score = 0

    switch (rule.type) {
      case 'budget':
        const budgetResult = this.evaluateBudgetRule(rule, product)
        matched = budgetResult.matched
        reason = budgetResult.reason
        score = budgetResult.score
        break

      case 'category':
        const categoryResult = this.evaluateCategoryRule(rule, product)
        matched = categoryResult.matched
        reason = categoryResult.reason
        score = categoryResult.score
        break

      case 'quality':
        const qualityResult = this.evaluateQualityRule(rule, product)
        matched = qualityResult.matched
        reason = qualityResult.reason
        score = qualityResult.score
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

  // Ocena reguły budżetowej
  private evaluateBudgetRule(rule: Rule, product: ParsedProduct) {
    const conditions = rule.conditions as any
    let matched = false
    let reason = ''
    let score = 0

    // Sprawdzanie maksymalnej ceny
    if (product.price && conditions.maxPrice) {
      if (product.price > conditions.maxPrice) {
        matched = true
        const excess = product.price - conditions.maxPrice
        reason = `Cena ${product.price} PLN przekracza limit ${conditions.maxPrice} PLN (o ${excess} PLN)`
        score = Math.min(50, excess / 10)
      }
    }

    // Sprawdzanie maksymalnej ceny za sztukę
    if (product.price && product.quantity && conditions.maxPricePerUnit) {
      const pricePerUnit = product.price / product.quantity
      if (pricePerUnit > conditions.maxPricePerUnit) {
        matched = true
        const excess = pricePerUnit - conditions.maxPricePerUnit
        reason = `Cena za sztukę ${pricePerUnit.toFixed(2)} PLN przekracza limit ${conditions.maxPricePerUnit} PLN`
        score = Math.min(50, excess * 2)
      }
    }

    return { matched, reason, score }
  }

  // Ocena reguły kategorii
  private evaluateCategoryRule(rule: Rule, product: ParsedProduct) {
    const conditions = rule.conditions as any
    let matched = false
    let reason = ''
    let score = 0

    if (product.category) {
      const categoryLower = product.category.toLowerCase()
      const caseSensitive = conditions.caseSensitive || false

      // Sprawdzanie blacklist
      if (conditions.blacklist && conditions.blacklist.length > 0) {
        const blacklist = caseSensitive 
          ? conditions.blacklist 
          : conditions.blacklist.map((cat: string) => cat.toLowerCase())
        
        const foundCategory = blacklist.find((cat: string) => 
          caseSensitive 
            ? product.category?.includes(cat)
            : categoryLower.includes(cat)
        )

        if (foundCategory) {
          matched = true
          reason = `Kategoria "${product.category}" jest na liście zakazanych`
          score = 30
        }
      }

      // Sprawdzanie whitelist
      if (conditions.whitelist && conditions.whitelist.length > 0) {
        const whitelist = caseSensitive 
          ? conditions.whitelist 
          : conditions.whitelist.map((cat: string) => cat.toLowerCase())
        
        const foundCategory = whitelist.find((cat: string) => 
          caseSensitive 
            ? product.category?.includes(cat)
            : categoryLower.includes(cat)
        )

        if (foundCategory) {
          matched = true
          reason = `Kategoria "${product.category}" jest na liście preferowanych`
          score = -20 // Bonus
        }
      }

      // Sprawdzanie warning list
      if (conditions.warningList && conditions.warningList.length > 0) {
        const warningList = caseSensitive 
          ? conditions.warningList 
          : conditions.warningList.map((cat: string) => cat.toLowerCase())
        
        const foundCategory = warningList.find((cat: string) => 
          caseSensitive 
            ? product.category?.includes(cat)
            : categoryLower.includes(cat)
        )

        if (foundCategory) {
          matched = true
          reason = `Kategoria "${product.category}" jest na liście ostrzegających`
          score = 15
        }
      }
    }

    return { matched, reason, score }
  }

  // Ocena reguły jakościowej
  private evaluateQualityRule(rule: Rule, product: ParsedProduct) {
    const conditions = rule.conditions as any
    let matched = false
    let reason = ''
    let score = 0

    // Sprawdzanie minimalnej oceny (symulacja)
    if (conditions.minRating) {
      // W rzeczywistej aplikacji tutaj byłaby prawdziwa ocena produktu
      const simulatedRating = Math.random() * 5
      if (simulatedRating < conditions.minRating) {
        matched = true
        reason = `Ocena produktu ${simulatedRating.toFixed(1)} jest poniżej wymaganej ${conditions.minRating}`
        score = (conditions.minRating - simulatedRating) * 10
      }
    }

    // Sprawdzanie minimalnej liczby opinii (symulacja)
    if (conditions.minReviews) {
      const simulatedReviews = Math.floor(Math.random() * 100)
      if (simulatedReviews < conditions.minReviews) {
        matched = true
        reason = `Liczba opinii ${simulatedReviews} jest poniżej wymaganej ${conditions.minReviews}`
        score = (conditions.minReviews - simulatedReviews) / 2
      }
    }

    // Sprawdzanie wymaganych certyfikatów
    if (conditions.requiredCertifications && conditions.requiredCertifications.length > 0) {
      // Symulacja - w rzeczywistej aplikacji sprawdzalibyśmy prawdziwe certyfikaty
      const hasCertification = Math.random() > 0.7
      if (!hasCertification) {
        matched = true
        reason = `Brak wymaganych certyfikatów: ${conditions.requiredCertifications.join(', ')}`
        score = 25
      }
    }

    // Sprawdzanie preferowanych marek
    if (conditions.requiredBrands && conditions.requiredBrands.length > 0) {
      if (product.brand) {
        const brandLower = product.brand.toLowerCase()
        const requiredBrandsLower = conditions.requiredBrands.map((brand: string) => brand.toLowerCase())
        const isPreferredBrand = requiredBrandsLower.some((brand: string) => 
          brandLower.includes(brand)
        )

        if (isPreferredBrand) {
          matched = true
          reason = `Marka "${product.brand}" jest na liście preferowanych`
          score = -15 // Bonus
        }
      }
    }

    return { matched, reason, score }
  }

  // Obliczanie bonusu
  private calculateBonus(score: number, weight: number): number {
    return (score * weight) / 10
  }

  // Obliczanie kary
  private calculatePenalty(score: number, weight: number): number {
    return (score * weight) / 10
  }

  // Generowanie rekomendacji
  generateRecommendations(evaluation: ProductEvaluation): Recommendation[] {
    const recommendations: Recommendation[] = []

    // Rekomendacje na podstawie statusu
    if (evaluation.status === 'blocked') {
      recommendations.push({
        type: 'action',
        title: 'Produkt zablokowany',
        description: 'Ten produkt nie spełnia wymagań i został zablokowany',
        priority: 'high',
        action: 'Usuń produkt z zestawu'
      })
    } else if (evaluation.status === 'warning') {
      recommendations.push({
        type: 'warning',
        title: 'Produkt z ostrzeżeniem',
        description: 'Ten produkt ma pewne problemy, rozważ alternatywy',
        priority: 'medium',
        action: 'Przejrzyj szczegóły ostrzeżeń'
      })
    } else if (evaluation.score > 80) {
      recommendations.push({
        type: 'action',
        title: 'Produkt rekomendowany',
        description: 'Ten produkt spełnia wszystkie wymagania',
        priority: 'low',
        action: 'Dodaj do zestawu'
      })
    }

    // Rekomendacje na podstawie zastosowanych reguł
    evaluation.appliedRules.forEach(appliedRule => {
      if (appliedRule.action === 'prefer') {
        recommendations.push({
          type: 'info',
          title: 'Preferencja',
          description: appliedRule.reason,
          priority: 'low'
        })
      } else if (appliedRule.action === 'warn') {
        recommendations.push({
          type: 'warning',
          title: 'Ostrzeżenie',
          description: appliedRule.reason,
          priority: 'medium'
        })
      }
    })

    return recommendations
  }

  // Aktualizacja konfiguracji
  updateConfig(newConfig: Partial<RulesEngineConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Pobieranie aktualnej konfiguracji
  getConfig(): RulesEngineConfig {
    return { ...this.config }
  }
}

// Eksport domyślnej instancji
export const rulesEngine = new RulesEngine()
