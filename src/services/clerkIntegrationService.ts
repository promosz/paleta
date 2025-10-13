import { useUser } from '@clerk/clerk-react'
import { ClerkSupabaseService } from './clerkSupabaseService'

/**
 * Serwis do integracji z prawdziwymi użytkownikami Clerk
 * Zapewnia dostęp do danych użytkownika i zarządzanie sesjami
 */
export class ClerkIntegrationService {
  /**
   * Pobiera aktualnego użytkownika z Clerk
   * Zwraca null jeśli użytkownik nie jest zalogowany
   */
  static getCurrentUser() {
    const { user } = useUser()
    return user
  }

  /**
   * Pobiera ID aktualnego użytkownika z Clerk
   * Zwraca null jeśli użytkownik nie jest zalogowany
   */
  static getCurrentUserId(): string | null {
    const user = this.getCurrentUser()
    return user?.id || null
  }

  /**
   * Sprawdza czy użytkownik jest zalogowany w Clerk
   */
  static isUserLoggedIn(): boolean {
    return this.getCurrentUserId() !== null
  }

  /**
   * Pobiera dane użytkownika z Clerk
   */
  static getUserData() {
    const user = this.getCurrentUser()
    if (!user) return null

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  /**
   * Pobiera lub tworzy użytkownika w Supabase na podstawie danych z Clerk
   * Zwraca ID użytkownika z tabeli users
   */
  static async ensureUserInSupabase(): Promise<string | null> {
    try {
      const user = this.getCurrentUser()
      if (!user) {
        return null
      }

      return await ClerkSupabaseService.ensureUserInSupabase(user)
    } catch (error) {
      console.error('Error ensuring user in Supabase:', error)
      return null
    }
  }

  /**
   * Pobiera ID aktualnego użytkownika z Supabase
   * Jeśli użytkownik nie istnieje w Supabase, tworzy go
   */
  static async getCurrentSupabaseUserId(): Promise<string | null> {
    try {
      return await this.ensureUserInSupabase()
    } catch (error) {
      console.error('Error getting Supabase user ID:', error)
      return null
    }
  }

  /**
   * Sprawdza czy użytkownik ma dostęp do określonego zasobu
   * Używa RLS do weryfikacji uprawnień
   */
  static async verifyUserAccess(resourceUserId: string): Promise<boolean> {
    try {
      const currentUserId = await this.getCurrentSupabaseUserId()
      return currentUserId === resourceUserId
    } catch (error) {
      console.error('Error verifying user access:', error)
      return false
    }
  }

  /**
   * Pobiera dane aktualnego użytkownika z Supabase
   */
  static async getCurrentUserData(): Promise<any | null> {
    try {
      const userId = await this.getCurrentSupabaseUserId()
      if (!userId) {
        return null
      }
      return await ClerkSupabaseService.getUserData(userId)
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  }

  /**
   * Sprawdza czy użytkownik ma uprawnienia do wykonywania operacji
   */
  static async checkUserPermissions(): Promise<{
    canCreate: boolean
    canRead: boolean
    canUpdate: boolean
    canDelete: boolean
  }> {
    const isLoggedIn = this.isUserLoggedIn()
    
    return {
      canCreate: isLoggedIn,
      canRead: isLoggedIn,
      canUpdate: isLoggedIn,
      canDelete: isLoggedIn
    }
  }

  /**
   * Pobiera informacje o sesji użytkownika
   */
  static getSessionInfo() {
    const user = this.getCurrentUser()
    if (!user) return null

    return {
      userId: user.id,
      isLoggedIn: true,
      email: user.emailAddresses[0]?.emailAddress || '',
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      lastSignIn: user.lastSignInAt,
      createdAt: user.createdAt
    }
  }
}

// Eksportujemy instancję serwisu
export const clerkIntegrationService = new ClerkIntegrationService()
