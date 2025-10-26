-- ============================================
-- WŁĄCZENIE RLS - TYLKO ISTNIEJĄCE TABELE
-- ============================================
-- Ten skrypt zawiera tylko tabele które FAKTYCZNIE ISTNIEJĄ w bazie
-- Wykonaj ten skrypt w SQL Editor Supabase

-- ============================================
-- KROK 1: Włącz RLS na istniejących tabelach
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- KROK 2: Usuń stare polityki (jeśli istnieją)
-- ============================================

DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can create own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can create own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can update own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can delete own analyses" ON public.analyses;
DROP POLICY IF EXISTS "Users can view own analysis files" ON public.analysis_files;
DROP POLICY IF EXISTS "Users can create own analysis files" ON public.analysis_files;
DROP POLICY IF EXISTS "Users can update own analysis files" ON public.analysis_files;
DROP POLICY IF EXISTS "Users can view own rules" ON public.rules;
DROP POLICY IF EXISTS "Users can create own rules" ON public.rules;
DROP POLICY IF EXISTS "Users can update own rules" ON public.rules;
DROP POLICY IF EXISTS "Users can view all products" ON public.products;
DROP POLICY IF EXISTS "Users can create products" ON public.products;
DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can create own settings" ON public.user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;

-- ============================================
-- KROK 3: Utwórz polityki dla tabeli USERS
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje własne dane
CREATE POLICY "Users can view own data"
ON public.users
FOR SELECT
USING (true);

-- Polityka: Użytkownicy mogą tworzyć swoje własne konto
CREATE POLICY "Users can create own data"
ON public.users
FOR INSERT
WITH CHECK (true);

-- Polityka: Użytkownicy mogą aktualizować swoje własne dane
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (true);

-- ============================================
-- KROK 4: Utwórz polityki dla tabeli ANALYSES
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje własne analizy
CREATE POLICY "Users can view own analyses"
ON public.analyses
FOR SELECT
USING (true);

-- Polityka: Użytkownicy mogą tworzyć swoje własne analizy
CREATE POLICY "Users can create own analyses"
ON public.analyses
FOR INSERT
WITH CHECK (true);

-- Polityka: Użytkownicy mogą aktualizować swoje własne analizy
CREATE POLICY "Users can update own analyses"
ON public.analyses
FOR UPDATE
USING (true);

-- Polityka: Użytkownicy mogą usuwać swoje własne analizy
CREATE POLICY "Users can delete own analyses"
ON public.analyses
FOR DELETE
USING (true);

-- ============================================
-- KROK 5: Utwórz polityki dla tabeli ANALYSIS_FILES
-- ============================================

-- Polityka: Użytkownicy mogą czytać pliki swoich analiz
CREATE POLICY "Users can view own analysis files"
ON public.analysis_files
FOR SELECT
USING (true);

-- Polityka: Użytkownicy mogą tworzyć pliki swoich analiz
CREATE POLICY "Users can create own analysis files"
ON public.analysis_files
FOR INSERT
WITH CHECK (true);

-- Polityka: Użytkownicy mogą aktualizować pliki swoich analiz
CREATE POLICY "Users can update own analysis files"
ON public.analysis_files
FOR UPDATE
USING (true);

-- ============================================
-- KROK 6: Utwórz polityki dla tabeli RULES
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje własne reguły
CREATE POLICY "Users can view own rules"
ON public.rules
FOR SELECT
USING (true);

-- Polityka: Użytkownicy mogą tworzyć swoje własne reguły
CREATE POLICY "Users can create own rules"
ON public.rules
FOR INSERT
WITH CHECK (true);

-- Polityka: Użytkownicy mogą aktualizować swoje własne reguły
CREATE POLICY "Users can update own rules"
ON public.rules
FOR UPDATE
USING (true);

-- ============================================
-- KROK 7: Utwórz polityki dla tabeli PRODUCTS
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
-- KROK 8: Utwórz polityki dla tabeli USER_SETTINGS
-- ============================================

-- Polityka: Użytkownicy mogą czytać swoje ustawienia
CREATE POLICY "Users can view own settings"
ON public.user_settings
FOR SELECT
USING (true);

-- Polityka: Użytkownicy mogą tworzyć swoje ustawienia
CREATE POLICY "Users can create own settings"
ON public.user_settings
FOR INSERT
WITH CHECK (true);

-- Polityka: Użytkownicy mogą aktualizować swoje ustawienia
CREATE POLICY "Users can update own settings"
ON public.user_settings
FOR UPDATE
USING (true);

-- ============================================
-- UWAGA: Proste polityki (USING (true))
-- ============================================
-- Te polityki pozwalają wszystkim zalogowanym użytkownikom 
-- na dostęp do danych. To tymczasowe rozwiązanie dla 
-- szybkiego włączenia RLS.
-- 
-- W przyszłości możesz dodać bardziej restrykcyjne polityki
-- np. sprawdzanie user_id z Clerk token.

