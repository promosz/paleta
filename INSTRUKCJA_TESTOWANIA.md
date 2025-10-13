# 📋 INSTRUKCJA TESTOWANIA APLIKACJI

## ✅ STATUS APLIKACJI

**Aplikacja jest uruchomiona i działa!**
- 🌐 URL: http://localhost:3000
- 🚀 Status: ✅ Działająca

---

## 🎯 CEL TESTOWANIA

Sprawdzenie czy aplikacja:
1. ✅ Zapisuje dane do bazy Supabase
2. ✅ Umożliwia odczyt historycznych danych
3. ✅ Izoluje dane między użytkownikami
4. ✅ Przechowuje dane po odświeżeniu strony

---

## ⚠️ WYMAGANIA WSTĘPNE

### Sprawdź czy masz skonfigurowane zmienne środowiskowe:

```bash
cat .env.local
```

**Musisz mieć:**
- `VITE_SUPABASE_URL` - URL projektu Supabase
- `VITE_SUPABASE_ANON_KEY` - Klucz publiczny Supabase
- `VITE_CLERK_PUBLISHABLE_KEY` - Klucz Clerk (opcjonalny)

**Jeśli NIE masz pliku `.env.local`:**
```bash
cp docs/env.example .env.local
```
Następnie wypełnij plik `.env.local` swoimi kluczami.

⚠️ **WAŻNE:** Bez kluczy Supabase aplikacja **NIE BĘDZIE** zapisywać danych do bazy!

---

## 🧪 SCENARIUSZE TESTOWE

### 📊 TEST 1: Sprawdzenie konfiguracji (KRYTYCZNY)

#### Krok 1: Otwórz aplikację
```
http://localhost:3000
```

#### Krok 2: Otwórz konsolę przeglądarki
- **Chrome/Edge:** `F12` → zakładka "Console"
- **Firefox:** `F12` → zakładka "Konsola"
- **Safari:** `Option+Cmd+C`

#### Krok 3: Sprawdź błędy
**❌ Jeśli widzisz błąd:**
```
Missing Supabase environment variables
```
**Rozwiązanie:** Skonfiguruj plik `.env.local` i zrestartuj aplikację (`npm run dev`)

**✅ Jeśli NIE MA błędów** - przejdź do następnego testu!

---

### 📝 TEST 2: Zapisywanie analizy do bazy danych

#### Krok 1: Zaloguj się (jeśli używasz Clerk)
- Kliknij "Sign In" lub "Sign Up"
- Zaloguj się swoim kontem email

**LUB** pomiń ten krok jeśli Clerk nie jest skonfigurowany

#### Krok 2: Przejdź do Dashboard
```
http://localhost:3000/
```

#### Krok 3: Utwórz nową analizę
1. Znajdź przycisk **"Nowa analiza"** lub **"Upload"**
2. Wybierz przykładowy plik Excel z folderu `palety/`
   - Np. `F20351 FBA MIX FBA PLN.xlsx`
3. Poczekaj na zakończenie analizy

#### Krok 4: Sprawdź konsolę przeglądarki
**Co powinieneś zobaczyć:**
```javascript
📁 Dodawanie plików do analizy: 1
💾 Zapisywanie plików do bazy: 1
✅ Pliki zapisane do bazy danych
✅ Pliki dodane do analizy
```

**✅ Jeśli widzisz te komunikaty - ZAPIS DZIAŁA!**

**❌ Jeśli widzisz błędy:**
- `Error creating analysis` - sprawdź połączenie z Supabase
- `403 Forbidden` - sprawdź uprawnienia RLS w Supabase
- `Foreign key constraint` - użytkownik nie istnieje w tabeli `users`

---

### 🔄 TEST 3: Odczyt historycznych danych

#### Krok 1: Odśwież stronę
Naciśnij **F5** lub **Ctrl+R** (Cmd+R na Mac)

#### Krok 2: Sprawdź Dashboard
**✅ SUKCES jeśli:**
- Widzisz wcześniej utworzoną analizę
- Analiza ma właściwą nazwę i datę
- Możesz kliknąć na analizę i zobaczyć szczegóły

**❌ PROBLEM jeśli:**
- Dashboard jest pusty (analiza zniknęła)
- Widzisz błąd w konsoli

#### Krok 3: Sprawdź szczegóły analizy
1. Kliknij na analizę
2. Sprawdź czy widzisz:
   - Nazwę pliku
   - Listę produktów
   - Statystyki
   - Wyniki analizy

**✅ Jeśli wszystkie dane są widoczne - ODCZYT DZIAŁA!**

---

### 👥 TEST 4: Izolacja danych użytkowników (jeśli używasz Clerk)

#### Krok 1: Zaloguj się na konto A
- Utwórz 2-3 analizy
- Zapamiętaj ich nazwy

