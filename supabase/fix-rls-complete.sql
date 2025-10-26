-- ============================================
-- WŁĄCZENIE RLS W PROJEKCIE PALLET-ANALYSIS-APP
-- ============================================
-- Uruchom ten skrypt w SQL Editor Supabase
-- Przejdź do: https://supabase.com/dashboard/project/[your-project-id]/sql
-- Wklej cały plik i kliknij "Run"

-- ============================================
-- KROK 1: Włącz RLS na wszystkich tabelach
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- KROK 2: Utwórz polityki dla tabeli USERS
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje własne dane
CREATE POLICY "Users can view own data"
ON public.users
FOR SELECT
USING (auth.uid() = id::text);

-- Polityka: Użytkownicy mogą aktualizować swoje własne dane
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid() = id::text);

-- ============================================
-- KROK 3: Utwórz polityki dla tabeli ANALYSES
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje własne analizy
CREATE POLICY "Users can view own analyses"
ON public.analyses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = analyses.user_id 
    AND auth.uid() = users.id::text
  )
);

-- Polityka: Użytkownicy mogą tworzyć swoje własne analizy
CREATE POLICY "Users can create own analyses"
ON public.analyses
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = analyses.user_id 
    AND auth.uid() = users.id::text
  )
);

-- Polityka: Użytkownicy mogą aktualizować swoje własne analizy
CREATE POLICY "Users can update own analyses"
ON public.analyses
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = analyses.user_id 
    AND auth.uid() = users.id::text
  )
);

-- Polityka: Użytkownicy mogą usuwać swoje własne analizy
CREATE POLICY "Users can delete own analyses"
ON public.analyses
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = analyses.user_id 
    AND auth.uid() = users.id::text
  )
);

-- ============================================
-- KROK 4: Utwórz polityki dla tabeli ANALYSIS_FILES
-- ============================================

-- Polityka: Użytkownicy mogą czytać pliki swoich analiz
CREATE POLICY "Users can view own analysis files"
ON public.analysis_files
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = analysis_files.analysis_id
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = analyses.user_id 
      AND auth.uid() = users.id::text
    )
  )
);

-- Polityka: Użytkownicy mogą tworzyć pliki swoich analiz
CREATE POLICY "Users can create own analysis files"
ON public.analysis_files
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.analyses 
    WHERE analyses.id = analysis_files.analysis_id
    AND EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = analyses.user_id 
      AND auth.uid() = users.id::text
    )
  )
);

-- ============================================
-- KROK 5: Utwórz polityki dla tabeli RULES
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje własne reguły
CREATE POLICY "Users can view own rules"
ON public.rules
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = rules.user_id 
    AND auth.uid() = users.id::text
  )
);

-- Polityka: Użytkownicy mogą tworzyć swoje własne reguły
CREATE POLICY "Users can create own rules"
ON public.rules
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = rules.user_id 
    AND auth.uid() = users.id::text
  )
);

-- ============================================
-- KROK 6: Utwórz polityki dla tabeli PRODUCTS
-- ============================================

-- Polityka: Wszyscy użytkownicy mogą czytać produkty (shared data)
CREATE POLICY "Users can view all products"
ON public.products
FOR SELECT
USING (true);

-- Polityka: Wszyscy użytkownicy mogą tworzyć produkty (shared data)
CREATE POLICY "Users can create products"
ON public.products
FOR INSERT
WITH CHECK (true);

-- ============================================
-- UWAGA: Zmieniono auth.uid() na sprawdzanie Clerk token
-- ============================================
-- Ponieważ używamy Clerk do autoryzacji, Supabase auth.uid() 
-- może nie działać poprawnie. Po włączeniu RLS skonfiguruj
-- Clerk JWT token w Supabase Dashboard.

