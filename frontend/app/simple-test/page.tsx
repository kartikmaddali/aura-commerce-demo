'use client';

import { useState } from 'react';

export default function SimpleTestPage() {
  const [isLoading, setIsLoading] = useState(false);

  const testAuth0Direct = () => {
    setIsLoading(true);
    console.log('SimpleTest: Starting direct Auth0 test');
    
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
    
    console.log('SimpleTest: Auth0 URL:', auth0LoginUrl);
    console.log('SimpleTest: Stored state:', state);
    
    // Redirect to Auth0
    window.location.href = auth0LoginUrl;
  };

  const checkLocalStorage = () => {
    const state = localStorage.getItem('auth0_state');
    const user = localStorage.getItem('auth0_user');
    const token = localStorage.getItem('auth0_access_token');
    
    console.log('SimpleTest: LocalStorage check:', {
      state: state ? 'Present' : 'Missing',
      user: user ? 'Present' : 'Missing',
      token: token ? 'Present' : 'Missing'
    });
    
    alert(`LocalStorage Status:
State: ${state ? 'Present' : 'Missing'}
User: ${user ? 'Present' : 'Missing'}
Token: ${token ? 'Present' : 'Missing'}`);
  };

  const clearAllData = () => {
    localStorage.clear();
    console.log('SimpleTest: Cleared all localStorage data');
    alert('All localStorage data cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Simple Auth0 Test
          </h1>
          
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
                  onClick={testAuth0Direct}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Redirecting...' : '🚀 Test Auth0 Direct Redirect'}
                </button>
                
                <button
                  onClick={checkLocalStorage}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  🔍 Check LocalStorage
                </button>
                
                <button
                  onClick={clearAllData}
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
                <li>Click "Test Auth0 Direct Redirect" to start authentication</li>
                <li>Complete the Auth0 login process</li>
                <li>You'll be redirected back to the callback page</li>
                <li>Check the browser console for any errors</li>
                <li>Use "Check LocalStorage" to see if data was stored</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
