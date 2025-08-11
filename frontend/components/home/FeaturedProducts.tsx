'use client';

import React from 'react';
import Link from 'next/link';
import { useBrand } from '@/components/providers/BrandProvider';
import { Product } from '@/types/types';
import { Star, Heart, ShoppingCart } from 'lucide-react';

// Mock featured products data
const featuredProducts: Record<string, Product[]> = {
  luxeloom: [
    {
      id: 'luxeloom-001',
      name: 'Silk Evening Gown',
      description: 'Elegant silk evening gown with hand-stitched details.',
      price: 2499.99,
      brand: 'luxeloom',
      category: 'Evening Wear',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
      inStock: true,
      stockQuantity: 15,
      tags: ['evening', 'luxury', 'silk'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'luxeloom-002',
      name: 'Italian Leather Handbag',
      description: 'Handcrafted Italian leather handbag with gold hardware.',
      price: 899.99,
      brand: 'luxeloom',
      category: 'Accessories',
      images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
      inStock: true,
      stockQuantity: 25,
      tags: ['leather', 'handbag', 'luxury'],
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
    },
  ],
  urbanmarket: [
    {
      id: 'urbanmarket-001',
      name: 'Denim Jacket',
      description: 'Classic denim jacket with modern fit and comfortable stretch fabric.',
      price: 89.99,
      brand: 'urbanmarket',
      category: 'Outerwear',
      images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400'],
      inStock: true,
      stockQuantity: 150,
      tags: ['denim', 'jacket', 'casual'],
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z',
    },
    {
      id: 'urbanmarket-002',
      name: 'Graphic T-Shirt',
      description: 'Comfortable cotton t-shirt with trendy graphic print.',
      price: 29.99,
      brand: 'urbanmarket',
      category: 'Tops',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      inStock: true,
      stockQuantity: 300,
      tags: ['t-shirt', 'graphic', 'casual'],
      createdAt: '2024-01-18T10:00:00Z',
      updatedAt: '2024-01-18T10:00:00Z',
    },
  ],
  'aura-wholesale': [
    {
      id: 'aura-wholesale-001',
      name: 'Bulk Cotton T-Shirts',
      description: 'Premium cotton t-shirts available in bulk quantities for businesses.',
      price: 12.99,
      brand: 'aura-wholesale',
      category: 'Bulk Apparel',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      inStock: true,
      stockQuantity: 5000,
      tags: ['bulk', 'cotton', 't-shirt'],
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 'aura-wholesale-002',
      name: 'Corporate Polo Shirts',
      description: 'Professional polo shirts perfect for corporate uniforms and branding.',
      price: 18.99,
      brand: 'aura-wholesale',
      category: 'Bulk Apparel',
      images: ['https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400'],
      inStock: true,
      stockQuantity: 3000,
      tags: ['corporate', 'polo', 'uniform'],
      createdAt: '2024-01-08T10:00:00Z',
      updatedAt: '2024-01-08T10:00:00Z',
    },
  ],
};

export function FeaturedProducts() {
  const { brand } = useBrand();

  if (!brand) return null;

  const products = featuredProducts[brand.name] || [];

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
    <section className="py-16 bg-gray-50">
      <div className="container-brand">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {brand.isB2B ? 'Featured Business Products' : 'Featured Products'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {brand.isB2B 
              ? 'Discover our most popular business solutions and bulk products'
              : 'Explore our handpicked selection of trending items'
            }
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="card card-hover group">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-200">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                    <ShoppingCart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Stock Badge */}
                {!product.inStock && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(24)</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                <Link
                  href={`/products/${product.id}`}
                  className={`w-full ${styles.secondaryColor} text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity text-center block`}
                >
                  {brand.isB2B ? 'View Details' : 'Add to Cart'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className={`inline-flex items-center space-x-2 ${styles.accentColor} font-semibold hover:underline`}
          >
            <span>View All Products</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
