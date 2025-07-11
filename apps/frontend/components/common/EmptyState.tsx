'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
    image?: string;
    className?: string;
    variant?: 'default' | 'minimal' | 'illustration';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon,
    action,
    image,
    className = '',
    variant = 'default',
    color = 'primary',
}) => {
    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'text-blue-600';
            case 'secondary':
                return 'text-gray-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'info':
                return 'text-cyan-600';
            default:
                return 'text-blue-600';
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'minimal':
                return 'p-4';
            case 'illustration':
                return 'p-8';
            default:
                return 'p-6';
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center rounded-lg bg-gray-50",
                getVariantClasses(),
                className
            )}
        >
            {image && (
                <div className="mb-4">
                    <img
                        src={image}
                        alt="Empty state illustration"
                        className="w-48 h-48 object-contain"
                    />
                </div>
            )}

            {icon && !image && (
                <div
                    className={cn(
                        "mb-4 text-4xl",
                        getColorClasses()
                    )}
                >
                    {icon}
                </div>
            )}

            {title && (
                <h3
                    className={cn(
                        "mb-2 text-xl font-medium",
                        getColorClasses()
                    )}
                >
                    {title}
                </h3>
            )}

            {description && (
                <p className="mb-4 text-gray-600">
                    {description}
                </p>
            )}

            {action && (
                <Button
                    variant="default"
                    onClick={action.onClick}
                    className="mt-4"
                >
                    {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                    )}
                    {action.label}
                </Button>
            )}
        </div>
    );
};

export default EmptyState; 