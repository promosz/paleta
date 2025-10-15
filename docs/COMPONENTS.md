# Komponenty UI - Paleta

> Dokumentacja komponentów UI aplikacji Paleta z przykładami użycia

## 🎨 Design System

### Kolory
- **Primary**: #0052CC (główny kolor aplikacji)
- **Neutral**: #F4F5F7 do #091E42 (szarości)
- **Success**: #36B37E (zielony)
- **Warning**: #FFAB00 (żółty)
- **Danger**: #DE350B (czerwony)

### Typografia
- **Font**: Inter (Google Fonts)
- **Rozmiary**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px
- **Wagi**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- **Skala**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

---

## 🔘 Button

### Opis
Przycisk z różnymi wariantami i rozmiarami, zgodny z design systemem Atlassian.

### Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}
```

### Warianty

#### Primary (domyślny)
```tsx
<Button variant="primary">Główny przycisk</Button>
```
- Tło: Primary Blue (#0052CC)
- Tekst: Biały
- Hover: Jaśniejszy niebieski
- Focus: Ring primary-200

#### Secondary
```tsx
<Button variant="secondary">Przycisk wtórny</Button>
```
- Tło: Przezroczyste
- Tekst: Primary Blue
- Border: Primary Blue
- Hover: Tło primary-50

#### Danger
```tsx
<Button variant="danger">Niebezpieczna akcja</Button>
```
- Tło: Danger Red (#DE350B)
- Tekst: Biały
- Hover: Jaśniejszy czerwony
- Focus: Ring danger-200

### Rozmiary

#### Small (sm)
```tsx
<Button size="sm">Mały przycisk</Button>
```
- Padding: 12px 16px
- Font: 14px

#### Medium (md) - domyślny
```tsx
<Button size="md">Średni przycisk</Button>
```
- Padding: 16px 20px
- Font: 14px

#### Large (lg)
```tsx
<Button size="lg">Duży przycisk</Button>
```
- Padding: 24px 32px
- Font: 16px

### Stany

#### Normal
```tsx
<Button>Normalny przycisk</Button>
```

#### Hover
```tsx
<Button>Przycisk z hover</Button>
```

#### Focus
```tsx
<Button>Przycisk z focus</Button>
```

#### Disabled
```tsx
<Button disabled>Wyłączony przycisk</Button>
```

### Przykłady użycia

#### Podstawowe
```tsx
import { Button } from './components/ui'

function MyComponent() {
  return (
    <div className="space-y-4">
      <Button variant="primary">Zapisz</Button>
      <Button variant="secondary">Anuluj</Button>
      <Button variant="danger">Usuń</Button>
    </div>
  )
}
```

#### Z ikonami
```tsx
<Button variant="primary">
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
  Dodaj element
</Button>
```

#### Pełna szerokość
```tsx
<Button variant="primary" className="w-full">
  Przycisk na pełną szerokość
</Button>
```

---

## 📦 Card

### Opis
Kontener do grupowania powiązanych treści z opcjonalnym nagłówkiem i stopką.

### Props
```typescript
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg'
}
```

### Podstawowe użycie
```tsx
<Card>
  <p>Treść karty</p>
</Card>
```

### Z nagłówkiem i stopką
```tsx
<Card>
  <CardHeader>
    <h3>Tytuł karty</h3>
  </CardHeader>
  <CardBody>
    <p>Treść karty</p>
  </CardBody>
  <CardFooter>
    <Button variant="primary">Akcja</Button>
  </CardFooter>
</Card>
```

### Padding

#### Small (sm)
```tsx
<Card padding="sm">
  <p>Karta z małym paddingiem</p>
</Card>
```

#### Medium (md) - domyślny
```tsx
<Card padding="md">
  <p>Karta ze średnim paddingiem</p>
</Card>
```

#### Large (lg)
```tsx
<Card padding="lg">
  <p>Karta z dużym paddingiem</p>
</Card>
```

### Cienie

#### Small (sm) - domyślny
```tsx
<Card shadow="sm">
  <p>Karta z małym cieniem</p>
</Card>
```

#### Medium (md)
```tsx
<Card shadow="md">
  <p>Karta ze średnim cieniem</p>
</Card>
```

#### Large (lg)
```tsx
<Card shadow="lg">
  <p>Karta z dużym cieniem</p>
</Card>
```

### Przykłady użycia

#### Karta produktu
```tsx
<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold">Nazwa produktu</h3>
  </CardHeader>
  <CardBody>
    <p className="text-neutral-600 mb-4">Opis produktu</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-primary-500">99.99 PLN</span>
      <StatusBadge status="success">Dostępny</StatusBadge>
    </div>
  </CardBody>
  <CardFooter>
    <Button variant="primary" className="w-full">
      Dodaj do koszyka
    </Button>
  </CardFooter>
