
'use client';

import React, { useState, useRef } from 'react';
import { Save, Trash2, Plus, Upload, Edit2, Loader2, User } from 'lucide-react';
import { Testimonial } from '../../../types';
import { ConfirmationModal } from './AdminModals';
import { compressImage } from '../../../utils/imageUtils';
import { useGetTestimonialsQuery, useAddTestimonialMutation, useUpdateTestimonialMutation, useDeleteTestimonialMutation } from '@/utils/services/api';

const AdminTestimonials: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query hooks
  const { data: testimonialsData, isLoading } = useGetTestimonialsQuery({});
  const [addTestimonial] = useAddTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();
  const [deleteTestimonialMutation] = useDeleteTestimonialMutation();

  const testimonials: Testimonial[] = testimonialsData || [];

  const getTestimonialId = (testimonial: Testimonial): string => {
    return (testimonial as any)._id || testimonial.id || '';
  };

  const handleEdit = (testimonial: Testimonial) => {
    const id = getTestimonialId(testimonial);
    setEditingId(id);
    setEditingTestimonial({ ...testimonial });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTestimonial(null);
  };

  const handleSave = async () => {
    if (!editingTestimonial) return;

    try {
      const id = getTestimonialId(editingTestimonial);
      const { _id, ...testimonialData } = editingTestimonial as any;
      await updateTestimonial({ id, ...testimonialData }).unwrap();
      setSuccess(true);
      setEditingId(null);
      setEditingTestimonial(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating testimonial:', err);
      setError(err?.data?.message || 'Failed to update testimonial');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdate = (field: keyof Testimonial, value: string) => {
    if (editingTestimonial) {
      setEditingTestimonial({ ...editingTestimonial, [field]: value });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTestimonial) {
      setIsOptimizing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64, 400, 0.6);
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

  const handleAddTestimonial = async () => {
    try {
      const newTest = {
        clientName: 'New Client',
        role: 'Private Commission',
        content: 'A few words about the experience...',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        image: ''
      };
      
      const result = await addTestimonial(newTest).unwrap();
      const id = (result as any)._id || (result as any).id;
      setEditingId(id);
      setEditingTestimonial(result);
    } catch (err: any) {
      console.error('Error adding testimonial:', err);
      setError(err?.data?.message || 'Failed to add testimonial');
      setTimeout(() => setError(null), 5000);
    }
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteTestimonialMutation(deleteId).unwrap();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: any) {
        console.error('Error deleting testimonial:', err);
        setError(err?.data?.message || 'Failed to delete testimonial');
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
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-zinc-900 mb-2 leading-tight">Client Stories</h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">Curate professional testimonials and brand resonance.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {success && <span className="text-green-500 text-[9px] uppercase tracking-[0.1em] font-bold">Changes Saved</span>}
          {error && <span className="text-red-500 text-[9px] uppercase tracking-[0.1em] font-bold">{error}</span>}
        </div>
      </div>

      <div className="flex justify-center sm:justify-end">
        <button 
          onClick={handleAddTestimonial}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-champagne text-white px-8 py-4 sm:py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-900 transition-all shadow-sm"
        >
          <Plus size={14} />
          <span>New Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {testimonials.map((t) => {
          const tId = getTestimonialId(t);
          const isEditing = editingId === tId;
          const displayTest = isEditing && editingTestimonial ? editingTestimonial : t;
          
          return (
            <div key={tId} className={`bg-white border p-6 sm:p-8 shadow-sm transition-all group flex flex-col ${isEditing ? 'border-champagne ring-1 ring-champagne/10' : 'border-zinc-100'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-zinc-50 border border-zinc-100">
                  {displayTest.image ? (
                    <img src={displayTest.image} className="w-full h-full object-cover" alt={displayTest.clientName} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200"><User size={24} /></div>
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
                    <button onClick={() => handleEdit(t)} className="p-2 text-zinc-300 hover:text-zinc-900 transition-colors"><Edit2 size={14} /></button>
                  )}
                  <button onClick={() => setDeleteId(tId)} className="p-2 text-zinc-200 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {isEditing ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Client Identity</label>
                      <input 
                        type="text" 
                        value={displayTest.clientName} 
                        onChange={(e) => handleUpdate('clientName', e.target.value)}
                        className="w-full bg-zinc-50 border-none px-3 py-2 text-sm font-serif focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                        placeholder="Client Name"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Role / Context</label>
                      <input 
                        type="text" 
                        value={displayTest.role} 
                        onChange={(e) => handleUpdate('role', e.target.value)}
                        className="w-full bg-zinc-50 border-none px-3 py-2 text-[10px] uppercase tracking-widest focus:ring-1 focus:ring-champagne/20 outline-none rounded-sm"
                        placeholder="Role (e.g. Bridal Client)"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Narrative</label>
                      <textarea 
                        value={displayTest.content} 
                        onChange={(e) => handleUpdate('content', e.target.value)}
                        className="w-full bg-zinc-50 border-none px-3 py-2 text-xs text-zinc-500 leading-relaxed resize-none outline-none rounded-sm"
                        rows={5}
                        placeholder="Testimonial content..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-serif text-xl text-zinc-900 leading-tight">{displayTest.clientName}</h4>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-champagne font-bold">{displayTest.role}</p>
                    <div className="text-zinc-500 italic font-light text-sm leading-relaxed border-l-2 border-champagne/10 pl-4 py-2 flex-1">
                      "{displayTest.content}"
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-zinc-300 font-bold pt-4 mt-auto border-t border-zinc-50">{displayTest.date}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {testimonials.length === 0 && !isLoading && (
        <div className="text-center py-24 bg-white border border-zinc-100 rounded-sm">
          <User size={48} className="mx-auto text-zinc-100 mb-6" />
          <p className="text-zinc-300 text-[10px] uppercase tracking-[0.4em] font-bold">No testimonials yet</p>
          <p className="text-zinc-400 text-xs mt-2">Add your first client testimonial</p>
        </div>
      )}

      <ConfirmationModal 
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Remove Story"
        message="Permanently delete this client testimonial? This cannot be undone."
        confirmText="Remove Record"
        confirmVariant="danger"
        icon={<Trash2 size={32} />}
      />
    </div>
  );
};

export default AdminTestimonials;
