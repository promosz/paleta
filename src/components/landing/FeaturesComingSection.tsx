import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Circle, Brain, Workflow, TrendingUp, Shield } from 'lucide-react';

export default function FeaturesComingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const comingFeatures = [
    {
      icon: Brain,
      title: 'Zaawansowana AI',
      badge: 'Q1 2025',
      items: [
        'Rozpoznawanie produktów z baz Allegro/Amazon',
        'Real-time scraping cen z e-commerce',
        'ML model oceny ryzyka i predykcji trendów',
        'Personalizowane rekomendacje',
      ],
    },
    {
      icon: Workflow,
      title: 'Integracje i eksport',
      badge: 'Q2 2025',
      items: [
        'Generowanie raportów PDF/Excel',
        'API integracje z systemami ERP',
        'Email/SMS powiadomienia',
        'Wsparcie wielojęzyczne',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Analityka zaawansowana',
      badge: 'Q3 2025',
      items: [
        'Analiza trendów w czasie',
        'Benchmarking branżowy',
        "Symulacje cenowe 'co jeśli'",
        'Współpraca zespołowa',
      ],
    },
    {
      icon: Shield,
      title: 'Bezpieczeństwo',
      badge: 'Q3 2025',
      items: [
        'System logowania i kont użytkowników',
        'Szyfrowanie wrażliwych danych',
        'Skalowalność dla dużych zestawów',
        'Automatyczne backupy',
      ],
    },
  ];

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[15%] w-[550px] h-[450px] bg-gradient-to-br from-blue-100/12 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 backdrop-blur-sm border border-blue-300/30 mb-6">
            <Circle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">W planach rozwoju</span>
          </div>
          
          <h3 className="text-3xl font-medium text-slate-900 mb-4">
            Nadchodzące funkcjonalności
          </h3>
          
          <p className="text-slate-500 max-w-2xl mx-auto">
            Ciągle rozwijamy Paletę, aby dostarczać jeszcze więcej wartości
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {comingFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-medium text-slate-900">{feature.title}</h4>
                </div>
                <span className="text-xs font-medium text-blue-600 px-3 py-1 rounded-lg border border-blue-300/30">
                  {feature.badge}
                </span>
              </div>
              <ul className="space-y-2">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                    <Circle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

