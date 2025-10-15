# Plan Testów - Etap 4: Dashboard i Szczegóły

> Plan testów dla funkcjonalności dashboard i zarządzania analizami

## 🎯 Zakres testów

**Etap**: 4 - Dashboard i Szczegóły  
**Tygodnie**: 7-8  
**Data**: Styczeń 2025  
**Status**: Gotowy do testów

## 📋 Przegląd funkcjonalności

### Zaimplementowane funkcje:
1. **System analiz** - pełny cykl życia analizy
2. **Dashboard** - statystyki i przegląd
3. **Lista analiz** - filtrowanie i sortowanie
4. **Szczegóły analizy** - kompletne informacje
5. **Eksport wyników** - JSON, CSV, XLSX, PDF
6. **Zarządzanie plikami** - w kontekście analiz
7. **Statystyki** - cenowe, kategorii, reguł

## 🧪 Plan testów

### 1. Testy funkcjonalne

#### 1.1 System analiz
**Cel**: Sprawdzenie pełnego cyklu życia analizy

**Testy**:
- [ ] **TC001**: Tworzenie nowej analizy
  - **Oczekiwany efekt**: Analiza zostaje utworzona z unikalnym ID, domyślnym statusem "pending"
  - **Kroki**: Kliknij "Nowa analiza" w dashboard
  - **Weryfikacja**: Analiza pojawia się na liście z statusem "Oczekująca"

- [ ] **TC002**: Aktualizacja analizy
  - **Oczekiwany efekt**: Zmiany są zapisywane i widoczne w interfejsie
  - **Kroki**: Edytuj nazwę/opis analizy
  - **Weryfikacja**: Zmiany są widoczne w liście i szczegółach

- [ ] **TC003**: Usuwanie analizy
  - **Oczekiwany efekt**: Analiza zostaje usunięta z systemu
  - **Kroki**: Usuń analizę z potwierdzeniem
  - **Weryfikacja**: Analiza znika z listy, statystyki się aktualizują

- [ ] **TC004**: Duplikowanie analizy
  - **Oczekiwany efekt**: Nowa analiza z kopią danych i nazwą "(kopia)"
  - **Kroki**: Duplikuj istniejącą analizę
  - **Weryfikacja**: Nowa analiza z kopią danych

#### 1.2 Dashboard
**Cel**: Sprawdzenie wyświetlania statystyk i trendów

**Testy**:
- [ ] **TC005**: Wyświetlanie statystyk
  - **Oczekiwany efekt**: Poprawne liczby analiz, produktów, reguł
  - **Kroki**: Otwórz dashboard
  - **Weryfikacja**: Statystyki odpowiadają rzeczywistym danym

- [ ] **TC006**: Trendy analiz
  - **Oczekiwany efekt**: Poprawne obliczenia trendów 7/30 dni
  - **Kroki**: Sprawdź sekcję "Trendy analiz"
  - **Weryfikacja**: Liczby odpowiadają rzeczywistym danym

- [ ] **TC007**: Top kategorie
  - **Oczekiwany efekt**: Lista najpopularniejszych kategorii z procentami
  - **Kroki**: Sprawdź sekcję "Najpopularniejsze kategorie"
  - **Weryfikacja**: Kategorie posortowane malejąco, poprawne procenty

- [ ] **TC008**: Szybkie akcje
  - **Oczekiwany efekt**: Przyciski prowadzą do odpowiednich sekcji
  - **Kroki**: Kliknij każdy przycisk szybkiej akcji
  - **Weryfikacja**: Przekierowanie do właściwej funkcji

#### 1.3 Lista analiz
**Cel**: Sprawdzenie filtrowania, sortowania i wyświetlania

**Testy**:
- [ ] **TC009**: Filtrowanie po statusie
  - **Oczekiwany efekt**: Lista pokazuje tylko analizy z wybranym statusem
  - **Kroki**: Wybierz filtr statusu (np. "Zakończone")
  - **Weryfikacja**: Tylko analizy z tym statusem są widoczne

- [ ] **TC010**: Filtrowanie po typie
  - **Oczekiwany efekt**: Lista pokazuje tylko analizy wybranego typu
  - **Kroki**: Wybierz filtr typu (np. "Upload plików")
  - **Weryfikacja**: Tylko analizy tego typu są widoczne

