'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, BarChart3, ChevronRight, Settings, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useGetArtworksQuery, useGetServicesQuery, useGetTestimonialsQuery, useGetContactRequestsQuery } from '@/utils/services/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // Fetch data using RTK Query
  const { data: artworksData, isLoading: artworksLoading } = useGetArtworksQuery({});
  const { data: servicesData, isLoading: servicesLoading } = useGetServicesQuery({});
  const { data: testimonialsData } = useGetTestimonialsQuery({});
  const { data: contactsData } = useGetContactRequestsQuery({});

  const artworks = artworksData || [];
  const services = servicesData || [];
  const testimonials = testimonialsData || [];
  const contacts = contactsData || [];

  // Calculate total interactions (testimonials + contacts)
  const totalInteractions = testimonials.length + contacts.length;

  const stats = [
    { label: 'Masterpieces', value: artworks.length, icon: <ImageIcon size={20} /> },
    { label: 'Active Services', value: services.length, icon: <Briefcase size={20} /> },
    { label: 'Total Interactions', value: totalInteractions, icon: <BarChart3 size={20} /> },
  ];

  const isLoading = artworksLoading || servicesLoading;

  return (
    <div>
      <div className="mb-10 sm:mb-16">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.6em] text-champagne block mb-4 font-bold">Studio Overview</span>
        <h2 className="font-serif text-zinc-900 text-4xl sm:text-5xl md:text-6xl">Command Centre</h2>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-champagne" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 border border-zinc-100 shadow-sm flex items-center justify-between hover:border-champagne/30 transition-all duration-300">
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-2 font-bold">{stat.label}</p>
                <p className="font-serif text-3xl sm:text-4xl text-zinc-900">{stat.value}</p>
              </div>
              <div className="text-champagne/30">{stat.icon}</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div 
          onClick={() => router.push('/admin/artworks')}
          className="group cursor-pointer bg-white p-8 sm:p-10 border border-zinc-100 shadow-sm hover:border-champagne transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-8 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-50 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-white transition-colors">
              <ImageIcon size={20} className="sm:size-24" />
            </div>
            <ChevronRight size={18} className="text-zinc-200 group-hover:text-champagne group-hover:translate-x-2 transition-all" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 mb-4">Artpiece Manager</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">Curate the master collection. Add new creations, update images, and manage categories.</p>
        </div>

        <div 
          onClick={() => router.push('/admin/services')}
          className="group cursor-pointer bg-white p-8 sm:p-10 border border-zinc-100 shadow-sm hover:border-champagne transition-all duration-500"
        >
          <div className="flex justify-between items-start mb-8 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-50 flex items-center justify-center text-champagne group-hover:bg-champagne group-hover:text-white transition-colors">
              <Briefcase size={20} className="sm:size-24" />
            </div>
            <ChevronRight size={18} className="text-zinc-200 group-hover:text-champagne group-hover:translate-x-2 transition-all" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 mb-4">Service Offerings</h3>
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light">Manage your professional catalog. Update descriptions, pricing, and availability.</p>
        </div>
      </div>

      <div className="mt-16 pt-12 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-300 font-bold text-center sm:text-left">Diptika Art Studio Management Console v2.5</p>
        <div className="flex items-center space-x-6">
           <Settings size={18} className="text-zinc-200 hover:text-zinc-900 cursor-pointer transition-colors" onClick={() => router.push('/admin/settings')} />
        </div>
      </div>
    </div>
  );
}
