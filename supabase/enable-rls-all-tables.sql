-- Włącz RLS na wszystkich tabelach w schemacie public

-- Tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Tabela analyses
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

-- Tabela analysis_files
ALTER TABLE public.analysis_files ENABLE ROW LEVEL SECURITY;

-- Tabela rules
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- Tabela rule_templates
ALTER TABLE public.rule_templates ENABLE ROW LEVEL SECURITY;

-- Tabela products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Komentarz: Po włączeniu RLS, polityki bezpieczeństwa będą wymuszane
-- Upewnij się, że istnieją odpowiednie polityki dla każdej tabeli

