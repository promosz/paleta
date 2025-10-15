-- =====================================================
-- CZYSZCZENIE DANYCH - BEZ TABELI PRODUCTS
-- =====================================================
-- Ten skrypt działa nawet jeśli tabela products nie istnieje
-- =====================================================

-- Wyświetl stan PRZED czyszczeniem
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
  
  RAISE NOTICE '';
  RAISE NOTICE '🗑️  CZYSZCZENIE DANYCH';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📊 PRZED:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Pliki: %', files_count;
  RAISE NOTICE '';
END $$;

-- Usuń dane (kolejność ważna - najpierw zależności!)
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

-- Wyświetl stan PO czyszczeniu
DO $$
DECLARE
  users_count INTEGER;
  analyses_count INTEGER;
  rules_count INTEGER;
  files_count INTEGER;
  templates_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO users_count FROM users;
  SELECT COUNT(*) INTO analyses_count FROM analyses;
  SELECT COUNT(*) INTO rules_count FROM rules;
  SELECT COUNT(*) INTO files_count FROM analysis_files;
  SELECT COUNT(*) INTO templates_count FROM rule_templates;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ CZYSZCZENIE ZAKOŃCZONE!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '📊 PO:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Pliki: %', files_count;
  RAISE NOTICE '  - Szablony reguł: % (zachowane ✅)', templates_count;
  RAISE NOTICE '';
  RAISE NOTICE '🎯 GOTOWE!';
  RAISE NOTICE '';
  RAISE NOTICE '💡 NASTĘPNE KROKI:';
  RAISE NOTICE '  1. Uruchom CREATE_PRODUCTS_TABLE.sql';
  RAISE NOTICE '  2. Zrestartuj aplikację (npm run dev)';
  RAISE NOTICE '  3. Zaloguj się ponownie';
  RAISE NOTICE '  4. Wrzuć plik testowy';
  RAISE NOTICE '';
END $$;






