"use client"
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
    icon?: React.ReactElement;
    disabled?: boolean;
}

interface AccordionProps {
    items: AccordionItem[];
    expanded?: string[];
    onChange?: (expanded: string[]) => void;
    variant?: 'default' | 'outlined';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
    items,
    expanded: controlledExpanded,
    onChange,
    variant = 'default',
    color = 'primary',
    className = '',
}) => {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState<string[]>([]);
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
                return 'text-gray-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            case 'info':
                return 'text-cyan-600';
            default:
                return 'text-blue-600';
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            {items.map((item) => {
                const isExpanded = expanded.includes(item.id);
                
                return (
                    <div
                        key={item.id}
                        className={cn(
                            "bg-white rounded-lg shadow-sm overflow-hidden",
                            variant === 'outlined' && "border border-gray-200",
                            item.disabled && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <button
                            onClick={() => !item.disabled && handleChange(item.id)}
                            disabled={item.disabled}
                            className={cn(
                                "w-full flex items-center justify-between p-4 text-left transition-colors duration-200",
                                isExpanded ? "bg-gray-50" : "hover:bg-gray-50",
                                item.disabled && "cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                {item.icon && (
                                    <div className={getColorClass()}>
                                        {item.icon}
                                    </div>
                                )}
                                <h3 className="font-medium text-gray-900">
                                    {item.title}
                                </h3>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 transition-transform duration-200",
                                    getColorClass(),
                                    isExpanded && "rotate-180"
                                )}
                            />
                        </button>
                        
                        {isExpanded && (
                            <div className="px-4 pb-4 bg-gray-50">
                                <div className="pt-2">
                                    {item.content}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Accordion; 