import { Product } from '@/shared/types';

export const products: Product[] = [
  // LuxeLoom Products (High-end fashion)
  {
    id: 'luxeloom-001',
    name: 'Silk Evening Gown',
    description: 'Elegant silk evening gown with hand-stitched details and Swarovski crystal embellishments.',
    price: 2499.99,
    brand: 'luxeloom',
    category: 'Evening Wear',
    subcategory: 'Gowns',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy'],
    inStock: true,
    stockQuantity: 15,
    tags: ['evening', 'luxury', 'silk', 'crystal'],
    features: [
      '100% Pure Silk',
      'Hand-stitched details',
      'Swarovski crystal embellishments',
      'Adjustable straps',
      'Hidden zipper',
    ],
    careInstructions: [
      'Dry clean only',
      'Store in garment bag',
      'Avoid direct sunlight',
      'Do not iron',
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'luxeloom-002',
    name: 'Italian Leather Handbag',
    description: 'Handcrafted Italian leather handbag with gold hardware and multiple compartments.',
    price: 899.99,
    brand: 'luxeloom',
    category: 'Accessories',
    subcategory: 'Handbags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
    ],
    sizes: ['One Size'],
    colors: ['Cognac', 'Black', 'Tan'],
    inStock: true,
    stockQuantity: 25,
    tags: ['leather', 'handbag', 'luxury', 'italian'],
    features: [
      'Full-grain Italian leather',
      'Gold-plated hardware',
      'Multiple compartments',
      'Adjustable shoulder strap',
      'Magnetic closure',
    ],
    careInstructions: [
      'Clean with leather conditioner',
      'Store in dust bag',
      'Avoid water exposure',
      'Professional cleaning recommended',
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'luxeloom-003',
    name: 'Cashmere Sweater',
    description: 'Ultra-soft cashmere sweater with ribbed texture and classic fit.',
    price: 399.99,
    brand: 'luxeloom',
    category: 'Sweaters',
    subcategory: 'Cashmere',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Navy', 'Charcoal', 'Rose'],
    inStock: true,
    stockQuantity: 40,
    tags: ['cashmere', 'sweater', 'luxury', 'soft'],
    features: [
      '100% Pure Cashmere',
      'Ribbed texture',
      'Classic fit',
      'Ribbed cuffs and hem',
      'Machine washable',
    ],
    careInstructions: [
      'Hand wash cold',
      'Lay flat to dry',
      'Do not bleach',
      'Store folded',
    ],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
  },

  // UrbanMarket Products (Fast-fashion)
  {
    id: 'urbanmarket-001',
    name: 'Denim Jacket',
    description: 'Classic denim jacket with modern fit and comfortable stretch fabric.',
    price: 89.99,
    brand: 'urbanmarket',
    category: 'Outerwear',
    subcategory: 'Jackets',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    inStock: true,
    stockQuantity: 150,
    tags: ['denim', 'jacket', 'casual', 'versatile'],
    features: [
      'Stretch denim fabric',
      'Modern fit',
      'Multiple pockets',
      'Adjustable waist',
      'Machine washable',
    ],
    careInstructions: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron if needed',
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'urbanmarket-002',
    name: 'Graphic T-Shirt',
    description: 'Comfortable cotton t-shirt with trendy graphic print and relaxed fit.',
    price: 29.99,
    brand: 'urbanmarket',
    category: 'Tops',
    subcategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Gray', 'Navy'],
    inStock: true,
    stockQuantity: 300,
    tags: ['t-shirt', 'graphic', 'casual', 'cotton'],
    features: [
      '100% Cotton',
      'Relaxed fit',
      'Graphic print',
      'Pre-shrunk fabric',
      'Machine washable',
    ],
    careInstructions: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron on low if needed',
    ],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'urbanmarket-003',
    name: 'High-Waist Jeans',
    description: 'Trendy high-waist jeans with stretch denim and flattering fit.',
    price: 79.99,
    brand: 'urbanmarket',
    category: 'Bottoms',
    subcategory: 'Jeans',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    ],
    sizes: ['24', '26', '28', '30', '32', '34'],
    colors: ['Blue', 'Black', 'Gray'],
    inStock: true,
    stockQuantity: 200,
    tags: ['jeans', 'high-waist', 'stretch', 'trendy'],
    features: [
      'Stretch denim',
      'High-waist fit',
      'Five-pocket style',
      'Slim leg',
      'Machine washable',
    ],
    careInstructions: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron if needed',
    ],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
  },

  // Aura Wholesale Products (B2B)
  {
    id: 'aura-wholesale-001',
    name: 'Bulk Cotton T-Shirts',
    description: 'Premium cotton t-shirts available in bulk quantities for businesses.',
    price: 12.99,
    brand: 'aura-wholesale',
    category: 'Bulk Apparel',
    subcategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    inStock: true,
    stockQuantity: 5000,
    tags: ['bulk', 'cotton', 't-shirt', 'business'],
    features: [
      '100% Cotton',
      'Bulk pricing',
      'Customizable',
      'Quick turnaround',
      'Quality guarantee',
    ],
    careInstructions: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron on low if needed',
    ],
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
    subcategory: 'Polo Shirts',
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Black', 'White', 'Gray'],
    inStock: true,
    stockQuantity: 3000,
    tags: ['corporate', 'polo', 'uniform', 'business'],
    features: [
      'Moisture-wicking fabric',
      'Embroidered logo option',
      'Professional fit',
      'Quick-dry technology',
      'Bulk discount available',
    ],
    careInstructions: [
      'Machine wash cold',
      'Tumble dry low',
      'Do not bleach',
      'Iron on low if needed',
    ],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 'aura-wholesale-003',
    name: 'Promotional Tote Bags',
    description: 'Customizable tote bags perfect for promotional events and branding.',
    price: 8.99,
    brand: 'aura-wholesale',
    category: 'Promotional Items',
    subcategory: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    ],
    sizes: ['One Size'],
    colors: ['Natural', 'Black', 'Navy', 'Red'],
    inStock: true,
    stockQuantity: 10000,
    tags: ['promotional', 'tote', 'customizable', 'branding'],
    features: [
      'Canvas material',
      'Custom printing available',
      'Reusable design',
      'Eco-friendly',
      'Bulk pricing',
    ],
    careInstructions: [
      'Machine wash cold',
      'Air dry',
      'Do not bleach',
      'Iron on low if needed',
    ],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
  },
];

export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(product => product.brand === brand);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const searchProducts = (query: string, brand?: string): Product[] => {
  const filteredProducts = brand 
    ? products.filter(product => product.brand === brand)
    : products;
    
  return filteredProducts.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
};
