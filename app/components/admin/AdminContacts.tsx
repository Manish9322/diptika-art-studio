
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Phone, Calendar, Trash2, Search, X, MessageSquare, Clock, Filter, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { ContactRequest } from '../../../types';
import { ConfirmationModal } from './AdminModals';

const AdminContacts: React.FC = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/contacts');
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Get unique services from requests
  const uniqueServices = useMemo(() => {
    const services = new Set(requests.map(r => r.service));
    return Array.from(services).sort();
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      // Search filter
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      
      // Service filter
      const matchesService = serviceFilter === 'all' || r.service === serviceFilter;
      
      return matchesSearch && matchesStatus && matchesService;
    });
  }, [requests, searchQuery, statusFilter, serviceFilter]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const response = await fetch(`/api/contacts?id=${deleteId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
          setRequests(requests.filter(r => r.id !== deleteId));
        } else {
          console.error('Failed to delete contact:', data.error);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
      } finally {
        setDeleteId(null);
      }
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: 'read' }),
      });

      const data = await response.json();

      if (data.success) {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'read' as const } : r));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const openRequest = (req: ContactRequest) => {
    setSelectedRequest(req);
    if (req.status === 'new') {
      markAsRead(req.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-champagne mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-zinc-400">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Studio Inquiries</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Manage client engagement and private session requests.</p>
        </div>
        <div className="bg-white border border-zinc-100 px-4 sm:px-6 py-4 flex items-center justify-around sm:justify-start space-x-6 shadow-sm w-full lg:w-auto">
           <div className="text-center border-r border-zinc-50 pr-6 flex-1 sm:flex-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block mb-1">Total</span>
              <span className="font-serif text-xl sm:text-2xl text-zinc-900">{filteredRequests.length}</span>
           </div>
           <div className="text-center border-r border-zinc-50 pr-6 flex-1 sm:flex-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-bold block mb-1">New</span>
              <span className="font-serif text-xl sm:text-2xl text-champagne">{filteredRequests.filter(r => r.status === 'new').length}</span>
           </div>
           <div className="text-center flex-1 sm:flex-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block mb-1">Read</span>
              <span className="font-serif text-xl sm:text-2xl text-zinc-600">{filteredRequests.filter(r => r.status === 'read').length}</span>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 sm:p-6 border border-zinc-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
          <input 
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 transition-all rounded-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'all' | 'new' | 'read' | 'archived');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-zinc-50 border-none text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 transition-all rounded-sm cursor-pointer font-medium uppercase tracking-wider"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-zinc-50 border-none text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 transition-all rounded-sm cursor-pointer font-medium"
          >
            <option value="all">All Services</option>
            {uniqueServices.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {(statusFilter !== 'all' || serviceFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setServiceFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-zinc-400 hover:text-champagne transition-colors flex items-center gap-2"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-zinc-100 shadow-sm overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Status</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Inquirer</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Service</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Event Date</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {paginatedRequests.map((req) => (
                <tr key={req.id} className={`group hover:bg-zinc-50/50 transition-colors cursor-pointer ${req.status === 'new' ? 'bg-champagne/5' : ''}`} onClick={() => openRequest(req)}>
                  <td className="px-8 py-6">
                    {req.status === 'new' ? (
                      <span className="px-3 py-1 bg-champagne text-white text-[8px] uppercase tracking-[0.2em] font-bold rounded-full">New</span>
                    ) : (
                      <span className="px-3 py-1 bg-zinc-100 text-zinc-400 text-[8px] uppercase tracking-[0.2em] font-bold rounded-full">Read</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-serif text-zinc-900 font-medium">{req.name}</div>
                    <div className="text-[10px] text-zinc-400 font-light mt-0.5">{req.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-zinc-600 font-medium">{req.service}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 text-zinc-400">
                      <Calendar size={12} />
                      <span className="text-xs">{req.eventDate}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(req.id);
                      }}
                      className="p-2 text-zinc-200 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedRequests.map((req) => (
          <div 
            key={req.id} 
            onClick={() => openRequest(req)}
            className={`bg-white border p-6 shadow-sm relative group ${req.status === 'new' ? 'border-champagne/30' : 'border-zinc-100'}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <h4 className="font-serif text-lg text-zinc-900 leading-tight">{req.name}</h4>
                <div className="text-[10px] uppercase tracking-[0.1em] text-champagne font-bold">{req.service}</div>
              </div>
              {req.status === 'new' && (
                <span className="w-2 h-2 bg-champagne rounded-full animate-pulse shadow-[0_0_8px_#c5a059]" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-zinc-400 text-[10px] font-medium mb-6">
              <div className="flex items-center space-x-2">
                <Calendar size={12} className="shrink-0" />
                <span>{req.eventDate}</span>
              </div>
              <div className="flex items-center space-x-2 justify-end">
                <Clock size={12} className="shrink-0" />
                <span>{new Date(req.timestamp).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-50 pt-4">
               <span className="text-[9px] text-zinc-300 font-light truncate max-w-[150px]">{req.email}</span>
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(req.id);
                }}
                className="p-2 text-zinc-200 hover:text-red-500 transition-colors"
               >
                 <Trash2 size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="py-24 text-center bg-white border border-zinc-100 rounded-sm">
          <MessageSquare size={48} className="mx-auto text-zinc-100 mb-6" />
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">No active inquiries found</p>
        </div>
      ) : (
        <div className="px-6 py-6 border-t border-zinc-50 flex items-center justify-between bg-white/50">
          <span className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold">
            Set {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-all rounded-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-all rounded-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative bg-white w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedRequest(null)} className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors z-10"><X size={20} /></button>
            <div className="p-6 sm:p-12 space-y-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.5em] text-champagne block mb-2 font-bold">Vision Inquiry</span>
                <h3 className="font-serif text-2xl sm:text-4xl text-zinc-900 leading-tight">{selectedRequest.name}</h3>
                <p className="text-[9px] text-zinc-300 uppercase tracking-widest mt-2">{selectedRequest.timestamp}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-y border-zinc-50 py-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-zinc-600"><Mail size={16} className="text-champagne shrink-0" /><span className="text-xs break-all">{selectedRequest.email}</span></div>
                  <div className="flex items-center space-x-3 text-zinc-600"><Phone size={16} className="text-champagne shrink-0" /><span className="text-xs">{selectedRequest.phone}</span></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-zinc-600"><MessageSquare size={16} className="text-champagne shrink-0" /><span className="text-xs font-medium">{selectedRequest.service}</span></div>
                  <div className="flex items-center space-x-3 text-zinc-600"><Calendar size={16} className="text-champagne shrink-0" /><span className="text-xs">{selectedRequest.eventDate}</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Narrative Description</label>
                <div className="bg-zinc-50 p-6 text-sm text-zinc-600 leading-relaxed font-light italic border-l-2 border-champagne/20">"{selectedRequest.message}"</div>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a href={`mailto:${selectedRequest.email}`} className="w-full text-center bg-zinc-900 text-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-champagne transition-all shadow-lg">Respond via Email</a>
                <button onClick={() => setSelectedRequest(null)} className="w-full text-center border border-zinc-100 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-50 transition-all">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Purge Record" message="Permanently destroy this client vision inquiry? This action is irreversible." confirmText="Purge Record" confirmVariant="danger" icon={<Trash2 size={32} />} />
    </div>
  );
};

export default AdminContacts;
