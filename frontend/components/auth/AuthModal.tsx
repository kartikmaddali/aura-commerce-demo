'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useBrand } from '@/components/providers/BrandProvider';
import { X, Mail, Lock, User, Apple, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth();
  const { brand } = useBrand();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  if (!brand) return null;

  const getBrandStyles = () => {
    switch (brand.name) {
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

  const handleLogin = () => {
    login();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            {/* Header */}
            <div className={`${styles.primaryColor} ${styles.textColor} p-6 rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-300 mt-2">
                {isLogin 
                  ? `Sign in to your ${brand.displayName} account`
                  : `Join ${brand.displayName} today`
                }
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Auth0 Login Button */}
              <div className="text-center">
                <button
                  onClick={handleLogin}
                  className={`w-full ${styles.secondaryColor} text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                >
                  Sign In with Auth0
                </button>
                <p className="text-sm text-gray-600 mt-4">
                  Authentication is handled securely by Auth0
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center mt-4">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
