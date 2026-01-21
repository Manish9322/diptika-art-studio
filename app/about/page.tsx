import React from 'react';
import AboutPage from '@/app/components/AboutPage';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'About Us - Diptika Art Studio',
  description: 'Learn about Diptika Art Studio and our passion for beauty artistry.',
};

export default function About() {
  return (
    <div className="min-h-screen selection:bg-champagne selection:text-black bg-[#fdfaf6]">
      <Navbar />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </div>
  );
}
