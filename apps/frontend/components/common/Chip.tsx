"use client"
import React from 'react';
import {
    Chip as MuiChip,
    ChipProps as MuiChipProps,
    
} from '@mui/material';

interface ChipProps extends Omit<MuiChipProps, 'color'> {
    label: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    variant?: 'filled' | 'outlined';
    size?: 'small' | 'medium';
    icon?: React.ReactElement;
    onDelete?: () => void;
    className?: string;
}

const Chip: React.FC<ChipProps> = ({
    label,
    color = 'primary',
    variant = 'filled',
    size = 'medium',
    icon,
    onDelete,
    className = '',
    ...props
}) => {

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return variant === 'filled'
                    ? 'bg-primary-main text-white'
                    : 'border-primary-main text-primary-main';
            case 'secondary':
                return variant === 'filled'
                    ? 'bg-secondary-main text-white'
                    : 'border-secondary-main text-secondary-main';
            case 'success':
                return variant === 'filled'
                    ? 'bg-success-main text-white'
                    : 'border-success-main text-success-main';
            case 'error':
                return variant === 'filled'
                    ? 'bg-error-main text-white'
                    : 'border-error-main text-error-main';
            case 'warning':
                return variant === 'filled'
                    ? 'bg-warning-main text-white'
                    : 'border-warning-main text-warning-main';
            case 'info':
                return variant === 'filled'
                    ? 'bg-info-main text-white'
                    : 'border-info-main text-info-main';
            default:
                return '';
        }
    };

    return (
        <MuiChip
            label={label}
            icon={icon}
            onDelete={onDelete}
            className={`
        ${className}
        ${getColorClass()}
        ${size === 'small' ? 'text-xs' : 'text-sm'}
        font-medium
        rounded-full
        transition-colors
        duration-200
        hover:opacity-90
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${variant === 'outlined' ? 'bg-transparent' : ''}
      `}
            {...props}
        />
    );
};

export default Chip; 