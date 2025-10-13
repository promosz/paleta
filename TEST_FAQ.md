# ❓ FAQ - Najczęściej Zadawane Pytania o Testowanie

## 🎯 Podstawowe pytania

### 1. Gdzie jest aplikacja?
**Odpowiedź:** http://localhost:3000

### 2. Jak otworzyć konsolę przeglądarki?
**Odpowiedź:** Naciśnij `F12` lub:
- Chrome/Edge: `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- Firefox: `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

### 3. Jak uruchomić szybki test?
**Odpowiedź:** 
1. Otwórz konsolę (`F12`)
2. Wpisz: `await testSupabase.fullFlow()`
3. Naciśnij Enter

### 4. Gdzie są instrukcje testowania?
**Odpowiedź:** Przeczytaj:
- `START_TESTING.md` - szybki start
- `INSTRUKCJA_TESTOWANIA.md` - pełna instrukcja

---

## 🔧 Konfiguracja

### 5. Co to są zmienne środowiskowe?
**Odpowiedź:** To klucze dostępu do Supabase i Clerk. Bez nich aplikacja nie zapisze danych!

### 6. Gdzie znaleźć klucze Supabase?
**Odpowiedź:**
1. Otwórz: https://supabase.com/dashboard
2. Wybierz projekt
3. Kliknij: Settings → API
4. Skopiuj:
   - `URL` → `VITE_SUPABASE_URL`
   - `anon/public` key → `VITE_SUPABASE_ANON_KEY`

### 7. Jak utworzyć plik .env.local?
**Odpowiedź:**
```bash
# Skopiuj przykładowy plik
cp docs/env.example .env.local

# Edytuj plik (użyj nano, vim lub edytora)
nano .env.local

# Wypełnij klucze i zapisz
```

### 8. Czy muszę restartować aplikację po zmianie .env.local?
**Odpowiedź:** TAK! Zawsze restartuj:
```bash
# Zatrzymaj serwer (Ctrl+C)
# Uruchom ponownie
npm run dev
```

---

## 🧪 Testowanie

### 9. Jak sprawdzić czy aplikacja zapisuje dane?
**Odpowiedź:**
1. Utwórz analizę (upload pliku Excel)
2. Otwórz konsolę (`F12`)
3. Poszukaj: `✅ Pliki zapisane do bazy danych`
4. Jeśli widzisz → DZIAŁA!

### 10. Jak sprawdzić czy aplikacja odczytuje dane?
**Odpowiedź:**
1. Utwórz analizę
2. Naciśnij `F5` (odśwież stronę)
3. Sprawdź czy analiza nadal jest widoczna
4. Jeśli TAK → DZIAŁA!

### 11. Jak sprawdzić dane w bazie Supabase?
**Odpowiedź:**
1. Otwórz: https://supabase.com/dashboard
2. Wybierz projekt
3. Kliknij: `Table Editor`
4. Zobacz tabelę `analyses`
5. Sprawdź czy są rekordy

### 12. Co to jest "Row Level Security" (RLS)?
**Odpowiedź:** To zabezpieczenie bazy danych. Każdy użytkownik widzi TYLKO swoje dane.

### 13. Jak wyłączyć RLS do testów?
**Odpowiedź:** W Supabase SQL Editor uruchom:
```sql
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE rules DISABLE ROW LEVEL SECURITY;
```
⚠️ **UWAGA:** To tylko do testów! W produkcji ZAWSZE włącz RLS!

---

## ❌ Problemy i rozwiązania

### 14. Widzę błąd "Missing Supabase environment variables"
**Rozwiązanie:**
```bash
# Stwórz plik .env.local
cp docs/env.example .env.local

# Wypełnij klucze Supabase
# Zrestartuj aplikację
npm run dev
```

### 15. Widzę błąd "Error: 403 Forbidden"
**Przyczyna:** RLS blokuje dostęp

**Rozwiązanie:**
- Opcja 1: Wyłącz RLS tymczasowo (patrz pytanie 13)
- Opcja 2: Włącz właściwe polityki RLS (plik `enable-rls-policies.sql`)

