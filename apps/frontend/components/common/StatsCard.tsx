"use client"

import React from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Typography,
    Paper,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

interface StatItem {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

interface StatsCardProps {
    title?: string;
    stats: StatItem[];
    variant?: 'default' | 'compact' | 'detailed';
    className?: string;
    animate?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    stats,
    variant = 'default',
    className = '',
    animate = true,
}) => {
    const getColorClasses = (color?: string) => {
        switch (color) {
            case 'primary':
                return 'text-primary-main bg-primary-light/30';
            case 'secondary':
                return 'text-secondary-main bg-secondary-light/30';
            case 'success':
                return 'text-success-main bg-success-light/30';
            case 'error':
                return 'text-error-main bg-error-light/30';
            case 'warning':
                return 'text-warning-main bg-warning-light/30';
            case 'info':
                return 'text-info-main bg-info-light/30';
            default:
                return 'text-gray-700 bg-gray-100/30';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    const renderStatItem = (stat: StatItem, index: number) => {
        const StatComponent = animate ? motion.div : Box;
        const statProps = animate ? { variants: itemVariants } : {};

        return (
            <StatComponent
                key={index}
                {...statProps}
                className={`
                    flex items-center justify-between p-3 rounded-lg
                    ${getColorClasses(stat.color)}
                    ${variant === 'compact' ? 'p-2' : ''}
                    ${variant === 'detailed' ? 'p-4' : ''}
                `}
            >
                <Box className="flex items-center gap-3">
                    {stat.icon && (
                        <Box className="text-xl">
                            {stat.icon}
                        </Box>
                    )}
                    <Box>
                        <Typography
                            variant={variant === 'compact' ? 'body2' : 'body1'}
                            className="font-medium"
                        >
                            {stat.label}
                        </Typography>
                        {variant === 'detailed' && stat.trend && (
                            <Box className="flex items-center gap-1 mt-1">
                                {stat.trend.isPositive ? (
                                    <TrendingUpIcon className="text-success-main text-sm" />
                                ) : (
                                    <TrendingDownIcon className="text-error-main text-sm" />
                                )}
                                <Typography
                                    variant="caption"
                                    className={stat.trend.isPositive ? 'text-success-main' : 'text-error-main'}
                                >
                                    {stat.trend.value}%
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                
                <Typography
                    variant={variant === 'compact' ? 'h6' : 'h5'}
                    className="font-bold"
                >
                    {stat.value}
                </Typography>
            </StatComponent>
        );
    };

    const ContainerComponent = animate ? motion.div : Box;
    const containerProps = animate ? { variants: containerVariants, initial: "hidden", animate: "visible" } : {};

    return (
        <ContainerComponent {...containerProps}>
            <Paper
                elevation={variant === 'compact' ? 1 : 2}
                className={`
                    p-4 rounded-xl
                    ${variant === 'compact' ? 'p-3' : ''}
                    ${variant === 'detailed' ? 'p-6' : ''}
                    ${className}
                `}
            >
                {title && (
                    <Typography
                        variant={variant === 'compact' ? 'h6' : 'h5'}
                        className="font-bold mb-4 text-gray-800"
                    >
                        {title}
                    </Typography>
                )}
                
                <Box className={`
                    grid gap-3
                    ${variant === 'compact' ? 'grid-cols-2' : 'grid-cols-1'}
                    ${variant === 'detailed' ? 'grid-cols-1' : ''}
                `}>
                    {stats.map((stat, index) => renderStatItem(stat, index))}
                </Box>
            </Paper>
        </ContainerComponent>
    );
};

export default StatsCard; 