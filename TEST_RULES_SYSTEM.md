# Debug: System Ostrzeżeń dla Produktów

## Możliwe przyczyny błędów

### 1. Problem z zapisem reguły do Supabase

**Objawy:**
- "Nie udało się zapisać reguły"
- Błędy w konsoli przeglądarki

**Sprawdź w konsoli przeglądarki (F12 → Console):**

```javascript
// 1. Czy Supabase jest skonfigurowany?
console.log('Supabase:', window.supabaseClient)

// 2. Czy masz userId?
const { supabaseUserId } = useCurrentUser()
console.log('User ID:', supabaseUserId)

// 3. Spróbuj zapisać regułę manualnie
const testRule = {
  ruleType: 'phrase',
  ruleValue: 'test',
  warningLevel: 'MEDIUM',
  description: 'Test',
  isActive: true
}
console.log('Test rule:', testRule)
```

### 2. Problem z kolorowaniem wierszy

**Objawy:**
- Wiersze nie mają kolorowego tła mimo istnienia reguł

**Możliwe przyczyny:**
1. Reguły nie są ładowane z Supabase
2. `productRules` jest pusty
3. `productWarningEngine` nie ocenia produktów

**Sprawdź w konsoli:**

```javascript
// Czy reguły są załadowane?
const { rules } = useProductRulesStore.getState()
console.log('Rules:', rules)

// Czy produkty mają warningLevel?
console.log('Products with warnings:', productsWithStatus.filter(p => p.warningLevel))
```

### 3. Debug krok po kroku

1. **Otwórz konsolę przeglądarki** (F12)

2. **Sprawdź czy strona się ładuje:**
   ```
   📥 Loading product rules for user: <userId>
   ```

3. **Po dodaniu reguły:**
   ```
   💾 Saving rule: {...}
   ✅ Rule saved successfully
   🎯 X product rules loaded, re-evaluating products
   ```

4. **Jeśli brak logów:**
   - Sprawdź czy jesteś zalogowany
   - Sprawdź czy `supabaseUserId` jest dostępne

### 4. Sprawdzenie w Supabase Dashboard

1. Otwórz: https://supabase.com/dashboard
2. Przejdź do: Database → Tables → `product_rules`
3. Sprawdź czy są rekordy w tabeli
4. Sprawdź czy rekordy mają poprawne `user_id`

### 5. Test manualny - zapis reguły

W konsoli przeglądarki wykonaj:

```javascript
// Pobierz store
const store = useProductRulesStore.getState()

// Test dodania reguły
store.addRule({
  ruleType: 'phrase',
  ruleValue: 'test fraza',
  warningLevel: 'HIGH',
  isActive: true
}, 'twoj-user-id')
```

Jeśli to zadziała, problem jest w komponencie modalnym.

### 6. Sprawdzenie błędu w konsoli

Kliknij w konsoli na czerwony błąd i pokaż mi treść błędu.

**Częste błędy:**

1. `Cannot read properties of null (reading 'from')`
   - Supabase nie jest skonfigurowany
   - Sprawdź `.env` z `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY`

2. `relation "public.product_rules" does not exist`
   - Tabela nie została utworzona
   - Wykonaj migrację SQL ponownie

3. `new row violates row-level security policy`
   - Błąd RLS - sprawdź czy użytkownik jest zalogowany
   - Sprawdź czy policies są poprawnie skonfigurowane

### 7. Szybka poprawka

Jeśli nadal nie działa, wykonaj:

1. **W Supabase Dashboard:**
   - SQL Editor
   - Wykonaj ponownie migrację (`create_product_rules_table.sql`)

2. **W przeglądarce:**
   - F12 → Application → Local Storage
   - Usuń wszystkie klucze zawierające `product-rules`
   - Odśwież stronę

3. **Sprawdź Console:**
   - Czy pojawia się: `📥 Loading product rules for user: <userId>`
   - Czy pojawia się: `🎯 X product rules loaded`

## Podsumowanie kroków diagnostycznych

✅ Sprawdź konfigurację Supabase w `.env`
✅ Sprawdź logi w konsoli przeglądarki (F12)
✅ Sprawdź czy tabela `product_rules` istnieje w Supabase
✅ Sprawdź czy reguły są zapisywane w bazie danych
✅ Sprawdź czy `productRules` store jest aktualizowany
✅ Sprawdź czy `productWarningEngine` ocenia produkty

## Co mi przekazać

Jeśli nadal nie działa, wklej tutaj:
1. Treść błędu z konsoli przeglądarki
2. Czy w konsoli pojawiają się logi (📥, 💾, ✅, 🎯)
3. Czy tabela `product_rules` ma rekordy w Supabase

