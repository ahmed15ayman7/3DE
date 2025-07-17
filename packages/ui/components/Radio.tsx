import React from 'react';

export interface RadioProps {
  id: string;
  name: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (value: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getSizeClasses = (size: RadioProps['size']) => {
  switch (size) {
    case 'sm':
      return 'w-4 h-4';
    case 'lg':
      return 'w-6 h-6';
    default:
      return 'w-5 h-5';
  }
};

export const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  checked = false,
  disabled = false,
  label,
  onChange,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = getSizeClasses(size);
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`flex items-center ${disabledClass} ${className}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`
            ${sizeClasses} 
            relative 
            rounded-full 
            border-2 
            transition-all 
            duration-200 
            ease-in-out
            ${checked 
              ? 'border-blue-600 bg-blue-600' 
              : 'border-gray-300 bg-white hover:border-blue-400'
            }
            ${disabled ? 'border-gray-200 bg-gray-100' : ''}
          `}
        >
          {checked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-white rounded-full transform scale-100 transition-transform duration-200" />
            </div>
          )}
        </div>
        {label && (
          <span className={`ml-3 text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  direction?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  size = 'md',
  direction = 'vertical'
}) => {
  const directionClass = direction === 'horizontal' ? 'flex-row gap-4' : 'flex-col space-y-2';

  return (
    <div className={`flex ${directionClass} ${className}`}>
      {options.map((option) => (
        <Radio
          key={option.value}
          id={`${name}-${option.value}`}
          name={name}
          value={option.value}
          checked={value === option.value}
          disabled={disabled || option.disabled}
          label={option.label}
          onChange={onChange}
          size={size}
        />
      ))}
    </div>
  );
}; 