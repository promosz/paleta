# 🎨 Plan Wdrożenia Zmian z Figma - Pre-Launch Page

**Projekt Figma:** https://www.figma.com/design/HI2IoOmZf2Q3jL1XSFtYSQ/paleta?node-id=19-44&m=dev  
**Strona docelowa:** http://localhost:3000/paleta/pre-launch  
**Data utworzenia:** 20 października 2025

---

## 📋 KROK 1: Analiza Projektu Figma

### Sekcje do przeanalizowania:
- [ ] **Hero Section** - główny nagłówek, CTA, visual
- [ ] **Problem Section** - opis problemu, pain points
- [ ] **Solution Section** - rozwiązanie, wartości
- [ ] **Features Section** - funkcjonalności
- [ ] **Social Proof** - opinie, statystyki
- [ ] **Pricing Preview** - plany cenowe
- [ ] **FAQ Section** - pytania i odpowiedzi
- [ ] **Final CTA** - końcowe wezwanie do działania
- [ ] **Footer** - stopka z linkami

### Elementy do sprawdzenia:
- [ ] Kolory (gradienty, tła, tekst)
- [ ] Typografia (rozmiary, wagi, odstępy)
- [ ] Spacing (padding, margin, gap)
- [ ] Layout (grid, flex, responsive breakpoints)
- [ ] Animacje (transitions, hover effects)
- [ ] Ikony i grafiki
- [ ] Komponenty interaktywne (przyciski, formularze)

---

## 🔍 KROK 2: Lista Zmian

### 2.1 Hero Section
**Plik:** `src/components/prelaunch/HeroSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]
- [ ] Zmiana 3: [Opis zmiany z Figma]

#### Obecny stan:
- Nagłówek: "Już Wkrótce: Inteligentna Analiza Palet z AI"
- Gradient: from-blue-600 to-purple-600
- CTA: Email signup form
- Visual: Dashboard preview mockup

---

### 2.2 Problem Section
**Plik:** `src/components/prelaunch/ProblemSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.3 Solution Section
**Plik:** `src/components/prelaunch/SolutionSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.4 Features Section
**Plik:** `src/components/prelaunch/FeaturesSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.5 Social Proof Section
**Plik:** `src/components/prelaunch/SocialProofSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.6 Pricing Preview Section
**Plik:** `src/components/prelaunch/PricingPreviewSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.7 FAQ Section
**Plik:** `src/components/prelaunch/FAQSection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.8 Final CTA Section
**Plik:** `src/components/prelaunch/FinalCTASection.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

### 2.9 Footer
**Plik:** `src/components/prelaunch/PreLaunchFooter.tsx`

#### Zmiany do wprowadzenia:
- [ ] Zmiana 1: [Opis zmiany z Figma]
- [ ] Zmiana 2: [Opis zmiany z Figma]

---

## 🌿 KROK 3: Strategia Git - Odwracalne Wdrożenie

### 3.1 Utworzenie nowej gałęzi

```bash
# Zapisz obecne zmiany (jeśli potrzebne)
git stash save "WIP: przed implementacją Figma"

# Lub commituj obecne zmiany
git add .
git commit -m "feat: checkpoint przed implementacją designu z Figma"

# Utwórz nową gałąź dla zmian Figma
git checkout -b feature/figma-prelaunch-redesign

# Opcjonalnie: push gałęzi do GitHub
git push -u origin feature/figma-prelaunch-redesign
```

### 3.2 Struktura commitów

Używaj konwencji Conventional Commits:

```bash
# Dla każdej sekcji osobny commit
git commit -m "feat(hero): implementacja nowego designu Hero Section z Figma"
git commit -m "feat(problem): aktualizacja Problem Section według Figma"
git commit -m "style(colors): zmiana palety kolorów zgodnie z Figma"
git commit -m "feat(cta): nowy design Final CTA Section"

# Dla poprawek
git commit -m "fix(hero): poprawka responsywności na mobile"
git commit -m "fix(spacing): korekta marginesów w Features Section"
```

### 3.3 Punkty kontrolne (Checkpoints)

Po każdej większej sekcji zrób checkpoint:

