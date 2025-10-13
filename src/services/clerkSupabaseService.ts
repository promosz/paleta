import { supabase } from '../lib/supabase'
import type { UserResource } from '@clerk/types'

/**
 * Serwis do integracji Clerk z Supabase
 * Zapewnia synchronizację użytkowników i zarządzanie sesjami
 * 
 * UWAGA: Ten serwis NIE używa React Hooks.
 * Do pobierania aktualnego użytkownika użyj hooka useCurrentUser()
 */
export class ClerkSupabaseService {

  /**
   * Pobiera lub tworzy użytkownika w Supabase na podstawie danych z Clerk
   * Zwraca ID użytkownika z tabeli users
   */
  static async ensureUserInSupabase(clerkUser: UserResource): Promise<string> {
    try {
      // Sprawdź czy użytkownik już istnieje
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id, clerk_user_id, email, full_name, avatar_url')
        .eq('clerk_user_id', clerkUser.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingUser) {
        // Użytkownik istnieje - zaktualizuj dane jeśli potrzeba
        const needsUpdate = 
          existingUser.email !== clerkUser.emailAddresses[0]?.emailAddress ||
          existingUser.full_name !== `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          existingUser.avatar_url !== clerkUser.imageUrl

        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('users')
            .update({
              email: clerkUser.emailAddresses[0]?.emailAddress || '',
              full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
              avatar_url: clerkUser.imageUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingUser.id)

          if (updateError) {
            console.error('Error updating user:', updateError)
            throw updateError
          }
        }

        return existingUser.id
      } else {
        // Użytkownik nie istnieje - utwórz nowego
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            clerk_user_id: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            avatar_url: clerkUser.imageUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single()

        if (insertError) {
          console.error('Error creating user:', insertError)
          throw insertError
        }

        return newUser.id
      }
    } catch (error) {
      console.error('Error ensuring user in Supabase:', error)
      throw error
    }
  }


  /**
   * Pobiera dane użytkownika z Supabase na podstawie userId
   */
  static async getUserData(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error getting user data:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  }
}

// Eksportujemy instancję serwisu
export const clerkSupabaseService = new ClerkSupabaseService()
