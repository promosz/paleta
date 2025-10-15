# Checklist Wdrożenia Supabase

## ✅ ETAP 0: Przygotowanie środowiska (1 dzień)

### 0.1. Konfiguracja konta Supabase
- [ ] Rejestracja na https://supabase.com
- [ ] Utworzenie nowego projektu
  - [ ] Nazwa: `pallet-analysis-app`
  - [ ] Region: `Europe (Central EU) - Frankfurt`
  - [ ] Database Password: **[ZAPISZ BEZPIECZNIE]**
- [ ] Zapisanie danych połączenia
  - [ ] Project URL: `https://xxxxxxxxxxxxx.supabase.co`
  - [ ] API Key (anon): `eyJhbGc...`
  - [ ] API Key (service_role): `eyJhbGc...` *(NIE UJAWNIAJ!)*

### 0.2. Instalacja pakietów
```bash
cd /Users/macprzemek/Desktop/Cursor/App01
npm install @supabase/supabase-js
npm install --save-dev @supabase/postgrest-js
```
- [ ] Zainstalowano `@supabase/supabase-js`
- [ ] Zainstalowano `@supabase/postgrest-js` (dev)

### 0.3. Konfiguracja zmiennych środowiskowych
- [ ] Utworzono plik `.env.local`
- [ ] Dodano zmienne Supabase
  ```
  VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...
  ```
- [ ] Dodano `.env.local` do `.gitignore`
- [ ] Utworzono `.env.example` (bez kluczy)

### 0.4. Utworzenie klienta Supabase
- [ ] Utworzono plik `src/lib/supabase.ts`
- [ ] Zaimplementowano `createClient()`
- [ ] Zaimplementowano `getSupabaseClient()` (z Clerk token)
- [ ] Przetestowano połączenie

---

## ✅ ETAP 1: Baza danych (1 dzień)

### 1.1. Wykonanie migracji SQL
- [ ] Otwarto Supabase Dashboard → SQL Editor
- [ ] Skopiowano zawartość `docs/SUPABASE_MIGRATION.sql`
- [ ] Wykonano migrację (Run)
- [ ] Sprawdzono komunikat: "✅ Migracja zakończona pomyślnie!"

### 1.2. Weryfikacja tabel
- [ ] Sprawdzono tabelę `users` (Table Editor)
- [ ] Sprawdzono tabelę `analyses`
- [ ] Sprawdzono tabelę `rules`
- [ ] Sprawdzono tabelę `rule_templates`
- [ ] Sprawdzono tabelę `user_settings`
- [ ] Sprawdzono tabelę `analysis_files`

### 1.3. Weryfikacja indeksów
- [ ] Sprawdzono indeksy na `users`
- [ ] Sprawdzono indeksy na `analyses`
- [ ] Sprawdzono indeksy na `rules`

### 1.4. Weryfikacja danych przykładowych
- [ ] Sprawdzono szablony reguł (powinno być 10)
  ```sql
  SELECT COUNT(*) FROM rule_templates;
  ```

### 1.5. Test połączenia z aplikacji
- [ ] Uruchomiono aplikację: `npm run dev`
- [ ] Otwarto konsolę przeglądarki
- [ ] Wykonano test:
  ```typescript
  import { supabase } from './lib/supabase'
  const { data, error } = await supabase.from('rule_templates').select('*')
  console.log(data) // Powinno zwrócić 10 szablonów
  ```

---

## ✅ ETAP 2: Integracja z Clerk (1 dzień)

