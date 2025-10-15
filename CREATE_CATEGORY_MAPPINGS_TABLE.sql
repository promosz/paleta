-- =====================================================
-- CATEGORY MAPPINGS - Inteligentne mapowanie kategorii
-- =====================================================
-- Tabela przechowuje mapowania między oryginalnymi
-- nazwami kategorii a znormalizowanymi wersjami
-- =====================================================

-- Sprawdzenie czy tabela już istnieje
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'category_mappings') THEN
    RAISE NOTICE '⚠️  Tabela category_mappings już istnieje. Pomijam tworzenie.';
  ELSE
    RAISE NOTICE '✨ Tworzę tabelę category_mappings...';
  END IF;
END $$;

-- =====================================================
-- TABELA: category_mappings
-- =====================================================

CREATE TABLE IF NOT EXISTS category_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  
  -- =====================================================
  -- MAPOWANIE KATEGORII
  -- =====================================================
  
  original_category TEXT NOT NULL,
  normalized_category TEXT NOT NULL,
  
  -- =====================================================
  -- METADANE MAPOWANIA
  -- =====================================================
  
  confidence_score FLOAT DEFAULT 1.0,
  is_manual BOOLEAN DEFAULT false,
  mapping_algorithm TEXT DEFAULT 'fuzzy_match',
  similarity_score FLOAT,
  
  -- =====================================================
  -- TIMESTAMPS
  -- =====================================================
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- =====================================================
  -- CONSTRAINTS
  -- =====================================================
  
  CONSTRAINT valid_confidence CHECK (confidence_score >= 0 AND confidence_score <= 1),
  CONSTRAINT valid_similarity CHECK (similarity_score IS NULL OR (similarity_score >= 0 AND similarity_score <= 1)),
  UNIQUE(user_id, original_category)
);

-- =====================================================
-- INDEKSY DLA WYDAJNOŚCI
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_category_mappings_user ON category_mappings(user_id);
CREATE INDEX IF NOT EXISTS idx_category_mappings_analysis ON category_mappings(analysis_id);
CREATE INDEX IF NOT EXISTS idx_category_mappings_original ON category_mappings(original_category);
CREATE INDEX IF NOT EXISTS idx_category_mappings_normalized ON category_mappings(normalized_category);
CREATE INDEX IF NOT EXISTS idx_category_mappings_user_original ON category_mappings(user_id, original_category);

-- Indeks dla wyszukiwania pełnotekstowego
CREATE INDEX IF NOT EXISTS idx_category_mappings_original_trgm ON category_mappings USING gin (original_category gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_category_mappings_normalized_trgm ON category_mappings USING gin (normalized_category gin_trgm_ops);

-- =====================================================
-- TRIGGER DLA updated_at
-- =====================================================

DROP TRIGGER IF EXISTS category_mappings_updated_at ON category_mappings;
CREATE TRIGGER category_mappings_updated_at
  BEFORE UPDATE ON category_mappings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE category_mappings ENABLE ROW LEVEL SECURITY;

-- Usunięcie starych polityk
DROP POLICY IF EXISTS "Users can view own category mappings" ON category_mappings;
DROP POLICY IF EXISTS "Users can create own category mappings" ON category_mappings;
DROP POLICY IF EXISTS "Users can update own category mappings" ON category_mappings;
DROP POLICY IF EXISTS "Users can delete own category mappings" ON category_mappings;

-- Użytkownik może zobaczyć TYLKO swoje mapowania
CREATE POLICY "Users can view own category mappings"
  ON category_mappings FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może tworzyć mapowania
CREATE POLICY "Users can create own category mappings"
  ON category_mappings FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje mapowania
CREATE POLICY "Users can update own category mappings"
  ON category_mappings FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje mapowania
CREATE POLICY "Users can delete own category mappings"
  ON category_mappings FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- =====================================================
-- WIDOK: Statystyki mapowań kategorii
-- =====================================================

CREATE OR REPLACE VIEW category_mapping_statistics AS
SELECT 
  cm.user_id,
  COUNT(*) AS total_mappings,
  COUNT(DISTINCT cm.original_category) AS unique_originals,
  COUNT(DISTINCT cm.normalized_category) AS unique_normalized,
  COUNT(CASE WHEN cm.is_manual = true THEN 1 END) AS manual_mappings,
  COUNT(CASE WHEN cm.is_manual = false THEN 1 END) AS auto_mappings,
  AVG(cm.confidence_score) AS avg_confidence,
  AVG(cm.similarity_score) AS avg_similarity
FROM category_mappings cm
GROUP BY cm.user_id;

-- =====================================================
-- FUNKCJA: Znajdź podobne kategorie (fuzzy search)
-- =====================================================

CREATE OR REPLACE FUNCTION find_similar_categories(
  p_user_id UUID,
  p_category TEXT,
  p_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  normalized_category TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cm.normalized_category,
    similarity(cm.normalized_category, p_category) AS sim
  FROM category_mappings cm
  WHERE cm.user_id = p_user_id
    AND similarity(cm.normalized_category, p_category) >= p_threshold
  ORDER BY sim DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNKCJA: Auto-cleanup duplikatów
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_duplicate_mappings()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH duplicates AS (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY user_id, original_category 
        ORDER BY updated_at DESC
      ) AS rn
    FROM category_mappings
  )
  DELETE FROM category_mappings
  WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
  );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PODSUMOWANIE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Tabela category_mappings utworzona pomyślnie!';
  RAISE NOTICE '📊 Cechy tabeli:';
  RAISE NOTICE '  - Mapowanie oryginał → znormalizowana: ✅';
  RAISE NOTICE '  - Fuzzy matching z similarity score: ✅';
  RAISE NOTICE '  - RLS Security: ✅';
  RAISE NOTICE '  - Indeksy wydajnościowe: ✅';
  RAISE NOTICE '  - Funkcje pomocnicze: ✅';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Następny krok: Zaktualizuj TypeScript typy i serwisy!';
END $$;

