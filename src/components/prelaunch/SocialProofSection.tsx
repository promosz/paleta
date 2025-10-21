// Social Proof Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { Users, Target, Star, TrendingUp } from 'lucide-react'
import TestimonialCard from './shared/TestimonialCard'

export default function SocialProofSection() {
  const testimonials = [
    {
      quote: 'Wcześniej spędzałem 3-4 godziny dziennie na sprawdzaniu cen i obliczaniu marży. PalletAI robi to w minutę. Mogę się skupić na negocjacjach i sprzedaży. Game changer!',
      name: 'Tomasz K.',
      role: 'Trader palet',
      company: '5 lat doświadczenia',
      rating: 5
    },
    {
      quote: 'Kupiłam paletę, która według PalletAI była "ryzykowna". Zignorowałam ostrzeżenie i straciłam 2000 zł. Od tego czasu słucham AI - i działa!',
      name: 'Anna M.',
      role: 'Właścicielka sklepu e-commerce',
      rating: 5
    },
    {
      quote: 'Najlepsza inwestycja w moim biznesie. Za 99 zł miesięcznie oszczędzam tysiące na złych decyzjach. ROI w pierwszym tygodniu!',
      name: 'Michał P.',
      role: 'Reseller Marketplace',
      rating: 5
    }
  ]
  
  const stats = [
    {
      icon: Users,
      value: '500+',
      label: 'Beta testerów',
      color: 'blue'
    },
    {
      icon: Target,
      value: '10,000+',
      label: 'Przeanalizowanych palet',
      color: 'purple'
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'Średnia ocena',
      color: 'yellow'
    },
    {
      icon: TrendingUp,
      value: '92%',
      label: 'Poleciłoby znajomym',
      color: 'green'
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
            <span className="bg-gradient-to-r from-[#4f39f6] to-[#9810fa] bg-clip-text text-transparent">
              500+ Osób
            </span>
            , Które Już Testują PalletAI
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Zobacz, co mówią beta testerzy o aplikacji
          </p>
        </motion.div>
        
        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              {...testimonial}
              index={idx}
            />
          ))}
        </div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                className="
                  bg-white
                  rounded-2xl
                  p-6 md:p-8
                  border border-gray-200
                  text-center
                  hover:border-blue-200
                  hover:shadow-lg
                  transition-all duration-300
                "
              >
                <div className={`
                  inline-flex items-center justify-center
                  w-12 h-12 md:w-14 md:h-14
                  rounded-xl
                  mb-3
                  bg-${stat.color}-50
                `}>
                  <stat.icon className={`w-6 h-6 md:w-7 md:h-7 text-${stat.color}-600`} />
                </div>
                
                <div className={`
                  text-3xl md:text-4xl 
                  font-bold 
                  text-${stat.color}-600
                  mb-1
                `}>
                  {stat.value}
                </div>
                
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

