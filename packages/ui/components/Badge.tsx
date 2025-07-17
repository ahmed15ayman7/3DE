import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const getVariantClasses = (variant: BadgeProps['variant']) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'secondary':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'success':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'danger':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'info':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'outline':
      return 'bg-transparent text-gray-600 border-gray-300';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getSizeClasses = (size: BadgeProps['size']) => {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs';
    case 'lg':
      return 'px-3 py-1.5 text-base';
    default:
      return 'px-2.5 py-1 text-sm';
  }
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  removable = false,
  onRemove,
  className = '',
  icon
}) => {
  const baseClasses = 'inline-flex items-center font-medium border transition-all duration-200';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const roundedClass = rounded ? 'rounded-full' : 'rounded-md';

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClass} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
      {removable && (
        <button
          onClick={handleRemove}
          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-current hover:bg-opacity-20 transition-colors duration-200"
          aria-label="Remove badge"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export interface BadgeGroupProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  className = '',
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3'
  };

  return (
    <div className={`inline-flex flex-wrap items-center ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}; 