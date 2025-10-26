# 🔧 Instalacja Row Level Security (RLS) w Supabase

## ❗ Ważne: Musisz włączyć RLS, aby aplikacja mogła pobierać dane

Bez włączonego RLS Supabase nie pozwoli aplikacji na dostęp do danych - to dlatego Dashboard pokazuje "Brak userId" mimo że user jest zalogowany.

---

## 📋 KROK PO KROKU

### 1. Otwórz Supabase Dashboard
Otwórz: **https://supabase.com/dashboard/project/qccbhzvgcelapbbyqzft**

### 2. Przejdź do SQL Editor
W lewym menu kliknij **"SQL Editor"**

### 3. Wykonaj skrypt RLS

#### 3a. Otwórz plik `supabase/fix-rls-only-existing-tables.sql`
Znajdź plik w projekcie: `supabase/fix-rls-only-existing-tables.sql`

#### 3b. Skopiuj CAŁĄ zawartość pliku
Zaznacz wszystko (Ctrl+A) i skopiuj (Ctrl+C)

#### 3c. Wklej do SQL Editor w Supabase
Wklej skopiowany kod do edytora SQL w Dashboard Supabase

#### 3d. Kliknij **"Run"** lub **"Run all"**
Skrypt uruchomi się i wykona wszystkie komendy.

### 4. Sprawdź wyniki
Po wykonaniu powinny być widoczne komunikaty:
- ✅ RLS enabled on all tables
- ✅ Policies created successfully

---

## 🔍 Jeśli wystąpią błędy

### Błąd: "relation already exists"
✅ To normalne - polityka już istnieje, możesz kontynuować.

### Błąd: "permission denied"
❌ Sprawdź czy jesteś zalogowany do Supabase Dashboard.

---

## 📝 Co robi ten skrypt?

1. **Włącza RLS** na wszystkich ISTNIEJĄCYCH tabelach:
   - `users`
   - `analyses`
   - `analysis_files`
   - `rules`
   - `rule_templates`
   - `products`
   - `user_settings`

2. **Tworzy polityki bezpieczeństwa** dla każdej tabeli:
   - Użytkownicy mogą czytać TYLKO swoje dane
   - Użytkownicy mogą tworzyć TYLKO swoje dane
   - Użytkownicy mogą aktualizować TYLKO swoje dane
   - Użytkownicy mogą usuwać TYLKO swoje dane

---

## ✅ Po wykonaniu skryptu

**Odśwież aplikację** (http://localhost:3000) i spróbuj:
1. Zalogować się przez Clerk
2. Przejść do Dashboard
3. Sprawdź czy dane się ładują

---

## 🆘 Wsparcie

Jeśli nadal masz problemy:
1. Otwórz konsolę przeglądarki (F12)
2. Zobacz czy są błędy związane z Supabase
3. Sprawdź Network tab - czy zapytania do Supabase są blokowane (403 Forbidden)

