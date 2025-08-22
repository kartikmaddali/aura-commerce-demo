'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useBrand } from '@/components/providers/BrandProvider';

export default function SimpleAuthTest() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { brand } = useBrand();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Auth0 Test</h1>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold mb-2">Status:</h2>
            <p>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p>Brand: {brand?.name || 'None'}</p>
            <p>Domain: {brand?.domain || 'None'}</p>
          </div>

          {user && (
            <div className="p-4 bg-green-100 rounded">
              <h2 className="font-semibold mb-2">User Info:</h2>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>ID: {user.sub}</p>
            </div>
          )}

          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <button
                onClick={login}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Login with Auth0
              </button>
            ) : (
              <button
                onClick={logout}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
