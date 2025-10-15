-- USUŃ WSZYSTKIE POLITYKI RLS
-- Uruchom to w Supabase Dashboard → SQL Editor

-- Usuń polityki z tabeli 'users'
DROP POLICY IF EXISTS "Users can view their own user data." ON users;
DROP POLICY IF EXISTS "Users can insert their own user data." ON users;
DROP POLICY IF EXISTS "Users can update their own user data." ON users;
DROP POLICY IF EXISTS "Users can delete their own user data." ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Usuń polityki z tabeli 'analyses'
DROP POLICY IF EXISTS "Users can view their own analyses." ON analyses;
DROP POLICY IF EXISTS "Users can create analyses for themselves." ON analyses;
DROP POLICY IF EXISTS "Users can update their own analyses." ON analyses;
DROP POLICY IF EXISTS "Users can delete their own analyses." ON analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can view own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON analyses;

-- Usuń polityki z tabeli 'analysis_files'
DROP POLICY IF EXISTS "Users can view their own analysis files." ON analysis_files;
DROP POLICY IF EXISTS "Users can create analysis files for their analyses." ON analysis_files;
DROP POLICY IF EXISTS "Users can update their own analysis files." ON analysis_files;
DROP POLICY IF EXISTS "Users can delete their own analysis files." ON analysis_files;
DROP POLICY IF EXISTS "Users can view own files" ON analysis_files;
DROP POLICY IF EXISTS "Users can create own files" ON analysis_files;
DROP POLICY IF EXISTS "Users can delete own files" ON analysis_files;

-- Usuń polityki z tabeli 'rules'
DROP POLICY IF EXISTS "Users can view their own rules." ON rules;
DROP POLICY IF EXISTS "Users can create rules for themselves." ON rules;
DROP POLICY IF EXISTS "Users can update their own rules." ON rules;
DROP POLICY IF EXISTS "Users can delete their own rules." ON rules;
DROP POLICY IF EXISTS "Users can view own rules" ON rules;
DROP POLICY IF EXISTS "Users can create own rules" ON rules;
DROP POLICY IF EXISTS "Users can update own rules" ON rules;
DROP POLICY IF EXISTS "Users can delete own rules" ON rules;

-- Usuń polityki z tabeli 'rule_templates'
DROP POLICY IF EXISTS "Users can view rule templates." ON rule_templates;
DROP POLICY IF EXISTS "Users can create rule templates for themselves." ON rule_templates;
DROP POLICY IF EXISTS "Users can update their own rule templates." ON rule_templates;
DROP POLICY IF EXISTS "Users can delete their own rule templates." ON rule_templates;
DROP POLICY IF EXISTS "Allow authenticated users to read all rule templates" ON rule_templates;
DROP POLICY IF EXISTS "Anyone can view rule templates" ON rule_templates;

-- Sprawdź czy wszystkie polityki zostały usunięte
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('analyses', 'analysis_files', 'rules', 'rule_templates', 'users');

-- Powinieneś zobaczyć pusty wynik (brak polityk)
