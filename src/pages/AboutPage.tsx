
import { 
  FileSpreadsheet, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Settings,
  Shield,
  Clock,
  Package,
  Target
} from 'lucide-react'

const AboutPage: React.FC = () => {

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          O aplikacji Paleta
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Inteligentny system analizy zestawień produktowych z wykorzystaniem sztucznej inteligencji
        </p>
      </div>

      {/* Opis aplikacji */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
          Czym jest aplikacja Paleta?
        </h2>
        <div className="prose max-w-none text-gray-700 space-y-4">
          <p>
            <strong>Aplikacja Paleta</strong> to nowoczesne narzędzie biznesowe przeznaczone do analizy 
            zestawień produktowych w formacie Excel. System został stworzony z myślą o przedsiębiorcach, 
            handlowcach i analitykach, którzy regularnie oceniają rentowność i opłacalność zakupów 
            dużych zestawów produktów.
          </p>
          
          <p>
            Głównym celem aplikacji jest <strong>automatyzacja procesu oceny zestawień produktowych</strong> 
            poprzez inteligentną analizę danych, która pozwala na szybkie podejmowanie decyzji biznesowych 
            opartych na konkretnych danych finansowych i trendach rynkowych.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Dla kogo jest ta aplikacja?</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Handlowcy i dystrybutorzy oceniający zestawienia od dostawców</li>
              <li>Menedżerowie zakupów analizujący opłacalność inwestycji</li>
              <li>Analitycy biznesowi oceniający rentowność produktów</li>
              <li>Właściciele firm handlowych planujący strategie zakupowe</li>
            </ul>
          </div>

          <p>
            Aplikacja wykorzystuje zaawansowane technologie sztucznej inteligencji do automatycznej 
            analizy danych produktowych, generowania rekomendacji zakupu i identyfikowania potencjalnych 
            ryzyk biznesowych. Dzięki temu użytkownicy mogą podejmować świadome decyzje w oparciu o 
            obiektywne dane, a nie intuicję.
          </p>
        </div>
      </div>

      {/* Zaimplementowane funkcjonalności */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
          Funkcjonalności już dostępne w aplikacji
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload i analiza */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-2" />
              Przesyłanie i analiza dokumentów
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Upload plików Excel</strong> - Intuicyjne przesyłanie dokumentów przez przeciągnięcie lub wybór pliku</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Automatyczne parsowanie</strong> - System automatycznie odczytuje i interpretuje dane z plików Excel</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Obliczanie rentowności</strong> - Automatyczne kalkulacje marży i rentowności dla każdego produktu</span>
              </li>
            </ul>
          </div>

          {/* Raporty i analizy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
              Raporty i analizy
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Szczegółowe raporty</strong> - Kompleksowe podsumowania z podziałem na kategorie rentowności</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Analiza AI zestawienia</strong> - Inteligentne podsumowanie z rekomendacjami zakupu</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Historia analiz</strong> - Dostęp do wszystkich wcześniej przeanalizowanych dokumentów</span>
              </li>
            </ul>
          </div>

          {/* System ostrzeżeń */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              System ostrzeżeń i reguł
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Reguły produktów</strong> - Możliwość ustawiania ostrzeżeń dla konkretnych produktów</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Reguły kategorii</strong> - Ostrzeżenia na poziomie całych kategorii produktów</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Wizualne oznaczenia</strong> - Kolorowe oznaczenia ostrzeżeń w interfejsie</span>
              </li>
            </ul>
          </div>

          {/* System AI */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 text-blue-600 mr-2" />
              Sztuczna inteligencja
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Hybrid AI Service</strong> - System wykorzystujący różne źródła AI (chmura, przeglądarka, Docker)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Automatyczny wybór serwisu</strong> - System sam wybiera najlepszy dostępny serwis AI</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Rekomendacje zakupu</strong> - AI generuje oceny: ZDECYDOWANIE KUP, KUP, ROZWAŻ, OSTROŻNIE, UNIKAJ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Statystyki postępu */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Postęp prac</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-700">Zaimplementowane funkcje</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-sm text-green-700">Podstawowej funkcjonalności</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-green-700">Dostępności aplikacji</div>
            </div>
          </div>
        </div>
      </div>

      {/* Planowane funkcjonalności */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Clock className="h-8 w-8 text-orange-600 mr-3" />
          Funkcjonalności w planach rozwoju
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI i automatyzacja */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Brain className="h-5 w-5 text-blue-600 mr-2" />
              Zaawansowana AI i automatyzacja
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Rozpoznawanie produktów</strong> - Automatyczne dopasowywanie nazw do baz rynkowych (Allegro, Amazon)</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Wycena rynkowa</strong> - Real-time scraping cen z serwisów e-commerce</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Ocena ryzyka</strong> - ML model oceny ryzyka z predykcją trendów</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Personalizacja</strong> - Rekomendacje dopasowane do stylu zakupowego użytkownika</span>
              </li>
            </ul>
          </div>

          {/* Integracje i eksport */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 text-purple-600 mr-2" />
              Integracje i eksport danych
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Eksport do PDF/Excel</strong> - Generowanie profesjonalnych raportów do wydruku</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>API integracje</strong> - Połączenie z systemami ERP i systemami zarządzania magazynem</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Automatyczne powiadomienia</strong> - Email/SMS alerty o nowych analizach</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Wielojęzyczność</strong> - Obsługa dokumentów w różnych językach</span>
              </li>
            </ul>
          </div>

          {/* Zaawansowane funkcje */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="h-5 w-5 text-gray-600 mr-2" />
              Zaawansowane funkcje analityczne
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Analiza trendów</strong> - Porównywanie zestawień w czasie i identyfikacja trendów</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Benchmarking</strong> - Porównanie z podobnymi zestawieniami w branży</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Symulacje cenowe</strong> - "Co jeśli" analizy przy różnych cenach zakupu</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Współpraca zespołowa</strong> - Udostępnianie analiz i komentarze zespołowe</span>
              </li>
            </ul>
          </div>

          {/* Bezpieczeństwo i skalowalność */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 text-red-600 mr-2" />
              Bezpieczeństwo i skalowalność
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Autentykacja użytkowników</strong> - System logowania i zarządzania kontami</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Szyfrowanie danych</strong> - Ochrona wrażliwych informacji biznesowych</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Skalowalność</strong> - Obsługa dużych zestawów danych i wielu użytkowników</span>
              </li>
              <li className="flex items-start">
                <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Backup i odzyskiwanie</strong> - Automatyczne kopie zapasowe danych</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
          Plan rozwoju aplikacji
        </h2>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Faza 1: Podstawowa funkcjonalność (ZAKOŃCZONA)</h3>
            <p className="text-gray-700 mb-2">✅ Upload dokumentów Excel, podstawowa analiza rentowności, system ostrzeżeń</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-green-600">ZREALIZOWANE</span></p>
          </div>

          <div className="border-l-4 border-orange-500 pl-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Faza 2: AI i automatyzacja (W TRAKCIE)</h3>
            <p className="text-gray-700 mb-2">🔄 Rozpoznawanie produktów, wycena rynkowa, zaawansowane rekomendacje AI</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-orange-600">W REALIZACJI</span> (60% ukończone)</p>
          </div>

          <div className="border-l-4 border-gray-300 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Faza 3: Integracje i eksport (PLANOWANE)</h3>
            <p className="text-gray-700 mb-2">📋 Eksport raportów, integracje API, automatyzacja workflow</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-gray-600">PLANOWANE</span> (Q2 2025)</p>
          </div>

          <div className="border-l-4 border-gray-300 pl-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Faza 4: Zaawansowane funkcje (PLANOWANE)</h3>
            <p className="text-gray-700 mb-2">📊 Analiza trendów, benchmarking, współpraca zespołowa</p>
            <p className="text-sm text-gray-600">Status: <span className="font-semibold text-gray-600">PLANOWANE</span> (Q3 2025)</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AboutPage
