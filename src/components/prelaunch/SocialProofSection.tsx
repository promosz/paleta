// Social Proof Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { Star, Users, TrendingUp } from 'lucide-react'
import TestimonialCard from './shared/TestimonialCard'

export default function SocialProofSection() {
  const stats = [
    {
      icon: Users,
      value: '500+',
      label: 'Osób na waitlist'
    },
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Accuracy AI'
    },
    {
      icon: Star,
      value: '60 sek',
      label: 'Średni czas analizy'
    }
  ]
  
  const testimonials = [
    {
      name: 'Michał K.',
      role: 'Trader palet',
      company: 'ReturnsPro',
      avatar: 'MK',
      rating: 5,
      text: 'Wreszcie ktoś to zrobił! Analizowanie palet to był koszmar - 2-3 godziny na każdą. Teraz mam to w 60 sekund. Czekam na premierę!'
    },
    {
      name: 'Anna W.',
      role: 'Sklep e-commerce',
      company: 'Outlet24.pl',
      avatar: 'AW',
      rating: 5,
      text: 'Kupowałam palety "na oko" i sporo się przeliczyłam. AI które mi powie co jest rentowne a co nie - to game changer. Już się zapisałam!'
    },
    {
      name: 'Tomasz D.',
      role: 'Reseller marketplace',
      company: 'Allegro & Amazon',
      avatar: 'TD',
      rating: 5,
      text: 'Sprawdzanie cen na Allegro i Amazonie dla 100+ produktów to masakra. Jeśli to naprawdę działa tak jak opisują - będę używał codziennie.'
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
            Dołącz do{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Setek Traderów
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Setki osób już czeka na premierę. Zobacz, co o PalletAI mówią przyszli użytkownicy.
          </p>
        </motion.div>
        
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="
                bg-white
                rounded-2xl
                p-6 md:p-8
                text-center
                border border-gray-200
                shadow-lg
              "
            >
              <div className="
                inline-flex
                items-center
                justify-center
                w-16 h-16
                rounded-2xl
                bg-gradient-to-br from-blue-50 to-purple-50
                mb-4
              ">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
