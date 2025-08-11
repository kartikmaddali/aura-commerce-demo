'use client';

import React from 'react';
import Link from 'next/link';
import { useBrand } from '@/components/providers/BrandProvider';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

export function Footer() {
  const { brand } = useBrand();

  if (!brand) return null;

  const getBrandStyles = () => {
    switch (brand.name) {
      case 'luxeloom':
        return {
          primaryColor: 'bg-luxeloom-primary',
          secondaryColor: 'text-luxeloom-secondary',
          textColor: 'text-white',
        };
      case 'urbanmarket':
        return {
          primaryColor: 'bg-urbanmarket-primary',
          secondaryColor: 'text-urbanmarket-secondary',
          textColor: 'text-white',
        };
      case 'aura-wholesale':
        return {
          primaryColor: 'bg-aura-wholesale-primary',
          secondaryColor: 'text-aura-wholesale-secondary',
          textColor: 'text-white',
        };
      default:
        return {
          primaryColor: 'bg-gray-900',
          secondaryColor: 'text-yellow-500',
          textColor: 'text-white',
        };
    }
  };

  const styles = getBrandStyles();

  const footerLinks = brand.isB2B 
    ? [
        { name: 'Products', href: '/products' },
        { name: 'Orders', href: '/orders' },
        { name: 'Users', href: '/users' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Support', href: '/support' },
      ]
    : [
        { name: 'Shop', href: '/products' },
        { name: 'Categories', href: '/categories' },
        { name: 'Sale', href: '/sale' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
      ];

  const socialLinks = brand.isB2B 
    ? [
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Mail, href: 'mailto:business@auracommerce.com', label: 'Email' },
      ]
    : [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Instagram, href: '#', label: 'Instagram' },
      ];

  return (
    <footer className={`${styles.primaryColor} ${styles.textColor}`}>
      <div className="container-brand py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">
                  {brand.displayName.charAt(0)}
                </span>
              </div>
              <span className="text-xl font-bold">{brand.displayName}</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {brand.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`${styles.secondaryColor} hover:opacity-80 transition-opacity`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>
                  {brand.isB2B 
                    ? 'business@auracommerce.com'
                    : `hello@${brand.domain.replace('www.', '')}`
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2024 {brand.displayName}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            {!brand.isB2B && (
              <Link href="/returns" className="text-gray-300 hover:text-white text-sm transition-colors">
                Returns & Exchanges
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
