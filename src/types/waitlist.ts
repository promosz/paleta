// Types for Pre-Launch Waitlist

export type BusinessType = 
  | 'trader_palet' 
  | 'sklep_ecommerce' 
  | 'reseller' 
  | 'hurtownia' 
  | 'inne'

export type WaitlistSource = 'hero' | 'pricing' | 'final_cta'

export interface WaitlistEntry {
  email: string
  first_name?: string
  business_type?: BusinessType
  referral_code?: string
  source?: WaitlistSource
  utm_source?: string
  utm_campaign?: string
}

export interface WaitlistResponse {
  success: boolean
  message: string
  error?: string
  data?: {
    id: string
    email: string
    created_at: string
  }
}

export interface WaitlistStats {
  total_count: number
  confirmed_count: number
  today_count: number
}

