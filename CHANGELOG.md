# Changelog - Paleta

> Historia zmian w aplikacji Paleta

## [Unreleased]

### Added
- Komponent FileUpload z pełną funkcjonalnością drag & drop
- Walidacja plików (XLSX, XLS, CSV, PDF) z limitem 10MB
- Progress tracking dla uploadu plików
- Error handling i user feedback
- Upload store z Zustand dla zarządzania stanem
- Integracja FileUpload ze stroną Analysis
- Responsywny design system
- Dokumentacja komponentów (COMPONENTS.md, LAYOUT_COMPONENTS.md, COMPONENT_SHOWCASE.md)
- GitHub Pages deployment
- **System reguł analizy produktów:**
  - Typy reguł: budżetowe, kategorii, jakościowe
  - Akcje reguł: blokada, ostrzeżenie, preferencja
  - Formularz tworzenia/edycji reguł z walidacją
  - Lista reguł z filtrowaniem i sortowaniem
  - Predefiniowane szablony reguł
  - Silnik oceny produktów (RulesEngine)
  - System rekomendacji z priorytetami
  - Integracja z parserami plików
  - Automatyczna ocena produktów po parsowaniu
  - Statystyki reguł i ocen produktów
- **Dashboard i zarządzanie analizami:**
  - System analiz z pełnym cyklem życia
  - Dashboard ze statystykami i trendami
  - Lista analiz z filtrowaniem i sortowaniem
  - Szczegóły analizy z pełnymi informacjami
  - Eksport wyników (JSON, CSV, XLSX, PDF)
  - Zarządzanie plikami w analizach
  - Statystyki cenowe i kategorii
  - Integracja z systemem reguł
  - Persistencja danych analiz

### Changed
- Przeniesienie integracji API na fazę rozwoju
- Fokus na MVP bez zewnętrznych API
- Ukończenie Etapu 2 (Upload i Parsowanie) w 100%
- Ukończenie Etapu 3 (System Reguł) w 100%
- Ukończenie Etapu 4 (Dashboard i Szczegóły) w 100%

### Fixed
- Brak

## [1.0.0] - 2025-01-XX

### Added
- Podstawowa infrastruktura projektu
- React + TypeScript + Vite setup
- Tailwind CSS configuration
- ESLint + Prettier setup
- GitHub Pages deployment
- Podstawowa dokumentacja

### Changed
- Brak

### Fixed
- Brak

---

## Format Changelog

Ten plik jest zgodny z [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

### Format
- **[Unreleased]** - Zmiany w trakcie rozwoju
- **[X.Y.Z]** - Wersje wydane
- **Added** - Nowe funkcje
- **Changed** - Zmiany w istniejących funkcjach
- **Deprecated** - Funkcje oznaczone do usunięcia
- **Removed** - Usunięte funkcje
- **Fixed** - Poprawki błędów
- **Security** - Poprawki bezpieczeństwa

### Wersjonowanie
- **Major (X.0.0)** - Breaking changes
- **Minor (0.X.0)** - Nowe funkcje (backward compatible)
- **Patch (0.0.X)** - Poprawki błędów (backward compatible)

---

*Changelog utworzony: Styczeń 2025*  
*Wersja: 1.0*
