import React, { useState, useEffect } from 'react'
import { ArrowLeft, Settings, HelpCircle, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import HybridAIConfiguration from '../components/HybridAIConfiguration'
import { hybridAIService } from '../services/hybridAIService'

const SettingsPage: React.FC = () => {
  const [showHybridAIConfig, setShowHybridAIConfig] = useState(false)
  const [aiStatus, setAiStatus] = useState<any>({
    active: 'none',
    cloud: 'checking',
    browser: 'checking',
    docker: 'checking'
  })

  useEffect(() => {
    // Load AI status on component mount
    const loadAIStatus = async () => {
      const status = hybridAIService.getStatus()
      setAiStatus(status)
    }
    loadAIStatus()
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Powrót</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Ustawienia aplikacji
          </h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Hybrid AI Service Configuration */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Hybrid AI Service
                </h3>
                <p className="text-sm text-gray-600">
                  Wybierz najlepszy serwis AI: Cloud, Browser lub Docker
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHybridAIConfig(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Konfiguruj</span>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Aktywny serwis</p>
                <p className="font-medium text-gray-900">
                  {aiStatus.active === 'cloud' && '☁️ Cloud AI'}
                  {aiStatus.active === 'browser' && '🌐 Browser AI'}
                  {aiStatus.active === 'docker' && '🐳 Docker AI'}
                  {aiStatus.active === 'none' && '❌ Wyłączony'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cloud AI</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    aiStatus.cloud === 'online' ? 'bg-green-500' : 
                    aiStatus.cloud === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{aiStatus.cloud}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Browser AI</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    aiStatus.browser === 'online' ? 'bg-green-500' : 
                    aiStatus.browser === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{aiStatus.browser}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Docker AI</p>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    aiStatus.docker === 'online' ? 'bg-green-500' : 
                    aiStatus.docker === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-sm text-gray-600">{aiStatus.docker}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Help and Documentation */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <HelpCircle className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Pomoc i dokumentacja
                </h3>
                <p className="text-sm text-gray-600">
                  Instrukcje i przewodniki dla użytkowników
                </p>
              </div>
            </div>
            <Link
              to="/help"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Otwórz pomoc</span>
            </Link>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Dostępne sekcje pomocy:</h4>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Instrukcja konfiguracji AI Service</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Rozwiązywanie problemów z połączeniem</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>Przewodnik użytkownika</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span>FAQ - Często zadawane pytania</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Analysis Rules */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reguły analizy
              </h3>
              <p className="text-sm text-gray-600">
                Konfiguracja parametrów analizy rentowności
              </p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-md font-medium text-gray-900 mb-2">
              Reguły analizy w przygotowaniu
            </h4>
            <p className="text-sm text-gray-500">
              Ta funkcjonalność będzie dostępna w przyszłych wersjach
            </p>
          </div>
        </div>
      </div>

      {/* AI Configuration Modal */}
      {showHybridAIConfig && (
        <HybridAIConfiguration onClose={() => setShowHybridAIConfig(false)} />
      )}
    </div>
  )
}

export default SettingsPage