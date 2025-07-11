"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
    title: string;
    children: React.ReactElement;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    arrow?: boolean;
    className?: string;
    delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
    title,
    children,
    placement = 'top',
    arrow = true,
    className = '',
    delay = 200,
    ...props
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    const getPlacementClasses = () => {
        switch (placement) {
            case 'top':
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            case 'bottom':
                return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
            case 'left':
                return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
            case 'right':
                return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
            default:
                return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
        }
    };

    const getArrowClasses = () => {
        switch (placement) {
            case 'top':
                return 'top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800';
            case 'bottom':
                return 'bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800';
            case 'left':
                return 'left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800';
            case 'right':
                return 'right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800';
            default:
                return 'top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800';
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
            {...props}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
                        getPlacementClasses(),
                        className
                    )}
                >
                    {title}
                    {arrow && (
                        <div className={cn('absolute', getArrowClasses())} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Tooltip; 