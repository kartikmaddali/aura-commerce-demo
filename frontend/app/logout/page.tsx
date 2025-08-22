'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // The logout function will handle clearing data and redirecting
      } catch (error) {
        console.error('Logout error:', error);
        // Fallback: clear data manually and redirect
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth0_user');
          localStorage.removeItem('auth0_access_token');
          localStorage.removeItem('auth0_id_token');
          localStorage.removeItem('auth0_refresh_token');
          localStorage.removeItem('auth0_brand');
        }
        router.push('/');
      }
    };

    performLogout();
  }, [logout, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}
