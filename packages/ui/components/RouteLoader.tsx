'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouteLoading } from '../hooks/useRouteLoading';

interface RouteLoaderProps {
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Custom background color (overrides default gradient)
   */
  backgroundColor?: string;
  /**
   * Custom spinner color
   */
  spinnerColor?: string;
  /**
   * Custom spinner size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom z-index
   */
  zIndex?: number;
  /**
   * Show loading text
   */
  showText?: boolean;
  /**
   * Custom loading text
   */
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
  const { isRouteChanging } = useRouteLoading();

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

  return (
    <AnimatePresence>
      {isRouteChanging && (
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

            {/* Pulse Effect */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-white/10"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export default for convenience
export default RouteLoader; 