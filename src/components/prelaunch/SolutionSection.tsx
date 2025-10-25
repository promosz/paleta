// Solution Section for Pre-Launch Landing Page
import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Brain, BarChart3 } from 'lucide-react'

export default function SolutionSection() {
  const steps = [
    {
      step: '01',
      title: 'Wrzuć Plik',
      description: 'Upload pliku Excel z ofertą palety (XLSX, CSV, PDF). Obsługujemy wszystkie popularne formaty.',
      icon: Upload
    },
    {
      step: '02',
      title: 'AI Analizuje',
      description: 'Sztuczna inteligencja sprawdza każdy produkt, porównuje ceny na 10+ platformach i wykreśla trendy.',
      icon: Brain
    },
    {
      step: '03',
      title: 'Otrzymujesz Raport',
      description: 'Jasna rekomendacja: KUP / ROZWAŻ / UNIKAJ. Szczegółowa analiza każdego produktu i listy ostrzeżeń.',
      icon: BarChart3
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
            Poznaj{' '}
            <span className="text-[#4f39f6]">
              PalletAI
            </span>
          </h2>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Twój Inteligentny Asystent Zakupowy
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Wrzuć plik Excel z paletą.
          </p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            AI zrobi reszte.
          </p>
        </motion.div>
        
        {/* How it works - Steps */}
        <div className="mb-16">
          <p className="text-xl md:text-2xl text-gray-600 text-center mb-10">
            Automatyczna analiza rentowności w 3 prostych krokach
          </p>
          
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
                {/* Step Card */}
                <div className="
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  p-6
                  text-center
                  h-full
                  flex flex-col items-center
                  relative
                  shadow-lg
                  shadow-[#4f39f6]/5
                ">
                  {/* Step number badge */}
                  <div className="
                    w-10 h-10
                    rounded-full
                    bg-[#4f39f6]
                    text-white
                    font-normal
                    text-base
                    flex items-center justify-center
                    absolute top-4 left-4
                  ">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-20 h-20 flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4f39f6]/10 to-[#9810fa]/10 flex items-center justify-center">
                      <step.icon className="w-12 h-12 text-[#4f39f6]" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  )
}
