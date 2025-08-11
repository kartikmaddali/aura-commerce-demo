'use client';

import React from 'react';
import Link from 'next/link';
import { useBrand } from '@/components/providers/BrandProvider';
import { ShoppingBag, Shirt, Watch, Users, Building } from 'lucide-react';

// Category data for each brand
const categoryData = {
  luxeloom: [
    {
      name: 'Evening Wear',
      description: 'Elegant gowns and formal attire',
      icon: ShoppingBag,
      href: '/categories/evening-wear',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    },
    {
      name: 'Accessories',
      description: 'Luxury handbags and jewelry',
      icon: ShoppingBag,
      href: '/categories/accessories',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
    },
    {
      name: 'Sweaters',
      description: 'Premium cashmere and wool',
      icon: Shirt,
      href: '/categories/sweaters',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    },
    {
      name: 'VIP Lounge',
      description: 'Exclusive member benefits',
      icon: ShoppingBag,
      href: '/vip-lounge',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    },
  ],
  urbanmarket: [
    {
      name: 'Tops',
      description: 'Trendy shirts and blouses',
      icon: Shirt,
      href: '/categories/tops',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    },
    {
      name: 'Outerwear',
      description: 'Jackets and coats',
      icon: ShoppingBag,
      href: '/categories/outerwear',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400',
    },
    {
      name: 'Bottoms',
      description: 'Jeans and pants',
      icon: Shirt,
      href: '/categories/bottoms',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    },
    {
      name: 'Sale',
      description: 'Limited time offers',
      icon: ShoppingBag,
      href: '/sale',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400',
    },
  ],
  'aura-wholesale': [
    {
      name: 'Bulk Apparel',
      description: 'Corporate uniforms and bulk clothing',
      icon: Users,
      href: '/categories/bulk-apparel',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    },
    {
      name: 'Promotional Items',
      description: 'Custom branded merchandise',
      icon: Building,
      href: '/categories/promotional',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    },
    {
      name: 'Corporate Solutions',
      description: 'Business account management',
      icon: Building,
      href: '/corporate-solutions',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
    },
    {
      name: 'Request Quote',
      description: 'Get custom pricing',
      icon: Users,
      href: '/quote',
      image: 'https://images.unsplash.com/photo-1556761175-4a6acd3b1b2f?w=400',
    },
  ],
};

export function CategoryGrid() {
  const { brand } = useBrand();

  if (!brand) return null;

  const categories = categoryData[brand.name] || [];

  const getBrandStyles = () => {
    switch (brand.name) {
      case 'luxeloom':
        return {
          primaryColor: 'text-luxeloom-primary',
          secondaryColor: 'bg-luxeloom-secondary',
          accentColor: 'text-luxeloom-secondary',
        };
      case 'urbanmarket':
        return {
          primaryColor: 'text-urbanmarket-primary',
          secondaryColor: 'bg-urbanmarket-secondary',
          accentColor: 'text-urbanmarket-secondary',
        };
      case 'aura-wholesale':
        return {
          primaryColor: 'text-aura-wholesale-primary',
          secondaryColor: 'bg-aura-wholesale-secondary',
          accentColor: 'text-aura-wholesale-secondary',
        };
      default:
        return {
          primaryColor: 'text-gray-900',
          secondaryColor: 'bg-yellow-500',
          accentColor: 'text-yellow-500',
        };
    }
  };

  const styles = getBrandStyles();

  return (
    <section className="py-16">
      <div className="container-brand">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {brand.isB2B ? 'Business Solutions' : 'Shop by Category'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {brand.isB2B 
              ? 'Explore our comprehensive business solutions and services'
              : 'Discover our curated collections for every occasion'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group block"
              >
                <div className="card card-hover overflow-hidden">
                  {/* Category Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-200">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300"></div>
                    
                    {/* Icon */}
                    <div className="absolute top-4 left-4">
                      <div className={`w-12 h-12 ${styles.secondaryColor} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                    
                    {/* Arrow */}
                    <div className="mt-3 flex items-center space-x-2">
                      <span className={`text-sm font-medium ${styles.accentColor}`}>
                        Explore
                      </span>
                      <svg 
                        className={`w-4 h-4 ${styles.accentColor} transform group-hover:translate-x-1 transition-transform`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className={`inline-flex items-center space-x-2 ${styles.accentColor} font-semibold hover:underline`}
          >
            <span>View All Categories</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
