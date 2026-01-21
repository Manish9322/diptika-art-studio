import React from 'react';
import PortfolioPage from '@/app/components/PortfolioPage';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Portfolio - Diptika Art Studio',
  description: 'Explore our exquisite collection of bridal mehndi, nail art, and makeup artistry.',
};

export default function Portfolio() {
  return (
    <div className="min-h-screen selection:bg-champagne selection:text-black bg-[#fdfaf6]">
      <Navbar />
      <main>
        <PortfolioPage />
      </main>
      <Footer />
    </div>
  );
}