### 16. Dashboard jest pusty po odświeżeniu
**Rozwiązanie:**
1. Otwórz konsolę (`F12`)
2. Sprawdź czy są błędy
3. Sprawdź w Supabase czy dane są zapisane
4. Sprawdź czy `user_id` się zgadza

### 17. Funkcje testowe nie działają w konsoli
**Rozwiązanie:**
- Upewnij się że aplikacja działa w trybie DEV
- Odśwież stronę (`F5`)
- Sprawdź konsolę czy widzisz: `🔧 FUNKCJE TESTOWE SUPABASE DOSTĘPNE!`

### 18. Aplikacja nie zapisuje plików
**Możliwe przyczyny:**
1. Brak połączenia z Supabase
2. Nieprawidłowe klucze w `.env.local`
3. RLS blokuje zapis
4. Błąd w kodzie

**Diagnoza:**
- Otwórz konsolę (`F12`)
- Sprawdź szczegóły błędu
- Zobacz zakładkę "Network" → status requestów

### 19. Jak zobaczyć logi Supabase?
**Odpowiedź:**
1. Otwórz: https://supabase.com/dashboard
2. Wybierz projekt
3. Kliknij: `Logs` w menu po lewej
4. Zobacz logi API, Database, Auth

### 20. Nie widzę tabel w Supabase
**Rozwiązanie:**
1. Sprawdź czy projekt jest aktywny
2. Sprawdź czy wykonałeś migrację SQL:
   - `docs/SUPABASE_MIGRATION.sql`
3. Sprawdź w Supabase SQL Editor czy tabele istnieją:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

---

## 📊 Analiza i dane

### 21. Jakie pliki mogę przesłać?
**Odpowiedź:** Pliki Excel (.xlsx) z produktami. Przykłady w folderze `palety/`.

### 22. Co to są "reguły"?
**Odpowiedź:** To zasady analizy produktów (np. "blokuj produkty droższe niż 1000 PLN").

### 23. Jak utworzyć regułę?
**Odpowiedź:**
1. Przejdź do: http://localhost:3000/rules
2. Kliknij "Nowa reguła"
3. Wypełnij formularz
4. Zapisz

### 24. Gdzie są moje dane po wylogowaniu?
**Odpowiedź:** Twoje dane są BEZPIECZNIE przechowywane w Supabase. Po ponownym zalogowaniu wszystko będzie widoczne.

### 25. Czy mogę zobaczyć dane innego użytkownika?
**Odpowiedź:** NIE! Dzięki RLS każdy użytkownik widzi TYLKO swoje dane.

---

## 🚀 Produkcja

### 26. Jak przygotować aplikację do produkcji?
**Odpowiedź:**
1. Włącz RLS we wszystkich tabelach
2. Utwórz osobny projekt Supabase dla produkcji
3. Skonfiguruj zmienne środowiskowe produkcyjne
4. Build aplikacji: `npm run build`
5. Deploy na Vercel/Netlify

### 27. Jak zbudować aplikację?
**Odpowiedź:**
```bash
npm run build
```
Pliki produkcyjne będą w folderze `dist/`

### 28. Gdzie mogę wdrożyć aplikację?
**Odpowiedź:**
- Vercel (zalecane)
- Netlify
- AWS Amplify
- GitHub Pages (dla statycznych stron)

---

## 🔐 Bezpieczeństwo

### 29. Czy moje dane są bezpieczne?
**Odpowiedź:** TAK! Aplikacja używa:
- Clerk - profesjonalna autentykacja
- Supabase - bezpieczna baza danych
- RLS - izolacja danych użytkowników
- HTTPS - szyfrowane połączenie

### 30. Co to jest Clerk?
**Odpowiedź:** Clerk to system autentykacji. Obsługuje logowanie, rejestrację, zarządzanie użytkownikami.

### 31. Czy muszę używać Clerk?
**Odpowiedź:** Nie, ale bez Clerk:
- Nie ma logowania użytkowników
- Wszyscy używają "temp-user-id"
- Brak izolacji danych

