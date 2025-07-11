"use client"
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ExpansionPanelItem {
    id: string;
    title: string;
    description?: string;
    content: React.ReactNode;
    icon?: React.ReactElement;
    disabled?: boolean;
    defaultExpanded?: boolean;
}

interface ExpansionPanelProps {
    items: ExpansionPanelItem[];
    expanded?: string[];
    onChange?: (expanded: string[]) => void;
    variant?: 'default' | 'outlined';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

const ExpansionPanel: React.FC<ExpansionPanelProps> = ({
    items,
    expanded: controlledExpanded,
    onChange,
    variant = 'default',
    color = 'primary',
    className = '',
}) => {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>(
        items.filter((item) => item.defaultExpanded).map((item) => item.id)
    );
    const expanded = controlledExpanded ?? uncontrolledExpanded;

    const handleChange = (id: string) => {
        const newExpanded = expanded.includes(id)
            ? expanded.filter((item) => item !== id)
            : [...expanded, id];

        if (onChange) {
            onChange(newExpanded);
        } else {
            setUncontrolledExpanded(newExpanded);
        }
    };

    const getColorClass = () => {
        switch (color) {
            case 'primary':
                return 'text-blue-600';
            case 'secondary':
                return 'text-purple-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'info':
                return 'text-blue-600';
            default:
                return '';
        }
    };

    return (
        <div className={className}>
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`
                        ${variant === 'outlined' ? 'border border-gray-200' : 'shadow-sm'}
                        ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        mb-2 rounded-lg bg-white overflow-hidden
                    `}
                >
                    <button
                        onClick={() => !item.disabled && handleChange(item.id)}
                        disabled={item.disabled}
                        className={`
                            w-full flex items-center justify-between p-4 text-left
                            ${expanded.includes(item.id) ? 'bg-gray-50' : 'hover:bg-gray-50'}
                            transition-colors duration-200
                        `}
                    >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            {item.icon && (
                                <div className={getColorClass()}>
                                    {item.icon}
                                </div>
                            )}
                            <div>
                                <h3 className="text-base font-medium text-gray-900">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <ChevronDown 
                            className={`
                                w-5 h-5 transition-transform duration-200
                                ${expanded.includes(item.id) ? 'rotate-180' : ''}
                                ${getColorClass()}
                            `}
                        />
                    </button>
                    
                    {expanded.includes(item.id) && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            {item.content}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ExpansionPanel; 