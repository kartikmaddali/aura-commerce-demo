'use client';

import { useState } from 'react';

export default function Auth0StandalonePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAuth0 = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Auth0Standalone: Starting Auth0 test');
      
      // Clear any existing data
      localStorage.clear();
      
      // Generate state parameter
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem('auth0_state', state);
      
      // Auth0 configuration
      const domain = 'km-personal-demo.us.auth0.com';
      const clientId = '6xrsdinahkTjtRGGDsAQFITm9ZEzR9E2';
      const audience = 'https://api.auracommerce.com';
      const redirectUri = 'http://localhost:3000/callback';
      
      // Build Auth0 URL
      const auth0LoginUrl = `https://${domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=openid%20profile%20email%20read:products%20write:orders&` +
        `audience=${encodeURIComponent(audience)}&` +
        `state=${state}`;
      
      console.log('Auth0Standalone: Auth0 URL:', auth0LoginUrl);
      console.log('Auth0Standalone: Stored state:', state);
      
      // Redirect to Auth0
      window.location.href = auth0LoginUrl;
    } catch (err) {
      console.error('Auth0Standalone: Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  };

  const checkStatus = () => {
    const state = localStorage.getItem('auth0_state');
    const user = localStorage.getItem('auth0_user');
    const token = localStorage.getItem('auth0_access_token');
    
    console.log('Auth0Standalone: Status check:', {
      state: state ? 'Present' : 'Missing',
      user: user ? 'Present' : 'Missing',
      token: token ? 'Present' : 'Missing'
    });
    
    alert(`Auth0 Status:
State: ${state ? 'Present' : 'Missing'}
User: ${user ? 'Present' : 'Missing'}
Token: ${token ? 'Present' : 'Missing'}

Current URL: ${window.location.href}`);
  };

  const clearData = () => {
    localStorage.clear();
    console.log('Auth0Standalone: Cleared all data');
    alert('All data cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Auth0 Standalone Test
          </h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Auth0 Configuration
              </h2>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Domain:</strong> km-personal-demo.us.auth0.com</p>
                <p><strong>Client ID:</strong> 6xrsdinahkTjtRGGDsAQFITm9ZEzR9E2</p>
                <p><strong>Audience:</strong> https://api.auracommerce.com</p>
                <p><strong>Redirect URI:</strong> http://localhost:3000/callback</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">
                Test Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={testAuth0}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Redirecting...' : '🚀 Test Auth0 Login'}
                </button>
                
                <button
                  onClick={checkStatus}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  🔍 Check Status
                </button>
                
                <button
                  onClick={clearData}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Instructions
              </h2>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Click "Test Auth0 Login" to start authentication</li>
                <li>Complete the Auth0 login process</li>
                <li>You'll be redirected back to the callback page</li>
                <li>Check the browser console for any errors</li>
                <li>Use "Check Status" to see if data was stored</li>
              </ol>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-purple-900 mb-2">
                Debug Info
              </h2>
              <div className="text-sm text-purple-800 space-y-1">
                <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
                <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'SSR'}</p>
                <p><strong>LocalStorage Available:</strong> {typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
