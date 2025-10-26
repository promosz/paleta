# Naprawa błędów Supabase RLS

## Problem
W logach Supabase są błędy dotyczące Row Level Security (RLS):
- Tabele mają polityki RLS, ale RLS nie jest włączone
- Widoki mają SECURITY DEFINER, co może powodować problemy z uprawnieniami

## Rozwiązanie

### Krok 1: Włącz RLS na wszystkich tabelach

Wykonaj następujący SQL w Supabase SQL Editor:

```sql
-- Włącz RLS na wszystkich tabelach w schemacie public

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

**Lub uruchom plik:**
```
supabase/enable-rls-all-tables.sql
```

### Krok 2: Napraw widoki (opcjonalne)

**Opcja A: Zmień SECURITY DEFINER na false**
```sql
ALTER VIEW public.user_statistics SET (security_definer = false);
ALTER VIEW public.product_statistics SET (security_definer = false);
ALTER VIEW public.user_recent_analyses SET (security_definer = false);
```

**Opcja B: Usuń i utwórz widoki ponownie bez SECURITY DEFINER**

Najpierw sprawdź definicje widoków:
```sql
SELECT pg_get_viewdef('public.user_statistics', true);
SELECT pg_get_viewdef('public.product_statistics', true);
SELECT pg_get_viewdef('public.user_recent_analyses', true);
```

Następnie usuń widoki:
```sql
DROP VIEW IF EXISTS public.user_statistics;
DROP VIEW IF EXISTS public.product_statistics;
DROP VIEW IF EXISTS public.user_recent_analyses;
```

I utwórz je ponownie bez `SECURITY DEFINER`.

**Lub uruchom plik:**
```
supabase/remove-security-definer-from-views.sql
```

### Krok 3: Weryfikacja

Po wykonaniu powyższych kroków:
1. Sprawdź logi w Supabase → Logs
2. Błędy RLS powinny zniknąć
3. Aplikacja powinna działać poprawnie z bazą danych

## Ważne!

- Te błędy **NIE WPŁYWAJĄ** na działanie aplikacji w trybie pre-launch
- Aplikacja działa bez bazy Supabase (landing page, pre-launch page)
- Logowanie przez Clerk działa niezależnie od Supabase
- Naprawy są potrzebne dopiero gdy połączysz aplikację z Supabase

## Aktualny stan

✅ Aplikacja działa poprawnie na `http://localhost:3000/`
✅ Landig page działa
✅ Pre-launch page działa  
✅ Logowanie przez Clerk działa
⚠️ Błędy RLS w Supabase wymagają naprawy (gdy połączysz aplikację z Supabase)

