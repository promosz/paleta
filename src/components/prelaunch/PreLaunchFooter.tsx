// Footer for Pre-Launch Landing Page
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Facebook } from 'lucide-react'

export default function PreLaunchFooter() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    produkt: [
      { label: 'Jak to działa', href: '#solution' },
      { label: 'Funkcje', href: '#features' },
      { label: 'Cennik', href: '#pricing' },
      { label: 'FAQ', href: '#faq' }
    ],
    firma: [
      { label: 'O nas', href: '#' },
      { label: 'Kontakt', href: 'mailto:kontakt@palletai.com' },
      { label: 'Blog', href: '#' },
      { label: 'Kariera', href: '#' }
    ],
    prawne: [
      { label: 'Polityka prywatności', href: '#' },
      { label: 'Regulamin', href: '#' },
      { label: 'RODO', href: '#' },
      { label: 'Cookies', href: '#' }
    ]
  }
  
  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' }
  ]
  
  return (
    <footer className="relative bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">P</span>
                </div>
                <span className="text-xl font-semibold text-white">
                  PalletAI
                </span>
              </div>
              
              <p className="text-sm text-gray-400 mb-6">
                Inteligentna analiza palet produktów z użyciem najnowszych technologii AI
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      w-9 h-9
                      rounded-lg
                      bg-gray-800
                      hover:bg-gray-700
                      flex items-center justify-center
                      transition-colors duration-200
                    "
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Produkt Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Produkt</h4>
              <ul className="space-y-2">
                {footerLinks.produkt.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="
                        text-sm
                        text-gray-400
                        hover:text-white
                        transition-colors duration-200
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Firma Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Firma</h4>
              <ul className="space-y-2">
                {footerLinks.firma.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="
                        text-sm
                        text-gray-400
                        hover:text-white
                        transition-colors duration-200
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Prawne Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Prawne</h4>
              <ul className="space-y-2">
                {footerLinks.prawne.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="
                        text-sm
                        text-gray-400
                        hover:text-white
                        transition-colors duration-200
                      "
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="
          border-t border-gray-800
          py-6
          flex flex-col md:flex-row
          items-center justify-between
          gap-4
        ">
          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} PalletAI. Wszystkie prawa zastrzeżone.
          </p>
          
          {/* Contact */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <a
              href="mailto:kontakt@palletai.com"
              className="hover:text-white transition-colors duration-200"
            >
              kontakt@palletai.com
            </a>
            
            <span>•</span>
            
            <a
              href="tel:+48123456789"
              className="hover:text-white transition-colors duration-200"
            >
              +48 123 456 789
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
