"use client";
import React, { useState } from 'react';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inside';
  animated?: boolean;
  striped?: boolean;
  className?: string;
  onChange?: (value: number) => void;
}

const getVariantClasses = (variant: ProgressProps['variant']) => {
  switch (variant) {
    case 'success':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'danger':
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};

const getSizeClasses = (size: ProgressProps['size']) => {
  switch (size) {
    case 'sm':
      return {
        container: 'h-2',
        label: 'text-xs'
      };
    case 'lg':
      return {
        container: 'h-4',
        label: 'text-base'
      };
    default:
      return {
        container: 'h-3',
        label: 'text-sm'
      };
  }
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelPosition = 'top',
  animated = false,
  striped = false,
  onChange,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const percentage = Math.min(Math.max((internalValue / max) * 100, 0), 100);
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);

  const progressBarClasses = [
    'transition-all duration-300 ease-out',
    variantClasses,
    sizeClasses.container,
    animated && 'animate-pulse',
    striped && 'bg-gradient-to-r from-transparent via-white to-transparent bg-[length:20px_100%] animate-pulse'
  ].filter(Boolean).join(' ');

  const label = `${Math.round(percentage)}%`;

  const handleChange = (value: number) => {
    setInternalValue(value);
    onChange?.(value);
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel && labelPosition === 'top') && (
        <div className={`flex justify-between items-center mb-2 ${sizeClasses.label} text-gray-700`}>
          <span>التقدم</span>
          <span>{label}</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses.container}`}>
        <div
          className={`${progressBarClasses} rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={internalValue}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {(showLabel && labelPosition === 'inside') && (
            <div className="flex items-center justify-center h-full text-white font-medium">
              {label}
            </div>
          )}
        </div>
      </div>
      
      {(showLabel && labelPosition === 'bottom') && (
        <div className={`flex justify-between items-center mt-2 ${sizeClasses.label} text-gray-700`}>
          <span>التقدم</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
};

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 4,
  variant = 'default',
  showLabel = false,
  animated = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = size === 'sm' ? 20 : size === 'lg' ? 40 : 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getVariantColor = (variant: CircularProgressProps['variant']) => {
    switch (variant) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'danger':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className={`transform -rotate-90 ${animated ? 'animate-spin' : ''}`}
        width={radius * 2 + strokeWidth}
        height={radius * 2 + strokeWidth}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke={getVariantColor(variant)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};

export interface ProgressGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

export const ProgressGroup: React.FC<ProgressGroupProps> = ({
  children,
  className = '',
  direction = 'vertical',
  spacing = 'md'
}) => {
  const directionClass = direction === 'horizontal' ? 'flex-row space-x-4' : 'flex-col space-y-4';
  const spacingClass = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  }[spacing];

  return (
    <div className={`flex ${directionClass} ${spacingClass} ${className}`}>
      {children}
    </div>
  );
}; 