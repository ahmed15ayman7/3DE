"use client"
import React from 'react';
import { Input as ShadcnInput } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    error?: boolean;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    multiline?: boolean;
    rows?: number;
    maxRows?: number;
    minRows?: number;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    clearable?: boolean;
    className?: string;
    name?: string;
    id?: string;
    autoComplete?: string;
    autoFocus?: boolean;
    inputProps?: object;
    InputProps?: object;
    size?: 'small' | 'medium';
    variant?: 'outlined' | 'filled' | 'standard';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    error = false,
    helperText,
    required = false,
    disabled = false,
    fullWidth = false,
    multiline = false,
    rows,
    maxRows,
    minRows,
    startIcon,
    endIcon,
    clearable = false,
    className = '',
    name,
    id,
    autoComplete,
    autoFocus = false,
    inputProps,
    InputProps,
    readOnly = false,
    size = 'medium',
    variant = 'outlined',
    color = 'primary',
}) => {
    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'focus:ring-blue-500 focus:border-blue-500';
            case 'secondary':
                return 'focus:ring-gray-500 focus:border-gray-500';
            case 'success':
                return 'focus:ring-green-500 focus:border-green-500';
            case 'error':
                return 'focus:ring-red-500 focus:border-red-500';
            case 'warning':
                return 'focus:ring-yellow-500 focus:border-yellow-500';
            case 'info':
                return 'focus:ring-cyan-500 focus:border-cyan-500';
            default:
                return '';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'h-8 text-sm';
            default:
                return 'h-10 text-base';
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    if (multiline) {
        return (
            <div className={cn("w-full", fullWidth && "w-full", className)}>
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    value={value}
                    onChange={onChange as any}
                    placeholder={placeholder}
                    name={name}
                    id={id}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    rows={rows || 3}
                    className={cn(
                        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        getColorClasses(),
                        getSizeClasses(),
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    {...inputProps}
                />
                {helperText && (
                    <p className={cn(
                        "mt-1 text-xs",
                        error ? "text-red-500" : "text-gray-500"
                    )}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={cn("w-full", fullWidth && "w-full", className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {startIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {startIcon}
                    </div>
                )}
                <ShadcnInput
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={id}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    error={error}
                    helperText={helperText}
                    startIcon={startIcon}
                    endIcon={endIcon}
                    clearable={clearable}
                    onClear={handleClear}
                    readOnly={readOnly}
                    className={cn(
                        getColorClasses(),
                        getSizeClasses(),
                        startIcon && "pl-10",
                        (endIcon || clearable) && "pr-10",
                        className
                    )}
                    {...inputProps}
                />
            </div>
        </div>
    );
};

export default Input; 