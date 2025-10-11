import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Cloud,
  Globe,
  Container,
  Zap,
  Info,
  ExternalLink,
  Download
} from 'lucide-react'
import { hybridAIService, HybridAIStatus, AIServiceType } from '../services/hybridAIService'

interface HybridAIConfigurationProps {
  onClose: () => void
}

const HybridAIConfiguration: React.FC<HybridAIConfigurationProps> = ({ onClose }) => {
  const [status, setStatus] = useState<HybridAIStatus>({
    cloud: 'checking',
    browser: 'checking',
    docker: 'checking',
    active: 'none',
    lastChecked: new Date().toISOString()
  })
  const [isChecking, setIsChecking] = useState(false)
  const [selectedService, setSelectedService] = useState<AIServiceType>('none')
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    loadStatus()
    loadConfigs()
  }, [])

  const loadStatus = async () => {
    const currentStatus = hybridAIService.getStatus()
    setStatus(currentStatus)
    setSelectedService(currentStatus.active)
  }

  const loadConfigs = () => {
    // Configs are loaded but not used in this simplified version
  }

  const checkAllServices = async () => {
    setIsChecking(true)
    try {
      const newStatus = await hybridAIService.checkAllServices()
      setStatus(newStatus)
      setSelectedService(newStatus.active)
    } finally {
      setIsChecking(false)
    }
  }

  const handleServiceSelect = (service: AIServiceType) => {
    setSelectedService(service)
    hybridAIService.setActiveService(service)
    loadStatus()
  }

  const getStatusIcon = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'offline': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'checking': return <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (serviceStatus: string) => {
    switch (serviceStatus) {
      case 'online': return 'text-green-600'
      case 'offline': return 'text-red-600'
      case 'checking': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getServiceIcon = (type: AIServiceType) => {
    switch (type) {
      case 'cloud': return <Cloud className="h-6 w-6 text-blue-600" />
      case 'browser': return <Globe className="h-6 w-6 text-green-600" />
      case 'docker': return <Container className="h-6 w-6 text-purple-600" />
      default: return <Zap className="h-6 w-6 text-gray-600" />
    }
  }

  const getServiceName = (type: AIServiceType) => {
    switch (type) {
      case 'cloud': return 'Cloud AI Service'
      case 'browser': return 'Browser AI (Offline)'
      case 'docker': return 'Docker AI Service'
      default: return 'No AI Service'
    }
  }

  const getServiceDescription = (type: AIServiceType) => {
    switch (type) {
      case 'cloud': return 'Najszybszy i najdokładniejszy. Wymaga internetu.'
      case 'browser': return 'Działa offline. Prywatność danych. Wolniejszy.'
      case 'docker': return 'Lokalny serwer AI. Wymaga instalacji Docker.'
      default: return 'Brak aktywnego serwisu AI'
    }
  }

  const getServiceStatus = (type: AIServiceType) => {
    switch (type) {
      case 'cloud': return status.cloud
      case 'browser': return status.browser
      case 'docker': return status.docker
      default: return 'offline'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hybrid AI Configuration</h2>
              <p className="text-sm text-gray-600">Wybierz najlepszy serwis AI dla Twoich potrzeb</p>
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
          {/* Service Status Overview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2" />
                Status Serwisów AI
              </h3>
              <button
                onClick={checkAllServices}
                disabled={isChecking}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Sprawdź wszystkie</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.cloud)}
                <div>
                  <p className="text-sm text-gray-600">Cloud AI</p>
                  <p className={`font-medium ${getStatusColor(status.cloud)}`}>
                    {status.cloud.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.browser)}
                <div>
                  <p className="text-sm text-gray-600">Browser AI</p>
                  <p className={`font-medium ${getStatusColor(status.browser)}`}>
                    {status.browser.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusIcon(status.docker)}
                <div>
                  <p className="text-sm text-gray-600">Docker AI</p>
                  <p className={`font-medium ${getStatusColor(status.docker)}`}>
                    {status.docker.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Wybierz Serwis AI</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cloud AI Service */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedService === 'cloud' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${status.cloud === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => status.cloud === 'online' && handleServiceSelect('cloud')}
              >
                <div className="flex items-start space-x-3">
                  {getServiceIcon('cloud')}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Cloud AI Service</h4>
                      <div className="flex items-center space-x-2">
                        {selectedService === 'cloud' && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Najszybszy i najdokładniejszy. Wymaga internetu.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Zalecany</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Szybki</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Dokładny</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Browser AI Service */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedService === 'browser' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${status.browser === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => status.browser === 'online' && handleServiceSelect('browser')}
              >
                <div className="flex items-start space-x-3">
                  {getServiceIcon('browser')}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Browser AI (Offline)</h4>
                      <div className="flex items-center space-x-2">
                        {selectedService === 'browser' && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Działa offline. Prywatność danych. Wolniejszy.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Offline</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Prywatny</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Wolniejszy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Docker AI Service */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedService === 'docker' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${status.docker === 'offline' ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => status.docker === 'online' && handleServiceSelect('docker')}
              >
                <div className="flex items-start space-x-3">
                  {getServiceIcon('docker')}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Docker AI Service</h4>
                      <div className="flex items-center space-x-2">
                        {selectedService === 'docker' && (
                          <CheckCircle className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Lokalny serwer AI. Wymaga instalacji Docker.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Lokalny</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Zaawansowany</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Wymaga Docker</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Service */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedService === 'none' 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelect('none')}
              >
                <div className="flex items-start space-x-3">
                  {getServiceIcon('none')}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">Wyłącz AI</h4>
                      <div className="flex items-center space-x-2">
                        {selectedService === 'none' && (
                          <CheckCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Użyj tylko podstawowych funkcji bez AI.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">Podstawowy</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Ograniczony</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Aktualny Status</h3>
            <div className="flex items-center space-x-3">
              {getServiceIcon(selectedService)}
              <div>
                <p className="font-medium text-blue-900">{getServiceName(selectedService)}</p>
                <p className="text-sm text-blue-700">{getServiceDescription(selectedService)}</p>
              </div>
              {getStatusIcon(getServiceStatus(selectedService))}
            </div>
          </div>

          {/* Advanced Configuration */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Konfiguracja zaawansowana</span>
              <svg 
                className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Dostępne Opcje:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cloud AI API Key</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Konfiguruj
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Docker Service URL</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Edytuj
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Browser AI Model</span>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Pobierz
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Potrzebujesz pomocy?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <button className="flex items-center space-x-2 text-green-800 hover:text-green-600">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">Instrukcja Cloud AI</span>
                </button>
                <button className="flex items-center space-x-2 text-green-800 hover:text-green-600">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Pobierz Browser AI</span>
                </button>
              </div>
              <div className="space-y-2">
                <button className="flex items-center space-x-2 text-green-800 hover:text-green-600">
                  <Container className="h-4 w-4" />
                  <span className="text-sm">Setup Docker AI</span>
                </button>
                <button className="flex items-center space-x-2 text-green-800 hover:text-green-600">
                  <Info className="h-4 w-4" />
                  <span className="text-sm">FAQ i wsparcie</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridAIConfiguration
