import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import * as pdfjsLib from 'pdfjs-dist'
import type { 
  ParsedProduct, 
  ParseResult, 
  ParserConfig, 
  ParseProgressCallback
} from '../types/parser'

// Konfiguracja PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Domyślna konfiguracja parsera
const defaultConfig: ParserConfig = {
  columnMapping: {
    name: 'nazwa',
    category: 'kategoria',
    price: 'cena',
    quantity: 'ilosc',
    description: 'opis',
    sku: 'sku',
    unit: 'jednostka',
    brand: 'marka'
  },
  options: {
    skipEmptyRows: true,
    skipHeaderRow: true,
    maxRows: 10000,
    encoding: 'utf-8'
  }
}

// Klasa głównego serwisu parsera
export class ParserService {
  private config: ParserConfig

  constructor(config: Partial<ParserConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  // Główna metoda parsowania pliku
  async parseFile(
    file: File, 
    onProgress?: ParseProgressCallback
  ): Promise<ParseResult> {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const result: ParseResult = {
      fileId,
      fileName: file.name,
      status: 'parsing',
      products: [],
      progress: 0,
      metadata: {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        columns: [],
        fileSize: file.size,
        fileType: file.type
      }
    }

    try {
      onProgress?.(10, 'Rozpoczynanie parsowania...')

      // Określenie typu pliku i wywołanie odpowiedniego parsera
      if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        result.products = await this.parseXLSX(file, onProgress)
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        result.products = await this.parseCSV(file, onProgress)
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        result.products = await this.parsePDF(file, onProgress)
      } else {
        throw new Error(`Nieobsługiwany format pliku: ${file.type}`)
      }

      onProgress?.(90, 'Finalizowanie wyników...')

      // Aktualizacja metadanych
      result.metadata!.totalRows = result.products.length
      result.metadata!.validRows = result.products.filter(p => p.name && p.name.trim()).length
      result.metadata!.invalidRows = result.metadata!.totalRows - result.metadata!.validRows
      result.metadata!.columns = this.extractColumns(result.products)

      result.status = 'success'
      result.progress = 100
      result.parsedAt = new Date()

      onProgress?.(100, 'Parsowanie zakończone')

    } catch (error) {
      result.status = 'error'
      result.error = error instanceof Error ? error.message : 'Nieznany błąd parsowania'
      result.progress = 0
    }

    return result
  }

