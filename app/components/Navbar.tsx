
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDarkNav = isScrolled || pathname !== '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isDarkNav ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center text-zinc-900">
        <div className="flex space-x-8 items-center hidden md:flex">
          <Link 
            href="/" 
            className={`text-[10px] uppercase tracking-[0.3em] transition-colors font-bold ${pathname === '/' ? 'text-champagne' : 'hover:text-champagne'}`}
          >
            Home
          </Link>
          <Link 
            href="/portfolio" 
            className={`text-[10px] uppercase tracking-[0.3em] transition-colors font-bold ${pathname === '/portfolio' ? 'text-champagne' : 'hover:text-champagne'}`}
          >
            Portfolio
          </Link>
        </div>

        <Link href="/" className="text-center cursor-pointer group">
          <h1 className="font-serif text-2xl md:text-3xl tracking-[0.1em] uppercase group-hover:text-champagne transition-colors">Diptika</h1>
          <p className="text-[9px] uppercase tracking-[0.4em] text-champagne mt-1 font-bold">Art Studio</p>
        </Link>

        <div className="flex space-x-8 items-center hidden md:flex text-right">
          <Link 
            href="/about" 
            className={`text-[10px] uppercase tracking-[0.3em] transition-colors font-bold ${pathname === '/about' ? 'text-champagne' : 'hover:text-champagne'}`}
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className={`text-[10px] uppercase tracking-[0.3em] transition-colors font-bold ${pathname === '/contact' ? 'text-champagne' : 'hover:text-champagne'}`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-zinc-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-zinc-100 p-8 flex flex-col items-center space-y-6 md:hidden shadow-xl">
          <button onClick={() => handleNavClick('/')} className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold">Home</button>
          <button onClick={() => handleNavClick('/portfolio')} className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold">Portfolio</button>
          <button onClick={() => handleNavClick('/about')} className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold">About</button>
          <button onClick={() => handleNavClick('/contact')} className="text-[10px] uppercase tracking-[0.3em] text-zinc-900 font-bold">Contact</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
