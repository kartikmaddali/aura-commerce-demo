'use client';

import React, { createContext, useContext, useState } from 'react';
import { AIMessage, AIContext } from '@/types/types';
import { useAuth } from './AuthProvider';
import { useBrand } from './BrandProvider';

interface AIProviderContextType {
  messages: AIMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  closeChat: () => void;
  clearMessages: () => void;
}

const AIProviderContext = createContext<AIProviderContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { brand } = useBrand();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Placeholder for AI API call
      console.log('AI message would be sent to backend:', content);
      
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiContext: AIContext = {
        user: user!,
        brand: brand?.name as any || 'luxeloom',
        recentOrders: [],
        wishlist: [],
        organization: user?.organizationId ? {
          id: user.organizationId,
          name: 'Demo Organization',
          discount: 0.15,
        } : undefined,
      };

      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(content, aiContext),
        timestamp: new Date().toISOString(),
        context: {
          userContext: aiContext,
        },
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI message error:', error);
      
      const errorMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string, context: AIContext): string => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses based on user state and brand
    if (message.includes('order') || message.includes('purchase')) {
      if (context.organization) {
        return `I can help you with your order! As a ${context.organization.name} buyer, you have a ${(context.organization.discount * 100)}% corporate discount. Would you like me to check your recent orders or help you place a new one?`;
      } else {
        return 'I can help you with your order! Would you like me to check your recent orders or help you place a new one?';
      }
    }
    
    if (message.includes('product') || message.includes('item')) {
      return `I can help you find products! I have access to our full catalog. What type of product are you looking for? I can also provide care instructions and styling tips.`;
    }
    
    if (message.includes('discount') || message.includes('sale')) {
      if (context.organization) {
        return `As a ${context.organization.name} buyer, you have a ${(context.organization.discount * 100)}% corporate discount on all orders. This discount is automatically applied at checkout.`;
      } else {
        return 'I can help you find current sales and promotions! We have various discounts available. What type of product are you interested in?';
      }
    }
    
    if (message.includes('premium') || message.includes('vip')) {
      if (context.user.isPremium) {
        return 'Welcome to the VIP experience! As a premium member, you have exclusive access to early product releases, special events, and personalized styling consultations.';
      } else {
        return 'Premium membership offers exclusive benefits including early access to new collections, VIP events, and personalized styling. Would you like to learn more about upgrading?';
      }
    }
    
    if (message.includes('help') || message.includes('support')) {
      return 'I\'m here to help! I can assist with product recommendations, order status, account questions, and more. What can I help you with today?';
    }
    
    // Default response
    return `Thank you for your message! I'm your AI shopping assistant for ${context.brand === 'luxeloom' ? 'LuxeLoom' : context.brand === 'urbanmarket' ? 'UrbanMarket' : 'Aura Wholesale'}. I can help you with product recommendations, order status, and any questions you might have. How can I assist you today?`;
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: AIProviderContextType = {
    messages,
    isOpen,
    isLoading,
    sendMessage,
    toggleChat,
    closeChat,
    clearMessages,
  };

  return (
    <AIProviderContext.Provider value={value}>
      {children}
    </AIProviderContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIProviderContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}
