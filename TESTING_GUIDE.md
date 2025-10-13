# 🧪 PRZEWODNIK TESTOWANIA - INTEGRACJA SUPABASE

## ✅ **ZMIANY ZOSTAŁY WDROŻONE**

Aplikacja została zaktualizowana aby zapisywać wszystkie dane do Supabase. Teraz możesz przetestować czy wszystko działa poprawnie.

---

## 📋 **JAK PRZETESTOWAĆ:**

### **TEST 1: Zapisywanie i ładowanie analiz**

#### **Krok 1: Otwórz aplikację**
```
http://localhost:3001/paleta/
```

#### **Krok 2: Zaloguj się**
- Użyj swojego konta Clerk
- Po zalogowaniu powinieneś zobaczyć Dashboard

#### **Krok 3: Utwórz nową analizę**
1. Kliknij "➕ Nowa analiza"
2. System utworzy nową analizę
3. **Sprawdź konsolę przeglądarki** (F12 → Console):
   ```
   Dashboard: Ładowanie analiz dla użytkownika: [twój-user-id]
   ✅ Analiza utworzona: {id: "...", name: "..."}
   ```

#### **Krok 4: Odśwież stronę (F5)**
- Po odświeżeniu **analiza powinna być nadal widoczna**
- ✅ Jeśli widzisz swoją analizę - **SUKCES!**
- ❌ Jeśli nie widzisz - sprawdź konsolę przeglądarki

---

### **TEST 2: Izolacja danych użytkowników**

#### **Krok 1: Zaloguj się na pierwsze konto**
- Utwórz kilka analiz
- Zapamiętaj ich nazwy

#### **Krok 2: Wyloguj się**
- Kliknij na swój avatar → Sign out

#### **Krok 3: Zaloguj się na drugie konto**
- Użyj innego konta email
- **Sprawdź Dashboard**

#### **Krok 4: Weryfikacja**
- ✅ **Nie** powinno być widać analiz z pierwszego konta
- ✅ Powinien być pusty Dashboard
- ✅ Możesz tworzyć własne analizy

---

### **TEST 3: Sprawdzenie bazy danych**

#### **Krok 1: Otwórz Supabase Dashboard**
```
https://supabase.com/dashboard/project/qccbhzvgcelapbbyqzft
```

#### **Krok 2: Przejdź do Table Editor**
- Menu po lewej → "Table Editor"
- Wybierz tabelę `analyses`

#### **Krok 3: Sprawdź dane**
- ✅ Powinny być widoczne nowe rekordy
- ✅ Każdy rekord ma wypełnione pole `user_id`
- ✅ Pole `user_id` to UUID (np. `550e8400-e29b-41d4-a716-446655440000`)

#### **Krok 4: Sprawdź tabelę users**
- Przejdź do tabeli `users`
- ✅ Powinien być rekord z twoim `clerk_user_id`
- ✅ Powinien być wypełniony `email` i `full_name`

---

### **TEST 4: Sprawdzenie reguł**

#### **Krok 1: Przejdź do zakładki "Reguły"**
```
http://localhost:3001/paleta/rules
```

#### **Krok 2: Utwórz nową regułę**
1. Kliknij "➕ Nowa reguła"
2. Wypełnij formularz
3. Zapisz regułę

#### **Krok 3: Odśwież stronę (F5)**
- ✅ Reguła powinna być nadal widoczna

#### **Krok 4: Sprawdź w Supabase**
- Przejdź do tabeli `rules`
- ✅ Powinna być widoczna nowa reguła z twoim `user_id`

---

## 🔍 **SPRAWDZANIE KONSOLI PRZEGLĄDARKI:**

### **Co powinieneś zobaczyć:**

#### **Przy ładowaniu Dashboard:**
```javascript
Dashboard: Ładowanie analiz dla użytkownika: 550e8400-e29b-41d4-a716-446655440000
```

#### **Przy tworzeniu analizy:**
```javascript
✅ Analiza utworzona: {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Analiza 12.10.2025",
  user_id: "550e8400-e29b-41d4-a716-446655440000",
  ...
}
```

#### **Przy ładowaniu reguł:**
```javascript
Rules: Ładowanie reguł dla użytkownika: 550e8400-e29b-41d4-a716-446655440000
```

---

## ❌ **MOŻLIWE BŁĘDY I ROZWIĄZANIA:**

### **Błąd 1: "Użytkownik nie jest zalogowany"**
**Rozwiązanie:**
- Upewnij się, że jesteś zalogowany w Clerk
- Odśwież stronę (F5)
- Sprawdź w konsoli czy widzisz `user` w Clerk

### **Błąd 2: "Error loading analyses: 403"**
**Rozwiązanie:**
- RLS (Row Level Security) jest włączone
- Wykonaj skrypt `fix-rls-policies.sql` aby tymczasowo wyłączyć RLS
- **LUB** wykonaj `enable-rls-policies.sql` aby włączyć właściwe polityki

### **Błąd 3: "Foreign key constraint violation"**
**Rozwiązanie:**
- Użytkownik nie istnieje w tabeli `users`
- Hook `useCurrentUser` powinien automatycznie tworzyć użytkownika
- Sprawdź czy `ensureUserInSupabase` działa poprawnie

### **Błąd 4: Dane się nie ładują**
**Rozwiązanie:**
1. Otwórz konsolę przeglądarki (F12)
2. Sprawdź zakładkę "Network"
3. Poszukaj requestów do Supabase
4. Sprawdź statusy odpowiedzi (powinny być 200 lub 201)

---

## 📊 **WERYFIKACJA W SUPABASE:**

### **Tabela `users`:**
```sql
SELECT * FROM users WHERE email = 'twoj-email@example.com';
```
✅ Powinieneś zobaczyć swój rekord

### **Tabela `analyses`:**
```sql
SELECT * FROM analyses WHERE user_id = 'twoj-user-id';
```
✅ Powinny być widoczne twoje analizy

### **Tabela `rules`:**
```sql
SELECT * FROM rules WHERE user_id = 'twoj-user-id';
```
✅ Powinny być widoczne twoje reguły

---

## ✅ **KRYTERIA SUKCESU:**

### **Aplikacja działa poprawnie jeśli:**
- ✅ Możesz tworzyć analizy
- ✅ Analizy są widoczne po odświeżeniu strony
- ✅ Każdy użytkownik widzi tylko swoje dane
- ✅ Dane są zapisywane w Supabase
- ✅ Konsola nie pokazuje błędów

---

## 🚀 **NASTĘPNE KROKI:**

Jeśli wszystkie testy przeszły pomyślnie:
1. ✅ Włącz RLS w Supabase (`enable-rls-policies.sql`)
2. ✅ Przetestuj aplikację w środowisku produkcyjnym
3. ✅ Aplikacja jest gotowa do użycia!

---

## 📞 **POMOC:**

Jeśli coś nie działa:
1. Sprawdź konsolę przeglądarki (F12)
2. Sprawdź logi w Supabase Dashboard
3. Przeczytaj `SUPABASE_FIX_SUMMARY.md`
4. Zgłoś problem z dokładnym opisem błędu

