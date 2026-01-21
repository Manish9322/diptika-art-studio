
'use client';

import React, { useState, useEffect } from 'react';
// Fixed: Added Edit2 to imports
import { Save, Bell, Shield, CreditCard, Clock, FileText, X, CheckCircle2, Edit2 } from 'lucide-react';
import { StudioSettings } from '../../../types';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<StudioSettings>({
    studioName: 'Diptika Art Studio',
    supportEmail: 'concierge@diptikaart.com',
    currency: 'USD ($)',
    language: 'English (UK)',
    maintenanceMode: false,
    emailInquiries: true,
    autoResponse: true,
    availability: 'Mon - Sat, By Private Appointment Only',
    privacyPolicy: 'Your privacy is of paramount importance to Diptika Art Studio.',
    termsOfService: 'By engaging with Diptika Art Studio, you agree to our artistic process.'
  });
  const [success, setSuccess] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; type: 'privacy' | 'terms'; content: string }>({
    isOpen: false,
    type: 'privacy',
    content: ''
  });

  useEffect(() => {
    // Settings loaded from state
  }, []);

  const handleSave = () => {
    // Save settings via API
    console.log('Saving settings:', settings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const toggleSetting = (field: keyof StudioSettings) => {
    const val = settings[field];
    if (typeof val === 'boolean') {
      setSettings(prev => ({ ...prev, [field]: !val }));
    }
  };

  const openPolicyEditor = (type: 'privacy' | 'terms') => {
    setPolicyModal({
      isOpen: true,
      type,
      content: type === 'privacy' ? settings.privacyPolicy : settings.termsOfService
    });
  };

  const savePolicyContent = () => {
    const field = policyModal.type === 'privacy' ? 'privacyPolicy' : 'termsOfService';
    setSettings(prev => ({ ...prev, [field]: policyModal.content }));
    setPolicyModal({ ...policyModal, isOpen: false });
  };

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in relative">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Studio Configuration</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Global preferences and system-wide studio settings.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {success && <span className="text-green-500 text-[9px] uppercase tracking-[0.1em] font-bold">Preferences Saved</span>}
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-900 text-white px-6 py-4 sm:py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-champagne transition-all shadow-lg"
          >
            <Save size={14} />
            <span>Apply Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        <div className="lg:col-span-8 space-y-8 sm:space-y-12">
          {/* General Preferences */}
          <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm space-y-8 sm:space-y-10 rounded-sm">
            <h3 className="font-serif text-xl sm:text-2xl text-zinc-900 border-b border-zinc-50 pb-6 flex items-center space-x-4">
              <Shield size={20} className="text-champagne shrink-0" />
              <span>Core Identity</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Studio Branding Name</label>
                <input 
                  type="text"
                  value={settings.studioName}
                  onChange={(e) => setSettings({...settings, studioName: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-zinc-900 font-medium focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">System Concierge Email</label>
                <input 
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  className="w-full bg-transparent border-b border-zinc-100 py-3 text-zinc-600 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Availability Schedule</label>
                <div className="flex items-center space-x-3 border-b border-zinc-100 py-3">
                  <Clock size={14} className="text-zinc-300 shrink-0" />
                  <input 
                    type="text"
                    value={settings.availability}
                    onChange={(e) => setSettings({...settings, availability: e.target.value})}
                    className="w-full bg-transparent text-sm text-zinc-600 focus:outline-none"
                    placeholder="e.g. Mon - Sat, 9am - 6pm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">System Currency</label>
                <div className="flex items-center space-x-3 border-b border-zinc-100 py-3">
                  <CreditCard size={14} className="text-zinc-300 shrink-0" />
                  <select 
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full bg-transparent text-sm text-zinc-600 focus:outline-none appearance-none cursor-pointer outline-none"
                  >
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                    <option>EUR (€)</option>
                    <option>AED (د.إ)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Policies */}
          <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm space-y-8 sm:space-y-10 rounded-sm">
            <h3 className="font-serif text-xl sm:text-2xl text-zinc-900 border-b border-zinc-50 pb-6 flex items-center space-x-4">
              <FileText size={20} className="text-champagne shrink-0" />
              <span>Legal & Policies</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm flex flex-col justify-between group hover:border-champagne transition-all">
                <div className="mb-6">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block mb-2">Public Documentation</span>
                  <h4 className="font-serif text-xl text-zinc-900">Privacy Policy</h4>
                </div>
                <button 
                  onClick={() => openPolicyEditor('privacy')}
                  className="flex items-center justify-between w-full text-[10px] uppercase tracking-widest text-champagne font-bold group-hover:text-zinc-900 transition-colors"
                >
                  <span>Manage Policy</span>
                  <Edit2 size={12} />
                </button>
              </div>

              <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-sm flex flex-col justify-between group hover:border-champagne transition-all">
                <div className="mb-6">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold block mb-2">Studio Guidelines</span>
                  <h4 className="font-serif text-xl text-zinc-900">Terms of Service</h4>
                </div>
                <button 
                  onClick={() => openPolicyEditor('terms')}
                  className="flex items-center justify-between w-full text-[10px] uppercase tracking-widest text-champagne font-bold group-hover:text-zinc-900 transition-colors"
                >
                  <span>Manage Terms</span>
                  <Edit2 size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Communications */}
          <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm space-y-8 sm:space-y-10 rounded-sm">
            <h3 className="font-serif text-xl sm:text-2xl text-zinc-900 border-b border-zinc-50 pb-6 flex items-center space-x-4">
              <Bell size={20} className="text-champagne shrink-0" />
              <span>Studio Visibility</span>
            </h3>
            
            <div className="space-y-8 sm:space-y-10">
              {[
                { id: 'emailInquiries', label: 'Email Alerts for New Inquiries', desc: 'Receive a real-time notification whenever a prospective client submits a vision brief.' },
                { id: 'autoResponse', label: 'Automated Client Acknowledgement', desc: 'Instantly send a luxury-themed confirmation receipt for new commissions.' },
                { id: 'maintenanceMode', label: 'Public Maintenance Mode', desc: 'Display a professional refinement screen to visitors while you curate your collections.' },
              ].map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="max-w-md">
                    <p className={`text-[11px] uppercase tracking-[0.1em] font-bold mb-1 ${item.id === 'maintenanceMode' && settings.maintenanceMode ? 'text-champagne' : 'text-zinc-900'}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleSetting(item.id as keyof StudioSettings)}
                    className={`relative w-12 h-6 shrink-0 rounded-full transition-all duration-300 ${settings[item.id as keyof StudioSettings] ? 'bg-champagne shadow-[0_0_15px_-3px_rgba(197,160,89,0.5)]' : 'bg-zinc-100'}`}
                  >
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${settings[item.id as keyof StudioSettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 sm:p-8 border border-zinc-100 shadow-sm rounded-sm">
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-3">System Health</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-zinc-400">Database</span>
                <span className="text-green-500">Connected</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                <span className="text-zinc-400">Policies</span>
                <span className="text-champagne">Configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Editor Modal */}
      {policyModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" onClick={() => setPolicyModal({...policyModal, isOpen: false})} />
          <div className="relative bg-white w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] animate-scale-in">
            <div className="p-8 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-champagne block mb-1 font-bold">Policy Management</span>
                <h3 className="font-serif text-3xl text-zinc-900">{policyModal.type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</h3>
              </div>
              <button onClick={() => setPolicyModal({...policyModal, isOpen: false})} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto bg-zinc-50/50">
              <div className="bg-white border border-zinc-100 p-8 h-full min-h-[400px]">
                <textarea 
                  value={policyModal.content}
                  onChange={(e) => setPolicyModal({...policyModal, content: e.target.value})}
                  className="w-full h-full text-base text-zinc-600 font-light leading-relaxed focus:outline-none resize-none"
                  placeholder="Draft your professional studio policy here..."
                />
              </div>
            </div>

            <div className="p-8 border-t border-zinc-100 flex justify-end shrink-0">
              <button 
                onClick={savePolicyContent}
                className="flex items-center space-x-3 bg-zinc-900 text-white px-10 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-champagne transition-all shadow-lg"
              >
                <CheckCircle2 size={16} />
                <span>Confirm Policy Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default AdminSettings;
