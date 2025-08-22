'use client';

import { useState } from 'react';

export default function MinimalTestPage() {
  const [isLoading, setIsLoading] = useState(false);

  const testAuth0 = () => {
    setIsLoading(true);
    
    try {
      console.log('MinimalTest: Starting Auth0 test');
      
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
      
      console.log('MinimalTest: Auth0 URL:', auth0LoginUrl);
      console.log('MinimalTest: Stored state:', state);
      
      // Redirect to Auth0
      window.location.href = auth0LoginUrl;
    } catch (err) {
      console.error('MinimalTest: Error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          🔧 Minimal Auth0 Test
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Auth0 Configuration
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
            <p><strong>Domain:</strong> km-personal-demo.us.auth0.com</p>
            <p><strong>Client ID:</strong> 6xrsdinahkTjtRGGDsAQFITm9ZEzR9E2</p>
            <p><strong>Audience:</strong> https://api.auracommerce.com</p>
            <p><strong>Redirect URI:</strong> http://localhost:3000/callback</p>
          </div>
        </div>
        
        <button
          onClick={testAuth0}
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
            color: 'white',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          {isLoading ? 'Redirecting...' : '🚀 Test Auth0 Login'}
        </button>
        
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#fef3c7', 
          borderRadius: '0.375rem',
          fontSize: '0.875rem'
        }}>
          <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Instructions:</h3>
          <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>Click "Test Auth0 Login" to start authentication</li>
            <li>Complete the Auth0 login process</li>
            <li>You'll be redirected back to the callback page</li>
            <li>Check the browser console for any errors</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
