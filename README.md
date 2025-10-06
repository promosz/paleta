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

### **📖 Dokumenty Strategiczne**
- **[Executive Summary](./docs/EXECUTIVE_SUMMARY.md)** - Podsumowanie dla zarządu z analizą biznesową
- **[Plan Wdrożenia AI](./docs/AI_IMPLEMENTATION_PLAN.md)** - Kompleksowy plan implementacji funkcjonalności AI
- **[Roadmap Rozwoju](./docs/AI_ROADMAP.md)** - Timeline i etapy wdrożenia

### **🔧 Dokumentacja Techniczna**
- **[Specyfikacja Funkcjonalności](./docs/AI_FEATURES_SPECIFICATION.md)** - Szczegółowa specyfikacja techniczna
- **[Architektura Techniczna](./docs/TECHNICAL_ARCHITECTURE.md)** - System design i infrastruktura

### **💰 Analiza Finansowa**
- **[Szczegółowy Rozkład Kosztów](./docs/COST_BREAKDOWN.md)** - Kompletna analiza kosztów i ROI
- **[Zarządzanie Ryzykiem](./docs/RISK_MANAGEMENT.md)** - Plan zarządzania ryzykiem i mitigacji

## 🚀 **Funkcjonalności Obecne**

### **📊 Core Features**
- 📁 **Upload plików Excel** - Przesyłanie dokumentów .xlsx przez drag & drop lub wybór pliku
- 📊 **Rzeczywista analiza Excel** - Automatyczne parsowanie i analiza zawartości plików Excel
- 🔍 **Szczegółowe raporty z zakładkami** - Dwie zakładki: zawartość pliku i analiza rentowności
- 📈 **Podział na kategorie rentowności** - Produkty podzielone na niską, średnią i wysoką rentowność

### **🤖 AI Features (Hybrid AI Service)**
- ☁️ **Cloud AI Service** - Główny serwis AI w chmurze (zalecany)
- 🌐 **Browser AI Service** - Offline AI w przeglądarce (WebAssembly)
- 🐳 **Docker AI Service** - Lokalny serwer AI dla zaawansowanych użytkowników
- 🔄 **Auto-selection** - Automatyczny wybór najlepszego dostępnego serwisu
- ⚙️ **Easy Configuration** - Prosta konfiguracja przez panel ustawień
- 🧠 **Product Recognition** - AI rozpoznaje i normalizuje nazwy produktów
- 🎯 **Brand Classification** - Automatyczna klasyfikacja marek
- 📊 **Category Detection** - Inteligentne wykrywanie kategorii produktów
- 💰 **Market Valuation** - Analiza cen rynkowych z Allegro.pl
- 📈 **Enhanced UX** - Status indicators i notifications
- 💰 **Metryki finansowe** - Automatyczne obliczanie przychodów, kosztów i marż
- ⚙️ **Konfiguracja reguł** - Pełny system reguł analizy (ukończony)

### **📈 Performance Metrics (Achieved)**
- **Brand Recognition Accuracy**: >80%
- **Category Classification Accuracy**: >75%
- **Response Time**: <2s for products, <5s for palettes
- **Cache Speedup**: 5x+ for products, 2x+ for palettes
- **Test Coverage**: 40+ products with variations

## 🛠️ **Technologie**

### **Frontend**
- **React 18** z TypeScript
- **Vite** jako bundler
- **Tailwind CSS** do stylowania
- **React Router** do nawigacji
- **Lucide React** do ikon
- **XLSX** do obsługi plików Excel

### **AI Backend (Sprint 1-3)**
- **Python 3.9+** - Główny język AI services
- **FastAPI** - REST API framework
- **spaCy** - Natural Language Processing
- **pandas** - Data processing
- **pytest** - Testing framework
- **structlog** - Structured logging

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
   Aplikacja będzie dostępna pod adresem `http://localhost:3003`

### **AI Backend (Python)**
1. **Przejdź do katalogu AI services:**
   ```bash
   cd ai-services
   ```

2. **Zainstaluj zależności Python:**
   ```bash
   pip install -r requirements.txt
   python -m spacy download pl_core_news_sm
   ```

3. **Uruchom AI services:**
   ```bash
   python main.py
   ```

4. **AI API będzie dostępne pod adresem:**
   ```
   http://localhost:8000
   ```

### **Pełna integracja**
- Frontend: `http://localhost:3003`
- AI Backend: `http://localhost:8000`
- AI Analytics Dashboard dostępne w aplikacji

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

## 🔍 **Nowe Funkcjonalności - System Reguł i Filtrowania**

### **📊 Filtrowanie i wyszukiwanie produktów**
- **Filtrowanie po kategoriach** - Wyświetlanie produktów z wybranych kategorii
- **Wyszukiwanie tekstowe** - Szukanie produktów po nazwie, kategorii, opisie
- **Sortowanie** - Sortowanie po nazwie, kategorii, cenie, ilości
- **Filtry statusu** - Wyświetlanie produktów dozwolonych/ostrzeżeń/zablokowanych
- **Statystyki na żywo** - Liczniki produktów w różnych statusach

### **🛡️ System reguł analizy**
- **Reguły kategorii** - Blokowanie/ostrzeganie całych kategorii produktów
- **Reguły produktów** - Blokowanie/ostrzeganie konkretnych produktów
- **Zarządzanie regułami** - Dodawanie, edycja, usuwanie reguł
- **Analiza w czasie rzeczywistym** - Automatyczne sprawdzanie reguł podczas analizy
- **Wizualne oznaczenia** - Kolorowe oznaczenia statusu produktów (czerwone/żółte/zielone tło)

### **⚡ Akcje produktów**
- **Dodawanie do reguł** - Bezpośrednie dodawanie produktów/kategorii do reguł
- **Wybór działania** - Ostrzeżenie vs. blokowanie
- **Szybki dostęp** - Przycisk "Reguły" przy każdym produkcie
- **Zarządzanie centralne** - Panel zarządzania wszystkimi regułami

## Funkcjonalności w przygotowaniu

- 💾 **Baza danych** - Przechowywanie analiz i historii
- 📈 **Zaawansowane raporty** - Więcej szczegółów analizy
- 🔄 **Eksport wyników** - Możliwość eksportu raportów
- 🌐 **Integracja z zewnętrznymi API** - Rozszerzenie o więcej źródeł danych

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

## Konfiguracja Hybrid AI Service

### **Automatyczna konfiguracja**
1. **Otwórz aplikację** w przeglądarce (http://localhost:3003/)
2. **Przejdź do Ustawień** (ikona koła zębatego w menu)
3. **Kliknij "Konfiguruj"** przy sekcji "Hybrid AI Service"
4. **Wybierz serwis AI** - Cloud (zalecany), Browser (offline) lub Docker (zaawansowany)
5. **System automatycznie** wybierze najlepszy dostępny serwis

### **Pomoc i dokumentacja**
- **Strona pomocy:** http://localhost:3003/help
- **Instrukcje instalacji:** Szczegółowe kroki w sekcji pomocy
- **Rozwiązywanie problemów:** FAQ i diagnoza w aplikacji
- **Diagnostyka:** Komendy sprawdzające status systemu

## Wymagania systemowe

### **Frontend**
- Node.js 16+ 
- Przeglądarka z obsługą ES6+
- Pliki Excel w formacie .xlsx

### **AI Backend**
- Python 3.9+
- 4GB RAM minimum
- Dostęp do internetu (dla modeli językowych)
- Port 8000 dostępny

## Licencja

MIT License
