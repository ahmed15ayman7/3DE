"use client"
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    variant?: 'text' | 'rectangular' | 'circular';
    width?: number | string;
    height?: number | string;
    animation?: 'pulse' | 'wave' | false;
    className?: string;
    count?: number;
    spacing?: number;
    direction?: 'row' | 'column';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    className = '',
    count = 1,
    spacing = 1,
    direction = 'column',
    color = 'primary',
}) => {
    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'bg-blue-200';
            case 'secondary':
                return 'bg-gray-200';
            case 'success':
                return 'bg-green-200';
            case 'error':
                return 'bg-red-200';
            case 'warning':
                return 'bg-yellow-200';
            case 'info':
                return 'bg-cyan-200';
            default:
                return 'bg-gray-200';
        }
    };

    const getAnimationClass = () => {
        switch (animation) {
            case 'pulse':
                return 'animate-pulse';
            case 'wave':
                return 'animate-pulse';
            default:
                return '';
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'circular':
                return 'rounded-full';
            case 'text':
                return 'rounded';
            case 'rectangular':
                return 'rounded-lg';
            default:
                return 'rounded';
        }
    };

    const getSpacingClass = () => {
        switch (spacing) {
            case 0:
                return 'gap-0';
            case 1:
                return 'gap-1';
            case 2:
                return 'gap-2';
            case 3:
                return 'gap-3';
            case 4:
                return 'gap-4';
            default:
                return 'gap-1';
        }
    };

    const getSkeletonItems = () => {
        return Array.from({ length: count }, (_, index) => (
            <div
                key={index}
                className={cn(
                    getColorClasses(),
                    getAnimationClass(),
                    getVariantClasses(),
                    'opacity-70',
                    className
                )}
                style={{
                    width: width,
                    height: height || (variant === 'text' ? '1rem' : undefined),
                }}
            />
        ));
    };

    return (
        <div
            className={cn(
                'flex',
                direction === 'column' ? 'flex-col' : 'flex-row',
                getSpacingClass()
            )}
        >
            {getSkeletonItems()}
        </div>
    );
};

export default Skeleton; 