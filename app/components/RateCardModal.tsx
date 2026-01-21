'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Service } from '../../types';

interface RateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

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

const RateCardModal: React.FC<RateCardModalProps> = ({ isOpen, onClose, services }) => {
  if (!isOpen) return null;

  // Close modal when clicking on backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-zinc-200 px-8 py-6 flex items-center justify-between z-10">
          <div>
            <h2 className="font-serif text-zinc-900 text-3xl md:text-4xl mb-2">Rate Card</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.3em]">Premium Artistic Services</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 transition-colors rounded-full"
            aria-label="Close modal"
          >
            <X size={24} className="text-zinc-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-10">
          {services.map((service, idx) => (
            <div key={idx} className="border-b border-zinc-100 pb-8 last:border-b-0 last:pb-0">
              <div className="mb-6">
                <h3 className="font-serif text-zinc-900 text-xl md:text-2xl mb-2">{service.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                  <span className="text-zinc-700 text-sm">Starting Rate</span>
                  <span className="text-zinc-900 text-sm font-medium">
                    {getCurrencySymbol(service.currency)}{service.priceStart}
                  </span>
                </div>

                {service.priceEnd && service.priceEnd > service.priceStart && (
                  <div className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <span className="text-zinc-700 text-sm">Premium Package</span>
                    <span className="text-zinc-900 text-sm font-medium">
                      {getCurrencySymbol(service.currency)}{service.priceEnd}
                    </span>
                  </div>
                )}

                {service.features && service.features.length > 0 && (
                  <>
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-center justify-between py-3 border-b border-zinc-100">
                        <span className="text-zinc-700 text-sm">{feature}</span>
                        <span className="text-zinc-400 text-xs italic">Included</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-50 border-t border-zinc-200 px-8 py-6 text-center">
          <p className="text-zinc-500 text-xs mb-4 leading-relaxed">
            All rates are subject to customization based on your specific requirements and event scale.
          </p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-champagne transition-all duration-300"
          >
            Close Rate Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateCardModal;
