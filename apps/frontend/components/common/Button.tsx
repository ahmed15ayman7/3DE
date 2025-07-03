"use client"
import React from 'react';
import {
    Button as MuiButton,
    CircularProgress,
    Box,
    useTheme,
} from '@mui/material';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'text' | 'contained' | 'outlined';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    target?: string;
    rel?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'contained',
    color = 'primary',
    size = 'medium',
    startIcon,
    endIcon,
    onClick,
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
    type = 'button',
    href,
    target,
    rel,
}) => {
    const theme = useTheme();

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'px-3 py-1.5 text-sm';
            case 'large':
                return 'px-6 py-3 text-lg';
            default:
                return 'px-4 py-2 text-base';
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'text':
                return 'bg-transparent hover:bg-opacity-10';
            case 'outlined':
                return 'bg-transparent border-2';
            default:
                return '';
        }
    };

    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return variant === 'text'
                    ? 'text-primary-main hover:bg-primary-light'
                    : variant === 'outlined'
                        ? 'text-primary-main border-primary-main hover:bg-primary-light'
                        : 'bg-primary-main text-white hover:bg-primary-dark';
            case 'secondary':
                return variant === 'text'
                    ? 'text-secondary-main hover:bg-secondary-light'
                    : variant === 'outlined'
                        ? 'text-secondary-main border-secondary-main hover:bg-secondary-light'
                        : 'bg-secondary-main text-white hover:bg-secondary-dark';
            case 'success':
                return variant === 'text'
                    ? 'text-success-main hover:bg-success-light'
                    : variant === 'outlined'
                        ? 'text-success-main border-success-main hover:bg-success-light'
                        : 'bg-success-main text-white hover:bg-success-dark';
            case 'error':
                return variant === 'text'
                    ? 'text-error-main hover:bg-error-light'
                    : variant === 'outlined'
                        ? 'text-error-main border-error-main hover:bg-error-light'
                        : 'bg-error-main text-white hover:bg-error-dark';
            case 'warning':
                return variant === 'text'
                    ? 'text-warning-main hover:bg-warning-light'
                    : variant === 'outlined'
                        ? 'text-warning-main border-warning-main hover:bg-warning-light'
                        : 'bg-warning-main text-white hover:bg-warning-dark';
            case 'info':
                return variant === 'text'
                    ? 'text-info-main hover:bg-info-light'
                    : variant === 'outlined'
                        ? 'text-info-main border-info-main hover:bg-info-light'
                        : 'bg-info-main text-white hover:bg-info-dark';
            default:
                return '';
        }
    };

    const getLoadingColor = () => {
        switch (color) {
            case 'primary':
                return 'text-primary-main';
            case 'secondary':
                return 'text-secondary-main';
            case 'success':
                return 'text-success-main';
            case 'error':
                return 'text-error-main';
            case 'warning':
                return 'text-warning-main';
            case 'info':
                return 'text-info-main';
            default:
                return 'text-white';
        }
    };

    return (
        <MuiButton
            component={href ? 'a' : 'button'}
            variant={variant}
            color={color}
            size={size}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
            disabled={disabled || loading}
            fullWidth={fullWidth}
            type={type}
            href={href}
            target={target}
            rel={rel}
            className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${getColorClasses()}
        ${className}
        rounded-lg
        font-medium
        transition-all
        duration-200
        ease-in-out
        disabled:opacity-50
        disabled:cursor-not-allowed
        focus:outline-none
        focus:ring-2
        focus:ring-opacity-50
        rtl:space-x-reverse
      `}
        >
            {loading ? (
                <Box className="flex items-center">
                    <CircularProgress
                        size={20}
                        className={`${getLoadingColor()} mr-2 rtl:mr-0 rtl:ml-2`}
                    />
                    جاري التحميل
                </Box>
            ) : (
                children
            )}
        </MuiButton>
    );
};

export default Button; 