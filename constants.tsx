
import { Artwork, Service } from './types';

export const ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: 'The Royal Bridal Bloom',
    category: 'Mehndi',
    images: [
      'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560155016-bd4879ae8f21?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600880292089-9d59f096ff50?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'An intricate bridal henna design featuring traditional Indian peacocks and floral mandalas, extending up to the elbows.',
    medium: 'Organic Henna Paste',
    context: 'Royal Jaipur Wedding',
    date: 'Autumn 2023'
  },
  {
    id: '2',
    title: 'Gilded Velvet Night',
    category: 'Nail Art',
    images: [
      'https://images.unsplash.com/photo-1604654894610-df490651e56c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Deep matte burgundy base with 24k gold leaf accents and hand-painted fine line details.',
    medium: 'UV Gel & Gold Leaf',
    context: 'Vogue Editorial Shoot',
    date: 'Winter 2023'
  },
  {
    id: '3',
    title: 'Celestial Mandala',
    category: 'Rangoli',
    images: [
      'https://images.unsplash.com/photo-1582234032483-c5989255018a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'A large-scale floor installation using naturally dyed rice and flower petals, symbolizing cosmic harmony.',
    medium: 'Natural Pigments & Petals',
    context: 'Diwali Gala at Ritz Carlton',
    date: 'October 2023'
  },
  {
    id: '4',
    title: 'Ethereal Glow',
    category: 'Makeup',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512496011951-a6994413c2ae?auto=format&fit=crop&q=80&w=1200'
    ],
    description: 'Soft-focus editorial makeup focusing on skin luminosity and neutral champagne tones.',
    medium: 'Premium Airbrush & Cream Textures',
    context: 'Paris Fashion Week',
    date: 'Spring 2024'
  }
];

export const SERVICES: Service[] = [
  {
    title: 'Bridal Mehndi',
    description: 'Bespoke storytelling through henna, custom-designed to tell your unique love story.',
    priceStart: '$450',
    image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Editorial Makeup',
    description: 'Sophisticated beauty for high-fashion, commercial, and luxury events.',
    priceStart: '$250',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Artisan Nail Design',
    description: 'One-of-a-kind sculptural and painted nail extensions for the discerning individual.',
    priceStart: '$120',
    image: 'https://images.unsplash.com/photo-1604654894610-df490651e56c?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Corporate Rangoli',
    description: 'Lobby and event space installations that merge tradition with modern branding.',
    priceStart: '$600',
    image: 'https://images.unsplash.com/photo-1582234032483-c5989255018a?auto=format&fit=crop&q=80&w=800'
  }
];
