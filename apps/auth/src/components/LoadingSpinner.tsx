'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'جاري التحميل...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ color: 'white', textAlign: 'center' }}
      >
        <div 
          className={`${sizeClasses[size]} border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4`}
        ></div>
        <p className="text-white">{message}</p>
      </motion.div>
    </div>
  );
}; 