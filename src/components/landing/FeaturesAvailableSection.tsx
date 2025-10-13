import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle, Upload, FileText, AlertTriangle, Brain } from 'lucide-react';

export default function FeaturesAvailableSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const availableFeatures = [
    {
      icon: Upload,
      title: 'Przesyłanie i analiza',
      items: [
        'Upload plików Excel przez drag & drop',
        'Automatyczne parsowanie i interpretacja danych',
        'Obliczanie rentowności i marży produktów',
      ],
    },
    {
      icon: FileText,
      title: 'Raporty i analizy',
      items: [
        'Szczegółowe raporty z kategoriami rentowności',
        'Analiza AI z rekomendacjami zakupu',
        'Historia wszystkich wcześniejszych analiz',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'System ostrzeżeń',
      items: [
        'Reguły dla konkretnych produktów',
        'Ostrzeżenia na poziomie kategorii',
        'Wizualne oznaczenia w interfejsie',
      ],
    },
    {
      icon: Brain,
      title: 'Sztuczna inteligencja',
      items: [
        'Hybrid AI Service (chmura, przeglądarka, Docker)',
        'Automatyczny wybór najlepszego serwisu AI',
        '5 poziomów rekomendacji zakupu',
      ],
    },
  ];

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[30%] right-[20%] w-[500px] h-[400px] bg-gradient-to-bl from-green-100/15 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/60 backdrop-blur-sm border border-green-300/30 mb-6">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Dostępne teraz</span>
          </div>
          
          <h3 className="text-3xl font-medium text-slate-900 mb-4">
            Funkcjonalności już dostępne
          </h3>
          
          <p className="text-slate-500 max-w-2xl mx-auto">
            Pełen zestaw narzędzi gotowych do użycia bez konieczności rejestracji
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {availableFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-medium text-slate-900">{feature.title}</h4>
              </div>
              <ul className="space-y-2">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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

