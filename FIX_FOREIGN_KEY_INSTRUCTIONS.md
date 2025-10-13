# 🔧 NAPRAWA BŁĘDU FOREIGN KEY CONSTRAINT

## ❌ **Problem:** 
Błąd: `violates foreign key constraint "analyses_user_id_fkey"` - `user_id` nie istnieje w tabeli `users`.

## ✅ **Rozwiązanie:**

### **Krok 1:** Otwórz Supabase Dashboard
1. Przejdź do: https://supabase.com/dashboard
2. Wybierz projekt: `pallet-analysis-app`

### **Krok 2:** Sprawdź czy tabele istnieją
1. Kliknij **"Table Editor"** w menu po lewej
2. Sprawdź czy widzisz tabele: `analyses`, `analysis_files`, `rules`, `rule_templates`, `users`

### **Krok 3:** Sprawdź strukturę tabeli `users`
1. Kliknij na tabelę `users`
2. Sprawdź czy ma kolumny: `clerk_user_id`, `email`, `full_name`, etc.

### **Krok 4:** Jeśli tabela `users` nie istnieje, utwórz ją
W **SQL Editor** uruchom:

```sql
-- Utwórz tabelę users jeśli nie istnieje
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Utwórz indeksy
CREATE INDEX IF NOT EXISTS idx_users_clerk_user_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

### **Krok 5:** Sprawdź foreign key constraints
W **SQL Editor** uruchom:

```sql
-- Sprawdź foreign key constraints
SELECT 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('analyses', 'analysis_files', 'rules');
```

### **Krok 6:** Napraw foreign key constraints (jeśli potrzeba)
Jeśli foreign key constraints odwołują się do złych kolumn, napraw je:

```sql
-- Usuń istniejące foreign key constraints
ALTER TABLE analyses DROP CONSTRAINT IF EXISTS analyses_user_id_fkey;
ALTER TABLE analysis_files DROP CONSTRAINT IF EXISTS analysis_files_user_id_fkey;
ALTER TABLE rules DROP CONSTRAINT IF EXISTS rules_user_id_fkey;

-- Dodaj poprawne foreign key constraints
ALTER TABLE analyses ADD CONSTRAINT analyses_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(clerk_user_id);

ALTER TABLE analysis_files ADD CONSTRAINT analysis_files_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(clerk_user_id);

ALTER TABLE rules ADD CONSTRAINT rules_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(clerk_user_id);
```

### **Krok 7:** Przetestuj ponownie
1. Wróć do aplikacji: http://localhost:3001/paleta/
2. Otwórz konsolę przeglądarki (F12)
3. Uruchom: `await testSupabase.fullFlow()`

---

## 🔍 **Diagnostyka:**

### Sprawdź czy tabele istnieją:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('analyses', 'analysis_files', 'rules', 'rule_templates', 'users');
```

### Sprawdź strukturę tabeli users:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public';
```

### Sprawdź dane w tabeli users:
```sql
SELECT * FROM users LIMIT 5;
```

---

## 🚨 **Jeśli nadal nie działa:**

1. **Sprawdź logi** w Supabase Dashboard → Logs
2. **Sprawdź czy RLS jest wyłączone** (z poprzednich instrukcji)
3. **Sprawdź czy tabele mają dane** w Table Editor
4. **Sprawdź czy foreign key constraints są poprawne**

---

## 📋 **Checklista:**

- [ ] Otwórz Supabase Dashboard
- [ ] Sprawdź czy tabele istnieją
- [ ] Sprawdź strukturę tabeli `users`
- [ ] Utwórz tabelę `users` jeśli nie istnieje
- [ ] Sprawdź foreign key constraints
- [ ] Napraw foreign key constraints jeśli potrzeba
- [ ] Przetestuj aplikację
- [ ] Sprawdź logi jeśli nadal nie działa

