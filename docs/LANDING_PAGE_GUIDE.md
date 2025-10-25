# Landing Page - Przewodnik Użytkownika

## 🎨 Wygląd i Funkcjonalność

Landing page PalletAI to nowoczesna, responsywna strona główna zaprojektowana w Figma i zaimplementowana z pełnym wsparciem dla urządzeń mobilnych.

## 📱 Responsywność Mobilna

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Optymalizacje Mobile
1. **Header:** Menu główne ukryte, tylko logo i przyciski CTA
2. **Grid layouts:** Automatyczne przejście do single column
3. **Typography:** Skalowane rozmiary czcionek
4. **Padding:** Zmniejszony na mniejszych ekranach
5. **Buttons:** Stack vertically na mobile

## 🎬 Animacje

Wszystkie sekcje wykorzystują **Framer Motion** do płynnych animacji:

### Typy animacji
1. **Fade In + Slide Up** - elementy wjeżdżają od dołu
2. **Staggered Animation** - elementy pojawiają się jeden po drugim
3. **Scroll-triggered** - animacje uruchamiane przy scrollowaniu (useInView)
4. **Hover Effects** - interaktywne efekty na kartach i przyciskach

### Performance
- Animacje używają GPU acceleration
- `once: true` - animacje uruchamiane tylko raz
- Optimized transitions dla smooth 60fps

## 🧭 Nawigacja

### Dla Niezalogowanych Użytkowników
- **URL:** `/`
- **Header:** Własny LandingHeader z nawigacją
- **Menu:**
  - Funkcje → scroll do #features
  - Jak to działa → scroll do #how-it-works
  - Cennik → scroll do #pricing
  - Kontakt → scroll do #footer
- **CTA:** Zaloguj się / Wypróbuj za darmo (Clerk modal)

### Dla Zalogowanych Użytkowników
- **URL:** `/` → Redirect do `/dashboard`
- **Logo w Layout:** Click → Navigate do `/` (landing page)
- **Dropdown "Product":** Dostęp do sekcji landing page
  - Funkcje
  - Jak to działa
  - Cennik
  - Kontakt

## 📋 Sekcje Landing Page

### 1. Hero Section
**ID:** (top of page)
- Główny nagłówek z gradientem
- 2 przyciski CTA
- Dashboard preview
- Social proof (500+ użytkowników)

### 2. About Section
**ID:** `about`
- Czym jest PalletAI?
- 3 statystyki (12 funkcji, 85%, 100%)
- Dla kogo jest aplikacja (4 grupy docelowe)

### 3. Features Available
- Funkcjonalności już dostępne (badge: "Dostępne teraz")
- 4 kategorie funkcji

### 4. Features Coming
- Nadchodzące funkcjonalności (badge: "W planach rozwoju")
- 4 kategorie z timeline (Q1-Q3 2025)

### 5. Roadmap Section
- Plan rozwoju w 4 fazach
- Progress bars
- Status badges

### 6. Benefits Section
- Dlaczego PalletAI?
- 4 główne korzyści z ikonami

### 7. How It Works
**ID:** `how-it-works`
- 3 kroki procesu
- Demo section z statystykami
- Przycisk "Wypróbuj analizę demo"

### 8. Features Section
**ID:** `features`
- 6 szczegółowych funkcji
- Grid layout z obrazami placeholder
- Hover effects

### 9. Testimonials
- 3 opinie klientów
- 5-star ratings
- Gradient top bars

### 10. Pricing Section
**ID:** `pricing`
- 3 plany cenowe (Free, Pro, Business)
- Feature comparison
- FAQ section (3 pytania)

### 11. CTA Section
- Final call to action
- Gradient background
- 2 przyciski: Rejestracja / Prezentacja
- Fine print

### 12. Footer
**ID:** `footer`
- 5 kolumn linków
- Social media icons
- Copyright notice

## 🎨 Design System

### Paleta Kolorów

```css
/* Primary Gradients */
--gradient-blue-purple: from-blue-600 to-purple-600
--gradient-heading: from-slate-900 via-blue-900 to-purple-900

/* Backgrounds */
--bg-glass: bg-white/60 backdrop-blur-sm border border-white/20

/* Section Backgrounds */
--bg-section-1: from-white via-blue-50/30 to-purple-50/30
--bg-section-2: from-blue-50/30 via-purple-50/30 to-pink-50/30
```

