-- Usuń SECURITY DEFINER z widoków

-- Widok user_statistics
ALTER VIEW public.user_statistics SET (security_definer = false);
-- Lub jeśli nie zadziała, można użyć:
-- DROP VIEW IF EXISTS public.user_statistics;
-- CREATE OR REPLACE VIEW public.user_statistics AS
-- SELECT ... (twoje zapytanie bez SECURITY DEFINER)

-- Widok product_statistics
ALTER VIEW public.product_statistics SET (security_definer = false);
-- Lub jeśli nie zadziała:
-- DROP VIEW IF EXISTS public.product_statistics;
-- CREATE OR REPLACE VIEW public.product_statistics AS
-- SELECT ... (twoje zapytanie bez SECURITY DEFINER)

-- Widok user_recent_analyses
ALTER VIEW public.user_recent_analyses SET (security_definer = false);
-- Lub jeśli nie zadziała:
-- DROP VIEW IF EXISTS public.user_recent_analyses;
-- CREATE OR REPLACE VIEW public.user_recent_analyses AS
-- SELECT ... (twoje zapytanie bez SECURITY DEFINER)

-- Komentarz: ALTER VIEW może nie zadziałać dla istniejących widoków
-- W takim przypadku musisz użyć DROP i CREATE VIEW

