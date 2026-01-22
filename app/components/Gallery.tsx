
'use client';

import React, { useState, useEffect } from 'react';
import { Artwork } from '../../types';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useGetArtworksQuery } from '@/utils/services/api';
import ArtworkModal from './ArtworkModal';

const Gallery: React.FC = () => {
  const { data: artworksData, isLoading, error } = useGetArtworksQuery({ limit: 7 });
  const allArtworksRaw: Artwork[] = artworksData || [];
  // Filter to only show active artworks
  const allArtworks = allArtworksRaw.filter(art => (art as any).active !== false);
  const artworks = allArtworks.slice(0, 6); // Display only first 6
  const hasMore = allArtworks.length > 6;
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // Handle deep linking - open modal based on URL hash
  useEffect(() => {
    if (!isLoading && allArtworks.length > 0) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const artwork = allArtworks.find(art => (art._id || art.id) === hash);
        if (artwork) {
          setSelectedArtwork(artwork);
          // Clear hash from URL after opening modal (optional)
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  }, [isLoading, allArtworks]);

  if (isLoading) {
    return (
      <section id="gallery" className="py-32 px-8 bg-[#fdfaf6]">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-400px">
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
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-400px">
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
              <div className="relative aspect-3/4 overflow-hidden border border-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
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
                </div>
                <div className="text-[10px] text-zinc-300 tracking-widest uppercase mt-1 font-medium">{art.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {hasMore && (
          <div className="mt-20 text-center">
            <a 
              href="/portfolio"
              className="group inline-flex items-center gap-3 px-10 py-4 bg-transparent border border-champagne text-champagne text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 hover:bg-champagne hover:text-white"
            >
              <span>View Full Collection</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedArtwork && (
        <ArtworkModal 
          artwork={selectedArtwork} 
          onClose={() => setSelectedArtwork(null)} 
        />
      )}

    </section>
  );
};

export default Gallery;
