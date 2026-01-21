import React, { useRef, useState, useEffect } from 'react';
import { AlertCircle, LogOut, Trash2, X, Upload, Image as ImageIcon, Loader2, Plus } from 'lucide-react';
import { Service, Artwork } from '../../../types';
import { compressImage } from '../../../utils/imageUtils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
  icon?: React.ReactNode;
}

export const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = 'primary',
  icon
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md shadow-2xl animate-scale-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-8 md:p-10 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
            confirmVariant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-champagne/10 text-champagne'
          }`}>
            {icon || <AlertCircle size={32} />}
          </div>
          
          <h3 className="font-serif text-2xl text-zinc-900 mb-3">{title}</h3>
          <p className="text-zinc-500 text-sm font-light leading-relaxed mb-10">{message}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="py-3 px-6 border border-zinc-100 text-zinc-400 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`py-3 px-6 text-white text-[10px] uppercase tracking-[0.2em] font-bold transition-all shadow-md ${
                confirmVariant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-zinc-900 hover:bg-champagne'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

interface CreateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => Promise<void>;
}

export const CreateServiceModal: React.FC<CreateServiceModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Service>({
    title: '',
    description: '',
    priceStart: '',
    image: ''
  });

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      priceStart: '',
      image: ''
    });
    setError(null);
    setIsOptimizing(false);
    setIsSaving(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      setError(null);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64);
          setFormData(prev => ({ ...prev, image: optimized }));
          setIsOptimizing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Failed to process image');
        setIsOptimizing(false);
      }
    }
  };

  const handleInputChange = (field: keyof Service, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Service title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Service description is required');
      return false;
    }
    if (!formData.priceStart.trim()) {
      setError('Starting price is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      await onSave(formData);
      handleReset();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create service');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-fade-in" onClick={handleClose} />
      <div className="relative bg-white w-full max-w-4xl shadow-2xl animate-scale-in my-auto max-h-[85vh] md:max-h-[80vh] overflow-y-auto">
        <button 
          onClick={handleClose} 
          disabled={isSaving || isOptimizing}
          className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors z-10 disabled:opacity-50"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 mb-2">Create New Service</h3>
            <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">Add a new offering to your service registry</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-xs">
              {error}
            </div>
          )}
          
          {/* Landscape Layout: Left side image, Right side form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column: Image Upload */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                Service Image
              </label>
              <div className="relative w-full aspect-[4/3] bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-champagne transition-colors overflow-hidden group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Service preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={32} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                    <ImageIcon size={48} />
                    <span className="text-[10px] uppercase tracking-wider mt-3">Upload Image</span>
                  </div>
                )}
                {isOptimizing && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-champagne" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isOptimizing || isSaving}
              />
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Upload a high-quality image (800x600px recommended). Images will be automatically optimized.
              </p>
              {isOptimizing && (
                <p className="text-[10px] text-champagne font-bold uppercase tracking-wider">
                  Optimizing image...
                </p>
              )}
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-5">
              {/* Service Title */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Bridal Makeup, Portrait Photography..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 font-serif placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                  disabled={isSaving}
                />
              </div>

              {/* Starting Price and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                    Starting Price *
                  </label>
                  <input
                    type="text"
                    value={formData.priceStart}
                    onChange={(e) => handleInputChange('priceStart', e.target.value)}
                    placeholder="e.g., 25000, 450"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                    Currency
                  </label>
                  <select
                    value={formData.currency || 'INR'}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                    disabled={isSaving}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the artisan experience, what's included, and what makes this service special..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 font-light placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm resize-none"
                  rows={6}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6 lg:mt-8 pt-6 border-t border-zinc-100">
            <button
              onClick={handleClose}
              disabled={isSaving || isOptimizing}
              className="py-3 px-6 border border-zinc-200 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-50 transition-all disabled:opacity-50 rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || isOptimizing}
              className="py-3 px-6 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-champagne transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 rounded-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Service</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};
// CreateArtworkModal Component
interface CreateArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (artwork: Partial<Artwork>) => Promise<void>;
  categories: string[];
}

export const CreateArtworkModal: React.FC<CreateArtworkModalProps> = ({ isOpen, onClose, onSubmit, categories }) => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const [formData, setFormData] = useState<Partial<Artwork>>({
    title: '',
    category: categories[0] || 'Creative',
    images: [''],
    description: '',
    medium: '',
    context: '',
    date: getTodayDate(),
    price: '',
    currency: 'INR',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Update category when categories change
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(formData.category || '')) {
      setFormData(prev => ({ ...prev, category: categories[0] }));
    }
  }, [categories, formData.category]);

  const handleInputChange = (field: keyof Artwork, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...(formData.images || [''])];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsOptimizing(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const rawBase64 = reader.result as string;
          const optimized = await compressImage(rawBase64);
          handleImageChange(index, optimized);
          setIsOptimizing(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setIsOptimizing(false);
        setError('Failed to process image');
      }
    }
  };

  const handleAddImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      images: [...(prev.images || ['']), ''] 
    }));
  };

  const handleRemoveImage = (index: number) => {
    const newImages = (formData.images || ['']).filter((_, i) => i !== index);
    setFormData(prev => ({ 
      ...prev, 
      images: newImages.length > 0 ? newImages : [''] 
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      setError('Please provide an artwork title');
      return;
    }
    if (!formData.description?.trim()) {
      setError('Please provide a description');
      return;
    }
    if (!formData.images || formData.images.every(img => !img)) {
      setError('Please upload at least one image');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create artwork');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving && !isOptimizing) {
      setFormData({
        title: '',
        category: categories[0] || 'Creative',
        images: [''],
        description: '',
        medium: '',
        context: '',
        date: getTodayDate(),
        price: '',
        currency: 'INR',
      });
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-fade-in" onClick={handleClose} />
      <div className="relative bg-white w-full max-w-5xl shadow-2xl animate-scale-in my-auto max-h-[85vh] md:max-h-[80vh] overflow-y-auto">
        <button 
          onClick={handleClose} 
          disabled={isSaving || isOptimizing}
          className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors z-10 disabled:opacity-50"
        >
          <X size={20} />
        </button>
        
        <div className="p-6 sm:p-8 md:p-10">
          <div className="text-center mb-6 md:mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 mb-2">Add New Masterpiece</h3>
            <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">Curate a new artwork to the collection vault</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-xs">
              {error}
            </div>
          )}
          
          {/* Landscape Layout: Left side images, Right side form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column: Image Gallery Upload */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                Artwork Images
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(formData.images || ['']).map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <div 
                      className="relative w-full h-full bg-zinc-50 border-2 border-dashed border-zinc-200 hover:border-champagne transition-colors overflow-hidden group cursor-pointer"
                      onClick={() => fileInputRefs.current[index]?.click()}
                    >
                      {img ? (
                        <>
                          <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={24} className="text-white" />
                          </div>
                          {(formData.images?.length || 0) > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(index);
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300">
                          <ImageIcon size={32} />
                          <span className="text-[8px] uppercase tracking-wider mt-2">Upload</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={el => { fileInputRefs.current[index] = el; }}
                      onChange={(e) => handleFileChange(index, e)}
                      className="hidden"
                      accept="image/*"
                      disabled={isOptimizing || isSaving}
                    />
                  </div>
                ))}
                {(formData.images?.length || 0) < 6 && (
                  <button
                    onClick={handleAddImage}
                    disabled={isOptimizing || isSaving}
                    className="aspect-square border-2 border-dashed border-zinc-200 hover:border-champagne text-zinc-300 hover:text-champagne transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Plus size={32} />
                  </button>
                )}
              </div>
              {isOptimizing && (
                <p className="text-[10px] text-champagne font-bold uppercase tracking-wider flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin" />
                  Optimizing image...
                </p>
              )}
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-5">
              {/* Artwork Title */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Bridal Mehndi Masterpiece..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-900 font-serif placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                  disabled={isSaving}
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                  disabled={isSaving}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Artistic Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                    Medium
                  </label>
                  <input
                    type="text"
                    value={formData.medium}
                    onChange={(e) => handleInputChange('medium', e.target.value)}
                    placeholder="e.g., Henna, Acrylic..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                    disabled={isSaving}
                    max={getTodayDate()}
                  />
                  <p className="text-[9px] text-zinc-400 font-light">Select the artwork creation date</p>
                </div>
              </div>

              {/* Context */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                  Context
                </label>
                <input
                  type="text"
                  value={formData.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                  placeholder="e.g., Wedding, Commission, Personal..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                  disabled={isSaving}
                />
              </div>

              {/* Price and Currency Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                    Price
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 5000, 10000..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm"
                    disabled={isSaving}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold block">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the artwork, inspiration, technique, and creative vision..."
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 text-sm text-zinc-600 font-light placeholder-zinc-300 focus:ring-2 focus:ring-champagne/20 focus:border-champagne transition-all outline-none rounded-sm resize-none"
                  rows={4}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-6 lg:mt-8 pt-6 border-t border-zinc-100">
            <button
              onClick={handleClose}
              disabled={isSaving || isOptimizing}
              className="py-3 px-6 border border-zinc-200 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-50 transition-all disabled:opacity-50 rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || isOptimizing}
              className="py-3 px-6 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-champagne transition-all shadow-md disabled:opacity-50 flex items-center justify-center space-x-2 rounded-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Add to Collection</span>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};