#### Krok 2: Wyloguj się
- Kliknij na avatar użytkownika
- Wybierz "Sign Out"

#### Krok 3: Zaloguj się na konto B
- Użyj innego adresu email
- Sprawdź Dashboard

#### Krok 4: Weryfikacja
**✅ SUKCES jeśli:**
- Dashboard jest pusty (nie widać analiz konta A)
- Możesz utworzyć własne analizy na koncie B
- Po powrocie na konto A widzisz swoje analizy

**❌ PROBLEM jeśli:**
- Widzisz analizy innego użytkownika (problem z RLS!)

---

### 🗄️ TEST 5: Weryfikacja w bazie danych Supabase

#### Krok 1: Otwórz Supabase Dashboard
```
https://supabase.com/dashboard
```

#### Krok 2: Wybierz projekt
- Znajdź projekt "pallet-analysis-app" (lub inną nazwę)
- Kliknij "Table Editor" w menu po lewej

#### Krok 3: Sprawdź tabelę `analyses`
1. Kliknij na tabelę **`analyses`**
2. **Sprawdź kolumny:**
   - `id` - UUID analizy
   - `user_id` - ID użytkownika
   - `name` - nazwa analizy
   - `status` - status (completed, in_progress, pending)
   - `created_at` - data utworzenia
   - `updated_at` - data aktualizacji

**✅ Jeśli widzisz rekordy - dane są zapisywane!**

#### Krok 4: Sprawdź tabelę `analysis_files`
1. Kliknij na tabelę **`analysis_files`**
2. **Sprawdź czy są pliki:**
   - `file_name` - nazwa przesłanego pliku
   - `file_size` - rozmiar
   - `status` - status parsowania
   - `product_count` - liczba produktów

#### Krok 5: Sprawdź tabelę `users`
1. Kliknij na tabelę **`users`**
2. **Znajdź swój rekord:**
   - `email` - twój email
   - `clerk_user_id` - ID z Clerk
   - `created_at` - kiedy utworzono użytkownika

---

### 📋 TEST 6: Test reguł analizy

#### Krok 1: Przejdź do zakładki "Reguły"
```
http://localhost:3000/rules
```

#### Krok 2: Utwórz nową regułę
1. Kliknij **"Nowa reguła"** lub **"Add Rule"**
2. Wypełnij formularz:
   - Nazwa: "Test Reguła"
   - Typ: dowolny
   - Akcja: "block" lub "warn"
3. Zapisz regułę

#### Krok 3: Odśwież stronę (F5)
**✅ Jeśli widzisz zapisaną regułę - DZIAŁA!**

#### Krok 4: Sprawdź w Supabase
1. Otwórz tabelę **`rules`**
2. Sprawdź czy widzisz swoją regułę
3. Sprawdź pole `user_id` - powinno być wypełnione

---

## 🧪 SZYBKI TEST PRZEZ KONSOLĘ (OPCJONALNY)

### Test automatyczny w konsoli przeglądarki:

1. Otwórz konsolę (F12)
2. Wklej i uruchom:

```javascript
await testSupabase.fullFlow()
```

**Zobaczysz:**
```
🧪 TEST PEŁNEGO PRZEPŁYWU SUPABASE
📊 1. Tworzenie analizy...
✅ Analiza utworzona
📊 2. Pobieranie wszystkich analiz...
✅ Pobrano analiz: 1
... itd ...
🎉 WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!
```

**⚠️ Ten test jest dostępny TYLKO w trybie deweloperskim!**

---

## ✅ KRYTERIA SUKCESU

### Aplikacja działa poprawnie jeśli:

- ✅ Możesz tworzyć nowe analizy
- ✅ Analizy są widoczne po odświeżeniu strony (F5)
- ✅ Dane są zapisane w Supabase (sprawdzone w Table Editor)
- ✅ Każdy użytkownik widzi TYLKO swoje dane
- ✅ Możesz tworzyć i zapisywać reguły
- ✅ Konsola nie pokazuje błędów typu "Error creating/fetching"
- ✅ Plik `.env.local` jest poprawnie skonfigurowany

---

## ❌ NAJCZĘSTSZE PROBLEMY I ROZWIĄZANIA

### Problem 1: "Missing Supabase environment variables"
**Rozwiązanie:**
```bash
# Skopiuj plik przykładowy
cp docs/env.example .env.local

# Edytuj i wypełnij własnymi kluczami
nano .env.local

# Zrestartuj aplikację
npm run dev
```

### Problem 2: "Error: 403 Forbidden"
**Przyczyna:** Row Level Security (RLS) blokuje dostęp

