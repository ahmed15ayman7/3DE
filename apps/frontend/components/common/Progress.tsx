"use client"
import React from 'react';
import {
    LinearProgress,
    CircularProgress,
    useTheme,
} from '@mui/material';

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
    const theme = useTheme();

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'text-primary-main';
            case 'secondary':
                return 'text-secondary-main';
            case 'success':
                return 'text-success-main';
            case 'error':
                return 'text-error-main';
            case 'warning':
                return 'text-warning-main';
            case 'info':
                return 'text-info-main';
            default:
                return '';
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
                return '';
        }
    };

    if (type === 'linear') {
        return (
            <div className="flex items-center justify-between">

                <LinearProgress
                    variant={variant}
                    value={value / max * 100}
                    className={`
          ${className}
          ${getColorClass()}
          ${getSizeClass()}
          rounded-full
          bg-gray-200
        `}
                />
                {showLabel && <span className="text-sm text-gray-600">{label}</span>}
            </div>
        );
    }

    return (
        <CircularProgress
            variant={variant}
            value={value / max * 100}
            thickness={thickness}
            className={`
        ${className}
        ${getColorClass()}
        ${getSizeClass()}
      `}
        />
    );
};

export default Progress; 