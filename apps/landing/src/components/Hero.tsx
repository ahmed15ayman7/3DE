'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@3de/ui';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  backgroundImage?: string;
  gradient?: 'primary' | 'secondary' | 'custom';
  customGradient?: string;
  pattern?: boolean;
  overlay?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alignment?: 'center' | 'left' | 'right';
  children?: ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: 'min-h-[50vh] py-16',
  md: 'min-h-[60vh] py-20',
  lg: 'min-h-[80vh] py-24',
  xl: 'min-h-screen py-32',
};

const gradientClasses = {
  primary: 'bg-gradient-to-br from-primary-50 via-white to-primary-100',
  secondary: 'bg-gradient-to-br from-secondary-50 via-white to-secondary-100',
  custom: '',
};

export default function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  gradient = 'primary',
  customGradient,
  pattern = true,
  overlay = false,
  size = 'lg',
  alignment = 'center',
  children,
  className = '',
}: HeroProps) {
  const alignmentClasses = {
    center: 'text-center items-center',
    left: 'text-right items-start',
    right: 'text-left items-end',
  };

  const containerStyles = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <section
      className={`relative ${sizeClasses[size]} ${
        backgroundImage ? 'bg-cover bg-center' : gradientClasses[gradient]
      } overflow-hidden flex items-center ${className}`}
      style={{
        ...containerStyles,
        ...(customGradient && gradient === 'custom' ? { background: customGradient } : {}),
      }}
    >
      {/* Background Pattern */}
      {pattern && (
        <div className="absolute inset-0 opacity-30">
          <div className="bg-pattern h-full w-full"></div>
        </div>
      )}

      {/* Overlay */}
      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-black/40"></div>
      )}

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 right-20 w-20 h-20 bg-primary-200/30 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-20 left-20 w-32 h-32 bg-secondary-200/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute top-1/2 left-10 w-16 h-16 bg-primary-300/25 rounded-full blur-lg"
        />
      </div>

      <div className="container relative z-10">
        <div className={`max-w-5xl mx-auto flex flex-col ${alignmentClasses[alignment]}`}>
          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-dark rounded-full text-sm font-medium">
                {subtitle}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`hero-title ${backgroundImage && overlay ? 'text-white' : 'text-text-primary'}`}
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`hero-subtitle max-w-3xl ${
                backgroundImage && overlay ? 'text-gray-200' : 'text-text-secondary'
              }`}
            >
              {description}
            </motion.p>
          )}

          {/* Action Buttons */}
          {(primaryAction || secondaryAction) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:space-y-0  mt-8"
            >
              {primaryAction && (
                primaryAction.href ? (
                  <a href={primaryAction.href}>
                    <Button
                      size="lg"
                      className="bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                      {primaryAction.label}
                    </Button>
                  </a>
                ) : (
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                )
              )}

              {secondaryAction && (
                secondaryAction.href ? (
                  <a href={secondaryAction.href}>
                    <Button
                      variant="outline"
                      size="lg"
                      className={`transform hover:scale-105 transition-all duration-200 ${
                        backgroundImage && overlay
                          ? 'border-white text-white hover:bg-white hover:text-gray-900'
                          : 'border-primary-main text-primary-main hover:bg-primary-main hover:text-white'
                      }`}
                    >
                      {secondaryAction.label}
                    </Button>
                  </a>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    className={`transform hover:scale-105 transition-all duration-200 ${
                      backgroundImage && overlay
                        ? 'border-white text-white hover:bg-white hover:text-gray-900'
                        : 'border-primary-main text-primary-main hover:bg-primary-main hover:text-white'
                    }`}
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                )
              )}
            </motion.div>
          )}

          {/* Custom Children */}
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            backgroundImage && overlay
              ? 'border-white/50'
              : 'border-primary-main/50'
          }`}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-1.5 h-1.5 rounded-full mt-2 ${
              backgroundImage && overlay ? 'bg-white/70' : 'bg-primary-main/70'
            }`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 