// Email Signup Form for Pre-Launch Waitlist
import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { addToWaitlist } from '../../../services/waitlistService'
import type { WaitlistSource, BusinessType } from '../../../types/waitlist'

interface EmailSignupFormProps {
  source?: WaitlistSource
  size?: 'default' | 'large'
  showOptionalFields?: boolean
  inline?: boolean
  className?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function EmailSignupForm({ 
  source = 'hero',
  size = 'default',
  showOptionalFields = false,
  inline = false,
  className = ''
}: EmailSignupFormProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [businessType, setBusinessType] = useState<BusinessType | ''>('')
  const [agreed, setAgreed] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!email.trim()) {
      setErrorMessage('Podaj adres email')
      return
    }
    
    if (!agreed) {
      setErrorMessage('Musisz zaakceptować warunki')
      return
    }
    
    setFormState('loading')
    setErrorMessage('')
    
    // Submit to Supabase
    const result = await addToWaitlist({
      email: email.trim(),
      first_name: firstName.trim() || undefined,
      business_type: businessType || undefined,
      source
    })
    
    if (result.success) {
      setFormState('success')
      // Clear form
      setEmail('')
      setFirstName('')
      setBusinessType('')
      setAgreed(false)
    } else {
      setFormState('error')
      setErrorMessage(result.message)
      
      // Reset to idle after 3 seconds
      setTimeout(() => {
        setFormState('idle')
      }, 3000)
    }
  }
  
  const isLarge = size === 'large'
  
  // Success State
  if (formState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`
          bg-green-50 
          border-2 border-green-200 
          rounded-2xl 
          p-6 md:p-8
          text-center
          ${className}
        `}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        </motion.div>
        
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Dziękujemy! Jesteś na liście!
        </h3>
        
        <p className="text-gray-700 mb-4">
          Sprawdź swoją skrzynkę email - właśnie wysłaliśmy Ci potwierdzenie.
        </p>
        
        <div className="bg-white rounded-lg p-4 mb-4 text-left">
          <p className="text-sm text-gray-700 font-medium mb-2">Co dalej?</p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Potwierdź adres email (kliknij link w mailu)</li>
            <li>Dodaj nas do kontaktów: kontakt@palletai.com</li>
            <li>Czekaj na powiadomienie o premierze (Luty 2026)</li>
          </ol>
        </div>
        
        <p className="text-sm text-gray-600">
          <strong>P.S.</strong> Już za 2 tygodnie przed startem otrzymasz wczesny dostęp!
        </p>
      </motion.div>
    )
  }
  
  // Form
  return (
    <form 
      onSubmit={handleSubmit}
      className={className}
    >
      <div className={`
        flex flex-col gap-3
        ${inline ? 'md:flex-row md:items-start' : ''}
      `}>
        {/* Email Input */}
        <div className="flex-grow">
          <div className="relative">
            <Mail className={`
              absolute left-3 md:left-4 top-1/2 -translate-y-1/2 
              text-gray-400
              ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}
            `} />
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Twój adres email"
              disabled={formState === 'loading'}
              className={`
                w-full
                border-2 border-gray-200
                rounded-xl
                bg-white
                text-gray-900
                placeholder:text-gray-400
                focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isLarge 
                  ? 'pl-11 md:pl-12 pr-4 py-4 text-base md:text-lg' 
                  : 'pl-10 pr-4 py-3 text-sm md:text-base'
                }
              `}
              required
            />
          </div>
          
          {/* Optional Fields */}
          {showOptionalFields && (
            <div className="mt-3 space-y-3">
              {/* First Name */}
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Imię (opcjonalnie)"
                disabled={formState === 'loading'}
                className="
                  w-full
                  border-2 border-gray-200
                  rounded-xl
                  px-4 py-3
                  bg-white
                  text-gray-900
                  placeholder:text-gray-400
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  transition-all duration-200
                  disabled:opacity-50
                  text-sm md:text-base
                "
              />
              
              {/* Business Type */}
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                disabled={formState === 'loading'}
                className="
                  w-full
                  border-2 border-gray-200
                  rounded-xl
                  px-4 py-3
                  bg-white
                  text-gray-900
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  transition-all duration-200
                  disabled:opacity-50
                  text-sm md:text-base
                "
              >
                <option value="">Rodzaj biznesu (opcjonalnie)</option>
                <option value="trader_palet">Trader palet</option>
                <option value="sklep_ecommerce">Sklep e-commerce</option>
                <option value="reseller">Reseller marketplace</option>
                <option value="hurtownia">Hurtownia</option>
                <option value="inne">Inne</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={formState === 'loading' || !agreed}
          className={`
            ${inline ? 'md:flex-shrink-0' : 'w-full'}
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white
            font-semibold
            rounded-xl
            hover:shadow-lg hover:shadow-purple-500/30
            hover:scale-[1.02]
            active:scale-[0.98]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100 disabled:hover:shadow-none
            flex items-center justify-center gap-2
            ${isLarge 
              ? 'px-8 md:px-10 py-4 text-base md:text-lg' 
              : 'px-6 md:px-8 py-3 text-sm md:text-base'
            }
          `}
        >
          {formState === 'loading' ? (
            <>
              <Loader className={`${isLarge ? 'w-5 h-5' : 'w-4 h-4'} animate-spin`} />
              <span>Zapisuję...</span>
            </>
          ) : (
            <>
              <Sparkles className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
              <span>Zapisz się</span>
            </>
          )}
        </button>
      </div>
      
      {/* RODO Checkbox */}
      <div className="mt-3">
        <label className="flex items-start gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={formState === 'loading'}
            className="
              mt-0.5
              w-4 h-4
              rounded
              border-2 border-gray-300
              text-blue-600
              focus:ring-2 focus:ring-blue-500
              disabled:opacity-50
              cursor-pointer
            "
            required
          />
          <span className="text-xs md:text-sm text-gray-600 group-hover:text-gray-900">
            Zgadzam się na otrzymywanie informacji o premierze PalletAI (możesz wypisać się w każdej chwili)
          </span>
        </label>
      </div>
      
      {/* Error Message */}
      <AnimatePresence>
        {formState === 'error' && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="
              mt-3
              flex items-start gap-2
              p-3
              bg-red-50
              border border-red-200
              rounded-lg
            "
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              {errorMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trust Badge */}
      <p className="mt-3 text-xs text-gray-500 text-center md:text-left">
        🔒 Twój email jest bezpieczny. Nigdy nie udostępnimy go osobom trzecim.
      </p>
    </form>
  )
}
