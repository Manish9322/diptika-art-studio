
'use client';

import React from 'react';
import { Quote, Loader2, User } from 'lucide-react';
import { Testimonial } from '../../types';
import { useGetArtistProfileQuery, useGetTestimonialsQuery } from '../../utils/services/api';

const AboutPage: React.FC = () => {
  const { data: profileData, isLoading: isProfileLoading } = useGetArtistProfileQuery(undefined);
  const { data: testimonialsData, isLoading: isTestimonialsLoading } = useGetTestimonialsQuery({});

  const profile = profileData;
  const testimonials: Testimonial[] = testimonialsData || [];

  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdfaf6]">
        <Loader2 size={32} className="animate-spin text-champagne" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      {/* Hero Section of About Page */}
      <section className="pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="hero-fade-in">
              <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-6 font-bold">The Visionary</span>
              <h2 className="font-serif text-zinc-900 text-6xl md:text-8xl mb-12 leading-[1.1]">
                Mastery in Every <span className="italic">Gaze & Stroke</span>
              </h2>
              <p className="text-zinc-500 text-lg font-light leading-relaxed mb-12 max-w-xl">
                {profile?.bio || 'With over a decade of dedication to fine art and aesthetics, I specialize in creating transformative experiences. My work is a bridge between the ancient traditions of Mehndi and Rangoli, and contemporary editorial beauty.'}
              </p>
              <div className="flex space-x-12 border-t border-zinc-100 pt-12">
                <div>
                  <h4 className="font-serif text-3xl text-zinc-900">Worldwide</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mt-2 font-bold">Online Platform</p>
                </div>
                <div>
                  <h4 className="font-serif text-3xl text-zinc-900">Global</h4>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 mt-2 font-bold">Available for Commissions</p>
                </div>
              </div>
            </div>
            <div className="relative hero-fade-in-up">
              <div className="aspect-[4/5] overflow-hidden border-[12px] md:border-[20px] border-white shadow-2xl relative z-10">
                <img 
                  src={profile?.aboutPageImage || profile?.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200"} 
                  alt={profile?.name || "Artist Portrait"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 sm:-top-8 sm:-right-8 sm:w-48 sm:h-48 lg:-top-12 lg:-right-12 lg:w-64 lg:h-64 border border-champagne/20 -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-zinc-900 text-white px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="font-serif text-4xl md:text-6xl mb-16 leading-tight">
            "Art is not what I do, <br /> it is how I <span className="italic text-champagne">honor the world</span> around me."
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <span className="text-champagne font-serif text-2xl italic">01</span>
              <h5 className="text-[11px] uppercase tracking-[0.4em] font-bold">Provenance</h5>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Rooted in the ancient soils of traditional Indian and Persian art forms, we bring history into the present.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-champagne font-serif text-2xl italic">02</span>
              <h5 className="text-[11px] uppercase tracking-[0.4em] font-bold">Precision</h5>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Every line of Mehndi and every blend of pigment is executed with surgical accuracy and artistic soul.
              </p>
            </div>
            <div className="space-y-6">
              <span className="text-champagne font-serif text-2xl italic">03</span>
              <h5 className="text-[11px] uppercase tracking-[0.4em] font-bold">Personality</h5>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                We do not create templates. Every service is a bespoke reflection of the client's internal landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Smooth Carousel */}
      {!isTestimonialsLoading && testimonials.length > 0 && (
        <section className="py-32 px-8 bg-[#fdfaf6] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-4 font-bold">Voices of Resonance</span>
              <h3 className="font-serif text-zinc-900 text-4xl md:text-5xl">Client Stories</h3>
            </div>

            <div className="relative py-4">
              <div className="testimonials-carousel-wrapper">
                <div className="testimonials-carousel">
                  {[...testimonials, ...testimonials].map((t, i) => {
                    const tId = (t as any)._id || t.id;
                    return (
                      <div key={`${tId}-${i}`} className="testimonial-card flex-shrink-0 w-[400px] px-4">
                        <div className="flex flex-col space-y-8 bg-white p-10 h-full border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                          <div className="relative flex-grow">
                            <Quote size={40} className="text-champagne/10 absolute -top-6 -left-6" strokeWidth={1} />
                            <p className="text-zinc-600 text-lg font-light leading-relaxed italic relative z-10">
                              "{t.content}"
                            </p>
                          </div>
                          <div className="flex items-center space-x-6 pt-4 border-t border-zinc-100">
                            <div className="w-14 h-14 rounded-full overflow-hidden grayscale bg-zinc-100 flex-shrink-0">
                              {t.image ? (
                                <img src={t.image} alt={t.clientName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50 font-serif text-xl">
                                  {t.clientName.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-serif text-xl text-zinc-900">{t.clientName}</h4>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-champagne font-bold">{t.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Journey Section - Editorial Layout */}
      <section className="py-32 px-8 overflow-hidden bg-white border-y border-zinc-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/2 space-y-16">
              <div className="sticky top-32">
                 <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-6 font-bold">The Journey</span>
                 <h2 className="font-serif text-zinc-900 text-5xl mb-8">
                   {profile?.experience ? `${profile.experience} of ` : 'A Decade of '}
                   <span className="italic">Dedicated</span> Refinement.
                 </h2>
                 <p className="text-zinc-600 leading-loose font-light">
                   {profile?.bio || 'My journey began in the vibrant markets of Rajasthan, where I first witnessed the transformative power of henna. It continued through the high-stakes backstage environments of London Fashion Week, where I learned the discipline of editorial makeup.'}
                   <br /><br />
                   Today, Diptika Art Studio is the synthesis of these worlds. We serve a global clientele who value the intersection of heritage techniques and contemporary aesthetic standards.
                 </p>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=600" alt="Process" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mt-12">
                  <img src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=600" alt="Detail" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-8 pt-12">
                <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600" alt="Result" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 mt-12">
                  <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600" alt="Studio" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accolades Section */}
      <section className="py-24 border-b border-zinc-100 bg-[#f9f5f0]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap justify-between items-center gap-12 opacity-60">
            <span className="font-serif text-xl uppercase tracking-widest text-zinc-900">Featured in Vogue</span>
            <span className="font-serif text-xl uppercase tracking-widest text-zinc-900">Brides Luxury 100</span>
            <span className="font-serif text-xl uppercase tracking-widest text-zinc-900">Elle Beauty Award</span>
            <span className="font-serif text-xl uppercase tracking-widest text-zinc-900">Harper's A-List</span>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up-hero {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-hero {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-in {
          animation: fade-in-hero 1.2s ease-out forwards;
        }
        .hero-fade-in-up {
          animation: fade-in-up-hero 1.2s ease-out forwards;
        }

        /* Smooth Carousel Styles */
        .testimonials-carousel-wrapper {
          overflow: hidden;
          position: relative;
          padding: 16px 0;
          margin: 0 -16px;
        }
        
        .testimonials-carousel {
          display: flex;
          animation: smooth-scroll 40s linear infinite;
          will-change: transform;
          padding: 0 16px;
        }
        
        .testimonials-carousel:hover {
          animation-play-state: paused;
        }
        
        @keyframes smooth-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .testimonial-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
