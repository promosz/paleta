# Specyfikacja Parsera Plików - Paleta

> Szczegółowa specyfikacja implementacji parsera dla plików zestawów produktów

## 🎯 Cel parsera

Parser ma za zadanie:
1. Wczytać pliki XLSX, CSV, PDF z zestawami produktów
2. Rozpoznać i zwalidować strukturę danych
3. Przekształcić dane do modelu aplikacji
4. Obsłużyć błędy i edge cases
5. Zwrócić znormalizowane dane gotowe do analizy

## 📋 Wymagania funkcjonalne

### 1. Obsługiwane formaty plików

#### XLSX (Excel)
- **Biblioteka**: SheetJS (xlsx)
- **Obsługa**: Pełna
- **Priorytet**: ⭐⭐⭐ Wysoki (główny format)

#### CSV
- **Biblioteka**: Papa Parse
- **Obsługa**: Pełna
- **Priorytet**: ⭐⭐ Średni (alternatywny format)

#### PDF
- **Biblioteka**: PDF.js
- **Obsługa**: Podstawowa (ekstrakcja tabel)
- **Priorytet**: ⭐ Niski (opcjonalny format)

### 2. Wykrywanie struktury

#### Identyfikacja nagłówków
```typescript
interface HeaderDetection {
  // Automatyczne wykrywanie nagłówków
  detectHeaders(sheet: any[][]): HeaderMapping;
  
  // Oczekiwane nagłówki (w różnych językach/formatach)
  expectedHeaders: {
    paleta: ['Paleta', 'Pallet', 'ID'],
    nazwa: ['Nazwa', 'Name', 'Product Name', 'Produkt'],
    ean: ['EAN', 'EAN13', 'Barcode'],
    kategoria: ['Kategoria', 'Category', 'Kat.'],
    // ... inne
  };
  
  // Dopasowanie z fuzzy matching
  matchHeaders(found: string[], expected: string[]): number; // similarity score
}
```

#### Mapowanie kolumn
```typescript
interface ColumnMapping {
  sourceColumn: string;      // Oryginalna nazwa kolumny
  targetField: string;       // Pole w modelu danych
  dataType: 'string' | 'number' | 'date';
  required: boolean;
  transform?: (value: any) => any;
}

const STANDARD_MAPPING: ColumnMapping[] = [
  { sourceColumn: 'Paleta', targetField: 'paletaId', dataType: 'string', required: true },
  { sourceColumn: 'Nazwa', targetField: 'name', dataType: 'string', required: true },
  { sourceColumn: 'EAN', targetField: 'ean', dataType: 'string', required: false },
  { sourceColumn: 'Kategoria', targetField: 'category', dataType: 'string', required: true },
  { sourceColumn: 'PCS', targetField: 'quantity', dataType: 'number', required: true },
  { sourceColumn: 'Cena regularna brutto', targetField: 'priceGross', dataType: 'number', required: false },
  { sourceColumn: 'Cena sprzedaży netto', targetField: 'priceNet', dataType: 'number', required: false },
  // ... inne
];
```

### 3. Walidacja danych

#### Walidacja struktury
```typescript
interface StructureValidation {
  // Sprawdzenie minimalnej liczby kolumn
  minColumns: 10;
  
  // Sprawdzenie wymaganych pól
  requiredFields: ['paletaId', 'name', 'category', 'quantity'];
  
  // Sprawdzenie typu danych
  validateDataTypes(row: any, mapping: ColumnMapping[]): ValidationResult;
}
```

#### Walidacja biznesowa
```typescript
interface BusinessValidation {
  // Walidacja EAN (13 cyfr + checksum)
  validateEAN(ean: string): boolean;
  
  // Walidacja ceny (dodatnia liczba)
  validatePrice(price: number): boolean;
  
  // Walidacja ilości (dodatnia liczba całkowita)
  validateQuantity(qty: number): boolean;
  
  // Walidacja kategorii (z predefiniowanej listy lub dowolna)
  validateCategory(category: string): boolean;
}
```

