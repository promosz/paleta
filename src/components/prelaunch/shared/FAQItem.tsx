// FAQ Item - Collapsible Question/Answer
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function FAQItem({ 
  question, 
  answer, 
  defaultOpen = false 
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="
      border border-gray-200 
      rounded-xl 
      overflow-hidden
      hover:border-blue-200
      transition-colors duration-200
    ">
      {/* Question Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full 
          flex items-center justify-between 
          p-4 md:p-6
          text-left
          bg-white
          hover:bg-gray-50
          transition-colors duration-200
        "
        aria-expanded={isOpen}
      >
        <span className="
          text-base md:text-lg 
          font-semibold 
          text-gray-900
          pr-4
        ">
          {question}
        </span>
        
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      
      {/* Answer Panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: "auto", 
              opacity: 1,
              transition: {
                height: { duration: 0.3 },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: { duration: 0.3, delay: 0.1 },
                opacity: { duration: 0.2 }
              }
            }}
            className="overflow-hidden"
          >
            <div className="
              px-4 md:px-6 
              pb-4 md:pb-6
              pt-2
              bg-gray-50
              border-t border-gray-100
            ">
              <p className="
                text-sm md:text-base 
                text-gray-700 
                leading-relaxed
                whitespace-pre-line
              ">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}






