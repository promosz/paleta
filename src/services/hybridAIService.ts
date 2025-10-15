import { AIAnalysisResult, PaletteAnalysisResult } from './aiService'

export type AIServiceType = 'cloud' | 'browser' | 'docker' | 'none'
export type AIServiceStatus = 'online' | 'offline' | 'checking' | 'error'

export interface AIServiceConfig {
  type: AIServiceType
  url?: string
  apiKey?: string
  priority: number
  enabled: boolean
}

export interface HybridAIStatus {
  cloud: AIServiceStatus
  browser: AIServiceStatus
  docker: AIServiceStatus
  active: AIServiceType
  lastChecked: string
}

export class HybridAIService {
  private static instance: HybridAIService
  private configs: AIServiceConfig[] = []
  private currentService: AIServiceType = 'none'
  private status: HybridAIStatus = {
    cloud: 'checking',
    browser: 'checking', 
    docker: 'checking',
    active: 'none',
    lastChecked: new Date().toISOString()
  }

  constructor() {
    this.initializeConfigs()
  }

  static getInstance(): HybridAIService {
    if (!HybridAIService.instance) {
      HybridAIService.instance = new HybridAIService()
    }
    return HybridAIService.instance
  }

  private initializeConfigs(): void {
    // Cloud AI Configuration (Disabled - nieistniejące API)
    this.configs.push({
      type: 'cloud',
      url: 'https://api.pallet-analysis.com/v1',
      priority: 1,
      enabled: false  // Wyłączone - API nie istnieje
    })

    // Browser AI Configuration (Primary - lokalne)
    this.configs.push({
      type: 'browser',
      priority: 2,
      enabled: true
    })

    // Docker AI Configuration (Advanced)
    this.configs.push({
      type: 'docker',
      url: 'http://localhost:8000',
      priority: 3,
      enabled: false
    })

    // Load user preferences
    this.loadUserPreferences()
  }

  private loadUserPreferences(): void {
    const saved = localStorage.getItem('ai-service-preferences')
    if (saved) {
      try {
        const preferences = JSON.parse(saved)
        this.currentService = preferences.activeService || 'none'
        
        // Update configs with user preferences
        this.configs.forEach(config => {
          const userConfig = preferences.configs?.[config.type]
          if (userConfig) {
            Object.assign(config, userConfig)
          }
        })
      } catch (error) {
        console.error('Failed to load AI preferences:', error)
      }
    }
  }

  private saveUserPreferences(): void {
    const preferences = {
      activeService: this.currentService,
      configs: this.configs.reduce((acc, config) => {
        acc[config.type] = config
        return acc
      }, {} as Record<string, AIServiceConfig>)
    }
    localStorage.setItem('ai-service-preferences', JSON.stringify(preferences))
  }

  async checkAllServices(): Promise<HybridAIStatus> {
    const checks = await Promise.allSettled([
      this.checkCloudService(),
      this.checkBrowserService(),
      this.checkDockerService()
    ])

    this.status.cloud = checks[0].status === 'fulfilled' ? 'online' : 'offline'
    this.status.browser = checks[1].status === 'fulfilled' ? 'online' : 'offline'
    this.status.docker = checks[2].status === 'fulfilled' ? 'online' : 'offline'
    this.status.lastChecked = new Date().toISOString()

    // Auto-select best available service
    this.autoSelectService()

    return { ...this.status }
  }

