# Wymagania Aplikacji - Paleta

> Szczegółowe wymagania funkcjonalne i niefunkcjonalne aplikacji Paleta

## 📋 Przegląd wymagań

**Aplikacja**: Paleta  
**Typ**: Web Application (SPA)  
**Platforma**: Przeglądarka internetowa  
**Język**: Polski  
**Styl**: Minimalistyczny, nowoczesny (inspirowany Atlassian Design System)

## 🎯 Wymagania funkcjonalne

### 1. Upload i Parsowanie Plików

#### 1.1 Obsługa formatów plików
- **XLSX** - Pliki Excel (.xlsx)
- **PDF** - Dokumenty PDF (.pdf)
- **CSV** - Pliki CSV (.csv)
- **Maksymalny rozmiar**: 10MB na plik
- **Walidacja**: Sprawdzanie typu MIME i rozszerzenia

#### 1.2 Interface uploadu
- **Drag & Drop Zone**: Obszar 400x200px
- **Click to Upload**: Alternatywa dla drag & drop
- **Progress Indicator**: Pasek postępu z procentami
- **Error Handling**: Wyświetlanie błędów walidacji
- **Multiple Files**: Obsługa wielu plików jednocześnie

#### 1.3 Parsowanie danych
- **Automatyczne wykrywanie**: Nagłówków i struktury danych
- **Mapowanie kolumn**: Nazwa, kategoria, cena, ilość, opis, SKU
- **Walidacja danych**: Sprawdzanie wymaganych pól
- **Normalizacja**: Ujednolicenie formatu danych
- **Deduplikacja**: Usuwanie duplikatów produktów

#### 1.4 Obsługa błędów
- **Nieobsługiwane formaty**: Komunikat o błędzie
- **Uszkodzone pliki**: Informacja o problemie z parsowaniem
- **Brak danych**: Ostrzeżenie o pustych plikach
- **Duże pliki**: Informacja o przekroczeniu limitu

### 2. System Reguł

#### 2.1 Typy reguł
- **Reguły budżetowe**:
  - Maksymalna cena produktu
  - Maksymalna cena zestawu
  - Maksymalna cena za sztukę
  - Waluta: PLN (domyślnie)

- **Reguły kategorii**:
  - Kategorie do unikania (blacklist)
  - Kategorie preferowane (whitelist)
  - Kategorie ostrzegające (warning list)

- **Reguły jakościowe**:
  - Minimalna ocena produktu (1-5)
  - Minimalna liczba opinii
  - Wymagane certyfikaty/znaki jakości

#### 2.2 Akcje reguł
- **BLOCK** - Produkt całkowicie wykluczony z analizy
- **WARN** - Produkt z ostrzeżeniem, ale uwzględniony
- **PREFER** - Produkt preferowany (+punkty w ocenie)

#### 2.3 Zarządzanie regułami
- **CRUD Operations**: Tworzenie, edycja, usuwanie reguł
- **Wagi reguł**: Skala 1-10 (10 = najważniejsza)
- **Aktywacja/Deaktywacja**: Włączanie i wyłączanie reguł
- **Predefiniowane szablony**: Gotowe reguły do wyboru
- **Import/Export**: Możliwość zapisania i wczytania reguł

#### 2.4 Walidacja reguł
- **Sprawdzanie konfliktów**: Reguły sprzeczne ze sobą
- **Test reguł**: Możliwość przetestowania na przykładowych danych
- **Podgląd efektów**: Podgląd jak reguła wpływa na produkty

### 3. Analiza Produktów

#### 3.1 Silnik analizy
- **Ocena zgodności**: Punktacja zgodności z regułami (0-100)
- **Status produktu**: OK/Ostrzeżenie/Blokada
- **Rekomendacje**: Automatyczne sugestie działań
- **Ranking**: Sortowanie produktów według oceny

#### 3.2 Algorytm oceniania
- **Podstawowa ocena**: 50 punktów startowych
- **Bonusy**: +punkty za spełnienie preferowanych reguł
- **Kary**: -punkty za ostrzeżenia
- **Blokady**: 0 punktów za zablokowane produkty
- **Wagi**: Mnożenie przez wagę reguły

#### 3.3 Generowanie rekomendacji
- **Automatyczne sugestie**: Na podstawie analizy reguł
- **Powody rekomendacji**: Wyjaśnienie dlaczego dana ocena
- **Akcje**: Konkretne kroki do podjęcia
- **Alternatywy**: Sugestie zamienników produktów

### 4. Dashboard - Główny Widok

#### 4.1 Lista analiz
- **Karty analiz**: Grid layout (3 kolumny na desktop)
- **Informacje na karcie**:
  - Nazwa pliku + data analizy
  - Liczba produktów w zestawie
  - Ogólna ocena zestawu (1-100 punktów)
  - Rekomendacja (ZAKUP/ROZWAŻ/UNIKAJ)
  - Status analizy (ukończona/w toku/błąd)

#### 4.2 Filtry i sortowanie
- **Filtry**:
  - Data analizy (zakres)
  - Rekomendacja (zakup/rozważ/unikaj)
  - Liczba produktów (zakres)
  - Nazwa pliku (wyszukiwanie)

- **Sortowanie**:
  - Data (najnowsze/najstarsze)
  - Ocena (najlepsze/najgorsze)
  - Nazwa pliku (A-Z/Z-A)

#### 4.3 Statystyki
- **Widgety statystyczne**:
  - Łączna liczba przeanalizowanych zestawów
  - Średnia ocena wszystkich zestawów
  - Liczba produktów z ostrzeżeniami (ostatni miesiąc)
  - Najczęściej analizowane kategorie

#### 4.4 Akcje globalne
- **Nowa analiza**: Przycisk do rozpoczęcia nowej analizy
- **Zarządzanie regułami**: Szybki dostęp do reguł
- **Ustawienia**: Dostęp do ustawień aplikacji
- **Eksport wszystkich**: Eksport wszystkich analiz

### 5. Szczegóły Analizy

