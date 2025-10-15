# Architektura Aplikacji - Paleta

> Szczegółowa architektura techniczna aplikacji Paleta

## 🏗 Przegląd architektury

Paleta to Single Page Application (SPA) zbudowana w React, która działa całkowicie w przeglądarce użytkownika. Aplikacja wykorzystuje lokalne przechowywanie danych i nie wymaga backendu w fazie MVP.

### Architektura wysokiego poziomu

```
┌─────────────────────────────────────────────────────────────┐
│                    Przeglądarka użytkownika                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   React App     │  │   Local Storage │  │   File APIs  │ │
│  │                 │  │                 │  │              │ │
│  │  ┌───────────┐  │  │  ┌───────────┐  │  │ ┌──────────┐ │ │
│  │  │Components │  │  │  │   Data    │  │  │ │Parsers   │ │ │
│  │  │           │  │  │  │           │  │  │ │          │ │ │
│  │  │ ┌───────┐ │  │  │  │ ┌───────┐ │  │  │ │ ┌──────┐ │ │ │
│  │  │ │Pages  │ │  │  │  │ │Analiz │ │  │  │ │ │XLSX  │ │ │ │
│  │  │ │       │ │  │  │  │ │       │ │  │  │ │ │PDF   │ │ │ │
│  │  │ │ ┌───┐ │ │  │  │  │ │ ┌───┐ │ │  │  │ │ │CSV   │ │ │ │
│  │  │ │ │UI │ │ │  │  │  │ │ │Rules│ │ │  │  │ │ └──────┘ │ │ │
│  │  │ │ └───┘ │ │  │  │  │ │ └───┘ │ │  │  │ └──────────┘ │ │ │
│  │  │ └───────┘ │  │  │  │ └───────┘ │  │  └──────────────┘ │ │
│  │  └───────────┘  │  │  └───────────┘  │                   │ │
│  └─────────────────┘  └─────────────────┘                   │ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Struktura projektu

```
paleta/
├── public/                 # Statyczne pliki
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/                    # Kod źródłowy
│   ├── components/         # Komponenty React
│   │   ├── ui/            # Podstawowe komponenty UI
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── forms/         # Komponenty formularzy
│   │   │   ├── FileUpload.tsx
│   │   │   ├── RuleForm.tsx
│   │   │   └── index.ts
│   │   ├── analysis/      # Komponenty analizy
│   │   │   ├── AnalysisCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── Ranking.tsx
│   │   │   └── index.ts
│   │   └── layout/        # Komponenty layoutu
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Navigation.tsx
│   │       └── index.ts
│   ├── pages/             # Strony aplikacji
│   │   ├── Dashboard.tsx
│   │   ├── Analysis.tsx
│   │   ├── Rules.tsx
│   │   ├── Settings.tsx
│   │   └── index.ts
│   ├── services/          # Logika biznesowa
│   │   ├── fileParser.ts  # Parsowanie plików
│   │   ├── analysis.ts    # Logika analizy
│   │   ├── rules.ts       # Zarządzanie regułami
│   │   ├── storage.ts     # Zarządzanie localStorage
│   │   └── index.ts
│   ├── hooks/             # Custom hooks
│   │   ├── useAnalysis.ts
│   │   ├── useRules.ts
│   │   ├── useFileUpload.ts
│   │   └── index.ts
│   ├── utils/             # Funkcje pomocnicze
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   └── index.ts
│   ├── types/             # Definicje TypeScript
│   │   ├── analysis.ts
│   │   ├── rules.ts
│   │   ├── common.ts
│   │   └── index.ts
│   ├── stores/            # Stan aplikacji (Zustand)
│   │   ├── analysisStore.ts
│   │   ├── rulesStore.ts
│   │   ├── uiStore.ts
│   │   └── index.ts
│   ├── styles/            # Style CSS
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── utilities.css
│   ├── App.tsx            # Główny komponent
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Definicje Vite
├── docs/                  # Dokumentacja
├── tests/                 # Testy
│   ├── __mocks__/
│   ├── components/
│   ├── services/
│   └── utils/
├── .github/               # GitHub Actions
│   └── workflows/
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🔧 Stos technologiczny

