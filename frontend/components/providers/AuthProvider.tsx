'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Auth0User } from '@/types/types';
import { useBrand } from './BrandProvider';
import { getAuth0SDKConfig, auth0Helpers } from '@/lib/auth0-config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
  loginWithSocial: (provider: string) => Promise<void>;
  loginWithMagicLink: (email: string) => Promise<void>;
  linkAccount: (provider: string) => Promise<void>;
  hasRole: (role: string) => boolean;
  isPremium: boolean;
  organizationId?: string;
  accessToken?: string;
  refreshToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { brand } = useBrand();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  // Initialize Auth0 and check authentication status
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (brand) {
          // Check if we have stored authentication data
          const storedUser = localStorage.getItem('auth0_user');
          const storedToken = localStorage.getItem('auth0_access_token');
          const storedBrand = localStorage.getItem('auth0_brand');

          if (storedUser && storedToken && storedBrand === brand.name) {
            // We have stored authentication data
            const auth0User: Auth0User = JSON.parse(storedUser);
            const token = storedToken;

            // Convert Auth0 user to our User type
            const user: User = {
              id: auth0User.sub,
              email: auth0User.email || '',
              firstName: (auth0User as any).given_name || '',
              lastName: (auth0User as any).family_name || '',
              brand: brand.name as any,
              roles: auth0User['https://aura-commerce.com/roles'] || [],
              organizationId: auth0User['https://aura-commerce.com/organization_id'],
              isPremium: auth0User['https://aura-commerce.com/is_premium'] || false,
              linkedAccounts: {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            setUser(user);
            setAccessToken(token);
          } else {
            // No stored authentication data, check if we're on a callback page
            if (window.location.pathname === '/callback') {
              // Let the callback page handle the authentication
              return;
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any corrupted data
        clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [brand]);

  // Clear stored authentication data
  const clearStoredAuth = () => {
    localStorage.removeItem('auth0_user');
    localStorage.removeItem('auth0_access_token');
    localStorage.removeItem('auth0_brand');
    localStorage.removeItem('user_context');
    setUser(null);
    setAccessToken(undefined);
  };

  // Login function - redirects to ACUL login page
  const login = async () => {
    try {
      // Redirect to the ACUL login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function - redirects to ACUL logout page
  const logout = async () => {
    try {
      // Clear local data first
      clearStoredAuth();
      
      // Redirect to the ACUL logout page
      window.location.href = '/logout';
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Register function - redirects to ACUL login page with registration mode
  const register = async () => {
    try {
      // Redirect to the ACUL login page with registration parameters
      window.location.href = '/login?mode=signup';
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Social login function
  const loginWithSocial = async (provider: string) => {
    try {
      // Redirect to the ACUL login page with social provider parameter
      window.location.href = `/login?connection=${provider}`;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw error;
    }
  };

  // Magic link login function
  const loginWithMagicLink = async (email: string) => {
    try {
      // Redirect to the ACUL login page with magic link parameters
      window.location.href = `/login?mode=magic_link&email=${encodeURIComponent(email)}`;
    } catch (error) {
      console.error('Magic link error:', error);
      throw error;
    }
  };

  // Account linking function
  const linkAccount = async (provider: string) => {
    try {
      // Redirect to account linking page
      window.location.href = `/login?mode=link&connection=${provider}`;
    } catch (error) {
      console.error('Account linking error:', error);
      throw error;
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<string> => {
    try {
      // In a real implementation, this would use Auth0's refresh token functionality
      // For now, we'll redirect to login if the token is expired
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Check if token is expired (simplified check)
      const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (tokenData.exp < now) {
        // Token is expired, redirect to login
        await login();
        throw new Error('Token expired, redirecting to login');
      }

      return accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  };

  // Role checking function
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return auth0Helpers.hasRole(user as any, role);
  };

  // Premium status
  const isPremium = user ? auth0Helpers.isPremium(user as any) : false;
  
  // Organization ID
  const organizationId = user ? auth0Helpers.getOrganizationId(user as any) : undefined;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    loginWithSocial,
    loginWithMagicLink,
    linkAccount,
    hasRole,
    isPremium,
    organizationId,
    accessToken,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
