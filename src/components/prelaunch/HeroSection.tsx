// Hero Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { Sparkles, Users, Gift } from 'lucide-react'
import EmailSignupForm from './shared/EmailSignupForm'
import GradientBlob from './shared/GradientBlob'
import { useEffect, useState } from 'react'
import { getWaitlistCount } from '../../services/waitlistService'

export default function HeroSection() {
  const [waitlistCount, setWaitlistCount] = useState(500)
  
  useEffect(() => {
    const fetchCount = async () => {
      const count = await getWaitlistCount()
      setWaitlistCount(count)
    }
    fetchCount()
  }, [])
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white pt-20 pb-12">
      {/* Gradient Blobs */}
      <GradientBlob 
        size="xl" 
        position={{ top: '-20%', right: '-10%' }} 
        color="blue"
        opacity={0.15}
      />
      <GradientBlob 
        size="lg" 
        position={{ bottom: '-10%', left: '-5%' }} 
        color="purple"
        opacity={0.15}
      />
      <GradientBlob 
        size="md" 
        position={{ top: '30%', left: '50%' }} 
        color="pink"
        opacity={0.1}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                Premiera w Marcu 2026
              </span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="
                text-4xl md:text-5xl lg:text-6xl 
                font-bold 
                text-gray-900 
                mb-6
                leading-tight
              "
            >
              Już Wkrótce:{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inteligentna Analiza Palet
              </span>{' '}
              z AI
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="
                text-lg md:text-xl 
                text-gray-600 
                mb-8
                leading-relaxed
                max-w-2xl
                mx-auto lg:mx-0
              "
            >
              Oszczędź czas i pieniądze. Pozwól AI ocenić rentowność palety produktów w 60 sekund - zanim podejmiesz decyzję o zakupie.
            </motion.p>
            
            {/* Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {[
                { icon: '⚡', text: 'Analiza w 60 sekund zamiast 2 godzin' },
                { icon: '🎯', text: '85% dokładności - AI wie, co się opłaca' },
                { icon: '💰', text: 'Unikaj złych inwestycji - wykryj nieopłacalne produkty' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gray-700 text-sm md:text-base">
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Email Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6"
            >
              <EmailSignupForm 
                source="hero"
                size="large"
                inline={true}
              />
            </motion.div>
            
            {/* Social Proof & Bonus */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm"
            >
              {/* Waitlist Count */}
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>
                  Dołącz do <strong className="text-gray-900">{waitlistCount}+</strong> osób czekających na premierę
                </span>
              </div>
              
              {/* Bonus Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="text-green-700 font-medium">
                  3 miesiące PRO gratis
                </span>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Dashboard Preview Mockup */}
            <div className="
              relative
              bg-white
              rounded-2xl
              shadow-2xl shadow-blue-500/10
              border border-gray-200
              overflow-hidden
              transform rotate-2 hover:rotate-0
              transition-transform duration-500
            ">
              {/* Mockup Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
              </div>
              
              {/* Mockup Content */}
              <div className="p-6 space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Produkty', value: '127', color: 'blue' },
                    { label: 'Rentowność', value: '78%', color: 'green' },
                    { label: 'Ostrzeżenia', value: '3', color: 'yellow' }
                  ].map((stat, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-50 rounded-lg p-3 text-center"
                    >
                      <div className={`text-2xl font-bold text-${stat.color}-600`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
                
                {/* Chart Placeholder */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 h-48 flex items-end justify-around">
                  {[65, 85, 72, 90, 78, 88, 95].map((height, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: 1 + idx * 0.1 }}
                      className="w-8 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t"
                    />
                  ))}
                </div>
                
                {/* Product List Preview */}
                <div className="space-y-2">
                  {[1, 2, 3].map((_, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-purple-500" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </div>
                      <div className="h-4 bg-green-200 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="
                absolute -right-4 top-1/4
                bg-white
                rounded-xl
                shadow-xl
                p-4
                border border-gray-200
              "
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-gray-900">
                  AI Analyzing...
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
