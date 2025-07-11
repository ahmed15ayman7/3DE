"use client"
import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy' | 'away';
    variant?: 'circular' | 'rounded' | 'square';
    className?: string;
    onClick?: () => void;
    tooltip?: string;
    cw?: string;
    ch?: string;
    showTooltip?: boolean;
    badgeContent?: React.ReactNode;
    badgeColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const Avatar: React.FC<AvatarProps> = ({
    src,
    alt,
    cw,
    ch,
    name,
    size = 'md',
    status,
    variant = 'circular',
    className = '',
    onClick,
    tooltip,
    showTooltip = true,
    badgeContent,
    badgeColor = 'primary',
    badgePosition = 'bottom-right',
}) => {
    const getSizeClasses = () => {
        switch (size) {
            case 'xs':
                return 'w-6 h-6 text-xs';
            case 'sm':
                return 'w-8 h-8 text-sm';
            case 'lg':
                return 'w-12 h-12 text-lg';
            case 'xl':
                return 'w-16 h-16 text-xl';
            default:
                return 'w-10 h-10 text-base';
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'rounded':
                return 'rounded-lg';
            case 'square':
                return 'rounded-none';
            default:
                return 'rounded-full';
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'online':
                return 'bg-green-500';
            case 'offline':
                return 'bg-gray-400';
            case 'busy':
                return 'bg-red-500';
            case 'away':
                return 'bg-yellow-500';
            default:
                return '';
        }
    };

    const getBadgeColor = () => {
        switch (badgeColor) {
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
                return '';
        }
    };

    const getBadgePosition = () => {
        switch (badgePosition) {
            case 'top-right':
                return 'top-0 right-0';
            case 'top-left':
                return 'top-0 left-0';
            case 'bottom-right':
                return 'bottom-0 right-0';
            case 'bottom-left':
                return 'bottom-0 left-0';
            default:
                return '';
        }
    };

    const getInitials = () => {
        if (!name) return '';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const avatarContent = (
        <div className="relative inline-block">
            <div
                className={cn(
                    getSizeClasses(),
                    getVariantClasses(),
                    'bg-blue-100 text-blue-800 font-medium flex items-center justify-center cursor-pointer transition-all duration-200 ease-in-out hover:opacity-80',
                    className
                )}
                style={{ width: cw || undefined, height: ch || undefined }}
                onClick={onClick}
                title={tooltip}
            >
                {src ? (
                    <img
                        src={src}
                        alt={alt || name}
                        className={cn(
                            getSizeClasses(),
                            getVariantClasses(),
                            'object-cover'
                        )}
                    />
                ) : (
                    getInitials()
                )}
            </div>

            {status && (
                <div
                    className={cn(
                        'absolute w-2.5 h-2.5 rounded-full border-2 border-white',
                        getStatusColor(),
                        getBadgePosition()
                    )}
                />
            )}

            {badgeContent && (
                <div
                    className={cn(
                        'absolute text-white text-xs font-medium px-1.5 py-0.5 rounded-full',
                        getBadgeColor(),
                        getBadgePosition()
                    )}
                >
                    {badgeContent}
                </div>
            )}
        </div>
    );

    if (showTooltip && tooltip) {
        return (
            <div className="group relative">
                {avatarContent}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {tooltip}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            </div>
        );
    }

    return avatarContent;
};

export default Avatar; 