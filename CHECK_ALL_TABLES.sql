-- SPRAWDŹ WSZYSTKIE TABELE W BAZIE
-- Uruchom to w Supabase Dashboard → SQL Editor

-- Sprawdź wszystkie tabele w schemacie public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Sprawdź strukturę tabeli analyses (jeśli istnieje)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'analyses'
ORDER BY ordinal_position;

-- Sprawdź strukturę tabeli rules
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'rules'
ORDER BY ordinal_position;

-- Sprawdź strukturę tabeli users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Sprawdź strukturę tabeli analysis_files
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'analysis_files'
ORDER BY ordinal_position;
