# Struktura Danych - Pliki Palet

> Szczegółowa dokumentacja struktury danych w plikach XLSX zestawów produktów

## 📊 Przegląd plików

### Pliki do analizy
1. **F20351 FBA MIX FBA PLN.xlsx** - 22KB, 82 produkty
2. **F20353 FBA MIX FBA PLN.xlsx** - 19KB, ~65 produktów
3. **M00216 RETOURWARE NARZĘDZIA PLN.xlsx** - 15KB, ~47 produktów

## 🏗 Struktura arkuszy Excel

### Wspólna struktura wszystkich plików

Każdy plik zawiera **jeden arkusz** z produktami w następującym formacie:

#### Kolumny (18 kolumn standardowo):

| Kolumna | Nazwa | Typ danych | Opis | Przykład |
|---------|-------|------------|------|----------|
| **A** | Paleta | String | ID palety/zestawu | `F20351`, `F20353`, `M00216` |
| **B** | Nazwa | String | Nazwa produktu | `Electric Car Charger [11kW...]` |
| **C** | Foto | String | Status zdjęcia | `FOTO` |
| **D** | EAN | String | Kod EAN produktu | `6975828000119` |
| **E** | Kod 1 | String | Pierwszy kod identyfikacyjny | `LPNHE979260590` |
| **F** | Kod 2 | String | Drugi kod identyfikacyjny (ASIN?) | `B0C4TPG8P8` |
| **G** | PackId | String | ID paczki/przesyłki | `1Z7E45296840145543` |
| **H** | Kategoria | String | Kategoria produktu | `AUTOMOTIVE`, `NARZĘDZIA` |
| **I** | PCS | Number | Liczba sztuk | `1`, `2`, `5` |
| **J** | Cena regularna brutto | Number | Cena brutto | `1073.6`, `495.99` |
| **K** | Waluta | String | Waluta (zawsze PLN) | `PLN` |
| **L** | Cena sprzedaży netto | Number | Cena netto | `193.25`, `89.50` |
| **M** | Waluta | String | Waluta (duplikat) | `PLN` |
| **N** | Link | String | Link do produktu | URL |
| **O** | FCSku | String | SKU Fulfillment Center | `X001TNT5NN` |
| **P-R** | - | Mixed | Dodatkowe kolumny (opcjonalne) | - |

## 📦 Szczegółowa analiza plików

### 1. F20351 FBA MIX FBA PLN.xlsx

**Charakterystyka:**
- **Liczba produktów**: 82
- **Kategorie**: AUTOMOTIVE, LAWN_AND_GARDEN, inne
- **Języki produktów**: Angielski, Niemiecki, Włoski
- **Zakres cen**: Od ~100 PLN do ~1000 PLN

**Przykładowe produkty:**
1. Electric Car Charger [11kW, Three Phase...] - AUTOMOTIVE - 1073.60 PLN brutto / 193.25 PLN netto
2. dé Typ 2 Verlängerungskabel [15m, 22kW...] - AUTOMOTIVE 
3. FreeTec 21-Piece Pneumatic Injector Puller - AUTOMOTIVE
4. Dripex Tenda da Sole per Esterno, 5X7M - LAWN_AND_GARDEN

**Obserwacje:**
- Produkty głównie automotive i ogrodowe
- Duża różnica między ceną brutto a netto (możliwa promocja/przecena)
- Produkty z różnych rynków (DE, IT, UK)

### 2. F20353 FBA MIX FBA PLN.xlsx

**Charakterystyka:**
- **Liczba produktów**: ~65
- **Kategorie**: Elektronika, AGD, Pet supplies
- **Języki produktów**: Angielski, Niemiecki
- **Zakres cen**: Szeroki zakres

