// Waitlist Types

export type WaitlistSource = 
  | 'hero'
  | 'problem'
  | 'solution'
  | 'features'
  | 'pricing'
  | 'final_cta'
  | 'other'

export type BusinessType = 
  | 'trader_palet'
  | 'sklep_ecommerce'
  | 'reseller'
  | 'hurtownia'
  | 'inne'

export interface WaitlistEntry {
  id?: string
  email: string
  first_name?: string
  business_type?: BusinessType
  referral_code?: string
  source?: WaitlistSource | string
  utm_source?: string
  utm_campaign?: string
  created_at?: string
  confirmed?: boolean
  metadata?: Record<string, any>
}

export interface WaitlistResponse {
  success: boolean
  message: string
  data?: {
    id: string
    email: string
    created_at: string
  }
  error?: string
}

export interface WaitlistStats {
  total_count: number
  confirmed_count: number
  today_count: number
}
