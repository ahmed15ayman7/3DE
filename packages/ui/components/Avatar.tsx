import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
  loading?: boolean;
}

const getSizeClasses = (size: AvatarProps['size']) => {
  switch (size) {
    case 'xs':
      return 'w-6 h-6 text-xs';
    case 'sm':
      return 'w-8 h-8 text-sm';
    case 'lg':
      return 'w-12 h-12 text-lg';
    case 'xl':
      return 'w-16 h-16 text-xl';
    case '2xl':
      return 'w-20 h-20 text-2xl';
    default:
      return 'w-10 h-10 text-base';
  }
};

const getStatusClasses = (status: AvatarProps['status']) => {
  switch (status) {
    case 'online':
      return 'bg-green-400';
    case 'offline':
      return 'bg-gray-400';
    case 'away':
      return 'bg-yellow-400';
    case 'busy':
      return 'bg-red-400';
    default:
      return '';
  }
};

const getStatusSize = (size: AvatarProps['size']) => {
  switch (size) {
    case 'xs':
    case 'sm':
      return 'w-2 h-2';
    case 'lg':
    case 'xl':
      return 'w-3 h-3';
    case '2xl':
      return 'w-4 h-4';
    default:
      return 'w-2.5 h-2.5';
  }
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
  loading = false
}) => {
  const [imageError, setImageError] = React.useState(false);
  const sizeClasses = getSizeClasses(size);
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  const statusClasses = getStatusClasses(status);
  const statusSize = getStatusSize(size);
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="animate-pulse bg-gray-200 w-full h-full rounded-full" />
      );
    }

    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      );
    }

    if (fallback) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
          {getInitials(fallback)}
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-semibold">
        <svg
          className="w-1/2 h-1/2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className={`relative inline-block ${sizeClasses} ${shapeClass} ${clickableClass} ${className}`}>
      <div
        className={`w-full h-full overflow-hidden ${shapeClass}`}
        onClick={onClick}
      >
        {renderContent()}
      </div>
      
      {status && (
        <div
          className={`
            absolute bottom-0 right-0 
            ${statusSize} 
            ${statusClasses} 
            ${shapeClass} 
            border-2 border-white 
            transform translate-x-1/4 translate-y-1/4
          `}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max,
  size = 'md',
  shape = 'circle',
  className = ''
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalCount = childrenArray.length;
  const displayCount = max ? Math.min(max, totalCount) : totalCount;
  const overflowCount = totalCount - displayCount;

  return (
    <div className={`flex -gap-2 ${className}`}>
      {childrenArray.slice(0, displayCount).map((child, index) => (
        <div key={index} className="relative">
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, { size, shape })
            : child}
        </div>
      ))}

      {overflowCount > 0 && (
        <div className={`
          relative 
          ${getSizeClasses(size)} 
          rounded-full 
          bg-gray-300 
          flex 
          items-center 
          justify-center 
          text-gray-600 
          font-semibold 
          text-xs
          border-2 
          border-white
        `}>
          +{overflowCount}
        </div>
      )}
    </div>
  );
}; 