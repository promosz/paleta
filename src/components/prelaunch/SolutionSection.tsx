// Solution Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { Zap, CheckCircle } from 'lucide-react'

export default function SolutionSection() {
  const steps = [
    {
      step: '1',
      title: 'Upload pliku',
      description: 'Wrzuć plik Excel/CSV z listą produktów z palety (zwykle dostajesz od dostawcy)',
      icon: '📄'
    },
    {
      step: '2',
      title: 'AI analizuje',
      description: 'Sztuczna inteligencja sprawdza ceny rynkowe, konkurencję, trendy i rentowność każdego produktu',
      icon: '🤖'
    },
    {
      step: '3',
      title: 'Otrzymujesz raport',
      description: 'W 60 sekund widzisz: które produkty się opłacają, ile zarobisz, jakie są ryzyka',
      icon: '📊'
    }
  ]
  
  const benefits = [
    'Oszczędź 2-3 godziny na każdej analizie',
    'Uniknij złych inwestycji dzięki ostrzeżeniom AI',
    '85% accuracy w przewidywaniu rentowności',
    'Podejmuj decyzje w ciągu minut, nie godzin'
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl 
            font-bold 
            text-gray-900 
            mb-4
          ">
            Rozwiązanie:{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PalletAI
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Pierwszy w Polsce system AI do analizy palet produktów. Wrzucasz plik, AI ocenia rentowność w 60 sekund.
          </p>
        </motion.div>
        
        {/* How it works - Steps */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            Jak to działa?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative"
              >
                {/* Arrow between steps (desktop) */}
                {idx < steps.length - 1 && (
                  <div className="
                    hidden md:block
                    absolute
                    top-12
                    -right-4
                    text-3xl
                    text-gray-300
                  ">
                    →
                  </div>
                )}
                
                {/* Step Card */}
                <div className="
                  bg-gradient-to-br from-blue-50 to-purple-50
                  rounded-2xl
                  p-6
                  border-2 border-white
                  shadow-lg
                  text-center
                  h-full
                ">
                  {/* Step number */}
                  <div className="
                    w-12 h-12
                    rounded-full
                    bg-gradient-to-r from-blue-600 to-purple-600
                    text-white
                    font-bold
                    text-xl
                    flex items-center justify-center
                    mx-auto
                    mb-4
                  ">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-4">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h4 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            bg-gradient-to-r from-green-50 to-emerald-50
            rounded-2xl
            p-8 md:p-12
            border-2 border-green-100
          "
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Co zyskujesz?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-base md:text-lg">
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
