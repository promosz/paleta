# 🚀 SZYBKI START - TESTOWANIE APLIKACJI

## ✅ APLIKACJA JEST URUCHOMIONA!

**URL:** http://localhost:3000

---

## 📋 SZYBKI TEST (3 KROKI)

### 1️⃣ Otwórz aplikację
```
http://localhost:3000
```

### 2️⃣ Otwórz konsolę przeglądarki
**Naciśnij:** `F12` → zakładka "Console"

### 3️⃣ Sprawdź błędy konfiguracji

**❌ Jeśli widzisz:**
```
Missing Supabase environment variables
```

**To musisz skonfigurować `.env.local`:**
```bash
cp docs/env.example .env.local
# Następnie edytuj plik i wypełnij klucze Supabase
```

**✅ Jeśli NIE MA błędów** - aplikacja jest gotowa do testowania!

---

## 🧪 PEŁNA INSTRUKCJA TESTOWANIA

Przeczytaj szczegółową instrukcję:
```
INSTRUKCJA_TESTOWANIA.md
```

Lub otwórz:
```bash
open INSTRUKCJA_TESTOWANIA.md
```

---

## ⚡ TEST AUTOMATYCZNY (OPCJONALNY)

W konsoli przeglądarki wpisz:
```javascript
await testSupabase.fullFlow()
```

To uruchomi automatyczny test:
- ✅ Utworzy analizę
- ✅ Pobierze analizy
- ✅ Utworzy regułę
- ✅ Pobierze reguły
- ✅ Sprawdzi szablony
- ✅ Usunie testowe dane

---

## 📊 CO TESTUJEMY?

### Zapis danych ✍️
- Tworzenie analiz
- Upload plików Excel
- Tworzenie reguł
- Zapisywanie ustawień

### Odczyt danych 📖
- Ładowanie historycznych analiz
- Wyświetlanie szczegółów
- Ładowanie reguł
- Filtrowanie i wyszukiwanie

### Izolacja danych 🔐
- Każdy użytkownik widzi tylko swoje dane
- Brak dostępu do danych innych użytkowników
- Bezpieczne logowanie przez Clerk

---

## 🎯 NAJWAŻNIEJSZE TESTY

### TEST 1: Utwórz analizę
1. Kliknij "Nowa analiza"
2. Wybierz plik z `palety/F20351 FBA MIX FBA PLN.xlsx`
3. Poczekaj na zakończenie
4. **Sprawdź w konsoli:** `✅ Pliki zapisane do bazy danych`

### TEST 2: Odśwież stronę
1. Naciśnij **F5**
2. **Sprawdź:** Czy analiza nadal jest widoczna?
3. **✅ Jeśli TAK** - odczyt historycznych danych działa!

### TEST 3: Sprawdź w Supabase
1. Otwórz: https://supabase.com/dashboard
2. Wybierz projekt
3. Kliknij "Table Editor"
4. Sprawdź tabelę `analyses`
5. **✅ Jeśli widzisz rekordy** - zapis do bazy działa!

---

## ❌ CZĘSTE PROBLEMY

### Problem: Brak zmiennych środowiskowych
```bash
# Rozwiązanie:
cp docs/env.example .env.local
# Wypełnij klucze i zrestartuj: npm run dev
```

### Problem: 403 Forbidden
```bash
# Wyłącz tymczasowo RLS (tylko test!)
# W Supabase SQL Editor:
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
```

### Problem: Dashboard pusty po F5
```bash
# Sprawdź w konsoli czy są błędy
# Sprawdź w Supabase czy dane są zapisane
# Sprawdź czy user_id się zgadza
```

---

## 📚 WIĘCEJ INFORMACJI

**Szczegółowa instrukcja:**
- `INSTRUKCJA_TESTOWANIA.md` ← PRZECZYTAJ TO!

**Dokumentacja techniczna:**
- `TESTING_GUIDE.md`
- `QUICK_TEST_GUIDE.md`
- `docs/TESTING_SUPABASE.md`

---

## 🎉 GOTOWE?

**Otwórz aplikację i zacznij testować:**
```
http://localhost:3000
```

**Powodzenia! 🚀**

