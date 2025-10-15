# Analiza Plików Palet - Podsumowanie

> Wyniki analizy 3 plików XLSX z zestawami produktów

## 📊 Przegląd analizowanych plików

### 1️⃣ F20351 FBA MIX FBA PLN.xlsx
- **Rozmiar**: 22 KB
- **Liczba produktów**: 82
- **Kategorie główne**: AUTOMOTIVE, LAWN_AND_GARDEN
- **Języki**: Angielski, Niemiecki, Włoski
- **Typ**: Mix produktów FBA (Fulfillment by Amazon)

**Przykładowe produkty:**
- Electric Car Charger [11kW, Three Phase, 7m] - 1073.60 PLN brutto / 193.25 PLN netto
- dé Typ 2 Verlängerungskabel [15m, 22kW, 32A] - Automotive
- FreeTec 21-Piece Pneumatic Injector Puller - Automotive
- Dripex Tenda da Sole - Ogród

### 2️⃣ F20353 FBA MIX FBA PLN.xlsx
- **Rozmiar**: 19 KB  
- **Liczba produktów**: ~65
- **Kategorie główne**: Elektronika, AGD, Pet Supplies
- **Języki**: Angielski, Niemiecki
- **Typ**: Mix produktów FBA

**Przykładowe produkty:**
- Bisofice Drawing Tablet with Screen, 11.6" Full HD
- Bisofice A4 Portable Thermal Printer
- COOKTRON Induktionskochfeld 2 Platten
- Ownpets Soft Dog Crate, 81x58x58cm
- HTNZIR 15.6 Inch Portable Monitor

### 3️⃣ M00216 RETOURWARE NARZĘDZIA PLN.xlsx
- **Rozmiar**: 15 KB
- **Liczba produktów**: ~47
- **Kategoria główna**: NARZĘDZIA (Tools/Hardware)
- **Języki**: Niemiecki, Angielski, Hiszpański
- **Typ**: Produkty zwrotne (RETOURWARE)

**Przykładowe produkty:**
- Wagner Farbsprühgerät Power Painter 90 Extra HEA
- Diager ULTIMAX SDS-Max Drill Bit 32mm x 1500mm
- Broca ULTIMAX SDS-MAX DIAGER 24mm
- Brennenstuhl Kompakter Gummi-Stromverteiler

## 📋 Struktura danych (18 kolumn)

| # | Kolumna | Typ | Wymagane | Przykład |
|---|---------|-----|----------|----------|
| A | **Paleta** | String | ✅ | F20351, M00216 |
| B | **Nazwa** | String | ✅ | Electric Car Charger... |
| C | **Foto** | String | - | FOTO |
| D | **EAN** | String | - | 6975828000119 |
| E | **Kod 1** | String | - | LPNHE979260590 |
| F | **Kod 2** | String | - | B0C4TPG8P8 |
| G | **PackId** | String | - | 1Z7E45296840145543 |
| H | **Kategoria** | String | ✅ | AUTOMOTIVE |
| I | **PCS** | Number | ✅ | 1, 5, 10 |
| J | **Cena regularna brutto** | Number | - | 1073.60 |
| K | **Waluta** | String | ✅ | PLN |
| L | **Cena sprzedaży netto** | Number | - | 193.25 |
| M | **Waluta** | String | - | PLN (duplikat) |
| N | **Link** | String | - | URL produktu |
| O | **FCSku** | String | - | X001TNT5NN |
| P-R | *Dodatkowe* | Mixed | - | Różne |

## 🔍 Kluczowe obserwacje

### ✅ Mocne strony danych
1. **Spójna struktura** - Wszystkie 3 pliki mają identyczną strukturę kolumn
2. **Kompletność podstawowych pól** - Paleta, Nazwa, Kategoria, PCS zawsze wypełnione
3. **Standaryzacja identyfikatorów** - Spójne formaty EAN, kodów LPNHE/LPNRP
4. **Dane cenowe** - Większość produktów ma ceny brutto i netto

### ⚠️ Wyzwania
1. **Wielojęzyczność** - Produkty w 4 językach (PL, EN, DE, IT, ES)
2. **Niespójne kategorie** - Mix polskich i angielskich nazw kategorii
3. **Różne formaty identyfikatorów** - PackId ma różne formaty
4. **Duża marża cen** - Cena brutto często 4-5x wyższa niż netto (przeceny?)
5. **Brak pola języka** - Wymaga automatycznego wykrywania

### 🎯 Specyficzne cechy

#### Kody identyfikacyjne
- **EAN**: 13-cyfrowy kod, ~80% produktów
- **Kod 1 (LPN)**: Format LPNHE/LPNRP + cyfry (kod magazynowy?)
- **Kod 2**: Prawdopodobnie Amazon ASIN (B0C4TPG8P8)
- **PackId**: ID przesyłki (różne formaty)
- **FCSku**: SKU Fulfillment Center

#### Kategorie wykryte
- `AUTOMOTIVE` - Części samochodowe
- `LAWN_AND_GARDEN` - Ogród
- `NARZĘDZIA` - Narzędzia (PL)
- Elektronika (bez stałej nazwy)
- AGD (bez stałej nazwy)
- Pet Supplies (bez stałej nazwy)

