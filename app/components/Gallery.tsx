
'use client';

import React, { useState } from 'react';
import { Artwork } from '../../types';
import { X, Share2, Instagram, Facebook, ChevronRight, Loader2 } from 'lucide-react';
import { useGetArtworksQuery } from '@/utils/services/api';

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

const Gallery: React.FC = () => {
  const { data: artworksData, isLoading, error } = useGetArtworksQuery({ limit: 6 });
  const artworks: Artwork[] = artworksData || [];
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  if (isLoading) {
    return (
      <section id="gallery" className="py-32 px-8 bg-[#fdfaf6]">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-champagne mb-6 animate-spin" />
            <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="gallery" className="py-32 px-8 bg-[#fdfaf6]">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 text-sm">Failed to load gallery. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-32 px-8 bg-[#fdfaf6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h3 className="font-serif text-zinc-900 text-4xl md:text-5xl mb-4">Curated Portfolio</h3>
          <div className="w-24 h-[1px] bg-champagne mx-auto mb-6"></div>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed tracking-wide">
            A selection of my most prestigious works, ranging from traditional bridal artistry to contemporary editorial expressions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {artworks.map((art) => (
            <div 
              key={art._id || art.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedArtwork(art)}
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                <img 
                  src={art.images[0]} 
                  alt={art.title} 
                  className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <div className="px-6 py-3 bg-white/80 backdrop-blur-md border border-zinc-200">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold">View Artistry</span>
                   </div>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-champagne mb-2 block font-bold">{art.category}</span>
                  <h4 className="font-serif text-2xl tracking-tight text-zinc-900">{art.title}</h4>
                  {art.price && (
                    <p className="text-sm text-zinc-600 font-medium mt-2">
                      {getCurrencySymbol(art.currency)}{art.price}
                    </p>
                  )}
                </div>
                <div className="text-[10px] text-zinc-300 tracking-widest uppercase mt-1 font-medium">{art.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" onClick={() => setSelectedArtwork(null)}></div>
          
          <div className="relative w-full max-w-6xl bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
            <button 
              className="absolute top-6 right-6 z-10 text-zinc-400 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-sm p-2 rounded-full"
              onClick={() => setSelectedArtwork(null)}
            >
              <X size={24} />
            </button>

            <div className="lg:w-3/5 relative overflow-hidden bg-zinc-50 flex flex-col">
              <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {selectedArtwork.images.map((img, index) => (
                  <div key={index} className="min-w-full h-full snap-start relative">
                    <img 
                      src={img} 
                      alt={`${selectedArtwork.title} view ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/10 backdrop-blur-md px-3 py-2 rounded-full">
                {selectedArtwork.images.map((_, index) => (
                  <div key={index} className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                ))}
              </div>

              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-white/50 animate-bounce-horizontal">
                <ChevronRight size={32} />
              </div>
            </div>

            <div className="lg:w-2/5 p-8 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
              <span className="text-[11px] uppercase tracking-[0.4em] text-champagne mb-4 block font-bold">
                {selectedArtwork.category} — {selectedArtwork.date}
              </span>
              <h2 className="font-serif text-zinc-900 text-3xl md:text-5xl mb-8 leading-tight">
                {selectedArtwork.title}
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="border-l-2 border-champagne pl-6">
                  <p className="text-zinc-600 text-sm leading-relaxed italic">
                    {selectedArtwork.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 text-[11px] uppercase tracking-[0.2em]">
                  <div>
                    <span className="text-zinc-400 block mb-2 font-bold">Medium</span>
                    <span className="text-zinc-900 font-semibold">{selectedArtwork.medium}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-2 font-bold">Context</span>
                    <span className="text-zinc-900 font-semibold">{selectedArtwork.context}</span>
                  </div>
                  {selectedArtwork.price && (
                    <div>
                      <span className="text-zinc-400 block mb-2 font-bold">Price</span>
                      <span className="text-zinc-900 font-semibold text-base">
                        {getCurrencySymbol(selectedArtwork.currency)}{selectedArtwork.price}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-8 pt-8 border-t border-zinc-100">
                <button className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-900 hover:text-champagne transition-colors font-bold">
                  <Share2 size={14} />
                  <span>Share Work</span>
                </button>
                <div className="flex space-x-4">
                  <Instagram size={18} className="text-zinc-300 hover:text-zinc-900 cursor-pointer transition-colors" />
                  <Facebook size={18} className="text-zinc-300 hover:text-zinc-900 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        .animate-bounce-horizontal { animation: bounce-horizontal 2s infinite; }
      `}</style>
    </section>
  );
};

export default Gallery;