#### 5.1 Nagłówek analizy
- **Informacje podstawowe**:
  - Nazwa pliku + data analizy
  - Liczba produktów w zestawie
  - Ogólna ocena zestawu
  - Rekomendacja końcowa

- **Akcje**:
  - Przycisk "Eksportuj do PDF"
  - Przycisk "Usuń analizę"
  - Przycisk "Przeanalizuj ponownie"

#### 5.2 Lista produktów
- **Tabela produktów** z kolumnami:
  - Nazwa produktu
  - Kategoria
  - Cena (jeśli dostępna)
  - Ilość
  - Ocena zgodności (0-100)
  - Status (✅ OK / ⚠️ OSTRZEŻENIE / ❌ BLOKADA)
  - Akcje (szczegóły produktu)

#### 5.3 Ranking produktów
- **Top 5 najlepszych produktów**:
  - Nazwa + ocena + powód rekomendacji
- **Top 5 najgorszych produktów**:
  - Nazwa + ocena + powód ostrzeżenia/blokady

#### 5.4 Podsumowanie rekomendacji
- **Sekcja "Dlaczego ta rekomendacja?"**:
  - Lista powodów pozytywnych
  - Lista ostrzeżeń
  - Lista blokad
  - Sugerowane działania

#### 5.5 Szczegóły produktu
- **Modal z szczegółami**:
  - Pełne informacje o produkcie
  - Zastosowane reguły
  - Powody oceny
  - Sugerowane akcje

### 6. Zarządzanie Regułami

#### 6.1 Lista reguł
- **Tabela reguł** z kolumnami:
  - Nazwa reguły
  - Typ (budżet/kategoria/jakość)
  - Akcja (block/warn/prefer)
  - Waga (1-10)
  - Status (aktywna/nieaktywna)
  - Akcje (edytuj/usun/duplikuj)

#### 6.2 Formularz reguły
- **Pola formularza**:
  - Nazwa reguły (wymagane)
  - Typ reguły (dropdown)
  - Warunki (dynamiczne w zależności od typu)
  - Akcja (radio buttons)
  - Waga (slider 1-10)
  - Opis reguły (opcjonalny)

#### 6.3 Predefiniowane reguły
- **Szablony reguł**:
  - "Budżet do 1000 PLN"
  - "Unikaj elektroniki"
  - "Preferuj produkty z oceną > 4.0"
  - "Ostrzeżenie dla produktów bez opinii"

#### 6.4 Testowanie reguł
- **Podgląd efektów**: Jak reguła wpływa na przykładowe produkty
- **Symulacja**: Test reguły na wybranych produktach
- **Raport**: Podsumowanie efektów reguły

### 7. Ustawienia Aplikacji

#### 7.1 Ustawienia ogólne
- **Język**: Polski (domyślnie)
- **Waluta**: PLN (domyślnie)
- **Format daty**: DD.MM.YYYY
- **Format liczb**: Separator tysięcy i dziesiętnych

#### 7.2 Ustawienia analizy
- **Domyślne reguły**: Reguły stosowane automatycznie
- **Limity**: Maksymalne wartości dla analiz
- **Powiadomienia**: Ustawienia powiadomień

#### 7.3 Zarządzanie danymi
- **Eksport danych**: Eksport wszystkich danych
- **Import danych**: Import wcześniej wyeksportowanych danych
- **Czyszczenie**: Usunięcie wszystkich danych
- **Backup**: Automatyczne tworzenie kopii zapasowych

## 🎨 Wymagania niefunkcjonalne

### 1. Performance

#### 1.1 Czas odpowiedzi
- **Upload pliku**: < 2 sekundy dla pliku 1MB
- **Parsowanie**: < 5 sekund dla pliku 1000 produktów
- **Analiza**: < 3 sekundy dla 100 produktów
- **Nawigacja**: < 500ms między stronami

#### 1.2 Throughput
- **Jednoczesne analizy**: Do 5 analiz jednocześnie
- **Rozmiar plików**: Do 10MB na plik
- **Liczba produktów**: Do 5000 produktów na analizę

#### 1.3 Resource Usage
- **Memory**: < 100MB RAM dla aplikacji
- **CPU**: Minimalne użycie CPU w stanie spoczynku
- **Storage**: < 50MB dla aplikacji

### 2. Availability

#### 2.1 Uptime
- **Target**: > 99% uptime
- **Downtime**: < 8 godzin miesięcznie
- **Recovery**: < 1 godzina przy awarii

#### 2.2 Reliability
- **Error Rate**: < 1% błędów
- **Data Loss**: 0% utraty danych
- **Backup**: Codzienne kopie zapasowe

### 3. Usability

#### 3.1 User Experience
- **Learning Curve**: < 5 minut do pierwszej analizy
- **Task Completion**: > 90% użytkowników kończy analizę
- **User Satisfaction**: > 4.5/5 w ocenach

#### 3.2 Accessibility
- **WCAG 2.1 AA**: Zgodność z standardami dostępności
- **Keyboard Navigation**: Pełna obsługa klawiatury
- **Screen Readers**: Obsługa czytników ekranu
- **Color Contrast**: Minimum 4.5:1 ratio

#### 3.3 Internationalization
- **Language**: Polski (domyślnie)
- **Currency**: PLN
- **Date Format**: DD.MM.YYYY
- **Number Format**: Polskie formatowanie liczb

### 4. Security

#### 4.1 Data Security
- **Local Storage**: Wszystkie dane lokalnie
- **No Transmission**: Brak wysyłania danych do serwerów
- **Encryption**: Opcjonalne szyfrowanie wrażliwych danych

#### 4.2 Input Validation
- **File Validation**: Sprawdzanie typu i rozmiaru plików
- **Data Sanitization**: Czyszczenie danych z plików
- **XSS Prevention**: Escapowanie danych w UI

#### 4.3 Privacy
- **No Tracking**: Brak śledzenia użytkowników
- **No Analytics**: Brak zbierania danych analitycznych
- **Data Control**: Pełna kontrola użytkownika nad danymi

### 5. Compatibility

#### 5.1 Browsers
- **Chrome**: Wersja 90+
- **Firefox**: Wersja 88+
- **Safari**: Wersja 14+
- **Edge**: Wersja 90+