</Card>
```

#### Karta statystyki
```tsx
<Card>
  <CardBody>
    <div className="text-center">
      <div className="text-3xl font-bold text-primary-500 mb-2">42</div>
      <div className="text-sm text-neutral-600">Przeanalizowane produkty</div>
    </div>
  </CardBody>
</Card>
```

---

## 📝 Input

### Opis
Pole wejściowe z etykietą, obsługą błędów i opcjonalnymi ikonami.

### Props
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

### Podstawowe użycie
```tsx
<Input placeholder="Wprowadź tekst" />
```

### Z etykietą
```tsx
<Input 
  label="Nazwa produktu"
  placeholder="Wprowadź nazwę produktu"
/>
```

### Z tekstem pomocniczym
```tsx
<Input 
  label="EAN"
  placeholder="1234567890123"
  helperText="13-cyfrowy kod EAN"
/>
```

### Z błędem
```tsx
<Input 
  label="Cena"
  type="number"
  placeholder="0.00"
  error="Cena musi być większa od 0"
/>
```

### Z ikonami

#### Lewa ikona
```tsx
<Input 
  label="Wyszukaj"
  placeholder="Wprowadź frazę wyszukiwania"
  leftIcon={
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  }
/>
```

#### Prawa ikona
```tsx
<Input 
  label="Hasło"
  type="password"
  placeholder="Wprowadź hasło"
  rightIcon={
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  }
/>
```

### Typy pól

#### Tekst
```tsx
<Input 
  label="Nazwa"
  type="text"
  placeholder="Wprowadź nazwę"
/>
```

#### Email
```tsx
<Input 
  label="Email"
  type="email"
  placeholder="user@example.com"
/>
```

#### Liczba
```tsx
<Input 
  label="Cena"
  type="number"
  placeholder="0.00"
  step="0.01"
/>
```

#### Data
```tsx
<Input 
  label="Data"
  type="date"
/>
```

#### Wyłączone
```tsx
<Input 
  label="ID"
  value="12345"
  disabled
/>
```

### Przykłady użycia

#### Formularz produktu
```tsx
<form className="space-y-4">
  <Input 
    label="Nazwa produktu"
    placeholder="Wprowadź nazwę produktu"
    required
  />
  <Input 
    label="EAN"
    placeholder="1234567890123"
    helperText="13-cyfrowy kod EAN"
  />
  <Input 
    label="Cena"
    type="number"
    placeholder="0.00"
    step="0.01"
    helperText="Cena w PLN"
  />
  <Button variant="primary" type="submit">
    Zapisz produkt
  </Button>
</form>
```

#### Wyszukiwarka
```tsx
<div className="relative">
  <Input 
    placeholder="Wyszukaj produkty..."
    leftIcon={
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    }
  />
</div>
```

---

## 🏷️ StatusBadge

### Opis
Oznaczenie statusu z kolorowym tłem i tekstem.

### Props
```typescript
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
  className?: string
}
```

### Warianty

#### Success
```tsx
<StatusBadge status="success">✅ Sukces</StatusBadge>
```
- Kolor: Success Green (#36B37E)
- Tło: Success-50

#### Warning
```tsx
<StatusBadge status="warning">⚠️ Ostrzeżenie</StatusBadge>
```
- Kolor: Warning Amber (#FFAB00)
- Tło: Warning-50

#### Danger
```tsx
<StatusBadge status="danger">❌ Błąd</StatusBadge>
```
- Kolor: Danger Red (#DE350B)
- Tło: Danger-50

#### Info
```tsx
<StatusBadge status="info">ℹ️ Informacja</StatusBadge>
```
- Kolor: Primary Blue (#0052CC)
- Tło: Primary-50

### Przykłady użycia

#### Status produktu
```tsx
<div className="flex items-center space-x-2">
  <span>Produkt:</span>
  <StatusBadge status="success">Dostępny</StatusBadge>
</div>
```

#### Status analizy
```tsx
<div className="flex items-center space-x-2">
  <span>Analiza:</span>
  <StatusBadge status="warning">W toku</StatusBadge>
</div>
```

#### Status reguły
```tsx
<div className="flex items-center space-x-2">
  <span>Reguła:</span>
  <StatusBadge status="danger">Nieaktywna</StatusBadge>
</div>
```

#### Lista statusów
```tsx
<div className="flex flex-wrap gap-2">
  <StatusBadge status="success">✅ System gotowy</StatusBadge>
  <StatusBadge status="warning">⚠️ Brak analiz</StatusBadge>
  <StatusBadge status="danger">❌ Brak reguł</StatusBadge>
  <StatusBadge status="info">ℹ️ Informacja</StatusBadge>
