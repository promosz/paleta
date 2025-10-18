// Pricing Preview Section for Pre-Launch Landing Page
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift } from 'lucide-react'
import PricingCard from './shared/PricingCard'
import GradientBlob from './shared/GradientBlob'
import EmailSignupForm from './shared/EmailSignupForm'

export default function PricingPreviewSection() {
  const [showSignup, setShowSignup] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  
  const handlePlanClick = (planName: string) => {
    setSelectedPlan(planName)
    setShowSignup(true)
    // Scroll to form
    setTimeout(() => {
      const form = document.getElementById('pricing-signup-form')
      form?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }
  
  const plans = [
    {
      name: 'STARTER',
      price: 'Darmowy',
      period: 'na zawsze',
      description: 'Idealne na start',
      features: [
        { text: '5 analiz miesięcznie', included: true },
        { text: 'Basic AI analysis', included: true },
        { text: 'Ceny z 1 źródła (Allegro)', included: true },
        { text: 'Dashboard podstawowy', included: true },
        { text: 'Advanced AI features', included: false },
        { text: 'Market trends & volatility', included: false },
        { text: 'API access', included: false }
      ],
      ctaText: 'Zapisz się',
      isPopular: false
    },
    {
      name: 'PRO',
      price: 99,
      period: '/miesiąc',
      description: 'Dla profesjonalistów',
      features: [
        { text: 'Unlimited analizy', included: true },
        { text: 'Advanced AI analysis', included: true },
        { text: 'Ceny z 10+ platform', included: true },
        { text: 'AI Reports w języku naturalnym', included: true },
        { text: 'Market trends & volatility', included: true },
        { text: 'Własne reguły zakupowe', included: true },
        { text: 'API access', included: true },
        { text: 'Priority support', included: true },
        { text: 'Eksport do Excel/PDF', included: true }
      ],
      ctaText: 'Zapisz się (+ 3 msc gratis)',
      isPopular: true
    },
    {
      name: 'BUSINESS',
      price: 'Na żądanie',
      period: '',
      description: 'Dla firm',
      features: [
        { text: 'Wszystko z PRO +', included: true },
        { text: 'Dedykowane wsparcie', included: true },
        { text: 'Training & onboarding', included: true },
        { text: 'Custom integracje', included: true },
        { text: 'Multi-user accounts', included: true },
        { text: 'White-label (opcja)', included: true },
        { text: 'SLA guarantee', included: true }
      ],
      ctaText: 'Skontaktuj się',
      isPopular: false
    }
  ]
  
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Gradient Blobs */}
      <GradientBlob 
        size="xl" 
        position={{ top: '-20%', right: '-15%' }} 
        color="blue"
        opacity={0.12}
      />
      <GradientBlob 
        size="lg" 
        position={{ bottom: '-10%', left: '-10%' }} 
        color="purple"
        opacity={0.12}
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        {/* Early Access Bonus Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            bg-gradient-to-r from-green-500 to-emerald-600
            text-white
            rounded-2xl
            p-4 md:p-6
            text-center
            mb-12
            shadow-lg shadow-green-500/20
          "
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-lg md:text-xl font-bold">
              Wczesny Dostęp = 3 MIESIĄCE PRO GRATIS
            </span>
          </div>
          <p className="text-sm md:text-base text-green-50">
            Wartość: 297 zł • Bez zobowiązań • Tylko dla waitlist
          </p>
        </motion.div>
        
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
            Prosty Cennik.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zero Ukrytych Kosztów
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Wybierz plan dopasowany do Twoich potrzeb
          </p>
        </motion.div>
        
        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {plans.map((plan, idx) => (
            <PricingCard
              key={idx}
              {...plan}
              onCTAClick={() => handlePlanClick(plan.name)}
              index={idx}
            />
          ))}
        </div>
        
        {/* Signup Form (shown when plan selected) */}
        {showSignup && (
          <motion.div
            id="pricing-signup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="
              max-w-2xl mx-auto
              bg-white
              rounded-2xl
              border-2 border-blue-500
              p-6 md:p-8
              shadow-xl
            "
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Zapisz się na plan {selectedPlan}
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Otrzymasz wczesny dostęp + 3 miesiące PRO gratis
            </p>
            
            <EmailSignupForm 
              source="pricing"
              size="large"
              showOptionalFields={true}
            />
            
            <button
              onClick={() => setShowSignup(false)}
              className="
                mt-4
                text-sm text-gray-500
                hover:text-gray-700
                underline
                w-full text-center
              "
            >
              Anuluj
            </button>
          </motion.div>
        )}
        
        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-gray-600">
            💳 Płatności obsługujemy przez Stripe • 🔒 Bezpieczne szyfrowanie • 
            ↩️ Zwrot w 30 dni
          </p>
        </motion.div>
      </div>
    </section>
  )
}