#### 5.2 Devices
- **Desktop**: Windows, macOS, Linux
- **Mobile**: iOS 14+, Android 10+
- **Tablet**: iPadOS 14+, Android 10+

#### 5.3 Screen Sizes
- **Mobile**: 320px - 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

### 6. Maintainability

#### 6.1 Code Quality
- **TypeScript**: 100% pokrycie typami
- **ESLint**: Brak błędów lintingu
- **Test Coverage**: > 80% pokrycie testami
- **Documentation**: Kompletna dokumentacja kodu

#### 6.2 Architecture
- **Modularity**: Modularna architektura
- **Reusability**: Reużywalne komponenty
- **Scalability**: Możliwość rozszerzania
- **Performance**: Optymalizacja wydajności

## 📱 Wymagania responsywności

### 1. Mobile (< 640px)

#### 1.1 Layout
- **Single Column**: Pojedyncza kolumna na całej szerokości
- **Bottom Navigation**: Nawigacja na dole ekranu
- **Collapsible Sidebar**: Ukrywalny sidebar
- **Touch Targets**: Minimum 44px dla elementów dotykowych

#### 1.2 Interactions
- **Swipe Gestures**: Przesuwanie między produktami
- **Pull to Refresh**: Odświeżanie przez przeciągnięcie
- **Long Press**: Długie naciśnięcie dla kontekstu
- **Pinch to Zoom**: Powiększanie tabel i wykresów

#### 1.3 Content
- **Condensed Tables**: Skrócone tabele z możliwością rozwinięcia
- **Card Layout**: Karty zamiast tabel
- **Progressive Disclosure**: Stopniowe ujawnianie informacji
- **Bottom Sheets**: Modale jako bottom sheets

### 2. Tablet (640px - 1024px)

#### 2.1 Layout
- **Two Column**: Dwie kolumny dla listy produktów
- **Sidebar**: Ukrywalny sidebar
- **Larger Touch Targets**: Większe elementy dotykowe
- **Grid Layout**: Siatka dla kart analiz

#### 2.2 Interactions
- **Hover Effects**: Efekty hover dla większych ekranów
- **Keyboard Shortcuts**: Skróty klawiszowe
- **Multi-touch**: Obsługa gestów wielodotykowych
- **Drag & Drop**: Przeciąganie plików

### 3. Desktop (> 1024px)

#### 3.1 Layout
- **Three Column**: Trzy kolumny dla dashboard
- **Fixed Sidebar**: Stały sidebar
- **Hover States**: Stany hover dla interakcji
- **Keyboard Navigation**: Pełna obsługa klawiatury

#### 3.2 Interactions
- **Right-click Context**: Menu kontekstowe
- **Keyboard Shortcuts**: Skróty klawiszowe
- **Multi-window**: Obsługa wielu okien
- **Drag & Drop**: Zaawansowane przeciąganie

## 🔮 Wymagania przyszłe (Faza 2)

### 1. Integracje API
- **Allegro API**: Pobieranie cen i opinii
- **Amazon API**: Porównanie cen
- **Google Shopping**: Wyszukiwanie produktów
- **Ceneo API**: Agregacja cen

### 2. Zaawansowane funkcje
- **AI/ML**: Automatyczna kategoryzacja
- **Predictive Analytics**: Predykcja trendów
- **Collaboration**: Współpraca zespołowa
- **Real-time Updates**: Aktualizacje w czasie rzeczywistym

### 3. Export/Import
- **PDF Export**: Eksport raportów do PDF
- **Excel Export**: Eksport danych do Excel
- **JSON Import/Export**: Transfer danych
- **API Integration**: Integracja z zewnętrznymi systemami

### 8. Autentykacja i Użytkownicy

#### 8.1 Integracja z Clerk (FR-AUTH-001)
- **OAuth/SSO**: Logowanie przez Google, GitHub, email
- **Social logins**: Integracja z popularnymi dostawcami OAuth
- **Email verification**: Weryfikacja adresu email przy rejestracji
- **Password reset**: Resetowanie hasła przez email
- **Session management**: Zarządzanie sesjami użytkowników
- **Token refresh**: Automatyczne odświeżanie tokenów

**Implementacja**: 
- `src/main.tsx` - ClerkProvider wrapper
- `@clerk/clerk-react` - SDK Clerk
- Environment variables: `VITE_CLERK_PUBLISHABLE_KEY`

#### 8.2 Strony autentykacji (FR-AUTH-002)
- **Sign In Page**: Dedykowana strona logowania (`/sign-in`)
- **Sign Up Page**: Dedykowana strona rejestracji (`/sign-up`)
- **Clerk Modal**: Alternatywnie modal logowania
- **Redirect handling**: Przekierowanie po zalogowaniu

**Implementacja**:
- `src/pages/SignInPage.tsx`
- `src/pages/SignUpPage.tsx`
- `src/components/landing/LandingHeader.tsx` - CTA buttons

#### 8.3 Protected Routes (FR-AUTH-003)
- **ProtectedRoute component**: Wrapper dla chronionych tras
- **Auth check**: Sprawdzanie czy użytkownik jest zalogowany
- **Redirect**: Przekierowanie niezalogowanych do landing page
- **Loading state**: Wyświetlanie loadera podczas sprawdzania auth

**Implementacja**:
- `src/components/ProtectedRoute.tsx`
- `src/App.tsx` - routing configuration

#### 8.4 Synchronizacja Clerk ↔ Supabase (FR-AUTH-004)
- **Auto user creation**: Automatyczne tworzenie użytkownika w Supabase
- **User ID mapping**: Mapowanie Clerk ID → Supabase ID
- **Profile sync**: Synchronizacja danych profilu (email, nazwa)
- **Metadata storage**: Przechowywanie metadanych użytkownika

**Implementacja**:
- `src/services/clerkSupabaseService.ts`
- `src/hooks/useCurrentUser.ts`
- Tabela `users` w Supabase

