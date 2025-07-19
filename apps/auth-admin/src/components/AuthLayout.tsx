'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-main to-primary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">3DE</h1>
          <h2 className="text-xl font-semibold text-white mb-1">{title}</h2>
          {subtitle && (
            <p className="text-white/80 text-sm">{subtitle}</p>
          )}
        </motion.div> */}
        
        {children}
      </div>
    </div>
  );
}; 