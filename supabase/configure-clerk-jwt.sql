-- ============================================
-- KONFIGURACJA CLERK JWT W SUPABASE
-- ============================================
-- Ważne: Clerk używa JWT tokenów, które Supabase musi rozpoznać
-- Ten skrypt konfiguruje Supabase do akceptowania Clerk JWT

-- Sprawdź czy istnieje funkcja do pobierania Clerk user_id
-- Jeśli nie, utworzymy pomocniczą funkcję

CREATE OR REPLACE FUNCTION auth.clerk_user_id()
RETURNS text AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE sql STABLE;

-- Sprawdź czy funkcja działa poprawnie
-- Ta funkcja pobiera Clerk user_id z JWT claims

-- UWAGA: Supabase używa auth.uid(), ale to sprawdza Supabase Auth
-- My używamy Clerk Auth, więc musimy używać custom claims

-- Alternatywnie, możemy użyć tej funkcji dla sprawdzania user_id:
CREATE OR REPLACE FUNCTION public.get_clerk_user_id()
RETURNS text AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'user_id', '')::text;
$$ LANGUAGE sql STABLE;

-- To pozwoli na sprawdzanie Clerk user_id w politykach RLS

