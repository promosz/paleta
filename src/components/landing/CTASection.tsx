import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  // Check if Clerk is configured
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'YOUR_PUBLISHABLE_KEY_HERE'
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-blue-50" />
        {/* Delikatne gradienty pod CTA */}
        <div className="absolute top-[20%] left-[10%] w-[800px] h-[600px] bg-gradient-to-br from-purple-200/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] right-[15%] w-[700px] h-[500px] bg-gradient-to-tl from-blue-200/15 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-[40px] p-16 overflow-hidden"
        >
          {/* Inner gradient decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl" />

          <div className="relative max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Zacznij dziś</span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-6xl font-normal text-white leading-tight"
            >
              Zacznij analizować palety mądrzej już dziś
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto"
            >
              Dołącz do setek profesjonalistów, którzy oszczędzają czas i maksymalizują zyski dzięki AI
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              {isClerkConfigured ? (
                <SignInButton mode="modal">
                  <button className="px-8 py-4 rounded-xl bg-white text-purple-600 font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Zarejestruj się za darmo
                  </button>
                </SignInButton>
              ) : (
                <Link to="/paleta/pre-launch">
                  <button className="px-8 py-4 rounded-xl bg-white text-purple-600 font-medium shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                    Zarejestruj się za darmo
                  </button>
                </Link>
              )}
              <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/40 text-white font-medium hover:bg-white/20 transition-all flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Umów prezentację
              </button>
            </motion.div>

            {/* Fine print */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-sm text-white/80 pt-4"
            >
              Nie wymaga karty kredytowej • Anuluj w każdej chwili
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

