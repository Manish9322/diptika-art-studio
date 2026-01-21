
'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Save, Trash2, Plus, Search, Edit2, ChevronLeft, ChevronRight, Upload, Image as ImageIcon, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
// Fixed: Page type should be imported from types.ts
import { Page } from '../../../types';
import { Service } from '../../../types';
import { ConfirmationModal, CreateServiceModal } from './AdminModals';
import { compressImage } from '../../../utils/imageUtils';
import { useGetServicesQuery, useAddServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from '@/utils/services/api';

interface AdminServicesProps {
  onNavigate: (page: Page) => void;
}

const AdminServices: React.FC<AdminServicesProps> = ({ onNavigate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // RTK Query hooks
  const { data: servicesData, isLoading, error: queryError, refetch } = useGetServicesQuery({});
  const [addService] = useAddServiceMutation();
  const [updateService, { isLoading: isSaving }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const services: Service[] = servicesData || [];

  const filteredServices = useMemo(() => {
    return services.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateService = (indexInPaginated: number, field: keyof Service, value: string) => {
    if (editingService) {
      setEditingService({ ...editingService, [field]: value });
    }
  };

  const handleFileChange = async (indexInPaginated: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingService) {
      setIsOptimizing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64);
          setEditingService({ ...editingService, image: optimized });
          setIsOptimizing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsOptimizing(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      try {
        const absoluteIndex = (currentPage - 1) * itemsPerPage + deleteIndex;
        const serviceToDelete = filteredServices[absoluteIndex];
        
        if ((serviceToDelete as any)._id) {
          await deleteService((serviceToDelete as any)._id).unwrap();
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      } catch (err: any) {
        console.error('Error deleting service:', err);
        setError(err?.data?.message || 'Failed to delete service. Please try again.');
      } finally {
        setDeleteIndex(null);
      }
    }
  };

  const handleAdd = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateService = async (newService: Service) => {
    try {
      setError(null);
      
      // Set order to be at the end
      const maxOrder = services.length > 0 
        ? Math.max(...services.map(s => (s as any).order || 0)) 
        : -1;
      
      const serviceWithOrder = {
        ...newService,
        order: maxOrder + 1
      };
      
      await addService(serviceWithOrder).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error creating service:', err);
      throw new Error(err?.data?.message || 'Failed to create service');
    }
  };

  const handleEdit = (index: number) => {
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    const serviceToEdit = filteredServices[absoluteIndex];
    setEditingService({ ...serviceToEdit });
    setEditingIndex(index);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingService(null);
  };

  const handleSave = async () => {
    if (!editingService) return;
    
    try {
      setError(null);
      
      await updateService({ 
        id: (editingService as any)._id, 
        ...editingService 
      }).unwrap();
      
      setSuccess(true);
      setEditingIndex(null);
      setEditingService(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving service:', err);
      setError(err?.data?.message || 'Failed to save service. Please try again.');
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (editingIndex !== null) return; // Don't allow reorder while editing
    
    const absoluteIndex = (currentPage - 1) * itemsPerPage + index;
    const currentService = filteredServices[absoluteIndex];
    const targetIndex = direction === 'up' ? absoluteIndex - 1 : absoluteIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= filteredServices.length) return;
    
    const targetService = filteredServices[targetIndex];
    
    try {
      setError(null);
      
      // Swap order values
      const currentOrder = (currentService as any).order || absoluteIndex;
      const targetOrder = (targetService as any).order || targetIndex;
      
      // Update both services
      await Promise.all([
        updateService({ 
          id: (currentService as any)._id, 
          ...currentService, 
          order: targetOrder 
        }).unwrap(),
        updateService({ 
          id: (targetService as any)._id, 
          ...targetService, 
          order: currentOrder 
        }).unwrap()
      ]);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      console.error('Error reordering services:', err);
      setError(err?.data?.message || 'Failed to reorder services. Please try again.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12 animate-fade-in">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-sm text-xs">
          {error}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Service Registry</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Manage the bespoke professional catalog. Use ↑↓ arrows to reorder.</p>
        </div>
        <div className="flex items-center space-x-4 w-full lg:w-auto">
           {isOptimizing && <div className="flex items-center space-x-2 text-champagne text-[9px] uppercase tracking-widest font-bold"><Loader2 size={12} className="animate-spin" /><span>Optimizing Media...</span></div>}
           {isSaving && <div className="flex items-center space-x-2 text-blue-500 text-[9px] uppercase tracking-widest font-bold"><Loader2 size={12} className="animate-spin" /><span>Saving...</span></div>}
           {success && <span className="text-green-500 text-[9px] uppercase tracking-widest font-bold">Changes Committed</span>}
           {editingIndex !== null && (
             <>
               <button onClick={handleCancelEdit} disabled={isSaving} className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-200 text-zinc-700 px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-300 transition-all shadow-lg disabled:opacity-50">
                  <span>Cancel</span>
               </button>
               <button onClick={handleSave} disabled={isOptimizing || isSaving} className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-900 text-white px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-champagne transition-all shadow-lg disabled:opacity-50">
                  <Save size={14} /><span>Save Changes</span>
               </button>
             </>
           )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 sm:p-6 border border-zinc-100 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
          <input type="text" placeholder="Search registry..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 transition-all rounded-sm outline-none" />
        </div>
        <button onClick={handleAdd} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-champagne text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 transition-all shadow-sm">
          <Plus size={16} /><span>New Offering</span>
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white border border-zinc-100 shadow-sm overflow-hidden rounded-sm">
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 size={48} className="mx-auto text-champagne mb-6 animate-spin" />
            <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">Loading services...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Order</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Media</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Identity</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Baseline Price</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Brief</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {paginatedServices.map((service, idx) => {
                const isEditing = editingIndex === idx && editingService;
                const displayService = isEditing ? editingService : service;
                
                return (
                  <tr key={(service as any)._id || idx} className={`group hover:bg-zinc-50/50 transition-colors ${isEditing ? 'bg-champagne/5' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex flex-col items-center space-y-1">
                        <button 
                          onClick={() => handleReorder(idx, 'up')} 
                          disabled={idx === 0 || editingIndex !== null}
                          className="p-1 text-zinc-300 hover:text-zinc-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <span className="text-[10px] text-zinc-400 font-bold">{(currentPage - 1) * itemsPerPage + idx + 1}</span>
                        <button 
                          onClick={() => handleReorder(idx, 'down')} 
                          disabled={idx === paginatedServices.length - 1 || editingIndex !== null}
                          className="p-1 text-zinc-300 hover:text-zinc-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="relative w-12 h-12 bg-zinc-50 overflow-hidden group/thumb border border-zinc-100">
                        {displayService.image ? <img src={displayService.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-100"><ImageIcon size={24} /></div>}
                        {isEditing && <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer"><Upload size={14} className="text-white" /></div>}
                        <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(idx, e)} className="hidden" accept="image/*" />
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {isEditing ? <input type="text" value={displayService.title} onChange={(e) => handleUpdateService(idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-champagne text-sm font-serif text-zinc-900 focus:outline-none" /> : <span className="font-serif text-lg text-zinc-900 font-medium">{displayService.title}</span>}
                    </td>
                    <td className="px-8 py-6">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <select 
                            value={displayService.currency || 'INR'} 
                            onChange={(e) => handleUpdateService(idx, 'currency', e.target.value)} 
                            className="w-20 bg-transparent border-b border-champagne text-xs text-zinc-600 focus:outline-none appearance-none"
                          >
                            <option value="INR">₹</option>
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="GBP">£</option>
                            <option value="AED">د.إ</option>
                          </select>
                          <input 
                            type="text" 
                            value={displayService.priceStart} 
                            onChange={(e) => handleUpdateService(idx, 'priceStart', e.target.value)} 
                            className="flex-1 bg-transparent border-b border-champagne text-sm text-zinc-600 focus:outline-none" 
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-500 font-bold">
                          {displayService.currency === 'INR' && '₹'}
                          {displayService.currency === 'USD' && '$'}
                          {displayService.currency === 'EUR' && '€'}
                          {displayService.currency === 'GBP' && '£'}
                          {displayService.currency === 'AED' && 'د.إ'}
                          {!displayService.currency && '₹'}
                          {displayService.priceStart}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                       {isEditing ? <textarea value={displayService.description} onChange={(e) => handleUpdateService(idx, 'description', e.target.value)} className="w-full bg-transparent border-b border-champagne text-xs text-zinc-400 focus:outline-none resize-none" rows={2} /> : <span className="text-xs text-zinc-400 font-light leading-relaxed truncate max-w-xs block">{displayService.description}</span>}
                    </td>
                    <td className="px-8 py-6 text-right space-x-3">
                      <button onClick={() => isEditing ? handleSave() : handleEdit(idx)} disabled={isSaving} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors disabled:opacity-50">{isEditing ? <Save size={16} /> : <Edit2 size={16} />}</button>
                      <button onClick={() => setDeleteIndex(idx)} className="p-2 text-zinc-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-6">
        {isLoading ? (
          <div className="py-24 text-center bg-white border border-zinc-100 rounded-sm">
            <Loader2 size={48} className="mx-auto text-champagne mb-6 animate-spin" />
            <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">Loading services...</p>
          </div>
        ) : (
          paginatedServices.map((service, idx) => {
            const isEditing = editingIndex === idx && editingService;
            const displayService = isEditing ? editingService : service;
            
            return (
              <div key={(service as any)._id || idx} className={`bg-white border p-6 shadow-sm space-y-6 transition-all ${isEditing ? 'border-champagne/40' : 'border-zinc-100'}`}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center space-y-2 shrink-0">
                    <button 
                      onClick={() => handleReorder(idx, 'up')} 
                      disabled={idx === 0 || editingIndex !== null}
                      className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed border border-zinc-100 rounded-sm"
                      title="Move up"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <span className="text-[10px] text-zinc-400 font-bold">{(currentPage - 1) * itemsPerPage + idx + 1}</span>
                    <button 
                      onClick={() => handleReorder(idx, 'down')} 
                      disabled={idx === paginatedServices.length - 1 || editingIndex !== null}
                      className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors disabled:opacity-20 disabled:cursor-not-allowed border border-zinc-100 rounded-sm"
                      title="Move down"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-zinc-50 border border-zinc-100 overflow-hidden shrink-0 group">
                    {displayService.image ? <img src={displayService.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-100"><ImageIcon size={32} /></div>}
                    {isEditing && <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity cursor-pointer"><Upload size={16} className="text-white" /></div>}
                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(idx, e)} className="hidden" accept="image/*" />
                  </div>
                  <div className="flex-1 space-y-2">
                    {isEditing ? (
                      <>
                        <input type="text" value={displayService.title} onChange={(e) => handleUpdateService(idx, 'title', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-sm font-serif text-zinc-900 focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm" />
                        <div className="grid grid-cols-2 gap-2">
                          <select 
                            value={displayService.currency || 'INR'} 
                            onChange={(e) => handleUpdateService(idx, 'currency', e.target.value)} 
                            className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-500 focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="AED">AED (د.إ)</option>
                          </select>
                          <input 
                            type="text" 
                            value={displayService.priceStart} 
                            onChange={(e) => handleUpdateService(idx, 'priceStart', e.target.value)} 
                            className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-500 font-bold focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm" 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-serif text-xl text-zinc-900 leading-tight">{displayService.title}</h4>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-bold block">
                          Starting {displayService.currency === 'INR' && '₹'}
                          {displayService.currency === 'USD' && '$'}
                          {displayService.currency === 'EUR' && '€'}
                          {displayService.currency === 'GBP' && '£'}
                          {displayService.currency === 'AED' && 'د.إ'}
                          {!displayService.currency && '₹'}
                          {displayService.priceStart}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Experience Brief</label>
                  {isEditing ? <textarea value={displayService.description} onChange={(e) => handleUpdateService(idx, 'description', e.target.value)} className="w-full bg-zinc-50 border-none px-4 py-3 text-xs text-zinc-500 font-light leading-relaxed focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm" rows={4} /> : <p className="text-xs text-zinc-400 font-light leading-relaxed italic border-l border-zinc-50 pl-4">"{displayService.description}"</p>}
                </div>

                <div className="flex items-center justify-end space-x-4 border-t border-zinc-50 pt-4">
                  <button onClick={() => isEditing ? handleSave() : handleEdit(idx)} disabled={isSaving} className="px-6 py-2 bg-zinc-50 text-[10px] uppercase tracking-[0.2em] text-zinc-900 font-bold hover:bg-champagne hover:text-white transition-all rounded-sm disabled:opacity-50">{isEditing ? 'Save' : 'Edit Detail'}</button>
                  <button onClick={() => setDeleteIndex(idx)} className="p-2 text-zinc-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {filteredServices.length === 0 ? (
        <div className="py-24 text-center bg-white border border-zinc-100 rounded-sm">
          <ImageIcon size={48} className="mx-auto text-zinc-100 mb-6" />
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">No services in registry</p>
        </div>
      ) : (
        <div className="px-6 py-6 border-t border-zinc-50 flex items-center justify-between bg-white/50">
          <span className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Set {currentPage} of {totalPages}</span>
          <div className="flex items-center space-x-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-all rounded-sm"><ChevronLeft size={16} /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-all rounded-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <ConfirmationModal isOpen={deleteIndex !== null} onClose={() => setDeleteIndex(null)} onConfirm={confirmDelete} title="Purge Offering" message="Are you sure you wish to permanently remove this service offering?" confirmText="Purge Offering" confirmVariant="danger" icon={<Trash2 size={32} />} />
      
      <CreateServiceModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSave={handleCreateService} 
      />
    </div>
  );
};

export default AdminServices;