  private async checkCloudService(): Promise<boolean> {
    try {
      const response = await fetch('https://api.pallet-analysis.com/v1/health', {
        method: 'GET',
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  private async checkBrowserService(): Promise<boolean> {
    try {
      // Check if WebAssembly AI is available
      return typeof WebAssembly !== 'undefined' && 
             localStorage.getItem('browser-ai-model') !== null
    } catch (error) {
      return false
    }
  }

  private async checkDockerService(): Promise<boolean> {
    try {
      const dockerUrl = this.configs.find(c => c.type === 'docker')?.url || 'http://localhost:8000'
      const response = await fetch(`${dockerUrl}/health`, {
        method: 'GET',
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  private autoSelectService(): void {
    const availableServices = this.configs
      .filter(config => config.enabled && config.type !== 'none' && this.status[config.type] === 'online')
      .sort((a, b) => a.priority - b.priority)

    if (availableServices.length > 0) {
      this.currentService = availableServices[0].type
    } else {
      this.currentService = 'none'
    }
    this.status.active = this.currentService as any
  }

  async normalizeProduct(productName: string, _description: string = ''): Promise<AIAnalysisResult> {
    switch (this.currentService) {
      case 'cloud':
        return this.cloudNormalizeProduct(productName, _description)
      case 'browser':
        return this.browserNormalizeProduct(productName, _description)
      case 'docker':
        return this.dockerNormalizeProduct(productName, _description)
      default:
        return this.mockNormalizeProduct(productName, _description)
    }
  }

  async analyzePalette(_products: string[]): Promise<PaletteAnalysisResult> {
    switch (this.currentService) {
      case 'cloud':
        return this.cloudAnalyzePalette(_products)
      case 'browser':
        return this.browserAnalyzePalette(_products)
      case 'docker':
        return this.dockerAnalyzePalette(_products)
      default:
        return this.mockAnalyzePalette(_products)
    }
  }

  async generatePaletteReport(products: any[]): Promise<{
    summary: string
    productAnalysis: string
    recommendations: string
    buyDecision: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'CAUTION' | 'AVOID'
    confidenceScore: number
  }> {
    switch (this.currentService) {
      case 'cloud':
        return this.cloudGeneratePaletteReport(products)
      case 'browser':
        return this.browserGeneratePaletteReport(products)
      case 'docker':
        return this.dockerGeneratePaletteReport(products)
      default:
        return this.mockGeneratePaletteReport(products)
    }
  }

  // Cloud AI Implementation
  private async cloudNormalizeProduct(productName: string, description: string): Promise<AIAnalysisResult> {
    const config = this.configs.find(c => c.type === 'cloud')
    const response = await fetch(`${config?.url}/ai/normalize-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config?.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      body: JSON.stringify({ product_name: productName, description })
    })

    if (!response.ok) {
      throw new Error(`Cloud AI error: ${response.statusText}`)
    }

    return await response.json()
  }

  private async cloudAnalyzePalette(products: string[]): Promise<PaletteAnalysisResult> {
    const config = this.configs.find(c => c.type === 'cloud')
    const response = await fetch(`${config?.url}/ai/analyze-palette`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config?.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      body: JSON.stringify({ products })
    })

    if (!response.ok) {
      throw new Error(`Cloud AI error: ${response.statusText}`)
    }

    return await response.json()
  }

  // Browser AI Implementation (WebAssembly)
  private async browserNormalizeProduct(productName: string, description: string): Promise<AIAnalysisResult> {
    // TODO: Implement WebAssembly AI model
    console.log('Browser AI: Normalizing product', productName)
    
    // For now, return mock data
    return this.mockNormalizeProduct(productName, description)
  }

  private async browserAnalyzePalette(products: string[]): Promise<PaletteAnalysisResult> {
    // TODO: Implement WebAssembly AI model
    console.log('Browser AI: Analyzing palette', products.length, 'products')
    
    // For now, return mock data
    return this.mockAnalyzePalette(products)
  }

  // Docker AI Implementation (Existing)
  private async dockerNormalizeProduct(productName: string, description: string): Promise<AIAnalysisResult> {
    const config = this.configs.find(c => c.type === 'docker')
    const response = await fetch(`${config?.url}/ai/normalize-product`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_name: productName, description })
    })

    if (!response.ok) {
      throw new Error(`Docker AI error: ${response.statusText}`)
    }

    return await response.json()
  }

  private async dockerAnalyzePalette(products: string[]): Promise<PaletteAnalysisResult> {
    const config = this.configs.find(c => c.type === 'docker')
    const response = await fetch(`${config?.url}/ai/analyze-palette`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    })

    if (!response.ok) {
      throw new Error(`Docker AI error: ${response.statusText}`)
    }

    return await response.json()
  }

  // Mock implementations for fallback
  private mockNormalizeProduct(productName: string, _description: string): AIAnalysisResult {
    return {
      original_name: productName,
      normalized_name: productName,
      brand: 'Unknown',
      model: 'Unknown',
      category: 'Unknown',
      specifications: {},
      confidence: 0.5,
      processed_text: productName,
      profitability_score: 50,
      risk_level: 'MEDIUM',
      recommendation: 'CAUTION'
    }
  }

  private mockAnalyzePalette(products: string[]): PaletteAnalysisResult {
    return {
      average_profitability: 60,
      high_risk_count: 2,
      medium_risk_count: 3,
      low_risk_count: 5,
      recommended_categories: ['Electronics', 'Tools'],
      buy_recommendation: 'CAUTION',
      risk_assessment: 'MEDIUM',
      estimated_roi: 15.5,
      category_distribution: {},
      total_products: products.length,
      profitability_distribution: {}
    }
  }

  // Cloud report generation
  private async cloudGeneratePaletteReport(products: any[]): Promise<any> {
    const config = this.configs.find(c => c.type === 'cloud')
    const response = await fetch(`${config?.url}/ai/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config?.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      },
      body: JSON.stringify({ products })
    })

    if (!response.ok) {
      return this.mockGeneratePaletteReport(products)
    }

    return await response.json()
  }

  // Browser report generation
  private async browserGeneratePaletteReport(products: any[]): Promise<any> {
    return this.mockGeneratePaletteReport(products)
  }

  // Docker report generation
  private async dockerGeneratePaletteReport(products: any[]): Promise<any> {
    const config = this.configs.find(c => c.type === 'docker')
    const response = await fetch(`${config?.url}/ai/generate-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products })
    })

    if (!response.ok) {
      return this.mockGeneratePaletteReport(products)
    }

    return await response.json()
  }

  // Mock report generation
  private mockGeneratePaletteReport(products: any[]): {
    summary: string
    productAnalysis: string
    recommendations: string
    buyDecision: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'CAUTION' | 'AVOID'
    confidenceScore: number
  } {
    const totalProducts = products.length
    const avgProfitability = products.reduce((sum, p) => sum + (p.rentownosc || 0), 0) / totalProducts
    const totalValue = products.reduce((sum, p) => sum + (p.cenaRegularnaBrutto || 0), 0)
    const categories = [...new Set(products.map(p => p.kategoria))].filter(c => c && c !== 'Brak kategorii')
    
    const highProfitCount = products.filter(p => p.rentownosc >= 80).length
    const mediumProfitCount = products.filter(p => p.rentownosc >= 60 && p.rentownosc < 80).length
    const lowProfitCount = products.filter(p => p.rentownosc < 60).length

    let buyDecision: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'CAUTION' | 'AVOID' = 'HOLD'
    if (avgProfitability >= 80) buyDecision = 'STRONG_BUY'
    else if (avgProfitability >= 70) buyDecision = 'BUY'
    else if (avgProfitability >= 60) buyDecision = 'HOLD'
    else if (avgProfitability >= 50) buyDecision = 'CAUTION'
    else buyDecision = 'AVOID'

    const summary = `
Zestawienie zawiera ${totalProducts} ${totalProducts === 1 ? 'produkt' : totalProducts < 5 ? 'produkty' : 'produktów'} o łącznej wartości ${totalValue.toLocaleString('pl-PL')} PLN. 
Średnia rentowność zestawienia wynosi ${avgProfitability.toFixed(1)}%, co wskazuje na ${avgProfitability >= 70 ? 'bardzo dobry' : avgProfitability >= 60 ? 'dobry' : avgProfitability >= 50 ? 'przeciętny' : 'słaby'} potencjał zyskowności.

Produkty pochodzą z ${categories.length} ${categories.length === 1 ? 'kategorii' : 'kategorii'}: ${categories.slice(0, 3).join(', ')}${categories.length > 3 ? ' i inne' : ''}.
    `.trim()

    const productAnalysis = `
**Analiza produktów według rentowności:**

• **Wysoka rentowność (≥80%):** ${highProfitCount} ${highProfitCount === 1 ? 'produkt' : 'produktów'}
  ${highProfitCount > 0 ? `Te produkty stanowią mocną podstawę zestawienia i powinny generować stabilne zyski.` : 'Brak produktów w tej kategorii może ograniczać potencjał zyskowności.'}

• **Średnia rentowność (60-79%):** ${mediumProfitCount} ${mediumProfitCount === 1 ? 'produkt' : 'produktów'}
  ${mediumProfitCount > 0 ? `Produkty o akceptowalnej marży, które mogą wspierać ogólną rentowność palety.` : 'Brak produktów w tej kategorii.'}

• **Niska rentowność (<60%):** ${lowProfitCount} ${lowProfitCount === 1 ? 'produkt' : 'produktów'}
  ${lowProfitCount > 0 ? `⚠️ Produkty wymagające szczególnej uwagi - mogą obniżać ogólną rentowność zestawienia.` : '✅ Bardzo dobry wynik - brak produktów o niskiej rentowności.'}

**Główne kategorie produktów:**
${categories.slice(0, 5).map((cat, idx) => {
  const catProducts = products.filter(p => p.kategoria === cat)
  const catAvgProfit = catProducts.reduce((sum, p) => sum + (p.rentownosc || 0), 0) / catProducts.length
  return `${idx + 1}. ${cat}: ${catProducts.length} ${catProducts.length === 1 ? 'produkt' : 'produktów'} (śr. rentowność: ${catAvgProfit.toFixed(1)}%)`
}).join('\n')}
    `.trim()

    const recommendations = `
**Rekomendacja zakupu: ${buyDecision === 'STRONG_BUY' ? '🟢 ZDECYDOWANIE KUP' : buyDecision === 'BUY' ? '🟢 KUP' : buyDecision === 'HOLD' ? '🟡 ROZWAŻ' : buyDecision === 'CAUTION' ? '🟠 OSTROŻNIE' : '🔴 UNIKAJ'}**

${buyDecision === 'STRONG_BUY' ? `
✅ Zestawienie wykazuje doskonałą rentowność powyżej 80%. To bardzo atrakcyjna oferta z wysokim potencjałem zysku.

**Zalecenia:**
• Priorytetowo rozważ zakup tego zestawienia
• Rentowność znacznie przewyższa średnie wartości rynkowe
• Niska ekspozycja na produkty o niskiej marży minimalizuje ryzyko
` : ''}${buyDecision === 'BUY' ? `
✅ Zestawienie oferuje dobrą rentowność w przedziale 70-80%. Atrakcyjna oferta warta zakupu.

**Zalecenia:**
• Zestawienie powinno generować stabilne zyski
• Rozważ negocjację ceny dla zwiększenia marży
• Sprawdź konkurencyjność produktów na rynku
` : ''}${buyDecision === 'HOLD' ? `
⚠️ Zestawienie oferuje przeciętną rentowność 60-70%. Wymaga dokładniejszej analizy.

**Zalecenia:**
• Dokładnie przeanalizuj produkty o niskiej rentowności
• Sprawdź możliwość negocjacji ceny zakupu
• Rozważ sprzedaż wybranych produktów po wyższych cenach
• Oceń popyt na produkty przed podjęciem decyzji
` : ''}${buyDecision === 'CAUTION' ? `
⚠️ Zestawienie wykazuje rentowność poniżej 60%. Wysoki poziom ryzyka.

**Ostrzeżenia:**
• Znaczna liczba produktów o niskiej marży
• Możliwe problemy z osiągnięciem zakładanych zysków
• Wymagana szczegółowa analiza kosztów dodatkowych
• Rozważ negocjację znacznie niższej ceny zakupu
` : ''}${buyDecision === 'AVOID' ? `
🔴 Zestawienie wykazuje niską rentowność poniżej 50%. Wysokie ryzyko straty.

**Ostrzeżenia:**
• Większość produktów ma niską marżę zysku
• Duże ryzyko generowania strat zamiast zysków
• NIE ZALECAMY zakupu bez znacznej obniżki ceny
• Poszukaj alternatywnych zestawień o lepszej rentowności
` : ''}

**Dodatkowe wskazówki:**
• ${lowProfitCount === 0 ? '✅ Brak produktów problematycznych' : `⚠️ Szczególną uwagę zwróć na ${lowProfitCount} ${lowProfitCount === 1 ? 'produkt' : 'produktów'} o niskiej rentowności`}
• ${categories.length > 3 ? '✅ Dobra dywersyfikacja kategorii produktowych' : '⚠️ Ograniczona dywersyfikacja - wyższe ryzyko'}
• Przed zakupem zweryfikuj aktualne ceny rynkowe i popyt na kluczowe produkty
    `.trim()

    return {
      summary,
      productAnalysis,
      recommendations,
      buyDecision,
      confidenceScore: avgProfitability >= 70 ? 85 : avgProfitability >= 60 ? 70 : avgProfitability >= 50 ? 55 : 40
    }
  }

  // Configuration methods
  setActiveService(service: AIServiceType): void {
    this.currentService = service
    this.status.active = service
    this.saveUserPreferences()
  }

  updateConfig(type: AIServiceType, config: Partial<AIServiceConfig>): void {
    const existingConfig = this.configs.find(c => c.type === type)
    if (existingConfig) {
      Object.assign(existingConfig, config)
      this.saveUserPreferences()
    }
  }

  getConfig(type: AIServiceType): AIServiceConfig | undefined {
    return this.configs.find(c => c.type === type)
  }

  getAllConfigs(): AIServiceConfig[] {
    return [...this.configs]
  }

  getStatus(): HybridAIStatus {
    return { ...this.status }
  }

  getCurrentService(): AIServiceType {
    return this.currentService
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    const status = await this.checkAllServices()
    return status.active !== 'none'
  }
}

export const hybridAIService = HybridAIService.getInstance()
