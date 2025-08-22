'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useBrand } from '@/components/providers/BrandProvider';
import { User, Settings, LogOut, Heart, Crown, Building, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserMenuProps {
  user: any;
}

export function UserMenu({ user }: UserMenuProps) {
  const { logout } = useAuth();
  const { brand } = useBrand();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const getBrandStyles = () => {
    switch (brand?.name) {
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

  const menuItems = brand?.isB2B 
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: Building },
        { name: 'Orders', href: '/orders', icon: Building },
        { name: 'Users', href: '/users', icon: User },
        { name: 'Analytics', href: '/analytics', icon: Building },
        { name: 'Settings', href: '/settings', icon: Settings },
      ]
    : [
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Orders', href: '/orders', icon: Building },
        { name: 'Wishlist', href: '/wishlist', icon: Heart },
        ...(brand?.name === 'luxeloom' && user?.['https://aura-commerce.com/is_premium'] ? [{ name: 'VIP Lounge', href: '/vip-lounge', icon: Crown }] : []),
        { name: 'Settings', href: '/settings', icon: Settings },
      ];

  return (
    <div className="relative" ref={menuRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {user.firstName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              
              {/* Premium Badge */}
              {brand?.name === 'luxeloom' && user?.['https://aura-commerce.com/is_premium'] && (
                <div className="flex items-center space-x-1 mt-2">
                  <Crown className="w-3 h-3 text-luxeloom-secondary" />
                  <span className="text-xs text-luxeloom-secondary font-medium">VIP Member</span>
                </div>
              )}
              
              {/* B2B Role */}
              {brand?.isB2B && (
                <div className="flex items-center space-x-1 mt-2">
                  <Building className="w-3 h-3 text-aura-wholesale-secondary" />
                  <span className="text-xs text-aura-wholesale-secondary font-medium capitalize">
                    {user.roles?.[0] || 'User'}
                  </span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-1" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
