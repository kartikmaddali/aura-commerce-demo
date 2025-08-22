'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandConfig } from '@/types/types';
import { getBrandConfig } from '@/types/brand-configs';

interface BrandContextType {
  brand: BrandConfig | null;
  setBrandFromDomain: (domain: string) => void;
  isB2B: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<BrandConfig | null>(null);

  const setBrandFromDomain = (domain: string) => {
    console.log('BrandProvider: setBrandFromDomain called with domain:', domain);
    const brandConfig = getBrandConfig(domain);
    console.log('BrandProvider: brand config found:', brandConfig);
    setBrand(brandConfig);
  };

  const isB2B = brand?.isB2B || false;

  // Set default brand for development
  useEffect(() => {
    console.log('BrandProvider: useEffect triggered, brand:', brand?.name);
    if (typeof window !== 'undefined' && !brand) {
      const domain = window.location.hostname;
      console.log('BrandProvider: Setting brand for domain:', domain);
      if (domain === 'localhost' || domain === '127.0.0.1') {
        // Default to LuxeLoom for local development
        console.log('BrandProvider: Setting default brand for localhost');
        setBrandFromDomain('www.luxeloom.com');
      } else {
        setBrandFromDomain(domain);
      }
    }
  }, [brand]);

  // Fallback: ensure brand is set after a short delay
  useEffect(() => {
    if (typeof window !== 'undefined' && !brand) {
      const timer = setTimeout(() => {
        console.log('BrandProvider: Fallback - setting default brand');
        setBrandFromDomain('www.luxeloom.com');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [brand]);

  const value = {
    brand,
    setBrandFromDomain,
    isB2B,
  };

  return (
    <BrandContext.Provider value={value}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
