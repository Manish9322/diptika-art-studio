
'use client';

import React, { useState } from 'react';
import { Service } from '../../types';
import { Loader2 } from 'lucide-react';
import { useGetServicesQuery } from '@/utils/services/api';
import RateCardModal from './RateCardModal';

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
  const allServices: Service[] = servicesData || [];
  const [showAll, setShowAll] = useState(false);
  const [isRateCardOpen, setIsRateCardOpen] = useState(false);

  // Filter to only show active services
  const services = allServices.filter(service => (service as any).active !== false);

  // Show only 4 services initially, or all if showAll is true
  const displayedServices = showAll ? services : services.slice(0, 4);
  const hasMoreServices = services.length > 4;

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

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
            <button 
              onClick={() => setIsRateCardOpen(true)}
              className="text-[10px] uppercase tracking-[0.4em] text-champagne border-b border-champagne pb-2 hover:text-zinc-900 hover:border-zinc-900 transition-all font-bold cursor-pointer bg-transparent"
            >
              Request Rate Card
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayedServices.map((service, idx) => (
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
                <a 
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, '#contact')}
                  className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold group-hover:translate-x-2 transition-transform duration-300 cursor-pointer"
                >
                  Enquire &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle button - only show if there are more than 4 services */}
        {hasMoreServices && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setShowAll(!showAll)}
              className="cursor-pointer group inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-champagne text-champagne text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 hover:bg-champagne hover:text-white"
            >
              {showAll ? 'Show Less' : `View All Services (${services.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Rate Card Modal */}
      <RateCardModal 
        isOpen={isRateCardOpen}
        onClose={() => setIsRateCardOpen(false)}
        services={services}
      />
    </section>
  );
};

export default ServicesSection;
