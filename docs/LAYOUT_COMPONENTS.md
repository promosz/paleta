# Komponenty Layout - Paleta

> Dokumentacja komponentów layoutu aplikacji Paleta

## 🏗️ Struktura Layout

```
┌─────────────────────────────────────────────────────────┐
│                    Header                               │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   Sidebar   │              Main Content                 │
│             │                                           │
│             │                                           │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

---

## 📋 Header

### Opis
Główny nagłówek aplikacji z logo, nawigacją i akcjami.

### Props
```typescript
interface HeaderProps {
  className?: string
}
```

### Struktura
```tsx
<header className="bg-white border-b border-neutral-200 px-6 py-4">
  <div className="flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
        <span className="text-white font-bold text-sm">P</span>
      </div>
      <h1 className="text-xl font-semibold text-neutral-800">Paleta</h1>
    </div>
    
    {/* Navigation */}
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/analysis">Analiza</Link>
      <Link to="/rules">Reguły</Link>
      <Link to="/settings">Ustawienia</Link>
    </nav>
    
    {/* Actions */}
    <div className="flex items-center space-x-3">
      <Button variant="primary" size="sm">
        Nowa analiza
      </Button>
    </div>
  </div>
</header>
```

### Elementy

#### Logo
```tsx
<div className="flex items-center space-x-4">
  <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
    <span className="text-white font-bold text-sm">P</span>
  </div>
  <h1 className="text-xl font-semibold text-neutral-800">Paleta</h1>
</div>
```

#### Nawigacja
```tsx
<nav className="hidden md:flex items-center space-x-6">
  <Link 
    to="/dashboard"
    className="text-neutral-600 hover:text-primary-500 transition-colors"
  >
    Dashboard
  </Link>
  <Link 
    to="/analysis"
    className="text-neutral-600 hover:text-primary-500 transition-colors"
  >
    Analiza
  </Link>
  <Link 
    to="/rules"
    className="text-neutral-600 hover:text-primary-500 transition-colors"
  >
    Reguły
  </Link>
  <Link 
    to="/settings"
    className="text-neutral-600 hover:text-primary-500 transition-colors"
  >
    Ustawienia
  </Link>
</nav>
```

#### Akcje
```tsx
<div className="flex items-center space-x-3">
  <Button variant="primary" size="sm">
    Nowa analiza
  </Button>
</div>
```

### Responsywność

#### Desktop (> 768px)
- Pełna nawigacja widoczna
- Logo + nazwa aplikacji
- Przycisk "Nowa analiza"

#### Mobile (< 768px)
- Nawigacja ukryta
- Tylko logo
- Przycisk "Nowa analiza" (mniejszy)

### Styling
```css
.header {
  background: white;
  border-bottom: 1px solid #DFE1E6;
  padding: 16px 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}
