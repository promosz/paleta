-- =====================================================
-- TYMCZASOWE WYŁĄCZENIE RLS DLA USERS (BEZ VACUUM)
-- =====================================================

-- Wyłącz RLS dla tabeli users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Usuń wszystkie polityki
DROP POLICY IF EXISTS "Users can create own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation" ON users;
DROP POLICY IF EXISTS "Allow user self-registration" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Temporary: Allow user insert" ON users;

-- Potwierdź
SELECT 'RLS wyłączony dla users' as status;







