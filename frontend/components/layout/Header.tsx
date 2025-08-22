'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useBrand } from '@/components/providers/BrandProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { UserMenu } from '@/components/auth/UserMenu';
import { SearchBar } from '@/components/ui/SearchBar';
import { ShoppingCart, User, Menu, X, Heart, Crown } from 'lucide-react';

export function Header() {
  const { brand } = useBrand();
  const { user, isAuthenticated, login } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!brand) return null;

  const getBrandStyles = () => {
    switch (brand.name) {
      case 'luxeloom':
        return {
          primaryColor: 'bg-luxeloom-primary',
          secondaryColor: 'bg-luxeloom-secondary',
          textColor: 'text-white',
          hoverColor: 'hover:bg-gray-800',
        };
      case 'urbanmarket':
        return {
          primaryColor: 'bg-urbanmarket-primary',
          secondaryColor: 'bg-urbanmarket-secondary',
          textColor: 'text-white',
          hoverColor: 'hover:bg-blue-700',
        };
      case 'aura-wholesale':
        return {
          primaryColor: 'bg-aura-wholesale-primary',
          secondaryColor: 'bg-aura-wholesale-secondary',
          textColor: 'text-white',
          hoverColor: 'hover:bg-green-700',
        };
      default:
        return {
          primaryColor: 'bg-gray-900',
          secondaryColor: 'bg-yellow-500',
          textColor: 'text-white',
          hoverColor: 'hover:bg-gray-800',
        };
    }
  };

  const styles = getBrandStyles();

  const navigationItems = brand.isB2B 
    ? [
        { name: 'Products', href: '/products' },
        { name: 'Orders', href: '/orders' },
        { name: 'Users', href: '/users' },
        { name: 'Analytics', href: '/analytics' },
      ]
    : [
        { name: 'Shop', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'Sale', href: '/sale' },
        ...(brand.name === 'luxeloom' && user?.['https://aura-commerce.com/is_premium'] ? [{ name: 'VIP Lounge', href: '/vip-lounge' }] : []),
      ];

  return (
    <header className={`${styles.primaryColor} ${styles.textColor} shadow-lg`}>
      <div className="container-brand">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-900">
                {brand.displayName.charAt(0)}
              </span>
            </div>
            <span className="text-xl font-bold">{brand.displayName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link hover:text-gray-200 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Premium badge for LuxeLoom */}
            {brand.name === 'luxeloom' && user?.['https://aura-commerce.com/is_premium'] && (
              <div className="flex items-center space-x-1 bg-luxeloom-secondary text-luxeloom-primary px-2 py-1 rounded-full text-xs font-medium">
                <Crown className="w-3 h-3" />
                <span>VIP</span>
              </div>
            )}

            {/* Wishlist (B2C only) */}
            {!brand.isB2B && (
              <Link href="/wishlist" className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="p-2 hover:bg-black/10 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* User menu or login */}
            {isAuthenticated ? (
              <UserMenu user={user!} />
            ) : (
              <a
                href="/auth/login"
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-black/10 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="nav-link hover:text-gray-200 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile search */}
              <div className="pt-4">
                <SearchBar />
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  );
}
