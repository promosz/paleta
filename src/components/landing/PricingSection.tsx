import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function PricingSection() {
  // Check if Clerk is configured
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'YOUR_PUBLISHABLE_KEY_HERE'
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const plans = [
    {
      name: 'Free',
      price: '0',
      period: 'zł na zawsze',
      description: 'Idealne do testów i małych projektów',
      features: [
        { name: '3 analizy / miesiąc', included: true },
        { name: 'Podstawowy raport PDF', included: true },
        { name: 'Historia analiz (7 dni)', included: true },
        { name: 'Wsparcie email', included: true },
        { name: 'Zaawansowane reguły AI', included: false },
        { name: 'Eksport do CSV', included: false },
        { name: 'Analizy porównawcze', included: false },
        { name: 'Wsparcie priorytetowe', included: false },
      ],
      cta: 'Rozpocznij za darmo',
      popular: false,
    },
    {
      name: 'Pro',
      price: '99',
      period: 'zł / miesiąc',
      description: 'Dla profesjonalistów i średnich firm',
      features: [
        { name: 'Nielimitowane analizy', included: true },
        { name: 'Pełny raport PDF', included: true },
        { name: 'Nielimitowana historia', included: true },
        { name: 'Wsparcie email i chat', included: true },
        { name: 'Zaawansowane reguły AI', included: true },
        { name: 'Eksport do CSV', included: true },
        { name: 'Analizy porównawcze', included: true },
        { name: 'Wsparcie priorytetowe', included: false },
      ],
      cta: 'Wybierz Pro',
      popular: true,
    },
    {
      name: 'Business',
      price: '299',
      period: 'zł / miesiąc',
      description: 'Dla dużych organizacji i zespołów',
      features: [
        { name: 'Nielimitowane analizy', included: true },
        { name: 'Pełny raport PDF + Excel', included: true },
        { name: 'Nielimitowana historia', included: true },
        { name: 'Dedykowany opiekun', included: true },
        { name: 'Zaawansowane reguły AI', included: true },
        { name: 'Eksport do CSV', included: true },
        { name: 'Analizy porównawcze', included: true },
        { name: 'Wsparcie priorytetowe 24/7', included: true },
      ],
      cta: 'Skontaktuj się',
      popular: false,
    },
  ];

  const faq = [
    {
      question: 'Czy mogę zrezygnować w każdej chwili?',
      answer: 'Tak, możesz anulować subskrypcję w dowolnym momencie bez dodatkowych opłat.',
    },
    {
      question: 'Czy oferujecie rabaty roczne?',
      answer: 'Tak, przy płatności rocznej otrzymujesz 20% rabatu.',
    },
    {
      question: 'Czy moje dane są bezpieczne?',
      answer: 'Absolutnie. Wszystkie dane są szyfrowane i przechowywane zgodnie z RODO.',
    },
  ];

  return (
    <section id="pricing" ref={ref} className="py-24 relative overflow-hidden">
      {/* Background gradients - delikatne, rozległe */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-purple-50/50 to-pink-50/30" />
        {/* Duże rozmyte kształty */}
        <div className="absolute top-0 right-[15%] w-[900px] h-[500px] bg-gradient-to-bl from-purple-200/15 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-[10%] left-[10%] w-[850px] h-[600px] bg-gradient-to-tr from-blue-200/12 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute top-[40%] left-[20%] w-[700px] h-[500px] bg-gradient-to-br from-pink-200/10 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-normal mb-6 bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Wybierz plan dla siebie
          </h2>
          <p className="text-xl text-slate-500">
            Przejrzysta cennik bez ukrytych kosztów. Rozpocznij za darmo.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className={`relative bg-white/60 backdrop-blur-sm border rounded-3xl p-8 ${
                plan.popular
                  ? 'border-purple-500/50 shadow-xl shadow-purple-500/10 md:-mt-4 md:mb-4'
                  : 'border-white/20'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm text-white font-medium">Najpopularniejszy</span>
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={`text-5xl font-semibold ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                      : 'text-slate-600'
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              {/* CTA */}
              {isClerkConfigured ? (
                <SignInButton mode="modal">
                  <button
                    className={`w-full py-3 rounded-xl font-medium transition-all mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                        : 'bg-white/80 border-2 border-blue-600 text-slate-900 hover:bg-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </SignInButton>
              ) : (
                <Link to="/paleta/pre-launch">
                  <button
                    className={`w-full py-3 rounded-xl font-medium transition-all mb-8 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40'
                        : 'bg-white/80 border-2 border-blue-600 text-slate-900 hover:bg-white'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>
              )}

              {/* Features */}
              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                    <span className={feature.included ? 'text-slate-900' : 'text-slate-400'}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-semibold text-center mb-8 bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
            Często zadawane pytania
          </h3>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h4 className="font-medium text-slate-900 mb-2">{item.question}</h4>
                <p className="text-slate-500">{item.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

