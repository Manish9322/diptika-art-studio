'use client';

import React, { useState } from 'react';
import { LayoutGrid, Briefcase, Image as ImageIcon, LogOut, Home, ChevronRight, Menu, X, BarChart2, User, Settings, MessageSquare, Star, Award } from 'lucide-react';
// Fixed: Page type should be imported from types.ts
import { Page } from '../../../types';
import { ConfirmationModal } from './AdminModals';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleMobileNavigate = (target: Page) => {
    onNavigate(target);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/admin/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Call the parent logout handler
      onLogout();
    }
  };

  const menuItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: <LayoutGrid size={18} />, target: 'admin-dashboard' as Page },
    { id: 'admin-contacts', label: 'Inquiries', icon: <MessageSquare size={18} />, target: 'admin-contacts' as Page },
    { id: 'admin-art', label: 'Collection', icon: <ImageIcon size={18} />, target: 'admin-art' as Page },
    { id: 'admin-services', label: 'Services', icon: <Briefcase size={18} />, target: 'admin-services' as Page },
    { id: 'admin-testimonials', label: 'Stories', icon: <Star size={18} />, target: 'admin-testimonials' as Page },
    { id: 'admin-awards', label: 'Awards', icon: <Award size={18} />, target: 'admin-awards' as Page },
    { id: 'admin-analytics', label: 'Analytics', icon: <BarChart2 size={18} />, target: 'admin-analytics' as Page },
    { id: 'admin-profile', label: 'Profile', icon: <User size={18} />, target: 'admin-profile' as Page },
    { id: 'admin-settings', label: 'Settings', icon: <Settings size={18} />, target: 'admin-settings' as Page },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex relative overflow-x-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`bg-zinc-950 text-white flex flex-col fixed h-full z-50 transition-all duration-500 ease-in-out border-r border-zinc-800 shadow-2xl ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
        }`}
      >
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl uppercase tracking-widest text-white">Diptika</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-champagne mt-1 font-bold">Studio Admin</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMobileNavigate(item.target)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-300 group ${
                currentPage === item.id 
                ? 'bg-champagne text-black font-bold' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${currentPage === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0'}`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button onClick={() => handleMobileNavigate('home')} className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-white text-[10px] uppercase tracking-[0.2em] transition-colors">
            <Home size={18} />
            <span>View Public Site</span>
          </button>
          <button onClick={() => setIsLogoutModalOpen(true)} className="w-full flex items-center space-x-3 px-4 py-3 text-red-400/60 hover:text-red-400 text-[10px] uppercase tracking-[0.2em] transition-colors">
            <LogOut size={18} />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      <main className={`flex-1 min-h-screen transition-all duration-500 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-40 px-4 sm:px-8 py-4 bg-[#fdfaf6]/80 backdrop-blur-md flex items-center border-b border-zinc-100 lg:border-none">
          <button onClick={toggleSidebar} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all rounded-md flex items-center space-x-3">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            {!isSidebarOpen && <span className="text-[9px] uppercase tracking-[0.2em] font-bold hidden sm:inline">Management Menu</span>}
          </button>
        </header>

        <div className="px-6 sm:px-12 pb-12 pt-4 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>

      <ConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="End Studio Session"
        message="Are you sure you wish to log out?"
        confirmText="Log Out"
        confirmVariant="danger"
        icon={<LogOut size={32} />}
      />
    </div>
  );
};

export default AdminLayout;
