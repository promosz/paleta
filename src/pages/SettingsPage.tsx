import React from 'react'
import { ArrowLeft, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

const SettingsPage: React.FC = () => {
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
            Ustawienia reguł analizy
          </h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="card">
        <div className="text-center py-12">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Konfiguracja reguł analizy
          </h2>
          <p className="text-gray-600 mb-6">
            Ta funkcjonalność zostanie dodana w kolejnym etapie rozwoju aplikacji.
          </p>
          <p className="text-sm text-gray-500">
            Tutaj będzie możliwość konfiguracji reguł analizy produktów, 
            kryteriów rentowności i innych parametrów oceny zestawów.
          </p>
        </div>
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reguły rentowności
          </h3>
          <p className="text-gray-600 text-sm">
            Konfiguracja minimalnych progów rentowności, marginesów zysku 
            i innych wskaźników finansowych.
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reguły zawartości
          </h3>
          <p className="text-gray-600 text-sm">
            Ustawienia dotyczące składu zestawów, wymaganych produktów 
            i ograniczeń ilościowych.
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reguły jakości
          </h3>
          <p className="text-gray-600 text-sm">
            Kryteria oceny jakości produktów, zgodności z normami 
            i wymaganiami rynkowymi.
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reguły AI
          </h3>
          <p className="text-gray-600 text-sm">
            Konfiguracja parametrów sztucznej inteligencji, 
            modeli analizy i algorytmów oceny.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

