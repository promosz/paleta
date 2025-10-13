# 🚀 GitHub Pages - Instrukcja Konfiguracji

## ✅ **DEPLOYMENT WYKONANY!**

Aplikacja została zbudowana i wysłana na branch `gh-pages`. Teraz musisz włączyć GitHub Pages w ustawieniach repozytorium.

---

## 📋 **KROK 1: Włącz GitHub Pages (Zrób to TERAZ!)**

### **A. Przejdź do Ustawień Repozytorium:**

1. Otwórz: https://github.com/promosz/paleta/settings/pages
2. Lub:
   - Idź do https://github.com/promosz/paleta
   - Kliknij **Settings** (Ustawienia)
   - W lewym menu kliknij **Pages**

### **B. Skonfiguruj Source:**

W sekcji **"Build and deployment"**:

1. **Source:** wybierz **"Deploy from a branch"**
2. **Branch:** wybierz **"gh-pages"** i **"/ (root)"**
3. Kliknij **Save**

### **C. Dodaj Secrets (Zmienne Środowiskowe):**

⚠️ **WAŻNE:** Musisz dodać secrets dla Clerk i Supabase!

1. Idź do: https://github.com/promosz/paleta/settings/secrets/actions
2. Kliknij **"New repository secret"**
3. Dodaj następujące secrets:

```
Nazwa: VITE_CLERK_PUBLISHABLE_KEY
Wartość: pk_test_... (twój klucz z Clerk Dashboard)

Nazwa: VITE_SUPABASE_URL
Wartość: https://xxx.supabase.co (twój URL Supabase)

Nazwa: VITE_SUPABASE_ANON_KEY
Wartość: eyJ... (twój anon key z Supabase)
```

---

## 🌐 **KROK 2: Sprawdź Deployment**

Po włączeniu GitHub Pages (krok 1):

1. Odczekaj **2-3 minuty** (czas na deployment)
2. Otwórz: **https://promosz.github.io/paleta/**
3. Aplikacja powinna się załadować! 🎉

---

## 📊 **KROK 3: Dodaj Custom Domain (Opcjonalnie)**

Jeśli chcesz użyć własnej domeny (np. `paleta.pl`):

1. W GitHub Settings → Pages → Custom domain
2. Wpisz swoją domenę (np. `paleta.pl`)
3. W DNS domeny dodaj CNAME record:
   ```
   CNAME: promosz.github.io
   ```
4. Zaznacz **"Enforce HTTPS"**

---

## 🔄 **JAK AKTUALIZOWAĆ APLIKACJĘ:**

Po każdej zmianie w kodzie:

```bash
# 1. Commit zmian
git add .
git commit -m "feat: Twoja zmiana"
git push origin main

# 2. Deploy na GitHub Pages
npm run deploy
```

Aplikacja zostanie automatycznie zaktualizowana na https://promosz.github.io/paleta/

---

## 🔐 **KROK 4: Konfiguracja Clerk i Supabase**

### **A. Clerk - Dodaj Dozwoloną Domenę:**

1. Idź do: https://dashboard.clerk.com
2. Wybierz swoją aplikację
3. Configure → Domains
4. Dodaj: `https://promosz.github.io`

### **B. Clerk - Dodaj Redirect URLs:**

1. W Clerk Dashboard → Configure → Paths
2. Dodaj Allowed redirect URLs:
   ```
   https://promosz.github.io/paleta/
   https://promosz.github.io/paleta/dashboard
   https://promosz.github.io/paleta/analysis
   https://promosz.github.io/paleta/rules
   ```

### **C. Supabase - Dodaj URL do CORS:**

1. Idź do: https://supabase.com/dashboard
2. Wybierz projekt
3. Settings → API
4. W "Allowed Origins" dodaj:
   ```
   https://promosz.github.io
   ```

---

## ✅ **CHECKLIST WERYFIKACJI:**

### **GitHub Pages:**
- [ ] Włączone w Settings → Pages
- [ ] Branch: `gh-pages` ← root
- [ ] Secrets dodane (CLERK, SUPABASE)
- [ ] Strona dostępna: https://promosz.github.io/paleta/

### **Clerk:**
- [ ] Dodana domena: `https://promosz.github.io`
- [ ] Redirect URLs skonfigurowane
- [ ] Sign-in/Sign-up działają

### **Supabase:**
- [ ] CORS: `https://promosz.github.io` dodany
- [ ] RLS policies aktywne
- [ ] Połączenie działa

---

## 🚨 **TROUBLESHOOTING:**

### **Problem: 404 Not Found**
```
Rozwiązanie:
1. Sprawdź czy gh-pages branch istnieje
2. Sprawdź Settings → Pages → Source
3. Odczekaj 2-3 minuty
```

### **Problem: Blank Page (Pusta strona)**
```
Rozwiązanie:
1. Sprawdź Console (F12) - szukaj błędów
2. Sprawdź czy secrets są dodane
3. Sprawdź czy base: '/paleta/' jest w vite.config.ts
```

### **Problem: Clerk Authentication Error**
```
Rozwiązanie:
1. Sprawdź czy domena jest dodana w Clerk
2. Sprawdź Redirect URLs
3. Sprawdź VITE_CLERK_PUBLISHABLE_KEY secret
```

