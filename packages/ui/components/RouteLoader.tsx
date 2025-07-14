'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouteLoaderProps {
  className?: string;
  backgroundColor?: string;
  spinnerColor?: string;
  size?: 'sm' | 'md' | 'lg';
  zIndex?: number;
  showText?: boolean;
  loadingText?: string;
}

export const RouteLoader: React.FC<RouteLoaderProps> = ({
  className = '',
  backgroundColor,
  spinnerColor,
  size = 'md',
  zIndex = 9999,
  showText = false,
  loadingText = 'جاري التحميل...'
}) => {
    let [isLoading, setIsLoading] = useState(true);
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getSpinnerColor = () => {
    if (spinnerColor) return spinnerColor;
    return 'border-primary-main';
  };

  const getBackgroundStyle = () => {
    if (backgroundColor) {
      return { backgroundColor };
    }
    return {
      background: 'linear-gradient(135deg, var(--primary-main) 0%, var(--primary-dark) 100%)'
    };
  };
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 flex items-center justify-center ${className}`}
        style={{
          zIndex,
          ...getBackgroundStyle()
        }}
      >
        <div className="text-center">
          {/* Spinner */}
          <motion.div
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 360 
            }}
            transition={{ 
              scale: { duration: 0.3 },
              rotate: { 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
            className={`${getSizeClasses()} mx-auto mb-4`}
          >
            <div
              className={`w-full h-full border-4 border-white/20 border-t-white rounded-full ${getSpinnerColor()}`}
              style={{
                borderTopColor: spinnerColor || 'var(--primary-main)'
              }}
            />
          </motion.div>

          {/* Loading Text */}
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-white text-lg font-medium"
            >
              {loadingText}
            </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteLoader; 