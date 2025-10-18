# 🚀 Deployment Guide - PalletAI

## 📋 Overview

Kompletny przewodnik wdrażania aplikacji PalletAI na różnych platformach, z konfiguracją GitHub Pages, Vercel, Netlify i self-hosted solutions.

---

## 🎯 Pre-deployment Checklist

### 1. Code & Build

- [ ] Wszystkie testy przechodzą (`npm test`)
- [ ] Brak błędów linting (`npm run lint`)
- [ ] Build działa lokalnie (`npm run build`)
- [ ] Preview build działa (`npm run preview`)

### 2. Environment Variables

- [ ] Production Clerk key (`pk_live_...`)
- [ ] Production Supabase URL
- [ ] Production Supabase Anon Key
- [ ] Wszystkie env vars zaktualizowane

### 3. Configuration

- [ ] Base path skonfigurowany (`vite.config.ts`)
- [ ] Routing paths zaktualizowane
- [ ] 404.html fallback utworzony
- [ ] CORS headers skonfigurowane (jeśli backend)

### 4. Security

- [ ] RLS policies włączone w Supabase
- [ ] Clerk production domain authorized
- [ ] API keys zabezpieczone
- [ ] No sensitive data w kodzie

---

## 📦 GitHub Pages Deployment (Obecny)

### Overview

GitHub Pages to darmowa platforma hostingowa od GitHub, idealna dla statycznych aplikacji SPA.

### Configuration

**vite.config.ts**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/paleta/', // ← GitHub Pages base path
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  }
})
```

**package.json**:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.3.0"
  }
}
```

### Step-by-Step Deployment

#### 1. Zainstaluj gh-pages

```bash
npm install --save-dev gh-pages
```

#### 2. Build aplikacji

```bash
npm run build
```

To utworzy folder `dist/` z zoptymalizowaną wersją aplikacji.

#### 3. Deploy na GitHub Pages

```bash
npm run deploy
```

Lub manualnie:
```bash
gh-pages -d dist
```

#### 4. Konfiguracja GitHub Repository

1. Przejdź do **Repository Settings**
2. Kliknij **Pages** w menu bocznym
3. W sekcji **Source** wybierz:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Kliknij **Save**

#### 5. Dostęp do aplikacji

Aplikacja będzie dostępna pod:
```
https://your-username.github.io/paleta/
```

### Routing Configuration

**404.html Fallback**:
```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=/paleta/">
  <title>Redirecting...</title>
</head>
<body>
  <p>Przekierowuję...</p>
</body>
</html>
```

To zapewnia poprawne działanie React Router na GitHub Pages.

### Environment Variables

⚠️ **Uwaga**: GitHub Pages nie obsługuje backend environment variables!

**Rozwiązanie**: Hardcode production values w kodzie lub użyj build-time variables.

```typescript
// src/config.ts
export const config = {
  clerkPublishableKey: 'pk_live_your_production_key',
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your_production_anon_key'
}
```

**Lepsze rozwiązanie**: Użyj platform z backend support (Vercel/Netlify).

### Custom Domain (opcjonalnie)

1. Utwórz plik `public/CNAME`:
```
yourdomain.com
```

2. Skonfiguruj DNS u swojego domain providera:
```
Type: CNAME
Name: www (lub @)
Value: your-username.github.io
```

3. W GitHub Settings → Pages → Custom domain:
   - Wpisz `yourdomain.com`
   - Włącz **Enforce HTTPS**

---

## ☁️ Vercel Deployment

### Overview

Vercel to platforma z automatycznym CI/CD, serverless functions i doskonałą integracją z GitHub.

### Step-by-Step Deployment

#### 1. Połącz GitHub Repository

