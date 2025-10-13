# Plan Wdrożenia Supabase - Izolacja Danych Użytkowników

## Spis treści
1. [Cel projektu](#cel-projektu)
2. [Przygotowanie środowiska](#przygotowanie-środowiska)
3. [Architektura bazy danych](#architektura-bazy-danych)
4. [Integracja z Clerk](#integracja-z-clerk)
5. [Implementacja zabezpieczeń](#implementacja-zabezpieczeń)
6. [Migracja danych](#migracja-danych)
7. [Plan rozwoju - Etapy](#plan-rozwoju---etapy)
8. [Testowanie](#testowanie)
9. [Monitoring i utrzymanie](#monitoring-i-utrzymanie)

---

## Cel projektu

### Główne cele
- ✅ Każdy użytkownik ma dostęp TYLKO do swoich analiz
- ✅ Każdy użytkownik ma dostęp TYLKO do swoich reguł
- ✅ Każdy użytkownik ma dostęp TYLKO do swoich ustawień
- ✅ Dane są przechowywane w chmurze (Supabase)
- ✅ Synchronizacja między sesjami i urządzeniami
- ✅ Pełna izolacja danych między użytkownikami

### Obecny stan aplikacji
- ✅ Autentykacja: **Clerk** (już wdrożony)
- ✅ Store'y: **Zustand** z localStorage
- ✅ Frontend: **React + TypeScript + Vite**
- ❌ Backend: Brak (tylko frontend)
- ❌ Baza danych: Brak (localStorage)

### Stan docelowy
- ✅ Autentykacja: **Clerk**
- ✅ Backend: **Supabase** (PostgreSQL + API + Storage)
- ✅ Store'y: **Zustand** + **Supabase** sync
- ✅ Zabezpieczenia: **Row Level Security (RLS)**

---

## Przygotowanie środowiska

### ETAP 0: Konfiguracja konta Supabase

#### 0.1. Rejestracja i utworzenie projektu

**Czas: 15 minut**

1. **Rejestracja w Supabase**
   - Przejdź do [https://supabase.com](https://supabase.com)
   - Kliknij "Start your project"
   - Zaloguj się przez GitHub (zalecane) lub email

2. **Utworzenie nowego projektu**
   ```
   Nazwa projektu: pallet-analysis-app
   Database Password: [ZAPISZ BEZPIECZNIE - będzie potrzebne]
   Region: Europe (Central EU) - Frankfurt
   Plan: Free (wystarczy na start)
   ```

3. **Zapisz dane połączenia**
   Po utworzeniu projektu, przejdź do **Settings** → **API**
   
   Zapisz następujące dane (będą potrzebne):
   - `Project URL`: https://xxxxxxxxxxxxx.supabase.co
   - `API Key (anon/public)`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - `API Key (service_role)`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (TYLKO DLA SERWERA!)

#### 0.2. Instalacja zależności

**Czas: 5 minut**

```bash
# Instalacja Supabase client dla JavaScript/TypeScript
npm install @supabase/supabase-js

# Instalacja dodatkowych typów (opcjonalne, ale zalecane)
npm install --save-dev @supabase/postgrest-js
```

#### 0.3. Konfiguracja zmiennych środowiskowych

**Czas: 5 minut**

1. **Utwórz plik `.env.local`** w głównym katalogu projektu:

```bash
# .env.local

# Clerk (już istniejące)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx

# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Uwaga: Service Role Key NIE POWINIEN być w frontend!
# Service Role Key używaj tylko w backend/serverless functions
```

2. **Dodaj `.env.local` do `.gitignore`** (jeśli jeszcze nie ma):

```bash
# .gitignore
.env.local
.env
```

3. **Utwórz przykładowy plik `.env.example`** (bez kluczy):

```bash
# .env.example
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### 0.4. Utworzenie klienta Supabase

**Czas: 10 minut**

Utwórz plik: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Clerk zarządza sesjami
    autoRefreshToken: false,
  },
})

// Helper do pobierania tokenu Clerk i użycia go w Supabase
export async function getSupabaseClient(clerkToken?: string) {
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
```

---

## Architektura bazy danych

### ETAP 1: Projektowanie schematu bazy danych

**Czas: 45 minut**

#### 1.1. Tabela: `users`

**Cel**: Synchronizacja użytkowników z Clerk

```sql
-- Tabela użytkowników (sync z Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Indeksy
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_users_email ON users(email);

-- Trigger do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 1.2. Tabela: `analyses`

**Cel**: Przechowywanie analiz dokumentów

```sql
-- Tabela analiz
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Podstawowe dane
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'file_upload', -- 'file_upload', 'manual', 'api'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  
  -- Produkty i pliki (JSONB dla elastyczności)
  products JSONB DEFAULT '[]'::jsonb,
  files JSONB DEFAULT '[]'::jsonb,
  evaluations JSONB DEFAULT '[]'::jsonb,
  
  -- Statystyki
  total_products INTEGER DEFAULT 0,
  valid_products INTEGER DEFAULT 0,
  invalid_products INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  
  -- Szczegółowe statystyki
  stats JSONB DEFAULT '{}'::jsonb,
  
  -- Metadane
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Daty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_type CHECK (type IN ('file_upload', 'manual', 'api')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  CONSTRAINT valid_average_score CHECK (average_score >= 0 AND average_score <= 100)
);

-- Indeksy dla wydajności
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_status ON analyses(status);
CREATE INDEX idx_analyses_type ON analyses(type);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_analyses_user_status ON analyses(user_id, status);

-- GIN index dla JSONB (szybsze wyszukiwanie w JSON)
CREATE INDEX idx_analyses_products_gin ON analyses USING GIN (products);
CREATE INDEX idx_analyses_metadata_gin ON analyses USING GIN (metadata);

-- Trigger do automatycznej aktualizacji updated_at
CREATE TRIGGER analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 1.3. Tabela: `rules`

**Cel**: Przechowywanie reguł użytkowników

```sql
-- Tabela reguł
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Podstawowe dane
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'budget', 'category', 'quality'
  action TEXT NOT NULL, -- 'block', 'warn', 'prefer'
  status TEXT NOT NULL DEFAULT 'inactive', -- 'active', 'inactive'
  weight INTEGER NOT NULL DEFAULT 5,
  
  -- Warunki (JSONB dla elastyczności)
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Daty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_type CHECK (type IN ('budget', 'category', 'quality')),
  CONSTRAINT valid_action CHECK (action IN ('block', 'warn', 'prefer')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive')),
  CONSTRAINT valid_weight CHECK (weight >= 1 AND weight <= 10)
);

-- Indeksy
CREATE INDEX idx_rules_user_id ON rules(user_id);
CREATE INDEX idx_rules_type ON rules(type);
CREATE INDEX idx_rules_status ON rules(status);
CREATE INDEX idx_rules_user_status ON rules(user_id, status);
CREATE INDEX idx_rules_conditions_gin ON rules USING GIN (conditions);

-- Trigger do automatycznej aktualizacji updated_at
CREATE TRIGGER rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 1.4. Tabela: `rule_templates`

**Cel**: Globalne szablony reguł (dla wszystkich użytkowników)

```sql
-- Tabela szablonów reguł (globalne, dla wszystkich użytkowników)
CREATE TABLE rule_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Podstawowe dane
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 5,
  
  -- Warunki
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Kategoryzacja
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Popularność
  usage_count INTEGER DEFAULT 0,
  
  -- Metadane
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_template_type CHECK (type IN ('budget', 'category', 'quality')),
  CONSTRAINT valid_template_action CHECK (action IN ('block', 'warn', 'prefer')),
  CONSTRAINT valid_template_weight CHECK (weight >= 1 AND weight <= 10)
);

-- Indeksy
CREATE INDEX idx_rule_templates_type ON rule_templates(type);
CREATE INDEX idx_rule_templates_category ON rule_templates(category);
CREATE INDEX idx_rule_templates_tags ON rule_templates USING GIN (tags);
CREATE INDEX idx_rule_templates_featured ON rule_templates(is_featured);

-- Trigger
CREATE TRIGGER rule_templates_updated_at
  BEFORE UPDATE ON rule_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 1.5. Tabela: `user_settings`

**Cel**: Ustawienia użytkowników

```sql
-- Tabela ustawień użytkowników
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ustawienia ogólne
  theme TEXT DEFAULT 'light', -- 'light', 'dark', 'auto'
  language TEXT DEFAULT 'pl', -- 'pl', 'en'
  
  -- Ustawienia powiadomień
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- Ustawienia prywatności
  data_retention_days INTEGER DEFAULT 90,
  auto_delete_old_analyses BOOLEAN DEFAULT false,
  
  -- Ustawienia analiz
  default_analysis_type TEXT DEFAULT 'file_upload',
  auto_evaluate_products BOOLEAN DEFAULT true,
  
  -- Preferencje (JSONB dla elastyczności)
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Daty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'auto')),
  CONSTRAINT valid_language CHECK (language IN ('pl', 'en'))
);

-- Indeksy
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Trigger
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 1.6. Tabela: `analysis_files` (dla Storage)

**Cel**: Metadane plików przechowywanych w Supabase Storage

```sql
-- Tabela metadanych plików
CREATE TABLE analysis_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dane pliku
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Ścieżka w Supabase Storage
  
  -- Status przetwarzania
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'error'
  error_message TEXT,
  
  -- Produkty
  product_count INTEGER DEFAULT 0,
  
  -- Daty
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_file_status CHECK (status IN ('pending', 'processing', 'completed', 'error'))
);

-- Indeksy
CREATE INDEX idx_analysis_files_analysis_id ON analysis_files(analysis_id);
CREATE INDEX idx_analysis_files_user_id ON analysis_files(user_id);
CREATE INDEX idx_analysis_files_status ON analysis_files(status);

-- WAŻNE: Nie potrzebujemy triggera updated_at, bo to tabela append-only
```

#### 1.7. Widoki (Views) dla ułatwienia zapytań

```sql
-- Widok: Statystyki użytkownika
CREATE VIEW user_statistics AS
SELECT 
  u.id AS user_id,
  u.email,
  u.full_name,
  COUNT(DISTINCT a.id) AS total_analyses,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_analyses,
  COUNT(DISTINCT r.id) AS total_rules,
  COUNT(DISTINCT CASE WHEN r.status = 'active' THEN r.id END) AS active_rules,
  COALESCE(SUM(a.total_products), 0) AS total_products_analyzed,
  COALESCE(AVG(a.average_score), 0) AS average_analysis_score,
  u.created_at AS user_since,
  u.last_login_at
FROM users u
LEFT JOIN analyses a ON u.id = a.user_id
LEFT JOIN rules r ON u.id = r.user_id
GROUP BY u.id, u.email, u.full_name, u.created_at, u.last_login_at;

-- Widok: Ostatnie analizy użytkownika
CREATE VIEW user_recent_analyses AS
SELECT 
  a.id,
  a.user_id,
  a.name,
  a.description,
  a.type,
  a.status,
  a.total_products,
  a.average_score,
  a.created_at,
  a.updated_at,
  a.completed_at
FROM analyses a
ORDER BY a.created_at DESC;
```

---

## Integracja z Clerk

### ETAP 2: Synchronizacja użytkowników Clerk ↔ Supabase

**Czas: 1-2 godziny**

#### 2.1. Webhook Clerk → Supabase

**Cel**: Automatyczna synchronizacja użytkowników z Clerk do Supabase

**Krok 1: Konfiguracja Webhook w Clerk**

1. Przejdź do [Clerk Dashboard](https://dashboard.clerk.com)
2. Wybierz swój projekt
3. Przejdź do **Webhooks** → **Add Endpoint**
4. URL: `https://xxxxxxxxxxxxx.supabase.co/functions/v1/clerk-webhook`
5. Wybierz eventy:
   - `user.created`
   - `user.updated`
   - `user.deleted`
6. Zapisz **Signing Secret** (będzie potrzebny)

**Krok 2: Utworzenie Supabase Edge Function**

Supabase Edge Functions to serverless functions (podobne do AWS Lambda).

```bash
# Zainstaluj Supabase CLI
npm install -g supabase

# Zaloguj się do Supabase
supabase login

# Połącz z projektem
supabase link --project-ref xxxxxxxxxxxxx

# Utwórz Edge Function
supabase functions new clerk-webhook
```

**Krok 3: Implementacja Edge Function**

Plik: `supabase/functions/clerk-webhook/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CLERK_WEBHOOK_SECRET = Deno.env.get('CLERK_WEBHOOK_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    // Weryfikacja podpisu Clerk
    const signature = req.headers.get('svix-signature')
    if (!signature) {
      return new Response('Missing signature', { status: 401 })
    }

    // TODO: Dodać pełną weryfikację podpisu Svix
    // https://docs.clerk.com/integrations/webhooks/overview#verifying-a-webhook-signature

    // Parsowanie body
    const payload = await req.json()
    const { type, data } = payload

    // Inicjalizacja Supabase client z service_role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Obsługa eventów
    switch (type) {
      case 'user.created': {
        // Tworzenie nowego użytkownika w Supabase
        const { error } = await supabase.from('users').insert({
          clerk_user_id: data.id,
          email: data.email_addresses[0]?.email_address,
          full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          avatar_url: data.image_url,
          last_login_at: new Date().toISOString(),
        })

        if (error) throw error

        // Utworzenie domyślnych ustawień
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_user_id', data.id)
          .single()

        if (userData) {
          await supabase.from('user_settings').insert({
            user_id: userData.id,
          })
        }

        break
      }

      case 'user.updated': {
        // Aktualizacja użytkownika
        const { error } = await supabase
          .from('users')
          .update({
            email: data.email_addresses[0]?.email_address,
            full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            avatar_url: data.image_url,
            updated_at: new Date().toISOString(),
          })
          .eq('clerk_user_id', data.id)

        if (error) throw error
        break
      }

      case 'user.deleted': {
        // Usunięcie użytkownika (CASCADE usunie wszystkie powiązane dane)
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('clerk_user_id', data.id)

        if (error) throw error
        break
      }

      default:
        console.log(`Unhandled event type: ${type}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

**Krok 4: Deploy Edge Function**

```bash
# Ustaw secrets
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
supabase secrets set SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Deploy
supabase functions deploy clerk-webhook
```

#### 2.2. Helper do pobierania user_id z Clerk

**Cel**: Łatwe pobieranie user_id Supabase na podstawie Clerk user_id

Utwórz plik: `src/lib/supabaseHelpers.ts`

```typescript
import { supabase } from './supabase'
import { useUser } from '@clerk/clerk-react'

/**
 * Hook do pobierania Supabase user_id na podstawie Clerk user_id
 */
export function useSupabaseUserId() {
  const { user } = useUser()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserId() {
      if (!user) {
        setUserId(null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_user_id', user.id)
          .single()

        if (error) throw error
        setUserId(data.id)
      } catch (error) {
        console.error('Error fetching Supabase user ID:', error)
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserId()
  }, [user])

  return { userId, loading }
}

/**
 * Funkcja pomocnicza do pobierania user_id (bez hooka)
 */
export async function getSupabaseUserId(clerkUserId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single()

    if (error) throw error
    return data.id
  } catch (error) {
    console.error('Error fetching Supabase user ID:', error)
    return null
  }
}
```

---

## Implementacja zabezpieczeń

### ETAP 3: Row Level Security (RLS)

**Czas: 45 minut**

**Row Level Security (RLS)** to mechanizm PostgreSQL, który automatycznie filtruje wiersze na poziomie bazy danych. Użytkownik może zobaczyć/modyfikować TYLKO swoje dane.

#### 3.1. Włączenie RLS na wszystkich tabelach

```sql
-- Włączenie RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files ENABLE ROW LEVEL SECURITY;
```

#### 3.2. Polityki RLS dla tabeli `users`

```sql
-- Użytkownik może zobaczyć TYLKO swój własny profil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Użytkownik może aktualizować TYLKO swój własny profil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Tylko system (service_role) może tworzyć użytkowników
-- (przez webhook z Clerk)
```

#### 3.3. Polityki RLS dla tabeli `analyses`

```sql
-- Użytkownik może zobaczyć TYLKO swoje analizy
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może tworzyć analizy
CREATE POLICY "Users can create own analyses"
  ON analyses FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje analizy
CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje analizy
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));
```

#### 3.4. Polityki RLS dla tabeli `rules`

```sql
-- Użytkownik może zobaczyć TYLKO swoje reguły
CREATE POLICY "Users can view own rules"
  ON rules FOR SELECT
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może tworzyć reguły
CREATE POLICY "Users can create own rules"
  ON rules FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje reguły
CREATE POLICY "Users can update own rules"
  ON rules FOR UPDATE
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje reguły
CREATE POLICY "Users can delete own rules"
  ON rules FOR DELETE
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));
```

#### 3.5. Polityki RLS dla tabeli `user_settings`

```sql
-- Użytkownik może zobaczyć TYLKO swoje ustawienia
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje ustawienia
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));
```

#### 3.6. Polityki RLS dla tabeli `analysis_files`

```sql
-- Użytkownik może zobaczyć TYLKO swoje pliki
CREATE POLICY "Users can view own files"
  ON analysis_files FOR SELECT
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może tworzyć pliki
CREATE POLICY "Users can create own files"
  ON analysis_files FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje pliki
CREATE POLICY "Users can delete own files"
  ON analysis_files FOR DELETE
  USING (user_id IN (
    SELECT id FROM users 
    WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ));
```

#### 3.7. Polityki dla `rule_templates` (publiczne)

```sql
-- Wszyscy mogą zobaczyć szablony (są publiczne)
CREATE POLICY "Anyone can view rule templates"
  ON rule_templates FOR SELECT
  TO authenticated
  USING (true);

-- Tylko admin może modyfikować szablony
-- (do późniejszej implementacji)
```

#### 3.8. Storage Policies (dla plików)

```sql
-- Bucket dla plików analiz
INSERT INTO storage.buckets (id, name, public) 
VALUES ('analysis-files', 'analysis-files', false);

-- Polityki Storage
-- Użytkownik może uploadować TYLKO do swojego folderu
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'analysis-files' 
    AND (storage.foldername(name))[1] = auth.jwt()->>'sub'
  );

-- Użytkownik może zobaczyć TYLKO swoje pliki
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'analysis-files' 
    AND (storage.foldername(name))[1] = auth.jwt()->>'sub'
  );

-- Użytkownik może usuwać TYLKO swoje pliki
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'analysis-files' 
    AND (storage.foldername(name))[1] = auth.jwt()->>'sub'
  );
```

---

## Migracja danych

### ETAP 4: Migracja Store'ów z localStorage do Supabase

**Czas: 3-4 godziny**

#### 4.1. Utworzenie Supabase Service Layer

**Cel**: Abstrakcja operacji na Supabase

Utwórz plik: `src/services/supabaseService.ts`

```typescript
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'
import type { Analysis } from '../types/analysis'
import type { Rule } from '../types/rules'

// Typy z Supabase
type SupabaseAnalysis = Database['public']['Tables']['analyses']['Row']
type SupabaseRule = Database['public']['Tables']['rules']['Row']
type SupabaseUserSettings = Database['public']['Tables']['user_settings']['Row']

/**
 * Service do operacji na analizach
 */
export const analysisService = {
  /**
   * Pobieranie wszystkich analiz użytkownika
   */
  async getAll(userId: string): Promise<Analysis[]> {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.toAnalysis)
  },

  /**
   * Pobieranie pojedynczej analizy
   */
  async getById(id: string): Promise<Analysis | null> {
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data ? this.toAnalysis(data) : null
  },

  /**
   * Tworzenie nowej analizy
   */
  async create(userId: string, analysis: Partial<Analysis>): Promise<Analysis> {
    const { data, error } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        name: analysis.name!,
        description: analysis.description,
        type: analysis.type || 'file_upload',
        status: 'pending',
        products: analysis.products || [],
        files: analysis.files || [],
        evaluations: analysis.evaluations || [],
        stats: analysis.stats || {},
        metadata: analysis.metadata || {},
      })
      .select()
      .single()

    if (error) throw error
    return this.toAnalysis(data)
  },

  /**
   * Aktualizacja analizy
   */
  async update(id: string, updates: Partial<Analysis>): Promise<Analysis> {
    const { data, error } = await supabase
      .from('analyses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.toAnalysis(data)
  },

  /**
   * Usuwanie analizy
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Konwersja z Supabase do Analysis
   */
  toAnalysis(data: SupabaseAnalysis): Analysis {
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      type: data.type as any,
      status: data.status as any,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      files: data.files as any || [],
      products: data.products as any || [],
      totalProducts: data.total_products || 0,
      validProducts: data.valid_products || 0,
      invalidProducts: data.invalid_products || 0,
      evaluations: data.evaluations as any || [],
      averageScore: Number(data.average_score) || 0,
      stats: data.stats as any || {},
      metadata: data.metadata as any || {},
    }
  },
}

/**
 * Service do operacji na regułach
 */
export const rulesService = {
  /**
   * Pobieranie wszystkich reguł użytkownika
   */
  async getAll(userId: string): Promise<Rule[]> {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(this.toRule)
  },

  /**
   * Tworzenie nowej reguły
   */
  async create(userId: string, rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rule> {
    const { data, error } = await supabase
      .from('rules')
      .insert({
        user_id: userId,
        name: rule.name,
        description: rule.description,
        type: rule.type,
        action: rule.action,
        status: rule.status,
        weight: rule.weight,
        conditions: rule.conditions,
      })
      .select()
      .single()

    if (error) throw error
    return this.toRule(data)
  },

  /**
   * Aktualizacja reguły
   */
  async update(id: string, updates: Partial<Rule>): Promise<Rule> {
    const { data, error } = await supabase
      .from('rules')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return this.toRule(data)
  },

  /**
   * Usuwanie reguły
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  /**
   * Konwersja z Supabase do Rule
   */
  toRule(data: SupabaseRule): Rule {
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      type: data.type as any,
      action: data.action as any,
      status: data.status as any,
      weight: data.weight,
      conditions: data.conditions as any,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  },
}

/**
 * Service do operacji na ustawieniach użytkownika
 */
export const userSettingsService = {
  /**
   * Pobieranie ustawień użytkownika
   */
  async get(userId: string): Promise<SupabaseUserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Brak ustawień
      throw error
    }
    return data
  },

  /**
   * Aktualizacja ustawień użytkownika
   */
  async update(userId: string, settings: Partial<SupabaseUserSettings>): Promise<SupabaseUserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}
```

#### 4.2. Aktualizacja `analysisStore.ts`

**Cel**: Integracja z Supabase zamiast localStorage

```typescript
import { create } from 'zustand'
import { analysisService } from '../services/supabaseService'
import { getSupabaseUserId } from '../lib/supabaseHelpers'
import type { Analysis, /* inne typy */ } from '../types/analysis'

interface AnalysisState {
  // Stan
  analyses: Analysis[]
  currentAnalysis: Analysis | null
  isLoading: boolean
  error: string | null
  
  // Nowe: user_id z Supabase
  userId: string | null
  
  // Akcje
  setUserId: (userId: string) => void
  loadAnalyses: () => Promise<void>
  createAnalysis: (name: string, description?: string, type?: AnalysisType) => Promise<Analysis>
  updateAnalysis: (id: string, updates: Partial<Analysis>) => Promise<void>
  deleteAnalysis: (id: string) => Promise<void>
  // ... reszta akcji
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // Stan początkowy
  analyses: [],
  currentAnalysis: null,
  isLoading: false,
  error: null,
  userId: null,

  // Ustawianie userId
  setUserId: (userId: string) => {
    set({ userId })
  },

  // Ładowanie analiz z Supabase
  loadAnalyses: async () => {
    const { userId } = get()
    if (!userId) {
      set({ error: 'User not authenticated' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const analyses = await analysisService.getAll(userId)
      set({ analyses, isLoading: false })
    } catch (error) {
      console.error('Error loading analyses:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      })
    }
  },

  // Tworzenie analizy
  createAnalysis: async (name, description, type = 'file_upload') => {
    const { userId } = get()
    if (!userId) throw new Error('User not authenticated')

    set({ isLoading: true, error: null })

    try {
      const newAnalysis = await analysisService.create(userId, {
        name,
        description,
        type,
      })

      set(state => ({
        analyses: [newAnalysis, ...state.analyses],
        isLoading: false,
      }))

      return newAnalysis
    } catch (error) {
      console.error('Error creating analysis:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      })
      throw error
    }
  },

  // Aktualizacja analizy
  updateAnalysis: async (id, updates) => {
    set({ isLoading: true, error: null })

    try {
      const updatedAnalysis = await analysisService.update(id, updates)

      set(state => ({
        analyses: state.analyses.map(a => 
          a.id === id ? updatedAnalysis : a
        ),
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error updating analysis:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      })
      throw error
    }
  },

  // Usuwanie analizy
  deleteAnalysis: async (id) => {
    set({ isLoading: true, error: null })

    try {
      await analysisService.delete(id)

      set(state => ({
        analyses: state.analyses.filter(a => a.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      console.error('Error deleting analysis:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      })
      throw error
    }
  },

  // ... reszta implementacji
}))
```

#### 4.3. Inicjalizacja store'ów w komponencie głównym

**Cel**: Automatyczne ładowanie danych po zalogowaniu

Plik: `src/App.tsx`

```typescript
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useAnalysisStore } from './stores/analysisStore'
import { useRulesStore } from './stores/rulesStore'
import { getSupabaseUserId } from './lib/supabaseHelpers'

function App() {
  const { user, isLoaded } = useUser()
  const setAnalysisUserId = useAnalysisStore(state => state.setUserId)
  const loadAnalyses = useAnalysisStore(state => state.loadAnalyses)
  const setRulesUserId = useRulesStore(state => state.setUserId)
  const loadRules = useRulesStore(state => state.loadRules)

  useEffect(() => {
    async function initializeStores() {
      if (!isLoaded || !user) return

      // Pobierz Supabase user_id
      const userId = await getSupabaseUserId(user.id)
      if (!userId) {
        console.error('Failed to get Supabase user ID')
        return
      }

      // Ustaw userId w store'ach
      setAnalysisUserId(userId)
      setRulesUserId(userId)

      // Załaduj dane
      await Promise.all([
        loadAnalyses(),
        loadRules(),
      ])
    }

    initializeStores()
  }, [user, isLoaded])

  return (
    // ... reszta aplikacji
  )
}
```

---

## Plan rozwoju - Etapy

### ETAP 0: Przygotowanie (1 dzień)
✅ **Czas: 6-8 godzin**

- [ ] 0.1. Rejestracja w Supabase i utworzenie projektu (15 min)
- [ ] 0.2. Instalacja zależności (@supabase/supabase-js) (5 min)
- [ ] 0.3. Konfiguracja zmiennych środowiskowych (.env.local) (5 min)
- [ ] 0.4. Utworzenie klienta Supabase (src/lib/supabase.ts) (10 min)
- [ ] 0.5. Generowanie typów TypeScript z Supabase (20 min)

### ETAP 1: Baza danych (1 dzień)
✅ **Czas: 6-8 godzin**

- [ ] 1.1. Utworzenie tabeli `users` (15 min)
- [ ] 1.2. Utworzenie tabeli `analyses` (20 min)
- [ ] 1.3. Utworzenie tabeli `rules` (20 min)
- [ ] 1.4. Utworzenie tabeli `rule_templates` (15 min)
- [ ] 1.5. Utworzenie tabeli `user_settings` (15 min)
- [ ] 1.6. Utworzenie tabeli `analysis_files` (20 min)
- [ ] 1.7. Utworzenie widoków (views) (30 min)
- [ ] 1.8. Test połączenia i zapytań (30 min)

### ETAP 2: Integracja z Clerk (1 dzień)
✅ **Czas: 4-6 godzin**

- [ ] 2.1. Konfiguracja Webhook w Clerk (15 min)
- [ ] 2.2. Utworzenie Supabase Edge Function (clerk-webhook) (1-2 godz)
- [ ] 2.3. Deploy Edge Function (30 min)
- [ ] 2.4. Test synchronizacji użytkowników (30 min)
- [ ] 2.5. Utworzenie helpera useSupabaseUserId (30 min)

### ETAP 3: Row Level Security (1 dzień)
✅ **Czas: 4-6 godzin**

- [ ] 3.1. Włączenie RLS na wszystkich tabelach (10 min)
- [ ] 3.2. Polityki dla tabeli `users` (20 min)
- [ ] 3.3. Polityki dla tabeli `analyses` (30 min)
- [ ] 3.4. Polityki dla tabeli `rules` (30 min)
- [ ] 3.5. Polityki dla tabeli `user_settings` (20 min)
- [ ] 3.6. Polityki dla tabeli `analysis_files` (20 min)
- [ ] 3.7. Polityki dla Storage (bucket analysis-files) (30 min)
- [ ] 3.8. Test zabezpieczeń (różni użytkownicy) (1-2 godz)

### ETAP 4: Migracja Store'ów (2-3 dni)
✅ **Czas: 12-16 godzin**

- [ ] 4.1. Utworzenie Supabase Service Layer (src/services/supabaseService.ts) (2-3 godz)
- [ ] 4.2. Aktualizacja `analysisStore.ts` (3-4 godz)
- [ ] 4.3. Aktualizacja `rulesStore.ts` (3-4 godz)
- [ ] 4.4. Aktualizacja `uploadStore.ts` (opcjonalne) (2 godz)
- [ ] 4.5. Inicjalizacja store'ów w App.tsx (1 godz)
- [ ] 4.6. Usunięcie starych danych z localStorage (30 min)

### ETAP 5: Supabase Storage (1 dzień)
✅ **Czas: 4-6 godzin**

- [ ] 5.1. Konfiguracja bucketa `analysis-files` (30 min)
- [ ] 5.2. Implementacja uploadu plików do Storage (2-3 godz)
- [ ] 5.3. Implementacja pobierania plików z Storage (1 godz)
- [ ] 5.4. Integracja z `analysis_files` table (1 godz)
- [ ] 5.5. Test uploadu i pobierania (1 godz)

### ETAP 6: Optymalizacja i Cache (1-2 dni)
✅ **Czas: 6-10 godzin**

- [ ] 6.1. Implementacja cache'owania w store'ach (2-3 godz)
- [ ] 6.2. Optymalizacja zapytań (indeksy, selecty) (2-3 godz)
- [ ] 6.3. Implementacja Real-time Subscriptions (opcjonalne) (2-4 godz)
- [ ] 6.4. Implementacja offline support (opcjonalne) (2-4 godz)

### ETAP 7: Testowanie (2-3 dni)
✅ **Czas: 12-16 godzin**

- [ ] 7.1. Testy jednostkowe (services) (4-6 godz)
- [ ] 7.2. Testy integracyjne (store'y + Supabase) (4-6 godz)
- [ ] 7.3. Testy E2E (pełny flow użytkownika) (4-6 godz)
- [ ] 7.4. Testy zabezpieczeń (RLS) (2-3 godz)
- [ ] 7.5. Testy wydajnościowe (1-2 godz)

### ETAP 8: Migracja danych produkcyjnych (1 dzień)
✅ **Czas: 4-6 godzin**

- [ ] 8.1. Przygotowanie skryptu migracji (2 godz)
- [ ] 8.2. Test migracji na staging (1 godz)
- [ ] 8.3. Migracja danych produkcyjnych (1 godz)
- [ ] 8.4. Weryfikacja migracji (1-2 godz)

### ETAP 9: Monitoring i dokumentacja (1 dzień)
✅ **Czas: 4-6 godzin**

- [ ] 9.1. Konfiguracja monitoringu (Supabase Dashboard) (1 godz)
- [ ] 9.2. Konfiguracja alertów (1 godz)
- [ ] 9.3. Dokumentacja dla zespołu (2-3 godz)
- [ ] 9.4. Dokumentacja dla użytkowników (1 godz)

### ETAP 10: Deployment (1 dzień)
✅ **Czas: 4-6 godzin**

- [ ] 10.1. Przygotowanie środowiska produkcyjnego (1 godz)
- [ ] 10.2. Deploy aplikacji (30 min)
- [ ] 10.3. Test na produkcji (2-3 godz)
- [ ] 10.4. Monitoring po deploy (1 godz)

---

## Testowanie

### Strategia testowania

#### 1. Testy zabezpieczeń (RLS)

**Cel**: Upewnić się, że użytkownicy widzą TYLKO swoje dane

**Scenariusze testowe**:

1. **Test 1: Izolacja analiz**
   - Użytkownik A tworzy analizę
   - Użytkownik B próbuje pobrać analizę użytkownika A
   - **Oczekiwany wynik**: Brak dostępu (pusta lista)

2. **Test 2: Izolacja reguł**
   - Użytkownik A tworzy regułę
   - Użytkownik B próbuje pobrać reguły użytkownika A
   - **Oczekiwany wynik**: Brak dostępu (pusta lista)

3. **Test 3: Próba modyfikacji cudzych danych**
   - Użytkownik A tworzy analizę
   - Użytkownik B próbuje zaktualizować analizę użytkownika A
   - **Oczekiwany wynik**: Błąd 403 (Forbidden)

**Implementacja testu**:

```typescript
// test/rls.test.ts
import { createClient } from '@supabase/supabase-js'

describe('Row Level Security', () => {
  let userAClient: any
  let userBClient: any

  beforeAll(async () => {
    // Inicjalizacja klientów dla różnych użytkowników
    userAClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${USER_A_TOKEN}` } }
    })
    
    userBClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${USER_B_TOKEN}` } }
    })
  })

  test('User A cannot see User B analyses', async () => {
    // User B tworzy analizę
    const { data: analysis } = await userBClient
      .from('analyses')
      .insert({ name: 'User B Analysis', user_id: USER_B_ID })
      .select()
      .single()

    // User A próbuje pobrać analizy
    const { data: userAAnalyses } = await userAClient
      .from('analyses')
      .select('*')

    // User A nie powinien widzieć analizy User B
    expect(userAAnalyses).not.toContainEqual(
      expect.objectContaining({ id: analysis.id })
    )
  })

  test('User A cannot update User B analysis', async () => {
    // User B tworzy analizę
    const { data: analysis } = await userBClient
      .from('analyses')
      .insert({ name: 'User B Analysis', user_id: USER_B_ID })
      .select()
      .single()

    // User A próbuje zaktualizować analizę User B
    const { error } = await userAClient
      .from('analyses')
      .update({ name: 'Hacked!' })
      .eq('id', analysis.id)

    // Powinien być błąd
    expect(error).toBeTruthy()
    expect(error?.code).toBe('42501') // Insufficient privilege
  })
})
```

#### 2. Testy integracyjne (Store + Supabase)

```typescript
// test/analysisStore.test.ts
import { useAnalysisStore } from '../stores/analysisStore'

describe('Analysis Store Integration', () => {
  beforeEach(async () => {
    // Czyszczenie bazy
    await cleanDatabase()
  })

  test('Create and load analysis', async () => {
    const store = useAnalysisStore.getState()
    store.setUserId(TEST_USER_ID)

    // Tworzenie analizy
    const analysis = await store.createAnalysis('Test Analysis', 'Description')
    expect(analysis).toBeTruthy()
    expect(analysis.name).toBe('Test Analysis')

    // Ładowanie analiz
    await store.loadAnalyses()
    expect(store.analyses).toHaveLength(1)
    expect(store.analyses[0].id).toBe(analysis.id)
  })

  test('Update analysis', async () => {
    const store = useAnalysisStore.getState()
    store.setUserId(TEST_USER_ID)

    // Tworzenie i aktualizacja
    const analysis = await store.createAnalysis('Test')
    await store.updateAnalysis(analysis.id, { name: 'Updated' })

    // Weryfikacja
    await store.loadAnalyses()
    expect(store.analyses[0].name).toBe('Updated')
  })
})
```

#### 3. Testy E2E (Playwright / Cypress)

```typescript
// e2e/analysis.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Analysis Flow', () => {
  test('User can create, view, and delete analysis', async ({ page }) => {
    // Logowanie
    await page.goto('/sign-in')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Utworzenie analizy
    await page.goto('/analysis')
    await page.click('button:has-text("Nowa analiza")')
    await page.fill('[name="name"]', 'E2E Test Analysis')
    await page.click('button:has-text("Utwórz")')

    // Weryfikacja
    await expect(page.locator('text=E2E Test Analysis')).toBeVisible()

    // Usunięcie
    await page.click('[aria-label="Usuń analizę"]')
    await page.click('button:has-text("Potwierdź")')
    await expect(page.locator('text=E2E Test Analysis')).not.toBeVisible()
  })

  test('User cannot see other users analyses', async ({ page, browser }) => {
    // Użytkownik A tworzy analizę
    await page.goto('/sign-in')
    // ... logowanie User A ...
    await page.click('button:has-text("Nowa analiza")')
    await page.fill('[name="name"]', 'User A Analysis')
    await page.click('button:has-text("Utwórz")')

    // Wylogowanie
    await page.click('[aria-label="Menu użytkownika"]')
    await page.click('button:has-text("Wyloguj")')

    // Użytkownik B loguje się
    const context2 = await browser.newContext()
    const page2 = await context2.newPage()
    await page2.goto('/sign-in')
    // ... logowanie User B ...
    
    // Weryfikacja: User B nie widzi analizy User A
    await page2.goto('/analysis')
    await expect(page2.locator('text=User A Analysis')).not.toBeVisible()
  })
})
```

---

## Monitoring i utrzymanie

### 1. Monitoring w Supabase Dashboard

**Metryki do monitorowania**:
- Liczba zapytań / dzień
- Czas odpowiedzi API
- Użycie storage (GB)
- Liczba aktywnych połączeń
- Błędy (error rate)

**Jak ustawić alerty**:
1. Przejdź do Supabase Dashboard → Reports
2. Skonfiguruj alerty dla:
   - CPU usage > 80%
   - Storage usage > 80%
   - Error rate > 5%

### 2. Logi i debugging

```typescript
// src/lib/logger.ts
export const logger = {
  error(message: string, error: any, metadata?: any) {
    console.error(`[ERROR] ${message}`, error, metadata)
    
    // Opcjonalnie: wysyłanie do zewnętrznego serwisu (Sentry, LogRocket)
    // Sentry.captureException(error, { extra: metadata })
  },

  info(message: string, metadata?: any) {
    console.log(`[INFO] ${message}`, metadata)
  },

  warn(message: string, metadata?: any) {
    console.warn(`[WARN] ${message}`, metadata)
  },
}

// Użycie w store:
try {
  const analyses = await analysisService.getAll(userId)
  set({ analyses })
} catch (error) {
  logger.error('Failed to load analyses', error, { userId })
  set({ error: error.message })
}
```

### 3. Backup i recovery

**Automatyczne backupy**:
- Supabase Free: backupy codzienne (7 dni retencji)
- Supabase Pro: backupy codzienne (30 dni retencji) + Point-in-Time Recovery

**Ręczne backupy**:
```bash
# Eksport całej bazy
pg_dump -h db.xxxxxxxxxxxxx.supabase.co -U postgres -d postgres > backup.sql

# Eksport tylko danych użytkownika
supabase db dump --data-only > data-backup.sql
```

### 4. Optymalizacja wydajności

**Indeksy**:
- Upewnij się, że wszystkie często używane kolumny mają indeksy
- Monitoruj wolne zapytania (Supabase Dashboard → Performance)

**Cache'owanie**:
```typescript
// Przykład: cache analiz w memory na 5 minut
let analysisCache: { data: Analysis[], timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minut

export const analysisService = {
  async getAll(userId: string, useCache = true): Promise<Analysis[]> {
    // Sprawdzenie cache
    if (useCache && analysisCache && Date.now() - analysisCache.timestamp < CACHE_TTL) {
      return analysisCache.data
    }

    // Pobranie z Supabase
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    // Zapisanie w cache
    analysisCache = {
      data: data.map(this.toAnalysis),
      timestamp: Date.now(),
    }

    return analysisCache.data
  },
}
```

---

## Podsumowanie

### Całkowity czas wdrożenia
**Szacowany czas: 10-15 dni roboczych (80-120 godzin)**

### Kluczowe korzyści
✅ **Pełna izolacja danych** - każdy użytkownik widzi tylko swoje dane  
✅ **Synchronizacja** - dane dostępne z każdego urządzenia  
✅ **Skalowalność** - Supabase obsługuje miliony rekordów  
✅ **Bezpieczeństwo** - Row Level Security na poziomie bazy danych  
✅ **Łatwość utrzymania** - Supabase zarządza infrastrukturą  

### Następne kroki
1. ☑️ Przeczytaj ten dokument dokładnie
2. ☑️ Utwórz konto Supabase i projekt
3. ☑️ Zacznij od ETAPU 0 (przygotowanie środowiska)
4. ☑️ Postępuj zgodnie z planem krok po kroku
5. ☑️ Testuj każdy etap przed przejściem do następnego

### Wsparcie
- **Dokumentacja Supabase**: https://supabase.com/docs
- **Dokumentacja Clerk**: https://clerk.com/docs
- **PostgreSQL**: https://www.postgresql.org/docs/

---

**Powodzenia w implementacji! 🚀**


