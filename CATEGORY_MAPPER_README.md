# Category Mapper System - Dokumentacja

## 📋 Przegląd

Category Mapper System to inteligentny system mapowania i normalizacji kategorii produktów w aplikacji PalletAI. Automatycznie grupuje podobne kategorie (np. "gl_pc" i "PC") i mapuje je na jedną znormalizowaną nazwę.

## 🎯 Funkcjonalności

### 1. Automatyczna normalizacja kategorii
- Usuwanie prefiksów (`gl_`, `cat_`, `kategoria_`)
- Normalizacja wielkości liter (uppercase)
- Usuwanie znaków specjalnych
- Grupowanie podobnych nazw

### 2. Fuzzy Matching (Levenshtein Distance)
- Algorytm obliczający podobieństwo między stringami
- Threshold 75% dla automatycznego dopasowania
- Confidence score dla każdego mapowania

### 3. Zarządzanie mapowaniami
- Automatyczne mapowanie przy analizie pliku
- Ręczna edycja mapowań przez użytkownika
- Podgląd zmian przed zastosowaniem
- Statystyki i raporty

## 🏗️ Architektura

### Komponenty

```
src/
├── utils/
│   └── categoryNormalizer.ts       # Algorytmy normalizacji i fuzzy matching
├── services/
│   └── categoryMapperService.ts    # Serwis zarządzania mapowaniami
├── components/
│   └── CategoryManager.tsx         # UI do zarządzania kategoriami
└── pages/
    └── AnalysisDetailPage.tsx      # Integracja w widoku analizy
```

### Baza danych

```sql
CREATE TABLE category_mappings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  analysis_id UUID,
  original_category TEXT NOT NULL,
  normalized_category TEXT NOT NULL,
  confidence_score FLOAT,
  is_manual BOOLEAN,
  similarity_score FLOAT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  UNIQUE(user_id, original_category)
);
```

## 🚀 Użycie

### 1. Uruchomienie SQL w Supabase

```bash
# W Supabase SQL Editor wykonaj:
cat CREATE_CATEGORY_MAPPINGS_TABLE.sql
```

### 2. Automatyczne mapowanie

System automatycznie mapuje kategorie przy każdej nowej analizie:

```typescript
import { CategoryMapperService } from './services/categoryMapperService'

// Auto-mapowanie
const categoryMap = await CategoryMapperService.autoMapCategories(
  userId,
  analysisId,
  products
)

// Aktualizacja produktów w bazie
await CategoryMapperService.updateProductCategories(analysisId, categoryMap)
```

### 3. Ręczne zarządzanie

Użytkownik może otworzyć Category Manager z widoku analizy:

1. Kliknij przycisk **"Kategorie (X)"** w nagłówku
2. Zobacz podgląd auto-mapowania
3. Edytuj mapowania ręcznie w zakładce "Wszystkie mapowania"
4. Kliknij **"Zastosuj auto-mapowanie"** lub **"Zapisz zmiany"**

## 📊 Przykłady

### Przykład 1: Normalizacja prostych kategorii

```typescript
import { CategoryNormalizer } from './utils/categoryNormalizer'

CategoryNormalizer.normalize('gl_pc')        // → "PC"
CategoryNormalizer.normalize('GL_KITCHEN')   // → "KITCHEN"
CategoryNormalizer.normalize('kategoria_AGD') // → "AGD"
CategoryNormalizer.normalize('  home & garden  ') // → "HOME_GARDEN"
```

### Przykład 2: Fuzzy Matching

```typescript
const categories = ['PC', 'pc', 'GL_PC', 'COMPUTERS']
const groupMap = CategoryNormalizer.groupSimilarCategories(categories, 0.75)

// Rezultat:
// PC → PC
// pc → PC
// GL_PC → PC
// COMPUTERS → COMPUTERS (nowa kategoria, < 75% podobieństwa)
```

### Przykład 3: Preview przed zastosowaniem

```typescript
const preview = await CategoryMapperService.previewAutoMapping(userId, products)

// Rezultat:
// [
//   { original: 'gl_pc', normalized: 'PC', action: 'fuzzy_match', confidence: 0.95 },
//   { original: 'KITCHEN', normalized: 'KITCHEN', action: 'existing', confidence: 1.0 },
//   { original: 'NEW_CAT', normalized: 'NEW_CAT', action: 'new', confidence: 0.8 }
// ]
```

## 🔧 API Reference

### CategoryNormalizer

#### `normalize(category: string): string`
Normalizuje nazwę kategorii.

