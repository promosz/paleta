-- TYMCZASOWE WYŁĄCZENIE RLS DLA TESTÓW
-- Uruchom to w Supabase Dashboard → SQL Editor

-- Wyłącz RLS dla wszystkich tabel
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates DISABLE ROW LEVEL SECURITY;

-- Sprawdź status RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('analyses', 'analysis_files', 'rules', 'rule_templates', 'users');

-- Powinieneś zobaczyć wszystkie tabele z rowsecurity = false
