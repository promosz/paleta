// Features Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { 
  Bot, 
  TrendingUp, 
  FileText, 
  Target, 
  Smartphone, 
  Shield 
} from 'lucide-react'
import FeatureCard from './shared/FeatureCard'

export default function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Analysis',
      description: 'Sztuczna inteligencja ocenia każdy produkt. 85% accuracy - sprawdzone na tysiącach palet.'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Market Prices',
      description: 'Aktualne ceny z Allegro, Amazon, Ceneo. Automatyczna detekcja trendów (↗️ rośnie, ↘️ spada).'
    },
    {
      icon: FileText,
      title: 'AI Reports w Języku Naturalnym',
      description: 'Nie musisz rozumieć liczb. AI wyjaśnia wszystko prostym językiem - jak doświadczony doradca.'
    },
    {
      icon: Target,
      title: 'Własne Reguły Zakupowe',
      description: 'Stwórz własne kryteria oceny. Unikaj kategorii, które Cię nie interesują. Pełna personalizacja.'
    },
    {
      icon: Smartphone,
      title: 'Dostępne Wszędzie',
      description: 'Przeglądarka, telefon, tablet. Działa online i offline. Twoje dane zawsze pod ręką.'
    },
    {
      icon: Shield,
      title: 'Twoje Dane są Bezpieczne',
      description: 'Dane przechowywane w bezpiecznej chmurze. Pełna zgodność z RODO. Bank-level encryption.'
    }
  ]
  
  return (
    <section className="relative py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl 
            font-bold 
            text-gray-900 
            mb-4
          ">
            Wszystko, Czego Potrzebujesz{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              w Jednym Miejscu
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Zaawansowane narzędzia AI + analiza rynkowa + bezpieczeństwo danych
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={idx}
            />
          ))}
        </div>
        
        {/* Bottom Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="
            mt-12 md:mt-16
            bg-gradient-to-r from-blue-600 to-purple-600
            rounded-2xl
            p-8 md:p-10
            text-center
            text-white
          "
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            I to wszystko za mniej niż kolacja dla dwojga
          </h3>
          <p className="text-blue-100 text-lg mb-5">
            Plan PRO: 99 zł/miesiąc. Pierwszy miesiąc za darmo dla early access!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>Bez zobowiązań</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>Anuluj w każdej chwili</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <span>Zwrot w 30 dni</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