</div>
```

---

## 🎨 Przykłady kombinacji

### Formularz z walidacją
```tsx
<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold">Dodaj nową regułę</h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-4">
      <Input 
        label="Nazwa reguły"
        placeholder="Wprowadź nazwę reguły"
        error="Nazwa reguły jest wymagana"
      />
      <Input 
        label="Wartość"
        type="number"
        placeholder="0"
        helperText="Wartość w PLN"
      />
      <div className="flex items-center space-x-2">
        <span>Status:</span>
        <StatusBadge status="warning">Nieaktywna</StatusBadge>
      </div>
    </div>
  </CardBody>
  <CardFooter>
    <div className="flex space-x-3">
      <Button variant="secondary">Anuluj</Button>
      <Button variant="primary">Zapisz regułę</Button>
    </div>
  </CardFooter>
</Card>
```

### Lista produktów
```tsx
<div className="space-y-4">
  {products.map(product => (
    <Card key={product.id}>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-sm text-neutral-600">{product.category}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold">{product.price} PLN</div>
            <StatusBadge status={product.available ? 'success' : 'danger'}>
              {product.available ? 'Dostępny' : 'Niedostępny'}
            </StatusBadge>
          </div>
        </div>
      </CardBody>
    </Card>
  ))}
</div>
```

### Dashboard z kartami
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>
    <CardBody>
      <div className="text-center">
        <div className="text-3xl font-bold text-primary-500 mb-2">42</div>
        <div className="text-sm text-neutral-600">Produkty</div>
      </div>
    </CardBody>
  </Card>
  
  <Card>
    <CardBody>
      <div className="text-center">
        <div className="text-3xl font-bold text-success-500 mb-2">18</div>
        <div className="text-sm text-neutral-600">Analizy</div>
      </div>
    </CardBody>
  </Card>
  
  <Card>
    <CardBody>
      <div className="text-center">
        <div className="text-3xl font-bold text-warning-500 mb-2">5</div>
        <div className="text-sm text-neutral-600">Reguły</div>
      </div>
    </CardBody>
  </Card>
  
  <Card>
    <CardBody>
      <div className="text-center">
        <div className="text-3xl font-bold text-danger-500 mb-2">3</div>
        <div className="text-sm text-neutral-600">Błędy</div>
      </div>
    </CardBody>
  </Card>
</div>
```

---

## 📱 Responsywność

### Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Przykłady responsywne

#### Grid z kartami
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Karty automatycznie dostosują się do szerokości */}
</div>
```

#### Przyciski na mobile
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  <Button variant="primary" className="w-full sm:w-auto">
    Główna akcja
  </Button>
  <Button variant="secondary" className="w-full sm:w-auto">
    Akcja wtórna
  </Button>
</div>
```

#### Formularz responsywny
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input label="Imię" />
  <Input label="Nazwisko" />
</div>
```

---

## ♿ Accessibility

### Wymagania
- **Focus states**: Wszystkie interaktywne elementy mają widoczne stany focus
- **Color contrast**: Minimum 4.5:1 ratio
- **Touch targets**: Minimum 44px
- **Keyboard navigation**: Pełna obsługa klawiatury

### Przykłady

#### Przycisk z aria-label
```tsx
<Button 
  variant="primary"
  aria-label="Dodaj nowy produkt"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
</Button>
```

#### Input z aria-describedby
```tsx
<Input 
  label="Email"
  type="email"
  aria-describedby="email-help"
  helperText="Wprowadź prawidłowy adres email"
/>
```

#### StatusBadge z role
```tsx
<StatusBadge 
  status="success"
  role="status"
  aria-live="polite"
>
  ✅ Operacja zakończona pomyślnie
</StatusBadge>
```

---

## 🔧 Customization

### CSS Variables
```css
:root {
  --color-primary-500: #0052CC;
  --color-neutral-600: #42526E;
  --color-success-500: #36B37E;
  --color-warning-500: #FFAB00;
  --color-danger-500: #DE350B;
}
```

### Tailwind Classes
```tsx
<Button 
  variant="primary"
  className="bg-custom-blue hover:bg-custom-blue-dark"
>
  Custom Button
</Button>
```

### Theme Override
```tsx
<Card className="bg-gradient-to-r from-primary-50 to-primary-100">
  <CardBody>
    <p>Karta z custom tłem</p>
  </CardBody>
</Card>
```

---

*Dokumentacja komponentów utworzona: Styczeń 2025*  
*Wersja: 1.0*
