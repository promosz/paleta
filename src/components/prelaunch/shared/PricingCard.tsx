// Pricing Card Component
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  badge?: string
  savings?: string
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted = false,
  badge,
  savings
}: PricingCardProps) {
  return (
    <div className={`
      relative
      rounded-2xl
      p-6 md:p-8
      h-full
      flex flex-col
      ${highlighted 
        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105' 
        : 'bg-white border-2 border-gray-200'
      }
    `}>
      {/* Badge */}
      {badge && (
        <div className={`
          absolute -top-3 left-1/2 -translate-x-1/2
          px-4 py-1.5
          rounded-full
          text-xs font-semibold
          whitespace-nowrap
          ${highlighted 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900' 
            : 'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
          }
        `}>
          {badge}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-6">
        <h3 className={`
          text-2xl font-bold mb-2
          ${highlighted ? 'text-white' : 'text-gray-900'}
        `}>
          {name}
        </h3>
        <p className={`
          text-sm
          ${highlighted ? 'text-blue-100' : 'text-gray-600'}
        `}>
          {description}
        </p>
      </div>
      
      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className={`
            text-5xl font-bold
            ${highlighted ? 'text-white' : 'text-gray-900'}
          `}>
            {price}
          </span>
          <span className={`
            text-lg
            ${highlighted ? 'text-blue-100' : 'text-gray-600'}
          `}>
            zł
          </span>
        </div>
        <p className={`
          text-sm mt-1
          ${highlighted ? 'text-blue-100' : 'text-gray-600'}
        `}>
          {period}
        </p>
        {savings && (
          <p className={`
            text-sm font-semibold mt-2
            ${highlighted ? 'text-yellow-300' : 'text-green-600'}
          `}>
            💰 {savings}
          </p>
        )}
      </div>
      
      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full
          py-3 px-6
          rounded-xl
          font-semibold
          transition-all duration-200
          mb-6
          ${highlighted
            ? 'bg-white text-blue-600 hover:bg-blue-50'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
          }
        `}
      >
        {cta}
      </motion.button>
      
      {/* Features */}
      <div className="space-y-3 flex-grow">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <Check className={`
              w-5 h-5 flex-shrink-0 mt-0.5
              ${highlighted ? 'text-green-300' : 'text-green-600'}
            `} />
            <span className={`
              text-sm
              ${highlighted ? 'text-white' : 'text-gray-700'}
            `}>
              {feature}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
