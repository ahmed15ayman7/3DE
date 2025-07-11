"use client"
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
    value?: number;
    variant?: 'determinate' | 'indeterminate';
    type?: 'linear' | 'circular';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
    thickness?: number;
    showLabel?: boolean;
    className?: string;
    max?: number;
    label?: string;
}

const Progress: React.FC<ProgressProps> = ({
    value = 0,
    variant = 'indeterminate',
    type = 'linear',
    color = 'primary',
    size = 'medium',
    max = 100,
    thickness = 4,
    showLabel = false,
    className = '',
    label = '',
}) => {
    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'bg-blue-600';
            case 'secondary':
                return 'bg-gray-600';
            case 'success':
                return 'bg-green-600';
            case 'error':
                return 'bg-red-600';
            case 'warning':
                return 'bg-yellow-600';
            case 'info':
                return 'bg-cyan-600';
            default:
                return 'bg-blue-600';
        }
    };

    const getSizeClass = () => {
        switch (size) {
            case 'small':
                return type === 'linear' ? 'h-1' : 'w-4 h-4';
            case 'medium':
                return type === 'linear' ? 'h-2' : 'w-8 h-8';
            case 'large':
                return type === 'linear' ? 'h-3' : 'w-12 h-12';
            default:
                return type === 'linear' ? 'h-2' : 'w-8 h-8';
        }
    };

    if (type === 'linear') {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

        return (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="flex-1">
                    <div className={cn(
                        "w-full bg-gray-200 rounded-full overflow-hidden",
                        getSizeClass(),
                        className
                    )}>
                        {variant === 'indeterminate' ? (
                            <div className={cn(
                                "h-full rounded-full animate-pulse",
                                getColorClass()
                            )} />
                        ) : (
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-300 ease-out",
                                    getColorClass()
                                )}
                                style={{ width: `${percentage}%` }}
                            />
                        )}
                    </div>
                </div>
                {showLabel && (
                    <span className="text-sm text-gray-600 min-w-[3rem] text-right">
                        {label || `${Math.round(percentage)}%`}
                    </span>
                )}
            </div>
        );
    }

    // Circular Progress
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = 16; // Default radius
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = variant === 'indeterminate' 
        ? circumference 
        : circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-block">
            <svg
                className={cn(
                    "transform -rotate-90",
                    getSizeClass(),
                    className
                )}
                viewBox="0 0 36 36"
            >
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    className="stroke-gray-200"
                    strokeWidth={thickness}
                />
                <circle
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    className={cn(
                        "transition-all duration-300 ease-out",
                        variant === 'indeterminate' 
                            ? "animate-spin" 
                            : getColorClass().replace('bg-', 'stroke-')
                    )}
                    strokeWidth={thickness}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                        {label || `${Math.round(percentage)}%`}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Progress; 