```bash
# Po zakończeniu Hero Section
git tag checkpoint-hero
git push origin checkpoint-hero

# Po zakończeniu wszystkich sekcji
git tag checkpoint-all-sections
git push origin checkpoint-all-sections

# Po testach
git tag checkpoint-tested
git push origin checkpoint-tested
```

### 3.4 Strategia odwracania zmian

#### Opcja A: Powrót do konkretnego checkpointa
```bash
# Zobacz wszystkie tagi
git tag -l

# Powrót do checkpointa (soft reset - zachowuje zmiany)
git reset --soft checkpoint-hero

# Powrót do checkpointa (hard reset - usuwa zmiany)
git reset --hard checkpoint-hero
```

#### Opcja B: Cofnij konkretny commit
```bash
# Zobacz historię
git log --oneline

# Cofnij konkretny commit (tworzy nowy commit odwracający zmiany)
git revert <commit-hash>
```

#### Opcja C: Porzuć całą gałąź i wróć do main
```bash
# Przełącz się na main
git checkout main

# Usuń gałąź lokalnie
git branch -D feature/figma-prelaunch-redesign

# Usuń gałąź z GitHub
git push origin --delete feature/figma-prelaunch-redesign
```

---

## 🧪 KROK 4: Testowanie Przed Merge

### 4.1 Testy Wizualne

```bash
# Uruchom dev server
npm run dev

# Otwórz w przeglądarce
open http://localhost:3000/paleta/pre-launch
```

#### Checklist testów wizualnych:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667 - iPhone SE)
- [ ] Mobile (390x844 - iPhone 12/13)

### 4.2 Testy Funkcjonalności

- [ ] Email signup form działa
- [ ] Walidacja email działa
- [ ] Success/error messages wyświetlają się
- [ ] Live counter działa
- [ ] Smooth scroll do sekcji działa
- [ ] Wszystkie linki działają
- [ ] Animacje działają płynnie (60fps)

### 4.3 Testy Performance

```bash
# Build production version
npm run build

# Preview build
npm run preview
```

#### Lighthouse Audit:
- [ ] Performance > 90
- [ ] Accessibility > 90
- [ ] Best Practices > 90
- [ ] SEO > 90

### 4.4 Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### 4.5 Porównanie z Figma

Użyj narzędzia do pixel-perfect comparison:
- [ ] Screenshot strony lokalnej
- [ ] Export ekranów z Figma
- [ ] Nałóż w Photoshop/Figma z 50% opacity
- [ ] Sprawdź różnice w spacing, kolorach, rozmiarach

---

## 🔀 KROK 5: Merge do Main

### 5.1 Przed Merge - Final Checklist

- [ ] Wszystkie testy przeszły
- [ ] Kod jest sformatowany (prettier)
- [ ] Brak console.log/debugowania
- [ ] Brak console errors/warnings
- [ ] Dokumentacja zaktualizowana
- [ ] CHANGELOG.md zaktualizowany

### 5.2 Create Pull Request na GitHub

```bash
# Upewnij się że wszystko jest scommitowane
git status

# Push zmian
git push origin feature/figma-prelaunch-redesign

# Przejdź do GitHub i utwórz Pull Request
```

#### Template Pull Request:

```markdown
## 🎨 Implementacja Designu z Figma - Pre-Launch Page

### Opis zmian
Implementacja nowego designu strony pre-launch zgodnie z projektem Figma.

### Projekt Figma
https://www.figma.com/design/HI2IoOmZf2Q3jL1XSFtYSQ/paleta?node-id=19-44&m=dev

### Zmienione sekcje
- ✅ Hero Section
- ✅ Problem Section
- ✅ Solution Section
- ✅ Features Section
- ✅ Social Proof Section
- ✅ Pricing Preview Section
- ✅ FAQ Section
- ✅ Final CTA Section
- ✅ Footer

### Screenshots
[Dodaj screenshots przed/po]

### Testy
- ✅ Testy wizualne na desktop/tablet/mobile
- ✅ Testy funkcjonalne (signup form, links, animations)
- ✅ Lighthouse audit (wszystkie scores > 90)
- ✅ Cross-browser testing

### Checklist
- [ ] Kod zreviewowany
- [ ] Testy przeszły
- [ ] Dokumentacja zaktualizowana
- [ ] Gotowe do merge
```

### 5.3 Review i Merge

