# 🔍 SZYBKI DEBUG

## Sprawdź konsolę przeglądarki:
```
1. Otwórz F12 → Console
2. Zaloguj się
3. Przeciągnij plik Excel
4. Sprawdź czy widzisz:
   ✅ "Dashboard: Ładowanie analiz dla użytkownika: [UUID]"
   ✅ "✅ Użytkownik zsynchronizowany z Supabase"
   ❌ Błędy związane z Supabase
```

## Sprawdź Network tab:
```
1. F12 → Network
2. Przeciągnij plik Excel
3. Sprawdź czy są requesty do Supabase:
   - POST /rest/v1/analyses
   - GET /rest/v1/analyses
```

## Sprawdź Supabase Table Editor:
```
1. Supabase Dashboard → Table Editor
2. Tabela "analyses" - czy są nowe rekordy?
3. Tabela "users" - czy jest Twój użytkownik?
```

## Jeśli nadal nie działa:
```sql
-- Sprawdź czy możesz ręcznie dodać rekord:
INSERT INTO analyses (name, description, type, user_id)
VALUES ('Test Analysis', 'Test description', 'file_upload', 'YOUR_USER_ID');
```
