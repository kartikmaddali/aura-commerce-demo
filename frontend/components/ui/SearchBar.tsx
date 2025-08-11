'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useBrand } from '@/components/providers/BrandProvider';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder, onSearch, className = '' }: SearchBarProps) {
  const { brand } = useBrand();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const clearQuery = () => {
    setQuery('');
  };

  const getBrandStyles = () => {
    switch (brand?.name) {
      case 'luxeloom':
        return {
          focusRing: 'focus:ring-luxeloom-secondary',
          borderColor: 'border-gray-300 focus:border-luxeloom-secondary',
        };
      case 'urbanmarket':
        return {
          focusRing: 'focus:ring-urbanmarket-secondary',
          borderColor: 'border-gray-300 focus:border-urbanmarket-secondary',
        };
      case 'aura-wholesale':
        return {
          focusRing: 'focus:ring-aura-wholesale-secondary',
          borderColor: 'border-gray-300 focus:border-aura-wholesale-secondary',
        };
      default:
        return {
          focusRing: 'focus:ring-blue-500',
          borderColor: 'border-gray-300 focus:border-blue-500',
        };
    }
  };

  const styles = getBrandStyles();

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || `Search ${brand?.displayName || 'products'}...`}
          className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 ${styles.focusRing} ${styles.borderColor} text-sm`}
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