```bash
# Po zatwierdzeniu PR, merge na GitHub lub:

# Lokalnie:
git checkout main
git pull origin main
git merge feature/figma-prelaunch-redesign
git push origin main

# Usuń gałąź po merge
git branch -d feature/figma-prelaunch-redesign
git push origin --delete feature/figma-prelaunch-redesign
```

---

## 🚀 KROK 6: Deploy

### 6.1 Deploy do GitHub Pages

```bash
# Build production
npm run build

# Deploy
npm run deploy
```

### 6.2 Weryfikacja na Production

- [ ] Strona działa pod production URL
- [ ] Email signup działa
- [ ] Brak console errors
- [ ] Performance OK
- [ ] Analytics tracking działa (jeśli skonfigurowane)

### 6.3 Monitoring po Deploy

Przez pierwsze 24h monitoruj:
- [ ] Signup conversion rate
- [ ] Bounce rate
- [ ] Time on page
- [ ] Error logs
- [ ] User feedback

---

## ⏪ KROK 7: Rollback Plan (na wypadek problemów)

### Scenariusz 1: Znaleziono critical bug

```bash
# Natychmiastowy rollback do poprzedniej wersji
git checkout main
git revert <merge-commit-hash>
git push origin main

# Quick redeploy
npm run build
npm run deploy
```

### Scenariusz 2: Nowa wersja nie działa dobrze

```bash
# Przywróć poprzednią wersję z tagu
git checkout main
git reset --hard <previous-stable-tag>
git push origin main --force

# Redeploy
npm run build
npm run deploy
```

### Scenariusz 3: Potrzebne drobne poprawki

```bash
# Stwórz hotfix branch
git checkout main
git checkout -b hotfix/prelaunch-fixes

# Wprowadź poprawki
# ...

# Quick merge
git checkout main
git merge hotfix/prelaunch-fixes
git push origin main

# Redeploy
npm run build
npm run deploy
```

---

## 📝 KROK 8: Dokumentacja Zmian

### 8.1 Zaktualizuj CHANGELOG.md

```markdown
## [1.1.0] - 2025-10-20

### Changed
- Przeprojektowano Pre-Launch Page zgodnie z nowym designem Figma
- Zaktualizowano Hero Section z nowym layoutem i kolorami
- Zmieniono typografię we wszystkich sekcjach
- Poprawiono responsywność na urządzeniach mobilnych

### Added
- Nowe animacje w Hero Section
- Dodatkowe social proof elementy
- Ulepszone FAQ Section z lepszą UX

### Fixed
- Poprawiono spacing w Features Section
- Naprawiono animacje na Safari
```

### 8.2 Zaktualizuj dokumentację techniczną

Pliki do zaktualizowania:
- [ ] `docs/PRE_LAUNCH_LANDING_PAGE.md`
- [ ] `docs/LANDING_PAGE_GUIDE.md`
- [ ] `docs/LANDING_COMPONENTS_REFERENCE.md`
- [ ] `PRE_LAUNCH_SETUP_INSTRUCTIONS.md`

---

## 🎯 Podsumowanie - Quick Reference

### Rozpoczęcie prac
```bash
git checkout -b feature/figma-prelaunch-redesign
npm run dev
# Otwórz: http://localhost:3000/paleta/pre-launch
```

### Podczas implementacji
```bash
# Częste commity
git add .
git commit -m "feat(section): opis zmiany"

# Checkpointy
git tag checkpoint-<nazwa>
```

### Testowanie
```bash
npm run build
npm run preview
# Lighthouse audit w DevTools
```

### Merge i Deploy
```bash
git checkout main
git merge feature/figma-prelaunch-redesign
git push origin main
npm run build
npm run deploy
```

### Rollback (jeśli potrzeba)
```bash
git revert <commit-hash>
git push origin main
npm run build
npm run deploy
```

---

## 📞 Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź console errors w DevTools
2. Porównaj z projektem Figma
3. Zobacz git history: `git log --oneline --graph`
4. Przywróć checkpoint: `git reset --hard checkpoint-<nazwa>`

---

**Status:** 📝 Dokument gotowy - czeka na szczegóły z Figma  
**Następny krok:** Analiza projektu Figma i wypełnienie sekcji "Lista Zmian"

---

*Utworzono: 20 października 2025*  
*Wersja: 1.0*






