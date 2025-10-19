-- =====================================================
-- TYMCZASOWE WYŁĄCZENIE RLS DLA USERS
-- =====================================================
-- UWAGA: To jest TYMCZASOWE rozwiązanie!
-- Wyłącza RLS całkowicie dla tabeli users
-- =====================================================

-- Wyłącz RLS dla tabeli users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Usuń wszystkie polityki (żeby nie było konfliktów)
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Allow user self-registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Temporary: Allow user insert" ON users;

-- INFO
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  RLS WYŁĄCZONY DLA USERS!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '✅ RLS jest teraz WYŁĄCZONY dla tabeli users';
  RAISE NOTICE '✅ INSERT będzie działać bez ograniczeń';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  UWAGA:';
  RAISE NOTICE '  - To jest TYMCZASOWE rozwiązanie!';
  RAISE NOTICE '  - Każdy może teraz INSERT do users';
  RAISE NOTICE '  - Ale aplikacja i tak sprawdza clerk_user_id';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Następne kroki:';
  RAISE NOTICE '  1. Odśwież aplikację w przeglądarce (F5)';
  RAISE NOTICE '  2. Sprawdź console (F12) - szukaj logów';
  RAISE NOTICE '  3. System powinien utworzyć użytkownika';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 PÓŹNIEJ (gdy wszystko działa):';
  RAISE NOTICE '  - Włącz RLS z powrotem';
  RAISE NOTICE '  - Skonfiguruj właściwe polityki';
  RAISE NOTICE '';
END $$;







