# 🐛 DEBUG: Błąd ładowania użytkownika

## Co sprawdzić w Console (F12):

1. **Otwórz DevTools (F12)**
2. **Przejdź do zakładki Console**
3. **Szukaj błędów:**
   - `Error ensuring user in Supabase:`
   - `Error creating user:`
   - `Error updating user:`
   - Jakiekolwiek błędy związane z Supabase

## Możliwe przyczyny:

### 1. RLS Policy nadal blokuje INSERT
**Rozwiązanie:** Uruchom FIX_USERS_INSERT.sql w Supabase

### 2. Brak uprawnień dla anon_key
**Rozwiązanie:** Sprawdź czy VITE_SUPABASE_ANON_KEY jest poprawny

### 3. Clerk JWT nie zawiera 'sub'
**Rozwiązanie:** Sprawdź token w Clerk Dashboard

### 4. Tabela users nie istnieje lub RLS wyłączony
**Rozwiązanie:** Uruchom ponownie CREATE_TABLES

## Co zrobić teraz:

1. Sprawdź console i skopiuj DOKŁADNY błąd
2. Sprawdź Supabase Logs (Dashboard → Logs)
3. Uruchom test połączenia (poniżej)








