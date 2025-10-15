-- =====================================================
-- SPRAWDZENIE POLITYK RLS DLA TABELI USERS
-- =====================================================

-- Sprawdź wszystkie polityki dla tabeli users
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Sprawdź czy RLS jest włączony dla tabeli users
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    relforcerowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- INFO
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🔍 SPRAWDZENIE POLITYK RLS';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Powyżej widzisz wszystkie polityki RLS dla tabeli users';
  RAISE NOTICE '📋 Sprawdź czy istnieje: "Temporary: Allow user insert"';
  RAISE NOTICE '';
  RAISE NOTICE '✅ Jeśli polityka istnieje - RLS jest naprawiony!';
  RAISE NOTICE '❌ Jeśli nie ma polityki - musimy ją utworzyć';
  RAISE NOTICE '';
END $$;




