import React from 'react';

export interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-primary-main',
  secondary: 'text-secondary-main',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600'
};

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-current rounded-full ${colorClasses[color]} animate-spin`}
      />
      {text && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}; 