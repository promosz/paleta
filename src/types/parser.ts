// Typy dla parserów plików

// Wspólny format danych po parsowaniu
export interface ParsedProduct {
  id: string
  name: string
  category?: string
  price?: number
  quantity?: number
  description?: string
  sku?: string
  unit?: string
  brand?: string
  source?: string // Źródło danych (nazwa pliku)
  rowIndex?: number // Indeks wiersza w oryginalnym pliku
  rawData?: Record<string, any> // Oryginalne dane z pliku
  
  // Dodatkowe pola specyficzne dla palet
  paletaId?: string
  foto?: string
  code1?: string
  code2?: string
  packId?: string
  fcSku?: string
  link?: string
  currency?: string
  priceGross?: number
  priceNet?: number
  ean?: string
}

// Status parsowania
export type ParseStatus = 'pending' | 'parsing' | 'success' | 'error'

// Wynik parsowania pliku
export interface ParseResult {
  fileId: string
  fileName: string
  status: ParseStatus
  products: ParsedProduct[]
  error?: string
  progress: number
  parsedAt?: Date
  metadata?: {
    totalRows: number
    validRows: number
    invalidRows: number
    columns: string[]
    fileSize: number
    fileType: string
  }
}

// Konfiguracja parsera
export interface ParserConfig {
  // Mapowanie kolumn
  columnMapping: {
    name?: string
    category?: string
    price?: string
    quantity?: string
    description?: string
    sku?: string
    unit?: string
    brand?: string
  }
  // Opcje parsowania
  options: {
    skipEmptyRows: boolean
    skipHeaderRow: boolean
    maxRows?: number
    encoding?: string
    delimiter?: string
  }
}

// Callback dla postępu parsowania
export type ParseProgressCallback = (progress: number, status: string) => void

// Callback dla zakończenia parsowania
export type ParseCompleteCallback = (result: ParseResult) => void

// Typy dla różnych formatów plików
export interface XLSXParseOptions {
  sheetName?: string
  range?: string
  headerRow?: number
}

export interface CSVParseOptions {
  delimiter?: string
  encoding?: string
  skipEmptyLines?: boolean
  headerRow?: number
}

export interface PDFParseOptions {
  pageRange?: string
  extractTables?: boolean
  extractText?: boolean
}
