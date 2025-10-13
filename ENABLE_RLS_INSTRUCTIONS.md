# 🔒 WŁĄCZENIE RLS - INSTRUKCJE

## Krok 1: Wykonaj skrypt SQL w Supabase Dashboard

1. **Otwórz Supabase Dashboard**: https://supabase.com/dashboard
2. **Wybierz swój projekt**: `qccbhzvgcelapbbyqzft`
3. **Przejdź do SQL Editor**: Menu po lewej → "SQL Editor"
4. **Wklej zawartość pliku**: `enable-rls-policies.sql`
5. **Wykonaj skrypt**: Kliknij "Run"

## Krok 2: Sprawdź wyniki

Po wykonaniu skryptu powinieneś zobaczyć:

### ✅ Status RLS:
```
schemaname | tablename      | rowsecurity
-----------|----------------|------------
public     | users          | t
public     | analyses       | t
public     | analysis_files | t
public     | rules          | t
public     | rule_templates | t
```

### ✅ Polityki bezpieczeństwa:
- **users**: 3 polityki (SELECT, UPDATE, INSERT)
- **analyses**: 4 polityki (SELECT, INSERT, UPDATE, DELETE)
- **analysis_files**: 4 polityki (SELECT, INSERT, UPDATE, DELETE)
- **rules**: 4 polityki (SELECT, INSERT, UPDATE, DELETE)
- **rule_templates**: 4 polityki (SELECT, INSERT, UPDATE, DELETE)

## Krok 3: Test bezpieczeństwa

Po włączeniu RLS:
- ✅ Każdy użytkownik widzi tylko swoje dane
- ✅ Nie można dostać się do danych innych użytkowników
- ✅ Wszystkie operacje są chronione przez polityki RLS

## ⚠️ UWAGA

**Po włączeniu RLS testy z `testSupabase.fullFlow()` mogą nie działać**, ponieważ:
- Testy używają `crypto.randomUUID()` zamiast prawdziwych ID z Clerk
- RLS wymaga prawdziwej autentykacji przez Clerk

**Następny krok**: Integracja z prawdziwymi użytkownikami Clerk!