#### 8.5 Session Management (FR-AUTH-005)
- **Token handling**: Zarządzanie JWT tokens
- **Auto refresh**: Automatyczne odświeżanie wygasłych tokenów
- **Logout**: Czyszczenie sesji przy wylogowaniu
- **Multi-device**: Obsługa sesji na wielu urządzeniach

### 9. Backend i Baza Danych (Supabase)

#### 9.1 Integracja z Supabase (FR-DB-001)
- **PostgreSQL Database**: Relacyjna baza danych w chmurze
- **Supabase Client**: JavaScript client dla komunikacji z API
- **Environment Config**: Konfiguracja przez zmienne środowiskowe
- **Connection pooling**: Optymalizacja połączeń z bazą

**Implementacja**:
- `src/lib/supabase.ts` - konfiguracja client
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

#### 9.2 Row Level Security (FR-DB-002)
- **RLS Policies**: Polityki bezpieczeństwa na poziomie wierszy
- **User isolation**: Użytkownik widzi TYLKO swoje dane
- **Automatic filtering**: PostgreSQL automatycznie filtruje wyniki
- **Security by default**: Bezpieczeństwo na poziomie bazy danych

**Tabele z RLS**:
- `users` - własny profil
- `analyses` - własne analizy
- `products` - produkty z własnych analiz
- `rules` - własne reguły

**SQL Policies**:
```sql
-- Przykład: użytkownik widzi tylko swoje analizy
CREATE POLICY "Users can view own analyses"
  ON analyses FOR SELECT
  USING (auth.uid() = user_id);
```

#### 9.3 Real-time Synchronization (FR-DB-003)
- **Supabase Realtime**: WebSocket connection dla live updates
- **Subscribe to changes**: Nasłuchiwanie zmian w bazie
- **Optimistic updates**: Natychmiastowa aktualizacja UI przed potwierdzeniem
- **Conflict resolution**: Rozwiązywanie konfliktów przy jednoczesnych edycjach

**Implementacja**:
- `src/stores/analysisStoreSupabase.ts` - real-time subscriptions
- Supabase realtime channels

#### 9.4 Struktura Bazy Danych (FR-DB-005)

**Tabela: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: analyses**
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_name TEXT,
  status TEXT DEFAULT 'pending',
  total_products INTEGER DEFAULT 0,
  products_ok INTEGER DEFAULT 0,
  products_warning INTEGER DEFAULT 0,
  products_blocked INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  price DECIMAL(10,2),
  quantity INTEGER,
  score INTEGER DEFAULT 50,
  status TEXT DEFAULT 'pending',
  evaluation_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: rules**
```sql
CREATE TABLE rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  weight INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT TRUE,
  conditions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tabela: rule_templates**
```sql
CREATE TABLE rule_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  weight INTEGER DEFAULT 5,
  conditions JSONB,
  is_global BOOLEAN DEFAULT TRUE
);
```

#### 9.5 Triggers i Automatyzacja (FR-DB-006)
- **Auto-update timestamps**: Automatyczna aktualizacja `updated_at`
- **Statistics calculation**: Przeliczanie statystyk analiz
- **Cascade operations**: Kaskadowe usuwanie powiązanych danych
- **Audit logging**: Logowanie zmian w kluczowych tabelach

**Przykład trigger**:
```sql
-- Auto-update analysis stats when product changes
CREATE TRIGGER update_analysis_stats
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_analysis_stats();
```

#### 9.6 Soft Delete (FR-DB-007)
- **Soft delete flag**: Kolumna `deleted_at` zamiast fizycznego usuwania
- **Recovery**: Możliwość przywrócenia usuniętych danych
- **Audit trail**: Zachowanie historii usunięć
- **Automatic cleanup**: Okresowe czyszczenie starych soft-deleted records

### 10. Landing Page

#### 10.1 Marketing Site (FR-LP-001)
- **Public access**: Dostępna bez logowania
- **SEO optimized**: Meta tags, semantic HTML
- **Fast loading**: Optymalizacja wydajności
- **Responsive design**: Pełna responsywność mobile/tablet/desktop

**Implementacja**:
- `src/pages/LandingPage.tsx`
- Route: `/` (root) i `/paleta` (GitHub Pages)

#### 10.2 Hero Section (FR-LP-002)
- **Compelling headline**: Przyciągający nagłówek
- **Value proposition**: Jasna wartość dla użytkownika
- **CTA buttons**: "Wypróbuj za darmo", "Zaloguj się"
- **Visual preview**: Dashboard preview z animowanym wykresem
- **Animated elements**: Framer Motion animations
- **User avatars**: 5 avatarów użytkowników (social proof)

**Implementacja**:
- `src/components/landing/HeroSection.tsx`
- `src/components/landing/DashboardPreview.tsx`

#### 10.3 Features Showcase (FR-LP-003)
- **6+ feature cards**: Kluczowe funkcjonalności
- **Icons**: Lucide React icons
- **Descriptions**: Krótkie opisy każdej funkcji
- **Visual mockups**: SVG mockups dla każdej feature
- **Hover animations**: Efekty hover na kartach

**Features**:
1. Upload i analiza plików
2. AI-powered insights
3. Market price analysis
4. Custom rules engine
5. Real-time collaboration
6. Advanced reporting

**Implementacja**:
- `src/components/landing/FeaturesSection.tsx`
- `src/components/landing/FeatureCard.tsx`

#### 10.4 How It Works (FR-LP-004)
- **3-4 step process**: Prosty proces użytkowania
- **Visual flow**: Wizualizacja kroków
- **Numbered steps**: Ponumerowane kroki
- **Icons and descriptions**: Ikony i opisy każdego kroku

**Steps**:
1. Upload pliku Excel/CSV
2. AI automatycznie analizuje produkty
3. Otrzymaj szczegółowy raport
4. Podejmij decyzję o zakupie

**Implementacja**:
- `src/components/landing/HowItWorksSection.tsx`

#### 10.5 Pricing Section (FR-LP-005)
- **3 pricing tiers**: Free, Pro, Enterprise
- **Feature comparison**: Porównanie funkcjonalności
- **Pricing cards**: Karty z cenami
- **CTA buttons**: Przyciski akcji dla każdego planu
- **Highlight popular**: Oznaczenie najpopularniejszego planu

**Plans**:
- **Free**: 5 analiz/miesiąc, podstawowe funkcje
- **Pro**: Unlimited analizy, advanced AI, priority support
- **Enterprise**: Custom limits, API access, dedicated support

**Implementacja**:
- `src/components/landing/PricingSection.tsx`
- `src/components/landing/PricingCard.tsx`

#### 10.6 Testimonials (FR-LP-006)
- **Customer reviews**: Opinie klientów
- **Avatars**: Zdjęcia/awatary klientów
- **Company names**: Nazwy firm
- **Star ratings**: Oceny gwiazdkowe
- **Carousel**: Slider z opiniami (opcjonalnie)

**Implementacja**:
- `src/components/landing/TestimonialsSection.tsx`

#### 10.7 Footer (FR-LP-007)
- **Navigation links**: Linki do kluczowych sekcji
- **Social media**: Linki do social media
- **Legal**: Privacy Policy, Terms of Service
- **Contact**: Email, formularz kontaktowy
- **Newsletter**: Subskrypcja newslettera

**Implementacja**:
- `src/components/landing/Footer.tsx`

#### 10.8 Animations (FR-LP-009)
- **Framer Motion**: Biblioteka animacji
- **Scroll animations**: Animacje przy scrollowaniu
- **Entrance animations**: Fade in, slide up
- **Hover effects**: Interaktywne efekty hover
- **Smooth transitions**: Płynne przejścia

**Implementacja**:
- `framer-motion` library
- `motion.*` components w każdej sekcji

#### 10.9 Gradienty Dekoracyjne (FR-LP-010)
- **20+ blob gradients**: Dekoracyjne gradienty w tle
- **Strategic placement**: Rozmieszczone w kluczowych sekcjach
- **Color palette**: Blue/Purple theme (zgodny z brand)
- **Subtle opacity**: Niska opacité dla subtelności
- **Responsive sizing**: Różne rozmiary dla mobile/desktop

**Sekcje z gradientami**:
- Hero (3 gradienty)
- About (3 gradienty)
- Benefits (3 gradienty)
- How It Works (3 gradienty)
- Features (3 gradienty)
- Testimonials (3 gradienty)
- Pricing (4 gradienty - największe!)
- CTA (4 gradienty)

### 11. Market Prices Analysis

#### 11.1 Price Collection (FR-MP-001)
- **AI Service integration**: Połączenie z backend AI (port 8000)
- **Multiple sources**: Allegro, Amazon, Ceneo APIs
- **Batch processing**: Zbieranie cen dla wielu produktów
- **Rate limiting**: Respektowanie limitów API
- **Error handling**: Graceful handling błędów API

**API Endpoint**:
```typescript
POST /ai/collect-prices
{
  "products": ["Product 1", "Product 2"],
  "max_results_per_product": 5
}

