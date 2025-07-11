"use client"
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'default' | 'sm' | 'lg' | 'icon';
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
    variant = 'default',
    color = 'primary',
    size = 'default',
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
    const getColorClasses = () => {
        if (variant !== 'default') return '';
        
        switch (color) {
            case 'primary':
                return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'secondary':
                return 'bg-gray-600 hover:bg-gray-700 text-white';
            case 'success':
                return 'bg-green-600 hover:bg-green-700 text-white';
            case 'error':
                return 'bg-red-600 hover:bg-red-700 text-white';
            case 'warning':
                return 'bg-yellow-600 hover:bg-yellow-700 text-white';
            case 'info':
                return 'bg-cyan-600 hover:bg-cyan-700 text-white';
            default:
                return '';
        }
    };

    const getOutlineColorClasses = () => {
        if (variant !== 'outline') return '';
        
        switch (color) {
            case 'primary':
                return 'border-blue-600 text-blue-600 hover:bg-blue-50';
            case 'secondary':
                return 'border-gray-600 text-gray-600 hover:bg-gray-50';
            case 'success':
                return 'border-green-600 text-green-600 hover:bg-green-50';
            case 'error':
                return 'border-red-600 text-red-600 hover:bg-red-50';
            case 'warning':
                return 'border-yellow-600 text-yellow-600 hover:bg-yellow-50';
            case 'info':
                return 'border-cyan-600 text-cyan-600 hover:bg-cyan-50';
            default:
                return '';
        }
    };

    const buttonContent = (
        <ShadcnButton
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
            className={cn(
                getColorClasses(),
                getOutlineColorClasses(),
                fullWidth && 'w-full',
                className
            )}
        >
            {loading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {!loading && startIcon && (
                <span className="mr-2">{startIcon}</span>
            )}
            {loading ? "جاري التحميل..." : children}
            {!loading && endIcon && (
                <span className="ml-2">{endIcon}</span>
            )}
        </ShadcnButton>
    );

    if (href) {
        return (
            <a
                href={href}
                target={target}
                rel={rel}
                className="inline-block"
            >
                {buttonContent}
            </a>
        );
    }

    return buttonContent;
};

export default Button; 