import React from 'react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'bars' | 'pulse';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'white';
  className?: string;
  label?: string;
}

const getSizeClasses = (size: SpinnerProps['size']) => {
  switch (size) {
    case 'xs':
      return 'w-3 h-3';
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-8 h-8';
    case 'xl':
      return 'w-12 h-12';
    default:
      return 'w-6 h-6';
  }
};

const getColorClasses = (color: SpinnerProps['color']) => {
  switch (color) {
    case 'primary':
      return 'text-blue-600';
    case 'secondary':
      return 'text-gray-600';
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'danger':
      return 'text-red-600';
    case 'white':
      return 'text-white';
    default:
      return 'text-blue-600';
  }
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  color = 'primary',
  className = '',
  label
}) => {
  const sizeClasses = getSizeClasses(size);
  const colorClasses = getColorClasses(color);

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`flex space-x-1 ${sizeClasses}`}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`
                  w-2 h-2 rounded-full ${colorClasses}
                  animate-bounce
                `}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className={`flex space-x-1 ${sizeClasses}`}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`
                  w-1 bg-current ${colorClasses}
                  animate-pulse
                `}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  height: size === 'xs' ? '12px' : size === 'sm' ? '16px' : size === 'lg' ? '32px' : size === 'xl' ? '48px' : '24px'
                }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={`${sizeClasses} ${colorClasses}`}>
            <div className="w-full h-full rounded-full bg-current animate-ping opacity-75" />
            <div className="absolute inset-0 w-full h-full rounded-full bg-current" />
          </div>
        );

      default:
        return (
          <svg
            className={`${sizeClasses} ${colorClasses} animate-spin`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        {renderSpinner()}
      </div>
      {label && (
        <span className={`ml-2 text-sm ${colorClasses}`}>
          {label}
        </span>
      )}
    </div>
  );
};

export interface LoadingSpinnerProps {
  children?: React.ReactNode;
  loading?: boolean;
  size?: SpinnerProps['size'];
  variant?: SpinnerProps['variant'];
  color?: SpinnerProps['color'];
  className?: string;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  children,
  loading = false,
  size = 'md',
  variant = 'default',
  color = 'primary',
  className = '',
  overlay = false
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  if (overlay && children) {
    return (
      <div className={`relative ${className}`}>
        {children}
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <Spinner size={size} variant={variant} color={color} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Spinner size={size} variant={variant} color={color} />
    </div>
  );
};

export interface SpinnerGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

export const SpinnerGroup: React.FC<SpinnerGroupProps> = ({
  children,
  className = '',
  direction = 'horizontal',
  spacing = 'md'
}) => {
  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';
  const spacingClass = {
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6'
  }[spacing];

  return (
    <div className={`flex ${directionClass} ${spacingClass} ${className}`}>
      {children}
    </div>
  );
}; 