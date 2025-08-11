// Shared types for Aura Commerce Group

export type Brand = 'luxeloom' | 'urbanmarket' | 'aura-wholesale';

export interface BrandConfig {
  name: string;
  domain: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  description: string;
  isB2B: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  brand: Brand;
  roles: string[];
  organizationId?: string; // For B2B users
  isPremium?: boolean; // For B2C premium members
  linkedAccounts?: {
    google?: string;
    apple?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  brand: Brand;
  category: string;
  subcategory?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  features?: string[];
  careInstructions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  organizationId?: string; // For B2B orders
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    productId?: string;
    orderId?: string;
    userContext?: any;
  };
}

export interface AIContext {
  user: User;
  brand: Brand;
  currentProduct?: Product;
  recentOrders?: Order[];
  wishlist?: Product[];
  organization?: {
    id: string;
    name: string;
    discount: number;
  };
}

// Auth0 related types
export interface Auth0User {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  'https://aura-commerce.com/brand'?: Brand;
  'https://aura-commerce.com/roles'?: string[];
  'https://aura-commerce.com/organization_id'?: string;
  'https://aura-commerce.com/is_premium'?: boolean;
}

export interface Auth0Config {
  domain: string;
  clientId: string;
  clientSecret: string;
  audience: string;
  scope: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}

// Enhanced AI types for Auth0 AI use cases
export interface AIAgent {
  id: string;
  type: 'chatbot' | 'background-worker' | 'recommendation-engine';
  userId: string;
  action: string;
  permissions: string[];
  expiresAt: string;
  token: string;
}

export interface StoredToken {
  id: string;
  userId: string;
  tokenType: 'google' | 'github' | 'openai' | 'stripe';
  tokenValue: string;
  metadata?: any;
  createdAt: string;
  expiresAt: string;
}

export interface AsyncAuthorization {
  agentId: string;
  taskType: 'order_processing' | 'inventory_update' | 'recommendation_generation';
  resources: string[];
  permissions: string[];
  expiresAt: string;
  authorizationToken: string;
  constraints: {
    maxOrdersPerMinute: number;
    maxInventoryUpdates: number;
    allowedBrands: string[];
  };
}

export interface AuthorizedDocument {
  id: string;
  title: string;
  content: string;
  accessLevel: 'basic' | 'user' | 'b2b' | 'premium';
  brand?: string;
  userId?: string;
  organizationId?: string;
}

export interface FGAResponse {
  query: string;
  documents: AuthorizedDocument[];
  totalFound: number;
  fgaContext: {
    userId: string;
    roles: string[];
    organizationId?: string;
    brand: string;
    permissions: string[];
  };
}

// Enhanced AIContext with FGA
export interface AIContext {
  user?: string;
  brand?: string;
  roles?: string[];
  organizationId?: string;
  isPremium?: boolean;
  preferences?: {
    categories: string[];
    priceRange: string;
    style: string;
  };
  recentActivity?: {
    lastOrder: string;
    wishlistItems: number;
    totalOrders: number;
  };
  fgaPermissions?: string[];
}

// Enhanced AIMessage with FGA context
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    productId?: string;
    orderId?: string;
    userContext?: {
      userId?: string;
      brand?: string;
      roles?: string[];
      organizationId?: string;
      isPremium?: boolean;
      permissions?: string[];
    };
    messageContext?: any;
    fgaEnforced?: boolean;
  };
}
