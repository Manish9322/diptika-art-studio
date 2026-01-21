import React from 'react';
import PrivacyPolicyPage from '@/app/components/PrivacyPolicyPage';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Privacy Policy - Diptika Art Studio',
  description: 'Privacy policy and data protection information for Diptika Art Studio.',
};

export default function Privacy() {
  return (
    <div className="min-h-screen selection:bg-champagne selection:text-black bg-[#fdfaf6]">
      <Navbar />
      <main>
        <PrivacyPolicyPage />
      </main>
      <Footer />
    </div>
  );
}
