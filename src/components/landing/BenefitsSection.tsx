import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Clock, TrendingUp, Brain, History } from 'lucide-react';

export default function BenefitsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const benefits = [
    {
      icon: Clock,
      title: 'Oszczędzaj czas',
      description: 'Analiza w minutę',
    },
    {
      icon: TrendingUp,
      title: 'Maksymalizuj zysk',
      description: 'Poznaj wartość palety',
    },
    {
      icon: Brain,
      title: 'AI-asystent',
      description: 'Obiektywna ocena produktów',
    },
    {
      icon: History,
      title: 'Przeglądaj historię',
      description: 'Ucz się na własnych decyzjach',
    },
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30" />
        {/* Delikatne duże gradienty */}
        <div className="absolute top-[10%] left-[5%] w-[700px] h-[600px] bg-gradient-to-br from-blue-200/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[500px] bg-gradient-to-tl from-purple-200/10 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Dlaczego PalletAI?
          </h2>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            Wszystko czego potrzebujesz do profesjonalnej analizy palet produktowych
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:shadow-xl transition-shadow group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-500">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

