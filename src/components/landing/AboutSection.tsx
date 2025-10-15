import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Users, ShoppingCart, TrendingUp, Building2 } from 'lucide-react';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    { value: '12', label: 'Zaimplementowane funkcje' },
    { value: '85%', label: 'Podstawowej funkcjonalności' },
    { value: '100%', label: 'Dostępności aplikacji' },
  ];

  const audience = [
    { icon: Users, title: 'Handlowcy i dystrybutorzy', desc: 'Ocena zestawień od dostawców' },
    { icon: ShoppingCart, title: 'Menedżerowie zakupów', desc: 'Analiza opłacalności inwestycji' },
    { icon: TrendingUp, title: 'Analitycy biznesowi', desc: 'Ocena rentowności produktów' },
    { icon: Building2, title: 'Właściciele firm', desc: 'Planowanie strategii zakupowych' },
  ];

  return (
    <section id="about" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background gradients - delikatne, rozległe */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30" />
        {/* Duże kształty gradientów */}
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[500px] bg-gradient-to-br from-purple-200/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-[500px] h-[400px] bg-gradient-to-tr from-blue-200/15 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              O Aplikacji PalletAI
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
            Nowoczesne narzędzie do analizy zestawień produktowych
          </h2>
          
          <p className="text-xl text-slate-500 leading-relaxed">
            Aplikacja stworzona z myślą o przedsiębiorcach, handlowcach i analitykach, którzy regularnie oceniają rentowność zakupów
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-3xl font-medium text-slate-900 mb-6">
              Czym jest PalletAI?
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              PalletAI to inteligentna platforma do analizy zestawień produktowych w formacie Excel. Wykorzystujemy zaawansowaną sztuczną inteligencję do automatyzacji procesu oceny, dzięki czemu możesz podejmować świadome decyzje biznesowe w oparciu o konkretne dane finansowe i trendy rynkowe.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center"
                >
                  <div className="text-3xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 leading-tight">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Dashboard Preview Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
            <div className="relative bg-white/40 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 flex items-center justify-center p-8 relative">
                {/* Mock dashboard content */}
                <div className="w-full h-full bg-white/60 rounded-2xl p-6 border border-white/40">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-32 bg-gradient-to-r from-slate-300 to-slate-200 rounded" />
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                    </div>
                    {/* Stats cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="bg-gradient-to-br from-white to-slate-50 rounded-lg p-3 border border-slate-200/50">
                          <div className="h-2 w-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded mb-2" />
                          <div className="h-6 w-16 bg-slate-200 rounded" />
                        </div>
                      ))}
                    </div>
                    {/* Chart area */}
                    <div className="bg-gradient-to-br from-white to-blue-50 rounded-lg p-4 border border-blue-200/30 h-32 flex items-end gap-1">
                      {[40,60,45,75,55,80,65].map((h,i) => (
                        <div key={i} className={`flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t`} style={{height: `${h}%`}} />
                      ))}
                    </div>
                  </div>
                </div>
                <Sparkles className="absolute bottom-4 right-4 w-8 h-8 text-purple-400 opacity-50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* For whom */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-medium text-slate-900 mb-4">
              Dla kogo jest PalletAI?
            </h3>
            <p className="text-slate-500">
              Nasze narzędzie wspiera różne role w organizacjach handlowych i dystrybucyjnych
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {audience.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

