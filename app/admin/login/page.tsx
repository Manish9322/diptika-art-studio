'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AdminLogin from '@/app/components/admin/AdminLogin';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem('diptika_admin_auth', 'true');
    router.push('/admin/dashboard');
  };

  return <AdminLogin onLogin={handleLogin} />;
}
