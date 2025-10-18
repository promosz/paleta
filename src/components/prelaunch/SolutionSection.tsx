// Solution Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { FileUp, Sparkles, FileText, ArrowRight } from 'lucide-react'
import GradientBlob from './shared/GradientBlob'

export default function SolutionSection() {
  const steps = [
    {
      icon: FileUp,
      number: '01',
      title: 'Wrzuć Plik',
      description: 'Upload pliku Excel z ofertą palety (XLSX, CSV, PDF). Obsługujemy wszystkie popularne formaty.'
    },
    {
      icon: Sparkles,
      number: '02',
      title: 'AI Analizuje',
      description: 'Sztuczna inteligencja sprawdza każdy produkt, porównuje ceny na 10+ platformach i wykrywa trendy.'
    },
    {
      icon: FileText,
      number: '03',
      title: 'Otrzymujesz Raport',
      description: 'Jasna rekomendacja: KUP / ROZWAŻ / UNIKAJ. Szczegółowa analiza każdego produktu i lista ostrzeżeń.'
    }
  ]
  
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Gradient Blobs */}
      <GradientBlob 
        size="lg" 
        position={{ top: '10%', left: '-10%' }} 
        color="blue"
        opacity={0.1}
      />
      <GradientBlob 
        size="md" 
        position={{ bottom: '10%', right: '-5%' }} 
        color="purple"
        opacity={0.1}
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
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
            Poznaj{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PalletAI
            </span>
            {' '}- Twój Inteligentny Asystent Zakupowy
          </h2>
          <p className="
            text-xl md:text-2xl 
            font-medium
            text-blue-600 
            mb-4
          ">
            Wrzuć plik Excel z paletą. AI zrobi resztę.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Automatyczna analiza rentowności w 3 prostych krokach
          </p>
        </motion.div>
        
        {/* Steps */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="
            hidden lg:block
            absolute top-1/2 left-0 right-0
            h-0.5
            bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200
            -translate-y-1/2
            -z-10
          " />
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="
                    bg-white
                    rounded-2xl
                    p-6 md:p-8
                    border-2 border-gray-200
                    hover:border-blue-300
                    hover:shadow-xl
                    transition-all duration-300
                    text-center
                    relative
                  "
                >
                  {/* Step Number */}
                  <div className="
                    absolute -top-4 left-1/2 -translate-x-1/2
                    w-12 h-12
                    rounded-full
                    bg-gradient-to-r from-blue-600 to-purple-600
                    flex items-center justify-center
                    text-white
                    font-bold
                    text-lg
                    shadow-lg shadow-purple-500/30
                  ">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="
                    inline-flex items-center justify-center
                    w-16 h-16 md:w-20 md:h-20
                    rounded-2xl
                    bg-gradient-to-br from-blue-50 to-purple-50
                    mb-4
                    mt-4
                  ">
                    <step.icon className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="
                    text-xl md:text-2xl 
                    font-bold 
                    text-gray-900 
                    mb-3
                  ">
                    {step.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
                
                {/* Arrow (Desktop) */}
                {idx < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1 + idx * 0.2 }}
                    className="
                      hidden lg:block
                      absolute top-1/2 -right-4
                      -translate-y-1/2
                      z-10
                    "
                  >
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="
            mt-12 md:mt-16
            text-center
            bg-gradient-to-r from-blue-50 to-purple-50
            border border-blue-100
            rounded-2xl
            p-6 md:p-8
          "
        >
          <p className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            ⚡ Średni czas analizy: <span className="text-blue-600">60 sekund</span>
          </p>
          <p className="text-gray-600">
            To co zajmowało Ci 2 godziny, AI zrobi w minutę
          </p>
        </motion.div>
      </div>
    </section>
  )
}

