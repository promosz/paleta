// Waitlist Service - Pre-Launch Landing Page
import { supabase } from '../lib/supabase'
import type { WaitlistEntry, WaitlistResponse, WaitlistStats } from '../types/waitlist'

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim().toLowerCase())
}

/**
 * Adds a new entry to the waitlist
 */
export async function addToWaitlist(entry: WaitlistEntry): Promise<WaitlistResponse> {
  try {
    // Validate email
    const email = entry.email.trim().toLowerCase()
    
    if (!email) {
      return {
        success: false,
        message: 'Email jest wymagany',
        error: 'EMPTY_EMAIL'
      }
    }
    
    if (!isValidEmail(email)) {
      return {
        success: false,
        message: 'Podaj prawidłowy adres email',
        error: 'INVALID_EMAIL'
      }
    }
    
    // Check if email already exists
    const { data: existing, error: checkError } = await (supabase as any)
      .from('waitlist')
      .select('id, email')
      .eq('email', email)
      .maybeSingle()
    
    if (checkError) {
      console.error('Error checking existing email:', checkError)
      return {
        success: false,
        message: 'Wystąpił błąd. Spróbuj ponownie.',
        error: 'CHECK_ERROR'
      }
    }
    
    if (existing) {
      return {
        success: false,
        message: 'Ten email jest już na liście! Sprawdź swoją skrzynkę.',
        error: 'DUPLICATE_EMAIL'
      }
    }
    
    // Insert new entry
    const { data, error } = await (supabase as any)
      .from('waitlist')
      .insert({
        email,
        first_name: entry.first_name?.trim() || null,
        business_type: entry.business_type || null,
        referral_code: entry.referral_code || null,
        source: entry.source || null,
        utm_source: entry.utm_source || null,
        utm_campaign: entry.utm_campaign || null,
        confirmed: false,
        metadata: {
          user_agent: navigator.userAgent,
          language: navigator.language,
          signup_date: new Date().toISOString()
        }
      })
      .select('id, email, created_at')
      .single()
    
    if (error) {
      console.error('Error inserting to waitlist:', error)
      
      // Handle specific error cases
      if (error.code === '23505') { // Unique constraint violation
        return {
          success: false,
          message: 'Ten email jest już na liście!',
          error: 'DUPLICATE_EMAIL'
        }
      }
      
      return {
        success: false,
        message: 'Nie udało się zapisać. Spróbuj ponownie.',
        error: 'INSERT_ERROR'
      }
    }
    
    return {
      success: true,
      message: '✅ Dziękujemy! Jesteś na liście!',
      data: data as { id: string; email: string; created_at: string }
    }
    
  } catch (error) {
    console.error('Unexpected error in addToWaitlist:', error)
    return {
      success: false,
      message: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
      error: 'UNEXPECTED_ERROR'
    }
  }
}

/**
 * Gets the total count of waitlist entries (for social proof)
 */
export async function getWaitlistCount(): Promise<number> {
  try {
    const { count, error } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      console.error('Error getting waitlist count:', error)
      return 500 // Fallback number for social proof
    }
    
    return count || 500
    
  } catch (error) {
    console.error('Unexpected error in getWaitlistCount:', error)
    return 500 // Fallback
  }
}

/**
 * Gets waitlist statistics (admin only)
 */
export async function getWaitlistStats(): Promise<WaitlistStats> {
  try {
    // Total count
    const { count: totalCount } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    
    // Confirmed count
    const { count: confirmedCount } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('confirmed', true)
    
    // Today's signups
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: todayCount } = await (supabase as any)
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
    
    return {
      total_count: totalCount || 0,
      confirmed_count: confirmedCount || 0,
      today_count: todayCount || 0
    }
    
  } catch (error) {
    console.error('Error getting waitlist stats:', error)
    return {
      total_count: 0,
      confirmed_count: 0,
      today_count: 0
    }
  }
}

export const waitlistService = {
  addToWaitlist,
  getWaitlistCount,
  getWaitlistStats
}