- [ ] **TC011**: Wyszukiwanie
  - **Oczekiwany efekt**: Lista pokazuje analizy zawierające wyszukiwany tekst
  - **Kroki**: Wpisz tekst w polu wyszukiwania
  - **Weryfikacja**: Tylko pasujące analizy są widoczne

- [ ] **TC012**: Sortowanie
  - **Oczekiwany efekt**: Lista jest posortowana według wybranego kryterium
  - **Kroki**: Wybierz sortowanie (np. "Data utworzenia")
  - **Weryfikacja**: Analizy są posortowane poprawnie

- [ ] **TC013**: Brak wyników
  - **Oczekiwany efekt**: Komunikat o braku analiz spełniających kryteria
  - **Kroki**: Ustaw filtry, które nie zwrócą wyników
  - **Weryfikacja**: Wyświetla się komunikat "Brak analiz spełniających kryteria"

#### 1.4 Szczegóły analizy
**Cel**: Sprawdzenie wyświetlania kompletnych informacji

**Testy**:
- [ ] **TC014**: Podstawowe informacje
  - **Oczekiwany efekt**: Wszystkie dane analizy są wyświetlone
  - **Kroki**: Otwórz szczegóły analizy
  - **Weryfikacja**: ID, nazwa, typ, status, daty są widoczne

- [ ] **TC015**: Statystyki cenowe
  - **Oczekiwany efekt**: Poprawne obliczenia min/max/średnia/mediana
  - **Kroki**: Sprawdź sekcję "Statystyki cenowe"
  - **Weryfikacja**: Liczby odpowiadają rzeczywistym danym

- [ ] **TC016**: Lista plików
  - **Oczekiwany efekt**: Wszystkie pliki z statusem i metadanymi
  - **Kroki**: Sprawdź sekcję "Pliki"
  - **Weryfikacja**: Pliki z nazwą, rozmiarem, statusem

- [ ] **TC017**: Kategorie produktów
  - **Oczekiwany efekt**: Lista kategorii z liczbą produktów
  - **Kroki**: Sprawdź sekcję "Kategorie produktów"
  - **Weryfikacja**: Kategorie z poprawnymi liczbami i paskami postępu

- [ ] **TC018**: Tagi i notatki
  - **Oczekiwany efekt**: Tagi i notatki są wyświetlone
  - **Kroki**: Sprawdź sekcje "Tagi" i "Notatki"
  - **Weryfikacja**: Tagi jako badge'y, notatki jako tekst

- [ ] **TC019**: Produkty w tabeli
  - **Oczekiwany efekt**: Tabela z wszystkimi produktami
  - **Kroki**: Sprawdź sekcję "Produkty"
  - **Weryfikacja**: DataTable z produktami, sortowaniem, filtrowaniem

- [ ] **TC020**: Rekomendacje
  - **Oczekiwany efekt**: Lista rekomendacji z priorytetami
  - **Kroki**: Sprawdź sekcję "Rekomendacje"
  - **Weryfikacja**: Rekomendacje z ikonami, kolorami, opisami

#### 1.5 Eksport wyników
**Cel**: Sprawdzenie eksportu w różnych formatach

**Testy**:
- [ ] **TC021**: Eksport JSON
  - **Oczekiwany efekt**: Plik JSON z danymi analizy
  - **Kroki**: Wybierz format JSON i eksportuj
  - **Weryfikacja**: Plik zostaje pobrany, zawiera poprawne dane

- [ ] **TC022**: Eksport CSV
  - **Oczekiwany efekt**: Plik CSV z produktami
  - **Kroki**: Wybierz format CSV i eksportuj
  - **Weryfikacja**: Plik CSV z nagłówkami i danymi produktów

- [ ] **TC023**: Eksport XLSX
  - **Oczekiwany efekt**: Plik Excel z danymi
  - **Kroki**: Wybierz format XLSX i eksportuj
  - **Weryfikacja**: Plik Excel zostaje pobrany

- [ ] **TC024**: Eksport PDF
  - **Oczekiwany efekt**: Plik PDF z raportem
  - **Kroki**: Wybierz format PDF i eksportuj
  - **Weryfikacja**: Plik PDF zostaje pobrany

