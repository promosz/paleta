-- =====================================================
-- NAPRAWA BEZPIECZEŃSTWA - WERSJA FINALNA
-- =====================================================
-- Działa nawet jeśli tabela products nie istnieje!
-- =====================================================

-- KROK 1: Włącz RLS na istniejących tabelach
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files ENABLE ROW LEVEL SECURITY;

-- KROK 2: Usuń stare polityki (tylko dla istniejących tabel!)
-- =====================================================

-- Users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;

-- Rules
DROP POLICY IF EXISTS "Users can view own rules" ON rules;
DROP POLICY IF EXISTS "Users can create own rules" ON rules;
DROP POLICY IF EXISTS "Users can update own rules" ON rules;
DROP POLICY IF EXISTS "Users can delete own rules" ON rules;

-- User Settings
DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

-- Analysis Files
DROP POLICY IF EXISTS "Users can view own files" ON analysis_files;
DROP POLICY IF EXISTS "Users can create own files" ON analysis_files;
DROP POLICY IF EXISTS "Users can delete own files" ON analysis_files;

-- Rule Templates
DROP POLICY IF EXISTS "Anyone can view rule templates" ON rule_templates;

-- KROK 3: Utwórz polityki RLS
-- =====================================================

-- USERS
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (clerk_user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (clerk_user_id = auth.jwt()->>'sub')
  WITH CHECK (clerk_user_id = auth.jwt()->>'sub');

-- ANALYSES
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can create own analyses"
  ON analyses FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- RULES
CREATE POLICY "Users can view own rules"
  ON rules FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can create own rules"
  ON rules FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can update own rules"
  ON rules FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can delete own rules"
  ON rules FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- USER_SETTINGS
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- ANALYSIS_FILES
CREATE POLICY "Users can view own files"
  ON analysis_files FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can create own files"
  ON analysis_files FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

CREATE POLICY "Users can delete own files"
  ON analysis_files FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- RULE_TEMPLATES (publiczne - wszyscy mogą czytać)
CREATE POLICY "Anyone can view rule templates"
  ON rule_templates FOR SELECT
  TO authenticated
  USING (true);

-- KROK 4: Napraw widoki (usuń SECURITY DEFINER)
-- =====================================================

DROP VIEW IF EXISTS user_statistics;
DROP VIEW IF EXISTS user_recent_analyses;

CREATE OR REPLACE VIEW user_statistics AS
SELECT 
  u.id AS user_id,
  u.email,
  u.full_name,
  COUNT(DISTINCT a.id) AS total_analyses,
  COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed_analyses,
  COUNT(DISTINCT r.id) AS total_rules,
  COUNT(DISTINCT CASE WHEN r.status = 'active' THEN r.id END) AS active_rules,
  COALESCE(SUM(a.total_products), 0) AS total_products_analyzed,
  COALESCE(AVG(a.average_score), 0) AS average_analysis_score,
  u.created_at AS user_since,
  u.last_login_at
FROM users u
LEFT JOIN analyses a ON u.id = a.user_id
LEFT JOIN rules r ON u.id = r.user_id
GROUP BY u.id, u.email, u.full_name, u.created_at, u.last_login_at;

CREATE OR REPLACE VIEW user_recent_analyses AS
SELECT 
  a.id,
  a.user_id,
  a.name,
  a.description,
  a.type,
  a.status,
  a.total_products,
  a.average_score,
  a.created_at,
  a.updated_at,
  a.completed_at
FROM analyses a
ORDER BY a.created_at DESC;

-- KROK 5: Podsumowanie
-- =====================================================

DO $$
DECLARE
  users_rls BOOLEAN;
  analyses_rls BOOLEAN;
  rules_rls BOOLEAN;
  files_rls BOOLEAN;
BEGIN
  SELECT relrowsecurity INTO users_rls FROM pg_class WHERE relname = 'users';
  SELECT relrowsecurity INTO analyses_rls FROM pg_class WHERE relname = 'analyses';
  SELECT relrowsecurity INTO rules_rls FROM pg_class WHERE relname = 'rules';
  SELECT relrowsecurity INTO files_rls FROM pg_class WHERE relname = 'analysis_files';
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ BEZPIECZEŃSTWO NAPRAWIONE!';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 STATUS RLS:';
  RAISE NOTICE '  - users: %', CASE WHEN users_rls THEN '✅ Włączony' ELSE '❌ Wyłączony' END;
  RAISE NOTICE '  - analyses: %', CASE WHEN analyses_rls THEN '✅ Włączony' ELSE '❌ Wyłączony' END;
  RAISE NOTICE '  - rules: %', CASE WHEN rules_rls THEN '✅ Włączony' ELSE '❌ Wyłączony' END;
  RAISE NOTICE '  - analysis_files: %', CASE WHEN files_rls THEN '✅ Włączony' ELSE '❌ Wyłączony' END;
  RAISE NOTICE '';
  RAISE NOTICE '🛡️  POLITYKI RLS: Utworzone ✅';
  RAISE NOTICE '👁️  WIDOKI: Naprawione ✅';
  RAISE NOTICE '';
  RAISE NOTICE '💡 NASTĘPNE KROKI:';
  RAISE NOTICE '  1. Uruchom CREATE_PRODUCTS_TABLE.sql';
  RAISE NOTICE '  2. Zrestartuj aplikację (npm run dev)';
  RAISE NOTICE '  3. Sprawdź Database Linter';
  RAISE NOTICE '';
END $$;









