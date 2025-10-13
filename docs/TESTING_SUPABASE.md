# 🧪 Testowanie Integracji Supabase

Ten dokument opisuje jak przetestować, czy integracja Supabase działa poprawnie.

---

## 📋 Wymagania wstępne

✅ Aplikacja musi być uruchomiona w trybie deweloperskim:
```bash
npm run dev
```

✅ Aplikacja powinna być dostępna pod adresem: `http://localhost:3001/paleta/`

---

## 🔧 Metoda 1: Testy w Konsoli Przeglądarki (Najłatwiejsza)

### Krok 1: Otwórz aplikację
1. Otwórz przeglądarkę
2. Przejdź do: `http://localhost:3001/paleta/`
3. Otwórz **Konsolę deweloperską** (F12 → Console)

### Krok 2: Sprawdź czy funkcje testowe są dostępne
W konsoli powinieneś zobaczyć komunikat:
```
🔧 ============================================
🔧 FUNKCJE TESTOWE SUPABASE DOSTĘPNE!
🔧 ============================================
```

### Krok 3: Uruchom testy

#### 🎯 Test pełny (wszystko naraz)
```javascript
await testSupabase.fullFlow()
```

Ten test automatycznie:
- ✅ Utworzy nową analizę
- ✅ Pobierze wszystkie analizy
- ✅ Zaktualizuje analizę
- ✅ Utworzy nową regułę
- ✅ Pobierze wszystkie reguły
- ✅ Pobierze szablony reguł
- ✅ Usunie analizę

#### 📊 Testy analiz (pojedyncze)
```javascript
// Utwórz nową analizę
await testSupabase.createAnalysis()

// Pobierz wszystkie analizy
await testSupabase.getAnalyses()

// Zaktualizuj analizę (pierwszą z listy)
await testSupabase.updateAnalysis()

// Usuń analizę (ostatnią z listy)
await testSupabase.deleteAnalysis()
```

#### 📋 Testy reguł (pojedyncze)
```javascript
// Utwórz nową regułę
await testSupabase.createRule()

// Pobierz wszystkie reguły
await testSupabase.getRules()

// Pobierz szablony reguł
await testSupabase.getTemplates()
```

### Krok 4: Sprawdź wyniki

✅ **Sukces** - zobaczysz zielone znaczniki ✅ i komunikaty o pomyślnych operacjach

❌ **Błąd** - zobaczysz czerwone znaczniki ❌ i szczegóły błędu

---

## 🔍 Metoda 2: Weryfikacja w Supabase Dashboard

### Krok 1: Otwórz Supabase Dashboard
1. Przejdź do: https://supabase.com/dashboard
2. Wybierz projekt: `pallet-analysis-app`
3. Kliknij na **Table Editor** w menu po lewej

### Krok 2: Sprawdź tabele

#### 📊 Tabela `analyses`
1. Kliknij na tabelę `analyses`
2. Sprawdź czy widzisz utworzone analizy
3. Sprawdź kolumny:
   - `id` - UUID analizy
   - `user_id` - ID użytkownika (powinno być `temp-user-id`)
   - `name` - nazwa analizy
   - `status` - status (pending, in_progress, completed)
   - `created_at` - data utworzenia
   - `updated_at` - data aktualizacji

#### 📋 Tabela `rules`
1. Kliknij na tabelę `rules`
2. Sprawdź czy widzisz utworzone reguły
3. Sprawdź kolumny:
   - `id` - UUID reguły
   - `user_id` - ID użytkownika (powinno być `temp-user-id`)
   - `name` - nazwa reguły
   - `type` - typ reguły (budget, category, quality)
   - `action` - akcja (block, warn, prefer)
   - `status` - status (active, inactive)

#### 📚 Tabela `rule_templates`
1. Kliknij na tabelę `rule_templates`
2. Sprawdź czy widzisz 10 szablonów reguł
3. To są globalne szablony dostępne dla wszystkich użytkowników

---

## 🧑‍💼 Metoda 3: Test z interfejsem użytkownika

### Krok 1: Zaloguj się
1. Otwórz aplikację: `http://localhost:3001/paleta/`
2. Kliknij **Sign Up** lub **Sign In**
3. Zarejestruj nowego użytkownika lub zaloguj się

### Krok 2: Sprawdź synchronizację użytkownika
1. Otwórz Supabase Dashboard
2. Przejdź do tabeli `users`
3. Sprawdź czy pojawił się nowy użytkownik z Twoim emailem

### Krok 3: Utwórz analizę przez interfejs
1. Przejdź do **Dashboard**
2. Kliknij **"Nowa analiza"** lub podobny przycisk
3. Wypełnij formularz i zapisz

