
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fdfaf6]">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=90&w=1920" 
          alt="Luxury Artistry" 
          className="w-full h-full object-cover opacity-30 scale-105 animate-[slow-zoom_20s_infinite]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-[#fdfaf6]"></div>
        <div className="absolute inset-0 bg-linear-to-r from-white/20 via-transparent to-white/20"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="hero-fade-in mt-32 md:mt-20" style={{ animationDelay: '0.2s' }}>
          <span className="text-[11px] md:text-[12px] uppercase tracking-[0.6em] text-champagne block mb-6 font-bold">
            Master Artistry & Bespoke Beauty
          </span>
        </div>
        
        <div className="hero-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="font-serif text-zinc-900 text-5xl md:text-8xl lg:text-9xl font-light mb-8 leading-tight tracking-tight">
            Where Soul <br /> Meets <span className="italic text-champagne">Texture</span>
          </h2>
        </div>
        
        <div className="hero-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-zinc-500 text-sm md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide font-light">
            Elevating heritage traditions through contemporary vision. Specializing in intricate bridal Mehndi, sculptural nail couture, and high-fashion editorial makeup for the most discerning clients across the globe.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 hero-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <a href="#gallery" className="px-10 py-4 border border-champagne text-zinc-900 text-[10px] uppercase tracking-[0.4em] hover:bg-champagne hover:text-white transition-all duration-500 font-bold">
            View Collection
          </a>
          <a href="#contact" className="px-10 py-4 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all duration-500 font-bold shadow-lg">
            Private Inquiry
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes fade-in-hero {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up-hero {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-in {
          opacity: 0;
          animation: fade-in-hero 1.2s ease-out forwards;
        }
        .hero-fade-in-up {
          opacity: 0;
          animation: fade-in-up-hero 1.2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
