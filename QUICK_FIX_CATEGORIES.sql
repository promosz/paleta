-- =====================================================
-- SZYBKA NAPRAWA KATEGORII - Usuń prefiksy gl_, cat_, etc.
-- =====================================================
-- Skopiuj i wklej ten kod do Supabase SQL Editor
-- =====================================================

-- Funkcja normalizacji
CREATE OR REPLACE FUNCTION normalize_category(cat TEXT)
RETURNS TEXT AS $$
BEGIN
  IF cat IS NULL OR TRIM(cat) = '' THEN
    RETURN 'INNE';
  END IF;
  
  -- Usuń prefiksy i normalizuj
  RETURN UPPER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(cat, '^(gl_|cat_|kategoria_|category_|kat_)', '', 'i'),
      '[^A-Z0-9]+', '_', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Aktualizuj wszystkie kategorie
UPDATE products
SET category = normalize_category(category)
WHERE category IS NOT NULL;

-- Pokaż wynik
SELECT 
  COUNT(*) as total_products,
  COUNT(DISTINCT category) as unique_categories,
  STRING_AGG(DISTINCT category, ', ' ORDER BY category) as categories
FROM products
WHERE category IS NOT NULL;

