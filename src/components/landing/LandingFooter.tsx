import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function LandingFooter() {
  const footerLinks = {
    product: [
      { name: 'Funkcje', href: '#features' },
      { name: 'Jak to działa', href: '#how-it-works' },
      { name: 'Cennik', href: '#pricing' },
      { name: 'Demo', href: '#' },
    ],
    company: [
      { name: 'O nas', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Kariera', href: '#' },
      { name: 'Kontakt', href: '#' },
    ],
    legal: [
      { name: 'Polityka prywatności', href: '#' },
      { name: 'Regulamin', href: '#' },
      { name: 'RODO', href: '#' },
      { name: 'Cookies', href: '#' },
    ],
    support: [
      { name: 'Pomoc', href: '#' },
      { name: 'Dokumentacja', href: '#' },
      { name: 'Status systemu', href: '#' },
      { name: 'API', href: '#' },
    ],
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="footer" className="relative border-t border-white/20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-blue-50/50 to-white" />
        {/* Delikatny gradient w footerze */}
        <div className="absolute bottom-0 left-[25%] w-[600px] h-[300px] bg-gradient-to-t from-purple-100/15 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="relative bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-8 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Brand column */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <span className="text-white font-semibold">P</span>
                </div>
                <span className="text-xl font-normal bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PalletAI
                </span>
              </Link>
              <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                Analizuj zestawy produktów w minutę z pomocą sztucznej inteligencji.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Github className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Twitter className="w-4 h-4 text-slate-600" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-slate-600" />
                </a>
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Produkt</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Firma</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Prawne</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4">Wsparcie</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2025 PalletAI. Wszystkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Polityka prywatności
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Warunki użytkowania
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