**Przykładowe produkty:**
1. Bisofice Drawing Tablet with Screen, 11.6" Full HD
2. Bisofice A4 Portable Thermal Printer
3. COOKTRON Induktionskochfeld 2 Platten Mobil, 3500W
4. Ownpets Soft Dog Crate, 81x58x58cm
5. HTNZIR 15.6 Inch Portable Monitor

**Obserwacje:**
- Mix różnych kategorii (elektronika, AGD, pet)
- Produkty głównie z rynku DE i UK
- Bardziej zróżnicowany zestaw niż F20351

### 3. M00216 RETOURWARE NARZĘDZIA PLN.xlsx

**Charakterystyka:**
- **Liczba produktów**: ~47
- **Kategoria główna**: NARZĘDZIA (Tools/Hardware)
- **Języki produktów**: Niemiecki, Angielski, Hiszpański
- **Specyfika**: Produkty zwrotne (RETOURWARE)

**Przykładowe produkty:**
1. Wagner Farbsprühgerät Power Painter 90 Extra HEA
2. Diager 166d32l1500 – ULTIMAX SDS-Max Drill Bit 32mm
3. Broca ULTIMAX SDS-MAX DIAGER 24mm x 1500mm
4. Brennenstuhl Kompakter Gummi-Stromverteiler

**Obserwacje:**
- Wyspecjalizowany zestaw - tylko narzędzia
- Produkty z rynku DE i ES
- Status RETOURWARE sugeruje zwroty/refurb

## 🔍 Wzorce i standardy danych

### Kody identyfikacyjne

#### EAN (European Article Number)
- **Format**: 13 cyfr
- **Przykład**: `6975828000119`, `4004025098673`
- **Występowanie**: ~80% produktów ma EAN

#### Kod 1 (LPNHE/LPNRP)
- **Format**: Prefiksy LPNHE lub LPNRP + cyfry
- **Przykład**: `LPNHE979260590`, `LPNRP035810417`
- **Cel**: Prawdopodobnie kod wewnętrzny magazynu

#### Kod 2 (ASIN?)
- **Format**: Alfanumeryczny ~10 znaków
- **Przykład**: `B0C4TPG8P8`, `B0DCZ2LZFG`
- **Cel**: Prawdopodobnie Amazon ASIN

#### PackId
- **Format**: Mix różnych formatów
- **Przykład**: `1Z7E45296840145543`, `spLc32mJjO6`
- **Cel**: ID paczki/przesyłki

#### FCSku
- **Format**: Alfanumeryczny
- **Przykład**: `X001TNT5NN`, `X002DJWW5P`
- **Cel**: SKU Fulfillment Center

### Kategorie produktów

Wykryte kategorie:
- `AUTOMOTIVE` - Części i akcesoria samochodowe
- `LAWN_AND_GARDEN` - Ogród
- `NARZĘDZIA` - Narzędzia
- Elektronika (brak stałej nazwy kategorii)
- AGD (brak stałej nazwy kategorii)
- Pet supplies (brak stałej nazwy kategorii)

### Ceny

**Struktura cenowa:**
- **Cena regularna brutto**: Cena katalogowa z VAT
- **Cena sprzedaży netto**: Cena sprzedaży bez VAT
- **Waluta**: Zawsze PLN
- **Marża**: Duża różnica sugeruje przeceny/promocje

**Obserwacje:**
- Ceny brutto często 4-5x wyższe niż netto
- Może wskazywać na produkty przecenione/outlet
- RETOURWARE może mieć specjalne ceny

## 📋 Wymagania parsowania

### Obowiązkowe pola
- ✅ **Paleta** - Zawsze wypełnione
- ✅ **Nazwa** - Zawsze wypełnione
- ✅ **Kategoria** - Zawsze wypełnione (lub puste dla niektórych)
- ✅ **PCS** - Zawsze wypełnione (liczba)

### Opcjonalne pola
- ⚠️ **EAN** - ~80% wypełnienia
- ⚠️ **Kod 1, Kod 2** - Różne wypełnienie
- ⚠️ **PackId** - Różne formaty
- ⚠️ **Ceny** - Mogą być puste

