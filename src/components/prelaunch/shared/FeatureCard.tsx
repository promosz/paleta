// Feature Card Component
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-100'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    border: 'border-red-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-100'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    border: 'border-orange-100'
  },
  teal: {
    bg: 'bg-teal-50',
    icon: 'text-teal-600',
    border: 'border-teal-100'
  }
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color = 'blue' 
}: FeatureCardProps) {
  const colors = colorClasses[color]
  
  return (
    <div className="
      bg-white
      rounded-2xl
      p-6 md:p-8
      border border-gray-200
      hover:shadow-xl
      hover:scale-[1.02]
      transition-all duration-300
      h-full
    ">
      {/* Icon */}
      <div className={`
        w-12 h-12
        rounded-xl
        ${colors.bg}
        flex items-center justify-center
        mb-4
      `}>
        <Icon className={`w-6 h-6 ${colors.icon}`} />
      </div>
      
      {/* Content */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
