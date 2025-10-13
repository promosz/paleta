import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const testimonials = [
    {
      name: 'Anna Kowalska',
      role: 'Kierownik Zakupów, TechStore',
      content: 'PalletAI zmieniła sposób, w jaki analizujemy oferty od dostawców. Oszczędzamy teraz 5-6 godzin tygodniowo na analizie zestawów.',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      name: 'Michał Nowak',
      role: 'Inwestor',
      content: 'Dzięki AI-asystentowi unikam nietrafionych inwestycji w palety. ROI wzrósł o 23% w ciągu 3 miesięcy.',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Katarzyna Wiśniewska',
      role: 'Dyrektor ds. Zakupów, RetailPro',
      content: 'Intuicyjny interfejs i obiektywna ocena produktów. To narzędzie, na które czekaliśmy.',
      gradient: 'from-indigo-600 to-purple-600',
    },
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-white to-blue-50/30" />
        {/* Delikatne rozmyte kształty */}
        <div className="absolute top-[20%] left-[8%] w-[650px] h-[550px] bg-gradient-to-br from-purple-200/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[25%] right-[12%] w-[600px] h-[500px] bg-gradient-to-tl from-blue-200/10 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Zaufali nam profesjonaliści
          </h2>
          <p className="text-xl text-slate-500">
            Zobacz, co mówią o PalletAI eksperci zakupów i inwestorzy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden"
            >
              {/* Top gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`} />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <div className="mb-6 relative">
                <Quote className="absolute -left-2 -top-2 w-8 h-8 text-slate-200" />
                <p className="text-slate-500 leading-relaxed relative z-10 pl-6">
                  {testimonial.content}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} blur-sm`} />
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.gradient} -ml-12 border-2 border-white flex items-center justify-center shadow-md`}>
                  {/* User icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="10" r="4" fill="white" opacity="0.95" />
                    <path d="M4 20C4 16 7 14 12 14C17 14 20 16 20 20" fill="white" opacity="0.95" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

