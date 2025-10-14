-- =====================================================
-- UTWORZENIE TABELI PRODUCTS
-- =====================================================
-- Tabela do przechowywania sparsowanych produktów
-- Zawiera wszystkie dane z parsera + ocenę z reguł
-- =====================================================

-- Sprawdzenie czy tabela już istnieje
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    RAISE NOTICE '⚠️  Tabela products już istnieje. Pomijam tworzenie.';
  ELSE
    RAISE NOTICE '✨ Tworzę tabelę products...';
  END IF;
END $$;

-- =====================================================
-- TABELA: products
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- =====================================================
  -- DANE Z PARSERA (wszystkie pola)
  -- =====================================================
  
  -- Podstawowe dane produktu
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  
  -- Ceny i ilości
  price DECIMAL(10,2),
  quantity INTEGER,
  unit TEXT,
  
  -- Identyfikatory
  ean TEXT,
  sku TEXT,
  brand TEXT,
  
  -- Dodatkowe pola specyficzne dla palet
  paleta_id TEXT,
  foto TEXT,
  code1 TEXT,
  code2 TEXT,
  pack_id TEXT,
  fc_sku TEXT,
  link TEXT,
  currency TEXT DEFAULT 'PLN',
  
  -- Cena regularna brutto (z palet)
  price_gross DECIMAL(10,2),
  price_net DECIMAL(10,2),
  
  -- =====================================================
  -- OCENA Z REGUŁ
  -- =====================================================
  
  score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  evaluation_data JSONB DEFAULT '{}'::jsonb,
  
  -- =====================================================
  -- METADANE
  -- =====================================================
  
  source TEXT, -- Nazwa pliku źródłowego
  row_index INTEGER, -- Numer wiersza w oryginalnym pliku
  raw_data JSONB, -- Pełne surowe dane z parsera
  
  -- =====================================================
  -- DATY
  -- =====================================================
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- =====================================================
  -- CONSTRAINTS
  -- =====================================================
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'ok', 'warning', 'blocked')),
  CONSTRAINT valid_score CHECK (score >= 0 AND score <= 100)
);

-- =====================================================
-- INDEKSY DLA WYDAJNOŚCI
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_products_analysis_id ON products(analysis_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_ean ON products(ean);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_score ON products(score DESC);

-- Indeks dla wyszukiwania pełnotekstowego
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);

-- GIN indeksy dla JSONB
CREATE INDEX IF NOT EXISTS idx_products_raw_data_gin ON products USING GIN (raw_data);
CREATE INDEX IF NOT EXISTS idx_products_evaluation_gin ON products USING GIN (evaluation_data);

-- Kompozytowe indeksy dla częstych zapytań
CREATE INDEX IF NOT EXISTS idx_products_user_analysis ON products(user_id, analysis_id);
CREATE INDEX IF NOT EXISTS idx_products_analysis_status ON products(analysis_id, status);

-- =====================================================
-- TRIGGER DLA updated_at
-- =====================================================

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Usunięcie starych polityk
DROP POLICY IF EXISTS "Users can view own products" ON products;
DROP POLICY IF EXISTS "Users can create own products" ON products;
DROP POLICY IF EXISTS "Users can update own products" ON products;
DROP POLICY IF EXISTS "Users can delete own products" ON products;

-- Użytkownik może zobaczyć TYLKO swoje produkty
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może tworzyć produkty
CREATE POLICY "Users can create own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może aktualizować TYLKO swoje produkty
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ))
  WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- Użytkownik może usuwać TYLKO swoje produkty
CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
  ));

-- =====================================================
-- WIDOK: Statystyki produktów
-- =====================================================

CREATE OR REPLACE VIEW product_statistics AS
SELECT 
  p.user_id,
  p.analysis_id,
  COUNT(*) AS total_products,
  COUNT(CASE WHEN p.status = 'ok' THEN 1 END) AS ok_products,
  COUNT(CASE WHEN p.status = 'warning' THEN 1 END) AS warning_products,
  COUNT(CASE WHEN p.status = 'blocked' THEN 1 END) AS blocked_products,
  AVG(p.score) AS average_score,
  SUM(p.price * p.quantity) AS total_value,
  COUNT(DISTINCT p.category) AS unique_categories
FROM products p
GROUP BY p.user_id, p.analysis_id;

-- =====================================================
-- FUNKCJA: Automatyczna aktualizacja statystyk analizy
-- =====================================================

CREATE OR REPLACE FUNCTION update_analysis_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Aktualizuj statystyki w tabeli analyses
  UPDATE analyses
  SET 
    total_products = (SELECT COUNT(*) FROM products WHERE analysis_id = NEW.analysis_id),
    valid_products = (SELECT COUNT(*) FROM products WHERE analysis_id = NEW.analysis_id AND status = 'ok'),
    invalid_products = (SELECT COUNT(*) FROM products WHERE analysis_id = NEW.analysis_id AND status = 'blocked'),
    average_score = (SELECT COALESCE(AVG(score), 0) FROM products WHERE analysis_id = NEW.analysis_id),
    updated_at = NOW()
  WHERE id = NEW.analysis_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do automatycznej aktualizacji statystyk
DROP TRIGGER IF EXISTS update_analysis_stats_trigger ON products;
CREATE TRIGGER update_analysis_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_analysis_stats();

-- =====================================================
-- PODSUMOWANIE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ Tabela products utworzona pomyślnie!';
  RAISE NOTICE '📊 Cechy tabeli:';
  RAISE NOTICE '  - Wszystkie pola z parsera: ✅';
  RAISE NOTICE '  - Ocena z reguł: ✅';
  RAISE NOTICE '  - RLS Security: ✅';
  RAISE NOTICE '  - Indeksy wydajnościowe: ✅';
  RAISE NOTICE '  - Auto-aktualizacja statystyk: ✅';
  RAISE NOTICE '';
  RAISE NOTICE '💡 Następny krok: Zaktualizuj TypeScript typy!';
END $$;





