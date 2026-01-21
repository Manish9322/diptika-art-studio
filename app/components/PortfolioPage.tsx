
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Artwork } from '../../types';
import { X, Share2, Instagram, Facebook, Search, Filter, ChevronRight } from 'lucide-react';
import { useGetArtworksQuery, useGetServicesQuery } from '@/utils/services/api';

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

const PortfolioPage: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to format date for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      // If it's in YYYY-MM-DD format, convert to readable format
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      }
      return dateStr; // Return as-is if not in expected format
    } catch {
      return dateStr;
    }
  };

  // RTK Query hooks
  const { data: artworksData, isLoading: artworksLoading } = useGetArtworksQuery({});
  const { data: servicesData } = useGetServicesQuery({});

  const artworks: Artwork[] = artworksData || [];
  const services = servicesData || [];

  // Set dynamic categories when services load
  useEffect(() => {
    const serviceTitles = services.map((s: any) => s.title);
    const artworkCategories = Array.from(new Set(artworks.map(a => a.category)));
    
    // Combine service titles and artwork categories, removing duplicates
    const allCategories = Array.from(new Set([...serviceTitles, ...artworkCategories]));
    
    setCategories(['All', ...allCategories]);
  }, [services, artworks]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            art.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [artworks, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#fdfaf6]">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div className="mb-20">
          <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-4 font-bold">Archives</span>
          <h2 className="font-serif text-zinc-900 text-5xl md:text-7xl mb-8 leading-tight">
            The <span className="italic">Full</span> Collection
          </h2>
          <p className="text-zinc-500 max-w-2xl text-base font-light leading-relaxed">
            Exploring the intersection of tradition and avant-garde. Use the filters below to browse through our body of work across various artistic disciplines.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between mb-16 pb-12 border-b border-zinc-100">
          <div className="flex flex-wrap gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all duration-300 ${activeCategory === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-transparent text-zinc-400 border-zinc-200 hover:border-champagne hover:text-champagne'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
            <input 
              type="text"
              placeholder="Search by title or medium..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-100 text-sm text-zinc-900 focus:outline-none focus:border-champagne transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
            Showing {filteredArtworks.length} masterpiece{filteredArtworks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Gallery Grid */}
        {artworksLoading ? (
          <div className="py-40 text-center flex flex-col items-center justify-center">
            <div className="mb-8 animate-spin">
              <Filter className="text-zinc-200" size={80} strokeWidth={1} />
            </div>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-light">Loading Collection...</p>
          </div>
        ) : filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredArtworks.map((art) => (
              <div 
                key={art.id} 
                className="group cursor-pointer hero-fade-in-up"
                onClick={() => setSelectedArtwork(art)}
              >
                <div className="relative aspect-3/4 overflow-hidden border border-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                  <img 
                    src={art.images[0]} 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="px-6 py-3 bg-white/80 backdrop-blur-md border border-zinc-200">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold">Details</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-champagne mb-2 block font-bold">{art.category}</span>
                  <h4 className="font-serif text-2xl tracking-tight text-zinc-900 group-hover:text-champagne transition-colors">{art.title}</h4>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-400 tracking-widest uppercase font-medium">{formatDateForDisplay(art.date)}</span>
                      {art.price && (
                        <span className="text-sm text-zinc-600 font-semibold">
                          {getCurrencySymbol(art.currency)}{art.price}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-300 italic">{art.context}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center justify-center">
            <div className="mb-8 animate-float-scale">
              <Filter className="text-zinc-100" size={80} strokeWidth={1} />
            </div>
            <div className="space-y-4 hero-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="font-serif text-3xl text-zinc-300">Quiet in the Gallery</p>
              <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-light max-w-xs mx-auto">No works found matching your current search or category filters.</p>
            </div>
            <button 
              onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
              className="mt-12 group relative overflow-hidden px-10 py-4 bg-transparent border border-champagne text-champagne text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-500 hover:bg-champagne hover:text-white hero-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="relative z-10">Reset All Filters</span>
              <div className="absolute inset-0 bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0"></div>
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal with Multi-Image Scroller */}
      {selectedArtwork && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12">
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
                {selectedArtwork.category} — {formatDateForDisplay(selectedArtwork.date)}
              </span>
              <h2 className="font-serif text-zinc-900 text-3xl md:text-5xl mb-8 leading-tight">
                {selectedArtwork.title}
              </h2>
              <div className="space-y-6 mb-12">
                <div className="border-l-2 border-champagne pl-6">
                  <p className="text-zinc-600 text-sm leading-relaxed italic">{selectedArtwork.description}</p>
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
        @keyframes fade-in-up-hero {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-scale {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        .hero-fade-in-up { 
          opacity: 0;
          animation: fade-in-up-hero 0.8s ease-out forwards; 
        }
        .animate-float-scale {
          animation: float-scale 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPage;
