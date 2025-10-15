# Design System - Paleta

> Minimalistyczny, nowoczesny design system inspirowany Atlassian Design System

## 🎨 Filozofia designu

### Zasady projektowe
1. **Clarity** - Jasność i czytelność interfejsu
2. **Confidence** - Pewność w podejmowaniu decyzji
3. **Consistency** - Spójność w całej aplikacji
4. **Efficiency** - Efektywność w wykonywaniu zadań

### Inspiracja
Design system Paleta jest inspirowany [Atlassian Design System](https://atlassian.design/), który charakteryzuje się:
- Minimalistycznym podejściem
- Funkcjonalnością ponad estetyką
- Dostępnością dla wszystkich użytkowników
- Spójnością wizualną

## 🎨 Kolory

### Paleta podstawowa

#### Primary Colors
```css
:root {
  /* Atlassian Blue - Primary Brand Color */
  --color-primary-50: #DEEBFF;
  --color-primary-100: #B3D4FF;
  --color-primary-200: #4C9AFF;
  --color-primary-300: #2684FF;
  --color-primary-400: #0065FF;
  --color-primary-500: #0052CC;  /* Main Primary */
  --color-primary-600: #003D99;
  --color-primary-700: #002966;
  --color-primary-800: #001A4D;
  --color-primary-900: #000D26;
}
```

#### Neutral Colors
```css
:root {
  /* Neutral Grays */
  --color-neutral-50: #F4F5F7;   /* Background */
  --color-neutral-100: #EBECF0;  /* Light Background */
  --color-neutral-200: #DFE1E6;  /* Border */
  --color-neutral-300: #C1C7D0;  /* Disabled */
  --color-neutral-400: #97A0AF;  /* Placeholder */
  --color-neutral-500: #6B778C;  /* Secondary Text */
  --color-neutral-600: #42526E;  /* Primary Text */
  --color-neutral-700: #253858;  /* Dark Text */
  --color-neutral-800: #172B4D;  /* Darker Text */
  --color-neutral-900: #091E42;  /* Darkest Text */
}
```

#### Semantic Colors
```css
:root {
  /* Success */
  --color-success-50: #E3FCEF;
  --color-success-100: #ABF5D1;
  --color-success-200: #79F2C0;
  --color-success-300: #57D9A3;
  --color-success-400: #36B37E;  /* Main Success */
  --color-success-500: #00875A;
  --color-success-600: #006644;
  --color-success-700: #004C3A;
  
  /* Warning */
  --color-warning-50: #FFF7E6;
  --color-warning-100: #FFE0B3;
  --color-warning-200: #FFC166;
  --color-warning-300: #FFAB00;  /* Main Warning */
  --color-warning-400: #E6A100;
  --color-warning-500: #CC9900;
  --color-warning-600: #B38600;
  
  /* Danger */
  --color-danger-50: #FFEBE6;
  --color-danger-100: #FFBDAD;
  --color-danger-200: #FF8F73;
  --color-danger-300: #FF5630;
  --color-danger-400: #DE350B;  /* Main Danger */
  --color-danger-500: #BF2600;
  --color-danger-600: #9F1F00;
  
  /* Info */
  --color-info-50: #DEEBFF;
  --color-info-100: #B3D4FF;
  --color-info-200: #4C9AFF;
  --color-info-300: #2684FF;
  --color-info-400: #0065FF;    /* Main Info */
  --color-info-500: #0052CC;
  --color-info-600: #003D99;
}
```

### Użycie kolorów

#### Primary
- **Główne akcje**: Przyciski CTA, linki aktywne
- **Nawigacja**: Aktywne elementy menu
- **Focus states**: Stan fokusa na elementach

#### Neutral
- **Tekst**: Różne poziomy hierarchii tekstu
- **Tła**: Tła sekcji i kontenerów
- **Bordery**: Separatory i ramki

#### Semantic
- **Success**: Potwierdzenia, pozytywne statusy
- **Warning**: Ostrzeżenia, uwagi
- **Danger**: Błędy, blokady, usuwanie
- **Info**: Informacje, podpowiedzi

## 📝 Typografia

### Font Family
```css
:root {
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}
```

### Font Sizes
```css
:root {
  /* Text Sizes */
  --font-size-xs: 12px;     /* 0.75rem - Caption */
  --font-size-sm: 14px;     /* 0.875rem - Body Small */
  --font-size-base: 16px;   /* 1rem - Body */
  --font-size-lg: 18px;     /* 1.125rem - Body Large */
  
  /* Heading Sizes */
  --font-size-xl: 20px;     /* 1.25rem - Heading Small */
  --font-size-2xl: 24px;    /* 1.5rem - Heading Medium */
  --font-size-3xl: 32px;    /* 2rem - Heading Large */
  --font-size-4xl: 40px;    /* 2.5rem - Heading XLarge */
  --font-size-5xl: 48px;    /* 3rem - Heading XXLarge */
}
```

### Font Weights
```css
:root {
  --font-weight-normal: 400;    /* Regular */
  --font-weight-medium: 500;    /* Medium */
  --font-weight-semibold: 600;  /* Semibold */
  --font-weight-bold: 700;      /* Bold */
}
```

### Line Heights
```css
:root {
  --line-height-tight: 1.25;    /* Headings */
  --line-height-normal: 1.5;    /* Body text */
  --line-height-relaxed: 1.75;  /* Large text */
}
```

### Typography Scale

#### Headings
```css
.heading-1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-800);
}

.heading-2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-800);
}

.heading-3 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-neutral-700);
}

.heading-4 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-700);
}
```

#### Body Text
```css
.body-large {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-600);
}

.body {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-600);
}

.body-small {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-500);
}

.caption {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-neutral-400);
}
```

## 📏 Spacing

### Spacing Scale
```css
:root {
  --space-0: 0px;      /* 0rem */
  --space-1: 4px;     /* 0.25rem */
  --space-2: 8px;     /* 0.5rem */
  --space-3: 12px;    /* 0.75rem */
  --space-4: 16px;    /* 1rem */
  --space-5: 20px;    /* 1.25rem */
  --space-6: 24px;    /* 1.5rem */
  --space-8: 32px;    /* 2rem */
  --space-10: 40px;   /* 2.5rem */
  --space-12: 48px;   /* 3rem */
  --space-16: 64px;   /* 4rem */
  --space-20: 80px;   /* 5rem */
  --space-24: 96px;   /* 6rem */
  --space-32: 128px;  /* 8rem */
  --space-40: 160px;  /* 10rem */
  --space-48: 192px;  /* 12rem */
}
```

### Użycie spacing

#### Komponenty
- **Padding wewnętrzny**: `--space-4` do `--space-6`
- **Margin między elementami**: `--space-4` do `--space-8`
- **Gap w gridach**: `--space-4` do `--space-6`

#### Layout
- **Marginy sekcji**: `--space-8` do `--space-16`
- **Padding kontenerów**: `--space-6` do `--space-12`
- **Odstępy między sekcjami**: `--space-12` do `--space-24`

## 🎭 Shadows & Elevation

### Shadow Scale
```css
:root {
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
```

### Użycie shadows
- **Cards**: `--shadow-sm` do `--shadow-md`
- **Modals**: `--shadow-lg` do `--shadow-xl`
- **Dropdowns**: `--shadow-md` do `--shadow-lg`
- **Floating elements**: `--shadow-lg` do `--shadow-xl`

## 🔘 Border Radius

### Radius Scale
```css
:root {
  --radius-none: 0px;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
}
```

### Użycie radius
- **Buttons**: `--radius-md` do `--radius-lg`
- **Cards**: `--radius-lg` do `--radius-xl`
- **Inputs**: `--radius-md`
- **Modals**: `--radius-xl` do `--radius-2xl`
- **Avatars**: `--radius-full`

## 🎨 Komponenty

### Button

#### Primary Button
```css
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-400);
}

.btn-primary:focus {
  outline: 2px solid var(--color-primary-200);
  outline-offset: 2px;
}

.btn-primary:disabled {
  background-color: var(--color-neutral-300);
  color: var(--color-neutral-500);
  cursor: not-allowed;
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--color-primary-50);
}
```

### Card
```css
.card {
  background-color: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--space-6);
  border: 1px solid var(--color-neutral-200);
}

.card-header {
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-neutral-200);
}

.card-body {
  margin-bottom: var(--space-4);
}

.card-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-neutral-200);
}
```

### Input
```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-neutral-700);
  background-color: white;
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px var(--color-primary-100);
}

.input:disabled {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-400);
  cursor: not-allowed;
}

.input::placeholder {
  color: var(--color-neutral-400);
}
```

### Status Indicators
```css
.status-success {
  color: var(--color-success-500);
  background-color: var(--color-success-50);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-warning {
  color: var(--color-warning-500);
  background-color: var(--color-warning-50);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-danger {
  color: var(--color-danger-500);
  background-color: var(--color-danger-50);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
```

## 📱 Responsywność

### Breakpoints
```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Mobile-First Approach
```css
/* Mobile styles (default) */
.container {
  padding: var(--space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

## ♿ Accessibility

### Focus States
```css
.focusable:focus {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.focusable:focus:not(:focus-visible) {
  outline: none;
}
```

### Color Contrast
- **Normal text**: Minimum 4.5:1 ratio
- **Large text**: Minimum 3:1 ratio
- **UI components**: Minimum 3:1 ratio

### Touch Targets
- **Minimum size**: 44px x 44px
- **Spacing**: Minimum 8px between targets

## 🎨 Dark Mode (Future)

### Dark Theme Colors
```css
[data-theme="dark"] {
  --color-neutral-50: #1D2125;
  --color-neutral-100: #22272B;
  --color-neutral-200: #2C333A;
  --color-neutral-300: #373E44;
  --color-neutral-400: #5C6B73;
  --color-neutral-500: #8C9BA5;
  --color-neutral-600: #B6C2CF;
  --color-neutral-700: #C7D1DB;
  --color-neutral-800: #DEE4EA;
  --color-neutral-900: #F7F8F9;
}
```

---

*Design System utworzony: Styczeń 2025*  
*Inspirowany: [Atlassian Design System](https://atlassian.design/)*  
*Wersja: 1.0*