### 4. Normalizacja danych

#### Czyszczenie tekstu
```typescript
interface TextNormalization {
  // Usunięcie whitespace
  trim(text: string): string;
  
  // Normalizacja kategorii (uppercase)
  normalizeCategory(category: string): string;
  
  // Wykrywanie języka produktu
  detectLanguage(productName: string): 'pl' | 'en' | 'de' | 'it' | 'es' | 'unknown';
  
  // Usunięcie znaków specjalnych z kodów
  sanitizeCode(code: string): string;
}
```

#### Konwersja typów
```typescript
interface TypeConversion {
  // String to Number (obsługa różnych formatów)
  parseNumber(value: string): number | null;
  
  // String to Date
  parseDate(value: string): Date | null;
  
  // String to Boolean
  parseBoolean(value: string): boolean;
  
  // Obsługa pustych wartości
  handleEmpty(value: any): any;
}
```

## 🏗 Architektura parsera

### Komponenty

```typescript
// 1. File Reader
interface FileReader {
  readXLSX(file: File): Promise<RawFileData>;
  readCSV(file: File): Promise<RawFileData>;
  readPDF(file: File): Promise<RawFileData>;
}

// 2. Header Detector
interface HeaderDetector {
  detect(data: any[][]): HeaderMapping;
  validate(headers: HeaderMapping): ValidationResult;
}

// 3. Data Parser
interface DataParser {
  parse(data: any[][], mapping: ColumnMapping[]): ParsedProduct[];
  validate(products: ParsedProduct[]): ValidationResult;
}

// 4. Data Normalizer
interface DataNormalizer {
  normalize(products: ParsedProduct[]): NormalizedProduct[];
  enrich(products: NormalizedProduct[]): EnrichedProduct[];
}

// 5. Error Handler
interface ErrorHandler {
  handle(error: ParsingError): void;
  collect(): ParsingError[];
  report(): ErrorReport;
}
```

### Flow parsowania

```
┌─────────────┐
│ Upload File │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  File Reader    │ ← Wykrywa format i wczytuje
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Header Detector │ ← Identyfikuje nagłówki
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Column Mapping  │ ← Mapuje kolumny na model
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Parser    │ ← Parsuje wiersze
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validator     │ ← Waliduje dane
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Normalizer     │ ← Normalizuje i wzbogaca
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Data    │ ← Gotowe dane
└─────────────────┘
```

## 💻 Implementacja TypeScript

### 1. Parser Service

```typescript
class FileParserService {
  private fileReader: FileReader;
  private headerDetector: HeaderDetector;
  private dataParser: DataParser;
  private normalizer: DataNormalizer;
  private errorHandler: ErrorHandler;
  
  constructor() {
    this.fileReader = new FileReader();
    this.headerDetector = new HeaderDetector();
    this.dataParser = new DataParser();
    this.normalizer = new DataNormalizer();
    this.errorHandler = new ErrorHandler();
  }
  
  async parseFile(file: File): Promise<ParsingResult> {
    try {
      // 1. Wykryj format i wczytaj
      const rawData = await this.detectAndRead(file);
      
      // 2. Wykryj nagłówki
      const headers = this.headerDetector.detect(rawData.sheets[0].data);
      
      // 3. Waliduj strukturę
      const structureValid = this.headerDetector.validate(headers);
      if (!structureValid.isValid) {
        throw new ParsingError('Invalid structure', structureValid.errors);
      }
      
      // 4. Mapuj kolumny
      const mapping = this.createColumnMapping(headers);
      
      // 5. Parsuj dane
      const products = this.dataParser.parse(rawData.sheets[0].data, mapping);
      
      // 6. Waliduj dane
      const dataValid = this.dataParser.validate(products);
      
      // 7. Normalizuj
      const normalized = this.normalizer.normalize(products);
      
      // 8. Wzbogać (język, marża, etc.)
      const enriched = this.normalizer.enrich(normalized);
      
      return {
        success: true,
        data: {
          fileName: file.name,
          paletaId: this.extractPaletaId(file.name, enriched),
          products: enriched,
          metadata: this.generateMetadata(enriched)
        },
        errors: this.errorHandler.collect(),
        warnings: dataValid.warnings
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errors: this.errorHandler.collect()
      };
    }
  }
  
  private async detectAndRead(file: File): Promise<RawFileData> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'xlsx':
        return this.fileReader.readXLSX(file);
      case 'csv':
        return this.fileReader.readCSV(file);
      case 'pdf':
        return this.fileReader.readPDF(file);
      default:
        throw new Error(`Unsupported file format: ${extension}`);
    }
  }
}
```

