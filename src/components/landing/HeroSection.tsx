import { motion } from 'framer-motion';
import { Sparkles, Play } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-8 py-32 pt-24 overflow-hidden">
      {/* Background gradients - delikatne, rozległe */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Główny gradient tła */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/20" />
        
        {/* Duże rozmyte kształty - jak w Figmie */}
        <div className="absolute top-0 left-[15%] w-[800px] h-[400px] bg-gradient-to-br from-blue-300/20 to-purple-200/15 rounded-[50%] blur-3xl opacity-60" />
        <div className="absolute top-[400px] right-[10%] w-[700px] h-[400px] bg-gradient-to-br from-purple-300/20 to-pink-200/15 rounded-[50%] blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Powered by Advanced AI
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl md:text-6xl font-normal leading-tight"
            >
              <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Analizuj zestawy produktów w minutę – z pomocą AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-slate-500 leading-relaxed"
            >
              Zyskaj pełną analizę palety, poznaj opłacalność i unikaj nietrafionych zakupów.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <SignInButton mode="modal">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all">
                  Wypróbuj za darmo
                </button>
              </SignInButton>
              <button className="px-6 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 text-slate-900 font-medium hover:bg-white/80 transition-all flex items-center gap-2">
                <Play className="w-4 h-4" />
                Zobacz jak to działa
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex -space-x-3">
                {[
                  'from-blue-400 to-blue-600',
                  'from-purple-400 to-purple-600',
                  'from-pink-400 to-pink-600',
                  'from-cyan-400 to-cyan-600',
                  'from-indigo-400 to-indigo-600',
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-white shadow-md flex items-center justify-center`}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="8" r="3" fill="white" opacity="0.9" />
                      <path d="M4 17C4 14 6 12 10 12C14 12 16 14 16 17" fill="white" opacity="0.9" />
                    </svg>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    500+
                  </span>
                  <span className="text-slate-900">profesjonalistów</span>
                </div>
                <p className="text-xs text-slate-500">już korzysta z PalletAI</p>
              </div>
            </motion.div>
          </div>

          {/* Right side - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl" />
            
            <div className="relative bg-white/40 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Dashboard mockup */}
              <div className="aspect-video bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 rounded-2xl overflow-hidden border border-white/40 relative">
                {/* Mock dashboard UI */}
                <div className="absolute inset-0 p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-gradient-to-r from-slate-200 to-slate-100 rounded" />
                      <div className="h-3 w-32 bg-slate-100 rounded" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { label: 'Produkty', value: '156', color: 'from-blue-400 to-blue-500' },
                      { label: 'Wartość', value: '94%', color: 'from-purple-400 to-purple-500' },
                      { label: 'Zysk', value: '+23%', color: 'from-green-400 to-green-500' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                        <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                        <div className={`text-xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-end gap-2 h-24">
                      {[45, 62, 48, 75, 58, 82, 67, 71].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div
                            className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-500"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* ROI Score Badge */}
              <div className="absolute top-10 right-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-xs text-slate-500 mb-1">ROI Score</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  94<span className="text-2xl">/100</span>
                </p>
              </div>

              {/* Live Analysis Badge */}
              <div className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 shadow-xl flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="text-sm text-slate-900 font-medium">Live Analysis</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

