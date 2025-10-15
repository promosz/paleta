# 🔍 KROKI DEBUGOWANIA

## 1. Sprawdź konsolę przeglądarki:
```
- Otwórz F12 → Console
- Zaloguj się
- Sprawdź czy widzisz:
  ✅ "Dashboard: Ładowanie analiz dla użytkownika: [UUID]"
  ✅ "✅ Użytkownik zsynchronizowany z Supabase"
  ❌ Błędy związane z Supabase
```

## 2. Sprawdź Network tab:
```
- F12 → Network
- Spróbuj utworzyć analizę
- Sprawdź czy są requesty do Supabase:
  - POST /rest/v1/analyses
  - GET /rest/v1/analyses
```

## 3. Sprawdź Supabase Table Editor:
```
- Supabase Dashboard → Table Editor
- Tabela "analyses" - czy są nowe rekordy?
- Tabela "users" - czy jest Twój użytkownik?
```

## 4. Sprawdź RLS status:
```sql
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('analyses', 'users');
```

## 5. Jeśli nadal nie działa:
```sql
-- Sprawdź czy możesz ręcznie dodać rekord:
INSERT INTO analyses (name, description, type, user_id)
VALUES ('Test', 'Test description', 'file_upload', 'YOUR_USER_ID');
```
