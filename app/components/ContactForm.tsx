
'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Bridal Mehndi',
    eventDate: '',
    message: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAiRefinement = async () => {
    if (!formData.message.trim()) {
      setErrors({ message: 'Please write a rough idea first so the AI can refine it.' });
      return;
    }

    setIsAiThinking(true);
    try {
      // AI refinement would call your API endpoint here
      // For now, just add a note that this feature is coming soon
      setErrors({ message: 'AI refinement feature coming soon!' });
      
      // Example of what the API call would look like:
      // const response = await fetch('/api/refine-message', {
      //   method: 'POST',
      //   body: JSON.stringify({ message: formData.message })
      // });
      // const data = await response.json();
      // if (data.refinedMessage) {
      //   setFormData(prev => ({ ...prev, message: data.refinedMessage }));
      // }
    } catch (err) {
      console.error("AI refinement failed", err);
      setErrors({ message: 'AI refinement failed. Please try again.' });
    } finally {
      setIsAiThinking(false);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name.';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (!formData.phone.trim() || !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Please enter a valid phone number.';
    if (!formData.eventDate) newErrors.eventDate = 'Please select a date.';
    if (!formData.message.trim()) newErrors.message = 'Please share some details about your vision.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Bridal Mehndi',
          eventDate: '',
          message: ''
        });
        setErrors({});
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setErrors({ message: data.error || 'Failed to submit inquiry. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({ message: 'Failed to submit inquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return (
    <section id="contact" className="py-32 px-8 bg-[#fdfaf6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-4 font-bold">Engagement</span>
          <h3 className="font-serif text-zinc-900 text-4xl md:text-5xl">Work With Me</h3>
        </div>

        <div className="relative">
          <form onSubmit={handleSubmit} className="bg-white border border-zinc-100 shadow-2xl p-8 md:p-16 space-y-12">
            {submitted && (
              <div className="p-6 bg-green-50 border border-green-100 text-green-700 text-sm text-center font-medium animate-fade-in">
                Thank you. Your inquiry has been received. Our concierge will contact you shortly.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-300 ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-zinc-200 focus:border-champagne'}`}
                  placeholder="Evelyn Thorne"
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.name}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-300 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-zinc-200 focus:border-champagne'}`}
                  placeholder="evelyn@domain.com"
                />
                {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-colors placeholder:text-zinc-300 ${errors.phone ? 'border-red-300 focus:border-red-500' : 'border-zinc-200 focus:border-champagne'}`}
                  placeholder="+44 7700 900000"
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.phone}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Service Interest</label>
                <select 
                  value={formData.service}
                  onChange={(e) => handleChange('service', e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-200 py-3 text-zinc-700 focus:outline-none focus:border-champagne transition-colors appearance-none"
                >
                  <option className="bg-white">Bridal Mehndi</option>
                  <option className="bg-white">Editorial Makeup</option>
                  <option className="bg-white">Artisan Nails</option>
                  <option className="bg-white">Other Custom Art</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Event Date</label>
              <input 
                type="date" 
                value={formData.eventDate}
                onChange={(e) => handleChange('eventDate', e.target.value)}
                className={`w-full bg-transparent border-b py-3 text-zinc-700 focus:outline-none transition-colors ${errors.eventDate ? 'border-red-300 focus:border-red-500' : 'border-zinc-200 focus:border-champagne'}`}
              />
              {errors.eventDate && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.eventDate}</p>}
            </div>

            <div className="space-y-3 relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">Your Vision</label>
                <button 
                  type="button"
                  onClick={handleAiRefinement}
                  disabled={isAiThinking}
                  className="flex items-center space-x-2 text-[8px] uppercase tracking-widest font-bold text-champagne hover:text-zinc-900 transition-colors disabled:opacity-50"
                >
                  {isAiThinking ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                  <span>Refine with AI</span>
                </button>
              </div>
              <textarea 
                rows={4}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-colors resize-none placeholder:text-zinc-300 ${errors.message ? 'border-red-300 focus:border-red-500' : 'border-zinc-200 focus:border-champagne'}`}
                placeholder="Share your thoughts... (e.g., I want something royal but minimalist)"
              ></textarea>
              {errors.message && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.message}</p>}
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-champagne transition-all duration-500 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Inquiry...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
