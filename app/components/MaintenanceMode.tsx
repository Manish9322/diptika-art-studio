
'use client';

import React from 'react';
import { Instagram, Lock } from 'lucide-react';
// Fixed: Page type should be imported from types.ts
import { Page } from '../../types';

interface MaintenanceModeProps {
  onAdminLogin: () => void;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ onAdminLogin }) => {
  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <h1 className="font-serif text-[40vw] uppercase leading-none select-none">DIPTIKA</h1>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block font-bold animate-pulse">
            Studio Refinement
          </span>
          <h2 className="font-serif text-5xl md:text-7xl text-zinc-900 leading-tight">
            Curating New <br /><span className="italic">Artistry</span>
          </h2>
        </div>

        <div className="w-16 h-[1px] bg-champagne mx-auto"></div>

        <p className="text-zinc-500 text-sm md:text-lg font-light leading-relaxed tracking-wide">
          Diptika Art Studio is currently undergoing an archival update. We are meticulously curating our latest collection of bridal mehndi, nail couture, and editorial makeup.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-8 py-4 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-champagne transition-all duration-500 shadow-xl"
          >
            <Instagram size={16} />
            <span>Follow the Progress</span>
          </a>
          <button 
            onClick={onAdminLogin}
            className="flex items-center space-x-3 px-8 py-4 border border-zinc-200 text-zinc-400 text-[10px] uppercase tracking-[0.4em] font-bold hover:text-zinc-900 hover:border-zinc-900 transition-all duration-500"
          >
            <Lock size={14} />
            <span>Studio Access</span>
          </button>
        </div>

        <div className="pt-24 text-[9px] uppercase tracking-[0.5em] text-zinc-300 font-bold">
          Diptika Art Studio &copy; 2024
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
