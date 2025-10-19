// FAQ Section for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { HelpCircle, Mail } from 'lucide-react'
import FAQItem from './shared/FAQItem'

export default function FAQSection() {
  const faqs = [
    {
      question: 'Kiedy startuje PalletAI?',
      answer: 'Oficjalna premiera planowana na Luty 2026.\n\nOsoby z waitlist otrzymają wczesny dostęp 2 tygodnie wcześniej + 3 miesiące PRO gratis!'
    },
    {
      question: 'Czy muszę znać się na technologii/AI?',
      answer: 'Absolutnie nie! Aplikacja jest prostsza niż Excel.\n\nWrzucasz plik → otrzymujesz raport. To wszystko! AI robi całą ciężką pracę za Ciebie.'
    },
    {
      question: 'Czy moje dane są bezpieczne?',
      answer: 'Tak! Używamy:\n\n• Szyfrowanie bankowe (256-bit SSL)\n• Pełna zgodność z RODO\n• Twoje dane nigdy nie są udostępniane osobom trzecim\n• Hosting w bezpiecznej chmurze (Supabase - certyfikat SOC 2)'
    },
    {
      question: 'Jakie pliki mogę uploadować?',
      answer: 'Obsługujemy wszystkie popularne formaty:\n\n• Excel (.xlsx, .xls)\n• CSV (.csv)\n• PDF\n\nPraktycznie każdy format, który otrzymujesz od dostawców palet.'
    },
    {
      question: 'Czy mogę anulować subskrypcję w każdej chwili?',
      answer: 'Tak! Bez zobowiązań, żadnych ukrytych opłat.\n\n• Anulujesz jednym kliknięciem\n• Zachowujesz dostęp do końca opłaconego okresu\n• Możesz wrócić w każdej chwili'
    },
    {
      question: 'Czy działa na telefonie?',
      answer: 'Tak! Aplikacja działa na każdym urządzeniu:\n\n• Przeglądarka (Chrome, Firefox, Safari, Edge)\n• Telefon (iOS i Android)\n• Tablet (iPad, Android tablets)\n• Komputer (Windows, Mac, Linux)\n\nW pełni responsywna - dostosowuje się do ekranu.'
    },
    {
      question: 'Czy mogę testować za darmo?',
      answer: 'Tak! Masz dwie opcje:\n\n1. Plan STARTER - darmowy na zawsze (5 analiz miesięcznie)\n2. Wczesny dostęp z waitlist = 3 miesiące PRO gratis (unlimited)\n\nBez podawania karty kredytowej!'
    },
    {
      question: 'A jeśli nie będę zadowolony?',
      answer: 'Gwarantujemy zwrot pieniędzy w ciągu 30 dni.\n\nBez pytań, bez problemów. Jeśli aplikacja nie spełni Twoich oczekiwań - po prostu napisz do nas, a zwrócimy pieniądze.'
    }
  ]
  
  return (
    <section className="relative py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="
            text-3xl md:text-4xl lg:text-5xl 
            font-bold 
            text-gray-900 
            mb-4
          ">
            Masz Pytania?{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mamy Odpowiedzi!
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Najczęściej zadawane pytania o PalletAI
          </p>
        </motion.div>
        
        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                defaultOpen={idx === 0}
              />
            </motion.div>
          ))}
        </div>
        
        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="
            mt-12
            text-center
            bg-gray-50
            rounded-2xl
            p-6 md:p-8
            border border-gray-200
          "
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Nadal masz pytania?
          </h3>
          <p className="text-gray-600 mb-4">
            Napisz do nas, chętnie pomożemy!
          </p>
          <a
            href="mailto:kontakt@palletai.com"
            className="
              inline-flex items-center gap-2
              px-6 py-3
              bg-blue-600
              text-white
              rounded-xl
              font-semibold
              hover:bg-blue-700
              hover:shadow-lg
              transition-all duration-200
            "
          >
            <Mail className="w-5 h-5" />
            kontakt@palletai.com
          </a>
        </motion.div>
      </div>
    </section>
  )
}
