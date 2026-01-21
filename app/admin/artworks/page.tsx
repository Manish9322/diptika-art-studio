'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminArtworks from '@/app/components/admin/AdminArtworks';

export default function AdminArtworksPage() {
  const router = useRouter();
  
  const handleNavigate = (page: string) => {
    router.push(`/admin/${page.replace('admin-', '')}`);
  };

  return <AdminArtworks onNavigate={handleNavigate as any} />;
}