Response: {
  "price_data": {
    "Product 1": [
      {
        "product_name": "Product 1",
        "price": 99.99,
        "currency": "PLN",
        "source": "Allegro",
        "url": "https://...",
        "timestamp": "2025-01-18T10:00:00Z",
        "condition": "new",
        "seller_rating": 4.8,
        "availability": true
      }
    ]
  }
}
```

**Implementacja**:
- `src/components/MarketPrices.tsx`
- `ai-services/services/price_collector.py`

#### 11.2 Price Analysis (FR-MP-002)
- **Statistical analysis**: Mediana, średnia, zakres
- **Outlier filtering**: Usuwanie wartości odstających (IQR method)
- **Confidence intervals**: Przedziały ufności dla cen
- **Sample size**: Minimalna liczba próbek dla wiarygodności

**API Endpoint**:
```typescript
POST /ai/analyze-prices
{
  "product_name": "Product 1",
  "prices": [/* price data */]
}

Response: {
  "median_price": 99.99,
  "average_price": 102.50,
  "price_range": 40.00,
  "market_volatility": 0.15,
  "confidence_score": 0.85,
  "data_quality": "good"
}
```

**Implementacja**:
- `ai-services/services/price_analyzer.py`

#### 11.3 Market Volatility (FR-MP-003)
- **Volatility score**: Wskaźnik zmienności cen (0-1)
- **Standard deviation**: Odchylenie standardowe cen
- **Coefficient of variation**: CV dla porównywalności
- **Risk assessment**: Ocena ryzyka inwestycji

**Interpretation**:
- `< 0.1`: Niska zmienność (stabilny rynek)
- `0.1 - 0.3`: Średnia zmienność
- `> 0.3`: Wysoka zmienność (ryzyko)

#### 11.4 Trend Detection (FR-MP-004)
- **Trend analysis**: Wykrywanie trendu (rising/falling/stable)
- **Time series**: Analiza cen w czasie
- **Moving averages**: Średnie kroczące
- **Momentum indicators**: Wskaźniki momentum

**Trends**:
- `rising`: Ceny rosną 📈 (czerwony - wait)
- `falling`: Ceny spadają 📉 (zielony - buy now)
- `stable`: Ceny stabilne → (szary - neutral)

#### 11.5 Confidence Score (FR-MP-005)
- **Data quality metrics**: Ocena jakości danych
- **Sample size**: Liczba próbek cenowych
- **Source diversity**: Różnorodność źródeł
- **Data freshness**: Świeżość danych

**Score calculation**:
```javascript
confidence = (
  sample_size_score * 0.4 +
  source_diversity_score * 0.3 +
  freshness_score * 0.2 +
  outlier_ratio_score * 0.1
)
```

**Levels**:
- `0.8-1.0`: Excellent - wysokie zaufanie
- `0.6-0.8`: Good - dobre dane
- `0.4-0.6`: Fair - wystarczające
- `< 0.4`: Poor - niepewne dane

#### 11.6 Recommendations (FR-MP-006)
- **Buy/Sell/Hold signals**: Sygnały inwestycyjne
- **Price comparison**: Porównanie z medianą rynkową
- **Best deal detection**: Wykrywanie najlepszych ofert
- **Risk warnings**: Ostrzeżenia o ryzyku

**Recommendation types**:
- "Doskonała cena - 15% poniżej mediany!"
- "Cena w górnej połowie zakresu - rozważ negocjację"
- "Wysoka zmienność - wyższe ryzyko cenowe"
- "Mało danych - zweryfikuj ceny ręcznie"

#### 11.7 Multi-source Integration (FR-MP-007)
- **Allegro API**: Polski marketplace
- **Amazon API**: Międzynarodowe ceny
- **Ceneo API**: Agregator cenowy
- **Web scraping**: Fallback dla stron bez API

**Implementation**:
```python
class PriceCollector:
    def collect_from_allegro(self, query: str) -> List[Price]
    def collect_from_amazon(self, query: str) -> List[Price]
    def collect_from_ceneo(self, query: str) -> List[Price]
    def collect_from_all(self, query: str) -> List[Price]