  // Parser dla plików XLSX/XLS
  private async parseXLSX(
    file: File, 
    onProgress?: ParseProgressCallback
  ): Promise<ParsedProduct[]> {
    onProgress?.(20, 'Wczytywanie pliku Excel...')

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          onProgress?.(40, 'Parsowanie arkusza...')
          
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Wybieranie pierwszego arkusza
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          onProgress?.(60, 'Konwersja danych...')
          
          // Konwersja do JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
          
          onProgress?.(80, 'Normalizacja danych...')
          
          // Normalizacja danych
          const products = this.normalizeData(jsonData, file.name)
          
          resolve(products)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Błąd odczytu pliku'))
      reader.readAsArrayBuffer(file)
    })
  }

  // Parser dla plików CSV
  private async parseCSV(
    file: File, 
    onProgress?: ParseProgressCallback
  ): Promise<ParsedProduct[]> {
    onProgress?.(20, 'Wczytywanie pliku CSV...')

    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: this.config.options.skipEmptyRows,
        encoding: this.config.options.encoding,
        delimiter: this.config.options.delimiter,
        complete: (results) => {
          try {
            onProgress?.(60, 'Normalizacja danych...')
            
            // Konwersja do formatu tablicowego
            const jsonData = results.data.map((row: any) => 
              Object.values(row)
            )
            
            // Dodanie nagłówków na początku
            if (results.meta.fields) {
              jsonData.unshift(results.meta.fields)
            }
            
            const products = this.normalizeData(jsonData, file.name)
            resolve(products)
          } catch (error) {
            reject(error)
          }
        },
        error: (error) => {
          reject(new Error(`Błąd parsowania CSV: ${error.message}`))
        }
      })
    })
  }

  // Parser dla plików PDF
  private async parsePDF(
    file: File, 
    onProgress?: ParseProgressCallback
  ): Promise<ParsedProduct[]> {
    onProgress?.(20, 'Wczytywanie pliku PDF...')

    try {
      const arrayBuffer = await file.arrayBuffer()
      onProgress?.(40, 'Parsowanie PDF...')
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      const numPages = pdf.numPages
      
      let allText = ''
      
      // Parsowanie wszystkich stron
      for (let i = 1; i <= numPages; i++) {
        onProgress?.(40 + (i / numPages) * 30, `Parsowanie strony ${i}/${numPages}...`)
        
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        
        allText += pageText + '\n'
      }
      
      onProgress?.(80, 'Normalizacja danych...')
      
      // Próba wyodrębnienia danych tabelarycznych z tekstu
      const products = this.extractTableDataFromText(allText, file.name)
      
      return products
    } catch (error) {
      throw new Error(`Błąd parsowania PDF: ${error instanceof Error ? error.message : 'Nieznany błąd'}`)
    }
  }

  // Normalizacja danych do wspólnego formatu
  private normalizeData(rawData: any[][], source: string): ParsedProduct[] {
    if (!rawData || rawData.length === 0) {
      return []
    }

    const products: ParsedProduct[] = []
    const headers = rawData[0] as string[]
    
    // Mapowanie kolumn
    const columnMap = this.createColumnMap(headers)
    
    // Przetwarzanie wierszy danych
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i]
      
      if (!row || row.length === 0) continue
      
      const product: ParsedProduct = {
        id: `${source}-${i}-${Date.now()}`,
        name: '',
        source,
        rowIndex: i,
        rawData: {}
      }
      
      // Mapowanie danych z wiersza
      headers.forEach((header, index) => {
        const value = row[index]
        product.rawData![header] = value
        
        // Mapowanie do standardowych pól
        if (columnMap.name && header.toLowerCase().includes(columnMap.name.toLowerCase())) {
          product.name = String(value || '').trim()
        }
        if (columnMap.category && header.toLowerCase().includes(columnMap.category.toLowerCase())) {
          product.category = String(value || '').trim()
        }
        if (columnMap.price && header.toLowerCase().includes(columnMap.price.toLowerCase())) {
          product.price = this.parsePrice(String(value || ''))
        }
        if (columnMap.quantity && header.toLowerCase().includes(columnMap.quantity.toLowerCase())) {
          product.quantity = this.parseQuantity(String(value || ''))
        }
        if (columnMap.description && header.toLowerCase().includes(columnMap.description.toLowerCase())) {
          product.description = String(value || '').trim()
        }
        if (columnMap.sku && header.toLowerCase().includes(columnMap.sku.toLowerCase())) {
          product.sku = String(value || '').trim()
        }
        if (columnMap.unit && header.toLowerCase().includes(columnMap.unit.toLowerCase())) {
          product.unit = String(value || '').trim()
        }
        if (columnMap.brand && header.toLowerCase().includes(columnMap.brand.toLowerCase())) {
          product.brand = String(value || '').trim()
        }
      })
      
      // Dodanie produktu tylko jeśli ma nazwę
      if (product.name) {
        products.push(product)
      }
    }
    
    return products
  }

  // Tworzenie mapy kolumn na podstawie nagłówków
  private createColumnMap(headers: string[]): Record<string, string> {
    const map: Record<string, string> = {}
    
    headers.forEach(header => {
      const lowerHeader = header.toLowerCase()
      
      // Mapowanie na podstawie słów kluczowych
      if (lowerHeader.includes('nazwa') || lowerHeader.includes('name') || lowerHeader.includes('produkt')) {
        map.name = header
      }
      if (lowerHeader.includes('kategoria') || lowerHeader.includes('category') || lowerHeader.includes('typ')) {
        map.category = header
      }
      if (lowerHeader.includes('cena') || lowerHeader.includes('price') || lowerHeader.includes('koszt')) {
        map.price = header
      }
      if (lowerHeader.includes('ilosc') || lowerHeader.includes('quantity') || lowerHeader.includes('sztuk')) {
        map.quantity = header
      }
      if (lowerHeader.includes('opis') || lowerHeader.includes('description') || lowerHeader.includes('uwagi')) {
        map.description = header
      }
      if (lowerHeader.includes('sku') || lowerHeader.includes('kod') || lowerHeader.includes('id')) {
        map.sku = header
      }
      if (lowerHeader.includes('jednostka') || lowerHeader.includes('unit') || lowerHeader.includes('miara')) {
        map.unit = header
      }
      if (lowerHeader.includes('marka') || lowerHeader.includes('brand') || lowerHeader.includes('producent')) {
        map.brand = header
      }
    })
    
    return map
  }

  // Parsowanie ceny
  private parsePrice(value: string): number | undefined {
    if (!value) return undefined
    
    // Usuwanie znaków niebędących cyframi, kropkami i przecinkami
    const cleanValue = value.replace(/[^\d.,]/g, '')
    
    // Zamiana przecinka na kropkę
    const normalizedValue = cleanValue.replace(',', '.')
    
    const parsed = parseFloat(normalizedValue)
    return isNaN(parsed) ? undefined : parsed
  }

  // Parsowanie ilości
  private parseQuantity(value: string): number | undefined {
    if (!value) return undefined
    
    const parsed = parseInt(value.replace(/[^\d]/g, ''))
    return isNaN(parsed) ? undefined : parsed
  }

  // Wyodrębnianie danych tabelarycznych z tekstu PDF
  private extractTableDataFromText(text: string, source: string): ParsedProduct[] {
    const products: ParsedProduct[] = []
    const lines = text.split('\n').filter(line => line.trim())
    
    // Próba znalezienia wzorców tabelarycznych
    let rowIndex = 0
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (!trimmedLine) continue
      
      // Próba parsowania linii jako produkt
      const parts = trimmedLine.split(/\s+/)
      
      if (parts.length >= 2) {
        // Zakładamy, że pierwsza część to nazwa, a ostatnia to cena
        const name = parts.slice(0, -1).join(' ')
        const priceStr = parts[parts.length - 1]
        const price = this.parsePrice(priceStr)
        
        if (name && name.length > 2) {
          products.push({
            id: `${source}-${rowIndex}-${Date.now()}`,
            name: name.trim(),
            price,
            source,
            rowIndex,
            rawData: { line: trimmedLine }
          })
          rowIndex++
        }
      }
    }
    
    return products
  }

  // Wyodrębnianie kolumn z produktów
  private extractColumns(products: ParsedProduct[]): string[] {
    const columns = new Set<string>()
    
    products.forEach(product => {
      if (product.rawData) {
        Object.keys(product.rawData).forEach(key => columns.add(key))
      }
    })
    
    return Array.from(columns)
  }

  // Aktualizacja konfiguracji
  updateConfig(newConfig: Partial<ParserConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  // Pobieranie aktualnej konfiguracji
  getConfig(): ParserConfig {
    return { ...this.config }
  }
}

// Eksport domyślnej instancji
export const parserService = new ParserService()
