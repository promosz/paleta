-- TEST POŁĄCZENIA Z SUPABASE
-- Uruchom to w Supabase Dashboard → SQL Editor

-- Sprawdź czy tabele istnieją
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'analyses', 'analysis_files', 'rules', 'rule_templates');

-- Sprawdź strukturę tabeli analyses
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'analyses'
ORDER BY ordinal_position;

-- Sprawdź czy możesz ręcznie dodać rekord (zastąp YOUR_USER_ID prawdziwym ID)
-- INSERT INTO analyses (name, description, type, user_id)
-- VALUES ('Test Analysis', 'Test description', 'file_upload', 'YOUR_USER_ID');

-- Sprawdź istniejące rekordy
SELECT id, name, description, type, user_id, created_at
FROM analyses
ORDER BY created_at DESC
LIMIT 5;
