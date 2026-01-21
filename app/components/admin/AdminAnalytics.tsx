
'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Users, MousePointer2, Clock, MapPin, Search, Filter, Monitor, Smartphone, Globe, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface VisitorSession {
  id: string;
  timestamp: string;
  page: string;
  duration: number; // in seconds
  device: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  location: string;
  ip: string;
}

const AdminAnalytics: React.FC = () => {
  const visitorData = [120, 150, 110, 210, 180, 250, 220]; 
  const servicePopularity = [
    { label: 'Mehndi', val: 45 },
    { label: 'Makeup', val: 32 },
    { label: 'Nails', val: 28 },
    { label: 'Rangoli', val: 15 },
    { label: 'Bespoke', val: 10 }
  ];

  const [sessions] = useState<VisitorSession[]>([
    { id: '1', timestamp: '2024-05-20 14:22', page: 'Home', duration: 145, device: 'Desktop', browser: 'Chrome / macOS', location: 'London, UK', ip: '192.168.1.45' },
    { id: '2', timestamp: '2024-05-20 14:15', page: 'Portfolio', duration: 312, device: 'Mobile', browser: 'Safari / iOS', location: 'New York, US', ip: '172.16.254.1' },
    { id: '3', timestamp: '2024-05-20 13:50', page: 'About', duration: 88, device: 'Desktop', browser: 'Firefox / Windows', location: 'Paris, FR', ip: '10.0.0.8' },
    { id: '4', timestamp: '2024-05-20 13:42', page: 'Contact', duration: 450, device: 'Mobile', browser: 'Chrome / Android', location: 'Dubai, AE', ip: '192.168.10.2' },
    { id: '5', timestamp: '2024-05-20 13:10', page: 'Home', duration: 12, device: 'Tablet', browser: 'Safari / iPadOS', location: 'Mumbai, IN', ip: '127.0.0.1' },
    { id: '6', timestamp: '2024-05-20 12:45', page: 'Portfolio', duration: 520, device: 'Desktop', browser: 'Edge / Windows', location: 'London, UK', ip: '192.168.1.12' },
    { id: '7', timestamp: '2024-05-20 12:30', page: 'Home', duration: 65, device: 'Mobile', browser: 'Safari / iOS', location: 'Sydney, AU', ip: '10.1.1.5' },
    { id: '8', timestamp: '2024-05-20 12:15', page: 'Portfolio', duration: 195, device: 'Desktop', browser: 'Chrome / Linux', location: 'Berlin, DE', ip: '192.168.0.100' },
    { id: '9', timestamp: '2024-05-20 11:55', page: 'About', duration: 210, device: 'Mobile', browser: 'Chrome / iOS', location: 'Tokyo, JP', ip: '172.16.0.44' },
    { id: '10', timestamp: '2024-05-20 11:30', page: 'Contact', duration: 35, device: 'Desktop', browser: 'Safari / macOS', location: 'Toronto, CA', ip: '10.0.1.22' },
    { id: '11', timestamp: '2024-05-20 11:05', page: 'Portfolio', duration: 412, device: 'Mobile', browser: 'Safari / iOS', location: 'London, UK', ip: '192.168.1.88' },
    { id: '12', timestamp: '2024-05-20 10:45', page: 'Home', duration: 92, device: 'Desktop', browser: 'Chrome / macOS', location: 'Madrid, ES', ip: '192.168.1.99' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filterPage, setFilterPage] = useState('All');
  const [filterDevice, setFilterDevice] = useState('All');
  const [minDuration, setMinDuration] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 6;

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesPage = filterPage === 'All' || s.page === filterPage;
      const matchesDevice = filterDevice === 'All' || s.device === filterDevice;
      const matchesDuration = s.duration >= minDuration;
      return matchesPage && matchesDevice && matchesDuration;
    });
  }, [sessions, filterPage, filterDevice, minDuration]);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const maxVisitors = Math.max(...visitorData);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Studio Intelligence</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Analyzing engagement and bespoke performance metrics.</p>
        </div>
        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center justify-center space-x-2 px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all w-full lg:w-auto ${isFilterOpen ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl' : 'bg-white text-zinc-600 border-zinc-100 hover:border-champagne'}`}>
          <Filter size={14} /><span>Fine-tune Visibility</span>
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-white border border-zinc-100 p-6 sm:p-10 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="space-y-3"><label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Resonance Point</label><select value={filterPage} onChange={(e) => {setFilterPage(e.target.value); setCurrentPage(1);}} className="w-full bg-zinc-50 border-none px-4 py-3 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"><option value="All">Global Reach</option><option value="Home">Entrance</option><option value="Portfolio">Archive</option><option value="About">Narrative</option><option value="Contact">Engagement</option></select></div>
          <div className="space-y-3"><label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Access Environment</label><select value={filterDevice} onChange={(e) => {setFilterDevice(e.target.value); setCurrentPage(1);}} className="w-full bg-zinc-50 border-none px-4 py-3 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"><option value="All">All Environments</option><option value="Desktop">Studio View</option><option value="Mobile">Handheld View</option><option value="Tablet">Portfolio View</option></select></div>
          <div className="space-y-3"><label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Persistence (sec)</label><input type="number" value={minDuration} onChange={(e) => {setMinDuration(Number(e.target.value)); setCurrentPage(1);}} placeholder="Min. Seconds" className="w-full bg-zinc-50 border-none px-4 py-3 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm" /></div>
        </div>
      )}

      {/* Adaptive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Studio Reach', value: '1.2k', icon: <Users size={18} /> },
          { label: 'Archive Interest', value: '4.8%', icon: <MousePointer2 size={18} /> },
          { label: 'Time in Gallery', value: '3:42', icon: <Clock size={18} /> },
          { label: 'Vision Conversion', value: '2.1%', icon: <TrendingUp size={18} /> },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 sm:p-8 border border-zinc-100 shadow-sm flex flex-col justify-between group hover:border-champagne/30 transition-all">
            <div className="flex justify-between items-start mb-6"><span className="p-3 bg-zinc-50 text-champagne rounded-sm group-hover:bg-champagne group-hover:text-white transition-colors">{kpi.icon}</span></div>
            <div><p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">{kpi.label}</p><p className="font-serif text-3xl text-zinc-900">{kpi.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm rounded-sm">
          <div className="mb-10"><h3 className="font-serif text-2xl text-zinc-900 mb-1 leading-tight">Engagement Velocity</h3><p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Archival trends over past 7 cycles</p></div>
          <div className="h-48 sm:h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="none">
              <defs><linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c5a059" stopOpacity="0.3" /><stop offset="100%" stopColor="#c5a059" stopOpacity="0" /></linearGradient></defs>
              <path d={visitorData.reduce((acc, val, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${(i / (visitorData.length - 1)) * 700} ${300 - (val / maxVisitors) * 200}`, '')} fill="none" stroke="#c5a059" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d={visitorData.reduce((acc, val, i) => `${acc} L ${(i / (visitorData.length - 1)) * 700} ${300 - (val / maxVisitors) * 200}`, 'M 0 300') + ' L 700 300 Z'} fill="url(#lineGrad)" />
              {visitorData.map((val, i) => <circle key={i} cx={(i / (visitorData.length - 1)) * 700} cy={300 - (val / maxVisitors) * 200} r="5" fill="white" stroke="#c5a059" strokeWidth="2" className="hover:r-8 transition-all cursor-pointer" />)}
            </svg>
            <div className="flex justify-between mt-6 text-[8px] uppercase tracking-[0.4em] text-zinc-300 font-bold"><span className="truncate">Prior Period</span><span className="truncate">Present Day</span></div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-10 border border-zinc-100 shadow-sm rounded-sm">
          <div className="mb-10"><h3 className="font-serif text-2xl text-zinc-900 mb-1 leading-tight">Artistic Resonance</h3><p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Vision inquiries by category</p></div>
          <div className="space-y-6">
            {servicePopularity.map((service, i) => (
              <div key={i} className="space-y-3 group">
                <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold"><span className="text-zinc-600">{service.label}</span><span className="text-champagne">{service.val} Inquiries</span></div>
                <div className="h-1.5 bg-zinc-50 overflow-hidden"><div className="h-full bg-zinc-900 group-hover:bg-champagne transition-all duration-1000 ease-out" style={{ width: `${(service.val / 45) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden rounded-sm">
        <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-zinc-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div><h3 className="font-serif text-2xl text-zinc-900 mb-1 leading-tight">Session Ledger</h3><p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold">Real-time interaction archive</p></div>
          <span className="bg-zinc-50 px-5 py-2 text-[9px] uppercase tracking-[0.1em] text-zinc-400 font-bold rounded-full">{filteredSessions.length} Events Captured</span>
        </div>
        
        {/* Responsive Table/Card Hybrid */}
        <div className="hidden lg:block">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-10 py-5 text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Timestamp</th>
                <th className="px-10 py-5 text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Resonance Point</th>
                <th className="px-10 py-5 text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Persistence</th>
                <th className="px-10 py-5 text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {paginatedSessions.map((session) => (
                <tr key={session.id} className="group hover:bg-zinc-50/50 transition-colors">
                  <td className="px-10 py-6"><div className="text-[11px] text-zinc-500 font-medium">{session.timestamp}</div><div className="text-[9px] text-zinc-300 font-light mt-1">{session.ip}</div></td>
                  <td className="px-10 py-6"><span className="px-3 py-1 bg-zinc-50 text-[9px] uppercase tracking-[0.1em] text-zinc-900 font-bold border border-zinc-100">{session.page}</span></td>
                  <td className="px-10 py-6 text-xs text-zinc-600 font-serif italic">{formatDuration(session.duration)}</td>
                  <td className="px-10 py-6"><div className="flex items-center space-x-2 text-[10px] text-zinc-400 uppercase tracking-widest"><Globe size={12} className="text-zinc-200" /><span>{session.location}</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-zinc-50">
          {paginatedSessions.map((session) => (
            <div key={session.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div><div className="text-[10px] text-zinc-500 font-bold">{session.timestamp}</div><div className="text-[8px] text-zinc-300 font-light mt-0.5">{session.ip}</div></div>
                <span className="px-3 py-1 bg-zinc-50 text-[8px] uppercase tracking-[0.1em] text-zinc-900 font-bold border border-zinc-100">{session.page}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-[10px] text-zinc-400"><Globe size={12} className="shrink-0" /><span className="truncate max-w-[120px]">{session.location}</span></div>
                <div className="flex items-center space-x-2 text-[10px] text-zinc-600 font-serif italic"><Clock size={12} className="shrink-0" /><span>{formatDuration(session.duration)}</span></div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length > 0 ? (
          <div className="px-6 sm:px-10 py-6 border-t border-zinc-50 flex items-center justify-between bg-zinc-50/10">
            <span className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Set {currentPage} of {totalPages}</span>
            <div className="flex items-center space-x-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border border-zinc-100 disabled:opacity-20 hover:bg-white transition-all rounded-sm"><ChevronLeft size={16} /></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border border-zinc-100 disabled:opacity-20 hover:bg-white transition-all rounded-sm"><ChevronRight size={16} /></button>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center"><Search className="mx-auto text-zinc-100 mb-4" size={48} /><p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">No sessions found for active filters</p></div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
