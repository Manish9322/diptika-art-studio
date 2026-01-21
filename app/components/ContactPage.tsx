"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Instagram,
  Facebook,
  Clock,
  Loader2,
  Globe,
  Twitter,
  Youtube,
} from "lucide-react";
import { useGetArtistProfileQuery } from "../../utils/services/api";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Bridal Mehndi Experience",
    eventDate: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: profileData, isLoading: isProfileLoading } =
    useGetArtistProfileQuery(undefined);

  // Studio settings
  const [studioSettings, setStudioSettings] = useState<any>(null);

  useEffect(() => {
    // Settings will be loaded from API when ready
    setStudioSettings({ availability: 'Mon - Sat, By Private Appointment Only' });
  }, []);

  const profile = profileData;

  console.log("Profile data:", profile); // Debug log

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "A valid email address is required.";
    if (
      !formData.phone.trim() ||
      !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
        formData.phone.replace(/\s/g, ""),
      )
    )
      newErrors.phone = "A valid phone number is required.";
    if (!formData.eventDate)
      newErrors.eventDate = "Please select a proposed date.";
    if (!formData.message.trim())
      newErrors.message = "Please share some details about your vision.";

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
          name: "",
          email: "",
          phone: "",
          service: "Bridal Mehndi Experience",
          eventDate: "",
          message: "",
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  if (isProfileLoading || !studioSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fdfaf6]">
        <Loader2 size={32} className="animate-spin text-champagne" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      {/* Editorial Header Section */}
      <section className="pt-48 pb-24 px-8 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
            <div className="hero-fade-in">
              <span className="text-[11px] uppercase tracking-[0.6em] text-champagne block mb-6 font-bold">
                Booking & Inquiry
              </span>
              <h2 className="font-serif text-zinc-900 text-6xl md:text-8xl mb-8 leading-tight">
                Secure Your <br />
                <span className="italic">Artistic Moment</span>
              </h2>
              <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-xl">
                Whether for a royal bridal commission or an editorial
                collaboration, our studio is dedicated to manifesting your
                aesthetic vision with prestige and care.
              </p>
            </div>
            <div className="lg:pb-12 hero-fade-in-up">
              <div className="flex flex-col space-y-8">
                {profile?.email && (
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-zinc-200 text-champagne">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 block font-bold">
                        Email Inquiries
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-zinc-900 text-sm font-medium hover:text-champagne transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 flex items-center justify-center border border-zinc-200 text-champagne">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 block font-bold">
                        Direct Contact
                      </span>
                      <a
                        href={`tel:${profile.phone.replace(/\s/g, "")}`}
                        className="text-zinc-900 text-sm font-medium hover:text-champagne transition-colors"
                      >
                        {profile.phone}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-zinc-200 text-champagne">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 block font-bold">
                      Response Time
                    </span>
                    <span className="text-zinc-900 text-sm font-medium">
                      Within 24-48 Hours
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-zinc-200 text-champagne">
                    <Globe size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 block font-bold">
                      Availability
                    </span>
                    <span className="text-zinc-900 text-sm font-medium">
                      {studioSettings.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-24 items-start">
            {/* Visual Column */}
            <div className="lg:w-5/12 space-y-12">
              <div className="aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border-[1px] border-zinc-100 p-2 bg-white shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=600"
                  alt="Process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <h4 className="font-serif text-2xl text-zinc-900">
                  Direct Contact
                </h4>
                <div className="space-y-4">
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center space-x-4 group"
                    >
                      <Mail size={16} className="text-champagne" />
                      <span className="text-sm text-zinc-600 group-hover:text-champagne transition-colors font-light">
                        {profile.email}
                      </span>
                    </a>
                  )}
                  {profile?.phone && (
                    <a
                      href={`tel:${profile.phone.replace(/\s/g, "")}`}
                      className="flex items-center space-x-4 group"
                    >
                      <Phone size={16} className="text-champagne" />
                      <span className="text-sm text-zinc-600 group-hover:text-champagne transition-colors font-light">
                        {profile.phone}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:w-7/12 w-full">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-8 md:p-16 border border-zinc-100 shadow-[0_30px_60px_-15px_rgba(197,160,89,0.1)] space-y-12 relative overflow-hidden"
              >
                {submitted && (
                  <div className="p-6 bg-green-50 border border-green-100 text-green-700 text-sm text-center font-medium animate-fade-in">
                    Thank you. Your inquiry has been received. Our concierge
                    will contact you shortly.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300 focus:shadow-[0_1px_0_0_#c5a059] ${errors.name ? "border-red-300" : "border-zinc-200"}`}
                      placeholder="The Hon. Alexandra Rose"
                    />
                    {errors.name && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">
                      Electronic Mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300 focus:shadow-[0_1px_0_0_#c5a059] ${errors.email ? "border-red-300" : "border-zinc-200"}`}
                      placeholder="alexandra@domain.com"
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-300 focus:shadow-[0_1px_0_0_#c5a059] ${errors.phone ? "border-red-300" : "border-zinc-200"}`}
                      placeholder="+44 7700 900000"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="group space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-200 py-3 text-zinc-700 focus:outline-none focus:border-champagne transition-all appearance-none cursor-pointer focus:shadow-[0_1px_0_0_#c5a059]"
                    >
                      <option className="bg-white">
                        Bridal Mehndi Experience
                      </option>
                      <option className="bg-white">
                        Editorial & Fashion Makeup
                      </option>
                      <option className="bg-white">Luxury Nail Design</option>
                      <option className="bg-white">
                        Bespoke Rangoli Installation
                      </option>
                      <option className="bg-white">Global Commission</option>
                    </select>
                  </div>
                </div>

                <div className="group space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">
                    Proposed Date
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    className={`w-full bg-transparent border-b py-3 text-zinc-700 focus:outline-none transition-all focus:shadow-[0_1px_0_0_#c5a059] ${errors.eventDate ? "border-red-300" : "border-zinc-200"}`}
                  />
                  {errors.eventDate && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                <div className="group space-y-3">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 block font-bold">
                    Tell us about your vision
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className={`w-full bg-transparent border-b py-3 text-zinc-900 focus:outline-none transition-all resize-none placeholder:text-zinc-300 focus:shadow-[0_1px_0_0_#c5a059] ${errors.message ? "border-red-300" : "border-zinc-200"}`}
                    placeholder="We invite you to share the details, themes, or story behind your commission..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-zinc-900 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-champagne transition-all duration-700 shadow-lg group flex items-center justify-center space-x-4 disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? "Requesting Consultation..."
                        : "Request Private Consultation"}
                    </span>
                    <span className="group-hover:translate-x-2 transition-transform">
                      &rarr;
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section Removed - Online Platform Only */}

      <style>{`
        @keyframes fade-in-up-hero {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-hero {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-in {
          animation: fade-in-hero 1.2s ease-out forwards;
        }
        .hero-fade-in-up {
          animation: fade-in-up-hero 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
