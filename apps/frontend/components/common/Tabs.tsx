"use client" 
import React, { useState } from 'react';
import {
    Tabs as MuiTabs,
    Tab as MuiTab,
    Box,
} from '@mui/material';

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

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        if (onChange) {
            onChange(newValue);
        } else {
            setUncontrolledValue(newValue);
        }
    };

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

    return (
        <Box className={className}>
            <MuiTabs
                value={value}
                onChange={handleChange}
                variant={variant}
                centered={centered}
                className={`
          ${getColorClass()}
          [&_.MuiTabs-indicator]:bg-current
          [&_.MuiTab-root]:text-gray-600
          [&_.MuiTab-root.Mui-selected]:text-current
          [&_.MuiTab-root.Mui-selected]:font-medium
          [&_.MuiTab-root]:min-h-[48px]
          [&_.MuiTab-root]:px-4
          [&_.MuiTab-root]:py-2
          [&_.MuiTab-root]:text-sm
          [&_.MuiTab-root]:capitalize
          [&_.MuiTab-root]:transition-colors
          [&_.MuiTab-root]:duration-200
        `}
            >
                {tabs.map((tab, index) => (
                    <MuiTab
                        key={index}
                        label={tab.label}
                        value={tab.value}
                        icon={tab.icon}
                        disabled={tab.disabled}
                        className={`
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                    />
                ))}
            </MuiTabs>
            <Box className="mt-4">
                {tabs[value].content}
            </Box>
        </Box>
    );
};

export default Tabs; 