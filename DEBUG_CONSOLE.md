# 🔍 DEBUG KONSOLI

## Sprawdź konsolę przeglądarki:
```
1. Otwórz F12 → Console
2. Zaloguj się
3. Przeciągnij plik Excel
4. Sprawdź czy widzisz:
   ✅ "Dashboard: Ładowanie analiz dla użytkownika: [UUID]"
   ✅ "✅ Użytkownik zsynchronizowany z Supabase"
   ❌ Błędy związane z Supabase (POST /rest/v1/analyses)
```

## Sprawdź Network tab:
```
1. F12 → Network
2. Przeciągnij plik Excel
3. Sprawdź czy są requesty do Supabase:
   - POST /rest/v1/analyses (status 201 = sukces)
   - GET /rest/v1/analyses (status 200 = sukces)
   - POST /rest/v1/users (status 201 = sukces)
```

## Sprawdź czy useCurrentUser działa:
```
1. W konsoli wpisz: window.useCurrentUser
2. Sprawdź czy zwraca funkcję
3. Sprawdź czy supabaseUserId jest dostępne
```

## Jeśli nadal nie działa:
```sql
-- Sprawdź czy możesz ręcznie dodać rekord:
INSERT INTO analyses (name, description, type, user_id)
VALUES ('Test Analysis', 'Test description', 'file_upload', 'YOUR_USER_ID');
```
