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

---

*Wymagania utworzone: Styczeń 2025*  
*Wersja: 1.0*
