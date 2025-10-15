# 🔧 NAPRAWA POLITYK RLS W SUPABASE

## ❌ Problem:
Błąd: `new row violates row-level security policy for table "analyses"`

## ✅ Rozwiązanie:

### **Krok 1:** Otwórz Supabase Dashboard
1. Przejdź do: https://supabase.com/dashboard
2. Wybierz projekt: `pallet-analysis-app`

### **Krok 2:** Otwórz SQL Editor
1. W menu po lewej kliknij **"SQL Editor"**
2. Kliknij **"New query"**

### **Krok 3:** Skopiuj i wklej poniższy kod SQL:

```sql
-- Naprawa polityk Row Level Security (RLS) dla Supabase
-- TYMCZASOWO WYŁĄCZAMY RLS DLA TESTOWANIA

-- 1. Wyłącz RLS dla wszystkich tabel (TYLKO DO TESTOWANIA!)
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Sprawdź status RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('analyses', 'analysis_files', 'rules', 'rule_templates', 'users');
```

### **Krok 4:** Uruchom skrypt
1. Kliknij **"Run"** (lub Ctrl+Enter)
2. Sprawdź wyniki - wszystkie tabele powinny mieć `rowsecurity = false`

### **Krok 5:** Przetestuj ponownie
1. Wróć do aplikacji: http://localhost:3001/paleta/
2. Otwórz konsolę przeglądarki (F12)
3. Uruchom: `await testSupabase.fullFlow()`

---

## 🚨 UWAGA BEZPIECZEŃSTWA:

**To rozwiązanie TYMCZASOWO wyłącza RLS tylko do testowania!**

### Po pomyślnym teście, włącz RLS z powrotem:

```sql
-- WŁĄCZ RLS Z POWROTEM (PO TESTOWANIU)
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Utwórz prawidłowe polityki RLS
CREATE POLICY "Users can view own analyses" ON analyses
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own analyses" ON analyses
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own analyses" ON analyses
    FOR DELETE USING (auth.uid()::text = user_id);

-- Podobnie dla innych tabel...
```

---

## 📋 Checklista:

- [ ] Otwórz Supabase Dashboard
- [ ] Przejdź do SQL Editor
- [ ] Uruchom skrypt wyłączający RLS
- [ ] Sprawdź status RLS (wszystkie = false)
- [ ] Przetestuj aplikację
- [ ] Jeśli działa - włącz RLS z powrotem
- [ ] Utwórz prawidłowe polityki RLS

---

## 🆘 Jeśli nadal nie działa:

1. **Sprawdź czy tabele istnieją:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('analyses', 'rules', 'rule_templates', 'users');
   ```

2. **Sprawdź uprawnienia:**
   ```sql
   SELECT * FROM pg_tables WHERE tablename IN ('analyses', 'rules');
   ```

3. **Sprawdź logi w Supabase Dashboard → Logs**

