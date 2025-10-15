-- =====================================================
-- SUPABASE MIGRATION SCRIPT
-- Pallet Analysis App - Database Schema
-- =====================================================
-- Wykonaj ten skrypt w Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Wklej i uruchom
-- =====================================================

-- =====================================================
-- 1. FUNKCJE POMOCNICZE
-- =====================================================

-- Funkcja do automatycznej aktualizacji pola updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 2. TABELA: users
-- =====================================================

-- Tabela użytkowników (synchronizacja z Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. TABELA: analyses
-- =====================================================

-- Tabela analiz dokumentów
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Podstawowe dane
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'file_upload',
  status TEXT NOT NULL DEFAULT 'pending',
  
  -- Produkty i pliki (JSONB)
  products JSONB DEFAULT '[]'::jsonb,
  files JSONB DEFAULT '[]'::jsonb,
  evaluations JSONB DEFAULT '[]'::jsonb,
  
  -- Statystyki
  total_products INTEGER DEFAULT 0,
  valid_products INTEGER DEFAULT 0,
  invalid_products INTEGER DEFAULT 0,
  average_score DECIMAL(5,2) DEFAULT 0,
  
  -- Szczegółowe statystyki
  stats JSONB DEFAULT '{}'::jsonb,
  
  -- Metadane
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Daty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_type CHECK (type IN ('file_upload', 'manual', 'api')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  CONSTRAINT valid_average_score CHECK (average_score >= 0 AND average_score <= 100)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_type ON analyses(type);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_user_status ON analyses(user_id, status);

-- GIN indeksy dla JSONB
CREATE INDEX IF NOT EXISTS idx_analyses_products_gin ON analyses USING GIN (products);
CREATE INDEX IF NOT EXISTS idx_analyses_metadata_gin ON analyses USING GIN (metadata);

-- Trigger
DROP TRIGGER IF EXISTS analyses_updated_at ON analyses;
CREATE TRIGGER analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. TABELA: rules
-- =====================================================

-- Tabela reguł użytkowników
CREATE TABLE IF NOT EXISTS rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Podstawowe dane
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive',
  weight INTEGER NOT NULL DEFAULT 5,
  
  -- Warunki (JSONB)
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Daty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_type CHECK (type IN ('budget', 'category', 'quality')),
  CONSTRAINT valid_action CHECK (action IN ('block', 'warn', 'prefer')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive')),
  CONSTRAINT valid_weight CHECK (weight >= 1 AND weight <= 10)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_rules_user_id ON rules(user_id);
CREATE INDEX IF NOT EXISTS idx_rules_type ON rules(type);
CREATE INDEX IF NOT EXISTS idx_rules_status ON rules(status);
CREATE INDEX IF NOT EXISTS idx_rules_user_status ON rules(user_id, status);
CREATE INDEX IF NOT EXISTS idx_rules_conditions_gin ON rules USING GIN (conditions);

-- Trigger
DROP TRIGGER IF EXISTS rules_updated_at ON rules;
CREATE TRIGGER rules_updated_at
  BEFORE UPDATE ON rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. TABELA: rule_templates
-- =====================================================

-- Tabela szablonów reguł (globalne)
CREATE TABLE IF NOT EXISTS rule_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Podstawowe dane
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 5,
  
  -- Warunki
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Kategoryzacja
  category TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Popularność
  usage_count INTEGER DEFAULT 0,
  
  -- Metadane
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_template_type CHECK (type IN ('budget', 'category', 'quality')),
  CONSTRAINT valid_template_action CHECK (action IN ('block', 'warn', 'prefer')),
  CONSTRAINT valid_template_weight CHECK (weight >= 1 AND weight <= 10)
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_rule_templates_type ON rule_templates(type);
CREATE INDEX IF NOT EXISTS idx_rule_templates_category ON rule_templates(category);
CREATE INDEX IF NOT EXISTS idx_rule_templates_tags ON rule_templates USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_rule_templates_featured ON rule_templates(is_featured);

-- Trigger
DROP TRIGGER IF EXISTS rule_templates_updated_at ON rule_templates;
CREATE TRIGGER rule_templates_updated_at
  BEFORE UPDATE ON rule_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. TABELA: user_settings
-- =====================================================

-- Tabela ustawień użytkowników
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Ustawienia ogólne
  theme TEXT DEFAULT 'light',
  language TEXT DEFAULT 'pl',
  
  -- Ustawienia powiadomień
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- Ustawienia prywatności
  data_retention_days INTEGER DEFAULT 90,
  auto_delete_old_analyses BOOLEAN DEFAULT false,
  
  -- Ustawienia analiz
  default_analysis_type TEXT DEFAULT 'file_upload',
  auto_evaluate_products BOOLEAN DEFAULT true,
  
  -- Preferencje (JSONB)
  preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Daty
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_theme CHECK (theme IN ('light', 'dark', 'auto')),
  CONSTRAINT valid_language CHECK (language IN ('pl', 'en'))
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Trigger
DROP TRIGGER IF EXISTS user_settings_updated_at ON user_settings;
CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. TABELA: analysis_files
-- =====================================================

-- Tabela metadanych plików
CREATE TABLE IF NOT EXISTS analysis_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Dane pliku
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  
  -- Status przetwarzania
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  
  -- Produkty
  product_count INTEGER DEFAULT 0,
  
  -- Daty
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_file_status CHECK (status IN ('pending', 'processing', 'completed', 'error'))
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_analysis_files_analysis_id ON analysis_files(analysis_id);
CREATE INDEX IF NOT EXISTS idx_analysis_files_user_id ON analysis_files(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_files_status ON analysis_files(status);

-- =====================================================
-- 8. WIDOKI (VIEWS)
-- =====================================================

-- Widok: Statystyki użytkownika
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

-- Widok: Ostatnie analizy użytkownika
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

-- =====================================================
-- 9. DANE PRZYKŁADOWE - SZABLONY REGUŁ
-- =====================================================

-- Czyszczenie starych szablonów (opcjonalne)
-- TRUNCATE TABLE rule_templates CASCADE;

-- Dodanie domyślnych szablonów
INSERT INTO rule_templates (name, description, type, action, weight, conditions, category, tags, is_featured)
VALUES
  -- Budżet
  (
    'Budżet do 1000 PLN',
    'Ostrzeżenie dla produktów przekraczających 1000 PLN',
    'budget',
    'warn',
    8,
    '{"maxPrice": 1000, "currency": "PLN"}'::jsonb,
    'Budżet',
    ARRAY['budżet', 'cena', 'ostrzeżenie'],
    true
  ),
  (
    'Budżet do 500 PLN',
    'Blokada produktów przekraczających 500 PLN',
    'budget',
    'block',
    10,
    '{"maxPrice": 500, "currency": "PLN"}'::jsonb,
    'Budżet',
    ARRAY['budżet', 'cena', 'blokada'],
    true
  ),
  (
    'Budżet do 2000 PLN',
    'Ostrzeżenie dla produktów przekraczających 2000 PLN',
    'budget',
    'warn',
    7,
    '{"maxPrice": 2000, "currency": "PLN"}'::jsonb,
    'Budżet',
    ARRAY['budżet', 'cena', 'ostrzeżenie'],
    false
  ),
  
  -- Kategorie
  (
    'Unikaj elektroniki',
    'Ostrzeżenie dla produktów elektronicznych',
    'category',
    'warn',
    6,
    '{"blacklist": ["elektronika", "komputer", "telefon", "laptop", "tablet"], "caseSensitive": false}'::jsonb,
    'Kategoria',
    ARRAY['kategoria', 'elektronika', 'ostrzeżenie'],
    true
  ),
  (
    'Preferuj dom i ogród',
    'Bonus dla produktów z kategorii dom i ogród',
    'category',
    'prefer',
    7,
    '{"whitelist": ["dom i ogród", "ogród", "narzędzia", "dekoracje"], "caseSensitive": false}'::jsonb,
    'Kategoria',
    ARRAY['kategoria', 'dom', 'preferencja'],
    false
  ),
  (
    'Blokuj używane produkty',
    'Blokada produktów używanych lub z defektem',
    'category',
    'block',
    9,
    '{"blacklist": ["używane", "uszkodzone", "defekt", "b-grade", "second hand"], "caseSensitive": false}'::jsonb,
    'Kategoria',
    ARRAY['kategoria', 'stan', 'blokada'],
    true
  ),
  
  -- Jakość
  (
    'Preferuj produkty z oceną > 4.0',
    'Bonus dla produktów z wysoką oceną',
    'quality',
    'prefer',
    7,
    '{"minRating": 4.0}'::jsonb,
    'Jakość',
    ARRAY['jakość', 'ocena', 'preferencja'],
    true
  ),
  (
    'Ostrzeżenie dla produktów bez opinii',
    'Ostrzeżenie dla produktów bez opinii użytkowników',
    'quality',
    'warn',
    5,
    '{"minReviews": 1}'::jsonb,
    'Jakość',
    ARRAY['jakość', 'opinie', 'ostrzeżenie'],
    false
  ),
  (
    'Preferuj produkty z > 10 opiniami',
    'Bonus dla produktów z dużą liczbą opinii',
    'quality',
    'prefer',
    6,
    '{"minReviews": 10}'::jsonb,
    'Jakość',
    ARRAY['jakość', 'opinie', 'preferencja'],
    false
  ),
  (
    'Wymagana wysoka ocena (> 4.5)',
    'Blokada produktów z oceną poniżej 4.5',
    'quality',
    'block',
    8,
    '{"minRating": 4.5}'::jsonb,
    'Jakość',
    ARRAY['jakość', 'ocena', 'blokada'],
    false
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Włączenie RLS na wszystkich tabelach
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 10.1. POLITYKI RLS - USERS
-- =====================================================

-- Usunięcie starych polityk (jeśli istnieją)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Użytkownik może zobaczyć TYLKO swój profil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (clerk_user_id = auth.jwt()->>'sub');

-- Użytkownik może aktualizować TYLKO swój profil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (clerk_user_id = auth.jwt()->>'sub')
  WITH CHECK (clerk_user_id = auth.jwt()->>'sub');

-- =====================================================
-- 10.2. POLITYKI RLS - ANALYSES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;

-- Użytkownik może zobaczyć TYLKO swoje analizy
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może tworzyć analizy
CREATE POLICY "Users can create own analyses"
  ON analyses FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje analizy
CREATE POLICY "Users can update own analyses"
  ON analyses FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje analizy
CREATE POLICY "Users can delete own analyses"
  ON analyses FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- =====================================================
-- 10.3. POLITYKI RLS - RULES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own rules" ON rules;
DROP POLICY IF EXISTS "Users can create own rules" ON rules;
DROP POLICY IF EXISTS "Users can update own rules" ON rules;
DROP POLICY IF EXISTS "Users can delete own rules" ON rules;

-- Użytkownik może zobaczyć TYLKO swoje reguły
CREATE POLICY "Users can view own rules"
  ON rules FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może tworzyć reguły
CREATE POLICY "Users can create own rules"
  ON rules FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje reguły
CREATE POLICY "Users can update own rules"
  ON rules FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje reguły
CREATE POLICY "Users can delete own rules"
  ON rules FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- =====================================================
-- 10.4. POLITYKI RLS - USER_SETTINGS
-- =====================================================

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;

-- Użytkownik może zobaczyć TYLKO swoje ustawienia
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje ustawienia
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- =====================================================
-- 10.5. POLITYKI RLS - ANALYSIS_FILES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own files" ON analysis_files;
DROP POLICY IF EXISTS "Users can create own files" ON analysis_files;
DROP POLICY IF EXISTS "Users can delete own files" ON analysis_files;

-- Użytkownik może zobaczyć TYLKO swoje pliki
CREATE POLICY "Users can view own files"
  ON analysis_files FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może tworzyć pliki
CREATE POLICY "Users can create own files"
  ON analysis_files FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje pliki
CREATE POLICY "Users can delete own files"
  ON analysis_files FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- =====================================================
-- 10.6. POLITYKI RLS - RULE_TEMPLATES (publiczne)
-- =====================================================

DROP POLICY IF EXISTS "Anyone can view rule templates" ON rule_templates;

-- Wszyscy mogą zobaczyć szablony (są publiczne)
CREATE POLICY "Anyone can view rule templates"
  ON rule_templates FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- KONIEC MIGRACJI
-- =====================================================

-- Podsumowanie
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
  
  RAISE NOTICE '✅ Migracja zakończona pomyślnie!';
  RAISE NOTICE '📊 Statystyki:';
  RAISE NOTICE '  - Użytkownicy: %', users_count;
  RAISE NOTICE '  - Analizy: %', analyses_count;
  RAISE NOTICE '  - Reguły: %', rules_count;
  RAISE NOTICE '  - Szablony reguł: %', templates_count;
END $$;

