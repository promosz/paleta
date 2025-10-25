// Testimonial Card for Pre-Launch page
import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  name: string
  role: string
  company?: string
  rating?: number
  avatar?: string
  index?: number
}

export default function TestimonialCard({
  quote,
  name,
  role,
  company,
  rating = 5,
  avatar,
  index = 0
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="
        relative
        bg-white
        border border-gray-200
        rounded-2xl
        p-6 md:p-8
        hover:border-[#4f39f6]/20
        hover:shadow-lg hover:shadow-[#4f39f6]/10
        transition-all duration-300
        h-full
        flex flex-col
      "
    >
      {/* Quote Icon */}
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-8 h-8 text-[#4f39f6]/20" />
        
        {/* Star Rating */}
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star 
              key={i} 
              className="w-4 h-4 fill-yellow-400 text-yellow-400" 
            />
          ))}
        </div>
      </div>
      
      {/* Quote Text */}
      <blockquote className="
        text-gray-700 
        text-sm md:text-base 
        leading-relaxed 
        mb-6
        flex-grow
      ">
        "{quote}"
      </blockquote>
      
      {/* Author Info */}
      <div className="flex items-center gap-3 mt-auto">
        {/* Avatar */}
        <div className="
          w-12 h-12 
          rounded-full 
          bg-gradient-to-br from-[#4f39f6] to-[#9810fa]
          flex items-center justify-center
          text-white font-semibold
          text-lg
          flex-shrink-0
          overflow-hidden
        ">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{name.charAt(0)}</span>
          )}
        </div>
        
        {/* Name & Role */}
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 text-sm md:text-base truncate">
            {name}
          </div>
          <div className="text-gray-600 text-xs md:text-sm truncate">
            {role}
            {company && ` @ ${company}`}
          </div>
        </div>
      </div>
      
      {/* Subtle gradient border on hover */}
      <div className="
        absolute inset-0 
        rounded-2xl 
        bg-gradient-to-br from-[#4f39f6]/0 via-transparent to-[#9810fa]/0
        opacity-0 hover:opacity-100
        pointer-events-none
        transition-opacity duration-300
      " 
      style={{ padding: '1px' }}
      />
    </motion.div>
  )
}

