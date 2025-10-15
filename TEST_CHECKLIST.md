# ✅ CHECKLIST TESTOWANIA APLIKACJI

Data testu: _______________  
Tester: _______________

---

## 🔧 PRZYGOTOWANIE

- [ ] Aplikacja uruchomiona (`npm run dev`)
- [ ] Plik `.env.local` utworzony i wypełniony
- [ ] Przeglądarka otwarta na http://localhost:3000
- [ ] Konsola przeglądarki otwarta (`F12`)
- [ ] Supabase Dashboard otwarty w innej karcie

---

## 🧪 TEST 1: KONFIGURACJA

- [ ] Brak błędu "Missing Supabase environment variables"
- [ ] Aplikacja ładuje się bez błędów
- [ ] Menu nawigacji jest widoczne
- [ ] Dashboard się wyświetla

**Uwagi:**
```


```

---

## 📝 TEST 2: ZAPIS DANYCH - ANALIZY

### Utworzenie analizy:
- [ ] Kliknięto "Nowa analiza" lub "Upload"
- [ ] Wybrano plik Excel z folderu `palety/`
- [ ] Plik został przesłany
- [ ] Analiza się rozpoczęła

### Weryfikacja w konsoli:
- [ ] Widoczny komunikat: `📁 Dodawanie plików do analizy`
- [ ] Widoczny komunikat: `💾 Zapisywanie plików do bazy`
- [ ] Widoczny komunikat: `✅ Pliki zapisane do bazy danych`
- [ ] Widoczny komunikat: `✅ Analiza utworzona`

### Weryfikacja w UI:
- [ ] Analiza pojawia się na liście
- [ ] Widoczna nazwa pliku
- [ ] Widoczna data utworzenia
- [ ] Status analizy jest poprawny

**Uwagi:**
```


```

---

## 📖 TEST 3: ODCZYT HISTORYCZNYCH DANYCH

- [ ] Odświeżono stronę (`F5`)
- [ ] Analiza nadal jest widoczna
- [ ] Wszystkie dane się załadowały
- [ ] Można kliknąć na analizę
- [ ] Szczegóły analizy się wyświetlają
- [ ] Produkty są widoczne
- [ ] Statystyki są poprawne

**Uwagi:**
```


```

---

## 🗄️ TEST 4: WERYFIKACJA W SUPABASE

### Tabela `users`:
- [ ] Otwarto Supabase Dashboard
- [ ] Przejścia do Table Editor
- [ ] Tabela `users` zawiera rekord użytkownika
- [ ] Pole `email` jest wypełnione
- [ ] Pole `clerk_user_id` jest wypełnione

### Tabela `analyses`:
- [ ] Tabela `analyses` zawiera analizę
- [ ] Pole `user_id` jest wypełnione
- [ ] Pole `name` jest poprawne
- [ ] Pole `status` jest poprawny
- [ ] Pola `created_at` i `updated_at` są wypełnione

### Tabela `analysis_files`:
- [ ] Tabela zawiera plik
- [ ] Pole `file_name` jest poprawne
- [ ] Pole `file_size` jest > 0
- [ ] Pole `status` = "processed" lub "uploaded"
- [ ] Pole `product_count` jest > 0

**Uwagi:**
```


```

---

## 📋 TEST 5: REGUŁY

### Utworzenie reguły:
- [ ] Przejścia do /rules
- [ ] Kliknięto "Nowa reguła"
- [ ] Wypełniono formularz
- [ ] Reguła została zapisana
- [ ] Reguła pojawia się na liście

### Weryfikacja po odświeżeniu:
- [ ] Odświeżono stronę (`F5`)
- [ ] Reguła nadal jest widoczna
- [ ] Wszystkie dane są poprawne

### Weryfikacja w Supabase:
- [ ] Tabela `rules` zawiera regułę
- [ ] Pole `user_id` jest wypełnione
- [ ] Pola są poprawnie wypełnione

**Uwagi:**
```


```

---

## 👥 TEST 6: IZOLACJA UŻYTKOWNIKÓW (opcjonalny)

**Tylko jeśli używasz Clerk!**

### Użytkownik A:
- [ ] Zalogowano się na konto A
- [ ] Utworzono 2-3 analizy
- [ ] Zapamiętano nazwy analiz
- [ ] Wylogowano się

### Użytkownik B:
- [ ] Zalogowano się na konto B (inny email)
- [ ] Dashboard jest pusty
- [ ] NIE widać analiz użytkownika A
- [ ] Można utworzyć własne analizy

### Powrót do użytkownika A:
- [ ] Zalogowano się ponownie na konto A
- [ ] Widoczne są analizy użytkownika A
- [ ] NIE widać analiz użytkownika B

**Uwagi:**
```


```

---

## 🤖 TEST 7: AUTOMATYCZNY TEST (opcjonalny)

- [ ] Otwarto konsolę (`F12`)
- [ ] Wpisano: `await testSupabase.fullFlow()`
- [ ] Test się uruchomił
- [ ] Wszystkie etapy przeszły pomyślnie
- [ ] Widoczny komunikat: `🎉 WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!`

**Uwagi:**
```


```

---

## 🔍 TEST 8: FUNKCJONALNOŚCI BIZNESOWE

### Upload i analiza:
- [ ] Przesłano różne pliki Excel
- [ ] Wszystkie pliki zostały przetworzone
- [ ] Produkty są widoczne
- [ ] Statystyki są poprawne

### Filtrowanie:
- [ ] Można filtrować produkty
- [ ] Wyszukiwanie działa
- [ ] Sortowanie działa

### Reguły:
- [ ] Reguły są stosowane
- [ ] Produkty są oznaczane (czerwone/żółte/zielone)
- [ ] Statystyki reguł są poprawne

**Uwagi:**
```


```

---

## 📊 WYNIKI TESTÓW

### Sukces ✅
**Wszystkie testy przeszły pomyślnie jeśli:**
- [x] Analizy są tworzone
- [x] Dane są zapisywane w Supabase
- [x] Dane są widoczne po odświeżeniu
- [x] Każdy użytkownik widzi tylko swoje dane
- [x] Reguły działają
- [x] Brak błędów w konsoli

### Problemy ❌
**Lista napotkanych problemów:**
```
1. 
2. 
3. 
```

### Błędy krytyczne 🔴
**Błędy uniemożliwiające pracę:**
```
1. 
2. 
```

---

## 📝 NOTATKI KOŃCOWE

**Co działa dobrze:**
```


```

**Co wymaga poprawy:**
```


```

**Rekomendacje:**
```


```

---

## ✅ OCENA KOŃCOWA

- [ ] **PASS** - Aplikacja działa zgodnie z oczekiwaniami
- [ ] **FAIL** - Aplikacja ma krytyczne błędy
- [ ] **PARTIAL** - Aplikacja działa, ale ma drobne problemy

**Ocena ogólna:** _____ / 10

**Podpis testera:** _______________

**Data:** _______________

---

## 📞 KONTAKT W RAZIE PROBLEMÓW

**W przypadku błędów:**
1. Zapisz screenshot
2. Skopiuj logi z konsoli
3. Opisz kroki do reprodukcji
4. Sprawdź dokumentację:
   - `INSTRUKCJA_TESTOWANIA.md`
   - `TEST_FAQ.md`
   - `TESTING_GUIDE.md`

---

**Wersja checklisty:** 1.0  
**Data utworzenia:** 12 października 2025  
**Status:** ✅ Aktualny

