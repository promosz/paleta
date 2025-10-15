import React, { useState, useEffect } from 'react'
import { ArrowLeft, Settings, HelpCircle, Zap, Shield, Trash2, Tag, Package } from 'lucide-react'
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
  const [rules, setRules] = useState<Array<{
    id: string
    type: 'category' | 'product'
    name: string
    action: 'block' | 'warning'
    description?: string
    createdAt: string
    updatedAt: string
  }>>([])

  useEffect(() => {
    // Load AI status on component mount
    const loadAIStatus = async () => {
      const status = hybridAIService.getStatus()
      setAiStatus(status)
    }
    loadAIStatus()
    
    // Load rules on component mount
    loadRules()
  }, [])

  const loadRules = () => {
    const savedRules = localStorage.getItem('analysis-rules')
    if (savedRules) {
      try {
        const parsedRules = JSON.parse(savedRules)
        setRules(parsedRules)
      } catch (error) {
        console.error('Failed to load rules:', error)
      }
    }
  }

  const handleRemoveRule = (ruleId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę regułę?')) {
      const updatedRules = rules.filter(rule => rule.id !== ruleId)
      localStorage.setItem('analysis-rules', JSON.stringify(updatedRules))
      setRules(updatedRules)
    }
  }

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

        {/* Analysis Rules Management */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Reguły analizy
                </h3>
                <p className="text-sm text-gray-600">
                  Zarządzanie regułami blokowania i ostrzeżeń
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Łącznie: {rules.length} reguł
            </div>
          </div>
          
          {rules.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-md font-medium text-gray-900 mb-2">
                Brak zdefiniowanych reguł
              </h4>
              <p className="text-sm text-gray-500">
                Dodaj reguły w szczegółach analizy, aby zarządzać produktami
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    <h4 className="font-medium text-red-900">Reguły blokowania</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    {rules.filter(r => r.action === 'block').length} reguł
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-900">Reguły ostrzeżeń</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    {rules.filter(r => r.action === 'warning').length} reguł
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {rules.map(rule => (
                  <div key={rule.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {rule.type === 'category' ? (
                          <Tag className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Package className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{rule.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{rule.type === 'category' ? 'Kategoria' : 'Produkt'}</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rule.action === 'block' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {rule.action === 'block' ? 'Blokowanie' : 'Ostrzeżenie'}
                            </span>
                          </div>
                          {rule.description && (
                            <p className="text-xs text-gray-500 mt-1">{rule.description}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Dodano: {new Date(rule.createdAt).toLocaleString('pl-PL')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveRule(rule.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Usuń regułę"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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