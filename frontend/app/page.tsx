'use client';

import { useEffect } from 'react';
import { useBrand } from '@/components/providers/BrandProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { AIAssistant } from '@/components/ai/AIAssistant';

export default function HomePage() {
  const { brand, setBrandFromDomain } = useBrand();

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
        <Hero />
        <FeaturedProducts />
        <CategoryGrid />
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  );
}
