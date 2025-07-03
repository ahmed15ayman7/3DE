"use client"
import React from 'react';
import {
    Breadcrumbs as MuiBreadcrumbs,
    Link,
    Typography,
    Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    maxItems?: number;
    className?: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    size?: 'small' | 'medium' | 'large';
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    separator = '/',
    maxItems = 5,
    className = '',
    color = 'primary',
    size = 'medium',
}) => {
    const router = useRouter();

    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'text-primary-main hover:text-primary-dark';
            case 'secondary':
                return 'text-secondary-main hover:text-secondary-dark';
            case 'success':
                return 'text-success-main hover:text-success-dark';
            case 'error':
                return 'text-error-main hover:text-error-dark';
            case 'warning':
                return 'text-warning-main hover:text-warning-dark';
            case 'info':
                return 'text-info-main hover:text-info-dark';
            default:
                return '';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return 'text-sm';
            case 'large':
                return 'text-lg';
            default:
                return 'text-base';
        }
    };

    const handleClick = (href?: string) => {
        if (href) {
            router.push(href);
        }
    };

    return (
        <MuiBreadcrumbs
            separator={separator}
            maxItems={maxItems}
            className={`
        ${className}
        ${getSizeClasses()}
        py-2
        px-4
        rounded-lg
        bg-gray-50
      `}
            aria-label="breadcrumb"
        >
            {items.map((item, index) => (
                <Box
                    key={index}
                    className={`
            flex
            items-center
            space-x-1
            rtl:space-x-reverse
          `}
                >
                    {item.icon && (
                        <Box className="flex-shrink-0">
                            {item.icon}
                        </Box>
                    )}
                    {index === items.length - 1 ? (
                        <Typography
                            className={`
                ${getColorClasses()}
                font-medium
                opacity-70
              `}
                        >
                            {item.label}
                        </Typography>
                    ) : (
                        <Link
                            component="button"
                            onClick={() => handleClick(item.href)}
                            className={`
                ${getColorClasses()}
                font-medium
                hover:underline
                focus:outline-none
                focus:ring-2
                focus:ring-opacity-50
                transition-all
                duration-200
                ease-in-out
              `}
                        >
                            {item.label}
                        </Link>
                    )}
                </Box>
            ))}
        </MuiBreadcrumbs>
    );
};

export default Breadcrumb; 