# Instrukcje Debugowania - System Ostrzeżeń

## Problem: System nie koloruje rekordów i nie zapisuje reguł

### Zmiany wprowadzone

1. **RulesManager.tsx** - poprawka konfliktu nazw zmiennych
2. **AnalysisDetailPage.tsx** - dodane szczegółowe logowanie

## Kroki testowania

### 1. Sprawdź konsolę przeglądarki (F12)

Po otwarciu strony z analizą powinieneś zobaczyć:

```
📥 Loading product rules for user: [uuid]
🎯 X product rules loaded, re-evaluating products
🔍 analyzeProductsWithRules called, productRules.length: X
```

### 2. Dodaj regułę

1. Kliknij ikonę flagi obok produktu
2. W modalu wybierz poziom ostrzeżenia (np. HIGH)
3. Wpisz nazwę produktu lub kategorię
4. Kliknij "Dodaj regułę"

**Sprawdź w konsoli:**
```
💾 Saving rule: { type: "...", value: "...", level: "..." }
✅ Rule saved successfully
🔄 Reloading rules from store
🎯 X product rules loaded, re-evaluating products
🔍 analyzeProductsWithRules called, productRules.length: X
📋 Rules: [...]
✅ Evaluated products: [...]
```

### 3. Sprawdź czy produkty są kolorowane

Po dodaniu reguły, produkty pasujące powinny:
- Mieć kolorowe tło wiersza (żółty/pomarańczowy/czerwony)
- Mieć ikonę obok nazwy produktu
- Mieć badge w kolumnie "Status ostrzeżenia"

### 4. Sprawdź Supabase

1. Otwórz Supabase Dashboard
2. Database → Tables → `product_rules`
3. Sprawdź czy pojawił się nowy rekord

## Jeśli reguły się nie zapisują

**Sprawdź:**
1. Czy `supabaseUserId` jest dostępne (sprawdź w konsoli)
2. Czy `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY` są ustawione w `.env`
3. Czy tabela `product_rules` istnieje w Supabase
4. Czy migracja SQL została wykonana

**Przekaż:**
- Komunikaty błędów z konsoli
- Czy w konsoli widzisz `💾 Saving rule`
- Czy w Supabase Dashboard są rekordy w tabeli `product_rules`

## Jeśli produkty nie są kolorowane

**Sprawdź:**
1. Czy w konsoli widzisz `🎯 Applying new warning engine`
2. Czy widzisz `📋 Rules: [...]`
3. Czy widzisz `✅ Evaluated products: [...]`
4. Czy produkty pasują do reguły (sprawdź nazwę/kategorię)

**Przekaż:**
- Komunikaty z konsoli po dodaniu reguły
- Liczbę produktów w tabeli
- Czy produkty pasują do reguły (np. nazwa produktu = wartość reguły)

