
import React from 'react';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const getVariantClasses = (variant: AlertProps['variant']) => {
  switch (variant) {
    case 'info':
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-400',
        close: 'text-blue-400 hover:bg-blue-100'
      };
    case 'success':
      return {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-400',
        close: 'text-green-400 hover:bg-green-100'
      };
    case 'warning':
      return {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: 'text-yellow-400',
        close: 'text-yellow-400 hover:bg-yellow-100'
      };
    case 'error':
      return {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-400',
        close: 'text-red-400 hover:bg-red-100'
      };
    default:
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-400',
        close: 'text-blue-400 hover:bg-blue-100'
      };
  }
};

const getDefaultIcon = (variant: AlertProps['variant']) => {
  switch (variant) {
    case 'info':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
    case 'success':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    default:
      return null;
  }
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  closable = false,
  onClose,
  className = '',
  icon,
  action
}) => {
  const variantClasses = getVariantClasses(variant);
  const defaultIcon = getDefaultIcon(variant);
  const displayIcon = icon || defaultIcon;

  return (
    <div className={`relative p-4 border rounded-lg ${variantClasses.container} ${className}`}>
      <div className="flex items-start">
        {displayIcon && (
          <div className={`flex-shrink-0 mr-3 ${variantClasses.icon}`}>
            {displayIcon}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
          
          {closable && onClose && (
            <button
              onClick={onClose}
              className={`flex-shrink-0 p-1 rounded-md transition-colors duration-200 ${variantClasses.close}`}
              aria-label="Close alert"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export interface AlertGroupProps {
  children: React.ReactNode;
  className?: string;
  space?: 'sm' | 'md' | 'lg';
}

export const AlertGroup: React.FC<AlertGroupProps> = ({
  children,
  className = '',
  space = 'md'
}) => {
  const spaceClasses = {
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4'
  };

  return (
    <div className={`${spaceClasses[space]} ${className}`}>
      {children}
    </div>
  );
}; 