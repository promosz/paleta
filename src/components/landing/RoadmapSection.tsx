import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { CheckCircle2, Circle, Sparkles } from 'lucide-react';

export default function RoadmapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const phases = [
    {
      phase: 'Faza 1',
      title: 'Podstawowa funkcjonalność',
      description: 'Upload dokumentów Excel, podstawowa analiza rentowności, system ostrzeżeń',
      progress: 100,
      status: 'ZAKOŃCZONE',
      statusColor: 'text-green-600',
      barColor: 'bg-green-500',
      borderColor: 'border-green-500/50',
      icon: CheckCircle2,
    },
    {
      phase: 'Faza 2',
      title: 'AI i automatyzacja',
      description: 'Rozpoznawanie produktów, wycena rynkowa, zaawansowane rekomendacje AI',
      progress: 60,
      status: 'W REALIZACJI',
      statusColor: 'text-blue-600',
      barColor: 'bg-blue-500',
      borderColor: 'border-blue-500/50',
      icon: Circle,
    },
    {
      phase: 'Faza 3',
      title: 'Integracje i eksport',
      description: 'Eksport raportów, integracje API, automatyzacja workflow',
      progress: 0,
      status: 'Q2 2025',
      statusColor: 'text-slate-500',
      barColor: 'bg-slate-300',
      borderColor: 'border-slate-200',
      icon: Circle,
    },
    {
      phase: 'Faza 4',
      title: 'Zaawansowane funkcje',
      description: 'Analiza trendów, benchmarking, współpraca zespołowa',
      progress: 0,
      status: 'Q3 2025',
      statusColor: 'text-slate-500',
      barColor: 'bg-slate-300',
      borderColor: 'border-slate-200',
      icon: Circle,
    },
  ];

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/30 via-white to-blue-50/30" />
        {/* Delikatne gradienty */}
        <div className="absolute top-[15%] right-[18%] w-[650px] h-[500px] bg-gradient-to-bl from-purple-200/13 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] left-[12%] w-[600px] h-[450px] bg-gradient-to-tr from-blue-200/11 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/60 backdrop-blur-sm border border-purple-300/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Roadmap</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
            Plan rozwoju aplikacji
          </h2>
          
          <p className="text-xl text-slate-500">
            Transparentny plan rozwoju produktu z harmonogramem realizacji
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className={`bg-white/60 backdrop-blur-sm border ${phase.borderColor} rounded-2xl p-6`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">{phase.phase}</p>
                  <h3 className="text-lg font-medium text-slate-900 leading-tight">
                    {phase.title}
                  </h3>
                </div>
                <phase.icon className={`w-6 h-6 ${phase.statusColor}`} />
              </div>

              {/* Description */}
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {phase.description}
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-500">Postęp</span>
                  <span className={phase.statusColor}>{phase.progress}%</span>
                </div>
                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${phase.barColor} transition-all duration-1000`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div className={`text-center py-2 rounded-lg border ${phase.borderColor}`}>
                <span className={`text-xs font-medium ${phase.statusColor}`}>
                  {phase.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