#### `similarity(str1: string, str2: string): number`
Oblicza podobieństwo (0-1) używając Levenshtein distance.

#### `findBestMatch(target: string, candidates: string[], threshold: number): CategoryMapping | null`
Znajduje najbardziej podobną kategorię z listy kandydatów.

#### `groupSimilarCategories(categories: string[], threshold: number): Map<string, string>`
Grupuje podobne kategorie razem.

### CategoryMapperService

#### `getUserMappings(userId: string): Promise<CategoryMappingDB[]>`
Pobiera wszystkie mapowania użytkownika.

#### `autoMapCategories(userId: string, analysisId: string, products: Product[]): Promise<Map<string, string>>`
Główna funkcja auto-mapowania kategorii.

#### `updateProductCategories(analysisId: string, categoryMap: Map<string, string>): Promise<{updated: number, errors: number}>`
Aktualizuje kategorie produktów w bazie danych.

#### `previewAutoMapping(userId: string, products: Product[]): Promise<Array<{...}>>`
Preview zmian przed zastosowaniem.

## 📈 Statystyki

### Metryki systemu

```typescript
const stats = await CategoryMapperService.getMappingStats(userId)

// {
//   totalMappings: 45,
//   uniqueOriginals: 42,
//   uniqueNormalized: 15,
//   manualMappings: 3,
//   autoMappings: 42,
//   avgConfidence: 0.87
// }
```

### Statystyki kategorii

```typescript
import { CategoryNormalizer } from './utils/categoryNormalizer'

const stats = CategoryNormalizer.getCategoryStats(categories)

// {
//   total: 150,
//   unique: 45,
//   normalized: 15,
//   duplicates: 30,
//   groupings: [
//     { normalized: 'PC', originals: ['pc', 'PC', 'gl_pc'], count: 3 },
//     { normalized: 'KITCHEN', originals: ['kitchen', 'GL_KITCHEN'], count: 2 }
//   ]
// }
```

## 🎨 UI Components

### CategoryManager

Modal do zarządzania mapowaniami kategorii:

**Props:**
- `userId: string` - ID użytkownika
- `analysisId: string` - ID analizy
- `products: Product[]` - Lista produktów
- `onClose: () => void` - Callback zamknięcia
- `onMappingsUpdate: () => void` - Callback po aktualizacji

**Zakładki:**
1. **Podgląd auto-mapowania** - Preview zmian przed zastosowaniem
2. **Wszystkie mapowania** - Ręczna edycja mapowań

**Statystyki:**
- Istniejące mapowania (zielone)
- Dopasowane fuzzy (niebieskie)
- Nowe kategorie (żółte)

## 🔐 Bezpieczeństwo

### Row Level Security (RLS)

Wszystkie mapowania są izolowane per użytkownik:

```sql
-- Użytkownik widzi TYLKO swoje mapowania
CREATE POLICY "Users can view own category mappings"
  ON category_mappings FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));
```

## 🐛 Troubleshooting

### Problem: Tabela category_mappings nie istnieje

**Rozwiązanie:**
```bash
# Wykonaj SQL w Supabase:
psql -h <host> -U postgres -d postgres -f CREATE_CATEGORY_MAPPINGS_TABLE.sql
```

### Problem: TypeScript błędy typu

**Rozwiązanie:**
Tabela używa `(supabase as any)` jako workaround. Aby naprawić:

1. Wygeneruj nowe typy Supabase:
```bash
npx supabase gen types typescript --project-id <project-id> > src/types/supabase.ts
```

2. Usuń `as any` z `categoryMapperService.ts`

### Problem: Mapowania nie są stosowane

**Rozwiązanie:**
Sprawdź logi w konsoli:
```typescript
console.log('🔄 Starting auto-mapping for analysis:', analysisId)
console.log('📊 Found unique categories:', categories)
```

## 📝 TODO / Roadmap

- [ ] Dodać batch processing dla dużych analiz (>1000 produktów)
- [ ] Implementować ML model dla lepszego fuzzy matching
- [ ] Dodać eksport/import mapowań między użytkownikami
- [ ] Stworzyć globalny słownik kategorii (community-driven)
- [ ] Dodać sugestie kategorii oparte na AI
- [ ] Implementować wersjonowanie mapowań (history)

## 🤝 Wkład

System został stworzony jako część projektu PalletAI.

**Autor:** AI Assistant (Claude Sonnet 4.5)  
**Data:** 15 października 2025  
**Wersja:** 1.0.0

## 📄 Licencja

Część projektu PalletAI - wszystkie prawa zastrzeżone.

