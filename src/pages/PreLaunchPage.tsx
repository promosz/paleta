// Pre-Launch Landing Page - PalletAI
// Strona do zbierania emaili przed oficjalną premierą (Marzec 2025)

import React, { useEffect } from 'react'
import HeroSection from '../components/prelaunch/HeroSection'
import ProblemSection from '../components/prelaunch/ProblemSection'
import SolutionSection from '../components/prelaunch/SolutionSection'
import FeaturesSection from '../components/prelaunch/FeaturesSection'
import SocialProofSection from '../components/prelaunch/SocialProofSection'
import PricingPreviewSection from '../components/prelaunch/PricingPreviewSection'
import FAQSection from '../components/prelaunch/FAQSection'
import FinalCTASection from '../components/prelaunch/FinalCTASection'
import PreLaunchFooter from '../components/prelaunch/PreLaunchFooter'

export default function PreLaunchPage() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'PalletAI - Inteligentna Analiza Palet z AI | Już Wkrótce'
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Oszczędź czas i pieniądze. Pozwól AI ocenić rentowność palety produktów w 60 sekund. Wczesny dostęp + 3 miesiące PRO gratis.')
    }
  }, [])
  
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])
  
  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        element?.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    // Handle on mount (if URL has hash)
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])
  
  return (
    <main className="bg-white overflow-x-hidden">
        {/* Hero Section */}
        <div id="hero">
          <HeroSection />
        </div>
        
        {/* Problem Section */}
        <div id="problem">
          <ProblemSection />
        </div>
        
        {/* Solution Section */}
        <div id="solution">
          <SolutionSection />
        </div>
        
        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>
        
        {/* Social Proof Section */}
        <div id="testimonials">
          <SocialProofSection />
        </div>
        
        {/* Pricing Preview Section */}
        <div id="pricing">
          <PricingPreviewSection />
        </div>
        
        {/* FAQ Section */}
        <div id="faq">
          <FAQSection />
        </div>
        
        {/* Final CTA Section */}
        <div id="cta">
          <FinalCTASection />
        </div>
        
        {/* Footer */}
        <PreLaunchFooter />
      </main>
  )
}




