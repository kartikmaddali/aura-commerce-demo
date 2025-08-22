'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useBrand } from '@/components/providers/BrandProvider';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const { brand } = useBrand();
  const router = useRouter();
  
  // Debug information
  console.log('TestAuthPage render:', { 
    isLoading, 
    isAuthenticated, 
    user: !!user, 
    brand: !!brand,
    brandName: brand?.name 
  });

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show debug info even while loading
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const debugInfo = {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    hasBrand: !!brand,
    brandName: brand?.name,
    windowLocation: mounted ? window.location.href : 'Loading...'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
          <p className="mt-2 text-sm text-gray-500">AuthProvider is initializing...</p>
          
          {/* Debug info */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-left text-xs">
            <p><strong>Debug Info:</strong></p>
            <pre className="mt-2 text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Auth0 Integration Test
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Configuration Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Configuration
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Domain:</strong> {process.env.NEXT_PUBLIC_AUTH0_DOMAIN || 'km-personal-demo.us.auth0.com'}</p>
                <p><strong>Client ID:</strong> {process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '6xrsdinahkTjtRGGDsAQFITm9ZEzR9E2'}</p>
                <p><strong>Audience:</strong> {process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://api.auracommerce.com'}</p>
                <p><strong>Brand:</strong> {brand?.name || 'Unknown'}</p>
                <p><strong>Callback URL:</strong> http://localhost:3000/callback</p>
              </div>
            </div>

            {/* Authentication Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Authentication Status
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isAuthenticated 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </span>
                </p>
                {user && (
                  <>
                    <p><strong>User ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Brand:</strong> {user.brand}</p>
                    <p><strong>Roles:</strong> {user.roles.join(', ') || 'None'}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Test Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Test Logout
              </button>
            )}
            
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </button>
          </div>

          {/* Debug Information */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Debug Information
            </h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>Local Storage Keys:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {typeof window !== 'undefined' && [
                  'auth0_user',
                  'auth0_access_token',
                  'auth0_id_token',
                  'auth0_refresh_token',
                  'auth0_brand',
                  'auth0_code_verifier',
                  'auth0_state'
                ].map(key => (
                  <li key={key}>
                    {key}: {localStorage.getItem(key) ? '✅ Present' : '❌ Missing'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