### 32. Jak skonfigurować Clerk?
**Odpowiedź:**
1. Utwórz konto: https://clerk.com
2. Utwórz aplikację
3. Skopiuj `Publishable Key`
4. Dodaj do `.env.local`:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx...
   ```

---

## 💡 Wskazówki

### 33. Jak przyspieszyć testowanie?
**Odpowiedź:**
- Użyj automatycznego testu: `testSupabase.fullFlow()`
- Wyłącz RLS podczas testów (patrz pytanie 13)
- Użyj małych plików Excel

### 34. Jak sprawdzić wydajność?
**Odpowiedź:**
1. Otwórz DevTools (`F12`)
2. Zakładka "Performance"
3. Nagraj sesję
4. Sprawdź czas ładowania

### 35. Jak debugować błędy?
**Odpowiedź:**
1. Konsola przeglądarki (`F12`) - błędy JavaScript
2. Network tab - błędy API
3. Supabase Logs - błędy bazy danych
4. Logi aplikacji - console.log()

### 36. Gdzie znaleźć przykładowe pliki?
**Odpowiedź:** W folderze `palety/`:
- `F20351 FBA MIX FBA PLN.xlsx`
- `F20353 FBA MIX FBA PLN.xlsx`
- `M00216 RETOURWARE NARZĘDZIA PLN.xlsx`

### 37. Jak wyczyścić testowe dane?
**Odpowiedź:**
1. W Supabase Table Editor
2. Wybierz tabelę `analyses`
3. Usuń testowe rekordy
4. LUB użyj: `testSupabase.deleteAnalysis()`

### 38. Jak zapisać logi do pliku?
**Odpowiedź:**
W konsoli przeglądarki:
```javascript
// Kliknij prawym przyciskiem na logi → Save as...
```

### 39. Jak sprawdzić wersję aplikacji?
**Odpowiedź:**
```bash
cat package.json | grep version
```

### 40. Gdzie zgłosić bug?
**Odpowiedź:**
1. Zbierz informacje:
   - Screenshot błędu
   - Logi z konsoli
   - Kroki do reprodukcji
2. Opisz problem szczegółowo
3. Dołącz informacje o przeglądarce i systemie

---

## 📚 Dodatkowe zasoby

### 41. Gdzie jest dokumentacja?
**Odpowiedź:**
- `README.md` - ogólne info
- `INSTRUKCJA_TESTOWANIA.md` - testowanie
- `docs/` - dokumentacja techniczna
- `TESTING_GUIDE.md` - szczegółowy przewodnik

### 42. Czy jest tutorial wideo?
**Odpowiedź:** Obecnie brak. Skorzystaj z dokumentacji tekstowej.

### 43. Gdzie znaleźć pomoc?
**Odpowiedź:**
- Dokumentacja w folderze `docs/`
- Konsola przeglądarki (`F12`)
- Supabase Dashboard → Logs
- Ten plik FAQ

### 44. Jak zaktualizować aplikację?
**Odpowiedź:**
```bash
git pull
npm install
npm run dev
```

### 45. Jak sprawdzić status Supabase?
**Odpowiedź:** https://status.supabase.com

---

## 🎯 Szybkie odpowiedzi

### 46. Aplikacja nie działa - co robić?
1. Sprawdź `.env.local`
2. Zrestartuj: `npm run dev`
3. Sprawdź konsolę (`F12`)
4. Przeczytaj błędy

### 47. Dane się nie zapisują - co robić?
1. Sprawdź konsolę (`F12`)
2. Sprawdź Supabase Dashboard
3. Wyłącz RLS tymczasowo
4. Sprawdź klucze API

### 48. Nie mogę się zalogować - co robić?
1. Sprawdź `VITE_CLERK_PUBLISHABLE_KEY`
2. Sprawdź Clerk Dashboard
3. Wyczyść cookies
4. Spróbuj innej przeglądarki

### 49. Dashboard pusty - co robić?
1. Odśwież stronę (`F5`)
2. Sprawdź konsolę (`F12`)
3. Sprawdź Supabase → Table Editor
4. Sprawdź `user_id`

### 50. Wszystko działa - co dalej?
**Gratulacje! 🎉**
1. Przetestuj wszystkie funkcje
2. Przygotuj do produkcji
3. Deploy aplikacji
4. Ciesz się!

---

**Data utworzenia:** 12 października 2025  
**Wersja:** 1.0  
**Status:** ✅ Aktualna

**Powodzenia! 🚀**

