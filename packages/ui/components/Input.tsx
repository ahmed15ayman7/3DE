import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  icon,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative h-full">
        {icon && (
          <div style={{ height: '100%',paddingRight: '.3rem' }} className="absolute inset-y-0 left-0 top-0  pl-3 flex items-center  pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          style={{ paddingRight: icon ? '1.5rem' : '.4rem' }}
          className={clsx(
            'w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent',
            error ? 'border-error-main' : 'border-secondary-main',
            icon ? 'pr-16' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-error-main">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}; 