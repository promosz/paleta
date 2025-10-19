// Pricing Preview Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { DollarSign, Check } from 'lucide-react'
import PricingCard from './shared/PricingCard'

export default function PricingPreviewSection() {
  const plans = [
    {
      name: 'STARTER',
      price: '0',
      period: 'na zawsze',
      description: 'Idealne do testów',
      features: [
        '5 analiz miesięcznie',
        'Podstawowe raporty',
        'Analiza do 50 produktów',
        'Email support'
      ],
      cta: 'Zacznij za darmo',
      highlighted: false,
      badge: 'Darmowy'
    },
    {
      name: 'PRO',
      price: '99',
      period: 'miesięcznie',
      description: 'Dla profesjonalnych traderów',
      features: [
        'Unlimited analiz',
        'Zaawansowane raporty AI',
        'Analiza do 500 produktów',
        'Ostrzeżenia przed ryzykiem',
        'Porównanie z konkurencją',
        'Export do Excel/PDF',
        'Priority support',
        'API access (wkrótce)'
      ],
      cta: 'Wybierz PRO',
      highlighted: true,
      badge: '3 miesiące gratis dla waitlist!',
      savings: 'Oszczędzasz 297 zł'
    },
    {
      name: 'BUSINESS',
      price: '299',
      period: 'miesięcznie',
      description: 'Dla firm i zespołów',
      features: [
        'Wszystko z PRO',
        '5 kont użytkowników',
        'Analiza do 2000 produktów',
        'Własne reguły i kryteria',
        'Integracje (Allegro, Amazon)',
        'Dedykowany account manager',
        'SLA 99.9%',
        'Custom features na zamówienie'
      ],
      cta: 'Kontakt',
      highlighted: false,
      badge: 'Najpopularniejsze w firmach'
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 mb-6">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl 
            font-bold 
            text-gray-900 
            mb-4
          ">
            Prosty,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Przejrzysty Cennik
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Bez ukrytych opłat. Anuluj w każdej chwili. 30 dni gwarancji zwrotu pieniędzy.
          </p>
          
          {/* Waitlist Bonus */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="
              inline-flex
              items-center
              gap-2
              px-6 py-3
              bg-gradient-to-r from-green-50 to-emerald-50
              border-2 border-green-200
              rounded-full
            "
          >
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">
              🎁 Waitlist = 3 miesiące PRO gratis (wartość 297 zł)
            </span>
          </motion.div>
        </motion.div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <PricingCard {...plan} />
            </motion.div>
          ))}
        </div>
        
        {/* FAQ Pricing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="
            mt-12
            text-center
            bg-blue-50
            rounded-2xl
            p-6 md:p-8
            border border-blue-100
          "
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
            Najczęściej zadawane pytania o cennik
          </h3>
          <div className="space-y-3 text-left max-w-2xl mx-auto">
            <div>
              <p className="font-semibold text-gray-900">Czy mogę anulować w każdej chwili?</p>
              <p className="text-gray-600">Tak! Bez zobowiązań. Jeden klik w ustawieniach.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Czy dostanę fakturę VAT?</p>
              <p className="text-gray-600">Oczywiście! Automatyczna faktura po każdej płatności.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Co jeśli nie będę zadowolony?</p>
              <p className="text-gray-600">30 dni gwarancji zwrotu pieniędzy - bez pytań.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