### Specjalne przypadki
- **Puste komórki**: Należy obsłużyć jako NULL/undefined
- **Różne formaty dat**: Brak dat w analizowanych plikach
- **Wielojęzyczność**: Produkty w DE, EN, IT, ES
- **Duplikaty**: Sprawdzić unikalne identyfikatory

## 🔄 Proces parsowania

### Krok 1: Wczytanie pliku
```typescript
interface RawFileData {
  fileName: string;
  fileSize: number;
  sheets: SheetData[];
}
```

### Krok 2: Identyfikacja nagłówków
```typescript
const EXPECTED_HEADERS = [
  'Paleta',
  'Nazwa', 
  'Foto',
  'EAN',
  'Kod 1',
  'Kod 2',
  'PackId',
  'Kategoria',
  'PCS',
  'Cena regularna brutto',
  'Waluta',
  'Cena sprzedaży netto',
  'Link',
  'FCSku'
];
```

### Krok 3: Walidacja struktury
- Sprawdź czy pierwszy wiersz zawiera nagłówki
- Zweryfikuj minimalną liczbę kolumn (14)
- Sprawdź czy istnieją wymagane pola

### Krok 4: Parsowanie wierszy
```typescript
interface ParsedProduct {
  paletaId: string;          // Kolumna A
  name: string;              // Kolumna B
  photo: string;             // Kolumna C
  ean?: string;              // Kolumna D
  code1?: string;            // Kolumna E
  code2?: string;            // Kolumna F (ASIN?)
  packId?: string;           // Kolumna G
  category: string;          // Kolumna H
  quantity: number;          // Kolumna I
  priceGross?: number;       // Kolumna J
  currency: string;          // Kolumna K
  priceNet?: number;         // Kolumna L
  link?: string;             // Kolumna N
  fcSku?: string;            // Kolumna O
}
```

### Krok 5: Walidacja danych
- **Wymagane**: paletaId, name, category, quantity
- **Numeryczne**: quantity, prices (jeśli istnieją)
- **Format**: EAN (13 cyfr), currency (PLN)

## 🎯 Model danych aplikacji

### Pallet (Paleta/Zestaw)
```typescript
interface Pallet {
  id: string;                    // Unikalny ID (z nazwy pliku lub kolumny Paleta)
  fileName: string;              // Nazwa oryginalnego pliku
  uploadDate: Date;              // Data uploadu
  analysisDate: Date;            // Data analizy
  status: 'completed' | 'processing' | 'error';
  
  // Metadane
  metadata: {
    totalProducts: number;       // Liczba produktów
    categories: string[];        // Unikalne kategorie
    totalValue: number;          // Suma wartości (jeśli dostępne)
    currency: string;            // Waluta (PLN)
  };
  
  // Produkty
  products: Product[];           // Lista produktów
  
  // Analiza
  analysis?: PalletAnalysis;     // Wyniki analizy
}
```

### Product (Produkt)
```typescript
interface Product {
  id: string;                    // Unikalny ID (wygenerowany lub z EAN)
  paletaId: string;             // ID palety
  name: string;                  // Nazwa produktu
  
  // Identyfikatory
  identifiers: {
    ean?: string;                // EAN kod
    code1?: string;              // Kod 1 (LPNHE/LPNRP)
    code2?: string;              // Kod 2 (ASIN?)
    packId?: string;             // ID paczki
    fcSku?: string;              // SKU FC
  };
  
  // Kategoria i cechy
  category: string;              // Kategoria produktu
  photo: string;                 // Status zdjęcia
  quantity: number;              // Liczba sztuk
  
  // Ceny
  pricing: {
    priceGross?: number;         // Cena brutto
    priceNet?: number;           // Cena netto
    currency: string;            // Waluta
    margin?: number;             // Marża % (obliczona)
  };
  
  // Dodatkowe
  link?: string;                 // Link do produktu
  language?: string;             // Wykryty język (DE/EN/IT/ES)
  
  // Analiza
  analysis?: ProductAnalysis;    // Wyniki analizy produktu
}
```