**Rozwiązanie:**
```sql
-- W Supabase SQL Editor uruchom:
-- Opcja 1: Tymczasowo wyłącz RLS (tylko dla testów!)
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;

-- Opcja 2: Włącz właściwe polityki RLS (zalecane)
-- Uruchom zawartość pliku: enable-rls-policies.sql
```

### Problem 3: "Foreign key constraint violation"
**Przyczyna:** Użytkownik nie istnieje w tabeli `users`

**Rozwiązanie:**
- Hook `useCurrentUser` powinien automatycznie utworzyć użytkownika
- Sprawdź w Supabase czy tabela `users` istnieje
- Sprawdź w konsoli czy `ensureUserInSupabase()` działa poprawnie

### Problem 4: Dashboard jest pusty po odświeżeniu
**Możliwe przyczyny:**
1. Brak połączenia z Supabase
2. Nieprawidłowy `user_id`
3. RLS blokuje dostęp

**Diagnoza:**
```javascript
// W konsoli przeglądarki:
console.log('User ID:', /* twój mechanizm pobierania user_id */)
```

Sprawdź w Supabase czy `user_id` w tabeli `analyses` pasuje do Twojego ID.

### Problem 5: Aplikacja nie startuje
**Rozwiązanie:**
```bash
# Sprawdź czy node_modules są zainstalowane
ls node_modules/

# Jeśli brak, zainstaluj zależności
npm install

# Uruchom ponownie
npm run dev
```

---

## 📊 OCZEKIWANE WYNIKI TESTÓW

### W konsoli przeglądarki powinny być:

#### ✅ Przy tworzeniu analizy:
```
📁 Dodawanie plików do analizy: 1
💾 Zapisywanie plików do bazy: 1
✅ Pliki zapisane do bazy danych
✅ Analiza utworzona: {id: "...", name: "..."}
```

#### ✅ Przy ładowaniu Dashboard:
```
Dashboard: Ładowanie analiz dla użytkownika: [user-id]
Pobrano X analiz
```

#### ✅ Przy tworzeniu reguły:
```
✅ Reguła utworzona: {id: "...", name: "..."}
```

### W Supabase Dashboard powinny być:

#### Tabela `users`:
| id | clerk_user_id | email | full_name | created_at |
|---|---|---|---|---|
| uuid-1 | user_xxx | test@example.com | John Doe | 2025-10-12 |

#### Tabela `analyses`:
| id | user_id | name | status | total_products | created_at |
|---|---|---|---|---|---|
| uuid-1 | uuid-user | Analiza 12.10.2025 | completed | 150 | 2025-10-12 |

#### Tabela `analysis_files`:
| id | analysis_id | file_name | file_size | status | product_count |
|---|---|---|---|---|---|
| uuid-1 | uuid-analysis | F20351.xlsx | 245680 | processed | 150 |

#### Tabela `rules`:
| id | user_id | name | type | action | status |
|---|---|---|---|---|---|
| uuid-1 | uuid-user | Test Reguła | category | block | active |

---

## 🚀 NASTĘPNE KROKI PO TESTACH

### Jeśli wszystkie testy przeszły pomyślnie:

1. ✅ **Aplikacja działa poprawnie!**
2. 🔐 **Włącz RLS** dla bezpieczeństwa danych:
   ```bash
   # W Supabase SQL Editor uruchom:
   cat enable-rls-policies.sql
   ```
3. 📝 **Przetestuj funkcjonalności biznesowe:**
   - Upload różnych plików Excel
   - Analiza rentowności
   - Tworzenie reguł
   - Eksport raportów
4. 🚀 **Przygotuj do produkcji:**
   - Osobny projekt Supabase dla produkcji
   - Zmienne środowiskowe produkcyjne
   - Deploy na Vercel/Netlify

---

## 📚 DODATKOWE ZASOBY

### Dokumentacja w projekcie:
- `TESTING_GUIDE.md` - Szczegółowy przewodnik testowania
- `QUICK_TEST_GUIDE.md` - Szybki test w 3 krokach
- `docs/TESTING_SUPABASE.md` - Testowanie integracji Supabase
- `docs/SUPABASE_README.md` - Główna dokumentacja Supabase

### Zewnętrzne linki:
- [Dokumentacja Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk + Supabase](https://clerk.com/docs/integrations/databases/supabase)

---

## 📞 POMOC

Jeśli potrzebujesz pomocy:
1. 🔍 Sprawdź konsolę przeglądarki (F12) - tam są szczegóły błędów
2. 📋 Sprawdź logi w Supabase Dashboard → Logs
3. 📖 Przeczytaj dokumentację w folderze `docs/`
4. 🐛 Zgłoś problem z dokładnym opisem błędu i screenshotem

---

**Data utworzenia:** 12 października 2025
**Wersja:** 1.0
**Status:** ✅ Aktualna

**Powodzenia w testowaniu! 🚀**

