'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminServices from '@/app/components/admin/AdminServices';

export default function AdminServicesPage() {
  const router = useRouter();
  
  const handleNavigate = (page: string) => {
    router.push(`/admin/${page.replace('admin-', '')}`);
  };

  return <AdminServices onNavigate={handleNavigate as any} />;
}
