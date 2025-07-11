"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

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
                return 'text-blue-700 bg-blue-100/30';
            case 'secondary':
                return 'text-gray-700 bg-gray-100/30';
            case 'success':
                return 'text-green-700 bg-green-100/30';
            case 'error':
                return 'text-red-700 bg-red-100/30';
            case 'warning':
                return 'text-yellow-700 bg-yellow-100/30';
            case 'info':
                return 'text-cyan-700 bg-cyan-100/30';
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
        const StatComponent = animate ? motion.div : 'div';
        const statProps = animate ? { variants: itemVariants } : {};

        return (
            <StatComponent
                key={index}
                {...statProps}
                className={cn(
                    "flex items-center justify-between rounded-lg",
                    getColorClasses(stat.color),
                    variant === 'compact' ? 'p-2' : variant === 'detailed' ? 'p-4' : 'p-3'
                )}
            >
                <div className="flex items-center gap-3">
                    {stat.icon && (
                        <div className="text-xl">
                            {stat.icon}
                        </div>
                    )}
                    <div>
                        <div
                            className={cn(
                                "font-medium",
                                variant === 'compact' ? 'text-sm' : 'text-base'
                            )}
                        >
                            {stat.label}
                        </div>
                        {variant === 'detailed' && stat.trend && (
                            <div className="flex items-center gap-1 mt-1">
                                {stat.trend.isPositive ? (
                                    <TrendingUp className="text-green-600 text-sm" />
                                ) : (
                                    <TrendingDown className="text-red-600 text-sm" />
                                )}
                                <span
                                    className={cn(
                                        "text-xs",
                                        stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    )}
                                >
                                    {stat.trend.value}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div
                    className={cn(
                        "font-bold",
                        variant === 'compact' ? 'text-lg' : 'text-xl'
                    )}
                >
                    {stat.value}
                </div>
            </StatComponent>
        );
    };

    const ContainerComponent = animate ? motion.div : 'div';
    const containerProps = animate ? { variants: containerVariants, initial: "hidden", animate: "visible" } : {};

    return (
        <ContainerComponent {...containerProps}>
            <div
                className={cn(
                    "bg-white rounded-xl shadow-sm border border-gray-200",
                    variant === 'compact' ? 'p-3' : variant === 'detailed' ? 'p-6' : 'p-4',
                    className
                )}
            >
                {title && (
                    <h3
                        className={cn(
                            "font-bold mb-4 text-gray-800",
                            variant === 'compact' ? 'text-lg' : 'text-xl'
                        )}
                    >
                        {title}
                    </h3>
                )}
                
                <div className={cn(
                    "grid gap-3",
                    variant === 'compact' ? 'grid-cols-2' : 'grid-cols-1',
                    variant === 'detailed' && 'grid-cols-1'
                )}>
                    {stats.map((stat, index) => renderStatItem(stat, index))}
                </div>
            </div>
        </ContainerComponent>
    );
};

export default StatsCard; 