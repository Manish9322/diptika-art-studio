'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutGrid, Briefcase, Image as ImageIcon, LogOut, Home, ChevronRight, Menu, X, BarChart2, User, Settings, MessageSquare, Star } from 'lucide-react';
import { ConfirmationModal } from '@/app/components/admin/AdminModals';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('diptika_admin_auth') === 'true';
    if (!isAuth && pathname !== '/admin/login') {
      router.push('/admin/login');
    }

    // Set sidebar state based on screen size
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth > 1024);
    }
  }, [pathname, router]);

  const handleMobileNavigate = (path: string) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('diptika_admin_auth');
    router.push('/admin/login');
    setIsLogoutModalOpen(false);
  };

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutGrid size={18} />, path: '/admin/dashboard' },
    { id: 'contacts', label: 'Inquiries', icon: <MessageSquare size={18} />, path: '/admin/contacts' },
    { id: 'artworks', label: 'Collection', icon: <ImageIcon size={18} />, path: '/admin/artworks' },
    { id: 'services', label: 'Services', icon: <Briefcase size={18} />, path: '/admin/services' },
    { id: 'testimonials', label: 'Stories', icon: <Star size={18} />, path: '/admin/testimonials' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} />, path: '/admin/analytics' },
    { id: 'profile', label: 'Profile', icon: <User size={18} />, path: '/admin/profile' },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

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
              onClick={() => handleMobileNavigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all duration-300 group ${
                pathname === item.path
                ? 'bg-champagne text-black font-bold' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${pathname === item.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0'}`} />
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button onClick={() => router.push('/')} className="w-full flex items-center space-x-3 px-4 py-3 text-zinc-500 hover:text-white text-[10px] uppercase tracking-[0.2em] transition-colors">
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
}
