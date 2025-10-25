// Problem Section for Pre-Launch Landing Page

import { motion } from 'framer-motion'
import clockIcon from '../../assets/figma-icons/clock-icon.svg'
import alertTriangleIcon from '../../assets/figma-icons/alert-triangle-icon.svg'
import alertCircleIcon from '../../assets/figma-icons/alert-circle-icon.svg'

export default function ProblemSection() {
  const problems = [
    {
      icon: clockIcon,
      title: 'Tracisz 2-3 godziny na każdą analizę',
      description: 'Ręczne sprawdzanie cen, liczenie marż, analiza konkurencji - to wszystko zabiera mnóstwo czasu.'
    },
    {
      icon: alertTriangleIcon,
      title: 'Ryzykujesz stratę tysięcy złotych',
      description: 'Jeden błąd w ocenie palety może kosztować Cię całą inwestycję. Nie możesz sobie na to pozwolić.'
    },
    {
      icon: alertCircleIcon,
      title: 'Brak pewności w decyzjach',
      description: 'Czy ta paleta jest opłacalna? Czy nie przepłacam? Czy sprzedam te produkty? - te pytania męczą Cię przy każdym zakupie.'
    },
    {
      icon: alertCircleIcon,
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
            Znasz Ten <span className="text-[#dc2826]">Problem?</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-full mx-auto leading-relaxed">
            Kupowanie palet to loteria. Jedne decyzje przynoszą zysk, inne - straty. A bez odpowiednich narzędzi - nie wiesz, które to będą. 
            Tracisz 2-3 godziny na każdą analizę. Ręczne sprawdzanie cen, liczenie marż, analiza konkurencji - to wszystko zabiera mnóstwo czasu.
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
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="
                bg-white
                rounded-2xl
                p-6 md:p-8
                border border-gray-200
                hover:border-red-200
                hover:shadow-lg
                transition-all duration-300
                text-left
              "
            >
              {/* Icon */}
              <div className="
                inline-flex items-center justify-center
                w-14 h-14
                rounded-lg
                bg-[#ffe2e2]
                mb-5
              ">
                <img src={problem.icon} alt="" className="w-7 h-7" />
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
          className="text-center mt-12 md:mt-16 space-y-4"
        >
          <p className="text-xl md:text-2xl text-gray-700 font-bold">
            Czy to nie brzmi znajomo?
          </p>
          <p className="text-lg md:text-xl text-gray-600">
            Nie jesteś sam. Setki traderów boryka się z tym samym problemem każdego dnia.
          </p>
          <p className="text-lg md:text-xl text-[#4f39f6] font-bold">
            PalletAI rozwiązuje te problemy.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

