# Component Showcase - Paleta

> Interaktywny showcase komponentów UI aplikacji Paleta

## 🎯 Cel

Ten dokument prezentuje wszystkie komponenty UI w akcji z przykładami użycia, różnymi stanami i kombinacjami.

---

## 🔘 Button Showcase

### Wszystkie warianty
```tsx
<div className="space-y-4">
  <div className="flex flex-wrap gap-3">
    <Button variant="primary">Primary Button</Button>
    <Button variant="secondary">Secondary Button</Button>
    <Button variant="danger">Danger Button</Button>
  </div>
  
  <div className="flex flex-wrap gap-3">
    <Button variant="primary" size="sm">Small Primary</Button>
    <Button variant="primary" size="md">Medium Primary</Button>
    <Button variant="primary" size="lg">Large Primary</Button>
  </div>
  
  <div className="flex flex-wrap gap-3">
    <Button variant="primary" disabled>Disabled Primary</Button>
    <Button variant="secondary" disabled>Disabled Secondary</Button>
    <Button variant="danger" disabled>Disabled Danger</Button>
  </div>
</div>
```

### Z ikonami
```tsx
<div className="space-y-4">
  <div className="flex flex-wrap gap-3">
    <Button variant="primary">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Dodaj
    </Button>
    
    <Button variant="secondary">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Edytuj
    </Button>
    
    <Button variant="danger">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Usuń
    </Button>
  </div>
</div>
```

### Pełna szerokość
```tsx
<div className="space-y-4">
  <Button variant="primary" className="w-full">Pełna szerokość - Primary</Button>
  <Button variant="secondary" className="w-full">Pełna szerokość - Secondary</Button>
  <Button variant="danger" className="w-full">Pełna szerokość - Danger</Button>
</div>
```

---

## 📦 Card Showcase

### Podstawowe karty
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Podstawowa karta</h3>
      <p className="text-neutral-600">To jest przykład podstawowej karty z treścią.</p>
    </CardBody>
  </Card>
  
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">Karta z nagłówkiem</h3>
    </CardHeader>
    <CardBody>
      <p className="text-neutral-600">Karta z nagłówkiem i treścią.</p>
    </CardBody>
  </Card>
  
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">Karta z akcjami</h3>
    </CardHeader>
    <CardBody>
      <p className="text-neutral-600">Karta z nagłówkiem, treścią i stopką.</p>
    </CardBody>
    <CardFooter>
      <Button variant="primary" size="sm">Akcja</Button>
    </CardFooter>
  </Card>
</div>
```

### Karty z różnymi paddingami
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card padding="sm">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Mały padding</h3>
      <p className="text-neutral-600">Karta z małym paddingiem.</p>
    </CardBody>
  </Card>
  
  <Card padding="md">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Średni padding</h3>
      <p className="text-neutral-600">Karta ze średnim paddingiem (domyślny).</p>
    </CardBody>
  </Card>
  
  <Card padding="lg">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Duży padding</h3>
      <p className="text-neutral-600">Karta z dużym paddingiem.</p>
    </CardBody>
  </Card>
</div>
```

### Karty z różnymi cieniami
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <Card shadow="sm">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Mały cień</h3>
      <p className="text-neutral-600">Karta z małym cieniem (domyślny).</p>
    </CardBody>
  </Card>
  
  <Card shadow="md">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Średni cień</h3>
      <p className="text-neutral-600">Karta ze średnim cieniem.</p>
    </CardBody>
  </Card>
  
  <Card shadow="lg">
    <CardBody>
      <h3 className="text-lg font-semibold mb-2">Duży cień</h3>
      <p className="text-neutral-600">Karta z dużym cieniem.</p>
    </CardBody>
  </Card>
