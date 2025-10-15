-- =====================================================
-- TYMCZASOWE WYŁĄCZENIE RLS DLA WSZYSTKICH TABEL
-- =====================================================
-- Wyłącza RLS dla wszystkich tabel aplikacji
-- =====================================================

-- Wyłącz RLS dla wszystkich tabel
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates DISABLE ROW LEVEL SECURITY;

-- Usuń wszystkie polityki RLS (żeby nie było konfliktów)
-- Users
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Allow user self-registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Temporary: Allow user insert" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Analyses
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;

-- Analysis files
DROP POLICY IF EXISTS "Users can view own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can create own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can update own analysis files" ON analysis_files;
DROP POLICY IF EXISTS "Users can delete own analysis files" ON analysis_files;

-- Rules
DROP POLICY IF EXISTS "Users can view own rules" ON rules;
DROP POLICY IF EXISTS "Users can create own rules" ON rules;
DROP POLICY IF EXISTS "Users can update own rules" ON rules;
DROP POLICY IF EXISTS "Users can delete own rules" ON rules;

-- Rule templates
DROP POLICY IF EXISTS "Users can view rule templates" ON rule_templates;

-- Products (jeśli istnieje)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'products') THEN
        ALTER TABLE products DISABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own products" ON products;
        DROP POLICY IF EXISTS "Users can create own products" ON products;
        DROP POLICY IF EXISTS "Users can update own products" ON products;
        DROP POLICY IF EXISTS "Users can delete own products" ON products;
    END IF;
END $$;

-- Potwierdź
SELECT 'RLS wyłączony dla wszystkich tabel' as status;




