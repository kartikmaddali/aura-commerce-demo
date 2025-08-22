'use client';

import React from 'react';
import Link from 'next/link';
import { useBrand } from '@/components/providers/BrandProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArrowRight, Crown, ShoppingBag, Users } from 'lucide-react';

export function Hero() {
  const { brand } = useBrand();
  const { user, isAuthenticated } = useAuth();

  if (!brand) return null;

  const getBrandContent = () => {
    switch (brand.name) {
      case 'luxeloom':
        return {
          title: 'Luxury Fashion Redefined',
          subtitle: 'Discover our exclusive collection of high-end fashion and accessories. Where elegance meets sophistication.',
          cta: user?.['https://aura-commerce.com/is_premium'] ? 'Shop VIP Collection' : 'Explore Collection',
          ctaLink: user?.['https://aura-commerce.com/is_premium'] ? '/vip-lounge' : '/products',
          secondaryCta: 'Become a VIP Member',
          secondaryCtaLink: '/membership',
          icon: Crown,
          features: [
            'Handcrafted luxury items',
            'Exclusive VIP access',
            'Personal styling consultations',
            'Premium customer service'
          ]
        };
      case 'urbanmarket':
        return {
          title: 'Style for Every Day',
          subtitle: 'Trendy fashion and everyday essentials that fit your lifestyle. Quality meets affordability.',
          cta: 'Shop Now',
          ctaLink: '/products',
          secondaryCta: 'View Sale Items',
          secondaryCtaLink: '/sale',
          icon: ShoppingBag,
          features: [
            'Trendy fashion items',
            'Affordable prices',
            'Fast shipping',
            'Easy returns'
          ]
        };
      case 'aura-wholesale':
        return {
          title: 'B2B Solutions for Business',
          subtitle: 'Bulk orders, corporate discounts, and wholesale pricing for businesses of all sizes.',
          cta: 'Browse Products',
          ctaLink: '/products',
          secondaryCta: 'Request Quote',
          secondaryCtaLink: '/quote',
          icon: Users,
          features: [
            'Bulk pricing discounts',
            'Corporate accounts',
            'Custom branding options',
            'Dedicated account managers'
          ]
        };
      default:
        return {
          title: 'Welcome to Aura Commerce',
          subtitle: 'Discover our amazing products and services.',
          cta: 'Get Started',
          ctaLink: '/products',
          secondaryCta: 'Learn More',
          secondaryCtaLink: '/about',
          icon: ShoppingBag,
          features: [
            'Quality products',
            'Great service',
            'Fast delivery',
            'Customer satisfaction'
          ]
        };
    }
  };

  const content = getBrandContent();
  const IconComponent = content.icon;

  const getBrandStyles = () => {
    switch (brand.name) {
      case 'luxeloom':
        return {
          primaryColor: 'bg-luxeloom-primary',
          secondaryColor: 'bg-luxeloom-secondary',
          textColor: 'text-white',
          accentColor: 'text-luxeloom-secondary',
        };
      case 'urbanmarket':
        return {
          primaryColor: 'bg-urbanmarket-primary',
          secondaryColor: 'bg-urbanmarket-secondary',
          textColor: 'text-white',
          accentColor: 'text-urbanmarket-secondary',
        };
      case 'aura-wholesale':
        return {
          primaryColor: 'bg-aura-wholesale-primary',
          secondaryColor: 'bg-aura-wholesale-secondary',
          textColor: 'text-white',
          accentColor: 'text-aura-wholesale-secondary',
        };
      default:
        return {
          primaryColor: 'bg-gray-900',
          secondaryColor: 'bg-yellow-500',
          textColor: 'text-white',
          accentColor: 'text-yellow-500',
        };
    }
  };

  const styles = getBrandStyles();

  return (
    <section className={`${styles.primaryColor} ${styles.textColor} py-20`}>
      <div className="container-brand">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-2 mb-4">
              <IconComponent className={`w-8 h-8 ${styles.accentColor}`} />
              <span className="text-sm font-medium uppercase tracking-wide opacity-80">
                {brand.displayName}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {content.title}
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              {content.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={content.ctaLink}
                className={`${styles.secondaryColor} text-gray-900 px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
              >
                <span>{content.cta}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href={content.secondaryCtaLink}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center"
              >
                {content.secondaryCta}
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${styles.secondaryColor} rounded-full`}></div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className={`${styles.secondaryColor} rounded-2xl p-8 text-gray-900`}>
              <div className="text-center space-y-4">
                <IconComponent className="w-16 h-16 mx-auto" />
                <h3 className="text-2xl font-bold">
                  {brand.isB2B ? 'Business Solutions' : 'Premium Experience'}
                </h3>
                <p className="text-gray-700">
                  {brand.isB2B 
                    ? 'Get started with bulk ordering and corporate discounts'
                    : 'Join thousands of satisfied customers'
                  }
                </p>
                
                {!isAuthenticated && (
                  <div className="pt-4">
                    <Link
                      href="/auth"
                      className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
                    >
                      {brand.isB2B ? 'Create Business Account' : 'Sign Up Now'}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