### Core Framework
- **React 18** - Biblioteka UI z hooks i concurrent features
- **TypeScript** - Typowanie statyczne dla lepszej jakości kodu
- **Vite** - Szybki bundler i dev server

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Custom Properties** - Zmienne CSS dla design system
- **PostCSS** - Przetwarzanie CSS

### State Management
- **Zustand** - Lekka biblioteka do zarządzania stanem
- **React Query** - Zarządzanie stanem serwera (przyszłe API)

### Routing
- **React Router v6** - Routing w aplikacji SPA

### Parsowanie plików
- **SheetJS (xlsx)** - Parsowanie plików Excel
- **PDF.js** - Parsowanie plików PDF
- **Papa Parse** - Parsowanie plików CSV

### Formularze
- **React Hook Form** - Obsługa formularzy z walidacją
- **Zod** - Schema validation

### UI Components
- **Headless UI** - Komponenty bez stylów
- **Heroicons** - Ikony SVG
- **React Hot Toast** - Notyfikacje

### Narzędzia deweloperskie
- **ESLint** - Linting kodu
- **Prettier** - Formatowanie kodu
- **Vitest** - Testy jednostkowe
- **Playwright** - Testy E2E
- **Storybook** - Dokumentacja komponentów

## 🗄️ Zarządzanie danymi

### Struktura danych w localStorage

```typescript
interface StorageData {
  analyses: Analysis[];
  rules: UserRule[];
  settings: UserSettings;
  version: string;
}
```

### Klucze localStorage
```typescript
const STORAGE_KEYS = {
  ANALYSES: 'paleta_analyses',
  RULES: 'paleta_rules',
  SETTINGS: 'paleta_settings',
  VERSION: 'paleta_version'
} as const;
```

### Migracje danych
```typescript
interface DataMigration {
  from: string;
  to: string;
  migrate: (data: any) => any;
}
```

## 🔄 Flow danych

### 1. Upload pliku
```
User selects file → FileReader API → Parser Service → Normalized Data → Analysis Store
```

### 2. Analiza produktów
```
Normalized Data → Rules Engine → Compliance Check → Scoring → Recommendations → UI Update
```

### 3. Zarządzanie regułami
```
User creates rule → Validation → Rules Store → localStorage → UI Update
```

## 🧩 Komponenty

### Hierarchia komponentów

```
App
├── Layout
│   ├── Header
│   ├── Navigation
│   └── Main
├── Pages
│   ├── Dashboard
│   │   ├── StatsWidget
│   │   ├── AnalysisList
│   │   └── AnalysisCard
│   ├── Analysis
│   │   ├── AnalysisHeader
│   │   ├── ProductList
│   │   ├── ProductCard
│   │   └── Ranking
│   ├── Rules
│   │   ├── RulesList
│   │   ├── RuleCard
│   │   └── RuleForm
│   └── Settings
└── Modals
    ├── FileUpload
    ├── ConfirmDialog
    └── ErrorDialog
```

### Props drilling prevention
- **Context API** dla danych globalnych
- **Zustand stores** dla stanu aplikacji
- **Custom hooks** dla logiki komponentów

## 🔌 Services Layer

### File Parser Service
```typescript
interface FileParserService {
  parseXLSX(file: File): Promise<ParsedData>;
  parsePDF(file: File): Promise<ParsedData>;
  parseCSV(file: File): Promise<ParsedData>;
  validateFile(file: File): ValidationResult;
  normalizeData(data: ParsedData): NormalizedData;
}
```

