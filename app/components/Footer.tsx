
'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Youtube, Mail, Globe } from 'lucide-react';
import { useGetArtistProfileQuery, useGetServicesQuery } from '@/utils/services/api';

const Footer: React.FC = () => {
  const { data: profileData } = useGetArtistProfileQuery(undefined);
  const profile = profileData;
  const { data: servicesData } = useGetServicesQuery({});
  // Filter to only show active services
  const allServices = servicesData || [];
  const activeServices = allServices.filter((s: any) => s.active !== false);
  const services = activeServices.slice(0, 5);

  return (
    <footer className="bg-white py-24 px-8 border-t border-zinc-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
             <h2 className="font-serif text-3xl uppercase tracking-widest mb-6 text-zinc-900">Diptika Art Studio</h2>
             <p className="text-zinc-400 text-xs leading-relaxed max-w-sm tracking-wide">
               Elevating traditional artistry to the realms of high-fashion and luxury editorial. Available worldwide for bespoke online commissions and consultations.
             </p>
             {profile?.socialLinks && (
               <div className="flex flex-wrap gap-6 mt-10">
                 {profile.socialLinks.instagram && (
                   <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                     <Instagram size={20} className="text-zinc-300 hover:text-champagne cursor-pointer transition-colors" />
                   </a>
                 )}
                 {profile.socialLinks.facebook && (
                   <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                     <Facebook size={20} className="text-zinc-300 hover:text-champagne cursor-pointer transition-colors" />
                   </a>
                 )}
                 {profile.socialLinks.twitter && (
                   <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                     <Twitter size={20} className="text-zinc-300 hover:text-champagne cursor-pointer transition-colors" />
                   </a>
                 )}
                 {profile.socialLinks.youtube && (
                   <a href={profile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" title="YouTube">
                     <Youtube size={20} className="text-zinc-300 hover:text-champagne cursor-pointer transition-colors" />
                   </a>
                 )}
                 {profile.socialLinks.email && (
                   <a href={`mailto:${profile.socialLinks.email}`} title="Email">
                     <Mail size={20} className="text-zinc-300 hover:text-champagne cursor-pointer transition-colors" />
                   </a>
                 )}
                 {profile.socialLinks.other && (
                   <a href={profile.socialLinks.other} target="_blank" rel="noopener noreferrer" title="Website">
                     <Globe size={20} className="text-zinc-300 hover:text-champagne cursor-pointer transition-colors" />
                   </a>
                 )}
               </div>
             )}
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-300 border-b border-zinc-50 pb-4 font-bold">Navigation</h4>
            <ul className="space-y-4 text-[10px] tracking-[0.2em] font-bold">
              <li><Link href="/portfolio" className="text-zinc-900 hover:text-champagne transition-colors">PORTFOLIO</Link></li>
              <li><Link href="/about" className="text-zinc-900 hover:text-champagne transition-colors">THE ARTIST</Link></li>
              <li><Link href="/contact" className="text-zinc-900 hover:text-champagne transition-colors">INQUIRIES</Link></li>
              <li><Link href="/admin/dashboard" className="text-champagne hover:text-zinc-900 transition-colors">STUDIO DASHBOARD</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-zinc-300 border-b border-zinc-50 pb-4 font-bold">Services</h4>
            <ul className="space-y-4 text-[10px] tracking-[0.2em] font-bold">
              {services.length > 0 ? (
                services.map((service: any) => (
                  <li key={service._id}>
                    <span className="text-zinc-900">{service.title?.toUpperCase()}</span>
                  </li>
                ))
              ) : (
                <>
                  <li><span className="text-zinc-900">BRIDAL MEHNDI</span></li>
                  <li><span className="text-zinc-900">NAIL ARTISTRY</span></li>
                  <li><span className="text-zinc-900">MAKEUP DESIGN</span></li>
                  <li><span className="text-zinc-900">RANGOLI ART</span></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-zinc-100 text-[9px] uppercase tracking-[0.5em] text-zinc-300 font-bold">
          <p>&copy; {new Date().getFullYear()} DIPTIKA ART STUDIO. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">PRIVACY POLICY</Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">TERMS OF SERVICE</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
