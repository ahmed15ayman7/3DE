"use client"
import React from 'react';
import {
    Badge as MuiBadge,
    BadgeProps as MuiBadgeProps,
} from '@mui/material';

interface BadgeProps extends Omit<MuiBadgeProps, 'color'> {
    children: React.ReactElement;
    content?: string;
    max?: number;
    showZero?: boolean;
    variant?: 'standard' | 'dot';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({
    children,
    content,
    max = 99,
    showZero = false,
    variant = 'standard',
    color = 'primary',
    className = '',
    ...props
}) => {

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'bg-primary-main text-white';
            case 'secondary':
                return 'bg-secondary-main text-white';
            case 'success':
                return 'bg-success-main text-white';
            case 'error':
                return 'bg-error-main text-white';
            case 'warning':
                return 'bg-warning-main text-white';
            case 'info':
                return 'bg-info-main text-white';
            default:
                return '';
        }
    };

    return (
        <MuiBadge
            badgeContent={content}
            max={max}
            showZero={showZero}
            variant={variant}
            className={`
        ${className}
        [&_.MuiBadge-badge]:${getColorClass()}
        [&_.MuiBadge-badge]:text-xs
        [&_.MuiBadge-badge]:font-medium
        [&_.MuiBadge-badge]:min-w-[20px]
        [&_.MuiBadge-badge]:h-5
        [&_.MuiBadge-badge]:px-1
        [&_.MuiBadge-badge]:rounded-full
        [&_.MuiBadge-dot]:w-2
        [&_.MuiBadge-dot]:h-2
        [&_.MuiBadge-dot]:rounded-full
      `}
            {...props}
        >
            {children}
        </MuiBadge>
    );
};

export default Badge; 