### Analysis Service
```typescript
interface AnalysisService {
  analyzeProducts(products: Product[], rules: UserRule[]): AnalysisResult;
  calculateScore(product: Product, rules: UserRule[]): number;
  generateRecommendations(analysis: AnalysisResult): Recommendation[];
  rankProducts(products: ProductAnalysis[]): ProductAnalysis[];
}
```

### Rules Service
```typescript
interface RulesService {
  createRule(rule: CreateRuleInput): UserRule;
  updateRule(id: string, rule: UpdateRuleInput): UserRule;
  deleteRule(id: string): void;
  validateRule(rule: RuleInput): ValidationResult;
  applyRules(products: Product[], rules: UserRule[]): ProductAnalysis[];
}
```

### Storage Service
```typescript
interface StorageService {
  saveAnalyses(analyses: Analysis[]): void;
  loadAnalyses(): Analysis[];
  saveRules(rules: UserRule[]): void;
  loadRules(): UserRule[];
  saveSettings(settings: UserSettings): void;
  loadSettings(): UserSettings;
  clearAll(): void;
}
```

## 🎯 Performance Optimization

### Code Splitting
```typescript
// Lazy loading stron
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const Rules = lazy(() => import('./pages/Rules'));
```

### Memoization
```typescript
// React.memo dla komponentów
const ProductCard = memo(({ product }: ProductCardProps) => {
  // Component logic
});

// useMemo dla obliczeń
const sortedProducts = useMemo(() => {
  return products.sort((a, b) => b.score - a.score);
}, [products]);
```

### Virtual Scrolling
```typescript
// Dla dużych list produktów
const VirtualizedProductList = ({ products }: ProductListProps) => {
  // Implementation with react-window
};
```

## 🧪 Testing Strategy

### Unit Tests
- **Components**: Testowanie renderowania i interakcji
- **Services**: Testowanie logiki biznesowej
- **Utils**: Testowanie funkcji pomocniczych
- **Hooks**: Testowanie custom hooks

### Integration Tests
- **File Upload Flow**: End-to-end test uploadu
- **Analysis Flow**: Test całego procesu analizy
- **Rules Management**: Test zarządzania regułami

### E2E Tests
- **Critical User Journeys**: Główne ścieżki użytkownika
- **Cross-browser Testing**: Testowanie na różnych przeglądarkach
- **Mobile Testing**: Testowanie responsywności

## 🔒 Security

### Client-side Security
- **File Validation**: Sprawdzanie typu i rozmiaru plików
- **Data Sanitization**: Czyszczenie danych z plików
- **XSS Prevention**: Escapowanie danych w UI

### Privacy
- **Local Storage Only**: Brak wysyłania danych do serwerów
- **Data Encryption**: Opcjonalne szyfrowanie wrażliwych danych
- **Clear Data**: Możliwość usunięcia wszystkich danych

## 📱 Responsywność

### Breakpoints
```typescript
const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;
```

### Mobile-First Approach
- **Touch Targets**: Minimum 44px
- **Navigation**: Bottom navigation na mobile
- **Content**: Single column layout
- **Gestures**: Swipe dla nawigacji

## 🚀 Deployment

### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Build Optimization
- **Tree Shaking**: Usuwanie nieużywanego kodu
- **Code Splitting**: Podział kodu na chunks
- **Asset Optimization**: Kompresja obrazów i fontów
- **Bundle Analysis**: Analiza rozmiaru bundli

## 🔮 Przyszłe rozszerzenia

### Backend Integration
- **API Layer**: RESTful API dla danych
- **Authentication**: System logowania
- **Database**: Przechowywanie danych na serwerze
- **Real-time**: WebSocket dla aktualizacji

### Advanced Features
- **AI/ML**: Automatyczna kategoryzacja produktów
- **Collaboration**: Współpraca zespołowa
- **Export**: Eksport do różnych formatów
- **Integrations**: Integracje z zewnętrznymi systemami

---

*Architektura utworzona: Styczeń 2025*  
*Wersja: 1.0*
