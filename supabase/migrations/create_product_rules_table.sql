-- Utworzenie tabeli product_rules do przechowywania reguł ostrzeżeń produktów
CREATE TABLE IF NOT EXISTS product_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rule_type VARCHAR(20) NOT NULL CHECK (rule_type IN ('category', 'product', 'phrase')),
  rule_value TEXT NOT NULL,
  warning_level VARCHAR(10) NOT NULL CHECK (warning_level IN ('LOW', 'MEDIUM', 'HIGH')),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Włączenie Row Level Security
ALTER TABLE product_rules ENABLE ROW LEVEL SECURITY;

-- Policy: Użytkownicy mogą oglądać tylko swoje reguły
DROP POLICY IF EXISTS "Users can view own rules" ON product_rules;
CREATE POLICY "Users can view own rules"
  ON product_rules FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Użytkownicy mogą dodawać tylko swoje reguły
DROP POLICY IF EXISTS "Users can insert own rules" ON product_rules;
CREATE POLICY "Users can insert own rules"
  ON product_rules FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Użytkownicy mogą aktualizować tylko swoje reguły
DROP POLICY IF EXISTS "Users can update own rules" ON product_rules;
CREATE POLICY "Users can update own rules"
  ON product_rules FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Użytkownicy mogą usuwać tylko swoje reguły
DROP POLICY IF EXISTS "Users can delete own rules" ON product_rules;
CREATE POLICY "Users can delete own rules"
  ON product_rules FOR DELETE
  USING (auth.uid() = user_id);

-- Indeksy dla lepszej wydajności zapytań
CREATE INDEX IF NOT EXISTS idx_product_rules_user_id ON product_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_product_rules_type ON product_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_product_rules_level ON product_rules(warning_level);
CREATE INDEX IF NOT EXISTS idx_product_rules_active ON product_rules(is_active);

-- Funkcja automatycznego aktualizowania updated_at
CREATE OR REPLACE FUNCTION update_product_rules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger automatycznego aktualizowania updated_at
DROP TRIGGER IF EXISTS trigger_update_product_rules_updated_at ON product_rules;
CREATE TRIGGER trigger_update_product_rules_updated_at
  BEFORE UPDATE ON product_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rules_updated_at();