```

---

## 🧭 Sidebar

### Opis
Boczna nawigacja z linkami do głównych sekcji aplikacji.

### Props
```typescript
interface SidebarProps {
  className?: string
}
```

### Struktura
```tsx
<aside className="w-64 bg-white border-r border-neutral-200 p-6">
  <nav className="space-y-2">
    {navigationItems.map(item => (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
          isActive ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
        }`}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
      </Link>
    ))}
  </nav>
</aside>
```

### Elementy nawigacji
```typescript
const navigationItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
      </svg>
    )
  },
  {
    path: '/analysis',
    label: 'Analiza',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    path: '/rules',
    label: 'Reguły',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    path: '/settings',
    label: 'Ustawienia',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
]
```

### Stany linków

#### Normalny
```tsx
<Link
  to="/dashboard"
  className="flex items-center space-x-3 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 transition-colors"
>
  <DashboardIcon />
  <span className="font-medium">Dashboard</span>
</Link>
```

#### Aktywny
```tsx
<Link
  to="/dashboard"
  className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary-50 text-primary-600 transition-colors"
>
  <DashboardIcon />
  <span className="font-medium">Dashboard</span>
</Link>
```

#### Hover
```tsx
<Link
  to="/dashboard"
  className="flex items-center space-x-3 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50 transition-colors"
>
  <DashboardIcon />
  <span className="font-medium">Dashboard</span>
</Link>
```

### Responsywność

#### Desktop (> 1024px)
- Szerokość: 256px (w-64)
- Pełna nawigacja widoczna
- Ikony + tekst

#### Tablet (768px - 1024px)
- Szerokość: 200px
- Pełna nawigacja widoczna
- Ikony + tekst

#### Mobile (< 768px)
- Ukryty (hidden)
- Zastąpiony przez hamburger menu w headerze

### Styling
```css
.sidebar {
  width: 256px;
  background: white;
  border-right: 1px solid #DFE1E6;
  padding: 24px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 40;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  color: #42526E;
  transition: all 0.2s;
}

.sidebar-nav-item:hover {
  background: #F4F5F7;
}

.sidebar-nav-item.active {
  background: #E6F0FF;
  color: #0052CC;
}
```

---

## 🏗️ Layout

### Opis
Główny wrapper aplikacji łączący Header i Sidebar z treścią.

### Props
```typescript
interface LayoutProps {
  children: React.ReactNode
  className?: string
}
```

### Struktura
```tsx
<div className="min-h-screen bg-neutral-50">
  <Header />
  <div className="flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-6">
      {children}
    </main>
  </div>
</div>
```

### Responsywność

#### Desktop (> 1024px)
```tsx
<div className="min-h-screen bg-neutral-50">
  <Header />
  <div className="flex">
    <Sidebar />
    <main className="flex-1 ml-64 p-6">
      {children}
    </main>
  </div>
</div>
```

#### Tablet (768px - 1024px)
```tsx
<div className="min-h-screen bg-neutral-50">
  <Header />
  <div className="flex">
    <Sidebar />
    <main className="flex-1 ml-48 p-4">
      {children}
    </main>
  </div>
</div>
```

#### Mobile (< 768px)
```tsx
<div className="min-h-screen bg-neutral-50">
  <Header />
  <div className="flex">
    <Sidebar className="hidden" />
    <main className="flex-1 p-4">
      {children}
    </main>
  </div>
</div>
```

### Styling
```css
.layout {
  min-height: 100vh;
  background: #F4F5F7;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
  margin-left: 256px;
  padding: 24px;
  transition: margin-left 0.3s ease;
}

@media (max-width: 1024px) {
  .layout-main {
    margin-left: 200px;
  }
}

@media (max-width: 768px) {
  .layout-main {
    margin-left: 0;
    padding: 16px;
  }
}
```

---

## 📱 Mobile Navigation

### Hamburger Menu
```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
  aria-label="Toggle mobile menu"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```

### Mobile Menu Overlay
```tsx
{isMobileMenuOpen && (
  <div className="fixed inset-0 z-50 md:hidden">
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          {navigationItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-50"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  </div>
)}
```

---

## 🎨 Przykłady użycia

### Podstawowy Layout
```tsx
import { Layout } from './components/layout'

function App() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content */}
        </div>
      </div>
    </Layout>
  )
}
```

### Layout z custom headerem
```tsx
<Layout>
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Analiza produktów</h1>
      <Button variant="primary">
        Nowa analiza
      </Button>
    </div>
    {/* Content */}
  </div>
</Layout>
```

### Layout z breadcrumbs
```tsx
<Layout>
  <div className="max-w-7xl mx-auto">
    <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-6">
      <Link to="/dashboard" className="hover:text-primary-500">Dashboard</Link>
      <span>/</span>
      <Link to="/analysis" className="hover:text-primary-500">Analiza</Link>
      <span>/</span>
      <span className="text-neutral-800">Szczegóły</span>
    </nav>
    {/* Content */}
  </div>
</Layout>
```

---

## ♿ Accessibility

### Wymagania
- **Keyboard navigation**: Pełna obsługa klawiatury
- **Screen readers**: Proper ARIA labels
- **Focus management**: Widoczne stany focus
- **Color contrast**: Minimum 4.5:1 ratio

### Przykłady

#### Header z ARIA
```tsx
<header role="banner" className="bg-white border-b border-neutral-200">
  <div className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center" aria-label="Paleta logo">
        <span className="text-white font-bold text-sm">P</span>
      </div>
      <h1 className="text-xl font-semibold text-neutral-800">Paleta</h1>
    </div>
  </div>
</header>
```

#### Sidebar z ARIA
```tsx
<aside role="navigation" aria-label="Główna nawigacja">
  <nav className="space-y-2">
    {navigationItems.map(item => (
      <Link
        key={item.path}
        to={item.path}
        className="flex items-center space-x-3 px-3 py-2 rounded-md"
        aria-current={isActive ? 'page' : undefined}
      >
        {item.icon}
        <span className="font-medium">{item.label}</span>
      </Link>
    ))}
  </nav>
</aside>
```

#### Mobile menu z ARIA
```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="md:hidden p-2 rounded-md"
  aria-label="Otwórz menu nawigacji"
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```

---

## 🔧 Customization

### Custom Header
```tsx
const CustomHeader = () => (
  <header className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        <h1 className="text-xl font-semibold">Paleta</h1>
      </div>
      <Button variant="secondary" className="bg-white bg-opacity-20 text-white border-white">
        Nowa analiza
      </Button>
    </div>
  </header>
)
```

### Custom Sidebar
```tsx
const CustomSidebar = () => (
  <aside className="w-64 bg-gradient-to-b from-neutral-50 to-neutral-100 border-r border-neutral-200">
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">
          Nawigacja
        </h2>
      </div>
      <nav className="space-y-2">
        {/* Custom navigation items */}
      </nav>
    </div>
  </aside>
)
```

### Custom Layout
```tsx
const CustomLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
    <CustomHeader />
    <div className="flex">
      <CustomSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  </div>
)
```

---

*Dokumentacja komponentów layoutu utworzona: Styczeń 2025*  
*Wersja: 1.0*
