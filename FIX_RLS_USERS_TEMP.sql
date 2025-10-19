-- =====================================================
-- TYMCZASOWA NAPRAWA RLS DLA USERS
-- =====================================================
-- Pozwala na INSERT bez JWT (dla anon key)
-- UWAGA: To jest tymczasowe rozwiązanie!
-- =====================================================

-- Usuń wszystkie polityki INSERT
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Allow user self-registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- TYMCZASOWA polityka: Pozwól na INSERT z anon key
-- UWAGA: To pozwala każdemu authenticated użytkownikowi dodać użytkownika
-- ale sprawdzamy clerk_user_id po stronie aplikacji
CREATE POLICY "Temporary: Allow user insert"
  ON users FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- INFO
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  TYMCZASOWA NAPRAWA RLS!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '✅ INSERT na users jest teraz dozwolony';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  UWAGA:';
  RAISE NOTICE '  - To jest TYMCZASOWE rozwiązanie!';
  RAISE NOTICE '  - Pozwala na INSERT z anon key';
  RAISE NOTICE '  - Clerk App nadal sprawdza czy clerk_user_id jest poprawny';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Następne kroki:';
  RAISE NOTICE '  1. Odśwież aplikację w przeglądarce';
  RAISE NOTICE '  2. Sprawdź console (F12) - szukaj logów';
  RAISE NOTICE '  3. System powinien utworzyć użytkownika';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 PÓŹNIEJ (gdy wszystko działa):';
  RAISE NOTICE '  - Skonfiguruj Clerk JWT w Supabase';
  RAISE NOTICE '  - Zamień na właściwą politykę RLS';
  RAISE NOTICE '';
END $$;