1. Przejdź do [vercel.com](https://vercel.com)
2. Kliknij **New Project**
3. Import repository z GitHub
4. Wybierz **App01** repository

#### 2. Konfiguracja Build Settings

Vercel automatically detects Vite, ale sprawdź:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 3. Environment Variables

W Vercel Dashboard → Project → Settings → Environment Variables:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

**Scope**: Production, Preview, Development

#### 4. Deploy

Kliknij **Deploy** - Vercel automatycznie:
- Zainstaluje dependencies
- Uruchomi build
- Wdroży na CDN
- Utworzy HTTPS URL

#### 5. Custom Domain

1. Vercel Dashboard → Project → Settings → Domains
2. Dodaj domenę (np. `app.yourdomain.com`)
3. Skonfiguruj DNS records (Vercel pokaże instrukcje)
4. HTTPS automatycznie (Let's Encrypt)

### Vercel Configuration File

Utwórz `vercel.json` w root directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Automatic Deployments

Vercel automatycznie wdroży:
- **Production**: przy push do `main` branch
- **Preview**: przy każdym PR
- **Development**: opcjonalnie dla innych branches

### Vercel CLI (opcjonalnie)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🌐 Netlify Deployment

### Overview

Netlify to alternatywa dla Vercel z podobnymi funkcjami i prostym setup.

### Step-by-Step Deployment

#### 1. Połącz Repository

1. Przejdź do [netlify.com](https://netlify.com)
2. Kliknij **Add new site** → **Import an existing project**
3. Wybierz GitHub i autoryzuj
4. Wybierz repository **App01**

#### 2. Build Settings

```
Base directory: (leave empty)
Build command: npm run build
Publish directory: dist
```

#### 3. Environment Variables

Netlify Dashboard → Site settings → Build & deploy → Environment:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

#### 4. Deploy

Kliknij **Deploy site** - Netlify rozpocznie deployment.

#### 5. Custom Domain

1. Netlify Dashboard → Domain settings
2. Dodaj custom domain
3. Skonfiguruj DNS (Netlify DNS lub external)
4. HTTPS automatycznie

### Netlify Configuration

Utwórz `netlify.toml` w root directory:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "same-origin"
```

### Netlify CLI (opcjonalnie)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Netlify Features

- **Split Testing**: A/B testing różnych wersji
- **Branch Deploys**: Automatyczne deploye dla branches
- **Deploy Previews**: Preview dla każdego PR
- **Forms**: Built-in form handling
- **Functions**: Serverless functions

---

## 🐳 Docker Deployment (Self-hosted)

### Overview

Docker umożliwia deployment na własnej infrastrukturze (VPS, AWS EC2, etc.).

### Dockerfile

Utwórz `Dockerfile` w root directory:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Utwórz `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # React Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Build & Run

```bash
# Build Docker image
docker build -t palletai:latest .

# Run container
docker run -d -p 80:80 --name palletai palletai:latest

# Or use docker-compose
docker-compose up -d
```

### Environment Variables w Docker

**Option 1**: Build-time variables

```dockerfile
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
```

Build:
```bash
docker build \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_live_... \
  --build-arg VITE_SUPABASE_URL=https://... \
  --build-arg VITE_SUPABASE_ANON_KEY=... \
  -t palletai:latest .
```

**Option 2**: Runtime substitution (advanced)

---

## 🔧 Advanced Configuration

### 1. CDN Configuration

Dla lepszej wydajności użyj CDN (Cloudflare, AWS CloudFront):

```bash
# Cloudflare
1. Dodaj domenę do Cloudflare
2. Włącz CDN
3. Konfiguruj cache rules
4. Włącz minification (JS, CSS, HTML)
```

### 2. Analytics

**Google Analytics**:
```html
<!-- public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Plausible Analytics** (privacy-friendly):
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 3. Error Monitoring

**Sentry**:
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-dsn@sentry.io/project-id",
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 4. Performance Optimization

**Code Splitting**:
```typescript
// Lazy load routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Analysis = React.lazy(() => import('./pages/Analysis'))

// Use Suspense
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

**Image Optimization**:
- Użyj WebP format
- Lazy load images
- Responsive images (srcset)

---

## 🔍 Post-deployment Testing

### 1. Functional Testing

- [ ] Landing page loads
- [ ] Logowanie działa (Clerk)
- [ ] Dashboard loads after login
- [ ] Upload pliku działa
- [ ] Analiza pliku działa
- [ ] Reguły działają
- [ ] Market prices działają (jeśli AI backend)

### 2. Performance Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse
lhci autorun --url=https://yourdomain.com
```

**Target metrics**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 3. Security Testing

- [ ] HTTPS włączony
- [ ] Security headers skonfigurowane
- [ ] No console errors
- [ ] No exposed API keys
- [ ] RLS policies działają

### 4. Browser Testing

Test na różnych przeglądarkach:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

---

## 🚨 Troubleshooting

### Problem 1: 404 on Refresh

**Symptom**: Strona działa, ale po refresh → 404

**Solution**: 
- GitHub Pages: Użyj `404.html` fallback
- Vercel: Dodaj rewrites w `vercel.json`
- Netlify: Dodaj redirects w `netlify.toml`
- Nginx: Konfiguruj `try_files`

### Problem 2: Environment Variables Not Working

**Symptom**: `undefined` dla env variables

**Solution**:
1. Sprawdź `VITE_` prefix
2. Restart dev server/rebuild
3. Check platform env vars configuration

### Problem 3: Clerk Authentication Fails

**Symptom**: "Invalid publishable key"

**Solution**:
1. Użyj production key (`pk_live_...`)
2. Dodaj production domain do Clerk authorized URLs
3. Check CORS settings

### Problem 4: Build Fails

**Symptom**: `npm run build` fails

**Solution**:
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build

# Check for TypeScript errors
npm run tsc --noEmit
```

---

## 📊 Monitoring

### Uptime Monitoring

**UptimeRobot** (free):
1. Dodaj monitor dla `https://yourdomain.com`
2. Sprawdzaj co 5 minut
3. Alert email przy downtime

**Pingdom** (paid):
- Bardziej zaawansowane sprawdzanie
- Global monitoring locations
- Detailed analytics

### Performance Monitoring

**Web Vitals**:
```typescript
// src/main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to your analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 📚 Resources

### Official Documentation
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Pages](https://pages.github.com)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org)
- [GTmetrix](https://gtmetrix.com)

---

**Last Updated**: January 18, 2025  
**Version**: 1.0  
**Author**: PalletAI Team