### 2.1. Konfiguracja Webhook w Clerk
- [ ] Zalogowano się do [Clerk Dashboard](https://dashboard.clerk.com)
- [ ] Przejdź do: **Webhooks** → **Add Endpoint**
- [ ] Dodano URL: `https://xxxxxxxxxxxxx.supabase.co/functions/v1/clerk-webhook`
- [ ] Wybrano eventy:
  - [ ] `user.created`
  - [ ] `user.updated`
  - [ ] `user.deleted`
- [ ] Zapisano **Signing Secret**: `whsec_xxxxxxxxxxxxx`

### 2.2. Instalacja Supabase CLI
```bash
npm install -g supabase
supabase login
supabase link --project-ref xxxxxxxxxxxxx
```
- [ ] Zainstalowano Supabase CLI
- [ ] Zalogowano się
- [ ] Połączono z projektem

### 2.3. Utworzenie Edge Function
```bash
supabase functions new clerk-webhook
```
- [ ] Utworzono Edge Function
- [ ] Skopiowano kod z planu wdrożenia
- [ ] Zaimplementowano weryfikację podpisu Svix

### 2.4. Deploy Edge Function
```bash
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
supabase secrets set SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

supabase functions deploy clerk-webhook
```
- [ ] Ustawiono secrets
- [ ] Zadeplowano funkcję
- [ ] Sprawdzono logi: `supabase functions logs clerk-webhook`

### 2.5. Test synchronizacji
- [ ] Utworzono testowego użytkownika w Clerk
- [ ] Sprawdzono, czy użytkownik pojawił się w tabeli `users`
  ```sql
  SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
  ```
- [ ] Sprawdzono, czy utworzono `user_settings`
  ```sql
  SELECT * FROM user_settings ORDER BY created_at DESC LIMIT 1;
  ```

### 2.6. Utworzenie helpera
- [ ] Utworzono plik `src/lib/supabaseHelpers.ts`
- [ ] Zaimplementowano `useSupabaseUserId()`
- [ ] Zaimplementowano `getSupabaseUserId()`
- [ ] Przetestowano

---

## ✅ ETAP 3: Row Level Security (1 dzień)

### 3.1. Weryfikacja RLS
- [ ] Sprawdzono, czy RLS jest włączony na wszystkich tabelach
  ```sql
  SELECT tablename, rowsecurity 
  FROM pg_tables 
  WHERE schemaname = 'public';
  ```

### 3.2. Test polityk RLS - users
- [ ] Test: Użytkownik widzi swój profil ✅
- [ ] Test: Użytkownik NIE widzi profili innych ❌

### 3.3. Test polityk RLS - analyses
- [ ] Test: Użytkownik widzi swoje analizy ✅
- [ ] Test: Użytkownik NIE widzi analiz innych ❌
- [ ] Test: Użytkownik może tworzyć analizy ✅
- [ ] Test: Użytkownik może aktualizować swoje analizy ✅
- [ ] Test: Użytkownik NIE może aktualizować analiz innych ❌
- [ ] Test: Użytkownik może usuwać swoje analizy ✅
- [ ] Test: Użytkownik NIE może usuwać analiz innych ❌

### 3.4. Test polityk RLS - rules
- [ ] Test: Użytkownik widzi swoje reguły ✅
- [ ] Test: Użytkownik NIE widzi reguł innych ❌
- [ ] Test: CRUD operacje działają poprawnie ✅

### 3.5. Konfiguracja Storage
- [ ] Utworzono bucket `analysis-files`
- [ ] Bucket jest prywatny (public = false)
- [ ] Utworzono polityki Storage (upload, select, delete)
- [ ] Przetestowano upload pliku

---

## ✅ ETAP 4: Migracja Store'ów (2-3 dni)

### 4.1. Utworzenie Service Layer
- [ ] Utworzono plik `src/services/supabaseService.ts`
- [ ] Zaimplementowano `analysisService`
  - [ ] `getAll()`
  - [ ] `getById()`
  - [ ] `create()`
  - [ ] `update()`
  - [ ] `delete()`
  - [ ] `toAnalysis()` (konwersja)
- [ ] Zaimplementowano `rulesService`
  - [ ] `getAll()`
  - [ ] `create()`
  - [ ] `update()`
  - [ ] `delete()`
  - [ ] `toRule()` (konwersja)
- [ ] Zaimplementowano `userSettingsService`
  - [ ] `get()`
  - [ ] `update()`

### 4.2. Aktualizacja analysisStore
- [ ] Dodano `userId` do state
- [ ] Dodano `setUserId()`
- [ ] Dodano `loadAnalyses()` (async)
- [ ] Zaktualizowano `createAnalysis()` (async + Supabase)
- [ ] Zaktualizowano `updateAnalysis()` (async + Supabase)
- [ ] Zaktualizowano `deleteAnalysis()` (async + Supabase)
- [ ] Dodano obsługę `isLoading` i `error`
- [ ] Usunięto `persist` middleware (dane w Supabase, nie localStorage)

### 4.3. Aktualizacja rulesStore
- [ ] Dodano `userId` do state
- [ ] Dodano `setUserId()`
- [ ] Dodano `loadRules()` (async)
- [ ] Zaktualizowano wszystkie akcje CRUD (async + Supabase)
- [ ] Dodano obsługę błędów
- [ ] Usunięto `persist` middleware

### 4.4. Inicjalizacja store'ów w App.tsx
- [ ] Dodano `useEffect` do inicjalizacji
- [ ] Pobrano Supabase `userId` z Clerk `userId`
- [ ] Ustawiono `userId` w store'ach
- [ ] Załadowano dane (`loadAnalyses()`, `loadRules()`)

### 4.5. Testy
- [ ] Test: Tworzenie analizy zapisuje do Supabase ✅
- [ ] Test: Aktualizacja analizy aktualizuje w Supabase ✅
- [ ] Test: Usunięcie analizy usuwa z Supabase ✅
- [ ] Test: Po przeładowaniu strony dane się ładują ✅
- [ ] Test: Różni użytkownicy nie widzą swoich danych ✅

---

## ✅ ETAP 5: Supabase Storage (1 dzień)

### 5.1. Konfiguracja Storage
- [ ] Utworzono bucket `analysis-files` w Dashboard
- [ ] Bucket jest prywatny
- [ ] Dodano polityki (w ETAP 3)

### 5.2. Implementacja uploadu
- [ ] Utworzono funkcję `uploadFile()` w `supabaseService.ts`
- [ ] Ścieżka pliku: `{userId}/{analysisId}/{fileName}`
- [ ] Dodano progress callback
- [ ] Zintegrowano z `uploadStore`

### 5.3. Implementacja pobierania
- [ ] Utworzono funkcję `getFileUrl()` (signed URL)
- [ ] Utworzono funkcję `downloadFile()`
- [ ] Zintegrowano z komponentami

### 5.4. Integracja z analysis_files
- [ ] Po upload → insert do `analysis_files`
- [ ] Po delete → delete z `analysis_files`

### 5.5. Testy
- [ ] Test: Upload pliku do Storage ✅
- [ ] Test: Pobieranie signed URL ✅
- [ ] Test: Download pliku ✅
- [ ] Test: Usunięcie pliku z Storage ✅
- [ ] Test: Metadane w `analysis_files` są poprawne ✅

---

## ✅ ETAP 6: Optymalizacja (1-2 dni)

### 6.1. Cache'owanie
- [ ] Zaimplementowano cache w `analysisService`
- [ ] Zaimplementowano cache w `rulesService`
- [ ] Cache TTL: 5 minut
- [ ] Invalidacja cache przy modyfikacji

### 6.2. Optymalizacja zapytań
- [ ] Dodano `select()` tylko potrzebnych kolumn
- [ ] Dodano limit/pagination gdzie potrzeba
- [ ] Sprawdzono wolne zapytania (Dashboard → Performance)

### 6.3. Real-time Subscriptions (opcjonalne)
- [ ] Zaimplementowano subskrypcję do `analyses`
- [ ] Zaimplementowano subskrypcję do `rules`
- [ ] Auto-update UI przy zmianach

---

## ✅ ETAP 7: Testowanie (2-3 dni)

### 7.1. Testy jednostkowe
- [ ] Testy `analysisService`
- [ ] Testy `rulesService`
- [ ] Testy `userSettingsService`

### 7.2. Testy integracyjne
- [ ] Testy `analysisStore` + Supabase
- [ ] Testy `rulesStore` + Supabase

### 7.3. Testy E2E
- [ ] Test: Cały flow tworzenia analizy
- [ ] Test: Cały flow zarządzania regułami
- [ ] Test: Izolacja między użytkownikami

### 7.4. Testy zabezpieczeń
- [ ] Test RLS: User A nie widzi danych User B
- [ ] Test RLS: User A nie może modyfikować danych User B
- [ ] Test Storage: User A nie może pobrać plików User B

---

## ✅ ETAP 8: Deployment (1 dzień)

### 8.1. Przygotowanie produkcji
- [ ] Utworzono projekt produkcyjny w Supabase (opcjonalnie)
- [ ] Skonfigurowano zmienne środowiskowe produkcyjne
- [ ] Wykonano migrację na produkcji

### 8.2. Deploy aplikacji
- [ ] Build aplikacji: `npm run build`
- [ ] Deploy (GitHub Pages / Vercel / Netlify)
- [ ] Sprawdzono połączenie z Supabase

### 8.3. Monitoring
- [ ] Sprawdzono Dashboard → Usage
- [ ] Ustawiono alerty

---

## 📝 Notatki

### Problemy napotkane podczas wdrożenia
```
[Miejsce na notatki]
```

### Przydatne linki
- Supabase Dashboard: https://supabase.com/dashboard/project/xxxxxxxxxxxxx
- Clerk Dashboard: https://dashboard.clerk.com
- Dokumentacja Supabase: https://supabase.com/docs
- Dokumentacja Clerk: https://clerk.com/docs

### Kontakty
- Support Supabase: https://supabase.com/support
- Support Clerk: https://clerk.com/support

---

**Data rozpoczęcia wdrożenia**: _______________  
**Data zakończenia wdrożenia**: _______________  
**Osoba odpowiedzialna**: _______________


