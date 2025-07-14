'use client';

import React from 'react';
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'text' | 'white';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: React.CSSProperties;
}

const getVariantClasses = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-main hover:bg-primary-main text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
    case 'outline':
      return 'border-2 border-primary-main text-primary-main hover:bg-primary-main hover:text-white transform hover:scale-105 active:scale-95';
    case 'ghost':
      return 'text-gray-700 hover:bg-gray-100 transform hover:scale-105 active:scale-95';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
    case 'text':
      return 'text-gray-700 hover:bg-gray-100 transform hover:scale-105 active:scale-95';
    case 'white':
      return 'bg-white text-secondary-main hover:bg-gray-100 hover:text-secondary-main';
    default:
      return '  shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95';
  }
};

const getSizeClasses = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  style,
  className = '',
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = `inline-flex items-center justify-center font-medium transition-all duration-200 ${variant === 'text' ? 'text-gray-700 hover:bg-gray-100 transform hover:scale-105 active:scale-95 rounded-full py-1' : 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main rounded-lg'}`
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'cursor-not-allowed opacity-60 transform-none' : 'cursor-pointer';

  const content = (
    <>
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2 animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClass} ${disabledClass} ${className}`}
    >
      {content}
    </button>
  );
}; 