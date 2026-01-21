
'use client';

import React from 'react';
import { useGetArtistProfileQuery, useGetTestimonialsQuery, useGetAwardsQuery } from '@/utils/services/api';
import { Loader2 } from 'lucide-react';

const AboutSection: React.FC = () => {
  const { data: profileData, isLoading } = useGetArtistProfileQuery(undefined);
  const { data: testimonialsData, isLoading: testimonialsLoading } = useGetTestimonialsQuery({});
  const { data: awardsData, isLoading: awardsLoading } = useGetAwardsQuery({});
  const profile = profileData; // API already transforms response to data object

  // Extract years from experience (e.g., "12 Years" -> "12+")
  const experienceYears = profile?.experience?.replace(/[^0-9]/g, '') || '12';
  
  // Get testimonials count
  const testimonialsCount = testimonialsData?.length || 0;
  
  // Get awards count
  const awardsCount = awardsData?.length || 0;
  
  // Console log for debugging
  console.log('Testimonials Count:', testimonialsCount);
  console.log('Awards Count:', awardsCount);
  
  // Show client count only if testimonials > 50
  const showClientCount = testimonialsCount > 50;

  if (isLoading || testimonialsLoading || awardsLoading) {
    return (
      <section id="about" className="py-32 px-8 bg-[#f9f5f0] overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-400px">
          <Loader2 size={32} className="animate-spin text-champagne" />
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-32 px-8 bg-[#f9f5f0] overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Editorial Image Composition */}
        <div className="lg:col-span-5 relative">
          <div className="relative z-10 w-full aspect-4/5 border-15px border-white shadow-xl overflow-hidden">
            <img 
              src={profile?.profileImage || profile?.image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200"} 
              alt={profile?.name || "The Artist"} 
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-8 -right-8 w-48 h-48 border border-champagne/30 hidden md:block"></div>
          <div className="absolute top-1/2 -left-20 -translate-y-1/2 font-serif text-[120px] text-zinc-900/5 select-none hidden xl:block leading-none">
            SS
          </div>
        </div>

        {/* Text Content */}
        <div className="lg:col-span-7 lg:pl-12">
          <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-8 font-bold">{profile?.title || 'Master Artist & Visionary'}</span>
          <h2 className="font-serif text-zinc-900 text-4xl md:text-6xl mb-10 leading-[1.1]">
            Curating Beauty Through <span className="italic">Heritage & Modernity</span>
          </h2>
          
          <div className="space-y-8 text-zinc-600 text-base leading-relaxed font-light">
            <p>
              {profile?.bio || 'With over a decade of dedication to fine art and aesthetics, I specialize in creating transformative experiences. My work is a bridge between the ancient traditions of Mehndi and Rangoli, and the sharp, contemporary demands of editorial beauty and high-fashion nail couture.'}
            </p>
            <p>
              Every stroke is intentional. Every pigment is chosen for its soul. I believe that true luxury lies in the bespoke—in the intimate details that speak of a client's personality while maintaining a standard of world-class craftsmanship.
            </p>
            
            <div className="pt-8 flex flex-wrap items-center gap-12">
              <div>
                <span className="block font-serif text-3xl text-zinc-900 mb-1">{experienceYears}+</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-champagne font-bold">Years Experience</span>
              </div>
              {showClientCount && (
                <div>
                  <span className="block font-serif text-3xl text-zinc-900 mb-1">{testimonialsCount}+</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-champagne font-bold">Bespoke Clients</span>
                </div>
              )}
              <div>
                <span className="block font-serif text-3xl text-zinc-900 mb-1">{awardsCount}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-champagne font-bold">Industry Awards</span>
              </div>
            </div>

            <div className="pt-10">
              <a href="#services" className="text-[10px] uppercase tracking-[0.4em] text-zinc-900 font-bold border-b-2 border-champagne pb-2 hover:border-zinc-900 transition-all duration-300">
                Explore My Process
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
