// Problem Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { AlertCircle, Clock, TrendingDown, HelpCircle } from 'lucide-react'

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: 'Tracisz 2-3 godziny na każdą analizę',
      description: 'Ręczne sprawdzanie cen, liczenie marż, analiza konkurencji - to wszystko zabiera mnóstwo czasu.'
    },
    {
      icon: TrendingDown,
      title: 'Ryzykujesz stratę tysięcy złotych',
      description: 'Jeden błąd w ocenie palety może kosztować Cię całą inwestycję. Nie możesz sobie na to pozwolić.'
    },
    {
      icon: HelpCircle,
      title: 'Brak pewności w decyzjach',
      description: 'Czy ta paleta jest opłacalna? Czy nie przepłacam? Czy sprzedam te produkty? - te pytania męczą Cię przy każdym zakupie.'
    },
    {
      icon: AlertCircle,
      title: 'Konkurencja Cię wyprzedza',
      description: 'Podczas gdy Ty analizujesz - inni kupują najlepsze palety. Brak szybkiej decyzji = stracona okazja.'
    }
  ]
  
  return (
    <section className="relative py-16 md:py-24 bg-gray-50">
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
            Znasz Ten{' '}
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Problem?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Kupowanie palet to loteria. Jedne decyzje przynoszą zysk, inne - straty. A bez odpowiednich narzędzi - nie wiesz, które to będą.
          </p>
        </motion.div>
        
        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="
                bg-white
                rounded-2xl
                p-6 md:p-8
                border border-gray-200
                hover:shadow-xl
                transition-shadow duration-300
              "
            >
              {/* Icon */}
              <div className="
                w-12 h-12
                rounded-xl
                bg-red-50
                flex items-center justify-center
                mb-4
              ">
                <problem.icon className="w-6 h-6 text-red-600" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="
            mt-12
            text-center
            bg-gradient-to-r from-red-50 to-orange-50
            rounded-2xl
            p-6 md:p-8
            border-2 border-red-100
          "
        >
          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Czy to brzmi znajomo?
          </p>
          <p className="text-gray-700 mb-4">
            Nie jesteś sam. <strong>Setki traderów</strong> boryka się z tym samym problemem każdego dnia.
          </p>
          <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PalletAI rozwiązuje te problemy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
