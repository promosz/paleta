import React, { useState } from 'react'
import { ArrowLeft, Settings, Brain, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import AIConfiguration from '../components/AIConfiguration'

const SettingsPage: React.FC = () => {
  const [showAIConfig, setShowAIConfig] = useState(false)

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
        {/* AI Service Configuration */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfiguracja AI Service
                </h3>
                <p className="text-sm text-gray-600">
                  Ustawienia połączenia z serwisem sztucznej inteligencji
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAIConfig(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Konfiguruj</span>
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">URL AI Service</p>
                <p className="font-medium text-gray-900">
                  {localStorage.getItem('ai-service-url') || 'http://localhost:8000'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status połączenia</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Nie sprawdzono</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Funkcjonalności</p>
                <p className="text-sm text-gray-900">Rozpoznawanie produktów, Analiza cen</p>
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
      {showAIConfig && (
        <AIConfiguration onClose={() => setShowAIConfig(false)} />
      )}
    </div>
  )
}

export default SettingsPage