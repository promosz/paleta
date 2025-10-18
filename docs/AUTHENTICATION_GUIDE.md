# 🔐 Authentication Guide - Clerk Integration

## 📋 Overview

PalletAI używa **Clerk** jako providera autentykacji, oferując:
- OAuth/SSO (Google, GitHub, inne)
- Email/Password authentication
- Session management
- User management
- Bezpieczeństwo enterprise-grade

## 🚀 Quick Start

### 1. Utwórz Konto Clerk

1. Przejdź do [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Zarejestruj się (free tier dostępny)
3. Utwórz nową aplikację
4. Wybierz authentication methods (Google, Email, etc.)

### 2. Pobierz Publishable Key

1. W Clerk Dashboard → Your App
2. Przejdź do **API Keys**
3. Skopiuj **Publishable Key** (zaczyna się od `pk_test_` lub `pk_live_`)

### 3. Konfiguracja Environment Variables

Utwórz plik `.env` w głównym katalogu projektu:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**⚠️ Ważne**: 
- NIE commituj pliku `.env` do git!
- `.env` jest już w `.gitignore`
- Użyj `VITE_` prefix dla Vite

### 4. Uruchom Aplikację

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:3000/paleta/`

---

## 🔧 Detailed Configuration

### Clerk Dashboard Configuration

#### **1. Authentication Methods**

W Clerk Dashboard → **User & Authentication** → **Email, Phone, Username**:

**Rekomendowane ustawienia**:
- ✅ **Email** - włącz (primary method)
- ✅ **Password** - włącz
- ✅ **Email verification** - wymagane
- ✅ **Google OAuth** - włącz (opcjonalnie)
- ✅ **GitHub OAuth** - włącz (opcjonalnie)

#### **2. Session Settings**

W Clerk Dashboard → **Sessions**:

```
Session Lifetime: 7 days
Inactivity Timeout: 7 days
Multi-session handling: Enabled
```

#### **3. Appearance Customization**

W Clerk Dashboard → **Customization**:

**Theme**:
- Primary color: `#3B82F6` (blue-600)
- Button style: Rounded
- Logo: Upload your logo

**Layout**:
- Sign In: `/sign-in`
- Sign Up: `/sign-up`
- After sign in: `/dashboard`
- After sign up: `/dashboard`

#### **4. Email Templates** (opcjonalnie)

Dostosuj email templates w Clerk Dashboard → **Emails**:
- Verification email
- Password reset email
- Welcome email

---

## 📝 Implementation Details

### Frontend Integration

#### **1. ClerkProvider Setup**

```typescript
// src/main.tsx
import { ClerkProvider } from '@clerk/clerk-react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
)
```

#### **2. Protected Routes**

```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth()
  
  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }
  
  // Redirect to landing if not signed in
  if (!isSignedIn) {
    return <Navigate to="/" replace />
  }
  
  return <>{children}</>
}

export default ProtectedRoute
```

#### **3. Sign In / Sign Up Pages**

```typescript
// src/pages/SignInPage.tsx
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            footerActionLink: 'text-blue-600 hover:text-blue-700'
          }
        }}
      />
    </div>
  )
}
```

```typescript
// src/pages/SignUpPage.tsx
import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            footerActionLink: 'text-blue-600 hover:text-blue-700'
          }
        }}
      />
    </div>
  )
}
```

#### **4. User Hooks**

```typescript
// src/hooks/useCurrentUser.ts
import { useUser } from '@clerk/clerk-react'
import { useState, useEffect } from 'react'
import { clerkSupabaseService } from '../services/clerkSupabaseService'

export const useCurrentUser = () => {
  const { user, isLoaded, isSignedIn } = useUser()
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return
      
      if (isSignedIn && user) {
        try {
          // Get or create user in Supabase
          const supabaseUser = await clerkSupabaseService.getOrCreateUser(user)
          setSupabaseUserId(supabaseUser.id)
        } catch (err) {
          console.error('Error syncing user:', err)
          setError(err as Error)
        }
      }
      
      setLoading(false)
    }
    
    syncUser()
  }, [user, isLoaded, isSignedIn])
  
  return {
    clerkUser: user,
    supabaseUserId,
    isLoaded,
    isSignedIn,
    loading,
    error
  }
}
```

---

## 🔄 Clerk ↔ Supabase Synchronization

### User Sync Service

```typescript
// src/services/clerkSupabaseService.ts
import { User } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

export const clerkSupabaseService = {
  async getOrCreateUser(clerkUser: User) {
    const clerkUserId = clerkUser.id
    const email = clerkUser.primaryEmailAddress?.emailAddress
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
    
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single()
    
    if (existingUser) {
      console.log('✅ User exists in Supabase:', existingUser.id)
      return existingUser
    }
    
    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUserId,
        email: email || '',
        name: name || 'User',
        avatar_url: clerkUser.imageUrl
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('❌ Error creating user in Supabase:', insertError)
      throw insertError
    }
    
    console.log('✅ User created in Supabase:', newUser.id)
    return newUser
  },
  
  async updateUser(clerkUserId: string, updates: Partial<{
    email: string
    name: string
    avatar_url: string
  }>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error updating user:', error)
      throw error
    }
    
    console.log('✅ User updated:', data.id)
    return data
  }
}
```

### Supabase Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);

-- Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

**✅ DO**:
- Użyj `VITE_` prefix dla Vite variables
- Przechowuj `.env` lokalnie (nie commituj do git)
- Użyj różnych kluczy dla development i production

**❌ DON'T**:
- Nigdy nie commituj Clerk keys do repozytorium
- Nie hardcoduj keys w kodzie
- Nie udostępniaj Clerk Secret Key publicznie

### 2. API Keys Types

```
Publishable Key (pk_test_*, pk_live_*)
- ✅ Bezpieczny do użycia w frontend
- ✅ Możesz commitować do repo (.env.example)
- ✅ Widoczny w network requests

Secret Key (sk_test_*, sk_live_*)
- ❌ NIGDY nie używaj w frontend!
- ❌ NIGDY nie commituj do repo!
- ✅ Tylko dla backend/server-side operations
```

### 3. Production Setup

```bash
# Production .env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key_here
```

**Deployment platforms**:
- **Vercel**: Dodaj env vars w dashboard
- **Netlify**: Dodaj env vars w site settings
- **GitHub Pages**: Brak server-side, używaj tylko frontend vars

---

## 🐛 Troubleshooting

### Problem 1: "Missing Clerk Publishable Key"

**Symptom**: Aplikacja nie startuje, error w konsoli

**Solution**:
1. Sprawdź czy plik `.env` istnieje w root directory
2. Sprawdź czy key zaczyna się od `VITE_` prefix
3. Zrestartuj dev server (`npm run dev`)

```bash
# Correct format
VITE_CLERK_PUBLISHABLE_KEY=pk_test_ABC123...

# Wrong format (brak VITE_ prefix)
CLERK_PUBLISHABLE_KEY=pk_test_ABC123...
```

### Problem 2: User nie synchronizuje się z Supabase

**Symptom**: Użytkownik zalogowany w Clerk, ale błąd "User not found in Supabase"

**Solution**:
1. Sprawdź czy tabela `users` istnieje w Supabase
2. Sprawdź logi w konsoli przeglądarki
3. Sprawdź czy `clerkSupabaseService.getOrCreateUser` jest wywoływany
4. Sprawdź RLS policies na tabeli `users`

```sql
-- Disable RLS temporarily for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### Problem 3: Infinite redirect loop

**Symptom**: Aplikacja przekierowuje w pętli między `/` a `/dashboard`

**Solution**:
1. Sprawdź `isLoaded` w ProtectedRoute
2. Sprawdź czy routing configuration jest poprawny
3. Clear browser cache i cookies

```typescript
// Make sure to check isLoaded first
if (!isLoaded) return <Loading />
if (!isSignedIn) return <Navigate to="/" />
```

### Problem 4: OAuth not working

**Symptom**: Google/GitHub login nie działa

**Solution**:
1. Sprawdź czy OAuth is enabled w Clerk Dashboard
2. Sprawdź Authorized redirect URLs w Clerk
3. Sprawdź czy OAuth credentials są poprawne

```
Clerk Dashboard → OAuth Applications → Google

Authorized redirect URIs:
- http://localhost:3000/paleta/*
- https://yourdomain.com/*
```

---

## 📊 Monitoring & Analytics

### Clerk Dashboard Analytics

W Clerk Dashboard możesz monitorować:
- **Active users** - liczba aktywnych użytkowników
- **Sign ups** - nowe rejestracje
- **Sign ins** - logowania
- **Failed attempts** - nieudane próby logowania

### Custom Event Tracking

```typescript
// Track custom events
import { useUser } from '@clerk/clerk-react'

const { user } = useUser()

// Track user action
if (user) {
  console.log('User action:', {
    userId: user.id,
    action: 'completed_analysis',
    timestamp: new Date().toISOString()
  })
}
```

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Zmień Clerk key na production key (`pk_live_...`)
- [ ] Zaktualizuj Authorized redirect URLs w Clerk Dashboard
- [ ] Ustaw production environment variables na platformie deployment
- [ ] Przetestuj OAuth na production domain
- [ ] Włącz email verification
- [ ] Skonfiguruj custom email templates
- [ ] Włącz rate limiting
- [ ] Skonfiguruj webhooks (opcjonalnie)

### Environment Variables dla Production

```bash
# Vercel / Netlify / inne platformy
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### Authorized URLs w Clerk

```
Development:
- http://localhost:3000/*
- http://localhost:3000/paleta/*

Production:
- https://yourdomain.com/*
- https://yourdomain.github.io/paleta/*
```

---

## 📚 Resources

### Official Documentation
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk + Supabase Guide](https://clerk.com/docs/integrations/databases/supabase)

### PalletAI Documentation
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [Supabase Integration](./SUPABASE_README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

### Community
- [Clerk Discord](https://discord.com/invite/clerk)
- [Clerk GitHub](https://github.com/clerkinc)

---

**Last Updated**: January 18, 2025  
**Version**: 1.0  
**Author**: PalletAI Team

