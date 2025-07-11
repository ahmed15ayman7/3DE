"use client"
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: React.ReactElement;
    content?: string | number;
    max?: number;
    showZero?: boolean;
    variant?: 'standard' | 'dot';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Badge: React.FC<BadgeProps> = ({
    children,
    content,
    max = 99,
    showZero = false,
    variant = 'standard',
    color = 'primary',
    className = '',
    position = 'top-right',
    ...props
}) => {
    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'bg-blue-600 text-white';
            case 'secondary':
                return 'bg-gray-600 text-white';
            case 'success':
                return 'bg-green-600 text-white';
            case 'error':
                return 'bg-red-600 text-white';
            case 'warning':
                return 'bg-yellow-600 text-white';
            case 'info':
                return 'bg-cyan-600 text-white';
            default:
                return 'bg-blue-600 text-white';
        }
    };

    const getPositionClass = () => {
        switch (position) {
            case 'top-right':
                return 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2';
            case 'top-left':
                return 'top-0 left-0 transform -translate-x-1/2 -translate-y-1/2';
            case 'bottom-right':
                return 'bottom-0 right-0 transform translate-x-1/2 translate-y-1/2';
            case 'bottom-left':
                return 'bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2';
            default:
                return 'top-0 right-0 transform translate-x-1/2 -translate-y-1/2';
        }
    };

    const shouldShowBadge = () => {
        if (variant === 'dot') return true;
        if (content === undefined || content === null) return false;
        if (content === 0 && !showZero) return false;
        return true;
    };

    const getDisplayContent = () => {
        if (variant === 'dot') return null;
        if (typeof content === 'number' && content > max) {
            return `${max}+`;
        }
        return content;
    };

    return (
        <div className="relative inline-block">
            {children}
            {shouldShowBadge() && (
                <div
                    className={cn(
                        'absolute z-10',
                        getPositionClass(),
                        getColorClass(),
                        variant === 'dot' 
                            ? 'w-2 h-2 rounded-full' 
                            : 'text-xs font-medium min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center',
                        className
                    )}
                    {...props}
                >
                    {getDisplayContent()}
                </div>
            )}
        </div>
    );
};

export default Badge; 