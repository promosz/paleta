# 🚀 Instrukcja Uruchomienia Pre-Launch Landing Page

## ✅ KROK 1: Utworzenie Tabeli w Supabase (WYMAGANE!)

### Otwórz Supabase Dashboard

1. Przejdź do [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Zaloguj się do swojego projektu: `https://qccbhzvgcelapbbyqzft.supabase.co`
3. Kliknij **SQL Editor** w menu bocznym
4. Kliknij **New Query**

### Wykonaj SQL Script

1. Otwórz plik: `CREATE_WAITLIST_TABLE.sql` (w głównym katalogu projektu)
2. Skopiuj CAŁĄ zawartość pliku
3. Wklej do SQL Editor w Supabase
4. Kliknij **RUN** (lub Ctrl/Cmd + Enter)

### Sprawdź czy Tabela została Utworzona

1. Przejdź do **Table Editor** w Supabase
2. Powinieneś zobaczyć nową tabelę **`waitlist`**
3. Sprawdź strukturę:
   - id (UUID)
   - email (TEXT)
   - first_name (TEXT)
   - business_type (TEXT)
   - confirmed (BOOLEAN)
   - created_at (TIMESTAMPTZ)
   - etc.

✅ **Tabela gotowa!**

---

## ✅ KROK 2: Uruchom Aplikację

```bash
# W terminalu, w katalogu projektu
npm run dev
```

Aplikacja uruchomi się pod adresem:
```
http://localhost:3000/paleta/
```

---

## ✅ KROK 3: Otwórz Pre-Launch Page

W przeglądarce przejdź do:
```
http://localhost:3000/paleta/pre-launch
```

**LUB** (dla lokalizacji bez base path):
```
http://localhost:3000/pre-launch
```

---

## ✅ KROK 4: Przetestuj Funkcjonalność

### Test 1: Email Signup (Hero Section)

1. Scroll na górę strony
2. Wpisz email w formularzu (np. `test@example.com`)
3. Zaznacz checkbox RODO
4. Kliknij **"Zapisz się"**
5. Powinieneś zobaczyć:
   ```
   ✅ Dziękujemy! Jesteś na liście!
   ```

### Test 2: Sprawdź Bazę Danych

1. Wróć do Supabase Dashboard
2. Przejdź do **Table Editor** → **waitlist**
3. Powinieneś zobaczyć nowy wpis z Twoim emailem
4. Sprawdź pola:
   - email: test@example.com
   - source: hero
   - created_at: [dzisiejsza data]

### Test 3: Duplikat Email

1. Spróbuj zapisać ten sam email ponownie
2. Powinieneś zobaczyć błąd:
   ```
   ❌ Ten email jest już na liście! Sprawdź swoją skrzynkę.
   ```

### Test 4: Walidacja Email

1. Wpisz nieprawidłowy email (np. `test@test`)
2. Kliknij **"Zapisz się"**
3. Powinieneś zobaczyć błąd:
   ```
   ❌ Podaj prawidłowy adres email
   ```

### Test 5: Mobile Responsive

1. Otwórz DevTools (F12)
2. Włącz Device Toolbar (Ctrl+Shift+M)
3. Wybierz urządzenie (np. iPhone SE)
4. Scroll przez całą stronę
5. Sprawdź czy wszystko jest czytelne

---

## ✅ KROK 5: Weryfikacja Wydajności

### Lighthouse Test

1. Otwórz DevTools (F12)
2. Przejdź do zakładki **Lighthouse**
3. Wybierz:
   - Performance ✅
   - Accessibility ✅
   - Best Practices ✅
   - SEO ✅
4. Kliknij **"Analyze page load"**

**Target scores: Wszystkie > 90**

---

## 🚀 KROK 6: Deployment na GitHub Pages

### Przed Deploymentem

1. **Sprawdź czy wszystkie testy przeszły**
2. **Sprawdź czy nie ma console errors**
3. **Przetestuj na różnych przeglądarkach**

### Deploy

```bash
npm run build
npm run deploy
```

### Dostęp do Strony

Po deployment, strona będzie dostępna pod:
```
https://your-username.github.io/paleta/pre-launch
```

---

## 📝 Checklista Finalna

### Pre-Deployment
- [ ] Tabela waitlist utworzona w Supabase
- [ ] RLS policies działają
- [ ] Email signup działa (przetestowane)
- [ ] Walidacja działa (błędny email, duplikat)
- [ ] Success state wyświetla się
- [ ] Live counter działa
- [ ] Responsive na mobile/tablet/desktop
- [ ] Brak console errors
- [ ] Lighthouse scores > 90
- [ ] Wszystkie sekcje wyświetlają się poprawnie

### Post-Deployment
- [ ] Strona działa na production URL
- [ ] Email signup działa na production
- [ ] Analytics skonfigurowane (opcjonalnie)
- [ ] Social media links zaktualizowane
- [ ] Kontakt email aktywny
- [ ] 404 page działa (routing fallback)

---

## 🎉 Gotowe!

Jeśli wszystkie kroki przeszły pomyślnie, Twoja strona pre-launch jest gotowa do zbierania emaili!

**Następne kroki**:
1. Udostępnij link znajomym/społeczności
2. Promuj na social media
3. Monitoruj liczbę zapisów w Supabase
4. Przygotuj email automation (welcome sequence)
5. Zbieraj feedback od early signups

---

## 💡 Tips & Best Practices

### Content Marketing
- Udostępnij na LinkedIn, Twitter, Facebook
- Napisz post na blogu o problemie i rozwiązaniu
- Stwórz short demo video (60 sek)
- Zaangażuj społeczność (grupy FB, forum)

### Email Marketing
- Wyślij welcome email natychmiast
- Nurture sequence co 3-7 dni
- Share behind-the-scenes content
- Build anticipation for launch

### Community Building
- Stwórz Discord/Slack community dla beta testerów
- Regular updates o postępie
- Zbieraj feedback i feature requests
- Build hype przed premierą

---

**Powodzenia! 🎊**

---

*Dokument utworzony: 18 stycznia 2025*  
*Status: ✅ Pre-Launch Page Ready for Testing*








