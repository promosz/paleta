-- =====================================================
-- NAPRAWA POLITYKI INSERT DLA TABELI USERS
-- =====================================================
-- Pozwala użytkownikowi utworzyć WŁASNY rekord w bazie
-- =====================================================

-- Usuń starą politykę (jeśli istnieje)
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;

-- Nowa polityka: Pozwól użytkownikowi utworzyć WŁASNY profil
CREATE POLICY "Allow user self-registration"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (clerk_user_id = auth.jwt()->>'sub');

-- Sprawdź status
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Polityka INSERT naprawiona!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE 'Użytkownik może teraz:';
  RAISE NOTICE '  1. Zalogować się przez Clerk ✅';
  RAISE NOTICE '  2. Utworzyć własny rekord w tabeli users ✅';
  RAISE NOTICE '  3. Korzystać z aplikacji ✅';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Następny krok:';
  RAISE NOTICE '  1. Odśwież stronę w przeglądarce';
  RAISE NOTICE '  2. System automatycznie utworzy użytkownika';
  RAISE NOTICE '';
END $$;