### Krok 4: Sprawdź w bazie danych
1. Otwórz Supabase Dashboard
2. Przejdź do tabeli `analyses`
3. Sprawdź czy widzisz swoją analizę z właściwym `user_id`

### Krok 5: Utwórz regułę przez interfejs
1. Przejdź do **Rules** w menu
2. Kliknij **"Nowa reguła"** lub podobny przycisk
3. Wybierz szablon lub utwórz własną regułę
4. Zapisz

### Krok 6: Sprawdź w bazie danych
1. Otwórz Supabase Dashboard
2. Przejdź do tabeli `rules`
3. Sprawdź czy widzisz swoją regułę z właściwym `user_id`

---

## ✅ Checklist testów

Po wykonaniu testów sprawdź:

- [ ] **Tworzenie analiz** - nowe analizy są zapisywane w Supabase
- [ ] **Pobieranie analiz** - analizy są pobierane z Supabase
- [ ] **Aktualizacja analiz** - zmiany są zapisywane w Supabase
- [ ] **Usuwanie analiz** - analizy są oznaczane jako usunięte (soft delete)
- [ ] **Tworzenie reguł** - nowe reguły są zapisywane w Supabase
- [ ] **Pobieranie reguł** - reguły są pobierane z Supabase
- [ ] **Pobieranie szablonów** - szablony są pobierane z Supabase
- [ ] **Izolacja danych** - każdy użytkownik widzi tylko swoje dane
- [ ] **Synchronizacja użytkowników** - nowi użytkownicy są automatycznie tworzeni w Supabase

---

## 🐛 Rozwiązywanie problemów

### Problem: "Funkcje testowe nie są dostępne w konsoli"
**Rozwiązanie:**
1. Upewnij się, że aplikacja działa w trybie deweloperskim (`npm run dev`)
2. Odśwież stronę (F5)
3. Sprawdź konsolę czy nie ma błędów JavaScript

### Problem: "Error: Missing Supabase environment variables"
**Rozwiązanie:**
1. Sprawdź plik `.env.local`
2. Upewnij się, że masz ustawione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Zrestartuj serwer deweloperski

### Problem: "Error: Failed to fetch"
**Rozwiązanie:**
1. Sprawdź połączenie z internetem
2. Sprawdź czy URL Supabase jest poprawny
3. Sprawdź w Supabase Dashboard czy projekt działa

### Problem: "Error: Row Level Security"
**Rozwiązanie:**
1. Sprawdź w Supabase Dashboard → Authentication → Policies
2. Upewnij się, że polityki RLS są włączone
3. Sprawdź czy użytkownik ma uprawnienia do tabeli

### Problem: "Analizy nie pojawiają się w interfejsie"
**Rozwiązanie:**
1. Sprawdź czy `userId` jest poprawny
2. Sprawdź w Supabase Dashboard czy analizy są w tabeli
3. Sprawdź konsolę przeglądarki czy nie ma błędów

---

## 📊 Oczekiwane wyniki testów

### ✅ Test pełny (`testSupabase.fullFlow()`)
```
🧪 ============================================
🧪 TEST PEŁNEGO PRZEPŁYWU SUPABASE
🧪 ============================================

📊 1. Tworzenie analizy...
✅ Analiza utworzona: {id: "...", name: "...", ...}

📊 2. Pobieranie wszystkich analiz...
✅ Pobrano analiz: 1

📊 3. Aktualizacja analizy...
✅ Analiza zaktualizowana: ...

📋 4. Tworzenie reguły...
✅ Reguła utworzona: {id: "...", name: "...", ...}

📋 5. Pobieranie wszystkich reguł...
✅ Pobrano reguł: 1

📋 6. Pobieranie szablonów reguł...
✅ Pobrano szablonów: 10

📊 7. Usuwanie analizy...
✅ Analiza usunięta: ...

🎉 ============================================
🎉 WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!
🎉 ============================================
```

---

## 🎯 Następne kroki

Po pomyślnym wykonaniu testów:

1. ✅ **Integracja działa** - możesz zacząć używać aplikacji
2. 🔄 **Usuń funkcje testowe** - przed wdrożeniem na produkcję
3. 🚀 **Wdróż aplikację** - na hosting (Vercel, Netlify, etc.)
4. 🔐 **Skonfiguruj produkcyjną bazę** - osobny projekt Supabase dla produkcji

---

## 📚 Dodatkowe zasoby

- [Dokumentacja Supabase](https://supabase.com/docs)
- [Dokumentacja Clerk](https://clerk.com/docs)
- [Row Level Security w PostgreSQL](https://supabase.com/docs/guides/auth/row-level-security)

---

**Powodzenia w testowaniu! 🚀**