- [ ] **TC025**: Błąd eksportu
  - **Oczekiwany efekt**: Komunikat o błędzie eksportu
  - **Kroki**: Spróbuj eksportować pustą analizę
  - **Weryfikacja**: Wyświetla się komunikat o błędzie

### 2. Testy integracyjne

#### 2.1 Integracja z systemem reguł
**Cel**: Sprawdzenie współpracy z systemem reguł

**Testy**:
- [ ] **TC026**: Ocena produktów
  - **Oczekiwany efekt**: Produkty są oceniane według aktywnych reguł
  - **Kroki**: Utwórz analizę z produktami, aktywuj reguły
  - **Weryfikacja**: Produkty mają oceny i statusy

- [ ] **TC027**: Statystyki reguł
  - **Oczekiwany efekt**: Statystyki pokazują zastosowane reguły
  - **Kroki**: Sprawdź statystyki w szczegółach analizy
  - **Weryfikacja**: Liczba zastosowanych reguł jest poprawna

#### 2.2 Integracja z parserami
**Cel**: Sprawdzenie współpracy z parserami plików

**Testy**:
- [ ] **TC028**: Parsowanie plików
  - **Oczekiwany efekt**: Pliki są parsowane i dodawane do analizy
  - **Kroki**: Dodaj pliki do analizy
  - **Weryfikacja**: Pliki są sparsowane, produkty dodane

- [ ] **TC029**: Status plików
  - **Oczekiwany efekt**: Status plików jest aktualizowany
  - **Kroki**: Sprawdź status plików w szczegółach
  - **Weryfikacja**: Status odpowiada rzeczywistemu stanowi

### 3. Testy wydajności

#### 3.1 Duże ilości danych
**Cel**: Sprawdzenie wydajności z dużą liczbą analiz

**Testy**:
- [ ] **TC030**: Lista 100+ analiz
  - **Oczekiwany efekt**: Lista ładuje się w < 2 sekundy
  - **Kroki**: Utwórz 100+ analiz, otwórz listę
  - **Weryfikacja**: Czas ładowania < 2s, płynne przewijanie

- [ ] **TC031**: Filtrowanie dużych list
  - **Oczekiwany efekt**: Filtrowanie działa płynnie
  - **Kroki**: Filtruj listę 100+ analiz
  - **Weryfikacja**: Wyniki pojawiają się natychmiast

- [ ] **TC032**: Eksport dużych analiz
  - **Oczekiwany efekt**: Eksport 1000+ produktów w < 5 sekund
  - **Kroki**: Eksportuj analizę z 1000+ produktami
  - **Weryfikacja**: Czas eksportu < 5s

### 4. Testy użyteczności

#### 4.1 Nawigacja
**Cel**: Sprawdzenie intuicyjności nawigacji

**Testy**:
- [ ] **TC033**: Przejście dashboard → szczegóły
  - **Oczekiwany efekt**: Płynne przejście między widokami
  - **Kroki**: Kliknij analizę w dashboard
  - **Weryfikacja**: Szczegóły otwierają się, przycisk "Wstecz" działa

- [ ] **TC034**: Breadcrumbs
  - **Oczekiwany efekt**: Użytkownik wie gdzie się znajduje
  - **Kroki**: Sprawdź breadcrumbs w szczegółach
  - **Weryfikacja**: Breadcrumbs pokazują ścieżkę nawigacji

#### 4.2 Responsywność
**Cel**: Sprawdzenie działania na różnych urządzeniach

**Testy**:
- [ ] **TC035**: Mobile (320px)
  - **Oczekiwany efekt**: Interfejs jest użyteczny na mobile
  - **Kroki**: Otwórz aplikację na urządzeniu mobile
  - **Weryfikacja**: Wszystkie funkcje są dostępne, tekst czytelny

- [ ] **TC036**: Tablet (768px)
  - **Oczekiwany efekt**: Interfejs jest zoptymalizowany dla tabletu
  - **Kroki**: Otwórz aplikację na tablecie
  - **Weryfikacja**: Layout jest responsywny, funkcje dostępne

- [ ] **TC037**: Desktop (1200px+)
  - **Oczekiwany efekt**: Pełna funkcjonalność na desktop
  - **Kroki**: Otwórz aplikację na desktop
  - **Weryfikacja**: Wszystkie funkcje dostępne, optymalny layout

### 5. Testy bezpieczeństwa

