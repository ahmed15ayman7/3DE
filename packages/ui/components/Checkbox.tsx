import React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

const getSizeClasses = (size: CheckboxProps['size']) => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-6 h-6';
    default:
      return 'w-5 h-5';
  }
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  size = 'md',
  id
}) => {
  const sizeClasses = getSizeClasses(size);
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex items-center ${disabledClass} ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
      <label
        htmlFor={checkboxId}
        className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`
            ${sizeClasses} 
            relative 
            rounded 
            border-2 
            transition-all 
            duration-200 
            ease-in-out
            ${checked 
              ? 'border-primary-main bg-primary-main' 
              : 'border-gray-300 bg-white hover:border-blue-400'
            }
            ${disabled ? 'border-gray-200 bg-gray-100' : ''}
          `}
        >
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
        {label && (
          <span className={`mr-3 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};