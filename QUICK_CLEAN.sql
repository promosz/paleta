-- =====================================================
-- SZYBKIE CZYSZCZENIE DANYCH - URUCHOM W SUPABASE
-- =====================================================
-- Skopiuj poniższy kod i wklej do Supabase SQL Editor
-- =====================================================

-- Wyświetl stan PRZED czyszczeniem
DO $$
DECLARE
  users_count INTEGER;
  analyses_count INTEGER;
  rules_count INTEGER;
  files_count INTEGER;
  products_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO users_count FROM users;
  SELECT COUNT(*) INTO analyses_count FROM analyses;
  SELECT COUNT(*) INTO rules_count FROM rules;
  SELECT COUNT(*) INTO files_count FROM analysis_files;
  SELECT COUNT(*) INTO products_count FROM products WHERE true; -- sprawdź czy tabela istnieje
  
  RAISE NOTICE '';
  RAISE NOTICE '🗑️  CZYSZCZENIE DANYCH';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📊 PRZED:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  RAISE NOTICE '  - Produkty: %', products_count;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Pliki: %', files_count;
  RAISE NOTICE '';
EXCEPTION
  WHEN OTHERS THEN
    -- Tabela products może nie istnieć
    SELECT COUNT(*) INTO users_count FROM users;
    SELECT COUNT(*) INTO analyses_count FROM analyses;
    SELECT COUNT(*) INTO rules_count FROM rules;
    SELECT COUNT(*) INTO files_count FROM analysis_files;
    
    RAISE NOTICE '';
    RAISE NOTICE '🗑️  CZYSZCZENIE DANYCH';
    RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
    RAISE NOTICE '';
    RAISE NOTICE '📊 PRZED:';
    RAISE NOTICE '  - Użytkownicy: %', users_count;
    RAISE NOTICE '  - Analizy: %', analyses_count;
    RAISE NOTICE '  - Produkty: (tabela nie istnieje)';
    RAISE NOTICE '  - Reguły: %', rules_count;
    RAISE NOTICE '  - Pliki: %', files_count;
    RAISE NOTICE '';
END $$;

-- Usuń dane (kolejność ważna - najpierw zależności!)
DELETE FROM products WHERE true;
DELETE FROM analysis_files;
DELETE FROM analyses;
DELETE FROM rules;
DELETE FROM user_settings;
DELETE FROM users;

-- NIE usuwamy rule_templates - to są globalne szablony!

-- Vacuum dla optymalizacji
VACUUM ANALYZE users;
VACUUM ANALYZE analyses;
VACUUM ANALYZE rules;
VACUUM ANALYZE analysis_files;
VACUUM ANALYZE products;

-- Wyświetl stan PO czyszczeniu
DO $$
DECLARE
  users_count INTEGER;
  analyses_count INTEGER;
  rules_count INTEGER;
  files_count INTEGER;
  products_count INTEGER;
  templates_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO users_count FROM users;
  SELECT COUNT(*) INTO analyses_count FROM analyses;
  SELECT COUNT(*) INTO rules_count FROM rules;
  SELECT COUNT(*) INTO files_count FROM analysis_files;
  SELECT COUNT(*) INTO templates_count FROM rule_templates;
  
  BEGIN
    SELECT COUNT(*) INTO products_count FROM products;
  EXCEPTION
    WHEN OTHERS THEN
      products_count := -1; -- Tabela nie istnieje
  END;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ CZYSZCZENIE ZAKOŃCZONE!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📊 PO:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  IF products_count >= 0 THEN
    RAISE NOTICE '  - Produkty: %', products_count;
  ELSE
    RAISE NOTICE '  - Produkty: (tabela nie istnieje)';
  END IF;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Pliki: %', files_count;
  RAISE NOTICE '  - Szablony reguł: % (zachowane ✅)', templates_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 GOTOWE!';
  RAISE NOTICE '';
  RAISE NOTICE '💡 CO DALEJ:';
  RAISE NOTICE '  1. Uruchom CREATE_PRODUCTS_TABLE.sql (jeśli nie ma tabeli)';
  RAISE NOTICE '  2. Zrestartuj aplikację';
  RAISE NOTICE '  3. Zaloguj się ponownie (Clerk utworzy użytkownika)';
  RAISE NOTICE '  4. Wrzuć plik testowy';
  RAISE NOTICE '';
END $$;






