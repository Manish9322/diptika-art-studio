
'use client';

import React from 'react';
import { Service } from '../../types';
import { Loader2 } from 'lucide-react';
import { useGetServicesQuery } from '@/utils/services/api';

// Helper function to get currency symbol
const getCurrencySymbol = (currency?: string): string => {
  switch (currency) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'AED': return 'د.إ';
    case 'INR':
    default: return '₹';
  }
};

const ServicesSection: React.FC = () => {
  const { data: servicesData, isLoading, error } = useGetServicesQuery({});
  const services: Service[] = servicesData || [];

  if (isLoading) {
    return (
      <section id="services" className="py-32 px-8 bg-[#f9f5f0]">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-champagne mb-6 animate-spin" />
            <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="services" className="py-32 px-8 bg-[#f9f5f0]">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-sm">Failed to load services. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-32 px-8 bg-[#f9f5f0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-xl">
            <h3 className="font-serif text-zinc-900 text-4xl md:text-5xl mb-6">Artistic Services</h3>
            <p className="text-zinc-500 text-sm tracking-wide leading-relaxed">
              We offer a range of premium artistic experiences tailored for weddings, high-fashion editorials, and luxury corporate events.
            </p>
          </div>
          <div className="hidden md:block">
            <a href="#contact" className="text-[10px] uppercase tracking-[0.4em] text-champagne border-b border-champagne pb-2 hover:text-zinc-900 hover:border-zinc-900 transition-all font-bold">
              Request Rate Card
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="group p-12 border border-zinc-200 bg-white hover:border-champagne transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl"
            >
              <div className="absolute top-0 right-0 p-8 text-zinc-50 font-serif text-6xl group-hover:text-champagne/5 transition-colors">
                0{idx + 1}
              </div>
              <h4 className="font-serif text-zinc-900 text-2xl md:text-3xl mb-4 group-hover:text-champagne transition-colors">{service.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10 max-w-sm">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 italic">
                  Starting from {getCurrencySymbol(service.currency)}{service.priceStart}
                </span>
                <button className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold group-hover:translate-x-2 transition-transform duration-300">
                  Enquire &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
