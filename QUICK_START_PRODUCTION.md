# 🚀 QUICK START - Wdrożenie Produkcyjne

## 📋 **SZYBKI PRZEWODNIK WDROŻENIA**

### **1. Pobierz Kod z GitHub**
```bash
git clone https://github.com/promosz/paleta.git
cd paleta
npm install
```

### **2. Skonfiguruj Zmienne Środowiskowe**

Skopiuj przykładowy plik:
```bash
cp docs/env.example .env
```

Wypełnij wartości w `.env`:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_XXX  # Z https://dashboard.clerk.com

# Supabase
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk Webhook (dla Supabase Functions)
CLERK_WEBHOOK_SECRET=whsec_XXX
```

### **3. Skonfiguruj Supabase**

#### **A. Utwórz Projekt w Supabase:**
1. Idź do https://supabase.com
2. Kliknij "New Project"
3. Skopiuj URL i Anon Key

#### **B. Uruchom Migrację Bazy:**
1. Idź do Supabase Dashboard → SQL Editor
2. Otwórz plik `docs/SUPABASE_MIGRATION.sql`
3. Skopiuj całą zawartość i wklej do SQL Editor
4. Kliknij "Run"

#### **C. Skonfiguruj Webhook Clerk:**
1. W Supabase: Functions → Create Function
2. Nazwa: `clerk-webhook`
3. Skopiuj kod z `supabase/functions/clerk-webhook/index.ts`
4. Deploy function
5. Skopiuj URL funkcji (np. `https://xxx.supabase.co/functions/v1/clerk-webhook`)

### **4. Skonfiguruj Clerk**

#### **A. Utwórz Aplikację Clerk:**
1. Idź do https://dashboard.clerk.com
2. Kliknij "Add Application"
3. Wybierz metody logowania (Email, Google, GitHub)

#### **B. Skonfiguruj Webhook:**
1. W Clerk Dashboard → Webhooks
2. Kliknij "Add Endpoint"
3. URL: `https://xxx.supabase.co/functions/v1/clerk-webhook`
4. Wybierz eventy: `user.created`, `user.updated`, `user.deleted`
5. Skopiuj Signing Secret
6. Dodaj do `.env`: `CLERK_WEBHOOK_SECRET=whsec_...`

### **5. Testuj Lokalnie**

```bash
npm run dev
```

Otwórz: http://localhost:3000

**Sprawdź:**
1. ✅ Logowanie przez Clerk działa
2. ✅ Upload pliku zapisuje do Supabase
3. ✅ Dashboard pokazuje dane z bazy
4. ✅ Reguły są zapisywane

### **6. Deploy na Produkcję**

#### **Opcja A: Vercel**
```bash
npm install -g vercel
vercel login
vercel
```

#### **Opcja B: Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### **Opcja C: GitHub Pages (Static)**
```bash
npm run build
# Upload folder 'dist' to GitHub Pages
```

### **7. Konfiguracja Po Wdrożeniu**

#### **A. Dodaj Dozwolone Domeny w Clerk:**
1. Clerk Dashboard → Domains
2. Dodaj: `https://your-app.vercel.app`

#### **B. Zaktualizuj CORS w Supabase:**
1. Supabase Dashboard → Settings → API
2. Dodaj dozwolone originy: `https://your-app.vercel.app`

#### **C. Zaktualizuj Redirect URLs:**
1. W Clerk: Settings → Paths
2. Sign-in URL: `https://your-app.vercel.app/sign-in`
3. Sign-up URL: `https://your-app.vercel.app/sign-up`
4. After sign-in: `https://your-app.vercel.app/dashboard`

---

## 🔐 **SECURITY CHECKLIST:**

- [ ] Wszystkie zmienne środowiskowe są ustawione
- [ ] Clerk webhook secret jest skonfigurowany
- [ ] RLS policies są włączone w Supabase
- [ ] CORS jest poprawnie skonfigurowany
- [ ] API keys nie są w kodzie (tylko w .env)
- [ ] .env jest w .gitignore
- [ ] HTTPS jest włączone (produkcja)
- [ ] Clerk jest w trybie Production (nie Development)

---

## 📊 **WERYFIKACJA PRODUKCYJNA:**

### **1. Test Pełnego Flow:**
```
Użytkownik → Sign Up → Clerk → Webhook → Supabase → Dane zapisane
                 ↓
            Dashboard → Analizy → Upload → Supabase → Wyniki
```

### **2. Sprawdź Logi:**
- Clerk Dashboard → Logs (webhook calls)
- Supabase Dashboard → Logs (database queries)
- Supabase Dashboard → Functions → clerk-webhook → Logs

### **3. Monitoring:**
```sql
-- Sprawdź ostatnie analizy
SELECT COUNT(*) FROM analyses WHERE created_at > NOW() - INTERVAL '24 hours';

-- Sprawdź aktywnych użytkowników
SELECT COUNT(DISTINCT user_id) FROM analyses WHERE created_at > NOW() - INTERVAL '7 days';

-- Sprawdź błędy
SELECT * FROM analysis_files WHERE status = 'error' ORDER BY uploaded_at DESC LIMIT 10;
```

---

## 🚨 **TROUBLESHOOTING:**

### **Problem: Webhook nie działa**
```bash
# Sprawdź URL
curl -X POST https://xxx.supabase.co/functions/v1/clerk-webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Sprawdź logi w Supabase Functions
```

### **Problem: RLS blokuje dostęp**
```sql
-- Tymczasowo wyłącz RLS (TYLKO DO DEBUGOWANIA!)
ALTER TABLE analyses DISABLE ROW LEVEL SECURITY;

-- Sprawdź czy działa, potem WŁĄCZ z powrotem:
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
```

### **Problem: Użytkownik nie jest synchronizowany**
```sql
-- Sprawdź czy użytkownik istnieje
SELECT * FROM users WHERE clerk_user_id = 'user_xxx';

-- Jeśli nie, ręcznie dodaj:
INSERT INTO users (clerk_user_id, email, full_name)
VALUES ('user_xxx', 'user@example.com', 'John Doe');
```

---

## 📞 **WSPARCIE:**

### **Dokumentacja Szczegółowa:**
- `DEPLOYMENT_STATUS.md` - Pełny status wdrożenia
- `docs/SUPABASE_README.md` - Dokumentacja Supabase
- `docs/TESTING_SUPABASE.md` - Testy
- `docs/SUPABASE_FAQ.md` - FAQ

### **Pomocne Skrypty:**
- `CHECK_DATA_SAVING.sql` - Sprawdź dane
- `TEST_FILE_SAVING.sql` - Test plików
- `enable-rls-policies.sql` - Włącz RLS

---

## ✅ **GOTOWE!**

Twoja aplikacja powinna teraz działać na produkcji! 🎉

**Ostatni krok:**
```bash
# Przetestuj produkcyjny URL
curl -I https://your-app.vercel.app

# Powinien zwrócić: HTTP/2 200
```

---

_Wygenerowano: 13 października 2025_

