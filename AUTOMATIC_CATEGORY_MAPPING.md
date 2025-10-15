# Automatyczne mapowanie kategorii - Zmiany

## ✅ Co zostało zrobione:

### 1. **Automatyczne mapowanie przy uploadzinie pliku** ✅
- System **automatycznie** mapuje kategorie po dodaniu pliku
- **Brak interakcji użytkownika** - działa w tle
- Kategorie są znormalizowane i zmergowane **przed** wyświetleniem

**Zmieniony plik:**
- `src/hooks/useFileAnalysis.ts` - dodano auto-mapowanie po zapisie produktów

### 2. **SQL do naprawy istniejących danych** ✅
- Skrypt SQL naprawia kategorie we **wszystkich** istniejących produktach
- Normalizuje nazwy kategorii
- Grupuje podobne kategorie (fuzzy matching 75%+)

**Nowy plik:**
- `FIX_EXISTING_CATEGORIES.sql` - gotowy do uruchomienia w Supabase

### 3. **Usunięty przycisk "Kategorie"** ✅
- Przycisk usunięty z `AnalysisDetailPage`
- Mapowanie działa automatycznie - przycisk niepotrzebny
- UI jest czystszy

---

## 🚀 Jak używać:

### Krok 1: Napraw istniejące dane (jednorazowo)

**W Supabase SQL Editor:**

```sql
-- Uruchom CREATE_CATEGORY_MAPPINGS_TABLE.sql (jeśli nie zrobiono wcześniej)
-- Następnie:
-- Uruchom FIX_EXISTING_CATEGORIES.sql
```

To naprawi wszystkie kategorie w istniejących analizach.

### Krok 2: Nowe pliki - automatyczne mapowanie

**Teraz gdy użytkownik:**
1. Dodaje plik Excel/CSV
2. Plik jest przetwarzany
3. **Kategorie są AUTOMATYCZNIE zmapowane** (w tle)
4. Użytkownik widzi już znormalizowane kategorie

**Żadna akcja użytkownika nie jest wymagana!** 🎉

---

## 📊 Przykład działania:

**Przed (w pliku Excel):**
```
gl_pc         → 10 produktów
PC            → 5 produktów
pc            → 3 produkty
GL_KITCHEN    → 8 produktów
kitchen       → 4 produkty
```

**Po (automatycznie w aplikacji):**
```
PC            → 18 produktów (gl_pc + PC + pc)
KITCHEN       → 12 produktów (GL_KITCHEN + kitchen)
```

---

## 🔧 Zmiany techniczne:

### `src/hooks/useFileAnalysis.ts`

Dodano automatyczne mapowanie po zapisie produktów:

```typescript
// **AUTOMATYCZNE MAPOWANIE KATEGORII** - bez interakcji użytkownika
console.log('🔄 Rozpoczynam automatyczne mapowanie kategorii...')
try {
  const categoryMap = await CategoryMapperService.autoMapCategories(
    supabaseUserId,
    analysis.id,
    savedProducts.map(p => ({ 
      kategoria: p.category || 'INNE',
      ...p 
    }))
  )
  
  console.log('✅ Auto-mapowanie zakończone:', categoryMap.size, 'kategorii zmapowanych')
  
  // Aktualizuj kategorie produktów w bazie
  const updateResult = await CategoryMapperService.updateProductCategories(
    analysis.id,
    categoryMap
  )
  
  console.log('✅ Kategorie zaktualizowane:', updateResult.updated, 'produktów')
  
} catch (mapError) {
  console.error('⚠️ Błąd mapowania kategorii (kontynuuję):', mapError)
  // Nie przerywamy - mapowanie jest opcjonalne
}
```

### `FIX_EXISTING_CATEGORIES.sql`

Nowy skrypt SQL z funkcjami:

1. **`normalize_category(TEXT)`** - normalizacja nazwy kategorii
   - Usuwa prefiksy (gl_, cat_, etc.)
   - Konwertuje na UPPERCASE
   - Usuwa znaki specjalne
   
2. **`similarity_score(TEXT, TEXT)`** - oblicza podobieństwo (Levenshtein)
   - Zwraca wartość 0-1
   - Wykorzystywane do fuzzy matching

3. **Automatyczne grupowanie** - merguje podobne kategorie
   - Threshold: 75% podobieństwa
   - Alfabetyczne sortowanie dla spójności

---

## 📝 Logi w konsoli:

Po dodaniu pliku zobaczysz w konsoli:

```
💾 Zapisuję produkty do bazy danych...
✅ Produkty zapisane w bazie: 25
🔄 Rozpoczynam automatyczne mapowanie kategorii...
📊 Found unique categories: 8 ["gl_pc", "PC", "kitchen", "GL_KITCHEN", ...]
📋 Existing normalized categories: 3 ["PC", "KITCHEN", "AGD"]
🆕 Creating new mapping: gl_pc → PC (method: fuzzy_match, similarity: 0.85)
✓ Using existing mapping: PC → PC
🆕 Creating new mapping: kitchen → KITCHEN (method: fuzzy_match, similarity: 0.92)
✅ Auto-mapowanie zakończone: 8 kategorii zmapowanych
✅ Kategorie zaktualizowane: 5 produktów
```

---

## 🎯 Co dalej?

### Opcjonalnie - jeśli chcesz powrócić do ręcznego trybu:

1. Przywróć przycisk "Kategorie" w `AnalysisDetailPage.tsx`
2. Usuń auto-mapowanie z `useFileAnalysis.ts`
3. Użytkownik będzie mógł ręcznie zarządzać kategoriami

**Ale obecne rozwiązanie jest w pełni automatyczne zgodnie z wymaganiami!** ✅

---

## 🐛 Rozwiązywanie problemów:

### Problem: Kategorie nie są mapowane

**Rozwiązanie:**
1. Sprawdź logi w konsoli (F12 → Console)
2. Upewnij się że tabela `category_mappings` istnieje:
   ```sql
   SELECT * FROM category_mappings LIMIT 5;
   ```
3. Jeśli tabela nie istnieje, uruchom `CREATE_CATEGORY_MAPPINGS_TABLE.sql`

### Problem: Istniejące dane nie są poprawione

**Rozwiązanie:**
1. Uruchom `FIX_EXISTING_CATEGORIES.sql` w Supabase SQL Editor
2. Odśwież stronę aplikacji (Ctrl+F5)
3. Sprawdź kategorie w widoku analizy

---

## ✨ Podsumowanie:

- ✅ **Automatyczne mapowanie** przy każdym nowym pliku
- ✅ **SQL do naprawy** istniejących danych
- ✅ **Czysty UI** bez zbędnych przycisków
- ✅ **Pełna automatyzacja** - zero interakcji użytkownika
- ✅ **Inteligentne grupowanie** - fuzzy matching 75%+

**System działa w pełni automatycznie zgodnie z wymaganiami użytkownika!** 🎉

