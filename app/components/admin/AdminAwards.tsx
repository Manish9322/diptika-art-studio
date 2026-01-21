
'use client';

import React, { useState, useRef } from 'react';
import { Save, Trash2, Plus, Upload, Edit2, Loader2, Award as AwardIcon, Trophy } from 'lucide-react';
import { Award } from '../../../types';
import { ConfirmationModal } from './AdminModals';
import { compressImage } from '../../../utils/imageUtils';
import { useGetAwardsQuery, useAddAwardMutation, useUpdateAwardMutation, useDeleteAwardMutation } from '@/utils/services/api';

const AdminAwards: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query hooks
  const { data: awardsData, isLoading } = useGetAwardsQuery({});
  const [addAward] = useAddAwardMutation();
  const [updateAward, { isLoading: isUpdating }] = useUpdateAwardMutation();
  const [deleteAwardMutation] = useDeleteAwardMutation();

  const awards: Award[] = awardsData || [];

  const getAwardId = (award: Award): string => {
    return (award as any)._id || award.id || '';
  };

  const handleEdit = (award: Award) => {
    const id = getAwardId(award);
    setEditingId(id);
    setEditingAward({ ...award });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingAward(null);
  };

  const handleSave = async () => {
    if (!editingAward) return;

    try {
      const id = getAwardId(editingAward);
      const { _id, ...awardData } = editingAward as any;
      await updateAward({ id, ...awardData }).unwrap();
      setSuccess(true);
      setEditingId(null);
      setEditingAward(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating award:', err);
      setError(err?.data?.message || 'Failed to update award');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdate = (field: keyof Award, value: string | number) => {
    if (editingAward) {
      setEditingAward({ ...editingAward, [field]: value });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingAward) {
      setIsOptimizing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64, 600, 0.8);
          handleUpdate('image', optimized);
          setIsOptimizing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsOptimizing(false);
        setError('Failed to process image');
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleAddAward = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const newAward = {
        title: 'New Award',
        organization: 'Awarding Organization',
        year: currentYear,
        description: 'Brief description of the award...',
        category: 'Excellence',
        image: ''
      };
      
      const result = await addAward(newAward).unwrap();
      const id = (result as any)._id || (result as any).id;
      setEditingId(id);
      setEditingAward(result);
    } catch (err: any) {
      console.error('Error adding award:', err);
      setError(err?.data?.message || 'Failed to add award');
      setTimeout(() => setError(null), 5000);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteAwardMutation(deleteId).unwrap();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        console.error('Error deleting award:', err);
        setError(err?.data?.message || 'Failed to delete award');
        setTimeout(() => setError(null), 5000);
      } finally {
        setDeleteId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={48} className="mx-auto text-champagne mb-6 animate-spin" />
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">Loading awards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Industry Awards</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Manage your professional accolades and recognitions.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {success && <span className="text-green-500 text-[9px] uppercase tracking-[0.1em] font-bold">Changes Saved</span>}
          {error && <span className="text-red-500 text-[9px] uppercase tracking-[0.1em] font-bold">{error}</span>}
        </div>
      </div>

      <div className="flex justify-center sm:justify-end">
        <button 
          onClick={handleAddAward}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-champagne text-white px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 transition-all shadow-sm"
        >
          <Plus size={14} />
          <span>New Award</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {awards.map((award) => {
          const awardId = getAwardId(award);
          const isEditing = editingId === awardId;
          const displayAward = isEditing && editingAward ? editingAward : award;
          
          return (
            <div key={awardId} className={`bg-white border p-6 sm:p-8 shadow-sm transition-all group flex flex-col ${isEditing ? 'border-champagne ring-1 ring-champagne/10' : 'border-zinc-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-zinc-50 border border-zinc-100">
                  {displayAward.image ? (
                    <img src={displayAward.image} className="w-full h-full object-cover" alt={displayAward.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200"><Trophy size={24} /></div>
                  )}
                  {isEditing && (
                    <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={14} className="text-white" />
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>
                <div className="flex space-x-1 sm:space-x-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave} disabled={isUpdating} className="p-2 text-green-500 hover:text-green-700 transition-colors disabled:opacity-50"><Save size={14} /></button>
                      <button onClick={handleCancelEdit} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors">✕</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(award)} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors"><Edit2 size={14} /></button>
                  )}
                  <button onClick={() => setDeleteId(awardId)} className="p-2 text-zinc-200 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Award Title</label>
                      <input 
                        type="text" 
                        value={displayAward.title} 
                        onChange={(e) => handleUpdate('title', e.target.value)}
                        className="w-full bg-zinc-50 border-none px-3 py-2 text-sm font-serif focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                        placeholder="Award Title"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Organization</label>
                      <input 
                        type="text" 
                        value={displayAward.organization} 
                        onChange={(e) => handleUpdate('organization', e.target.value)}
                        className="w-full bg-zinc-50 border-none px-3 py-2 text-xs focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                        placeholder="Awarding Organization"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Year</label>
                        <input 
                          type="number" 
                          value={displayAward.year} 
                          onChange={(e) => handleUpdate('year', parseInt(e.target.value))}
                          className="w-full bg-zinc-50 border-none px-3 py-2 text-xs focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                          placeholder="2024"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Category</label>
                        <input 
                          type="text" 
                          value={displayAward.category || ''} 
                          onChange={(e) => handleUpdate('category', e.target.value)}
                          className="w-full bg-zinc-50 border-none px-3 py-2 text-xs focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                          placeholder="Category"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Description</label>
                      <textarea 
                        value={displayAward.description || ''} 
                        onChange={(e) => handleUpdate('description', e.target.value)}
                        className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-500 leading-relaxed resize-none outline-none rounded-sm"
                        rows={3}
                        placeholder="Brief description..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-xl text-zinc-900 leading-tight flex-1">{displayAward.title}</h4>
                      <span className="text-champagne font-bold text-sm">{displayAward.year}</span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">{displayAward.organization}</p>
                    {displayAward.category && (
                      <div className="inline-block px-3 py-1 bg-champagne/10 text-champagne text-[9px] uppercase tracking-wider font-bold rounded-sm">
                        {displayAward.category}
                      </div>
                    )}
                    {displayAward.description && (
                      <div className="text-zinc-500 font-light text-xs leading-relaxed border-l-2 border-champagne/10 pl-4 py-2 flex-1">
                        {displayAward.description}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {awards.length === 0 && !isLoading && (
        <div className="text-center py-24 bg-white border border-zinc-100 rounded-sm">
          <AwardIcon size={48} className="mx-auto text-zinc-100 mb-6" />
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">No awards yet</p>
          <p className="text-zinc-400 text-xs mt-2">Add your first industry award</p>
        </div>
      )}

      <ConfirmationModal 
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Remove Award"
        message="Permanently delete this award? This cannot be undone."
        confirmText="Remove Record"
        confirmVariant="danger"
        icon={<Trash2 size={32} />}
      />
    </div>
  );
};

export default AdminAwards;
