// Features Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import FeatureCard from './shared/FeatureCard'
import { Zap, Shield, TrendingUp, Bell, FileSpreadsheet, BarChart3 } from 'lucide-react'

export default function FeaturesSection() {
  const features: Array<{
    icon: typeof Zap
    title: string
    description: string
    color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal'
  }> = [
    {
      icon: Zap,
      title: 'Analiza w 60 sekund',
      description: 'Zapomnij o wielogodzinnym sprawdzaniu cen. AI analizuje całą paletę w minutę.',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      title: 'Przewidywanie rentowności',
      description: 'AI mówi Ci dokładnie, ile zarobisz na każdym produkcie. 85% accuracy.',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Ostrzeżenia przed ryzykiem',
      description: 'System sam wykryje produkty z niską marżą lub wysoką konkurencją i ostrzeże Cię.',
      color: 'red'
    },
    {
      icon: FileSpreadsheet,
      title: 'Obsługa każdego formatu',
      description: 'Excel, CSV, PDF - wrzucasz co dostajesz od dostawcy. AI rozumie wszystko.',
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Szczegółowe raporty',
      description: 'Zobacz dokładne ceny rynkowe, marże, konkurencję i trendy dla każdego produktu.',
      color: 'orange'
    },
    {
      icon: Bell,
      title: 'Powiadomienia o okazjach',
      description: 'Dostaniesz alert, gdy pojawi się paleta z wysoką rentownością (wkrótce).',
      color: 'teal'
    }
  ]
  
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-blue-50/30 to-white">
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
            Wszystko, Czego{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Potrzebujesz
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            PalletAI to kompletne narzędzie do analizy palet. Od uploadu pliku po szczegółowy raport rentowności.
          </p>
        </motion.div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
