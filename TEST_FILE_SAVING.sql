-- TEST CZY PLIKI SIĘ TERAZ ZAPISUJĄ
-- Uruchom to w Supabase Dashboard → SQL Editor

-- Sprawdź ile rekordów jest w analysis_files
SELECT COUNT(*) as file_count FROM analysis_files;

-- Sprawdź ostatnie pliki (jeśli są)
SELECT id, analysis_id, user_id, file_name, status, uploaded_at 
FROM analysis_files 
ORDER BY uploaded_at DESC 
LIMIT 5;
