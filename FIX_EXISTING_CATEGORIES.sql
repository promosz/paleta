-- =====================================================
-- NAPRAW KATEGORIE W ISTNIEJĄCYCH ANALIZACH
-- =====================================================
-- Ten skrypt automatycznie mapuje i normalizuje
-- kategorie we wszystkich produktach w bazie
-- =====================================================

-- Funkcja do automatycznej normalizacji kategorii
CREATE OR REPLACE FUNCTION normalize_category(cat TEXT)
RETURNS TEXT AS $$
DECLARE
  normalized TEXT;
BEGIN
  IF cat IS NULL OR TRIM(cat) = '' THEN
    RETURN 'INNE';
  END IF;
  
  normalized := TRIM(cat);
  
  -- Usuń prefiksy
  normalized := REGEXP_REPLACE(normalized, '^(gl_|cat_|kategoria_|category_|kat_)', '', 'i');
  
  -- Uppercase
  normalized := UPPER(normalized);
  
  -- Zamień znaki specjalne i spacje na podkreślenia
  normalized := REGEXP_REPLACE(normalized, '[^A-Z0-9]+', '_', 'g');
  
  -- Usuń podwójne podkreślenia
  normalized := REGEXP_REPLACE(normalized, '_+', '_', 'g');
  
  -- Usuń podkreślenia z początku/końca
  normalized := REGEXP_REPLACE(normalized, '^_|_$', '', 'g');
  
  IF normalized = '' THEN
    RETURN 'INNE';
  END IF;
  
  RETURN normalized;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- KROK 1: Normalizuj wszystkie kategorie
-- =====================================================

DO $$
DECLARE
  updated_count INTEGER := 0;
  total_products INTEGER;
BEGIN
  -- Policz produkty
  SELECT COUNT(*) INTO total_products FROM products WHERE category IS NOT NULL;
  
  RAISE NOTICE '📊 Znaleziono % produktów z kategoriami', total_products;
  
  -- Normalizuj kategorie
  UPDATE products
  SET category = normalize_category(category)
  WHERE category IS NOT NULL;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  RAISE NOTICE '✅ Znormalizowano % produktów', updated_count;
END $$;

-- =====================================================
-- KROK 2: Grupuj podobne kategorie (fuzzy matching)
-- =====================================================

-- Funkcja obliczająca podobieństwo (Levenshtein)
CREATE OR REPLACE FUNCTION similarity_score(str1 TEXT, str2 TEXT)
RETURNS FLOAT AS $$
DECLARE
  len1 INT := LENGTH(str1);
  len2 INT := LENGTH(str2);
  matrix INT[][];
  i INT;
  j INT;
  cost INT;
  distance INT;
  max_len INT;
BEGIN
  IF str1 = str2 THEN RETURN 1.0; END IF;
  IF len1 = 0 THEN RETURN 0.0; END IF;
  IF len2 = 0 THEN RETURN 0.0; END IF;
  
  -- Inicjalizacja macierzy
  FOR i IN 0..len1 LOOP
    matrix[i][0] := i;
  END LOOP;
  
  FOR j IN 0..len2 LOOP
    matrix[0][j] := j;
  END LOOP;
  
  -- Obliczanie odległości
  FOR i IN 1..len1 LOOP
    FOR j IN 1..len2 LOOP
      IF SUBSTRING(LOWER(str1), i, 1) = SUBSTRING(LOWER(str2), j, 1) THEN
        cost := 0;
      ELSE
        cost := 1;
      END IF;
      
      matrix[i][j] := LEAST(
        matrix[i-1][j] + 1,      -- deletion
        matrix[i][j-1] + 1,      -- insertion
        matrix[i-1][j-1] + cost  -- substitution
      );
    END LOOP;
  END LOOP;
  
  distance := matrix[len1][len2];
  max_len := GREATEST(len1, len2);
  
  RETURN 1.0 - (distance::FLOAT / max_len::FLOAT);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- KROK 3: Automatyczne grupowanie kategorii
-- =====================================================

DO $$
DECLARE
  cat RECORD;
  target_cat TEXT;
  sim_score FLOAT;
  merged_count INTEGER := 0;
BEGIN
  RAISE NOTICE '🔄 Rozpoczynam automatyczne grupowanie kategorii...';
  
  -- Dla każdej kategorii znajdź podobne
  FOR cat IN 
    SELECT DISTINCT category 
    FROM products 
    WHERE category IS NOT NULL 
    ORDER BY category
  LOOP
    -- Znajdź najbardziej podobną kategorię z wcześniejszych
    SELECT category INTO target_cat
    FROM products
    WHERE category IS NOT NULL 
      AND category < cat.category  -- tylko wcześniejsze alfabetycznie
      AND similarity_score(category, cat.category) >= 0.75
    ORDER BY similarity_score(category, cat.category) DESC
    LIMIT 1;
    
    -- Jeśli znaleziono podobną, zmerguj
    IF target_cat IS NOT NULL THEN
      sim_score := similarity_score(target_cat, cat.category);
      
      RAISE NOTICE '  Mergowanie: % → % (podobieństwo: %)', 
        cat.category, target_cat, ROUND(sim_score::NUMERIC, 2);
      
      UPDATE products
      SET category = target_cat
      WHERE category = cat.category;
      
      merged_count := merged_count + 1;
    END IF;
  END LOOP;
  
  RAISE NOTICE '✅ Zmergowano % grup kategorii', merged_count;
END $$;

-- =====================================================
-- KROK 4: Statystyki po normalizacji
-- =====================================================

DO $$
DECLARE
  total_products INTEGER;
  unique_categories INTEGER;
  top_categories TEXT;
BEGIN
  SELECT COUNT(*) INTO total_products FROM products;
  SELECT COUNT(DISTINCT category) INTO unique_categories FROM products WHERE category IS NOT NULL;
  
  SELECT STRING_AGG(category || ' (' || cnt || ')', ', ' ORDER BY cnt DESC)
  INTO top_categories
  FROM (
    SELECT category, COUNT(*) as cnt
    FROM products
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY cnt DESC
    LIMIT 10
  ) t;
  
  RAISE NOTICE '';
  RAISE NOTICE '📊 STATYSTYKI PO NORMALIZACJI:';
  RAISE NOTICE '  Produkty: %', total_products;
  RAISE NOTICE '  Unikalne kategorie: %', unique_categories;
  RAISE NOTICE '  Top 10 kategorii: %', top_categories;
  RAISE NOTICE '';
END $$;

-- =====================================================
-- PODSUMOWANIE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Normalizacja kategorii zakończona!';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Co zostało zrobione:';
  RAISE NOTICE '  1. Usunięto prefiksy (gl_, cat_, etc.)';
  RAISE NOTICE '  2. Znormalizowano wielkość liter (UPPERCASE)';
  RAISE NOTICE '  3. Usunięto znaki specjalne';
  RAISE NOTICE '  4. Zmergowano podobne kategorie (75%+ podobieństwa)';
  RAISE NOTICE '';
  RAISE NOTICE '🔄 Odśwież aplikację aby zobaczyć zmiany!';
END $$;

