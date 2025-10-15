-- SPRAWDŹ LICZBY REKORDÓW W TABELACH
-- Uruchom to w Supabase Dashboard → SQL Editor

-- Sprawdź ile rekordów jest w każdej tabeli
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'analyses' as table_name, COUNT(*) as record_count FROM analyses
UNION ALL
SELECT 'analysis_files' as table_name, COUNT(*) as record_count FROM analysis_files
UNION ALL
SELECT 'rules' as table_name, COUNT(*) as record_count FROM rules
UNION ALL
SELECT 'rule_templates' as table_name, COUNT(*) as record_count FROM rule_templates
ORDER BY table_name;
