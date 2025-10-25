// Hero Section for Pre-Launch Landing Page

import { motion } from 'framer-motion'
import { Users, Gift } from 'lucide-react'
import EmailSignupForm from './shared/EmailSignupForm'
import GradientBlob from './shared/GradientBlob'
import { useEffect, useState } from 'react'
import { getWaitlistCount } from '../../services/waitlistService'
import sparklesIcon from '../../assets/figma-icons/sparkles-icon.svg'
import checkIcon from '../../assets/figma-icons/check-icon.svg'
import targetIcon from '../../assets/figma-icons/target-icon.svg'
import shieldIcon from '../../assets/figma-icons/shield-icon.svg'
import XRayAnimation from './shared/XRayAnimation'

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
        color="indigo"
        opacity={0.15}
      />
      <GradientBlob 
        size="lg" 
        position={{ bottom: '-10%', left: '-5%' }} 
        color="violet"
        opacity={0.15}
      />
      <GradientBlob 
        size="md" 
        position={{ top: '30%', left: '50%' }} 
        color="fuchsia"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,255,255,0.8)] border border-[#c6d2ff] mb-6"
            >
              <img src={sparklesIcon} alt="" className="w-3 h-3" />
              <span className="text-sm font-medium text-[#4f39f6]">
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
              Już wkrótce:{' '}
              <span className="bg-gradient-to-r from-[#4f39f6] to-[#9810fa] bg-clip-text text-transparent">
                Inteligentna
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#4f39f6] to-[#9810fa] bg-clip-text text-transparent">
                Analiza Palet
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
              Oszczędzaj czas i pieniądze. Pozwól AI ocenić rentowność palety produktów w 60 sekund - zanim podejmiesz decyzję o zakupie palet.
            </motion.p>
            
            {/* Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3 mb-10"
            >
              {[
                { icon: checkIcon, text: 'Analiza w 60 sekund zamiast 2 godzin' },
                { icon: targetIcon, text: '85% dokładnośCI - AI wie, co się opłaca' },
                { icon: shieldIcon, text: 'Unikaj złych inwestycji - wykryj nieopłacalne przed ryzykiem' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-3 justify-center lg:justify-start"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100">
                    <img src={item.icon} alt="" className="w-4 h-4" />
                  </div>
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
            {/* X-Ray Animation */}
            <div className="
              relative
              rounded-2xl
              shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]
              transform hover:scale-[1.02]
              transition-transform duration-500
              w-full
              aspect-square
            ">
              <XRayAnimation className="w-full h-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
