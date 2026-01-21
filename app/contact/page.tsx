import React from 'react';
import ContactPage from '@/app/components/ContactPage';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Contact Us - Diptika Art Studio',
  description: 'Get in touch with Diptika Art Studio for bookings and inquiries.',
};

export default function Contact() {
  return (
    <div className="min-h-screen selection:bg-champagne selection:text-black bg-[#fdfaf6]">
      <Navbar />
      <main>
        <ContactPage />
      </main>
      <Footer />
    </div>
  );
}
