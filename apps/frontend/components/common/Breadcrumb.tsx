"use client"
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
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
    separator = <ChevronRight className="h-4 w-4" />,
    maxItems = 5,
    className = '',
    color = 'primary',
    size = 'medium',
}) => {
    const router = useRouter();

    const getColorClasses = () => {
        switch (color) {
            case 'primary':
                return 'text-blue-600 hover:text-blue-800';
            case 'secondary':
                return 'text-gray-600 hover:text-gray-800';
            case 'success':
                return 'text-green-600 hover:text-green-800';
            case 'error':
                return 'text-red-600 hover:text-red-800';
            case 'warning':
                return 'text-yellow-600 hover:text-yellow-800';
            case 'info':
                return 'text-cyan-600 hover:text-cyan-800';
            default:
                return 'text-blue-600 hover:text-blue-800';
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

    const displayItems = maxItems ? items.slice(-maxItems) : items;

    return (
        <nav
            className={cn(
                "py-2 px-4 rounded-lg bg-gray-50",
                getSizeClasses(),
                className
            )}
            aria-label="breadcrumb"
        >
            <ol className="flex items-center space-x-2 rtl:space-x-reverse">
                {displayItems.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span className="mx-2 text-gray-400">
                                {separator}
                            </span>
                        )}
                        
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            {item.icon && (
                                <span className="flex-shrink-0">
                                    {item.icon}
                                </span>
                            )}
                            
                            {index === displayItems.length - 1 ? (
                                <span className={cn(
                                    getColorClasses(),
                                    "font-medium opacity-70"
                                )}>
                                    {item.label}
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleClick(item.href)}
                                    className={cn(
                                        getColorClasses(),
                                        "font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                                    )}
                                >
                                    {item.label}
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb; 