// AI Service for integrating with backend AI services
export interface AIAnalysisResult {
  original_name: string
  normalized_name: string
  brand: string
  model: string
  category: string
  specifications: Record<string, string>
  confidence: number
  processed_text: string
  profitability_score?: number
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH'
  recommendation?: 'YES' | 'CAUTION' | 'NO'
}

export interface PaletteAnalysisResult {
  average_profitability: number
  high_risk_count: number
  medium_risk_count: number
  low_risk_count: number
  recommended_categories: string[]
  buy_recommendation: 'YES' | 'CAUTION' | 'NO'
  risk_assessment: 'LOW' | 'MEDIUM' | 'HIGH'
  estimated_roi: number
  category_distribution: Record<string, any>
  total_products: number
  profitability_distribution: Record<string, number>
}

export interface CacheStats {
  cache_stats: {
    total_entries: number
    expired_entries: number
    active_entries: number
    average_age_seconds: number
    max_size: number
    usage_percentage: number
  }
  performance: {
    cache_hit_rate: string
    average_response_time: string
    total_requests: string
  }
}

const AI_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-ai-service-domain.com' 
  : 'http://localhost:8000'

export class AIService {
  private static instance: AIService
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T
    }
    if (cached) {
      this.cache.delete(key)
    }
    return null
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async normalizeProduct(productName: string, description: string = ''): Promise<AIAnalysisResult> {
    const cacheKey = `product:${productName}:${description}`
    const cached = this.getCachedData<AIAnalysisResult>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(`${AI_API_BASE_URL}/ai/normalize-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productName,
          description: description
        })
      })

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`)
      }

      const result = await response.json()
      this.setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error calling AI service:', error)
      // Return enhanced mock data as fallback
      const mockResult = {
        original_name: productName,
        normalized_name: productName,
        brand: 'Unknown',
        model: 'Unknown',
        category: 'Unknown',
        specifications: {},
        confidence: 0.5,
        processed_text: productName,
        profitability_score: 50,
        risk_level: 'MEDIUM' as const,
        recommendation: 'CAUTION' as const
      }
      this.setCachedData(cacheKey, mockResult)
      return mockResult
    }
  }

  async analyzePalette(products: string[]): Promise<PaletteAnalysisResult> {
    const cacheKey = `palette:${products.sort().join(',')}`
    const cached = this.getCachedData<PaletteAnalysisResult>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(`${AI_API_BASE_URL}/ai/analyze-palette`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: products
        })
      })

      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`)
      }

      const result = await response.json()
      this.setCachedData(cacheKey, result)
      return result
    } catch (error) {
      console.error('Error calling AI service:', error)
      // Return enhanced mock data as fallback
      const mockResult = {
        average_profitability: 75,
        high_risk_count: 2,
        medium_risk_count: 5,
        low_risk_count: 8,
        recommended_categories: ['Elektronika', 'Odzież'],
        buy_recommendation: 'CAUTION' as const,
        risk_assessment: 'MEDIUM' as const,
        estimated_roi: 20,
        category_distribution: {},
        total_products: products.length,
        profitability_distribution: {}
      }
      this.setCachedData(cacheKey, mockResult)
      return mockResult
    }
  }

  async getAvailableBrands(): Promise<string[]> {
    const cacheKey = 'brands'
    const cached = this.getCachedData<string[]>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(`${AI_API_BASE_URL}/ai/brands`)
      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`)
      }
      const data = await response.json()
      const brands = data.brands || []
      this.setCachedData(cacheKey, brands)
      return brands
    } catch (error) {
      console.error('Error getting brands:', error)
      return []
    }
  }

  async getAvailableCategories(): Promise<string[]> {
    const cacheKey = 'categories'
    const cached = this.getCachedData<string[]>(cacheKey)
    if (cached) {
      return cached
    }

    try {
      const response = await fetch(`${AI_API_BASE_URL}/ai/categories`)
      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`)
      }
      const data = await response.json()
      const categories = data.categories || []
      this.setCachedData(cacheKey, categories)
      return categories
    } catch (error) {
      console.error('Error getting categories:', error)
      return []
    }
  }

  async getCacheStats(): Promise<CacheStats | null> {
    try {
      const response = await fetch(`${AI_API_BASE_URL}/ai/cache/stats`)
      if (!response.ok) {
        throw new Error(`AI service error: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return null
    }
  }

  async clearCache(): Promise<boolean> {
    try {
      const response = await fetch(`${AI_API_BASE_URL}/ai/cache/clear`, {
        method: 'DELETE'
      })
      
      // Clear local cache as well
      this.cache.clear()
      
      return response.ok
    } catch (error) {
      console.error('Error clearing cache:', error)
      return false
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${AI_API_BASE_URL}/health`)
      return response.ok
    } catch (error) {
      console.error('AI service health check failed:', error)
      return false
    }
  }

  // Clear local cache
  clearLocalCache(): void {
    this.cache.clear()
  }

  // Get local cache stats
  getLocalCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}
