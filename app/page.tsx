'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Hero from '@/app/components/Hero';
import Gallery from '@/app/components/Gallery';
import AboutSection from '@/app/components/AboutSection';
import ServicesSection from '@/app/components/ServicesSection';
import ContactForm from '@/app/components/ContactForm';
import Footer from '@/app/components/Footer';
import MaintenanceMode from '@/app/components/MaintenanceMode';

export default function Home() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    // Maintenance mode disabled
    setIsMaintenance(false);
  }, []);

  if (isMaintenance) {
    return <MaintenanceMode onAdminLogin={() => window.location.href = '/admin/login'} />;
  }

  return (
    <div className="min-h-screen selection:bg-champagne selection:text-black bg-[#fdfaf6]">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <Gallery />
        <ServicesSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
