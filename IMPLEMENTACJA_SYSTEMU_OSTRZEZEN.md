# Implementacja Trzystopniowego Systemu Ostrzeżeń dla Produktów

## Status implementacji

### Zrealizowane komponenty ✅

1. **Baza danych Supabase**
   - ✅ Migracja SQL: `supabase/migrations/create_product_rules_table.sql`
   - ✅ Tabela `product_rules` z RLS policies
   - ✅ Indeksy dla wydajności
   - ✅ Trigger automatycznego aktualizowania `updated_at`

2. **TypeScript Types**
   - ✅ `src/types/rules.ts` - dodano typy: `ProductWarningLevel`, `ProductRuleType`, `ProductRule`, `ProductWithWarning`, `AppliedProductRule`
   - ✅ `src/types/supabase.ts` - dodano definicję tabeli `product_rules`
   - ✅ Funkcja migracji: `migrateOldRuleToNew()`

3. **Serwisy**
   - ✅ `src/services/productRulesService.ts` - CRUD operacje dla reguł
   - ✅ `src/services/productWarningEngine.ts` - logika oceny produktów z priorytetami
   - ✅ Wsparcie LocalStorage dla trybu offline

4. **Zustand Store**
   - ✅ `src/stores/productRulesStore.ts` - globalny stan reguł z Supabase

5. **Komponenty UI**
   - ✅ `src/components/ProductWarningBadge.tsx` - badge z ikoną i poziomem ostrzeżenia
   - ✅ `src/components/AddRuleModal.tsx` - modal dodawania reguły z walidacją

6. **Częściowa integracja**
   - ✅ `src/pages/AnalysisDetailPage.tsx` - zaczęto integrację (import, stan, useEffect)

### Do zrealizowania 🔄

1. **Ukończenie integracji AnalysisDetailPage.tsx**
   - [ ] Zastąpienie starej logiki `analyzeProductsWithRules` przez `productWarningEngine.evaluateProducts()`
   - [ ] Dodanie kolumny "Status" w tabeli produktów
   - [ ] Kolorowe tło wierszy według `warningLevel`
   - [ ] Ikonka obok nazwy produktu
   - [ ] Przycisk "Dodaj regułę" w kolumnie akcji
   - [ ] Modal `AddRuleModal` z integracją
   - [ ] Obsługa trybu pre-launch (bez `supabaseUserId`)

2. **Aktualizacja RulesManager.tsx**
   - [ ] Zamiana localStorage na Supabase (useProductRulesStore)
   - [ ] Obsługa trzech poziomów ostrzeżeń (LOW/MEDIUM/HIGH)
   - [ ] Obsługa typu "fraza tekstowa"
   - [ ] Zakładki filtrowania (LOW/MEDIUM/HIGH)
   - [ ] Liczniki statystyk
   - [ ] Tryb pre-launch

3. **Aktualizacja Rules.tsx**
   - [ ] Integracja z useProductRulesStore
   - [ ] Warunek dla trybu pre-launch

4. **Testowanie**
   - [ ] Utworzenie użytkowników testowych
   - [ ] Weryfikacja izolacji danych
   - [ ] Test priorytetów (LOW + HIGH = HIGH)
   - [ ] Test migracji LocalStorage → Supabase
   - [ ] Test trybu offline
   - [ ] Test trybu pre-launch

## Następne kroki

Aby ukończyć implementację:

1. **Dokończ integrację w AnalysisDetailPage.tsx**:
   ```typescript
   // W funkcji analyzeProductsWithRules:
   // 1. Zastąp starą logikę (linie 200-222) przez:
   const evaluatedProducts = productWarningEngine.evaluateProducts(mappedProducts, productRules)
   setProductsWithStatus(evaluatedProducts)
   
   // 2. Dodaj obsługę przycisku dodawania reguły:
   const handleAddRuleClick = (product: Product) => {
     setSelectedProductForRule(product)
     setShowAddRuleModal(true)
   }
   
   // 3. Obsługa zapisu reguły:
   const handleSaveRule = async (rule: Omit<ProductRule, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
     if (!supabaseUserId) return
     await addRule(rule, supabaseUserId)
     setShowAddRuleModal(false)
     // Odświeżenie produktów
     analyzeProductsWithRules()
   }
   ```

2. **Dodaj wizualizację w tabeli produktów**:
   ```typescript
   // W renderContentTab(), dodaj kolumnę przed "Akcje":
   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
   
   // W wierszu produktu, przed komórką akcji:
   <td className={`px-4 py-3 ${getWarningRowBg(product.warningLevel)}`}>
     {product.warningLevel && (
       <ProductWarningBadge 
         level={product.warningLevel} 
         appliedRules={product.appliedRules} 
       />
     )}
   </td>
   
   // Funkcja pomocnicza:
   const getWarningRowBg = (level?: ProductWarningLevel) => {
     switch (level) {
       case 'LOW': return 'bg-yellow-50'
       case 'MEDIUM': return 'bg-orange-50'
       case 'HIGH': return 'bg-red-50'
       default: return ''
     }
   }
   ```

3. **Uruchom migrację SQL w Supabase**:
   - Otwórz Supabase Dashboard → SQL Editor
   - Wklej zawartość `supabase/migrations/create_product_rules_table.sql`
   - Kliknij "Run"

## Instrukcje uruchomienia migracji

1. Przejdź do https://supabase.com/dashboard/project/your-project-id/sql
2. Otwórz plik `supabase/migrations/create_product_rules_table.sql`
3. Skopiuj całą zawartość
4. Wklej do SQL Editor w Supabase
5. Kliknij "Run"
6. Sprawdź czy tabela `product_rules` została utworzona (Database → Tables)

## Notatki techniczne

- System używa istniejącego RLS (Row Level Security) w Supabase
- Reguły są przypisane do `user_id` z Clerk
- Kompatybilność wsteczna: stare reguły z localStorage są automatycznie migrowane
- Trzystopniowa skala: LOW (żółty) < MEDIUM (pomarańczowy) < HIGH (czerwony)
- Priorytety: najwyższy poziom wygrywa (np. LOW + HIGH = HIGH)