#### 5.1 Walidacja danych
**Cel**: Sprawdzenie walidacji wprowadzanych danych

**Testy**:
- [ ] **TC038**: XSS w nazwie analizy
  - **Oczekiwany efekt**: Skrypty są escapowane
  - **Kroki**: Wprowadź `<script>alert('XSS')</script>` jako nazwę
  - **Weryfikacja**: Skrypt nie jest wykonywany

- [ ] **TC039**: SQL Injection
  - **Oczekiwany efekt**: Zapytania są bezpieczne
  - **Kroki**: Wprowadź `'; DROP TABLE analyses; --` w wyszukiwaniu
  - **Weryfikacja**: System działa normalnie

#### 5.2 Autoryzacja
**Cel**: Sprawdzenie kontroli dostępu

**Testy**:
- [ ] **TC040**: Dostęp do analiz
  - **Oczekiwany efekt**: Użytkownik widzi tylko swoje analizy
  - **Kroki**: Sprawdź listę analiz
  - **Weryfikacja**: Tylko własne analizy są widoczne

## 📊 Kryteria akceptacji

### Funkcjonalne
- [ ] Wszystkie testy funkcjonalne (TC001-TC032) przechodzą
- [ ] System obsługuje 100+ analiz bez spadku wydajności
- [ ] Eksport działa dla wszystkich formatów
- [ ] Integracja z regułami i parserami działa poprawnie

### Niefunkcjonalne
- [ ] Czas ładowania listy < 2 sekundy
- [ ] Czas eksportu < 5 sekund
- [ ] Aplikacja działa na mobile, tablet, desktop
- [ ] Brak błędów w konsoli przeglądarki

### Bezpieczeństwo
- [ ] Brak podatności XSS
- [ ] Brak podatności SQL Injection
- [ ] Dane są prawidłowo walidowane

## 🚀 Wdrożenie

### Przed wdrożeniem
- [ ] Wszystkie testy przechodzą
- [ ] Dokumentacja zaktualizowana
- [ ] Build bez błędów
- [ ] Testy na różnych przeglądarkach

### Po wdrożeniu
- [ ] Monitoring błędów
- [ ] Sprawdzenie logów
- [ ] Testy smoke na produkcji
- [ ] Informacja o wdrożeniu

## 📝 Raportowanie

### Format raportu
- **Status testu**: ✅ Przeszedł / ❌ Nie przeszedł / ⏸️ Pominięty
- **Błąd**: Opis błędu jeśli test nie przeszedł
- **Screenshot**: Zrzut ekranu błędu
- **Środowisko**: Przeglądarka, system operacyjny
- **Data**: Data wykonania testu

### Przykład raportu
```
TC001: Tworzenie nowej analizy
Status: ✅ Przeszedł
Środowisko: Chrome 120, macOS 14
Data: 2025-01-XX
Uwagi: Brak

TC002: Aktualizacja analizy  
Status: ❌ Nie przeszedł
Błąd: Zmiany nie są zapisywane
Screenshot: error_tc002.png
Środowisko: Chrome 120, macOS 14
Data: 2025-01-XX
```

## 🎯 Oczekiwane efekty końcowe

### Po zakończeniu testów
1. **System analiz** - pełny cykl życia działa poprawnie
2. **Dashboard** - statystyki i trendy są dokładne
3. **Lista analiz** - filtrowanie i sortowanie działa płynnie
4. **Szczegóły analizy** - wszystkie informacje są wyświetlane
5. **Eksport** - wszystkie formaty działają poprawnie
6. **Integracja** - współpraca z regułami i parserami
7. **Wydajność** - system obsługuje duże ilości danych
8. **Użyteczność** - interfejs jest intuicyjny i responsywny
9. **Bezpieczeństwo** - brak podatności bezpieczeństwa

### Metryki sukcesu
- **Pokrycie testami**: 100% funkcjonalności
- **Przechodzenie testów**: 95%+ testów przechodzi
- **Wydajność**: Wszystkie metryki wydajności spełnione
- **Bezpieczeństwo**: 0 krytycznych podatności
- **Użyteczność**: Pozytywne opinie użytkowników

---

*Plan testów utworzony: Styczeń 2025*  
*Wersja: 1.0*  
*Status: Gotowy do wykonania*
