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
    console.log('ParserService: Rozpoczynanie parsowania pliku:', file.name, file.type, file.size)
    
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
      console.log('ParserService: Postęp 10% - Rozpoczynanie parsowania')
      
      // Symulacja krótkiego opóźnienia
      await new Promise(resolve => setTimeout(resolve, 100))

      // Określenie typu pliku i wywołanie odpowiedniego parsera
      console.log('ParserService: Określanie typu pliku:', file.type, file.name)
      
      if (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        console.log('ParserService: Parsowanie jako XLSX')
        result.products = await this.parseXLSX(file, onProgress)
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        console.log('ParserService: Parsowanie jako CSV')
        result.products = await this.parseCSV(file, onProgress)
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        console.log('ParserService: Parsowanie jako PDF')
        result.products = await this.parsePDF(file, onProgress)
      } else {
        console.error('ParserService: Nieobsługiwany typ pliku:', file.type)
        throw new Error(`Nieobsługiwany format pliku: ${file.type}`)
      }
      
      console.log('ParserService: Parsowanie zakończone, znaleziono produktów:', result.products.length)

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
      console.error('ParserService: Błąd parsowania:', error)
      result.status = 'error'
      result.error = error instanceof Error ? error.message : 'Nieznany błąd parsowania'
      result.progress = 0
    }

    console.log('ParserService: Zwracanie wyniku:', result.status, result.products.length, 'produktów')
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
        complete: (results: any) => {
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
        error: (error: any) => {
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
    
    // Inteligentne wykrywanie nagłówków - znajdź wiersz z największą liczbą stringów
    let headerRowIndex = 0
    let maxStringCount = 0
    
    for (let i = 0; i < Math.min(5, rawData.length); i++) {
      const row = rawData[i]
      if (!row) continue
      
      const stringCount = row.filter(cell => typeof cell === 'string' && cell.trim().length > 0).length
      console.log(`🔍 Wiersz ${i}: ${stringCount} stringów, pierwsze 3:`, row.slice(0, 3))
      
      if (stringCount > maxStringCount) {
        maxStringCount = stringCount
        headerRowIndex = i
      }
    }
    
    console.log(`✅ Wybrano wiersz ${headerRowIndex} jako nagłówki (${maxStringCount} stringów)`)
    
    const headers = rawData[headerRowIndex] as string[]
    
    console.log('🔄 normalizeData started with headers:', headers)
    console.log('📊 Headers types in normalizeData:', headers.map(h => ({ value: h, type: typeof h })))
    
    // Mapowanie kolumn
    const columnMap = this.createColumnMap(headers)
    
    // Przetwarzanie wierszy danych - zaczynamy od wiersza po nagłówkach
    for (let i = headerRowIndex + 1; i < rawData.length; i++) {
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
        
        // Sprawdź czy header jest stringiem
        if (!header || typeof header !== 'string') {
          console.warn(`⚠️ Nieprawidłowy header w normalizeData [${index}]:`, header, typeof header)
          console.warn(`⚠️ Row data:`, row)
          console.warn(`⚠️ Headers:`, headers)
          return
        }
        
        product.rawData![header] = value
        
        const lowerHeader = header.toLowerCase()
        
        // Mapowanie do standardowych pól
        if (columnMap.name && lowerHeader.includes(columnMap.name.toLowerCase())) {
          product.name = String(value || '').trim()
        }
        if (columnMap.category && lowerHeader.includes(columnMap.category.toLowerCase())) {
          product.category = String(value || '').trim()
        }
        if (columnMap.price && lowerHeader.includes(columnMap.price.toLowerCase())) {
          product.price = this.parsePrice(String(value || ''))
        }
        if (columnMap.quantity && lowerHeader.includes(columnMap.quantity.toLowerCase())) {
          product.quantity = this.parseQuantity(String(value || ''))
        }
        if (columnMap.description && lowerHeader.includes(columnMap.description.toLowerCase())) {
          product.description = String(value || '').trim()
        }
        if (columnMap.sku && lowerHeader.includes(columnMap.sku.toLowerCase())) {
          product.sku = String(value || '').trim()
        }
        if (columnMap.unit && lowerHeader.includes(columnMap.unit.toLowerCase())) {
          product.unit = String(value || '').trim()
        }
        if (columnMap.brand && lowerHeader.includes(columnMap.brand.toLowerCase())) {
          product.brand = String(value || '').trim()
        }
        
        // Mapowanie pól specyficznych dla palet
        if (header === 'Paleta') {
          product.paletaId = String(value || '').trim()
        }
        if (header === 'Foto') {
          product.foto = String(value || '').trim()
        }
        if (header === 'EAN') {
          product.ean = String(value || '').trim()
        }
        if (header === 'Kod 1') {
          product.code1 = String(value || '').trim()
        }
        if (header === 'Kod 2') {
          product.code2 = String(value || '').trim()
        }
        if (header === 'PackId') {
          product.packId = String(value || '').trim()
        }
        if (header === 'FCSku') {
          product.fcSku = String(value || '').trim()
        }
        if (header === 'Link') {
          product.link = String(value || '').trim()
        }
        if (header === 'PCS') {
          product.quantity = this.parseQuantity(String(value || ''))
        }
        if (header === 'Cena regularna brutto') {
          product.priceGross = this.parsePrice(String(value || ''))
        }
        if (header === 'Cena sprzedaży netto') {
          product.priceNet = this.parsePrice(String(value || ''))
        }
        if (lowerHeader.includes('waluta') || lowerHeader === 'currency') {
          product.currency = String(value || 'PLN').trim()
        }
      })
      
      // Dodanie produktu tylko jeśli ma nazwę
      if (product.name) {
        // Debug - pokaż pierwsze 3 produkty
        if (products.length < 3) {
          console.log(`✅ Produkt ${products.length + 1}:`, {
            name: product.name,
            category: product.category,
            quantity: product.quantity,
            priceGross: product.priceGross,
            priceNet: product.priceNet,
            paletaId: product.paletaId,
            ean: product.ean
          })
        }
        products.push(product)
      }
    }
    
    console.log(`✅ normalizeData zakończone: ${products.length} produktów`)
    return products
  }

  // Tworzenie mapy kolumn na podstawie nagłówków
  private createColumnMap(headers: string[]): Record<string, string> {
    const map: Record<string, string> = {}
    
    console.log('🔍 Parsing headers:', headers)
    console.log('📊 Headers types:', headers.map(h => ({ value: h, type: typeof h })))
    
    headers.forEach((header, index) => {
      // Sprawdź czy header jest stringiem i nie jest pusty
      if (!header || typeof header !== 'string') {
        console.warn(`⚠️ Nieprawidłowy header [${index}]:`, header, typeof header)
        return
      }
      
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
    
    console.log('✅ Column map created:', map)
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
