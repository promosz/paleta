// Problem Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { Clock, BarChart3, TrendingDown } from 'lucide-react'

export default function ProblemSection() {
  const problems = [
    {
      icon: Clock,
      title: 'Godziny Tracone na Analizę',
      description: 'Ręczne sprawdzanie cen każdego produktu zabiera cały dzień. Musisz przeszukać Allegro, Ceneo, porównać ceny, obliczyć marżę...'
    },
    {
      icon: BarChart3,
      title: 'Brak Pewności',
      description: 'Nigdy nie jesteś pewien, czy ceny są aktualne i konkurencyjne. Ryzykujesz własne pieniądze bez gwarancji zysku.'
    },
    {
      icon: TrendingDown,
      title: 'Złe Decyzje Kosztują',
      description: 'Kupujesz palety, które okazują się nieopłacalne. Produkty zalegają w magazynie, bo ceny rynkowe spadły.'
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
            Znasz Ten Problem?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Handel paletami to gra na czas i ryzyko
          </p>
        </motion.div>
        
        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="
                bg-white
                rounded-2xl
                p-6 md:p-8
                border border-gray-200
                hover:border-red-200
                hover:shadow-lg
                transition-all duration-300
                text-center
              "
            >
              {/* Icon */}
              <div className="
                inline-flex items-center justify-center
                w-16 h-16 md:w-20 md:h-20
                rounded-2xl
                bg-gradient-to-br from-red-50 to-orange-50
                mb-5
              ">
                <problem.icon className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
              </div>
              
              {/* Title */}
              <h3 className="
                text-xl md:text-2xl 
                font-bold 
                text-gray-900 
                mb-3
              ">
                {problem.title}
              </h3>
              
              {/* Description */}
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            Czy to nie brzmi znajomo? 
            <span className="text-blue-600"> PalletAI rozwiązuje te problemy.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

