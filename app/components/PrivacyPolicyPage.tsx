
'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Clock } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const [policy, setPolicy] = useState('Your privacy is of paramount importance to Diptika Art Studio. We collect minimal information required to provide our bespoke artistic services. Any data shared with the studio is stored securely and never shared with third parties without explicit consent.');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfaf6] pt-48 pb-32 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-24">
          <div className="w-16 h-16 bg-white border border-zinc-100 flex items-center justify-center text-champagne mx-auto mb-8 shadow-sm">
            <Shield size={32} strokeWidth={1} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-6 font-bold">Studio Governance</span>
          <h1 className="font-serif text-5xl md:text-7xl text-zinc-900 leading-tight">Privacy <span className="italic">Policy</span></h1>
        </div>

        <div className="bg-white border border-zinc-100 p-12 md:p-24 shadow-2xl relative">
          <div className="absolute top-12 right-12 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
            <Clock size={12} />
            <span>Updated: {new Date().getFullYear()}</span>
          </div>

          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-600 text-lg font-light leading-relaxed whitespace-pre-wrap italic border-l-2 border-champagne/20 pl-8">
              {policy || "The privacy policy for Diptika Art Studio is currently being refined by our archives. Please check back shortly."}
            </p>
          </div>
          
          <div className="mt-24 pt-12 border-t border-zinc-50 flex justify-center items-center">
            <div className="text-center">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold mb-2">Inquiry Contact</h4>
              <p className="text-xs text-zinc-400 font-light">concierge@diptikaart.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
