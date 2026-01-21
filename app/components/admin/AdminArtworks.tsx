
'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Save, Trash2, Plus, ImageIcon, X, Search, Edit2, ChevronLeft, ChevronRight, Upload, Loader2, Layers, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
// Fixed: Page type should be imported from types.ts
import { Page } from '../../../types';
import { Artwork } from '../../../types';
import { ConfirmationModal, CreateArtworkModal } from './AdminModals';
import { compressImage } from '../../../utils/imageUtils';
import { useGetArtworksQuery, useAddArtworkMutation, useUpdateArtworkMutation, useDeleteArtworkMutation, useGetServicesQuery } from '@/utils/services/api';

interface AdminArtworksProps {
  onNavigate: (page: Page) => void;
}

const AdminArtworks: React.FC<AdminArtworksProps> = ({ onNavigate }) => {
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Helper function to format date for display
  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      // If it's already in YYYY-MM-DD format, convert to readable format
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      }
      return dateStr; // Return as-is if not in expected format
    } catch {
      return dateStr;
    }
  };

  // RTK Query hooks
  const { data: artworksData, isLoading, error: queryError } = useGetArtworksQuery({});
  const { data: servicesData } = useGetServicesQuery({});
  const [addArtwork, { isLoading: isAdding }] = useAddArtworkMutation();
  const [updateArtwork, { isLoading: isUpdating }] = useUpdateArtworkMutation();
  const [deleteArtworkMutation] = useDeleteArtworkMutation();

  const artworks: Artwork[] = artworksData || [];
  const services = servicesData || [];

  // Set dynamic categories when services load - prioritize services
  React.useEffect(() => {
    const serviceTitles = services.map((s: any) => s.title);
    
    if (serviceTitles.length > 0) {
      // Use service titles as primary categories
      setDynamicCategories(serviceTitles);
    } else {
      // Fallback to base categories if no services exist
      const baseCategories = ['Mehndi', 'Nail Art', 'Rangoli', 'Makeup', 'Creative'];
      setDynamicCategories(baseCategories);
    }
  }, [services]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeTab === 'All' || art.category === activeTab;
      return matchesSearch && matchesCategory;
    });
  }, [artworks, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const paginatedArtworks = filteredArtworks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateField = (id: string, field: keyof Artwork, value: any) => {
    if (editingArtwork) {
      setEditingArtwork({ ...editingArtwork, [field]: value });
    }
  };

  const handleUpdateImage = (id: string, imgIndex: number, value: string) => {
    if (editingArtwork) {
      const updatedImages = [...editingArtwork.images];
      updatedImages[imgIndex] = value;
      setEditingArtwork({ ...editingArtwork, images: updatedImages });
    }
  };

  const handleFileChange = async (id: string, imgIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64);
          handleUpdateImage(id, imgIndex, optimized);
          setIsOptimizing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsOptimizing(false);
      }
    }
  };

  const handleAddImage = (id: string) => {
    if (editingArtwork) {
      setEditingArtwork({ ...editingArtwork, images: [...editingArtwork.images, ''] });
    }
  };

  const handleRemoveImage = (id: string, imgIndex: number) => {
    if (editingArtwork) {
      const updatedImages = editingArtwork.images.filter((_, i) => i !== imgIndex);
      setEditingArtwork({ ...editingArtwork, images: updatedImages.length > 0 ? updatedImages : [''] });
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteArtworkMutation(deleteId).unwrap();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        setError(err?.data?.message || 'Failed to delete artwork');
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleAdd = () => {
    setShowCreateModal(true);
  };

  const handleCreateArtwork = async (artworkData: Partial<Artwork>) => {
    try {
      setError(null);
      const newArtwork = {
        ...artworkData,
        order: artworks.length,
        active: true,
        featured: false
      };
      await addArtwork(newArtwork).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to create artwork');
      throw err;
    }
  };

  const handleSave = async () => {
    if (!editingArtwork) return;
    
    try {
      setError(null);
      
      if (editingId === 'new') {
        await addArtwork(editingArtwork).unwrap();
      } else {
        await updateArtwork({ 
          id: (editingArtwork as any)._id || editingId!, 
          ...editingArtwork 
        }).unwrap();
      }
      
      setSuccess(true);
      setEditingId(null);
      setEditingArtwork(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to save artwork');
    }
  };

  const handleEdit = (artwork: Artwork) => {
    setEditingArtwork({ ...artwork });
    setEditingId((artwork as any)._id || (artwork as any).id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingArtwork(null);
  };

  const getArtworkId = (art: Artwork) => {
    return (art as any)._id || (art as any).id;
  };

  const handleReorder = async (artId: string, direction: 'up' | 'down') => {
    const currentIndex = artworks.findIndex(art => getArtworkId(art) === artId);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= artworks.length) return;

    try {
      const currentArt = artworks[currentIndex];
      const targetArt = artworks[targetIndex];
      
      // Swap orders
      await Promise.all([
        updateArtwork({ 
          id: getArtworkId(currentArt), 
          order: targetArt.order 
        }).unwrap(),
        updateArtwork({ 
          id: getArtworkId(targetArt), 
          order: currentArt.order 
        }).unwrap()
      ]);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err?.data?.message || 'Failed to reorder artworks');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-12 animate-fade-in">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-sm text-xs">
          {error}
        </div>
      )}
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Collection Vault</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Curate the visible archives and bespoke commissions.</p>
        </div>
        <div className="flex items-center space-x-4 w-full lg:w-auto">
           {isOptimizing && <div className="flex items-center space-x-2 text-champagne text-[9px] uppercase tracking-widest font-bold"><Loader2 size={12} className="animate-spin" /><span>Optimizing Media...</span></div>}
           {isUpdating && <div className="flex items-center space-x-2 text-blue-500 text-[9px] uppercase tracking-widest font-bold"><Loader2 size={12} className="animate-spin" /><span>Saving...</span></div>}
           {success && <span className="text-green-500 text-[9px] uppercase tracking-widest font-bold">Archives Synced</span>}
           {editingId && (
             <>
               <button onClick={handleCancelEdit} disabled={isUpdating} className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-200 text-zinc-700 px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-300 transition-all shadow-lg disabled:opacity-50">
                  <span>Cancel</span>
               </button>
               <button onClick={handleSave} disabled={isOptimizing || isUpdating} className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-zinc-900 text-white px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-champagne transition-all shadow-lg disabled:opacity-50">
                  <Save size={14} /><span>Save Changes</span>
               </button>
             </>
           )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 sm:p-6 border border-zinc-100 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
            <input type="text" placeholder="Search collection..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none text-[11px] text-zinc-600 focus:ring-1 focus:ring-champagne/20 transition-all rounded-sm outline-none" />
          </div>
          <button onClick={handleAdd} className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-champagne text-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 transition-all shadow-sm">
            <Plus size={16} /><span>Add Masterpiece</span>
          </button>
        </div>
        
        {/* Category Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {['All', ...dynamicCategories].map(cat => (
            <button key={cat} onClick={() => {setActiveTab(cat); setCurrentPage(1);}} className={`px-6 py-2 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] font-bold transition-all border ${activeTab === cat ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-400 border-zinc-100 hover:border-champagne hover:text-champagne'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-zinc-100 shadow-sm overflow-hidden rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-100">
              <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Order</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Media</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Piece</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Artistic Detail</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Narrative</th>
              <th className="px-8 py-5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {paginatedArtworks.map((art, index) => {
                const artId = getArtworkId(art);
                const isEditing = editingId === artId;
                const displayArt = isEditing && editingArtwork ? editingArtwork : art;
                const globalIndex = (currentPage - 1) * itemsPerPage + index;
                return (
                <tr key={artId} className={`group hover:bg-zinc-50/50 transition-colors ${isEditing ? 'bg-champagne/5' : ''}`}>
                  <td className="px-8 py-6 align-top">
                    <div className="flex flex-col space-y-1">
                      <button 
                        onClick={() => handleReorder(artId, 'up')} 
                        disabled={globalIndex === 0}
                        className="p-1 text-zinc-300 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={() => handleReorder(artId, 'down')} 
                        disabled={globalIndex === filteredArtworks.length - 1}
                        className="p-1 text-zinc-300 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-8 py-6 align-top">
                    <div className="flex flex-wrap gap-2">
                      {displayArt.images.map((img, i) => (
                        <div key={i} className="relative w-10 h-10 bg-zinc-50 overflow-hidden border border-zinc-100 group/thumb">
                          {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-100"><ImageIcon size={14} /></div>}
                          {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                              <button onClick={() => fileInputRefs.current[`${artId}-${i}`]?.click()} className="p-1 text-white hover:text-champagne"><Upload size={10} /></button>
                              {displayArt.images.length > 1 && <button onClick={() => handleRemoveImage(artId, i)} className="p-1 text-white hover:text-red-400"><X size={10} /></button>}
                              <input type="file" ref={el => { fileInputRefs.current[`${artId}-${i}`] = el; }} onChange={(e) => handleFileChange(artId, i, e)} className="hidden" accept="image/*" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button onClick={() => handleAddImage(artId)} className="w-10 h-10 border border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 hover:text-champagne hover:border-champagne transition-colors">
                          <Plus size={12} />
                        </button>
                      )}
                      {!editingId && displayArt.images.length > 3 && (
                        <div className="w-10 h-10 flex items-center justify-center text-[8px] text-zinc-300 font-bold uppercase tracking-tighter">+{displayArt.images.length - 3}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 align-top">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input type="text" value={displayArt.title} onChange={(e) => handleUpdateField(artId, 'title', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-sm font-serif text-zinc-900 focus:outline-none" placeholder="Title" />
                        <select value={displayArt.category} onChange={(e) => handleUpdateField(artId, 'category', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-[10px] uppercase tracking-widest text-champagne font-bold focus:outline-none appearance-none">
                          {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="font-serif text-lg text-zinc-900 leading-tight truncate">{displayArt.title}</div>
                        <div className="text-[9px] uppercase tracking-widest text-champagne font-bold">{displayArt.category}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 align-top text-xs">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input type="text" value={displayArt.medium} onChange={(e) => handleUpdateField(artId, 'medium', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-[10px] text-zinc-500 focus:outline-none" placeholder="Medium" />
                        <input type="date" value={displayArt.date} onChange={(e) => handleUpdateField(artId, 'date', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-[10px] text-zinc-400 focus:outline-none" />
                        <input type="text" value={displayArt.context} onChange={(e) => handleUpdateField(artId, 'context', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-[10px] text-zinc-300 italic focus:outline-none" placeholder="Context" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={displayArt.price || ''} onChange={(e) => handleUpdateField(artId, 'price', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-[10px] text-zinc-500 focus:outline-none" placeholder="Price" />
                          <select value={displayArt.currency || 'INR'} onChange={(e) => handleUpdateField(artId, 'currency', e.target.value)} className="w-full bg-white border-b border-champagne py-1 text-[10px] text-zinc-500 focus:outline-none appearance-none">
                            <option value="INR">₹</option>
                            <option value="USD">$</option>
                            <option value="EUR">€</option>
                            <option value="GBP">£</option>
                            <option value="AED">د.إ</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-zinc-600 font-medium">
                          <span className="shrink-0">{displayArt.medium}</span>
                          <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                          <span className="text-zinc-400">{formatDateForDisplay(displayArt.date)}</span>
                        </div>
                        <div className="text-[10px] text-zinc-300 italic leading-none">{displayArt.context}</div>
                        {displayArt.price && (
                          <div className="text-[10px] text-zinc-500 font-medium">
                            {displayArt.currency === 'INR' && '₹'}
                            {displayArt.currency === 'USD' && '$'}
                            {displayArt.currency === 'EUR' && '€'}
                            {displayArt.currency === 'GBP' && '£'}
                            {displayArt.currency === 'AED' && 'د.إ'}
                            {displayArt.price}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 align-top">
                     {isEditing ? (
                       <textarea value={displayArt.description} onChange={(e) => handleUpdateField(artId, 'description', e.target.value)} className="w-full bg-white border border-champagne/10 p-3 text-xs text-zinc-500 font-light resize-none focus:outline-none rounded-sm shadow-inner" rows={3} placeholder="Narrative description..." />
                     ) : (
                       <span className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-3 italic">"{displayArt.description}"</span>
                     )}
                  </td>
                  <td className="px-8 py-6 align-top text-right space-x-2">
                    <button onClick={() => isEditing ? handleSave() : handleEdit(art)} disabled={isUpdating} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors disabled:opacity-50">
                      {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                    </button>
                    <button onClick={() => setDeleteId(artId)} className="p-2 text-zinc-200 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-6">
        {paginatedArtworks.map((art, index) => {
          const artId = getArtworkId(art);
          const isEditing = editingId === artId;
          const displayArt = isEditing && editingArtwork ? editingArtwork : art;
          const globalIndex = (currentPage - 1) * itemsPerPage + index;
          return (
          <div key={artId} className={`bg-white border p-6 shadow-sm space-y-6 transition-all ${isEditing ? 'border-champagne/40' : 'border-zinc-100'}`}>
            {/* Order Controls - Mobile */}
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Display Order</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleReorder(artId, 'up')} 
                  disabled={globalIndex === 0}
                  className="p-2 text-zinc-300 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-zinc-100 rounded-sm"
                >
                  <ChevronUp size={16} />
                </button>
                <button 
                  onClick={() => handleReorder(artId, 'down')} 
                  disabled={globalIndex === filteredArtworks.length - 1}
                  className="p-2 text-zinc-300 hover:text-zinc-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-zinc-100 rounded-sm"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2 shrink-0">
                {displayArt.images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 sm:w-24 sm:h-24 bg-zinc-50 border border-zinc-100 shrink-0 group">
                    {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-100"><ImageIcon size={32} /></div>}
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <button onClick={() => fileInputRefs.current[`${artId}-${i}`]?.click()} className="p-2 text-white hover:text-champagne"><Upload size={16} /></button>
                        {displayArt.images.length > 1 && <button onClick={() => handleRemoveImage(artId, i)} className="p-2 text-white hover:text-red-400"><X size={16} /></button>}
                        <input type="file" ref={el => { fileInputRefs.current[`${artId}-${i}`] = el; }} onChange={(e) => handleFileChange(artId, i, e)} className="hidden" accept="image/*" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button onClick={() => handleAddImage(artId)} className="w-20 h-20 sm:w-24 sm:h-24 border border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 hover:text-champagne hover:border-champagne transition-colors shrink-0">
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Title and Category */}
              <div className="space-y-3">
                <div>
                  <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-300 font-bold block mb-2">Piece Title</label>
                  {isEditing ? (
                    <input type="text" value={displayArt.title} onChange={(e) => handleUpdateField(artId, 'title', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-sm font-serif text-zinc-900 focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none" />
                  ) : (
                    <h4 className="font-serif text-xl text-zinc-900 leading-tight">{displayArt.title}</h4>
                  )}
                </div>
                
                <div>
                  <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-300 font-bold block mb-2">Category</label>
                  {isEditing ? (
                    <select value={displayArt.category} onChange={(e) => handleUpdateField(artId, 'category', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-[10px] uppercase tracking-widest text-champagne font-bold focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none">
                      {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-champagne font-bold block">{displayArt.category}</span>
                  )}
                </div>
              </div>

              {/* Artistic Details */}
              <div className="space-y-3">
                <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-300 font-bold block">Artistic Details</label>
                {isEditing ? (
                  <div className="space-y-2">
                    <input type="text" value={displayArt.medium} onChange={(e) => handleUpdateField(artId, 'medium', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none" placeholder="Medium" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={displayArt.date} onChange={(e) => handleUpdateField(artId, 'date', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none" />
                      <input type="text" value={displayArt.context} onChange={(e) => handleUpdateField(artId, 'context', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none" placeholder="Context" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" value={displayArt.price || ''} onChange={(e) => handleUpdateField(artId, 'price', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none" placeholder="Price" />
                      <select value={displayArt.currency || 'INR'} onChange={(e) => handleUpdateField(artId, 'currency', e.target.value)} className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-600 focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none">
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 font-medium leading-relaxed">
                    <span className="font-semibold">{displayArt.medium}</span> • {formatDateForDisplay(displayArt.date)}<br />
                    <span className="text-zinc-400 italic text-[10px]">{displayArt.context}</span>
                    {displayArt.price && (
                      <>
                        <br />
                        <span className="text-zinc-600 font-bold text-xs">
                          {displayArt.currency === 'INR' && '₹'}
                          {displayArt.currency === 'USD' && '$'}
                          {displayArt.currency === 'EUR' && '€'}
                          {displayArt.currency === 'GBP' && '£'}
                          {displayArt.currency === 'AED' && 'د.إ'}
                          {displayArt.price}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Narrative Description */}
              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-300 font-bold">Narrative Brief</label>
                {isEditing ? (
                  <textarea value={displayArt.description} onChange={(e) => handleUpdateField(artId, 'description', e.target.value)} className="w-full bg-zinc-50 border-none px-4 py-3 text-xs text-zinc-500 font-light leading-relaxed focus:ring-1 focus:ring-champagne/20 rounded-sm outline-none resize-none" rows={4} />
                ) : (
                  <p className="text-xs text-zinc-400 font-light leading-relaxed italic border-l border-zinc-50 pl-4">"{displayArt.description}"</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 border-t border-zinc-50 pt-4">
                {isEditing ? (
                  <>
                    <button onClick={handleSave} disabled={isUpdating} className="px-6 py-2 bg-champagne text-[10px] uppercase tracking-[0.2em] text-white font-bold hover:bg-champagne/90 transition-all rounded-sm disabled:opacity-50">
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={handleCancelEdit} className="px-6 py-2 bg-zinc-100 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold hover:bg-zinc-200 transition-all rounded-sm">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(art)} className="px-6 py-2 bg-zinc-50 text-[10px] uppercase tracking-[0.2em] text-zinc-900 font-bold hover:bg-champagne hover:text-white transition-all rounded-sm">
                    Edit Detail
                  </button>
                )}
                <button onClick={() => setDeleteId(artId)} className="p-2 text-zinc-200 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
        </div>

      {/* Pagination Controls */}
      {filteredArtworks.length > 0 && (
        <div className="px-6 py-6 flex items-center justify-between bg-white/50 border border-zinc-100 rounded-sm shadow-sm">
          <span className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold">Set {currentPage} of {totalPages}</span>
          <div className="flex items-center space-x-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-all rounded-sm"><ChevronLeft size={16} /></button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 border border-zinc-100 disabled:opacity-30 hover:bg-zinc-50 transition-all rounded-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredArtworks.length === 0 && (
        <div className="py-24 text-center bg-white border border-zinc-100 rounded-sm shadow-sm flex flex-col items-center">
          <ImageIcon size={48} className="text-zinc-100 mb-6" />
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">No pieces found in active vault</p>
          <button onClick={() => {setActiveTab('All'); setSearchQuery('');}} className="mt-6 text-[9px] text-champagne uppercase tracking-widest font-bold hover:text-zinc-900 transition-colors">Clear All Filters</button>
        </div>
      )}

      <ConfirmationModal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} title="Purge Record" message="Permanently destroy this masterpiece from the Diptika Art Studio archives? This cannot be undone." confirmText="Purge Record" confirmVariant="danger" icon={<Trash2 size={32} />} />
      
      <CreateArtworkModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
        onSubmit={handleCreateArtwork}
        categories={dynamicCategories}
      />
    </div>
  );
};

export default AdminArtworks;