### **Problem: Supabase Connection Error**
```
Rozwiązanie:
1. Sprawdź CORS w Supabase Settings
2. Sprawdź VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY
3. Sprawdź czy RLS policies pozwalają na dostęp
```

---

## 📈 **SKALOWANIE - Duża Liczba Użytkowników:**

### **1. CDN i Caching:**
- GitHub Pages ma wbudowany CDN (Fastly)
- Automatyczne cachowanie statycznych plików
- **Limit:** 100GB bandwidth/miesiąc

### **2. Jeśli Przekroczysz Limity GitHub Pages:**

#### **Opcja A: Vercel (Zalecane)** 🌟
```bash
npm install -g vercel
vercel login
vercel

# Auto-deploy przy git push:
vercel --prod
```
**Zalety:**
- ✅ Unlimited bandwidth
- ✅ Automatyczny deploy
- ✅ Globalne CDN
- ✅ Darmowe SSL
- ✅ Custom domain za darmo

#### **Opcja B: Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```
**Zalety:**
- ✅ 100GB bandwidth/miesiąc (darmowy)
- ✅ Automatyczny deploy
- ✅ Globalne CDN
- ✅ Funkcje serverless

#### **Opcja C: Cloudflare Pages**
1. Połącz repo z Cloudflare
2. Automatyczny deploy przy push
3. **Unlimited** bandwidth!

### **3. Optymalizacja Aplikacji:**

#### **A. Code Splitting:**
```bash
# W vite.config.ts dodaj:
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'router': ['react-router-dom'],
        'ui': ['lucide-react', 'framer-motion'],
      }
    }
  }
}
```

#### **B. Lazy Loading:**
```typescript
// W App.tsx:
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analysis = lazy(() => import('./pages/Analysis'))
```

#### **C. Image Optimization:**
- Użyj WebP zamiast PNG/JPG
- Kompresuj obrazy (TinyPNG, Squoosh)
- Lazy load obrazów

### **4. Monitoring:**

#### **Dodaj Analytics:**
```typescript
// Google Analytics
// W index.html:
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

#### **Error Tracking:**
```bash
npm install @sentry/react
```

#### **Performance Monitoring:**
- Vercel Analytics (darmowe)
- Google PageSpeed Insights
- Lighthouse CI

---

## 📊 **STATYSTYKI I LIMITY:**

### **GitHub Pages:**
- **Bandwidth:** 100 GB/miesiąc
- **Storage:** 1 GB
- **Build time:** 10 minut
- **Users:** Unlimited (przy niskim traffic)

### **Vercel (Free Tier):**
- **Bandwidth:** Unlimited
- **Builds:** 100/dzień
- **Functions:** 100 GB-hours/miesiąc
- **Users:** Unlimited

### **Netlify (Free Tier):**
- **Bandwidth:** 100 GB/miesiąc
- **Builds:** 300 minut/miesiąc
- **Functions:** 125k requests/miesiąc
- **Users:** Unlimited

---

## 🎯 **REKOMENDACJE DLA DUŻEGO RUCHU:**

### **Do 1,000 użytkowników/miesiąc:**
✅ **GitHub Pages** - wystarczy!

### **Do 10,000 użytkowników/miesiąc:**
✅ **Vercel Free** - idealnie!

### **Do 100,000+ użytkowników/miesiąc:**
✅ **Vercel Pro** ($20/miesiąc) lub **Cloudflare Pages** (darmowe unlimited)

### **Production-Ready Stack:**
```
Frontend: Vercel
Backend: Supabase (Pro)
Auth: Clerk (Growth plan)
CDN: Cloudflare
Monitoring: Sentry + Vercel Analytics
```

---

## 📝 **NASTĘPNE KROKI:**

### **Teraz:**
1. ✅ Włącz GitHub Pages (Settings → Pages)
2. ✅ Dodaj Secrets (Clerk + Supabase keys)
3. ✅ Skonfiguruj Clerk (dozwolone domeny)
4. ✅ Skonfiguruj Supabase (CORS)
5. ✅ Przetestuj: https://promosz.github.io/paleta/

### **Później:**
6. [ ] Dodaj custom domain (opcjonalnie)
7. [ ] Dodaj analytics (Google Analytics)
8. [ ] Dodaj monitoring (Sentry)
9. [ ] Optymalizuj bundle size (code splitting)
10. [ ] Rozważ migrację na Vercel (przy większym ruchu)

---

## 🔗 **WAŻNE LINKI:**

- **Aplikacja:** https://promosz.github.io/paleta/
- **GitHub Repo:** https://github.com/promosz/paleta
- **GitHub Pages Settings:** https://github.com/promosz/paleta/settings/pages
- **Secrets Settings:** https://github.com/promosz/paleta/settings/secrets/actions
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## ✅ **DEPLOYMENT ZAKOŃCZONY!**

Teraz **przejdź do GitHub Settings → Pages** i włącz deployment! 🚀

Po włączeniu, aplikacja będzie dostępna pod:
### **https://promosz.github.io/paleta/**

---

_Wygenerowano: 13 października 2025_

