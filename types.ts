
export type CategoryType = string;

export interface Artwork {
  id?: string;
  _id?: string;
  title: string;
  category: CategoryType;
  images: string[];
  description: string;
  medium: string;
  context: string;
  date: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
  price?: string;
  currency?: string;
}

export interface Service {
  title: string;
  description: string;
  priceStart: string;
  currency?: string;
  image?: string;
  order?: number;
  priceEnd?: string;
  features?: string[];
  active?: boolean;
}

export interface StudioSettings {
  studioName: string;
  supportEmail: string;
  currency: string;
  language: string;
  maintenanceMode: boolean;
  emailInquiries: boolean;
  autoResponse: boolean;
  availability: string;
  privacyPolicy: string;
  termsOfService: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  snapchat?: string;
  youtube?: string;
  email?: string;
  other?: string;
}

export interface ArtistProfile {
  name: string;
  title: string;
  bio: string;
  profileImage: string; // Image for main page AboutSection
  aboutPageImage: string; // Large image for About page
  image?: string; // Legacy field for backward compatibility
  email: string;
  phone?: string;
  socialLinks: SocialLinks;
  experience: string;
  location?: string; // Optional - for legacy support only
  mapLocation?: string; // Optional - for legacy support only
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  eventDate: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'archived';
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string; // e.g., "Bridal Client", "Vogue Editor"
  content: string;
  image?: string;
  date: string;
}

export interface Award {
  id?: string;
  _id?: string;
  title: string;
  organization: string;
  year: number;
  description?: string;
  category?: string;
  image?: string;
  certificateUrl?: string;
  featured?: boolean;
  active?: boolean;
  order?: number;
}

export type Page = 'home' | 'portfolio' | 'about' | 'contact' | 'privacy' | 'terms' | 'admin-login' | 'admin-dashboard' | 'admin-services' | 'admin-art' | 'admin-analytics' | 'admin-profile' | 'admin-settings' | 'admin-contacts' | 'admin-testimonials' | 'admin-awards';