</div>
```

### Karty produktów
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">Laptop Dell XPS 13</h3>
    </CardHeader>
    <CardBody>
      <p className="text-neutral-600 mb-4">13-calowy laptop z procesorem Intel i7, 16GB RAM, 512GB SSD.</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary-500">4,999 PLN</span>
        <StatusBadge status="success">Dostępny</StatusBadge>
      </div>
    </CardBody>
    <CardFooter>
      <Button variant="primary" className="w-full">
        Dodaj do koszyka
      </Button>
    </CardFooter>
  </Card>
  
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">iPhone 15 Pro</h3>
    </CardHeader>
    <CardBody>
      <p className="text-neutral-600 mb-4">Najnowszy iPhone z tytanową obudową i systemem A17 Pro.</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary-500">5,499 PLN</span>
        <StatusBadge status="warning">Ograniczona dostępność</StatusBadge>
      </div>
    </CardBody>
    <CardFooter>
      <Button variant="primary" className="w-full">
        Dodaj do koszyka
      </Button>
    </CardFooter>
  </Card>
  
  <Card>
    <CardHeader>
      <h3 className="text-lg font-semibold">Samsung Galaxy S24</h3>
    </CardHeader>
    <CardBody>
      <p className="text-neutral-600 mb-4">Flaga Samsung z AI i zaawansowanym aparatem.</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-primary-500">3,999 PLN</span>
        <StatusBadge status="danger">Niedostępny</StatusBadge>
      </div>
    </CardBody>
    <CardFooter>
      <Button variant="primary" className="w-full" disabled>
        Niedostępny
      </Button>
    </CardFooter>
  </Card>
</div>
```

---

## 📝 Input Showcase

### Podstawowe pola
```tsx
<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="Nazwa produktu"
      placeholder="Wprowadź nazwę produktu"
    />
    
    <Input 
      label="EAN"
      placeholder="1234567890123"
      helperText="13-cyfrowy kod EAN"
    />
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="Cena"
      type="number"
      placeholder="0.00"
      step="0.01"
      helperText="Cena w PLN"
    />
    
    <Input 
      label="Email"
      type="email"
      placeholder="user@example.com"
    />
  </div>
</div>
```

### Pola z błędami
```tsx
<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="Nazwa produktu"
      placeholder="Wprowadź nazwę produktu"
      error="Nazwa produktu jest wymagana"
    />
    
    <Input 
      label="Cena"
      type="number"
      placeholder="0.00"
      error="Cena musi być większa od 0"
    />
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="Email"
      type="email"
      placeholder="user@example.com"
      error="Wprowadź prawidłowy adres email"
    />
    
    <Input 
      label="Hasło"
      type="password"
      placeholder="Wprowadź hasło"
      error="Hasło musi mieć minimum 8 znaków"
    />
  </div>
</div>
```

### Pola z ikonami
```tsx
<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="Wyszukaj"
      placeholder="Wprowadź frazę wyszukiwania"
      leftIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
    />
    
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
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="Data"
      type="date"
      leftIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
    />
    
    <Input 
      label="Czas"
      type="time"
      rightIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  </div>
</div>
```

### Wyłączone pola
```tsx
<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Input 
      label="ID produktu"
      value="PRD-12345"
      disabled
      helperText="ID jest generowane automatycznie"
    />
    
    <Input 
      label="Data utworzenia"
      value="2025-01-15"
      disabled
      helperText="Data utworzenia rekordu"
    />
  </div>
</div>
```

---

## 🏷️ StatusBadge Showcase

### Wszystkie warianty
```tsx
<div className="space-y-4">
  <div className="flex flex-wrap gap-3">
    <StatusBadge status="success">✅ Sukces</StatusBadge>
    <StatusBadge status="warning">⚠️ Ostrzeżenie</StatusBadge>
    <StatusBadge status="danger">❌ Błąd</StatusBadge>
    <StatusBadge status="info">ℹ️ Informacja</StatusBadge>
  </div>
  
  <div className="flex flex-wrap gap-3">
    <StatusBadge status="success">Dostępny</StatusBadge>
    <StatusBadge status="warning">Ograniczona dostępność</StatusBadge>
    <StatusBadge status="danger">Niedostępny</StatusBadge>
    <StatusBadge status="info">W trakcie</StatusBadge>
  </div>
</div>
```

### Statusy produktów
```tsx
<div className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Laptop Dell:</span>
      <StatusBadge status="success">Dostępny</StatusBadge>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">iPhone 15:</span>
      <StatusBadge status="warning">Ograniczona dostępność</StatusBadge>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Samsung S24:</span>
      <StatusBadge status="danger">Niedostępny</StatusBadge>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">MacBook Pro:</span>
      <StatusBadge status="info">W trakcie</StatusBadge>
    </div>
  </div>
</div>
```

