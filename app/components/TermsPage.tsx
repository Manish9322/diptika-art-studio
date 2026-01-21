
'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Clock } from 'lucide-react';

const TermsPage: React.FC = () => {
  const [terms, setTerms] = useState('By engaging with Diptika Art Studio, you agree to our artistic process. All commissions require a non-refundable deposit. Final results may vary based on individual skin textures and medium responses, as is the nature of artisan work.');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-48 pb-32 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <div className="w-16 h-16 bg-white border border-zinc-100 flex items-center justify-center text-champagne mx-auto mb-8 shadow-sm">
            <FileText size={32} strokeWidth={1} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-6 font-bold">Client Agreement</span>
          <h1 className="font-serif text-5xl md:text-7xl text-zinc-900 leading-tight">Terms of <span className="italic">Service</span></h1>
        </div>

        <div className="bg-white border border-zinc-100 p-12 md:p-24 shadow-2xl relative">
          <div className="absolute top-12 right-12 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
            <Clock size={12} />
            <span>Studio Ver: 2.5</span>
          </div>

          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-600 text-lg font-light leading-relaxed whitespace-pre-wrap italic border-l-2 border-champagne/20 pl-8">
              {terms || "The terms of service for Diptika Art Studio are currently being formalized. Please consult your booking contract for immediate guidelines."}
            </p>
          </div>
          
          <div className="mt-24 pt-12 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-8">
             <div className="text-center md:text-left">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold mb-2">Legal Jurisdiction</h4>
              <p className="text-xs text-zinc-400 font-light">United Kingdom Governance</p>
            </div>
            <div className="text-center md:text-right">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold mb-2">Digital Signature</h4>
              <p className="text-xs text-zinc-400 font-light">Validated @ Diptika Art Studio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
