-- Naprawa polityk Row Level Security (RLS) dla Supabase
-- Uruchom ten skrypt w Supabase Dashboard → SQL Editor

-- 1. Włącz RLS dla wszystkich tabel
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Usuń wszystkie istniejące polityki (żeby zacząć od nowa)
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can insert own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;

DROP POLICY IF EXISTS "Users can view own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can insert own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can update own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can delete own analysis files" ON analysis_files;

DROP POLICY IF EXISTS "Users can view own rules" ON rules;
DROP POLICY IF EXISTS "Users can insert own rules" ON rules;
DROP POLICY IF EXISTS "Users can update own rules" ON rules;
DROP POLICY IF EXISTS "Users can delete own rules" ON rules;

DROP POLICY IF EXISTS "Anyone can view rule templates" ON rule_templates;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 3. Utwórz nowe polityki dla tabeli 'analyses'
CREATE POLICY "Users can view own analyses" ON analyses
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own analyses" ON analyses
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own analyses" ON analyses
    FOR DELETE USING (auth.uid()::text = user_id);

-- 4. Utwórz polityki dla tabeli 'analysis_files'
CREATE POLICY "Users can view own analysis files" ON analysis_files
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own analysis files" ON analysis_files
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own analysis files" ON analysis_files
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own analysis files" ON analysis_files
    FOR DELETE USING (auth.uid()::text = user_id);

-- 5. Utwórz polityki dla tabeli 'rules'
CREATE POLICY "Users can view own rules" ON rules
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own rules" ON rules
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own rules" ON rules
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own rules" ON rules
    FOR DELETE USING (auth.uid()::text = user_id);

-- 6. Utwórz polityki dla tabeli 'rule_templates' (dostępne dla wszystkich)
CREATE POLICY "Anyone can view rule templates" ON rule_templates
    FOR SELECT USING (true);

-- 7. Utwórz polityki dla tabeli 'users'
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- 8. Dla testów - tymczasowo wyłącz RLS (TYLKO DO TESTOWANIA!)
-- UWAGA: To jest niebezpieczne w produkcji!
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 9. Sprawdź status RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('analyses', 'analysis_files', 'rules', 'rule_templates', 'users');