```

#### 11.8 Real-time Refresh (FR-MP-008)
- **Manual refresh**: Przycisk "Refresh" dla aktualizacji
- **Auto-refresh**: Opcjonalna automatyczna aktualizacja (15 min)
- **Cache management**: Cache z TTL dla optymalizacji
- **Background updates**: Aktualizacje w tle bez blokowania UI

### 12. Hybrid AI Service

#### 12.1 Multi-modal Architecture (FR-AI-001)
System Hybrid AI wspiera 3 tryby działania:

**1. Cloud AI** (Production)
- Endpoint: `https://api.pallet-analysis.com/v1`
- Priority: 1 (najwyższy)
- Use case: Production deployment
- Features: Pełna funkcjonalność AI, najlepsza wydajność
- Cost: Pay-per-use
- Status: ❌ Wyłączony (API nie istnieje jeszcze)

**2. Browser AI** (Offline)
- Technology: WebAssembly (WASM)
- Priority: 2
- Use case: Offline mode, privacy-focused
- Features: Podstawowa analiza, działa bez internetu
- Cost: Free
- Status: 🚧 W rozwoju (fallback to mock)

**3. Docker AI** (Local Development)
- Endpoint: `http://localhost:8000`
- Priority: 3
- Use case: Local development, self-hosted
- Features: Pełna funkcjonalność, kontrola nad danymi
- Cost: Infrastructure only
- Status: ✅ Aktywny (Python FastAPI backend)

**Implementacja**:
- `src/services/hybridAIService.ts` - główna klasa
- `ai-services/` - Docker backend (Python)

#### 12.2 Auto-selection (FR-AI-002)
- **Availability check**: Sprawdzanie dostępności każdego serwisu
- **Priority-based**: Wybór według priorytetu
- **Automatic fallback**: Przełączanie przy niedostępności
- **User override**: Możliwość ręcznego wyboru

**Selection algorithm**:
```typescript
1. Check all services health (parallel)
2. Filter enabled & online services
3. Sort by priority (ascending)
4. Select first available
5. If none available → fallback to mock
```

#### 12.3 Health Checks (FR-AI-003)
- **Periodic checks**: Co 5 minut
- **On-demand checks**: Ręczne sprawdzenie
- **Timeout handling**: 5s timeout dla każdego check
- **Status tracking**: Online/Offline/Checking/Error

**Health check endpoints**:
- Cloud: `GET /health`
- Browser: Check WebAssembly availability
- Docker: `GET /health`

**Implementacja**:
```typescript
async checkAllServices(): Promise<HybridAIStatus> {
  const checks = await Promise.allSettled([
    this.checkCloudService(),
    this.checkBrowserService(),
    this.checkDockerService()
  ])
  
  return {
    cloud: checks[0].status === 'fulfilled' ? 'online' : 'offline',
    browser: checks[1].status === 'fulfilled' ? 'online' : 'offline',
    docker: checks[2].status === 'fulfilled' ? 'online' : 'offline',
    active: this.currentService,
    lastChecked: new Date().toISOString()
  }
}
```

#### 12.4 Fallback Mechanisms (FR-AI-004)
Hierarchia fallback:
1. **Primary service** (wybrany przez użytkownika lub auto)
2. **Next available** (kolejny enabled service)
3. **Mock service** (zawsze dostępny, zwraca przykładowe dane)

**Fallback scenarios**:
- Network error → next service
- Timeout → next service
- Invalid response → next service
- All services down → mock service

#### 12.5 Configuration Management (FR-AI-005)
- **localStorage persistence**: Zapisywanie konfiguracji w przeglądarce
- **Per-service config**: Osobne ustawienia dla każdego serwisu
- **API keys**: Bezpieczne przechowywanie kluczy API
- **Custom endpoints**: Możliwość konfiguracji custom URL

**Configuration object**:
```typescript
interface AIServiceConfig {
  type: 'cloud' | 'browser' | 'docker'
  url?: string
  apiKey?: string
  priority: number
  enabled: boolean
}
```

**Storage**:
```typescript
localStorage.setItem('ai-service-preferences', JSON.stringify({
  activeService: 'docker',
  configs: {
    cloud: { /* ... */ },
    browser: { /* ... */ },
    docker: { /* ... */ }
  }
}))
```

#### 12.6 User Preferences (FR-AI-006)
- **Manual service selection**: Wybór preferowanego serwisu
- **Auto-selection toggle**: Włącz/wyłącz auto-selection
- **Service priority**: Zmiana priorytetów serwisów
- **Performance preferences**: Trade-off: speed vs accuracy

**UI Components**:
- Settings page → AI Service section
- Service status indicators
- Manual override switches
- Performance metrics display

#### 12.7 Browser AI / WebAssembly (FR-AI-007)
- **Offline capability**: Działa bez internetu
- **Privacy-first**: Dane nie opuszczają przeglądarki
- **WASM modules**: Skompilowane modele AI
- **Progressive loading**: Ładowanie modeli on-demand

**Planned features**:
- Product normalization (basic)
- Category classification
- Simple scoring algorithm
- Local caching

**Status**: 🚧 W rozwoju (obecnie fallback to mock)

