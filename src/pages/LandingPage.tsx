
import React from 'react';
import Header from '@/components/landing/Header';
import HeroBanner from '@/components/landing/HeroBanner';
import ActionCards from '@/components/landing/ActionCards';
import ServicesSection from '@/components/landing/ServicesSection';
import AboutSection from '@/components/landing/AboutSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

const LandingPage: React.FC = () => {
  return (
    <main className="font-sans antialiased text-gray-900">
      <Header />
      <HeroBanner />
      <ActionCards />
      <ServicesSection />
      <AboutSection />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default LandingPage;
