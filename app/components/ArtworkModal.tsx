'use client';

import React, { useState } from 'react';
import { Artwork } from '../../types';
import { X, Share2, ChevronRight } from 'lucide-react';

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

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/portfolio#${artwork._id || artwork.id}`;
    const shareData = {
      title: artwork.title,
      text: `Check out "${artwork.title}" - ${artwork.category} artwork by Shringar Studio`,
      url: shareUrl,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setShareStatus('Shared successfully!');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('Link copied to clipboard!');
      }
      
      // Clear status after 3 seconds
      setTimeout(() => setShareStatus(null), 3000);
    } catch (error: any) {
      // User cancelled the share or other error occurred
      if (error.name !== 'AbortError') {
        // Try clipboard fallback
        try {
          await navigator.clipboard.writeText(shareUrl);
          setShareStatus('Link copied to clipboard!');
          setTimeout(() => setShareStatus(null), 3000);
        } catch (clipboardError) {
          setShareStatus('Unable to share. Please try again.');
          setTimeout(() => setShareStatus(null), 3000);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-white shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        <button 
          className="absolute top-6 right-6 z-10 text-zinc-400 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-sm p-2 rounded-full"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="lg:w-3/5 relative overflow-hidden bg-zinc-50 flex flex-col">
          <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {artwork.images.map((img, index) => (
              <div key={index} className="min-w-full h-full snap-start relative">
                <img 
                  src={img} 
                  alt={`${artwork.title} view ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          
          {artwork.images.length > 1 && (
            <>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/10 backdrop-blur-md px-3 py-2 rounded-full">
                {artwork.images.map((_, index) => (
                  <div key={index} className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                ))}
              </div>

              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-white/50">
                <ChevronRight size={32} />
              </div>
            </>
          )}
        </div>

        <div className="lg:w-2/5 p-8 md:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          <span className="text-[11px] uppercase tracking-[0.4em] text-champagne mb-4 block font-bold">
            {artwork.category} — {formatDateForDisplay(artwork.date)}
          </span>
          <h2 className="font-serif text-zinc-900 text-3xl md:text-5xl mb-8 leading-tight">
            {artwork.title}
          </h2>
          
          <div className="space-y-6 mb-12">
            <div className="border-l-2 border-champagne pl-6">
              <p className="text-zinc-600 text-sm leading-relaxed italic">
                {artwork.description}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 text-[11px] uppercase tracking-[0.2em]">
              <div>
                <span className="text-zinc-400 block mb-2 font-bold">Medium</span>
                <span className="text-zinc-900 font-semibold">{artwork.medium}</span>
              </div>
              <div>
                <span className="text-zinc-400 block mb-2 font-bold">Context</span>
                <span className="text-zinc-900 font-semibold">{artwork.context}</span>
              </div>
              {artwork.price && (
                <div>
                  <span className="text-zinc-400 block mb-2 font-bold">Price</span>
                  <span className="text-zinc-900 font-semibold text-base">
                    {getCurrencySymbol(artwork.currency)}{artwork.price}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100">
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-zinc-900 hover:text-champagne transition-colors font-bold"
            >
              <Share2 size={14} />
              <span>Share Work</span>
            </button>
          </div>
          
          {/* Share Status Notification */}
          {shareStatus && (
            <div className="mt-6 px-6 py-3 bg-champagne/10 border border-champagne/30 rounded">
              <p className="text-xs text-champagne text-center font-medium">{shareStatus}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ArtworkModal;