#### 12.8 Cloud AI (FR-AI-008)
- **Managed service**: W pełni zarządzany przez zespół
- **Scalability**: Auto-scaling based on load
- **Global CDN**: Niska latencja na całym świecie
- **Advanced models**: Najnowsze modele AI/ML

**Planned features**:
- Advanced NLP for product recognition
- Image recognition for product photos
- Predictive analytics
- Real-time market trends

**Status**: ❌ Wyłączony (API w planach)

#### 12.9 Docker AI (FR-AI-009)
- **Self-hosted**: Uruchamiany lokalnie
- **Full control**: Pełna kontrola nad danymi i modelami
- **Development**: Idealny do developmentu
- **Open source**: Kod dostępny w repo

**Tech stack**:
- Python 3.9+
- FastAPI framework
- spaCy NLP models
- pandas for data processing

**Endpoints**:
- `POST /ai/normalize-product` - normalizacja nazw produktów
- `POST /ai/analyze-palette` - analiza zestawu produktów
- `POST /ai/generate-report` - generowanie raportu AI
- `POST /ai/collect-prices` - zbieranie cen rynkowych
- `POST /ai/analyze-prices` - analiza cen

**Status**: ✅ Aktywny

### 13. Zarządzanie Produktami (Advanced)

#### 13.1 Dedicated Products Table (FR-PROD-001)
- **Separate table**: Osobna tabela `products` w Supabase
- **Rich data model**: Wszystkie pola z parsera + dodatkowe
- **Relational**: Foreign keys do `analyses` i `users`
- **Indexed**: Indeksy dla szybkich zapytań
- **RLS protected**: Row Level Security

**Benefits**:
- ⚡ Szybsze zapytania (indeksy)
- 🔍 Zaawansowane filtrowanie i sortowanie
- 📊 Agregacje i statystyki (SQL)
- 🔗 Relacje między tabelami
- 🔒 RLS security

**Implementacja**:
- `src/services/supabaseProductsService.ts`
- `CREATE_PRODUCTS_TABLE.sql`

#### 13.2 Product Details Page (FR-PROD-002)
- **Detailed view**: Szczegółowy widok pojedynczego produktu
- **All fields**: Wyświetlanie wszystkich danych produktu
- **Edit capability**: Możliwość edycji (w przyszłości)
- **Market prices**: Integracja z market prices
- **Related products**: Podobne produkty

**URL**: `/analysis/:analysisId/product/:productIndex`

**Sections**:
- Basic info (nazwa, kategoria, cena)
- Identyfikatory (EAN, SKU, Brand)
- Pallet-specific fields (paleta_id, foto, codes)
- Evaluation (score, status, rules applied)
- Market prices (current market data)
- Actions (edit, delete, add to rules)

**Implementacja**:
- `src/pages/ProductDetailPage.tsx`

#### 13.3 Market Prices Integration (FR-PROD-003)
- **Live prices**: Pobieranie aktualnych cen rynkowych
- **Price history**: Historia cen produktu (planowane)
- **Comparison**: Porównanie ceny produktu z medianą
- **Alerts**: Powiadomienia o zmianach cen (planowane)

#### 13.4 Category Mapping Service (FR-PROD-004)
- **Auto-mapping**: Automatyczne mapowanie kategorii
- **Normalization**: Normalizacja nazw kategorii
- **Hierarchy**: Obsługa hierarchii kategorii
- **Custom mapping**: Możliwość custom mapowania

**Implementacja**:
```typescript
class CategoryMapperService {
  mapCategory(rawCategory: string): string {
    // "NARZĘDZIA / ELEKTRONARZĘDZIA" → "Elektronarzędzia"
    return this.normalizeAndMap(rawCategory)
  }
  
  getCategoryHierarchy(category: string): string[] {
    // "Elektronarzędzia" → ["Narzędzia", "Elektronarzędzia"]
  }
}
```

**Implementacja**:
- `src/services/categoryMapperService.ts`

#### 13.5 Image Service (FR-PROD-005)
- **Image URLs**: Obsługa URL-i zdjęć produktów
- **Placeholder images**: Domyślne obrazy gdy brak zdjęcia
- **Image optimization**: Optymalizacja rozmiaru i quality
- **Lazy loading**: Ładowanie obrazów on-demand

**Implementacja**:
- `src/services/imageService.ts`
- `src/assets/images/placeholder-user.tsx`

#### 13.6 Product Search & Filtering (FR-PROD-006)
- **Text search**: Wyszukiwanie po nazwie, kategorii, opisie
- **Category filter**: Filtrowanie po kategoriach
- **Status filter**: Filtrowanie po statusie (OK/Warning/Blocked)
- **Price range**: Filtrowanie po zakresie cen
- **Multi-select**: Wybór wielu filtrów jednocześnie

**Search algorithm**:
- Full-text search w PostgreSQL
- Debouncing (300ms) dla lepszej wydajności
- Case-insensitive
- Accent-insensitive (ą → a)

#### 13.7 Product Sorting (FR-PROD-007)
- **Sort by name**: Alfabetycznie A-Z / Z-A
- **Sort by price**: Od najtańszych / najdroższych
- **Sort by category**: Alfabetycznie po kategorii
- **Sort by score**: Od najlepszych / najgorszych ocen
- **Sort by date**: Najnowsze / najstarsze

**Implementation**:
```typescript
const sortOptions = [
  { value: 'name-asc', label: 'Nazwa (A-Z)' },
  { value: 'name-desc', label: 'Nazwa (Z-A)' },
  { value: 'price-asc', label: 'Cena (rosnąco)' },
  { value: 'price-desc', label: 'Cena (malejąco)' },
  { value: 'score-desc', label: 'Ocena (najlepsze)' },
  { value: 'score-asc', label: 'Ocena (najgorsze)' }
]
```

#### 13.8 Bulk Operations (FR-PROD-008)
- **Select multiple**: Zaznaczanie wielu produktów
- **Bulk delete**: Usuwanie wielu produktów
- **Bulk status change**: Zmiana statusu wielu produktów
- **Bulk add to rules**: Dodawanie wielu produktów do reguł
- **Export selected**: Eksport wybranych produktów

