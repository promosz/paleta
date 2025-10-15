import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Upload, Brain, FileText, Sparkles } from 'lucide-react';

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Prześlij plik z zestawem produktów',
      description: 'Załaduj plik Excel, CSV lub PDF zawierający listę produktów w palecie',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI analizuje dane i ocenia opłacalność',
      description: 'Algorytm sztucznej inteligencji przetwarza dane i oblicza wskaźniki',
    },
    {
      number: '03',
      icon: FileText,
      title: 'Otrzymujesz ranking i raport PDF',
      description: 'Pobierz szczegółowy raport z rekomendacjami i oceną każdego produktu',
    },
  ];

  const stats = [
    { value: '3min', label: 'Średni czas' },
    { value: '94%', label: 'Dokładność' },
    { value: '500+', label: 'Analiz' },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-purple-50/30 to-pink-50/30" />
        {/* Duże gradienty jak w Figmie */}
        <div className="absolute top-[15%] left-[10%] w-[700px] h-[400px] bg-gradient-to-br from-blue-300/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[15%] w-[600px] h-[300px] bg-gradient-to-tl from-pink-300/12 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Jak to działa?
          </h2>
          <p className="text-xl text-slate-500">
            Prosty 3-etapowy proces do pełnej analizy palety
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-5xl font-bold text-transparent bg-gradient-to-br from-slate-200 to-slate-300 bg-clip-text">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-500">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="relative bg-white/40 backdrop-blur-sm border border-white/20 rounded-[40px] p-12 overflow-hidden"
        >
          {/* Background decorations - większe i bardziej widoczne */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-300/25 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-300/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-4">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </div>

              <h3 className="text-3xl font-medium text-slate-900 mb-4">
                Zobacz PalletAI w akcji
              </h3>
              
              <p className="text-slate-500 mb-8 leading-relaxed">
                Przetestuj analizę na przykładowych danych i zobacz jak AI może usprawnić Twoje decyzje zakupowe w ciągu kilku sekund
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-0">
                {stats.map((stat, i) => {
                  const gradients = [
                    'from-blue-600 to-cyan-600',
                    'from-purple-600 to-pink-600',
                    'from-cyan-600 to-teal-600'
                  ];
                  return (
                    <div key={i} className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl px-5 py-4 text-center shadow-md">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${gradients[i]} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right - CTA Button */}
            <div className="flex items-center justify-center">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all text-lg flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Wypróbuj analizę demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

