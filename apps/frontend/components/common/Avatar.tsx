"use client"
import React from 'react';
import {
    Avatar as MuiAvatar,
    Badge,
    Box,    
    Tooltip,
} from '@mui/material';

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
    cw?:string;
    ch?:string;
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

    const getStatusColor = () => {
        switch (status) {
            case 'online':
                return 'bg-success-main';
            case 'offline':
                return 'bg-gray-400';
            case 'busy':
                return 'bg-error-main';
            case 'away':
                return 'bg-warning-main';
            default:
                return '';
        }
    };

    const getBadgeColor = () => {
        switch (badgeColor) {
            case 'primary':
                return 'bg-primary-main';
            case 'secondary':
                return 'bg-secondary-main';
            case 'success':
                return 'bg-success-main';
            case 'error':
                return 'bg-error-main';
            case 'warning':
                return 'bg-warning-main';
            case 'info':
                return 'bg-info-main';
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
        <Box className="relative">
            <MuiAvatar
                src={src}
                alt={alt || name}
                variant={variant}
                onClick={onClick}
                sx={{width:cw??"",height:ch??""}}
                className={`
          ${getSizeClasses()}
          ${className}
          cursor-pointer
          transition-all
          duration-200
          ease-in-out
          hover:opacity-80
          bg-primary-light
          text-primary-dark
        `}
            >
                {!src && getInitials()}
            </MuiAvatar>

            {status && (
                <Box
                    className={`
            absolute
            ${getBadgePosition()}
            w-2.5
            h-2.5
            ${getStatusColor()}
            rounded-full
            border-2
            border-white
          `}
                />
            )}

            {badgeContent && (
                <Badge
                    badgeContent={badgeContent}
                    color={badgeColor}
                    className={`
            absolute
            ${getBadgePosition()}
            ${getBadgeColor()}
            text-white
            text-xs
            font-medium
            px-1.5
            py-0.5
            rounded-full
          `}
                />
            )}
        </Box>
    );

    if (showTooltip && tooltip) {
        return (
            <Tooltip title={tooltip} arrow>
                {avatarContent}
            </Tooltip>
        );
    }

    return avatarContent;
};

export default Avatar; 