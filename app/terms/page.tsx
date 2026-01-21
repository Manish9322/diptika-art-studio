import React from 'react';
import TermsPage from '@/app/components/TermsPage';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Terms & Conditions - Diptika Art Studio',
  description: 'Terms and conditions for using Diptika Art Studio services.',
};

export default function Terms() {
  return (
    <div className="min-h-screen selection:bg-champagne selection:text-black bg-[#fdfaf6]">
      <Navbar />
      <main>
        <TermsPage />
      </main>
      <Footer />
    </div>
  );
}
