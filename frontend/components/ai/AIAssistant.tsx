'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAI } from '@/components/providers/AIProvider';
import { useBrand } from '@/components/providers/BrandProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistant() {
  const { messages, isOpen, isLoading, sendMessage, toggleChat, closeChat } = useAI();
  const { brand } = useBrand();
  const { isAuthenticated, user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue('');
  };

  const getBrandStyles = () => {
    switch (brand?.name) {
      case 'luxeloom':
        return {
          primaryColor: 'bg-luxeloom-primary',
          secondaryColor: 'bg-luxeloom-secondary',
          textColor: 'text-luxeloom-primary',
          borderColor: 'border-luxeloom-secondary',
        };
      case 'urbanmarket':
        return {
          primaryColor: 'bg-urbanmarket-primary',
          secondaryColor: 'bg-urbanmarket-secondary',
          textColor: 'text-urbanmarket-primary',
          borderColor: 'border-urbanmarket-secondary',
        };
      case 'aura-wholesale':
        return {
          primaryColor: 'bg-aura-wholesale-primary',
          secondaryColor: 'bg-aura-wholesale-secondary',
          textColor: 'text-aura-wholesale-primary',
          borderColor: 'border-aura-wholesale-secondary',
        };
      default:
        return {
          primaryColor: 'bg-gray-900',
          secondaryColor: 'bg-yellow-500',
          textColor: 'text-gray-900',
          borderColor: 'border-yellow-500',
        };
    }
  };

  const styles = getBrandStyles();

  const suggestedQuestions = [
    'What products do you recommend?',
    'How do I track my order?',
    'What are your return policies?',
    ...(isAuthenticated ? ['What\'s my order history?'] : []),
    ...(brand?.isB2B ? ['What\'s my corporate discount?'] : []),
    ...(brand?.name === 'luxeloom' && user?.isPremium ? ['What VIP benefits do I have?'] : []),
  ];

  return (
    <div className="ai-chat-widget">
      {/* Chat Button */}
      <motion.button
        onClick={toggleChat}
        className={`ai-chat-button ${styles.primaryColor} ${styles.textColor} shadow-lg`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="ai-chat-window"
          >
            {/* Header */}
            <div className={`${styles.primaryColor} ${styles.textColor} p-4 rounded-t-lg flex items-center justify-between`}>
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-medium">
                  {brand?.displayName} AI Assistant
                </span>
              </div>
              <button
                onClick={closeChat}
                className="hover:bg-white/10 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Hello! I'm your AI shopping assistant.</p>
                  <p className="text-xs mt-1">How can I help you today?</p>
                  
                  {/* Suggested questions */}
                  <div className="mt-4 space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => sendMessage(question)}
                        className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 p-2 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        message.role === 'user'
                          ? `${styles.primaryColor} ${styles.textColor}`
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0" />
                        )}
                        <div className="text-sm">
                          {message.content}
                        </div>
                        {message.role === 'user' && (
                          <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-gray-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    inputValue.trim() && !isLoading
                      ? `${styles.primaryColor} ${styles.textColor} hover:opacity-80`
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Context info */}
              <div className="mt-2 text-xs text-gray-500">
                {isAuthenticated ? (
                  <span>Logged in as {user?.firstName} {user?.lastName}</span>
                ) : (
                  <span>Guest user - some features may be limited</span>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
