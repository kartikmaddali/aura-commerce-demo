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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { brand } = useBrand();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data for demo purposes
  const mockUser: User = {
    id: 'user_123',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    brand: brand?.name as any || 'luxeloom',
    roles: brand?.isB2B ? ['buyer'] : ['customer'],
    organizationId: brand?.isB2B ? 'org_123' : undefined,
    isPremium: brand?.name === 'luxeloom',
    linkedAccounts: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    // Simulate Auth0 initialization
    const initAuth = async () => {
      try {
        if (brand) {
          const config = getAuth0SDKConfig(brand.domain);
          console.log('Auth0 config for', brand.domain, ':', config);
          
          // In a real implementation, this would initialize Auth0 SDK
          // and check for existing session
          
          // For demo purposes, we'll simulate a logged-in user
          setTimeout(() => {
            setUser(mockUser);
            setIsLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initAuth();
  }, [brand]);

  const login = async () => {
    setIsLoading(true);
    try {
      // Placeholder for Auth0 login
      console.log('Auth0 login would be triggered here');
      
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Placeholder for Auth0 logout
      console.log('Auth0 logout would be triggered here');
      
      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async () => {
    setIsLoading(true);
    try {
      // Placeholder for Auth0 registration
      console.log('Auth0 registration would be triggered here');
      
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithSocial = async (provider: string) => {
    setIsLoading(true);
    try {
      // Placeholder for social login
      console.log(`Auth0 ${provider} login would be triggered here`);
      
      // Simulate social login process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        ...mockUser,
        linkedAccounts: {
          ...mockUser.linkedAccounts,
          [provider]: `linked_${provider}_account`,
        },
      });
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMagicLink = async (email: string) => {
    setIsLoading(true);
    try {
      // Placeholder for magic link login
      console.log(`Auth0 magic link would be sent to ${email}`);
      
      // Simulate magic link process
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, user would click link in email
    } catch (error) {
      console.error('Magic link error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const linkAccount = async (provider: string) => {
    try {
      // Placeholder for account linking
      console.log(`Auth0 account linking with ${provider} would be triggered here`);
      
      // Simulate account linking
      if (user) {
        setUser({
          ...user,
          linkedAccounts: {
            ...user.linkedAccounts,
            [provider]: `linked_${provider}_account`,
          },
        });
      }
    } catch (error) {
      console.error('Account linking error:', error);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return auth0Helpers.hasRole(user as any, role);
  };

  const isPremium = user ? auth0Helpers.isPremium(user as any) : false;
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
