// Auth0 ACUL (Advanced Customization of Universal Login) Configuration
// This file contains the configuration for the auth0-spa-js SDK integration

export interface ACULConfig {
  domain: string;
  clientId: string;
  audience: string;
  scope: string;
  redirectUri: string;
  logoutUrl: string;
  customDomain?: string;
}

export interface BrandACULConfig {
  [key: string]: ACULConfig;
}

// Brand-specific Auth0 configurations for ACUL
export const brandACULConfigs: BrandACULConfig = {
  'www.luxeloom.com': {
    domain: 'luxeloom.auth0.com',
    clientId: 'luxeloom_client_id',
    audience: 'https://api.luxeloom.com',
    scope: 'openid profile email read:products write:orders read:wishlist',
    redirectUri: 'https://www.luxeloom.com/callback',
    logoutUrl: 'https://www.luxeloom.com',
    customDomain: 'www.luxeloom.com'
  },
  'www.urbanmarket.com': {
    domain: 'urbanmarket.auth0.com',
    clientId: 'urbanmarket_client_id',
    audience: 'https://api.urbanmarket.com',
    scope: 'openid profile email read:products write:orders read:wishlist',
    redirectUri: 'https://www.urbanmarket.com/callback',
    logoutUrl: 'https://www.urbanmarket.com',
    customDomain: 'www.urbanmarket.com'
  },
  'b2b.auracommerce.com': {
    domain: 'aura-wholesale.auth0.com',
    clientId: 'aura_wholesale_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders read:users write:users read:organizations',
    redirectUri: 'https://b2b.auracommerce.com/callback',
    logoutUrl: 'https://b2b.auracommerce.com',
    customDomain: 'b2b.auracommerce.com'
  }
};

// Development configurations (for localhost)
export const devACULConfigs: BrandACULConfig = {
  'localhost': {
    domain: 'dev-aura.auth0.com',
    clientId: 'dev_aura_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders',
    redirectUri: 'http://localhost:3000/callback',
    logoutUrl: 'http://localhost:3000'
  },
  'localhost:3000': {
    domain: 'dev-aura.auth0.com',
    clientId: 'dev_aura_client_id',
    audience: 'https://api.auracommerce.com',
    scope: 'openid profile email read:products write:orders',
    redirectUri: 'http://localhost:3000/callback',
    logoutUrl: 'http://localhost:3000'
  }
};

// Get ACUL configuration for current domain
export function getACULConfig(hostname: string): ACULConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return devACULConfigs[hostname] || devACULConfigs['localhost'];
  }
  
  return brandACULConfigs[hostname] || brandACULConfigs['www.luxeloom.com'];
}

// Get Auth0 SDK configuration for auth0-spa-js
export function getAuth0SDKConfig(hostname: string) {
  const config = getACULConfig(hostname);
  
  return {
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      redirect_uri: config.redirectUri,
      audience: config.audience,
      scope: config.scope
    },
    cacheLocation: 'localstorage' as const,
    useRefreshTokens: true,
    // Custom domain configuration
    customDomain: config.customDomain,
    // Advanced options
    advancedOptions: {
      defaultScope: config.scope
    }
  };
}

// Social connection configurations
export const socialConnections = {
  'www.luxeloom.com': ['google', 'apple', 'facebook'],
  'www.urbanmarket.com': ['google', 'apple', 'facebook', 'instagram'],
  'b2b.auracommerce.com': ['google', 'linkedin'],
  'localhost': ['google', 'apple', 'facebook']
};

// Get social connections for current domain
export function getSocialConnections(hostname: string): string[] {
  return socialConnections[hostname as keyof typeof socialConnections] || ['google'];
}

// Passwordless configuration
export const passwordlessConfig = {
  enabled: true,
  methods: ['email', 'sms'] as const,
  emailTemplate: 'magic_link',
  smsTemplate: 'sms_code'
};

// Account linking configuration
export const accountLinkingConfig = {
  enabled: true,
  allowMultipleAccounts: false,
  promptForLinking: true
};

// Multi-factor authentication configuration
export const mfaConfig = {
  enabled: true,
  methods: ['sms', 'push', 'totp'] as const,
  rememberDevice: true,
  skipMFAForRememberedDevices: true
};

// Session configuration
export const sessionConfig = {
  // Session timeout in seconds (24 hours)
  sessionTimeout: 24 * 60 * 60,
  // Refresh token rotation
  refreshTokenRotation: true,
  // Absolute session timeout in seconds (30 days)
  absoluteSessionTimeout: 30 * 24 * 60 * 60
};

// Error handling configuration
export const errorHandlingConfig = {
  // Retry attempts for failed authentication
  maxRetries: 3,
  // Retry delay in milliseconds
  retryDelay: 1000,
  // Error messages
  errorMessages: {
    'consent_required': 'Application consent is required. Please try signing in again.',
    'login_required': 'Please sign in again to continue.',
    'access_denied': 'Access was denied. Please try again.',
    'invalid_grant': 'Your session has expired. Please sign in again.',
    'server_error': 'Authentication service is temporarily unavailable. Please try again later.',
    'network_error': 'Network connection error. Please check your internet connection and try again.'
  }
};

// Security configuration
export const securityConfig = {
  // CSRF protection
  csrfProtection: true,
  // PKCE (Proof Key for Code Exchange)
  pkce: true,
  // State parameter validation
  stateValidation: true,
  // Nonce validation for ID tokens
  nonceValidation: true
};

// Analytics and monitoring configuration
export const analyticsConfig = {
  // Track authentication events
  trackAuthEvents: true,
  // Track user sessions
  trackSessions: true,
  // Track errors
  trackErrors: true,
  // Custom event tracking
  customEvents: {
    'user_login': true,
    'user_logout': true,
    'user_registration': true,
    'social_login': true,
    'mfa_challenge': true
  }
};

// Helper functions for ACUL integration
export const aculHelpers = {
  // Get current hostname
  getCurrentHostname(): string {
    if (typeof window !== 'undefined') {
      return window.location.hostname;
    }
    return 'localhost';
  },

  // Get current brand configuration
  getCurrentBrandConfig(): ACULConfig {
    const hostname = this.getCurrentHostname();
    return getACULConfig(hostname);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const user = localStorage.getItem('auth0_user');
    const token = localStorage.getItem('auth0_access_token');
    
    return !!(user && token);
  },

  // Get stored user data
  getStoredUser(): any {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('auth0_user');
    return userData ? JSON.parse(userData) : null;
  },

  // Get stored access token
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('auth0_access_token');
  },

  // Clear stored authentication data
  clearStoredAuth(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('auth0_user');
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('auth0_brand');
    localStorage.removeItem('user_context');
  },

  // Validate token expiration
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (error) {
      return true; // Consider invalid tokens as expired
    }
  },

  // Get token expiration time
  getTokenExpiration(token: string): Date | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch (error) {
      return null;
    }
  }
};
