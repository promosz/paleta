export interface AIAnalysisResult {
  original_name: string
  normalized_name: string
  brand: string
  model: string
  category: string
  confidence: number
  profitability_score: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH'
  specifications: Record<string, string>
  processed_text: string
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
  category_distribution: Record<string, number>
  total_products: number
  profitability_distribution: Record<string, number>
}

export interface CacheStats {
  total_entries: string
  cache_usage: string
  hit_rate: string
  average_response_time: string
  total_requests: string
}
