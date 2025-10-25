// Feature Card for Pre-Launch page
import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index?: number
}

export default function FeatureCard({ 
  icon: Icon, 
  title, 
  description,
  index = 0 
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="
        group relative
        bg-white 
        border border-gray-200 
        rounded-2xl 
        p-6 md:p-8
        hover:border-[#4f39f6]/30
        hover:shadow-lg hover:shadow-[#4f39f6]/10
        transition-all duration-300
        h-full flex flex-col
      "
    >
      {/* Icon */}
      <div className="
        inline-flex items-center justify-center
        w-12 h-12 md:w-14 md:h-14
        rounded-xl
        bg-gradient-to-br from-[#4f39f6]/10 to-[#9810fa]/10
        group-hover:from-[#4f39f6]/20 group-hover:to-[#9810fa]/20
        transition-colors duration-300
        mb-4
      ">
        <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#4f39f6]" />
      </div>
      
      {/* Title */}
      <h3 className="
        text-lg md:text-xl font-semibold 
        text-gray-900 
        mb-2
        group-hover:text-[#4f39f6]
        transition-colors duration-300
      ">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 text-sm md:text-base leading-relaxed flex-grow">
        {description}
      </p>
      
      {/* Subtle gradient overlay on hover */}
      <div className="
        absolute inset-0 
        rounded-2xl 
        bg-gradient-to-br from-[#4f39f6]/0 to-[#9810fa]/0
        group-hover:from-[#4f39f6]/5 group-hover:to-[#9810fa]/5
        pointer-events-none
        transition-all duration-300
      " />
    </motion.div>
  )
}

