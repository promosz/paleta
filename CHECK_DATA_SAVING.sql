-- SPRAWDŹ CZY DANE SIĘ ZAPISUJĄ
-- Uruchom to w Supabase Dashboard → SQL Editor

-- 1. Sprawdź czy są użytkownicy w tabeli users
SELECT COUNT(*) as user_count FROM users;
SELECT id, email, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 5;

-- 2. Sprawdź czy są analizy w tabeli analyses
SELECT COUNT(*) as analysis_count FROM analyses;
SELECT id, name, description, type, user_id, created_at FROM analyses ORDER BY created_at DESC LIMIT 5;

-- 3. Sprawdź czy są pliki w tabeli analysis_files
SELECT COUNT(*) as file_count FROM analysis_files;
SELECT id, analysis_id, file_name, status FROM analysis_files LIMIT 5;

-- 4. Sprawdź czy są reguły w tabeli rules
SELECT COUNT(*) as rules_count FROM rules;
SELECT id, name, type, status, user_id, created_at FROM rules ORDER BY created_at DESC LIMIT 5;

-- 5. Sprawdź ostatnie rekordy z każdej tabeli (oddzielnie)
-- Ostatnie użytkownicy:
SELECT 'users' as table_name, id::text, email as name, created_at FROM users ORDER BY created_at DESC LIMIT 3;

-- Ostatnie analizy:
SELECT 'analyses' as table_name, id::text, name, created_at FROM analyses ORDER BY created_at DESC LIMIT 3;

-- Ostatnie pliki:
SELECT 'analysis_files' as table_name, id::text, file_name as name, NULL as created_at FROM analysis_files LIMIT 3;

-- Ostatnie reguły:
SELECT 'rules' as table_name, id::text, name, created_at FROM rules ORDER BY created_at DESC LIMIT 3;
