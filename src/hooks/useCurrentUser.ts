import { useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { ClerkSupabaseService } from '../services/clerkSupabaseService'
import { supabase } from '../lib/supabase'

/**
 * Hook do pobierania aktualnego użytkownika i jego ID z Supabase
 */
export const useCurrentUser = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const ensureUser = async () => {
      if (!isLoaded) {
        return
      }

      if (!isSignedIn || !user) {
        setSupabaseUserId(null)
        setLoading(false)
        return
      }

      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured - running in pre-launch mode')
        setSupabaseUserId(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userId = await ClerkSupabaseService.ensureUserInSupabase(user)
        setSupabaseUserId(userId)
        setError(null)
      } catch (err) {
        console.error('Error ensuring user in Supabase:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setSupabaseUserId(null)
      } finally {
        setLoading(false)
      }
    }

    ensureUser()
  }, [isLoaded, isSignedIn, user])

  return {
    user,
    supabaseUserId,
    isLoaded,
    isSignedIn,
    loading,
    error
  }
}

