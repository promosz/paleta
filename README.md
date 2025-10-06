# Pallet Analysis

Aplikacja webowa do analizy dokumentów Excel z wykorzystaniem sztucznej inteligencji. Pozwala na przesyłanie plików .xlsx, przeprowadzanie analizy rentowności zestawów produktów i sprawdzanie zgodności z ustalonymi regułami.

## 🤖 **Funkcjonalności AI (Planowane)**

### **A. Rozpoznawanie Produktów**
- **Dopasowywanie nazw do baz rynkowych** - Automatyczna normalizacja i standaryzacja nazw produktów
- **Analiza opisów przy pomocy NLP** - Ekstrakcja specyfikacji technicznych i kluczowych cech
- **Szukanie odpowiedników** - Integracja z Allegro, Amazon, Ceneo dla dopasowywania produktów

### **B. Wycena Rynkowa**
- **Zbieranie danych cenowych** - Real-time scraping z serwisów e-commerce
- **Ustalanie mediany cen** - Algorytmy statystyczne z filtrowaniem outlier'ów
- **Oznaczanie braku danych** - System flagowania i estymacji na podstawie kategorii

### **C. Ocena Rentowności i Ryzyka**
- **Zaawansowane metryki ROI** - Marża brutto/netto, koszty ukryte, udział stratnych pozycji
- **Wskaźnik ryzyka** - ML model oceny ryzyka z predykcją trendów

### **D. Uczenie Adaptacyjne**
- **Personalizacja** - Rekomendacje dopasowane do stylu zakupowego użytkownika
- **Rozpoznawanie preferencji** - Analiza wzorców zakupowych i segmentacja użytkowników

## 📚 **Dokumentacja AI**

- **[Plan Wdrożenia AI](./docs/AI_IMPLEMENTATION_PLAN.md)** - Kompleksowy plan implementacji funkcjonalności AI
- **[Specyfikacja Funkcjonalności](./docs/AI_FEATURES_SPECIFICATION.md)** - Szczegółowa specyfikacja techniczna

## 🚀 **Funkcjonalności Obecne**

- 📁 **Upload plików Excel** - Przesyłanie dokumentów .xlsx przez drag & drop lub wybór pliku
- 📊 **Rzeczywista analiza Excel** - Automatyczne parsowanie i analiza zawartości plików Excel
- 🔍 **Szczegółowe raporty z zakładkami** - Dwie zakładki: zawartość pliku i analiza rentowności
- 📈 **Podział na kategorie rentowności** - Produkty podzielone na niską, średnią i wysoką rentowność
- 💰 **Metryki finansowe** - Automatyczne obliczanie przychodów, kosztów i marż
- ⚙️ **Konfiguracja reguł** - Ustawienia reguł analizy (w przygotowaniu)
- 🤖 **Integracja AI** - Wykorzystanie sztucznej inteligencji do analizy (w przygotowaniu)

## Technologie

- **React 18** z TypeScript
- **Vite** jako bundler
- **Tailwind CSS** do stylowania
- **React Router** do nawigacji
- **Lucide React** do ikon
- **XLSX** do obsługi plików Excel

## Instalacja i uruchomienie

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Uruchom aplikację w trybie deweloperskim:**
   ```bash
   npm run dev
   ```

3. **Otwórz przeglądarkę:**
   Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## Struktura projektu

```
src/
├── components/          # Komponenty React
│   ├── Layout.tsx      # Główny layout aplikacji
│   ├── FileUpload.tsx  # Komponent uploadu plików
│   └── AnalysisList.tsx # Lista analiz
├── pages/              # Strony aplikacji
│   ├── HomePage.tsx    # Strona główna
│   ├── SettingsPage.tsx # Strona ustawień
│   └── AnalysisDetailPage.tsx # Szczegóły analizy
├── App.tsx             # Główny komponent aplikacji
├── main.tsx           # Punkt wejścia
└── index.css          # Style globalne
```

## Funkcjonalności w przygotowaniu

- 🔧 **Konfiguracja reguł analizy** - Pełna funkcjonalność ustawień
- 🤖 **Integracja z AI** - Rzeczywista analiza dokumentów przez AI
- 💾 **Baza danych** - Przechowywanie analiz i historii
- 📈 **Zaawansowane raporty** - Więcej szczegółów analizy
- 🔄 **Eksport wyników** - Możliwość eksportu raportów

## Użycie

1. **Prześlij dokument:** Na stronie głównej przeciągnij plik Excel lub kliknij "Wybierz plik"
2. **Poczekaj na analizę:** System automatycznie rozpocznie analizę dokumentu
3. **Przejrzyj wyniki:** Kliknij "Szczegóły" przy analizie, aby zobaczyć pełny raport
4. **Zakładka "Zawartość pliku":** Przeglądaj wszystkie produkty z pełnymi danymi finansowymi
5. **Zakładka "Analiza rentowności":** Zobacz produkty podzielone na kategorie rentowności
6. **Skonfiguruj reguły:** Przejdź do ustawień, aby dostosować parametry analizy

## Format pliku Excel

Aplikacja oczekuje plików Excel z następującymi kolumnami:
- **Nazwa produktu** - Nazwa zestawu/produktu
- **Cena (PLN)** - Cena sprzedaży
- **Koszt (PLN)** - Koszt wytworzenia
- **Marża (PLN)** - Marża zysku (opcjonalnie, może być obliczona)
- **Rentowność (%)** - Procentowa rentowność (opcjonalnie, może być obliczona)
- **Kategoria** - Kategoria produktu
- **Dostępność** - Status dostępności

Przykładowy plik `Przykładowy_plik_do_analizy.xlsx` jest dostępny w katalogu projektu.

## Wymagania systemowe

- Node.js 16+ 
- Przeglądarka z obsługą ES6+
- Pliki Excel w formacie .xlsx

## Licencja

MIT License
