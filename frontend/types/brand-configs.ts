import { BrandConfig } from './types';

export const BRAND_CONFIGS: Record<string, BrandConfig> = {
  'www.luxeloom.com': {
    name: 'luxeloom',
    domain: 'www.luxeloom.com',
    displayName: 'LuxeLoom',
    primaryColor: '#1a1a1a',
    secondaryColor: '#d4af37',
    logo: '/images/luxeloom-logo.svg',
    description: 'High-end fashion and accessories for the sophisticated shopper',
    isB2B: false,
  },
  'www.urbanmarket.com': {
    name: 'urbanmarket',
    domain: 'www.urbanmarket.com',
    displayName: 'UrbanMarket',
    primaryColor: '#2563eb',
    secondaryColor: '#f59e0b',
    logo: '/images/urbanmarket-logo.svg',
    description: 'Fast-fashion and everyday essentials for modern living',
    isB2B: false,
  },
  'b2b.auracommerce.com': {
    name: 'aura-wholesale',
    domain: 'b2b.auracommerce.com',
    displayName: 'Aura Wholesale',
    primaryColor: '#059669',
    secondaryColor: '#7c3aed',
    logo: '/images/aura-wholesale-logo.svg',
    description: 'B2B portal for bulk orders from LuxeLoom and UrbanMarket',
    isB2B: true,
  },
};

export const getBrandConfig = (domain: string): BrandConfig => {
  return BRAND_CONFIGS[domain] || BRAND_CONFIGS['www.luxeloom.com'];
};

export const getBrandByDomain = (domain: string): string => {
  const config = getBrandConfig(domain);
  return config.name;
};

export const isB2BBrand = (domain: string): boolean => {
  const config = getBrandConfig(domain);
  return config.isB2B;
};
