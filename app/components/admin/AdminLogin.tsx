
'use client';

import React, { useState } from 'react';
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.data.user));
        
        // Call onLogin callback
        onLogin();
      } else {
        setError(data.message || 'Invalid credentials for Diptika Art Studio access.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 bg-[#fdfaf6]">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl text-zinc-900 mb-4">Studio Access</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-champagne font-bold">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 border border-zinc-100 shadow-2xl space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-500 text-[10px] uppercase tracking-[0.1em] font-bold text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Studio ID</label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
              <input 
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter your studio-id here"
                className="w-full pl-8 py-3 bg-transparent border-b border-zinc-100 text-sm focus:outline-none focus:border-champagne transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter your password here"
                className="w-full pl-8 pr-10 py-3 bg-transparent border-b border-zinc-100 text-sm focus:outline-none focus:border-champagne transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-champagne transition-colors focus:outline-none p-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-champagne transition-all duration-500 flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Authenticating...' : 'Unlock Dashboard'}</span>
            {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
