"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ChipProps {
    label: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    variant?: 'filled' | 'outlined';
    size?: 'small' | 'medium';
    icon?: React.ReactElement;
    onDelete?: () => void;
    className?: string;
    onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({
    label,
    color = 'primary',
    variant = 'filled',
    size = 'medium',
    icon,
    onDelete,
    className = '',
    onClick,
    ...props
}) => {
    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return variant === 'filled'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50';
            case 'secondary':
                return variant === 'filled'
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'border-gray-600 text-gray-600 hover:bg-gray-50';
            case 'success':
                return variant === 'filled'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'border-green-600 text-green-600 hover:bg-green-50';
            case 'error':
                return variant === 'filled'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'border-red-600 text-red-600 hover:bg-red-50';
            case 'warning':
                return variant === 'filled'
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'border-yellow-600 text-yellow-600 hover:bg-yellow-50';
            case 'info':
                return variant === 'filled'
                    ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                    : 'border-cyan-600 text-cyan-600 hover:bg-cyan-50';
            default:
                return variant === 'filled'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return 'px-2 py-1 text-xs';
            case 'medium':
                return 'px-3 py-1.5 text-sm';
            default:
                return 'px-3 py-1.5 text-sm';
        }
    };

    return (
        <div
            className={cn(
                'inline-flex items-center font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant === 'outlined' && 'bg-transparent border',
                getColorClass(),
                getSizeClass(),
                (onClick || onDelete) && 'cursor-pointer',
                className
            )}
            onClick={onClick}
            {...props}
        >
            {icon && (
                <span className="mr-1 rtl:mr-0 rtl:ml-1">
                    {icon}
                </span>
            )}
            <span>{label}</span>
            {onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="ml-1 rtl:ml-0 rtl:mr-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </div>
    );
};

export default Chip; 