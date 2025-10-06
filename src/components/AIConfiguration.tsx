import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw,
  Info,
  Zap,
  Database,
  Globe
} from 'lucide-react'

interface AIConfigurationProps {
  onClose: () => void
}

interface AIServiceStatus {
  status: 'online' | 'offline' | 'checking'
  responseTime?: number
  version?: string
  endpoints?: string[]
  lastChecked?: string
}

const AIConfiguration: React.FC<AIConfigurationProps> = ({ onClose }) => {
  const [aiUrl, setAiUrl] = useState('http://localhost:8000')
  const [isTesting, setIsTesting] = useState(false)
  const [serviceStatus, setServiceStatus] = useState<AIServiceStatus>({ status: 'checking' })
  const [isSaving, setIsSaving] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    // Load saved configuration
    const savedUrl = localStorage.getItem('ai-service-url')
    if (savedUrl) {
      setAiUrl(savedUrl)
    }
    
    // Test connection on load
    testConnection()
  }, [])

  const testConnection = async () => {
    setIsTesting(true)
    setServiceStatus({ status: 'checking' })
    
    try {
      const startTime = Date.now()
      const response = await fetch(`${aiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        const data = await response.json()
        setServiceStatus({
          status: 'online',
          responseTime,
          version: data.version || 'Unknown',
          lastChecked: new Date().toLocaleTimeString('pl-PL')
        })
      } else {
        setServiceStatus({
          status: 'offline',
          lastChecked: new Date().toLocaleTimeString('pl-PL')
        })
      }
    } catch (error) {
      console.error('AI service test failed:', error)
      setServiceStatus({
        status: 'offline',
        lastChecked: new Date().toLocaleTimeString('pl-PL')
      })
    } finally {
      setIsTesting(false)
    }
  }

  const saveConfiguration = async () => {
    setIsSaving(true)
    
    try {
      // Save to localStorage
      localStorage.setItem('ai-service-url', aiUrl)
      
      // Test connection after saving
      await testConnection()
      
      // Show success message
      alert('Konfiguracja zapisana pomyślnie!')
      
    } catch (error) {
      console.error('Failed to save configuration:', error)
      alert('Błąd podczas zapisywania konfiguracji')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600'
      case 'offline': return 'text-red-600'
      case 'checking': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'offline': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'checking': return <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const resetToDefault = () => {
    setAiUrl('http://localhost:8000')
    localStorage.removeItem('ai-service-url')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Konfiguracja AI Service</h2>
              <p className="text-sm text-gray-600">Ustawienia połączenia z serwisem AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Status AI Service
              </h3>
              <button
                onClick={testConnection}
                disabled={isTesting}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Testuj połączenie</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(serviceStatus.status)}
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium ${getStatusColor(serviceStatus.status)}`}>
                    {serviceStatus.status.toUpperCase()}
                  </p>
                </div>
              </div>
              
              {serviceStatus.responseTime && (
                <div>
                  <p className="text-sm text-gray-600">Czas odpowiedzi</p>
                  <p className="font-medium text-gray-900">
                    {serviceStatus.responseTime}ms
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-600">Ostatnie sprawdzenie</p>
                <p className="font-medium text-gray-900">
                  {serviceStatus.lastChecked || 'Nigdy'}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Konfiguracja połączenia
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="ai-url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL AI Service
                </label>
                <input
                  id="ai-url"
                  type="url"
                  value={aiUrl}
                  onChange={(e) => setAiUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Adres URL serwisu AI (domyślnie: http://localhost:8000)
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={testConnection}
                  disabled={isTesting || !aiUrl}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Zap className="h-4 w-4" />
                  <span>Testuj połączenie</span>
                </button>
                
                <button
                  onClick={saveConfiguration}
                  disabled={isSaving || serviceStatus.status !== 'online'}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Zapisz konfigurację</span>
                </button>
                
                <button
                  onClick={resetToDefault}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Przywróć domyślne</span>
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Potrzebujesz pomocy?
              </h3>
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Otwórz instrukcję</span>
              </button>
            </div>
            
            <div className="text-blue-800">
              <p className="mb-2">
                <strong>Najczęstsze problemy:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>AI service nie jest uruchomiony</li>
                <li>Nieprawidłowy adres URL</li>
                <li>Problemy z siecią lub firewall</li>
                <li>Port 8000 jest zajęty</li>
              </ul>
            </div>
          </div>

          {/* Available Endpoints */}
          {serviceStatus.status === 'online' && (
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Dostępne endpointy
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-md p-3 border border-green-200">
                  <code className="text-sm text-green-800">GET /health</code>
                  <p className="text-xs text-green-600 mt-1">Sprawdzenie statusu</p>
                </div>
                <div className="bg-white rounded-md p-3 border border-green-200">
                  <code className="text-sm text-green-800">POST /ai/normalize-product</code>
                  <p className="text-xs text-green-600 mt-1">Normalizacja produktów</p>
                </div>
                <div className="bg-white rounded-md p-3 border border-green-200">
                  <code className="text-sm text-green-800">POST /ai/analyze-palette</code>
                  <p className="text-xs text-green-600 mt-1">Analiza palet</p>
                </div>
                <div className="bg-white rounded-md p-3 border border-green-200">
                  <code className="text-sm text-green-800">POST /ai/collect-prices</code>
                  <p className="text-xs text-green-600 mt-1">Zbieranie cen</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Instrukcja konfiguracji AI Service</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Installation Guide */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Instalacja AI Service</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Krok 1: Przejdź do katalogu AI services</h4>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    cd ai-services
                  </code>
                  
                  <h4 className="font-medium text-gray-900 mb-2 mt-4">Krok 2: Zainstaluj zależności Python</h4>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    pip install -r requirements.txt
                  </code>
                  
                  <h4 className="font-medium text-gray-900 mb-2 mt-4">Krok 3: Zainstaluj model językowy spaCy</h4>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    python -m spacy download pl_core_news_sm
                  </code>
                  
                  <h4 className="font-medium text-gray-900 mb-2 mt-4">Krok 4: Uruchom AI service</h4>
                  <code className="block bg-black text-green-400 p-2 rounded text-sm">
                    python main.py
                  </code>
                </div>
              </div>

              {/* Configuration Guide */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Konfiguracja połączenia</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Domyślne ustawienia:</h4>
                    <ul className="list-disc list-inside text-blue-800 space-y-1">
                      <li><strong>URL:</strong> http://localhost:8000</li>
                      <li><strong>Port:</strong> 8000</li>
                      <li><strong>Protokół:</strong> HTTP</li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Wymagania systemowe:</h4>
                    <ul className="list-disc list-inside text-yellow-800 space-y-1">
                      <li>Python 3.9 lub nowszy</li>
                      <li>Minimum 4GB RAM</li>
                      <li>Dostęp do internetu (dla modeli językowych)</li>
                      <li>Port 8000 dostępny</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Rozwiązywanie problemów</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "Connection refused"</h4>
                    <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                      <li>Sprawdź czy AI service jest uruchomiony</li>
                      <li>Sprawdź czy port 8000 jest wolny</li>
                      <li>Sprawdź poprawność adresu URL</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "Module not found"</h4>
                    <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                      <li>Uruchom: pip install -r requirements.txt</li>
                      <li>Sprawdź czy jesteś w katalogu ai-services</li>
                      <li>Sprawdź czy Python jest zainstalowany</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "spaCy model not found"</h4>
                    <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                      <li>Uruchom: python -m spacy download pl_core_news_sm</li>
                      <li>Sprawdź połączenie z internetem</li>
                      <li>Sprawdź uprawnienia do instalacji pakietów</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Advanced Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Konfiguracja zaawansowana</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Zmienne środowiskowe:</h4>
                  <div className="space-y-2">
                    <code className="block bg-black text-green-400 p-2 rounded text-sm">
                      export AI_SERVICE_HOST=0.0.0.0
                    </code>
                    <code className="block bg-black text-green-400 p-2 rounded text-sm">
                      export AI_SERVICE_PORT=8000
                    </code>
                    <code className="block bg-black text-green-400 p-2 rounded text-sm">
                      export AI_SERVICE_DEBUG=true
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIConfiguration
