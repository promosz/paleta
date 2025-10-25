import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingHeader from '../components/landing/LandingHeader';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesAvailableSection from '../components/landing/FeaturesAvailableSection';
import FeaturesComingSection from '../components/landing/FeaturesComingSection';
import RoadmapSection from '../components/landing/RoadmapSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
import CTASection from '../components/landing/CTASection';
import LandingFooter from '../components/landing/LandingFooter';

export default function LandingPage() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Check if we need to scroll to a specific section (from ProductDropdown)
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <AboutSection />
      <FeaturesAvailableSection />
      <FeaturesComingSection />
      <RoadmapSection />
      <BenefitsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}

