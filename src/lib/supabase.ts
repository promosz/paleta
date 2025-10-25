import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Pobierz zmienne środowiskowe
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Walidacja zmiennych środowiskowych - tryb pre-launch
let supabase: ReturnType<typeof createClient<Database>> | null
let getSupabaseClient: ((clerkToken?: string) => Promise<ReturnType<typeof createClient<Database>> | null>) | null

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found - running in pre-launch mode')
  supabase = null
  getSupabaseClient = async (_clerkToken?: string) => null
} else {
  // Utworzenie klienta Supabase z typami
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Clerk zarządza sesjami
      autoRefreshToken: false,
    },
  })

  /**
   * Helper do pobierania tokenu Clerk i użycia go w Supabase
   * Używaj tego gdy potrzebujesz autoryzacji przez Clerk JWT
   */
  getSupabaseClient = async (clerkToken?: string) => {
    if (!clerkToken) {
      return supabase
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
}

export { supabase, getSupabaseClient }

