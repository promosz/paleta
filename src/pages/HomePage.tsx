import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import FileUpload from '../components/FileUpload'
import AnalysisList from '../components/AnalysisList'
import { AIService, AIAnalysisResult, PaletteAnalysisResult } from '../services/aiService'
import { hybridAIService } from '../services/hybridAIService'
import { Brain, Zap, TrendingUp } from 'lucide-react'

interface Product {
  paleta: string
  nazwa: string
  foto: string
  ean: string
  kod1: string
  kod2: string
  packId: string
  kategoria: string
  pcs: number
  cenaRegularnaBrutto: number
  waluta: string
  cenaSprzedazyNetto: number
  walutaSprzedazy: string
  link: string
  fcSku: string
  wartoscSprzedazyNetto: number
  // Obliczone pola
  marza: number
  rentownosc: number
}

interface AnalysisResult {
  id: string
  fileName: string
  uploadDate: string
  status: 'processing' | 'completed' | 'error'
  profitability: number | null
  productCount: number | null
  issues: number | null
  products: Product[]
  summary: {
    totalRevenue: number
    totalCost: number
    averageProfitability: number
    lowProfitability: Product[]
    mediumProfitability: Product[]
    highProfitability: Product[]
  }
  aiAnalysis?: {
    productAnalyses: AIAnalysisResult[]
    paletteAnalysis: PaletteAnalysisResult
  }
}

