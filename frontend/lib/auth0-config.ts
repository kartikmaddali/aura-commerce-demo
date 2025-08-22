import { Auth0Config } from '@/types/types';
import { getBrandConfig } from '@/types/brand-configs';

// Auth0 Configuration for Multi-Domain Setup
// This file contains placeholder configurations for Auth0 integration
// In a real implementation, these would be environment variables

export const getAuth0Config = (domain: string): Auth0Config => {
  const brandConfig = getBrandConfig(domain);
  
  // Real Auth0 configuration using environment variables
  const configs: Record<string, Auth0Config> = {
    'www.luxeloom.com': {
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
      clientSecret: '', // Not needed for SPA
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://api.auracommerce.com',
      scope: 'openid profile email read:products write:orders read:wishlist',
    },
    'www.urbanmarket.com': {
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
      clientSecret: '', // Not needed for SPA
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://api.auracommerce.com',
      scope: 'openid profile email read:products write:orders read:wishlist',
    },
    'b2b.auracommerce.com': {
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
      clientSecret: '', // Not needed for SPA
      audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || 'https://api.auracommerce.com',
      scope: 'openid profile email read:products write:orders read:users write:users read:organizations',
    },
  };
  
  return configs[domain] || configs['www.luxeloom.com'];
};

// Auth0 SDK Configuration
export const getAuth0SDKConfig = (domain: string) => {
  const config = getAuth0Config(domain);
  
  return {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      audience: config.audience,
      scope: config.scope,
    },
    // Custom domain configuration
    customDomain: domain,
    // Social login providers
    socialConnections: ['google', 'apple', 'facebook'],
    // Passwordless configuration
    passwordless: {
      enabled: true,
      methods: ['email', 'sms'],
    },
    // Account linking configuration
    accountLinking: {
      enabled: true,
      allowMultipleAccounts: false,
    },
  };
};

// Auth0 Rules and Actions (placeholder)
export const auth0Rules = {
  // Rule to set brand-specific custom claims
  setBrandClaims: `
    function (user, context, callback) {
      const brand = context.request.hostname;
      context.idToken['https://aura-commerce.com/brand'] = brand;
      context.accessToken['https://aura-commerce.com/brand'] = brand;
      
      // Set default roles based on brand
      if (brand === 'b2b.auracommerce.com') {
        context.idToken['https://aura-commerce.com/roles'] = ['buyer'];
        context.accessToken['https://aura-commerce.com/roles'] = ['buyer'];
      } else {
        context.idToken['https://aura-commerce.com/roles'] = ['customer'];
        context.accessToken['https://aura-commerce.com/roles'] = ['customer'];
      }
      
      callback(null, user, context);
    }
  `,
  
  // Rule to handle premium membership for LuxeLoom
  setPremiumMembership: `
    function (user, context, callback) {
      if (context.request.hostname === 'www.luxeloom.com') {
        // Check if user has premium membership
        // This would typically query a database or external service
        const isPremium = user.app_metadata && user.app_metadata.isPremium;
        
        if (isPremium) {
          context.idToken['https://aura-commerce.com/is_premium'] = true;
          context.accessToken['https://aura-commerce.com/is_premium'] = true;
          
          // Add premium role
          const roles = context.idToken['https://aura-commerce.com/roles'] || [];
          if (!roles.includes('premium-member')) {
            roles.push('premium-member');
            context.idToken['https://aura-commerce.com/roles'] = roles;
            context.accessToken['https://aura-commerce.com/roles'] = roles;
          }
        }
      }
      
      callback(null, user, context);
    }
  `,
  
  // Rule to handle B2B organization assignment
  setB2BOrganization: `
    function (user, context, callback) {
      if (context.request.hostname === 'b2b.auracommerce.com') {
        // Set organization ID from user metadata
        if (user.app_metadata && user.app_metadata.organizationId) {
          context.idToken['https://aura-commerce.com/organization_id'] = user.app_metadata.organizationId;
          context.accessToken['https://aura-commerce.com/organization_id'] = user.app_metadata.organizationId;
        }
      }
      
      callback(null, user, context);
    }
  `,
};

// Auth0 Actions (placeholder)
export const auth0Actions = {
  // Post-login action to sync user data
  postLogin: `
    exports.onExecutePostLogin = async (event, api) => {
      const { user, request } = event;
      
      // Sync user profile with our database
      // This would typically make an API call to your backend
      
      // Set custom claims based on user data
      if (user.app_metadata && user.app_metadata.organizationId) {
        api.idToken.setCustomClaim('https://aura-commerce.com/organization_id', user.app_metadata.organizationId);
        api.accessToken.setCustomClaim('https://aura-commerce.com/organization_id', user.app_metadata.organizationId);
      }
      
      if (user.app_metadata && user.app_metadata.isPremium) {
        api.idToken.setCustomClaim('https://aura-commerce.com/is_premium', true);
        api.accessToken.setCustomClaim('https://aura-commerce.com/is_premium', true);
      }
    };
  `,
  
  // Pre-user-registration action
  preUserRegistration: `
    exports.onExecutePreUserRegistration = async (event, api) => {
      const { user, request } = event;
      
      // Validate user data before registration
      // Set default roles and permissions
      
      if (request.hostname === 'b2b.auracommerce.com') {
        api.user.setAppMetadata('defaultRole', 'buyer');
      } else {
        api.user.setAppMetadata('defaultRole', 'customer');
      }
    };
  `,
};

// Fine-Grained Authorization (FGA) policies (placeholder)
export const fgaPolicies = {
  // B2C policies
  b2c: {
    // Premium member can access VIP lounge
    'premium-member:read:vip-lounge': {
      description: 'Premium members can access VIP lounge',
      relation: 'can_read',
      object: 'vip-lounge',
      user: 'premium-member',
    },
    
    // Authenticated users can manage wishlist
    'authenticated:write:wishlist': {
      description: 'Authenticated users can manage their wishlist',
      relation: 'can_write',
      object: 'wishlist',
      user: 'authenticated',
    },
  },
  
  // B2B policies
  b2b: {
    // Admin can manage users in their organization
    'admin:write:users': {
      description: 'Admins can manage users in their organization',
      relation: 'can_write',
      object: 'users',
      user: 'admin',
      condition: 'same_organization',
    },
    
    // Admin can approve orders in their organization
    'admin:write:orders': {
      description: 'Admins can approve orders in their organization',
      relation: 'can_write',
      object: 'orders',
      user: 'admin',
      condition: 'same_organization',
    },
    
    // Buyer can read orders in their organization
    'buyer:read:orders': {
      description: 'Buyers can read orders in their organization',
      relation: 'can_read',
      object: 'orders',
      user: 'buyer',
      condition: 'same_organization',
    },
  },
};

// Helper functions for Auth0 integration
export const auth0Helpers = {
  // Get user roles from JWT
  getUserRoles: (user: any): string[] => {
    return user['https://aura-commerce.com/roles'] || [];
  },
  
  // Check if user has specific role
  hasRole: (user: any, role: string): boolean => {
    const roles = auth0Helpers.getUserRoles(user);
    return roles.includes(role);
  },
  
  // Check if user is premium (LuxeLoom)
  isPremium: (user: any): boolean => {
    return user['https://aura-commerce.com/is_premium'] || false;
  },
  
  // Get user's organization ID (B2B)
  getOrganizationId: (user: any): string | undefined => {
    return user['https://aura-commerce.com/organization_id'];
  },
  
  // Get user's brand
  getBrand: (user: any): string => {
    return user['https://aura-commerce.com/brand'] || 'luxeloom';
  },
};
