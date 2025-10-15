-- =====================================================
-- WŁĄCZENIE RLS I POLITYK BEZPIECZEŃSTWA
-- =====================================================

-- 1. WŁĄCZENIE RLS DLA WSZYSTKICH TABEL
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates ENABLE ROW LEVEL SECURITY;

-- 2. USUNIĘCIE ISTNIEJĄCYCH POLITYK (jeśli istnieją)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can view own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can create own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can update own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can delete own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can view own rules" ON rules;
DROP POLICY IF EXISTS "Users can create own rules" ON rules;
DROP POLICY IF EXISTS "Users can update own rules" ON rules;
DROP POLICY IF EXISTS "Users can delete own rules" ON rules;
DROP POLICY IF EXISTS "Users can view rule templates" ON rule_templates;
DROP POLICY IF EXISTS "Users can create rule templates" ON rule_templates;
DROP POLICY IF EXISTS "Users can update rule templates" ON rule_templates;
DROP POLICY IF EXISTS "Users can delete rule templates" ON rule_templates;

-- 3. POLITYKI DLA TABELI USERS
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = clerk_user_id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = clerk_user_id);

-- 4. POLITYKI DLA TABELI ANALYSES
CREATE POLICY "Users can view own analyses" ON analyses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = analyses.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own analyses" ON analyses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = analyses.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own analyses" ON analyses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = analyses.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own analyses" ON analyses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = analyses.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

-- 5. POLITYKI DLA TABELI ANALYSIS_FILES
CREATE POLICY "Users can view own analysis files" ON analysis_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM analyses
            JOIN users ON users.id = analyses.user_id
            WHERE analyses.id = analysis_files.analysis_id
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own analysis files" ON analysis_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM analyses
            JOIN users ON users.id = analyses.user_id
            WHERE analyses.id = analysis_files.analysis_id
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own analysis files" ON analysis_files
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM analyses
            JOIN users ON users.id = analyses.user_id
            WHERE analyses.id = analysis_files.analysis_id
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own analysis files" ON analysis_files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM analyses
            JOIN users ON users.id = analyses.user_id
            WHERE analyses.id = analysis_files.analysis_id
            AND users.clerk_user_id = auth.uid()::text
        )
    );

-- 6. POLITYKI DLA TABELI RULES
CREATE POLICY "Users can view own rules" ON rules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = rules.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own rules" ON rules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = rules.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own rules" ON rules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = rules.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can delete own rules" ON rules
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = rules.user_id 
            AND users.clerk_user_id = auth.uid()::text
        )
    );

-- 7. POLITYKI DLA TABELI RULE_TEMPLATES (wszyscy użytkownicy mogą widzieć szablony)
CREATE POLICY "Users can view rule templates" ON rule_templates
    FOR SELECT USING (true);

CREATE POLICY "Users can create rule templates" ON rule_templates
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update rule templates" ON rule_templates
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete rule templates" ON rule_templates
    FOR DELETE USING (true);

-- 8. SPRAWDZENIE STATUSU RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'analyses', 'analysis_files', 'rules', 'rule_templates');

-- 9. SPRAWDZENIE POLITYK
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'analyses', 'analysis_files', 'rules', 'rule_templates')
ORDER BY tablename, policyname;
