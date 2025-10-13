# ⚡ Szybki Przewodnik Testowania Supabase

## 🚀 Start w 3 krokach:

### 1️⃣ Uruchom aplikację
```bash
npm run dev
```

### 2️⃣ Otwórz aplikację
Przejdź do: **http://localhost:3001/paleta/**

### 3️⃣ Otwórz konsolę przeglądarki
Naciśnij **F12** → zakładka **Console**

---

## 🧪 Uruchom test

W konsoli wpisz i uruchom:

```javascript
await testSupabase.fullFlow()
```

---

## ✅ Co powinno się stać?

Zobaczysz serię komunikatów:
```
🧪 TEST PEŁNEGO PRZEPŁYWU SUPABASE
📊 1. Tworzenie analizy...
✅ Analiza utworzona
📊 2. Pobieranie wszystkich analiz...
✅ Pobrano analiz: 1
... itd ...
🎉 WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!
```

---

## 🔍 Sprawdź w Supabase Dashboard

1. Otwórz: **https://supabase.com/dashboard**
2. Wybierz projekt: **pallet-analysis-app**
3. Kliknij: **Table Editor**
4. Sprawdź tabele:
   - ✅ `analyses` - powinny być analizy
   - ✅ `rules` - powinny być reguły
   - ✅ `rule_templates` - powinno być 10 szablonów

---

## 📊 Dodatkowe testy (opcjonalne)

```javascript
// Utwórz analizę
await testSupabase.createAnalysis()

// Pobierz wszystkie analizy
await testSupabase.getAnalyses()

// Utwórz regułę
await testSupabase.createRule()

// Pobierz wszystkie reguły
await testSupabase.getRules()

// Pobierz szablony reguł
await testSupabase.getTemplates()
```

---

## 🐛 Problem?

Jeśli coś nie działa, sprawdź:
1. ✅ Czy serwer jest uruchomiony (`npm run dev`)
2. ✅ Czy plik `.env.local` ma poprawne klucze Supabase
3. ✅ Czy jesteś zalogowany do Supabase Dashboard

---

## 📚 Więcej informacji

Pełna dokumentacja testowania: **docs/TESTING_SUPABASE.md**

---

**Gotowe? Uruchom test i sprawdź czy wszystko działa! 🎉**