### Statusy analiz
```tsx
<div className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Analiza #001:</span>
      <StatusBadge status="success">Zakończona</StatusBadge>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Analiza #002:</span>
      <StatusBadge status="warning">W toku</StatusBadge>
    </div>
    
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Analiza #003:</span>
      <StatusBadge status="danger">Błąd</StatusBadge>
    </div>
  </div>
</div>
```

---

## 🎨 Kombinacje komponentów

### Formularz produktu
```tsx
<Card>
  <CardHeader>
    <h3 className="text-lg font-semibold">Dodaj nowy produkt</h3>
  </CardHeader>
  <CardBody>
    <div className="space-y-4">
      <Input 
        label="Nazwa produktu"
        placeholder="Wprowadź nazwę produktu"
        error="Nazwa produktu jest wymagana"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Status:</span>
        <StatusBadge status="warning">Nieaktywny</StatusBadge>
      </div>
    </div>
  </CardBody>
  <CardFooter>
    <div className="flex space-x-3">
      <Button variant="secondary">Anuluj</Button>
      <Button variant="primary">Zapisz produkt</Button>
    </div>
  </CardFooter>
</Card>
```

### Lista produktów
```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold">Produkty</h2>
    <Button variant="primary">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Dodaj produkt
    </Button>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map(product => (
      <Card key={product.id}>
        <CardHeader>
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </CardHeader>
        <CardBody>
          <p className="text-neutral-600 mb-4">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-500">{product.price} PLN</span>
            <StatusBadge status={product.available ? 'success' : 'danger'}>
              {product.available ? 'Dostępny' : 'Niedostępny'}
            </StatusBadge>
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="flex-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Edytuj
            </Button>
            <Button variant="danger" size="sm" className="flex-1">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Usuń
            </Button>
          </div>
        </CardFooter>
      </Card>
    ))}
  </div>
</div>
```

### Dashboard z kartami
```tsx
<div className="space-y-6">
  <h1 className="text-2xl font-bold">Dashboard</h1>
  
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
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Ostatnie analizy</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {recentAnalyses.map(analysis => (
            <div key={analysis.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{analysis.name}</div>
                <div className="text-sm text-neutral-600">{analysis.date}</div>
              </div>
              <StatusBadge status={analysis.status}>
                {analysis.statusText}
              </StatusBadge>
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          Zobacz wszystkie
        </Button>
      </CardFooter>
    </Card>
    
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Szybkie akcje</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          <Button variant="primary" className="w-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nowa analiza
          </Button>
          
          <Button variant="secondary" className="w-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Zarządzaj regułami
          </Button>
          
          <Button variant="secondary" className="w-full">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            Ustawienia
          </Button>
        </div>
      </CardBody>
    </Card>
  </div>
</div>
```

---

## 📱 Responsywność

### Grid responsywny
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Karty automatycznie dostosują się do szerokości */}
  <Card>Karta 1</Card>
  <Card>Karta 2</Card>
  <Card>Karta 3</Card>
  <Card>Karta 4</Card>
</div>
```

### Przyciski responsywne
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

### Formularz responsywny
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <Input label="Imię" />
  <Input label="Nazwisko" />
  <Input label="Email" />
  <Input label="Telefon" />
</div>
```

---

## ♿ Accessibility

### Przykłady dostępności
```tsx
{/* Przycisk z aria-label */}
<Button 
  variant="primary"
  aria-label="Dodaj nowy produkt"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
</Button>

{/* Input z aria-describedby */}
<Input 
  label="Email"
  type="email"
  aria-describedby="email-help"
  helperText="Wprowadź prawidłowy adres email"
/>

{/* StatusBadge z role */}
<StatusBadge 
  status="success"
  role="status"
  aria-live="polite"
>
  ✅ Operacja zakończona pomyślnie
</StatusBadge>
```

---

*Component Showcase utworzony: Styczeń 2025*  
*Wersja: 1.0*
