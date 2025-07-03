"use client"
import React from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Box,
} from '@mui/material';


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
    size = 'medium',
    variant = 'outlined',
    color = 'primary',
}) => {

    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'text-primary-main focus:ring-primary-main';
            case 'secondary':
                return 'text-secondary-main focus:ring-secondary-main';
            case 'success':
                return 'text-success-main focus:ring-success-main';
            case 'error':
                return 'text-error-main focus:ring-error-main';
            case 'warning':
                return 'text-warning-main focus:ring-warning-main';
            case 'info':
                return 'text-info-main focus:ring-info-main';
            default:
                return '';
        }
    };

    const getBorderColor = () => {
        if (error) return 'border-error-main';
        switch (color) {
            case 'primary':
                return 'border-primary-main';
            case 'secondary':
                return 'border-secondary-main';
            case 'success':
                return 'border-success-main';
            case 'error':
                return 'border-error-main';
            case 'warning':
                return 'border-warning-main';
            case 'info':
                return 'border-info-main';
            default:
                return 'border-gray-300';
        }
    };

    const getBackgroundColor = () => {
        if (disabled) return 'bg-gray-100 ';
        return 'bg-white ';
    };

    return (
        <TextField
            label={label}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            type={type}
            error={error}
            helperText={helperText}
            required={required}
            disabled={disabled}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={rows}
            maxRows={maxRows}
            minRows={minRows}
            name={name}
            id={id}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            inputProps={inputProps}
            size={size}
            variant={variant}
            color={color}
            className={`
        ${getColorClasses()}
        ${getBorderColor()}
        ${getBackgroundColor()}
        ${className}
        rounded-lg
        transition-all
        duration-200
        ease-in-out
        focus:outline-none
        focus:ring-2
        focus:ring-opacity-50
        disabled:opacity-50
        disabled:cursor-not-allowed
        rtl:space-x-reverse
      `}
            InputProps={{
                ...InputProps,
                startAdornment: startIcon && (
                    <InputAdornment position="start">
                        {startIcon}
                    </InputAdornment>
                ),
                endAdornment: (endIcon || clearable) && (
                    <InputAdornment position="end">
                        {endIcon}
                        {clearable && value && (
                            <IconButton
                                aria-label="clear input"
                                onClick={() => onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)}
                                edge="end"
                                className="opacity-70 hover:opacity-100"
                            >
                                <Box className="w-4 h-4" />
                            </IconButton>
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default Input; 