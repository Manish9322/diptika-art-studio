
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Save, User, Mail, Instagram, Globe, Camera, Upload, Loader2, Link, Linkedin, Facebook, Twitter, Youtube, MapPin, Phone } from 'lucide-react';
import { compressImage } from '../../../utils/imageUtils';
import { ArtistProfile } from '../../../types';
import { useGetArtistProfileQuery, useUpdateArtistProfileMutation } from '../../../utils/services/api';

const AdminProfile: React.FC = () => {
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const aboutPageImageInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizingProfile, setIsOptimizingProfile] = useState(false);
  const [isOptimizingAbout, setIsOptimizingAbout] = useState(false);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: profileData, isLoading, refetch } = useGetArtistProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateArtistProfileMutation();

  useEffect(() => {
    if (profileData) {
      // The API already transforms the response, so profileData is the actual profile object
      // Ensure we have the new image fields with fallbacks
      const profileWithImages = {
        ...profileData,
        profileImage: profileData.profileImage || profileData.image || '',
        aboutPageImage: profileData.aboutPageImage || profileData.image || ''
      };
      setProfile(profileWithImages);
    }
  }, [profileData]);

  const handleSave = async () => {
    if (!profile) return;
    
    try {
      setError(null);
      await updateProfile(profile).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      refetch();
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(null), 5000);
    }
  };

  const updateField = (field: keyof ArtistProfile, value: any) => {
    if (!profile) return;
    setProfile(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const updateSocialLink = (platform: keyof ArtistProfile['socialLinks'], value: string) => {
    if (!profile) return;
    setProfile(prev => prev ? ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }) : null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'profile' | 'about') => {
    const file = e.target.files?.[0];
    if (file) {
      const setOptimizing = imageType === 'profile' ? setIsOptimizingProfile : setIsOptimizingAbout;
      setOptimizing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64);
          const field = imageType === 'profile' ? 'profileImage' : 'aboutPageImage';
          updateField(field, optimized);
          setOptimizing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Portrait optimization failed", err);
        setOptimizing(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-champagne" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-400">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Artisan Profile</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Curate your professional presence and public biography.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {(isOptimizingProfile || isOptimizingAbout) && (
            <div className="flex items-center space-x-2 text-champagne text-[9px] uppercase tracking-widest font-bold">
              <Loader2 size={12} className="animate-spin" />
              <span>Optimizing {isOptimizingProfile ? 'Profile' : 'About'} Image...</span>
            </div>
          )}
          {success && <span className="text-green-500 text-[9px] uppercase tracking-[0.1em] font-bold">Identity Synced</span>}
          {error && <span className="text-red-500 text-[9px] uppercase tracking-[0.1em] font-bold">{error}</span>}
          <button 
            onClick={handleSave}
            disabled={isOptimizingProfile || isOptimizingAbout || isUpdating}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-900 text-white px-6 py-4 sm:py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-champagne transition-all shadow-lg disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isUpdating ? 'Updating...' : 'Update Profile'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        {/* Visual Presence */}
        <div className="lg:col-span-4 space-y-8">
          {/* Profile Image for Main Page */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4">Main Page Profile Image</h4>
            <p className="text-xs text-zinc-400 mb-6">This image appears in the About section on the main page</p>
            <div className="relative group mx-auto w-40 sm:w-48 h-56 sm:h-64 mb-6">
              <div className="w-full h-full overflow-hidden border border-zinc-100 bg-zinc-50 rounded-sm">
                <img 
                  src={profile.profileImage || profile.image || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1200"} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div 
                onClick={() => !isOptimizingProfile && profileImageInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer space-y-2 rounded-sm"
              >
                <Camera size={24} className="text-white" />
                <span className="text-[8px] text-white uppercase tracking-widest font-bold">Upload New</span>
              </div>
              <input 
                type="file" 
                ref={profileImageInputRef} 
                onChange={(e) => handleFileChange(e, 'profile')} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="text-center">
              <h3 className="font-serif text-2xl text-zinc-900 mb-1 leading-none">{profile.name}</h3>
              <p className="text-[9px] uppercase tracking-[0.2em] text-champagne font-bold mt-2">{profile.title}</p>
            </div>
          </div>

          {/* About Page Image */}
          <div className="bg-white p-6 sm:p-8 border border-zinc-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-4">About Page Large Image</h4>
            <p className="text-xs text-zinc-400 mb-6">This image appears as the large portrait on the About page</p>
            <div className="relative group mx-auto w-40 sm:w-48 h-56 sm:h-64 mb-4">
              <div className="w-full h-full overflow-hidden border border-zinc-100 bg-zinc-50 rounded-sm">
                <img 
                  src={profile.aboutPageImage || profile.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1200"} 
                  alt="About Page" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div 
                onClick={() => !isOptimizingAbout && aboutPageImageInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer space-y-2 rounded-sm"
              >
                <Upload size={24} className="text-white" />
                <span className="text-[8px] text-white uppercase tracking-widest font-bold">Upload New</span>
              </div>
              <input 
                type="file" 
                ref={aboutPageImageInputRef} 
                onChange={(e) => handleFileChange(e, 'about')} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          {/* Location fields removed - Online Platform Only */}
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> This is an online platform. Physical location fields have been removed. You can serve clients globally through online consultations and commissions.
              </p>
            </div>
        </div>

        {/* Narrative & Credentials */}
        <div className="lg:col-span-8">
          <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm space-y-8 sm:space-y-10 rounded-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Professional Name</label>
                <input 
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-zinc-900 font-serif text-2xl focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Artistic Tenure</label>
                <input 
                  type="text"
                  value={profile.experience}
                  onChange={(e) => updateField('experience', e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-zinc-600 font-medium focus:outline-none focus:border-champagne"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Public Bio / Manifesto</label>
              <textarea 
                value={profile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                className="w-full bg-transparent border-b border-zinc-100 py-3 text-sm text-zinc-500 font-light leading-relaxed focus:outline-none focus:border-champagne resize-none min-h-[200px]"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Contact Email</label>
                <div className="flex items-center space-x-3 border-b border-zinc-100 py-3">
                  <Mail size={14} className="text-zinc-300 shrink-0" />
                  <input 
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-transparent text-sm text-zinc-600 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Contact Phone</label>
                <div className="flex items-center space-x-3 border-b border-zinc-100 py-3">
                  <Phone size={14} className="text-zinc-300 shrink-0" />
                  <input 
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full bg-transparent text-sm text-zinc-600 focus:outline-none"
                    placeholder="e.g. +44 20 1234 5678"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 bg-champagne/5 p-6 sm:p-8 border border-champagne/10 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-champagne font-bold mb-3">Professional Insight</h4>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">
              Updating your profile ensures your personal brand remains current across the primary public touchpoints. The biography serves as your digital handshake—keep it authentic and evocative.
            </p>
          </div>
        </div>
      </div>

      {/* Social Media Links Section - Below Main Content */}
      <div className="mt-8 sm:mt-12">
        <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm rounded-sm">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-6 mb-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-2">Social Media Links</h4>
              <p className="text-xs text-zinc-400">Connect your social media profiles to appear in the footer and contact page</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Instagram */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Instagram size={14} className="text-pink-500" />
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Instagram</label>
              </div>
              <input 
                type="text" 
                value={profile.socialLinks?.instagram || ''}
                placeholder="https://instagram.com/yourusername"
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Facebook size={14} className="text-blue-600" />
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Facebook</label>
              </div>
              <input 
                type="text" 
                value={profile.socialLinks?.facebook || ''}
                placeholder="https://facebook.com/yourpage"
                onChange={(e) => updateSocialLink('facebook', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>

            {/* Twitter */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Twitter size={14} className="text-sky-500" />
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Twitter / X</label>
              </div>
              <input 
                type="text" 
                value={profile.socialLinks?.twitter || ''}
                placeholder="https://twitter.com/yourusername"
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>

            {/* Snapchat */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 bg-yellow-400 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Snapchat</label>
              </div>
              <input 
                type="text" 
                value={profile.socialLinks?.snapchat || ''}
                placeholder="https://snapchat.com/add/yourusername"
                onChange={(e) => updateSocialLink('snapchat', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>

            {/* YouTube */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Youtube size={14} className="text-red-600" />
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">YouTube</label>
              </div>
              <input 
                type="text" 
                value={profile.socialLinks?.youtube || ''}
                placeholder="https://youtube.com/@yourchannel"
                onChange={(e) => updateSocialLink('youtube', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>

            {/* Social Email */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={14} className="text-zinc-400" />
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Social Email</label>
              </div>
              <input 
                type="email" 
                value={profile.socialLinks?.email || ''}
                placeholder="social@yourdomain.com"
                onChange={(e) => updateSocialLink('email', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>

            {/* Other Link */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Globe size={14} className="text-zinc-400" />
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Other Link</label>
              </div>
              <input 
                type="text" 
                value={profile.socialLinks?.other || ''}
                placeholder="https://yourwebsite.com"
                onChange={(e) => updateSocialLink('other', e.target.value)}
                className="text-xs text-zinc-600 font-medium bg-zinc-50 border-none px-3 py-3 focus:ring-1 focus:ring-champagne/20 w-full rounded-sm outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminProfile;
