import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Shield, Brain, BarChart3, FileDown, Lock } from 'lucide-react';

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const features = [
    {
      icon: Upload,
      title: 'Upload i analiza plików',
      description: 'Wczytaj dowolny plik Excel z opisem produktów – PalletAI automatycznie rozpozna strukturę i dokona analizy.',
    },
    {
      icon: Shield,
      title: 'System reguł i oceny',
      description: 'Zdefiniuj limity, wagi i kryteria – algorytm AI obliczy wskaźnik opłacalności (0–100).',
    },
    {
      icon: Brain,
      title: 'Rekomendacje AI',
      description: 'Sztuczna inteligencja podpowie, które produkty są ryzykowne, a które generują największy potencjalny zysk.',
    },
    {
      icon: BarChart3,
      title: 'Dashboard i historia',
      description: 'Zachowaj każdą analizę, wróć do niej w przyszłości, porównuj palety i śledź trendy zakupowe.',
    },
    {
      icon: FileDown,
      title: 'Eksport wyników',
      description: 'Wyniki możesz pobrać w PDF lub CSV, by przedstawić raport wewnętrznie.',
    },
    {
      icon: Lock,
      title: 'Bezpieczeństwo danych',
      description: 'Twoje dane są szyfrowane i przechowywane zgodnie z najwyższymi standardami bezpieczeństwa.',
    },
  ];

  return (
    <section id="features" ref={ref} className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-white to-blue-50/30" />
        {/* Rozległe gradienty */}
        <div className="absolute top-[10%] right-[20%] w-[800px] h-[700px] bg-gradient-to-bl from-purple-200/12 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[15%] left-[15%] w-[700px] h-[600px] bg-gradient-to-tr from-blue-200/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
            Funkcje PalletAI
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            Pełen zestaw narzędzi do profesjonalnej analizy palet produktowych
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Feature image mockup */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 flex items-center justify-center overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Mock content based on feature */}
                <div className="absolute inset-0 p-6 flex items-center justify-center">
                  {index === 0 && ( /* Upload */
                    <div className="w-full h-full border-2 border-dashed border-white/40 rounded-xl flex flex-col items-center justify-center">
                      <Upload className="w-12 h-12 text-white/70 mb-2" />
                      <p className="text-white/60 text-sm">Drag & Drop</p>
                    </div>
                  )}
                  {index === 1 && ( /* System reguł */
                    <div className="w-full space-y-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-400 to-purple-400" />
                          <div className="flex-1 h-3 bg-white/40 rounded" />
                        </div>
                      ))}
                    </div>
                  )}
                  {index === 2 && ( /* AI Recommendations */
                    <div className="w-full space-y-2">
                      <div className="bg-green-500/20 border border-green-400/40 rounded-lg p-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <div className="flex-1 h-2 bg-white/40 rounded" />
                      </div>
                      <div className="bg-amber-500/20 border border-amber-400/40 rounded-lg p-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <div className="flex-1 h-2 bg-white/40 rounded" />
                      </div>
                    </div>
                  )}
                  {index === 3 && ( /* Dashboard */
                    <div className="w-full grid grid-cols-2 gap-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="bg-white/20 rounded-lg p-2">
                          <div className="h-2 bg-white/40 rounded mb-1" />
                          <div className="h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded" />
                        </div>
                      ))}
                    </div>
                  )}
                  {index === 4 && ( /* Export */
                    <div className="space-y-2">
                      <div className="bg-white/20 rounded-lg p-3 flex items-center gap-2">
                        <FileDown className="w-6 h-6 text-white/70" />
                        <div className="flex-1">
                          <div className="h-2 bg-white/40 rounded mb-1" />
                          <div className="h-2 w-20 bg-white/30 rounded" />
                        </div>
                      </div>
                    </div>
                  )}
                  {index === 5 && ( /* Security */
                    <div className="flex items-center justify-center">
                      <Lock className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                </div>
                
                {/* Icon badge */}
                <div className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-slate-600" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-medium text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

