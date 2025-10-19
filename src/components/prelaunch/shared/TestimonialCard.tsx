// Testimonial Card Component
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  text: string
}

export default function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  text
}: TestimonialCardProps) {
  return (
    <div className="
      bg-white
      rounded-2xl
      p-6 md:p-8
      border border-gray-200
      hover:shadow-xl
      transition-all duration-300
      h-full
      flex flex-col
    ">
      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: rating }).map((_, idx) => (
          <Star 
            key={idx} 
            className="w-4 h-4 fill-yellow-400 text-yellow-400" 
          />
        ))}
      </div>
      
      {/* Testimonial Text */}
      <p className="text-gray-700 leading-relaxed mb-6 flex-grow">
        "{text}"
      </p>
      
      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {/* Avatar */}
        <div className="
          w-12 h-12
          rounded-full
          bg-gradient-to-br from-blue-600 to-purple-600
          flex items-center justify-center
          text-white
          font-semibold
          flex-shrink-0
        ">
          {avatar}
        </div>
        
        {/* Info */}
        <div>
          <div className="font-semibold text-gray-900">
            {name}
          </div>
          <div className="text-sm text-gray-600">
            {role}
          </div>
          <div className="text-xs text-gray-500">
            {company}
          </div>
        </div>
      </div>
    </div>
  )
}
