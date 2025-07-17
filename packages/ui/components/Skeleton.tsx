import React from 'react';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
  animated = true
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'rectangular':
        return 'rounded-none';
      default:
        return 'rounded';
    }
  };

  const getDefaultDimensions = () => {
    switch (variant) {
      case 'circular':
        return { width: '40px', height: '40px' };
      case 'text':
        return { width: '100%', height: '1em' };
      default:
        return { width: '100%', height: '200px' };
    }
  };

  const defaultDims = getDefaultDimensions();
  const finalWidth = width || defaultDims.width;
  const finalHeight = height || defaultDims.height;

  return (
    <div
      className={`
        bg-gray-200 ${getVariantClasses()}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{
        width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
        height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight
      }}
    />
  );
};

export interface SkeletonTextProps {
  lines?: number;
  lineHeight?: string;
  spacing?: string;
  className?: string;
  animated?: boolean;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lineHeight = '1em',
  spacing = '0.5rem',
  className = '',
  animated = true
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={lineHeight}
          className={index === lines - 1 ? 'w-3/4' : ''}
          animated={animated}
        />
      ))}
    </div>
  );
};

export interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className = '',
  animated = true
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
      animated={animated}
    />
  );
};

export interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'fullWidth';
  className?: string;
  animated?: boolean;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  animated = true
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const widthClasses = {
    default: 'w-20',
    fullWidth: 'w-full'
  };

  return (
    <Skeleton
      variant="rounded"
      className={`${sizeClasses[size]} ${widthClasses[variant]} ${className}`}
      animated={animated}
    />
  );
};

export interface SkeletonCardProps {
  className?: string;
  animated?: boolean;
  showAvatar?: boolean;
  showImage?: boolean;
  showActions?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = '',
  animated = true,
  showAvatar = true,
  showImage = true,
  showActions = true
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {showAvatar && (
          <SkeletonAvatar size="md" animated={animated} />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" animated={animated} />
          <Skeleton variant="text" width="40%" animated={animated} />
        </div>
      </div>
      
      {showImage && (
        <div className="mt-4">
          <Skeleton variant="rounded" height="200px" animated={animated} />
        </div>
      )}
      
      <div className="mt-4 space-y-2">
        <Skeleton variant="text" animated={animated} />
        <Skeleton variant="text" width="80%" animated={animated} />
        <Skeleton variant="text" width="60%" animated={animated} />
      </div>
      
      {showActions && (
        <div className="mt-4 flex gap-2">
          <SkeletonButton size="sm" animated={animated} />
          <SkeletonButton size="sm" animated={animated} />
        </div>
      )}
    </div>
  );
};

export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  animated?: boolean;
  showHeader?: boolean;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  animated = true,
  showHeader = true
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex gap-4">
            {[...Array(columns)].map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width={`${100 / columns}%`}
                height="1em"
                animated={animated}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="flex gap-4">
              {[...Array(columns)].map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  variant="text"
                  width={`${100 / columns}%`}
                  height="1em"
                  animated={animated}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface SkeletonGroupProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  children,
  className = '',
  direction = 'vertical',
  spacing = 'md'
}) => {
  const directionClass = direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col space-y-4';
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