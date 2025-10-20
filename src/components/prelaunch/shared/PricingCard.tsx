// Pricing Card for Pre-Launch page
import { motion } from 'framer-motion'
import { Check, X, Sparkles } from 'lucide-react'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  name: string
  price: string | number
  period?: string
  description: string
  features: PricingFeature[]
  isPopular?: boolean
  ctaText: string
  onCTAClick: () => void
  index?: number
}

export default function PricingCard({
  name,
  price,
  period = '/miesiąc',
  description,
  features,
  isPopular = false,
  ctaText,
  onCTAClick,
  index = 0
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        relative
        bg-white
        rounded-2xl
        p-6 md:p-8
        border-2
        transition-all duration-300
        flex flex-col
        h-full
        ${isPopular 
          ? 'border-blue-500 shadow-xl shadow-blue-100' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
        }
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="
          absolute -top-4 left-1/2 -translate-x-1/2
          px-4 py-1.5
          bg-gradient-to-r from-blue-600 to-purple-600
          text-white text-xs font-semibold
          rounded-full
          shadow-lg
          flex items-center gap-1
        ">
          <Sparkles className="w-3 h-3" />
          NAJBARDZIEJ POPULARNY
        </div>
      )}
      
      {/* Plan Name */}
      <div className="mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {name}
        </h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
      
      {/* Price */}
      <div className="mb-6">
        {price === 'Darmowy' || price === 'Na żądanie' ? (
          <div className="text-3xl md:text-4xl font-bold text-gray-900">
            {price}
          </div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-4xl md:text-5xl font-bold text-gray-900">
              {price}
            </span>
            <span className="text-xl text-gray-600">zł</span>
            <span className="text-sm text-gray-500">{period}</span>
          </div>
        )}
      </div>
      
      {/* Features List */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li 
            key={idx}
            className="flex items-start gap-3"
          >
            <div className={`
              flex-shrink-0 w-5 h-5 rounded-full
              flex items-center justify-center
              mt-0.5
              ${feature.included 
                ? 'bg-green-100 text-green-600' 
                : 'bg-gray-100 text-gray-400'
              }
            `}>
              {feature.included ? (
                <Check className="w-3 h-3" strokeWidth={3} />
              ) : (
                <X className="w-3 h-3" strokeWidth={2} />
              )}
            </div>
            <span className={`
              text-sm md:text-base
              ${feature.included ? 'text-gray-700' : 'text-gray-400'}
            `}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <button
        onClick={onCTAClick}
        className={`
          w-full
          py-3 md:py-4
          rounded-xl
          font-semibold
          text-sm md:text-base
          transition-all duration-200
          ${isPopular
            ? `
              bg-gradient-to-r from-blue-600 to-purple-600 
              text-white
              hover:shadow-lg hover:shadow-purple-500/30
              hover:scale-[1.02]
            `
            : `
              bg-gray-100 
              text-gray-900
              hover:bg-gray-200
            `
          }
        `}
      >
        {ctaText}
      </button>
      
      {/* Highlight glow for popular */}
      {isPopular && (
        <div className="
          absolute -inset-0.5 
          bg-gradient-to-r from-blue-600 to-purple-600 
          rounded-2xl 
          opacity-20 
          blur
          -z-10
        " />
      )}
    </motion.div>
  )
}