**Planned features**:
- Bulk edit (mass update fields)
- Bulk assign category
- Bulk price update

### 14. Help & Support

#### 14.1 Help Page (FR-HELP-001)
- **FAQ section**: Najczęściej zadawane pytania
- **Search**: Wyszukiwanie w dokumentacji
- **Categories**: Kategorie pomocy (Getting Started, Features, Troubleshooting)
- **Quick links**: Szybkie linki do kluczowych tematów

**Content sections**:
- Jak zacząć?
- Upload i parsowanie plików
- Tworzenie i zarządzanie regułami
- Interpretacja wyników analizy
- Rozwiązywanie problemów

**Implementacja**:
- `src/pages/HelpPage.tsx`

#### 14.2 About Page (FR-HELP-002)
- **Company info**: Informacje o firmie/produkcie
- **Mission & Vision**: Misja i wizja projektu
- **Team**: Informacje o zespole (opcjonalnie)
- **Technology stack**: Użyte technologie
- **Contact**: Dane kontaktowe

**Implementacja**:
- `src/pages/AboutPage.tsx`

#### 14.3 User Guides (FR-HELP-003)
- **Step-by-step tutorials**: Tutoriale krok po kroku
- **Screenshots**: Zrzuty ekranu dla lepszego zrozumienia
- **Video tutorials**: Wideo tutorials (planowane)
- **Best practices**: Dobre praktyki użytkowania

**Guides**:
1. First Analysis Guide - pierwsza analiza
2. Custom Rules Guide - tworzenie własnych reguł
3. Market Prices Guide - używanie analizy cen
4. Advanced Features - zaawansowane funkcje

#### 14.4 Troubleshooting (FR-HELP-004)
- **Common issues**: Najczęstsze problemy i rozwiązania
- **Error messages**: Wyjaśnienia komunikatów błędów
- **Debug mode**: Tryb debugowania dla zaawansowanych
- **Contact support**: Formularz kontaktu do supportu

**Common issues**:
- "File upload failed" → sprawdź format i rozmiar
- "Analysis stuck" → odśwież stronę, sprawdź połączenie
- "No prices found" → sprawdź AI service status
- "Can't login" → sprawdź Clerk configuration

---

## 🔄 Aktualizacje Istniejących Sekcji

### Aktualizacja Sekcji 3: Analiza Produktów

#### 3.4 AI Report Generation (NEW)
- **Natural language reports**: Raporty w języku naturalnym
- **Summary generation**: Automatyczne podsumowania
- **Product analysis**: Szczegółowa analiza każdego produktu
- **Recommendations**: Rekomendacje zakupowe z uzasadnieniem
- **Buy decision**: STRONG_BUY / BUY / HOLD / CAUTION / AVOID
- **Confidence score**: Ocena pewności rekomendacji

**Report structure**:
```typescript
{
  summary: string // Ogólne podsumowanie palety
  productAnalysis: string // Analiza produktów
  recommendations: string // Rekomendacje
  buyDecision: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'CAUTION' | 'AVOID'
  confidenceScore: number // 0-100
}
```

**API Endpoint**:
```typescript
POST /ai/generate-report
{
  "products": [/* analyzed products */]
}
```

**Implementacja**:
- `src/services/hybridAIService.ts` - report generation methods
- `ai-services/` - backend AI logic

### Aktualizacja Sekcji 6: Zarządzanie Regułami

#### 6.5 Supabase Integration (NEW)
- **Cloud storage**: Reguły przechowywane w Supabase
- **Real-time sync**: Synchronizacja między urządzeniami
- **User isolation**: Każdy użytkownik ma swoje reguły
- **Global templates**: Globalne szablony reguł dla wszystkich

**Tables**:
- `rules` - reguły użytkownika (per-user)
- `rule_templates` - globalne szablony (shared)

**Implementacja**:
- `src/services/supabaseRulesService.ts`
- `src/stores/rulesStoreSupabase.ts`

### Aktualizacja Sekcji Performance

#### 1.4 Cache Management (NEW)
- **AI response caching**: Cache dla odpowiedzi AI (localStorage)
- **TTL (Time To Live)**: Automatyczne wygasanie cache (1 godzina)
- **Cache invalidation**: Ręczne czyszczenie cache
- **Smart caching**: Cache tylko dla kosztownych operacji

**Cached operations**:
- Product normalization (24h TTL)
- Market prices (1h TTL)
- Palette analysis (6h TTL)

#### 1.5 Lazy Loading (NEW)
- **Route-based code splitting**: Split po route'ach
- **Component lazy loading**: Ładowanie komponentów on-demand
- **Image lazy loading**: Ładowanie obrazów przy wejściu w viewport
- **Data pagination**: Paginacja dla długich list

**Implementation**:
```typescript
// Route lazy loading
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Analysis = React.lazy(() => import('./pages/Analysis'))
```

### Aktualizacja Sekcji Security

#### 4.4 Row Level Security (NEW)
- **Database-level security**: Bezpieczeństwo na poziomie bazy
- **Automatic enforcement**: PostgreSQL automatycznie wymusza RLS
- **Zero-trust model**: Nigdy nie ufaj, zawsze weryfikuj
- **Multi-tenant isolation**: Pełna izolacja danych między użytkownikami

**RLS Policies**:
```sql
-- Users can only see their own data
CREATE POLICY "Users own data only" ON analyses
  FOR ALL USING (auth.uid() = user_id);

-- Users can only insert with their user_id
CREATE POLICY "Users insert own data" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

#### 4.5 Clerk Authentication (NEW)
- **Industry-standard auth**: Clerk jako zaufany provider
- **OAuth 2.0**: Standard OAuth dla social logins
- **JWT tokens**: Signed JSON Web Tokens
- **Session security**: Secure session management
- **CSRF protection**: Built-in CSRF protection

**Security features**:
- Email verification required
- Password strength requirements
- Rate limiting on login
- Suspicious activity detection
- Multi-factor authentication (MFA) ready

---

*Wymagania zaktualizowane: Styczeń 2025*  
*Wersja: 2.0*  
*Ostatnia aktualizacja: 18.01.2025*
