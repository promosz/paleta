-- =====================================================
-- CZYSZCZENIE DANYCH TESTOWYCH Z BAZY DANYCH
-- =====================================================
-- Ten skrypt usuwa TYLKO dane testowe, NIE strukturę!
-- Zachowuje: tabele, funkcje, triggery, RLS policies
-- Usuwa: dane użytkowników (oprócz struktur Clerk)
-- =====================================================

-- UWAGA: Ten skrypt NIE usuwa użytkowników z Clerk!
-- Clerk działa niezależnie i te dane są bezpieczne.

-- Wyświetl informacje przed czyszczeniem
DO $$
DECLARE
  users_count INTEGER;
  analyses_count INTEGER;
  rules_count INTEGER;
  files_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO users_count FROM users;
  SELECT COUNT(*) INTO analyses_count FROM analyses;
  SELECT COUNT(*) INTO rules_count FROM rules;
  SELECT COUNT(*) INTO files_count FROM analysis_files;
  
  RAISE NOTICE '📊 PRZED CZYSZCZENIEM:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Pliki: %', files_count;
  RAISE NOTICE '';
  RAISE NOTICE '🗑️  Rozpoczynam czyszczenie...';
END $$;

-- =====================================================
-- KROK 1: Usuwanie danych użytkowników
-- =====================================================

-- Najpierw usuwamy dane zależne (kolejność ważna!)
DELETE FROM analysis_files;
DELETE FROM analyses;
DELETE FROM rules;
DELETE FROM user_settings;

-- Na końcu użytkownicy (będą ponownie utworzeni przez Clerk webhook)
DELETE FROM users;

-- NIE usuwamy rule_templates - to są globalne szablony!

-- =====================================================
-- KROK 2: Reset sekwencji (opcjonalne)
-- =====================================================

-- Sekwencje UUID nie wymagają resetu, ale gdyby były SERIAL...
-- ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;

-- =====================================================
-- KROK 3: Vacuum dla optymalizacji
-- =====================================================

VACUUM ANALYZE users;
VACUUM ANALYZE analyses;
VACUUM ANALYZE rules;
VACUUM ANALYZE analysis_files;
VACUUM ANALYZE user_settings;

-- =====================================================
-- PODSUMOWANIE
-- =====================================================

DO $$
DECLARE
  users_count INTEGER;
  analyses_count INTEGER;
  rules_count INTEGER;
  templates_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO users_count FROM users;
  SELECT COUNT(*) INTO analyses_count FROM analyses;
  SELECT COUNT(*) INTO rules_count FROM rules;
  SELECT COUNT(*) INTO templates_count FROM rule_templates;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Czyszczenie zakończone!';
  RAISE NOTICE '📊 PO CZYSZCZENIU:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Szablony reguł: % (zachowane)', templates_count;
  RAISE NOTICE '';
  RAISE NOTICE '💡 UWAGA:';
  RAISE NOTICE '  - Tabele i struktura: ZACHOWANE ✅';
  RAISE NOTICE '  - RLS Policies: ZACHOWANE ✅';
  RAISE NOTICE '  - Rule Templates: ZACHOWANE ✅';
  RAISE NOTICE '  - Clerk Auth: DZIAŁA NORMALNIE ✅';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Przy następnym logowaniu Clerk automatycznie utworzy użytkownika w bazie.';
END $$;