### 2. XLSX Parser (SheetJS)

```typescript
class XLSXParser implements FileReader {
  async readXLSX(file: File): Promise<RawFileData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheets = workbook.SheetNames.map(sheetName => ({
            name: sheetName,
            data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              header: 1,  // Zwróć jako array of arrays
              raw: false, // Konwertuj na stringi
              defval: ''  // Puste komórki jako ''
            })
          }));
          
          resolve({
            fileName: file.name,
            fileSize: file.size,
            sheets
          });
        } catch (error) {
          reject(new ParsingError('Failed to parse XLSX', error));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
}
```

### 3. Header Detector

```typescript
class HeaderDetector {
  private knownHeaders = {
    paleta: ['Paleta', 'Pallet', 'ID', 'PalletId'],
    nazwa: ['Nazwa', 'Name', 'Product Name', 'Produkt', 'Description'],
    foto: ['Foto', 'Photo', 'Image', 'Zdjęcie'],
    ean: ['EAN', 'EAN13', 'Barcode', 'Code'],
    kod1: ['Kod 1', 'Code 1', 'LPN'],
    kod2: ['Kod 2', 'Code 2', 'ASIN'],
    packId: ['PackId', 'Pack ID', 'Shipping ID'],
    kategoria: ['Kategoria', 'Category', 'Kat.', 'Type'],
    pcs: ['PCS', 'Quantity', 'Qty', 'Ilość', 'Sztuki'],
    cenaBrutto: ['Cena regularna brutto', 'Price Gross', 'Retail Price'],
    waluta: ['Waluta', 'Currency', 'Curr.'],
    cenaNetto: ['Cena sprzedaży netto', 'Price Net', 'Sale Price'],
    link: ['Link', 'URL', 'Product Link'],
    fcSku: ['FCSku', 'FC SKU', 'SKU']
  };
  
  detect(data: any[][]): HeaderMapping {
    if (!data || data.length === 0) {
      throw new Error('No data to detect headers from');
    }
    
    const firstRow = data[0];
    const mapping: HeaderMapping = {};
    
    // Dla każdego znanego pola
    Object.entries(this.knownHeaders).forEach(([field, possibleNames]) => {
      // Znajdź pasującą kolumnę
      const colIndex = firstRow.findIndex(header => 
        possibleNames.some(name => 
          this.fuzzyMatch(header?.toString() || '', name)
        )
      );
      
      if (colIndex !== -1) {
        mapping[field] = {
          columnIndex: colIndex,
          columnName: firstRow[colIndex],
          confidence: this.calculateConfidence(firstRow[colIndex], possibleNames)
        };
      }
    });
    
    return mapping;
  }
  
  private fuzzyMatch(a: string, b: string): boolean {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalize(a) === normalize(b) || 
           normalize(a).includes(normalize(b)) ||
           normalize(b).includes(normalize(a));
  }
  
  private calculateConfidence(found: string, expected: string[]): number {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundNorm = normalize(found);
    
    // Exact match = 100%
    if (expected.some(e => normalize(e) === foundNorm)) {
      return 1.0;
    }
    
    // Partial match = 70%
    if (expected.some(e => foundNorm.includes(normalize(e)))) {
      return 0.7;
    }
    
    // Fuzzy match = 50%
    return 0.5;
  }
}
```

### 4. Data Validator

