// Features Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import FeatureCard from './shared/FeatureCard'
import { Zap, DollarSign, MessageCircle, Table, FileText, Shield } from 'lucide-react'

export default function FeaturesSection() {
  const features: Array<{
    icon: typeof Zap
    title: string
    description: string
    color: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal'
  }> = [
    {
      icon: Zap,
      title: 'AI Powered Analysis',
      description: 'Sztuczna inteligencja analizuje każdy produkt. 85% Accuracy - sprawdzono na tysiącach palet.',
      color: 'blue'
    },
    {
      icon: DollarSign,
      title: 'Real-time Market Prices',
      description: 'Aktualne ceny z Allegro, eBay, Amazon i innych. Dokładne porównanie aktualnych cen rynkowych.',
      color: 'blue'
    },
    {
      icon: MessageCircle,
      title: 'AI Raporty w Języku Naturalnym',
      description: 'Nie musisz rozumieć skąd AI podjął decyzje. AI wyjaśni w zwykłym języku dlaczego produkt jest opłacalny lub nie.',
      color: 'blue'
    },
    {
      icon: Table,
      title: 'Automatyczna Tabela',
      description: 'Widzą całą tabelę za jednym kliknięciem. Sortuj po rentowności, filtruj wyniki.',
      color: 'blue'
    },
    {
      icon: FileText,
      title: 'Darmowe Wszystko',
      description: 'Programy w języku CSV, PDF, Excel. System sam rozpozna format.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Łaciń Dane na Bezablazach',
      description: 'Twoje dane pozostają bezpieczne. Nie udostępniamy ich osobom trzecim. RODO Safe.',
      color: 'blue'
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
            Wszystko, Czego Potrzebujesz w Jednym Miejscu
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Zaawansowane narzędzia AI w jednej rakieta z kompletnymi danymi
          </p>
        </motion.div>
        
        {/* Features Grid - 3x2 layout with equal height */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex"
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4f39f6] to-[#9810fa] p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            I to wszystko za mniej niż kolacja dla dwojga
          </h3>
          
          <div className="mb-6">
            <p className="text-lg md:text-xl mb-2">
              Plan PRO: 99 zł/miesiąc - Wszystko potrzebujesz za cenę co potrzebujesz
            </p>
            <p className="text-sm md:text-base opacity-90">
              Bez ukrytych kosztów • Anuluj w każdej chwili • Pierwsza analiza za darmo!
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const pricingSection = document.getElementById('pricing-section')
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="
              bg-white text-[#4f39f6] 
              px-8 py-4 
              rounded-xl 
              font-semibold text-lg
              hover:bg-gray-50 
              transition-colors duration-200
              shadow-lg
              cursor-pointer
            "
          >
            Zobacz ceny
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
