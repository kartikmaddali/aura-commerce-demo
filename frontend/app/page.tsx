'use client';

import { useEffect } from 'react';
import { useBrand } from '@/components/providers/BrandProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { AIAssistant } from '@/components/ai/AIAssistant';

export default function HomePage() {
  const { brand, setBrandFromDomain } = useBrand();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    // Detect brand from domain
    if (typeof window !== 'undefined') {
      const domain = window.location.hostname;
      setBrandFromDomain(domain);
    }
  }, [setBrandFromDomain]);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Debug Auth0 Buttons - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-100 p-4 text-center">
            <p className="text-red-800 mb-2">🔧 DEBUG: Auth0 Test Button</p>
            <p className="text-sm text-red-600 mb-4">
              isAuthenticated: {isAuthenticated ? 'true' : 'false'} | 
              Brand: {brand?.name || 'none'} | 
              Domain: {typeof window !== 'undefined' ? window.location.hostname : 'SSR'}
            </p>
            <button 
              onClick={() => {
                console.log('Page: Test Auth0 button clicked');
                console.log('Page: isAuthenticated =', isAuthenticated);
                console.log('Page: brand =', brand);
                login();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              🚀 Test Auth0 Login (Direct)
            </button>
            
            <button 
              onClick={() => {
                console.log('Page: Direct Auth0 redirect clicked');
                // Use environment variables instead of hardcoded values
                const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
                const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
                const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE;
                
                if (!domain || !clientId) {
                  console.error('Auth0 environment variables not configured');
                  return;
                }
                
                const state = Math.random().toString(36).substring(7);
                localStorage.setItem('auth0_state', state);
                
                const auth0LoginUrl = `https://${domain}/authorize?` +
                  `response_type=code&` +
                  `client_id=${clientId}&` +
                  `redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&` +
                  `scope=openid%20profile%20email%20read:products%20write:orders&` +
                  `audience=${encodeURIComponent(audience || '')}&` +
                  `state=${state}`;
                
                console.log('Page: Direct Auth0 URL:', auth0LoginUrl);
                window.location.href = auth0LoginUrl;
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-2"
            >
              🔥 Direct Auth0 Redirect
            </button>
          </div>
        )}
        
        <Hero />
        <FeaturedProducts />
        <CategoryGrid />
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
}
