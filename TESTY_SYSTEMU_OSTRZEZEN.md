# Testy Systemu Ostrzeżeń dla Produktów

## Status migracji ✅

Migracja SQL została wykonana w Supabase Dashboard. Tabela `product_rules` powinna być już dostępna.

## Przewodnik testowania

### 1. Test podstawowy: logowanie i ładowanie strony

**Kroki:**
1. Otwórz http://localhost:3000
2. Zaloguj się przez Clerk (Google/GitHub)
3. Przejdź do Dashboard
4. Otwórz istniejącą analizę (lub utwórz nową)

**Oczekiwany wynik:**
- Strona ładuje się bez błędów
- W konsoli pojawia się log: "Loading product rules for user: <userId>"
- Brak błędów w konsoli

### 2. Test dodawania reguły z produktu

**Kroki:**
1. W szczegółach analizy otwórz zakładkę "Produkty"
2. Kliknij ikonę flagi (🗿) obok produktu
3. W modalu wybierz:
   - Poziom ostrzeżenia: **MEDIUM** (pomarańczowy)
   - Typ reguły: **Produkt**
   - Wartość powinna być automatycznie wypełniona nazwą produktu
4. Kliknij "Dodaj regułę"

**Oczekiwany wynik:**
- Modal zamyka się
- Wiersz produktu ma pomarańczowe tło
- W kolumnie "Status ostrzeżenia" wyświetla się badge "Średni"
- Obok nazwy produktu pojawia się ikona trójkąta ostrzegawczego

### 3. Test wizualizacji ostrzeżeń (trzy kolory)

**Dodaj 3 reguły dla różnych produktów:**
1. **LOW** - wybierz produkt i dodaj regułę typu "Produkt" z poziomem LOW
2. **MEDIUM** - wybierz inny produkt i dodaj regułę typu "Produkt" z poziomem MEDIUM
3. **HIGH** - wybierz trzeci produkt i dodaj regułę typu "Produkt" z poziomem HIGH

**Oczekiwany wynik:**
- Produkty z LOW mają żółte tło (#FEF3C7) i ikonę Info (ℹ️)
- Produkty z MEDIUM mają pomarańczowe tło (#FFEDD5) i ikonę AlertTriangle (⚠️)
- Produkty z HIGH mają czerwone tło (#FEE2E2) i ikonę XCircle (❌)

### 4. Test reguły kategorii

**Kroki:**
1. Kliknij flagę obok produktu
2. Wybierz poziom: **MEDIUM**
3. Wybierz typ: **Kategoria**
4. Wartość powinna być automatycznie wypełniona kategorią produktu
5. Dodaj regułę

**Oczekiwany wynik:**
- Wszystkie produkty z tej samej kategorii mają ostrzeżenie
- W konsoli widoczny log: "🎯 Applying new warning engine with X rules"

### 5. Test reguły frazy tekstowej

**Kroki:**
1. Kliknij flagę obok produktu zawierającego np. "uszkodzony" w nazwie
2. Wybierz poziom: **HIGH**
3. Wybierz typ: **Fraza tekstowa**
4. Wpisz fragment nazwy produktu (np. "uszkodz")
5. Dodaj regułę

**Oczekiwany wynik:**
- Wszystkie produkty zawierające tę frazę w nazwie mają ostrzeżenie
- Nawet produkty z różnymi nazwami, ale zawierające tę samą frazę

### 6. Test priorytetów (wiele reguł)

**Kroki:**
1. Dodaj regułę dla produktu typu "Produkt" z poziomem LOW
2. Dodaj drugą regułę dla tego samego produktu typu "Kategoria" z poziomem HIGH

**Oczekiwany wynik:**
- Produkt wyświetla najwyższy poziom (HIGH)
- Tło produktu jest czerwone
- W badge widoczny jest poziom "Wysoki"

### 7. Test izolacji użytkowników

**Kroki:**
1. Zaloguj się jako User A
2. Dodaj regułę dla produktu
3. Wyloguj się
4. Zaloguj się jako User B (inny użytkownik)
5. Otwórz analizę

**Oczekiwany wynik:**
- User B nie widzi reguł User A
- Produkty nie mają ostrzeżeń dodanych przez User A
- W bazie danych są tylko reguły przypisane do `user_id` User B

### 8. Test trybu offline (LocalStorage)

**Kroki:**
1. Dodaj kilka reguł
2. Otwórz DevTools → Application → LocalStorage
3. Sprawdź klucz `product-rules-<userId>`
4. Wyłącz połączenie internetowe
5. Odśwież stronę

**Oczekiwany wynik:**
- Reguły nadal działają (pobrane z LocalStorage)
- Wszystkie ostrzeżenia są wyświetlane prawidłowo

### 9. Test czyszczenia i usuwania reguł

**Kroki:**
1. Przejdź do zakładki "Reguły" (Rules)
2. Sprawdź czy widzisz swoje reguły
3. Usuń jedną regułę
4. Wróć do analizy

**Oczekiwany wynik:**
- Reguła zniknęła z listy
- Produkty, które miały ostrzeżenie od tej reguły, nie mają już ostrzeżenia

### 10. Test trybu pre-launch (bez logowania)

**Kroki:**
1. Wyloguj się
2. Otwórz stronę
3. Spróbuj dodać regułę (kliknij flagę)

**Oczekiwany wynik:**
- Komunikat: "Zaloguj się, aby korzystać z funkcji reguł"
- Przycisk flagi nie działa lub wyświetla tooltip o konieczności logowania

## Znane problemy i workarounds

### Problem: "Cannot read properties of null (reading 'from')"
**Rozwiązanie:** Sprawdź czy tabela `product_rules` została utworzona w Supabase. Wykonaj migrację ponownie.

### Problem: Reguły nie są zapisywane
**Rozwiązanie:** 
1. Sprawdź czy `supabaseUserId` jest dostępne (konsola: `const { supabaseUserId } = useCurrentUser()`)
2. Sprawdź czy RLS policies są włączone w Supabase

### Problem: Kolory nie są widoczne
**Rozwiązanie:** Sprawdź czy klasy Tailwind są dostępne. Może być potrzebne dodanie do `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      yellow: {
        50: '#FEF3C7',
        600: '#F59E0B',
      },
      orange: {
        50: '#FFEDD5',
        600: '#F97316',
      },
      red: {
        50: '#FEE2E2',
        600: '#EF4444',
      }
    }
  }
}
```

## Następne kroki

Po potwierdzeniu, że wszystko działa:

1. ✅ Migracja SQL wykonana
2. ⏳ Testy w przeglądarce
3. ⏳ Aktualizacja `RulesManager.tsx`
4. ⏳ Aktualizacja `Rules.tsx`
5. ⏳ Deployment na produkcję

## Pliki do aktualizacji (jeszcze)

- `src/components/RulesManager.tsx` - zintegruj z `useProductRulesStore`
- `src/pages/Rules.tsx` - zintegruj z `useProductRulesStore`

## Debugging tips

**Sprawdź w konsoli przeglądarki:**
```javascript
// Zalogowane reguły
console.log('Product Rules:', useProductRulesStore.getState().rules)

// Aktualny użytkownik
console.log('User ID:', supabaseUserId)

// Supabase client
console.log('Supabase:', supabase)
```

**Sprawdź w Supabase Dashboard:**
1. Database → Tables → `product_rules`
2. Powinny być widoczne reguły z Twoim `user_id`
3. Sprawdź czy RLS jest włączony (Settings → API → Row Level Security)

