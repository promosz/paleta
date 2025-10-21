// Decorative gradient blob for pre-launch page
import { motion } from 'framer-motion'

interface GradientBlobProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  color?: 'blue' | 'purple' | 'pink' | 'teal' | 'orange' | 'indigo' | 'violet' | 'fuchsia'
  opacity?: number
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  animate?: boolean
}

const sizeClasses = {
  sm: 'w-32 h-32 md:w-48 md:h-48',
  md: 'w-48 h-48 md:w-64 md:h-64',
  lg: 'w-64 h-64 md:w-96 md:h-96',
  xl: 'w-96 h-96 md:w-[600px] md:h-[600px]'
}

const colorClasses = {
  blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
  purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
  pink: 'bg-gradient-to-br from-pink-400 to-pink-600',
  teal: 'bg-gradient-to-br from-teal-400 to-cyan-600',
  orange: 'bg-gradient-to-br from-orange-400 to-pink-500',
  indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  violet: 'bg-gradient-to-br from-violet-400 to-violet-600',
  fuchsia: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-600'
}

const blurClasses = {
  sm: 'blur-2xl',
  md: 'blur-3xl',
  lg: 'blur-[100px]',
  xl: 'blur-[150px]'
}

export default function GradientBlob({
  size = 'lg',
  position,
  color = 'blue',
  opacity = 0.2,
  blur = 'xl',
  animate = true
}: GradientBlobProps) {
  const positionStyles = {
    top: position.top,
    right: position.right,
    bottom: position.bottom,
    left: position.left
  }

  const BlobComponent = animate ? motion.div : 'div'
  
  const animationProps = animate ? {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      x: [0, 20, -20, 0],
      y: [0, -20, 20, 0]
    },
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  } : {}

  return (
    <BlobComponent
      className={`
        absolute -z-10 rounded-full
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${blurClasses[blur]}
        pointer-events-none
      `}
      style={{
        ...positionStyles,
        opacity
      }}
      {...animationProps}
    />
  )
}




