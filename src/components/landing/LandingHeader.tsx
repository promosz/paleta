import { SignInButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface LandingHeaderProps {
  onNavigate?: (section: string) => void;
}

export default function LandingHeader({ onNavigate }: LandingHeaderProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onNavigate?.(sectionId);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-white/20"
    >
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-white font-semibold text-sm">P</span>
            </div>
            <span className="text-xl font-normal bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PalletAI
            </span>
          </Link>

          {/* Navigation - ukryte na mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Funkcje
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Jak to działa
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Cennik
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="text-slate-500 hover:text-slate-900 transition-colors font-medium"
            >
              Kontakt
            </button>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-xl text-slate-900 hover:bg-slate-50 transition-colors font-medium text-sm">
                Zaloguj się
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all font-medium text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Wypróbuj za darmo
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </motion.header>
  );
}