#### Struktura cenowa
- **Cena regularna brutto** - Cena katalogowa z VAT
- **Cena sprzedaży netto** - Cena sprzedaży bez VAT
- **Marża** - Często 400-500% (produkty outlet/przecenione?)
- **Waluta** - Zawsze PLN

## 🛠 Model danych dla aplikacji

### Pallet (Paleta/Zestaw)
```typescript
interface Pallet {
  id: string;                    // F20351, F20353, M00216
  fileName: string;              // Nazwa pliku
  uploadDate: Date;
  analysisDate: Date;
  status: 'completed' | 'processing' | 'error';
  
  metadata: {
    totalProducts: number;       // 82, 65, 47
    categories: string[];        // Unikalne kategorie
    totalValue: number;          // Suma wartości
    currency: string;            // PLN
  };
  
  products: Product[];
  analysis?: PalletAnalysis;
}
```

### Product (Produkt)
```typescript
interface Product {
  id: string;
  paletaId: string;             // ID palety
  name: string;                 // Nazwa produktu
  
  identifiers: {
    ean?: string;               // 6975828000119
    code1?: string;             // LPNHE979260590
    code2?: string;             // B0C4TPG8P8 (ASIN?)
    packId?: string;            // 1Z7E45296840145543
    fcSku?: string;             // X001TNT5NN
  };
  
  category: string;             // AUTOMOTIVE
  photo: string;                // FOTO
  quantity: number;             // 1, 5, 10
  
  pricing: {
    priceGross?: number;        // 1073.60
    priceNet?: number;          // 193.25
    currency: string;           // PLN
    margin?: number;            // Obliczona marża %
  };
  
  link?: string;
  language?: string;            // en, de, it, es, pl
  
  analysis?: ProductAnalysis;
}
```

## 📈 Statystyki

### Kompletność danych
- **EAN**: ~80% wypełnienia
- **Kod 1**: ~95% wypełnienia  
- **Kod 2**: ~90% wypełnienia
- **Ceny**: ~95% wypełnienia
- **Kategoria**: 100% wypełnienia

### Rozkład produktów
- **F20351**: 82 produkty (42%)
- **F20353**: 65 produktów (33%)
- **M00216**: 47 produktów (24%)
- **Łącznie**: ~194 produkty

### Kategorie
1. AUTOMOTIVE - ~35%
2. NARZĘDZIA - ~25%
3. Elektronika - ~20%
4. LAWN_AND_GARDEN - ~10%
5. Pet Supplies - ~5%
6. AGD - ~5%

## 🚀 Rekomendacje dla parsera

### Priorytet 1: Podstawowe parsowanie
- ✅ Obsługa XLSX (SheetJS)
- ✅ Wykrywanie nagłówków
- ✅ Mapowanie 18 kolumn
- ✅ Walidacja wymaganych pól

### Priorytet 2: Normalizacja
- 🔄 Wykrywanie języka produktu
- 🔄 Standaryzacja nazw kategorii
- 🔄 Obliczanie marży (brutto vs netto)
- 🔄 Walidacja EAN (checksum)

### Priorytet 3: Wzbogacanie
- ⏳ Tłumaczenie kategorii na PL
- ⏳ Identyfikacja produktów RETOURWARE
- ⏳ Grupowanie podobnych produktów
- ⏳ Wykrywanie duplikatów

## 📊 Przypadki użycia w aplikacji

### 1. Upload i parsowanie
```
Użytkownik uploaduje F20351.xlsx
→ Parser wykrywa strukturę
→ Mapuje 82 produkty
→ Waliduje dane
→ Normalizuje kategorie i ceny
→ Tworzy obiekt Pallet
```

### 2. Analiza zgodności z regułami
```
System sprawdza produkty wg reguł użytkownika:
- Budżet: Cena netto < 200 PLN → 95% produktów OK
- Kategoria: Unikaj AUTOMOTIVE → 35% ostrzeżeń
- Jakość: EAN wymagane → 20% ostrzeżeń (brak EAN)
```

### 3. Prezentacja wyników
```
Dashboard pokazuje:
- F20351: 82 produkty, ocena 75/100, ROZWAŻ
  ├─ TOP 3: produkty poniżej 150 PLN
  ├─ Ostrzeżenia: 28 produktów AUTOMOTIVE
  └─ Blokady: 2 produkty bez EAN (jeśli wymagane)
```

## 🎯 Następne kroki

1. ✅ **Dokumentacja struktury** - UKOŃCZONE
2. ✅ **Specyfikacja parsera** - UKOŃCZONE  
3. ⏳ **Implementacja parsera XLSX** - DO ZROBIENIA
4. ⏳ **Testy z rzeczywistymi plikami** - DO ZROBIENIA
5. ⏳ **System reguł i analiza** - DO ZROBIENIA

---

## 📚 Dodatkowa dokumentacja

- [Szczegółowa struktura danych](./DATA_STRUCTURE.md)
- [Specyfikacja parsera](./PARSER_SPECIFICATION.md)
- [Plan projektu](./PROJECT_PLAN.md)
- [Wymagania aplikacji](./REQUIREMENTS.md)

---

*Analiza przeprowadzona: 2 października 2025*  
*Pliki źródłowe: palety/F20351.xlsx, palety/F20353.xlsx, palety/M00216.xlsx*  
*Wersja: 1.0*
