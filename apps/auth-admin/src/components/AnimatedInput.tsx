'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@3de/ui';

interface AnimatedInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  helperText,
  icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  disabled = false,
  required = false,
  animationType = 'slide'
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const animationVariants = {
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      focus: { scale: 1.02 },
      transition: { duration: 0.3 }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      focus: { scale: 1.01 },
      transition: { duration: 0.2 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      focus: { scale: 1.03 },
      transition: { duration: 0.3 }
    }
  };

  const selectedAnimation = animationVariants[animationType];

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      whileFocus={selectedAnimation.focus}
      transition={selectedAnimation.transition}
      style={{ width: '100%' }}
    >
      <Input
        label={label}
        error={error}
        helperText={helperText}
        icon={icon}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
        disabled={disabled}
        required={required}
      />
    </motion.div>
  );
};

// مكون للحقل مع تأثيرات متقدمة
interface AdvancedAnimatedInputProps extends AnimatedInputProps {
  showCharacterCount?: boolean;
  maxLength?: number;
  successMessage?: string;
}

export const AdvancedAnimatedInput: React.FC<AdvancedAnimatedInputProps> = ({
  showCharacterCount = false,
  maxLength,
  successMessage,
  value = '',
  ...props
}) => {
  const characterCount = value.length;
  const isAtMaxLength = maxLength && characterCount >= maxLength;
  const showSuccess = successMessage && characterCount > 0 && !props.error;

  return (
    <div className="space-y-2">
      <AnimatedInput {...props} value={value} />
      
      {(showCharacterCount || showSuccess) && (
        <div className="flex justify-between items-center text-sm">
          {showCharacterCount && maxLength && (
            <span className={`${isAtMaxLength ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount}/{maxLength}
            </span>
          )}
          
          {showSuccess && (
            <span className="text-green-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </span>
          )}
        </div>
      )}
    </div>
  );
}; 