### Typography

```css
/* Headings */
h1: text-5xl md:text-6xl
h2: text-4xl md:text-5xl
h3: text-3xl
h4: text-xl md:text-2xl

/* Body */
p: text-base md:text-lg
small: text-sm
```

### Spacing

```css
/* Sections */
padding: py-24 (mobile) / py-32 (desktop)

/* Containers */
max-width: max-w-7xl
padding-x: px-8

/* Gaps */
small: gap-4
medium: gap-6
large: gap-12
```

## 🔧 Customization

### Zmiana Treści

Edytuj poszczególne komponenty w `src/components/landing/`:

```tsx
// Przykład: HeroSection.tsx
const heading = "Analizuj zestawy produktów w minutę – z pomocą AI"
const description = "Zyskaj pełną analizę palety..."
```

### Zmiana Kolorów

Wszystkie gradienty i kolory są zdefiniowane inline w komponentach:

```tsx
className="bg-gradient-to-r from-blue-600 to-purple-600"
```

### Dodanie Nowej Sekcji

1. Utwórz nowy komponent: `src/components/landing/NewSection.tsx`
2. Dodaj do `LandingPage.tsx`
3. Dodaj eksport w `index.ts`
4. Opcjonalnie: dodaj ID dla scroll navigation

```tsx
// NewSection.tsx
export default function NewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <section id="new-section" ref={ref} className="py-24">
      {/* Content */}
    </section>
  );
}
```

## 🚀 Development

### Uruchomienie
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## 📊 Performance Tips

1. **Lazy Loading:**
   - Sekcje poniżej fold można lazy loadować
   - Obrazy z `loading="lazy"`

2. **Image Optimization:**
   - Używaj WebP format
   - Responsive images z srcset
   - Placeholder podczas ładowania

3. **Code Splitting:**
   - React.lazy dla dużych komponentów
   - Dynamic imports

4. **Animation Performance:**
   - Używaj transform zamiast position changes
   - will-change dla często animowanych elementów
   - Disable animations na słabszych urządzeniach

## 🐛 Troubleshooting

### Landing page nie wyświetla się
- Sprawdź czy jesteś niezalogowany
- Wyloguj się lub otwórz w trybie incognito

### Animacje nie działają
- Sprawdź czy Framer Motion jest zainstalowany
- Check browser console for errors

### Dropdown "Product" nie działa
- Sprawdź czy jesteś zalogowany
- Dropdown pokazuje się tylko dla zalogowanych

### Scroll do sekcji nie działa
- Sprawdź czy sekcje mają odpowiednie ID
- Check console for JavaScript errors

## 📱 Mobile Testing

### Recommended Devices
- iPhone SE (375px)
- iPhone 12/13 (390px)
- iPad (768px)
- Desktop (1440px+)

### Testing Checklist
- [ ] Header sticky działa
- [ ] Menu nawigacyjne ukryte na mobile
- [ ] Wszystkie sekcje scrollują poprawnie
- [ ] Buttony są klikalne (44px min)
- [ ] Text jest czytelny
- [ ] Images ładują się poprawnie
- [ ] Animacje nie lagują

## 🎯 SEO Recommendations

### Meta Tags (TODO)
```html
<title>PalletAI - Analizuj palety produktów z AI</title>
<meta name="description" content="Inteligentna platforma do analizy palet produktowych. Oszczędzaj czas i maksymalizuj zyski dzięki sztucznej inteligencji." />
<meta property="og:image" content="/og-image.png" />
```

### Structured Data (TODO)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PalletAI",
  "description": "Inteligentna platforma do analizy palet produktowych"
}
```

## 📞 Support

Pytania? Sprawdź:
- `LANDING_PAGE_IMPLEMENTATION.md` - szczegóły techniczne
- `COMPONENTS.md` - dokumentacja komponentów
- `README.md` - główna dokumentacja

---

**Last Updated:** 2025-10-12  
**Version:** 1.0.0
















