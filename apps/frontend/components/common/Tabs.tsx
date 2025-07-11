"use client" 
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
    value: number;
    label: string;
    icon?: React.ReactElement;
    disabled?: boolean;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    value?: number;
    onChange?: (value: number) => void;
    variant?: 'standard' | 'scrollable' | 'fullWidth';
    centered?: boolean;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({
    tabs,
    value: controlledValue,
    onChange,
    variant = 'standard',
    centered = false,
    color = 'primary',
    className = '',
}) => {
    const [uncontrolledValue, setUncontrolledValue] = useState(0);
    const value = controlledValue ?? uncontrolledValue;

    const handleChange = (newValue: number) => {
        if (onChange) {
            onChange(newValue);
        } else {
            setUncontrolledValue(newValue);
        }
    };

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'text-blue-600 border-blue-600';
            case 'secondary':
                return 'text-gray-600 border-gray-600';
            case 'success':
                return 'text-green-600 border-green-600';
            case 'error':
                return 'text-red-600 border-red-600';
            case 'warning':
                return 'text-yellow-600 border-yellow-600';
            case 'info':
                return 'text-cyan-600 border-cyan-600';
            default:
                return 'text-blue-600 border-blue-600';
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'fullWidth':
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            case 'scrollable':
                return 'flex overflow-x-auto';
            default:
                return 'flex';
        }
    };

    return (
        <div className={className}>
            <div className={cn(
                "border-b border-gray-200",
                centered && "flex justify-center",
                getVariantClasses()
            )}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => !tab.disabled && handleChange(tab.value)}
                        disabled={tab.disabled}
                        className={cn(
                            "flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 border-transparent min-h-[48px]",
                            variant === 'fullWidth' && "justify-center",
                            tab.disabled && "opacity-50 cursor-not-allowed",
                            value === tab.value 
                                ? cn(getColorClass(), "font-semibold")
                                : "text-gray-600 hover:text-gray-800 hover:border-gray-300"
                        )}
                    >
                        {tab.icon && (
                            <span className="flex-shrink-0">
                                {tab.icon}
                            </span>
                        )}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="mt-4">
                {tabs.find(tab => tab.value === value)?.content}
            </div>
        </div>
    );
};

export default Tabs; 