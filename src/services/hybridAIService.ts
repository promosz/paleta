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
    // Cloud AI Configuration (Primary)
    this.configs.push({
      type: 'cloud',
      url: 'https://api.pallet-analysis.com/v1',
      priority: 1,
      enabled: true
    })

    // Browser AI Configuration (Fallback)
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
      .filter(config => config.enabled && this.status[config.type] === 'online')
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
  private mockNormalizeProduct(productName: string, description: string): AIAnalysisResult {
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