const HomePage: React.FC = () => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>(() => {
    // Spróbuj załadować z localStorage
    const savedAnalyses = localStorage.getItem('pallet-analyses')
    if (savedAnalyses) {
      try {
        return JSON.parse(savedAnalyses)
      } catch (error) {
        console.error('Błąd ładowania analiz z localStorage:', error)
      }
    }
    
    // Fallback do przykładowych danych
    return [
    {
      id: '1',
      fileName: 'Przykładowy_plik_do_analizy.xlsx',
      uploadDate: '2024-01-15',
      status: 'completed',
      profitability: 78.5,
      productCount: 3,
      issues: 2,
      products: [
        { 
          paleta: 'F20351', 
          nazwa: 'Electric Car Charger [11kW, Three Phase, 7m, 6-16A] with Schuko dé Type 2 Adapter CEE Socket EV Charger Mobile / Wallbox Charging Station with Digital Display', 
          foto: 'https://example.com/charger.jpg', 
          ean: '6975828000119', 
          kod1: 'LPNHE979260590', 
          kod2: 'B0C4TPG8P8', 
          packId: '1Z7E45296840145543', 
          kategoria: 'AUTOMOTIVE', 
          pcs: 1, 
          cenaRegularnaBrutto: 1073.6, 
          waluta: 'PLN', 
          cenaSprzedazyNetto: 193.25, 
          walutaSprzedazy: 'PLN', 
          link: '', 
          fcSku: 'X001TNT5NN', 
          wartoscSprzedazyNetto: 193.25, 
          marza: 880.35, 
          rentownosc: 82.0 
        },
        { 
          paleta: 'F20351', 
          nazwa: 'dé Typ 2 Verlängerungskabel [15m, 22kW, 32A] 3-Phasen Ladekabel 400V, Schutzart IP54, kompatibel mit Allen IEC62196-2 BEV und HPEV, mit Tragetasche', 
          foto: 'https://example.com/cable.jpg', 
          ean: '6975828001802', 
          kod1: 'LPNHE997930890', 
          kod2: 'B0DLNN9TFH', 
          packId: '1Z7E45296840145543', 
          kategoria: 'AUTOMOTIVE', 
          pcs: 1, 
          cenaRegularnaBrutto: 1002, 
          waluta: 'PLN', 
          cenaSprzedazyNetto: 180.36, 
          walutaSprzedazy: 'PLN', 
          link: '', 
          fcSku: 'X002DJWW5P', 
          wartoscSprzedazyNetto: 180.36, 
          marza: 821.64, 
          rentownosc: 82.0 
        },
        { 
          paleta: 'F20351', 
          nazwa: 'FreeTec 21-Piece Pneumatic Injector Puller, Diesel Injector Extractor for Diesel Engines, Diesel Injectors Puller Set (21 Pieces)', 
          foto: 'https://example.com/puller.jpg', 
          ean: '', 
          kod1: 'LPNHE829891552', 
          kod2: 'B0D7PS5V3H', 
          packId: '1ZV8K9116840037616', 
          kategoria: 'AUTOMOTIVE', 
          pcs: 1, 
          cenaRegularnaBrutto: 465.12, 
          waluta: 'PLN', 
          cenaSprzedazyNetto: 83.72, 
          walutaSprzedazy: 'PLN', 
          link: '', 
          fcSku: 'X002CFMZCF', 
          wartoscSprzedazyNetto: 83.72, 
          marza: 381.4, 
          rentownosc: 82.0 
        }
      ],
      summary: {
        totalRevenue: 0,
        totalCost: 0,
        averageProfitability: 0,
        lowProfitability: [],
        mediumProfitability: [],
        highProfitability: []
      }
    }
    ]
  })

  const [aiServiceStatus, setAiServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [hybridAIStatus, setHybridAIStatus] = useState<any>({
    active: 'none',
    cloud: 'checking',
    browser: 'checking',
    docker: 'checking'
  })
  const aiService = AIService.getInstance()

  useEffect(() => {
    // Check AI service health on component mount
    checkAIServiceHealth()
    checkHybridAIHealth()
  }, [])

  const checkHybridAIHealth = async () => {
    try {
      const status = await hybridAIService.checkAllServices()
      setHybridAIStatus(status)
    } catch (error) {
      console.error('Hybrid AI health check failed:', error)
    }
  }

  const checkAIServiceHealth = async () => {
    try {
      const isHealthy = await aiService.checkHealth()
      setAiServiceStatus(isHealthy ? 'online' : 'offline')
    } catch (error) {
      setAiServiceStatus('offline')
    }
  }

  // Enhanced AI-powered analysis function
  const performAIAnalysis = async (products: Product[]): Promise<{
    productAnalyses: AIAnalysisResult[]
    paletteAnalysis: PaletteAnalysisResult
  }> => {
    try {
      // Use Hybrid AI Service for analysis
      const productAnalyses = await Promise.all(
        products.map(async (product) => {
          return await hybridAIService.normalizeProduct(product.nazwa, product.kategoria)
        })
      )

      // Analyze the entire palette
      const productNames = products.map(p => p.nazwa)
      const paletteAnalysis = await hybridAIService.analyzePalette(productNames)

      return { productAnalyses, paletteAnalysis }
    } catch (error) {
      console.error('Hybrid AI analysis failed:', error)
      // Fallback to legacy AI service
      try {
        const productAnalyses = await Promise.all(
          products.map(async (product) => {
            return await aiService.normalizeProduct(product.nazwa, product.kategoria)
          })
        )
        const productNames = products.map(p => p.nazwa)
        const paletteAnalysis = await aiService.analyzePalette(productNames)
        return { productAnalyses, paletteAnalysis }
      } catch (fallbackError) {
        console.error('Fallback AI analysis also failed:', fallbackError)
        throw error
      }
    }
  }

  const analyzeExcelFile = (file: File): Promise<AnalysisResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Pobierz pierwszą kartę arkusza
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Konwertuj arkusz na JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          // Znajdź wiersz z nagłówkami (pierwszy wiersz)
          const headers = jsonData[0] as string[]
          const dataRows = jsonData.slice(1).filter((row: any) => 
            row && row.length > 0 && row[0] !== null && row[0] !== undefined && row[1] !== null && row[1] !== undefined && 
            row[1] !== '' && row[1] !== 'Nazwa produktu' // Wyklucz nagłówki i puste nazwy
          )
          
          // Mapuj kolumny na właściwe nazwy zgodnie z nowym formatem
          const columnMap: { [key: string]: number } = {}
          headers.forEach((header, index) => {
            if (header === 'Paleta') columnMap.paleta = index
            else if (header === 'Nazwa') columnMap.nazwa = index
            else if (header === 'Foto') columnMap.foto = index
            else if (header === 'EAN') columnMap.ean = index
            else if (header === 'Kod 1') columnMap.kod1 = index
            else if (header === 'Kod 2') columnMap.kod2 = index
            else if (header === 'PackId') columnMap.packId = index
            else if (header === 'Kategoria') columnMap.kategoria = index
            else if (header === 'PCS') columnMap.pcs = index
            else if (header === 'Cena regularna brutto') columnMap.cenaRegularnaBrutto = index
            else if (header === 'Cena sprzedaży netto') columnMap.cenaSprzedazyNetto = index
            else if (header === 'Link') columnMap.link = index
            else if (header === 'FCSku') columnMap.fcSku = index
            else if (header === 'Wartość sprzedaży netto') columnMap.wartoscSprzedazyNetto = index
          })
          
          // Przetwórz dane
          const products: Product[] = (dataRows as any[][]).map((row: any[]) => {
            const paleta = row[columnMap.paleta] || ''
            const nazwa = row[columnMap.nazwa] || 'Nieznany produkt'
            const foto = row[columnMap.foto] || ''
            const ean = row[columnMap.ean] || ''
            const kod1 = row[columnMap.kod1] || ''
            const kod2 = row[columnMap.kod2] || ''
            const packId = row[columnMap.packId] || ''
            const kategoria = row[columnMap.kategoria] || 'Brak kategorii'
            const pcs = parseInt(row[columnMap.pcs]) || 1
            const cenaRegularnaBrutto = parseFloat(row[columnMap.cenaRegularnaBrutto]) || 0
            const cenaSprzedazyNetto = parseFloat(row[columnMap.cenaSprzedazyNetto]) || 0
            const link = row[columnMap.link] || ''
            const fcSku = row[columnMap.fcSku] || ''
            const wartoscSprzedazyNetto = parseFloat(row[columnMap.wartoscSprzedazyNetto]) || cenaSprzedazyNetto
            
            // Oblicz marżę i rentowność
            const marza = cenaRegularnaBrutto - cenaSprzedazyNetto
            const rentownosc = cenaRegularnaBrutto > 0 ? ((marza / cenaRegularnaBrutto) * 100) : 0
            
            return {
              paleta: String(paleta),
              nazwa: String(nazwa),
              foto: String(foto),
              ean: String(ean),
              kod1: String(kod1),
              kod2: String(kod2),
              packId: String(packId),
              kategoria: String(kategoria),
              pcs: Number(pcs),
              cenaRegularnaBrutto: Number(cenaRegularnaBrutto),
              waluta: 'PLN',
              cenaSprzedazyNetto: Number(cenaSprzedazyNetto),
              walutaSprzedazy: 'PLN',
              link: String(link),
              fcSku: String(fcSku),
              wartoscSprzedazyNetto: Number(wartoscSprzedazyNetto),
              marza: Number(marza),
              rentownosc: Number(rentownosc)
            }
          }).filter(product => product.nazwa !== 'Nieznany produkt' && product.nazwa.trim() !== '')
          
          // Oblicz podsumowanie
          const totalRevenue = products.reduce((sum, p) => sum + p.cenaRegularnaBrutto, 0)
          const totalCost = products.reduce((sum, p) => sum + p.cenaSprzedazyNetto, 0)
          const averageProfitability = products.reduce((sum, p) => sum + p.rentownosc, 0) / products.length
          
          // Podziel produkty na kategorie rentowności
          const lowProfitability = products.filter(p => p.rentownosc < 60)
          const mediumProfitability = products.filter(p => p.rentownosc >= 60 && p.rentownosc < 80)
          const highProfitability = products.filter(p => p.rentownosc >= 80)
          
          // Policz problemy (produkty o niskiej rentowności)
          const issues = lowProfitability.length
          
          const result: AnalysisResult = {
            id: Date.now().toString(),
            fileName: file.name,
            uploadDate: new Date().toISOString(),
            status: 'completed',
            profitability: Number(averageProfitability.toFixed(1)),
            productCount: products.length,
            issues: issues,
            products: products,
            summary: {
              totalRevenue,
              totalCost,
              averageProfitability: Number(averageProfitability.toFixed(1)),
              lowProfitability,
              mediumProfitability,
              highProfitability
            }
          }
          
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Błąd odczytu pliku'))
      reader.readAsArrayBuffer(file)
    })
  }

  const handleFileUpload = async (file: File) => {
    // Dodaj plik jako "w trakcie analizy"
    const tempAnalysis: AnalysisResult = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      profitability: null,
      productCount: null,
      issues: null,
      products: [],
      summary: {
        totalRevenue: 0,
        totalCost: 0,
        averageProfitability: 0,
        lowProfitability: [],
        mediumProfitability: [],
        highProfitability: []
      }
    }
    
    setAnalyses(prev => [tempAnalysis, ...prev])
    
    try {
      // Przeprowadź rzeczywistą analizę
      const result = await analyzeExcelFile(file)
      
      // Enhanced with AI analysis if service is available
      let enhancedResult = result
      if (aiServiceStatus === 'online' || hybridAIStatus.active !== 'none') {
        try {
          const aiAnalysis = await performAIAnalysis(result.products)
          enhancedResult = {
            ...result,
            aiAnalysis: aiAnalysis
          }
        } catch (aiError) {
          console.warn('AI analysis failed, using basic analysis:', aiError)
        }
      }
      
      // Zaktualizuj listę analiz
      setAnalyses(prev => {
        const updated = prev.map(analysis => 
          analysis.id === tempAnalysis.id ? enhancedResult : analysis
        )
        // Zapisz do localStorage
        localStorage.setItem('pallet-analyses', JSON.stringify(updated))
        return updated
      })
    } catch (error) {
      console.error('Błąd analizy pliku:', error)
      
      // Oznacz jako błąd
      setAnalyses(prev => 
        prev.map(analysis => 
          analysis.id === tempAnalysis.id 
            ? { ...analysis, status: 'error' as const }
            : analysis
        )
      )
    }
  }

  return (
    <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pallet Analysis
              </h2>
              <div className="w-full">
                <p className="text-base text-gray-600 text-center">
                  Prześlij dokument Excel z zestawami produktów, aby przeprowadzić analizę rentowności
                  i sprawdzić zgodność z ustalonymi regułami.
                </p>
              </div>
              
              {/* AI Status Indicator */}
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">AI Services:</span>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  hybridAIStatus.active !== 'none'
                    ? 'bg-green-100 text-green-800' 
                    : aiServiceStatus === 'online'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hybridAIStatus.active !== 'none' && <Zap className="h-3 w-3" />}
                  {hybridAIStatus.active === 'none' && aiServiceStatus === 'online' && <Brain className="h-3 w-3" />}
                  {hybridAIStatus.active === 'none' && aiServiceStatus === 'offline' && <TrendingUp className="h-3 w-3" />}
                  <span>
                    {hybridAIStatus.active !== 'none' 
                      ? `HYBRID ${hybridAIStatus.active.toUpperCase()}`
                      : aiServiceStatus.toUpperCase()
                    }
                  </span>
                </div>
              </div>
            </div>

      {/* Upload Section - Main Focus */}
      <div className="card">
        <div className="text-center">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>

      {/* Analysis List */}
      {analyses.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Wcześniejsze analizy
          </h3>
          <AnalysisList analyses={analyses} />
        </div>
      )}
    </div>
  )
}

export default HomePage