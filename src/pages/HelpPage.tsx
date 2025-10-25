
import { ArrowLeft, BookOpen, Settings, AlertTriangle, CheckCircle, ExternalLink, Download } from 'lucide-react'
import { Link } from 'react-router-dom'

const HelpPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          to="/settings"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Powrót do ustawień</span>
        </Link>
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Pomoc i dokumentacja
          </h1>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Szybka nawigacja</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#installation" className="flex items-center space-x-2 p-3 bg-white rounded-md hover:bg-blue-100 transition-colors">
            <Download className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Instalacja AI Service</span>
          </a>
          <a href="#configuration" className="flex items-center space-x-2 p-3 bg-white rounded-md hover:bg-blue-100 transition-colors">
            <Settings className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Konfiguracja</span>
          </a>
          <a href="#troubleshooting" className="flex items-center space-x-2 p-3 bg-white rounded-md hover:bg-blue-100 transition-colors">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Rozwiązywanie problemów</span>
          </a>
        </div>
      </div>

      {/* Installation Guide */}
      <section id="installation" className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Download className="h-6 w-6 mr-2 text-green-600" />
          1. Instalacja AI Service
        </h2>
        
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Wymagania systemowe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">System operacyjny</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Windows 10/11</li>
                <li>• macOS 10.15+</li>
                <li>• Linux Ubuntu 18.04+</li>
              </ul>
            </div>
            <div className="bg-white rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">Oprogramowanie</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Python 3.9 lub nowszy</li>
                <li>• pip (menedżer pakietów Python)</li>
                <li>• Dostęp do internetu</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Krok po kroku</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Pobierz i zainstaluj Python</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Pobierz najnowszą wersję Python z oficjalnej strony i zainstaluj z opcją "Add to PATH"
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono">
                  <div># Sprawdź wersję Python</div>
                  <div>python --version</div>
                  <div className="text-gray-400"># Powinno pokazać: Python 3.9.x lub nowszy</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Przejdź do katalogu AI services</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Otwórz terminal/wiersz poleceń i przejdź do katalogu z aplikacją
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono">
                  <div>cd ai-services</div>
                  <div className="text-gray-400"># Sprawdź czy katalog istnieje</div>
                  <div>ls</div>
                  <div className="text-gray-400"># Powinieneś zobaczyć: main.py, requirements.txt</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Zainstaluj zależności</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Zainstaluj wszystkie wymagane biblioteki Python
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono">
                  <div>pip install -r requirements.txt</div>
                  <div className="text-gray-400"># To może potrwać kilka minut</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Zainstaluj model językowy</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Pobierz polski model językowy dla spaCy
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono">
                  <div>python -m spacy download pl_core_news_sm</div>
                  <div className="text-gray-400"># Pobiera model ~40MB</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-2">Uruchom AI Service</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Uruchom serwis AI i sprawdź czy działa poprawnie
                </p>
                <div className="bg-gray-900 text-green-400 p-3 rounded-md text-sm font-mono">
                  <div>python main.py</div>
                  <div className="text-gray-400"># Powinieneś zobaczyć:</div>
                  <div className="text-yellow-400">INFO: Uvicorn running on http://0.0.0.0:8000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Guide */}
      <section id="configuration" className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-2 text-blue-600" />
          2. Konfiguracja połączenia
        </h2>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Domyślne ustawienia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">Adres URL</h4>
              <code className="text-sm bg-gray-100 p-2 rounded block">http://localhost:8000</code>
            </div>
            <div className="bg-white rounded-md p-4">
              <h4 className="font-medium text-gray-900 mb-2">Port</h4>
              <code className="text-sm bg-gray-100 p-2 rounded block">8000</code>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Konfiguracja w aplikacji</h3>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Otwórz ustawienia aplikacji</h4>
                  <p className="text-sm text-gray-600">
                    Przejdź do strony "Ustawienia" w aplikacji
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Kliknij "Konfiguruj" przy AI Service</h4>
                  <p className="text-sm text-gray-600">
                    Otworzy się okno konfiguracji AI Service
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Testuj połączenie</h4>
                  <p className="text-sm text-gray-600">
                    Kliknij "Testuj połączenie" aby sprawdzić czy AI service działa
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Zapisz konfigurację</h4>
                  <p className="text-sm text-gray-600">
                    Jeśli test się powiedzie, kliknij "Zapisz konfigurację"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting" className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
          3. Rozwiązywanie problemów
        </h2>
        
        <div className="space-y-4">
          {/* Common Issues */}
          <div className="bg-red-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Najczęstsze problemy</h3>
            
            <div className="space-y-4">
              <div className="bg-white rounded-md p-4 border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "Connection refused"</h4>
                <p className="text-sm text-red-800 mb-3">Aplikacja nie może połączyć się z AI service</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-900">Rozwiązania:</p>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Sprawdź czy AI service jest uruchomiony (python main.py)</li>
                    <li>• Sprawdź czy port 8000 jest wolny</li>
                    <li>• Sprawdź poprawność adresu URL w ustawieniach</li>
                    <li>• Sprawdź czy firewall nie blokuje połączenia</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-md p-4 border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "Module not found"</h4>
                <p className="text-sm text-red-800 mb-3">Brakuje wymaganych bibliotek Python</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-900">Rozwiązania:</p>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Uruchom: pip install -r requirements.txt</li>
                    <li>• Sprawdź czy jesteś w katalogu ai-services</li>
                    <li>• Sprawdź czy Python jest zainstalowany</li>
                    <li>• Sprawdź czy pip jest zainstalowany</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-md p-4 border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "spaCy model not found"</h4>
                <p className="text-sm text-red-800 mb-3">Brakuje modelu językowego spaCy</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-900">Rozwiązania:</p>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Uruchom: python -m spacy download pl_core_news_sm</li>
                    <li>• Sprawdź połączenie z internetem</li>
                    <li>• Sprawdź uprawnienia do instalacji pakietów</li>
                    <li>• Spróbuj: pip install spacy</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-md p-4 border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">❌ Błąd: "Port 8000 already in use"</h4>
                <p className="text-sm text-red-800 mb-3">Port 8000 jest już zajęty przez inny proces</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-900">Rozwiązania:</p>
                  <ul className="text-sm text-red-800 space-y-1 ml-4">
                    <li>• Zamknij inne aplikacje używające portu 8000</li>
                    <li>• Uruchom AI service na innym porcie</li>
                    <li>• Zrestartuj komputer</li>
                    <li>• Sprawdź czy nie masz już uruchomionego AI service</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Commands */}
          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">Komendy diagnostyczne</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">Sprawdź wersję Python:</p>
                <div className="bg-gray-900 text-green-400 p-2 rounded text-sm font-mono">
                  python --version
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">Sprawdź zainstalowane pakiety:</p>
                <div className="bg-gray-900 text-green-400 p-2 rounded text-sm font-mono">
                  pip list | grep -E "(fastapi|spacy|pandas)"
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">Sprawdź czy port 8000 jest wolny:</p>
                <div className="bg-gray-900 text-green-400 p-2 rounded text-sm font-mono">
                  netstat -an | grep 8000
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-yellow-900 mb-1">Test połączenia z AI service:</p>
                <div className="bg-gray-900 text-green-400 p-2 rounded text-sm font-mono">
                  curl http://localhost:8000/health
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <ExternalLink className="h-6 w-6 mr-2 text-purple-600" />
          4. Dodatkowe zasoby
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">Dokumentacja techniczna</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center space-x-2 text-purple-800 hover:text-purple-600">
                <ExternalLink className="h-4 w-4" />
                <span>API Documentation</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-purple-800 hover:text-purple-600">
                <ExternalLink className="h-4 w-4" />
                <span>Architecture Overview</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-purple-800 hover:text-purple-600">
                <ExternalLink className="h-4 w-4" />
                <span>Performance Metrics</span>
              </a>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">Wsparcie</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span>Email: support@pallet-analysis.com</span>
              </div>
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span>GitHub Issues</span>
              </div>
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span>FAQ - Często zadawane pytania</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HelpPage
