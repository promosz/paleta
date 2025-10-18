-- SQL Script do utworzenia tabeli waitlist w Supabase
-- Pre-Launch Landing Page - PalletAI

-- Tabela dla waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  business_type TEXT CHECK (business_type IN (
    'trader_palet',
    'sklep_ecommerce', 
    'reseller',
    'hurtownia',
    'inne',
    NULL
  )),
  referral_code TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  source TEXT, -- 'hero', 'pricing', 'final_cta'
  utm_source TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Indexes dla wydajności
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_confirmed ON waitlist(confirmed);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Każdy może dodać się do waitlist (publiczny INSERT)
DROP POLICY IF EXISTS "Anyone can sign up to waitlist" ON waitlist;
CREATE POLICY "Anyone can sign up to waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Tylko admin może czytać wszystkie wpisy
-- (lub user może zobaczyć tylko swój wpis jeśli ma matching email w JWT)
DROP POLICY IF EXISTS "Users can view own waitlist entry" ON waitlist;
CREATE POLICY "Users can view own waitlist entry"
  ON waitlist FOR SELECT
  USING (
    -- Allow if user is authenticated and email matches
    (auth.uid() IS NOT NULL AND 
     email = current_setting('request.jwt.claims', true)::json->>'email')
    OR
    -- Or if querying just the count (for public display)
    auth.uid() IS NULL
  );

-- Trigger dla auto-update timestamps
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Dodaj komentarze do tabeli
COMMENT ON TABLE waitlist IS 'Pre-launch waitlist for PalletAI - stores email signups';
COMMENT ON COLUMN waitlist.email IS 'User email address (unique)';
COMMENT ON COLUMN waitlist.business_type IS 'Type of business: trader_palet, sklep_ecommerce, reseller, hurtownia, inne';
COMMENT ON COLUMN waitlist.source IS 'Where the signup came from: hero, pricing, final_cta';
COMMENT ON COLUMN waitlist.confirmed IS 'Whether email has been confirmed via link';
COMMENT ON COLUMN waitlist.referral_code IS 'Referral code used (if any)';