### ProductAnalysis (z systemu reguł)
```typescript
interface ProductAnalysis {
  productId: string;
  score: number;                 // 0-100
  status: 'ok' | 'warning' | 'blocked';
  
  compliance: {
    budget: ComplianceCheck;
    category: ComplianceCheck;
    quality: ComplianceCheck;
  };
  
  recommendations: string[];
  warnings: string[];
  blocks: string[];
  
  reason: string;                // Główny powód oceny
}
```

## 🔧 Specyfikacja parsera

### Wymagania funkcjonalne
1. **Obsługa formatów**: XLSX, CSV, PDF
2. **Wykrywanie nagłówków**: Automatyczne rozpoznawanie
3. **Mapowanie kolumn**: Elastyczne mapowanie na model
4. **Walidacja danych**: Sprawdzanie wymaganych pól
5. **Normalizacja**: Ujednolicenie formatu danych
6. **Error handling**: Obsługa błędów parsowania

### Wymagania niefunkcjonalne
1. **Performance**: < 5s dla 1000 produktów
2. **Memory**: Streaming dla dużych plików
3. **Reliability**: 95% sukces parsowania
4. **Logging**: Szczegółowe logi błędów

## 📈 Statystyki i metryki

### Metryki jakości danych
- **Kompletność EAN**: ~80%
- **Kompletność cen**: ~95%
- **Kompletność kategorii**: 100%
- **Wielojęzyczność**: 4 języki (DE, EN, IT, ES)

### Metryki wydajności
- **Średni rozmiar pliku**: 18KB
- **Średnia liczba produktów**: 60-80
- **Średnia liczba kolumn**: 14-18
- **Format**: XLSX (Office Open XML)

## 🚨 Znane problemy i edge cases

### 1. Różne formaty identyfikatorów
- PackId ma różne formaty (UPS tracking vs custom)
- Kod 1 ma różne prefiksy (LPNHE, LPNRP)

### 2. Wielojęzyczność
- Nazwy produktów w różnych językach
- Brak wyraźnego pola języka
- Wymaga wykrywania języka z tekstu

### 3. Kategorie
- Niespójne nazewnictwo kategorii
- Część po polsku (NARZĘDZIA), część po angielsku (AUTOMOTIVE)
- Brak hierarchii kategorii

### 4. Ceny
- Duża różnica brutto/netto sugeruje specjalne warunki
- Brak informacji o VAT
- Brak daty cennika

### 5. RETOURWARE
- Specjalny typ zestawu (zwroty)
- Może wymagać innej logiki analizy
- Prawdopodobnie niższe ceny

## 🎯 Rekomendacje implementacyjne

### Priorytet 1: Parser XLSX
- Użyć SheetJS (xlsx) library
- Implementować streaming dla dużych plików
- Automatyczne wykrywanie nagłówków
- Walidacja struktury

### Priorytet 2: Normalizacja danych
- Ujednolicenie formatów identyfikatorów
- Wykrywanie języka produktu
- Standaryzacja nazw kategorii
- Obliczanie marży

### Priorytet 3: Walidacja biznesowa
- Sprawdzanie logiki cen (brutto vs netto)
- Weryfikacja EAN (checksum)
- Wykrywanie duplikatów
- Identyfikacja produktów RETOURWARE

### Priorytet 4: Error handling
- Graceful degradation dla brakujących pól
- Szczegółowe raporty błędów
- Możliwość ręcznej korekty
- Logging wszystkich operacji

---

*Dokumentacja struktury danych utworzona: Styczeń 2025*  
*Na podstawie analizy 3 plików XLSX z zestawami produktów*  
*Wersja: 1.0*
