// Final CTA Section for Pre-Launch Landing Page
import React from 'react'
import { motion } from 'framer-motion'
import { Rocket, CheckCircle, Bell, Gift, Shield, Clock } from 'lucide-react'
import EmailSignupForm from './shared/EmailSignupForm'
import GradientBlob from './shared/GradientBlob'

export default function FinalCTASection() {
  
  const benefits = [
    {
      icon: Clock,
      text: 'Wczesny dostęp - 2 tygodnie przed oficjalną premierą'
    },
    {
      icon: Gift,
      text: '3 miesiące PRO gratis - wartość 297 zł (tylko dla waitlist)'
    },
    {
      icon: Bell,
      text: 'Bądź pierwszy - powiadomienie o starcie w momencie premiery'
    },
    {
      icon: Shield,
      text: 'Zero spamu - możesz wypisać się w każdej chwili'
    }
  ]
  
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-[#4f39f6] via-[#9810fa] to-[#4f39f6] overflow-hidden">
      {/* Gradient Blobs - Largest */}
      <GradientBlob 
        size="xl" 
        position={{ top: '-30%', left: '-20%' }} 
        color="indigo"
        opacity={0.15}
      />
      <GradientBlob 
        size="xl" 
        position={{ top: '-20%', right: '-20%' }} 
        color="violet"
        opacity={0.15}
      />
      <GradientBlob 
        size="lg" 
        position={{ bottom: '-20%', left: '50%' }} 
        color="fuchsia"
        opacity={0.12}
      />
      <GradientBlob 
        size="lg" 
        position={{ bottom: '-15%', right: '10%' }} 
        color="purple"
        opacity={0.12}
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
        <div className="
          bg-white/95 backdrop-blur-sm
          rounded-3xl
          border-2 border-white/20
          shadow-2xl shadow-black/10
          p-8 md:p-12 lg:p-16
        ">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="
              text-3xl md:text-4xl lg:text-5xl 
              font-bold 
              text-gray-900 
              mb-6
            ">
              Nie Przegap Startu -{' '}
              <span className="bg-gradient-to-r from-[#4f39f6] to-[#9810fa] bg-clip-text text-transparent">
                Dołącz do Waitlist!
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Premiera już w Marcu 2025. Bądź w pierwszej setce!
            </p>
          </motion.div>
          
          {/* Email Signup Form - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <EmailSignupForm 
              source="final_cta"
              size="large"
              showOptionalFields={true}
            />
          </motion.div>
          
          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="
                  flex-shrink-0
                  w-12 h-12
                  rounded-xl
                  bg-gradient-to-br from-[#4f39f6]/10 to-[#9810fa]/10
                  flex items-center justify-center
                  border border-[#4f39f6]/20
                ">
                  <benefit.icon className="w-6 h-6 text-[#4f39f6]" />
                </div>
                <div className="pt-1">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="
              text-center
              pt-8
              border-t border-gray-200
            "
          >
          </motion.div>
        </div>
      </div>
    </section>
  )
}