```typescript
class DataValidator {
  validateProduct(product: ParsedProduct): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Wymagane pola
    if (!product.paletaId) errors.push('Missing Paleta ID');
    if (!product.name) errors.push('Missing product name');
    if (!product.category) errors.push('Missing category');
    if (!product.quantity || product.quantity <= 0) {
      errors.push('Invalid quantity');
    }
    
    // Walidacja EAN
    if (product.identifiers.ean && !this.validateEAN(product.identifiers.ean)) {
      warnings.push(`Invalid EAN: ${product.identifiers.ean}`);
    }
    
    // Walidacja cen
    if (product.pricing.priceGross && product.pricing.priceNet) {
      if (product.pricing.priceGross < product.pricing.priceNet) {
        warnings.push('Price gross is lower than price net');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private validateEAN(ean: string): boolean {
    // EAN-13 validation
    if (!/^\d{13}$/.test(ean)) return false;
    
    // Checksum validation
    const digits = ean.split('').map(Number);
    const checksum = digits.pop()!;
    const sum = digits.reduce((acc, digit, i) => 
      acc + digit * (i % 2 === 0 ? 1 : 3), 0
    );
    const calculatedChecksum = (10 - (sum % 10)) % 10;
    
    return checksum === calculatedChecksum;
  }
}
```

## 🚨 Error Handling

### Typy błędów

```typescript
enum ParsingErrorType {
  FILE_READ_ERROR = 'FILE_READ_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT',
  MISSING_HEADERS = 'MISSING_HEADERS',
  INVALID_DATA = 'INVALID_DATA',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

class ParsingError extends Error {
  constructor(
    public type: ParsingErrorType,
    public message: string,
    public details?: any,
    public rowNumber?: number
  ) {
    super(message);
  }
}
```

### Error handling strategy

```typescript
class ErrorHandler {
  private errors: ParsingError[] = [];
  
  handle(error: ParsingError): void {
    this.errors.push(error);
    
    // Log do konsoli w dev mode
    if (process.env.NODE_ENV === 'development') {
      console.error('Parsing error:', error);
    }
    
    // Możliwość wysłania do monitoring service
    // this.sendToMonitoring(error);
  }
  
  collect(): ParsingError[] {
    return this.errors;
  }
  
  report(): ErrorReport {
    return {
      totalErrors: this.errors.length,
      errorsByType: this.groupByType(),
      criticalErrors: this.errors.filter(e => this.isCritical(e)),
      errorDetails: this.errors
    };
  }
  
  private isCritical(error: ParsingError): boolean {
    return [
      ParsingErrorType.FILE_READ_ERROR,
      ParsingErrorType.INVALID_FORMAT
    ].includes(error.type);
  }
}
```

## 📊 Performance Optimization

### Streaming dla dużych plików

```typescript
class StreamingParser {
  async parseXLSXStream(file: File): Promise<AsyncIterable<Product>> {
    const stream = XLSX.stream.read(await file.arrayBuffer());
    
    return {
      async *[Symbol.asyncIterator]() {
        for await (const row of stream) {
          yield parseRow(row);
        }
      }
    };
  }
}
```

### Batch processing

```typescript
class BatchProcessor {
  async processBatch(products: Product[], batchSize = 100): Promise<void> {
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      await this.processBatchInternal(batch);
      
      // Yield control to browser
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('FileParserService', () => {
  it('should parse valid XLSX file', async () => {
    const file = createMockFile('test.xlsx');
    const result = await parser.parseFile(file);
    
    expect(result.success).toBe(true);
    expect(result.data.products).toHaveLength(82);
  });
  
  it('should detect headers correctly', () => {
    const headers = headerDetector.detect(mockData);
    
    expect(headers.paleta).toBeDefined();
    expect(headers.nazwa).toBeDefined();
    expect(headers.kategoria).toBeDefined();
  });
  
  it('should validate EAN correctly', () => {
    expect(validator.validateEAN('6975828000119')).toBe(true);
    expect(validator.validateEAN('1234567890123')).toBe(false);
  });
});
```

---

*Specyfikacja parsera utworzona: Styczeń 2025*  
*Wersja: 1.0*
