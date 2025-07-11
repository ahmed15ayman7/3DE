"use client"
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
    severity?: 'success' | 'warning' | 'error' | 'info';
    title?: string;
    message: string;
    onClose?: () => void;
    closable?: boolean;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    variant?: 'standard' | 'filled' | 'outlined';
    className?: string;
    autoHideDuration?: number;
    show?: boolean;
}

const Alert: React.FC<AlertProps> = ({
    severity = 'info',
    title,
    message,
    onClose,
    closable = true,
    icon,
    action,
    variant = 'standard',
    className = '',
    autoHideDuration,
    show = true,
}) => {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
    }, [show]);

    useEffect(() => {
        if (autoHideDuration && isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, autoHideDuration);

            return () => clearTimeout(timer);
        }
    }, [autoHideDuration, isVisible, onClose]);

    const getIcon = () => {
        if (icon) return icon;
        switch (severity) {
            case 'success':
                return <CheckCircle className="h-5 w-5" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5" />;
            case 'error':
                return <AlertCircle className="h-5 w-5" />;
            case 'info':
                return <Info className="h-5 w-5" />;
            default:
                return null;
        }
    };

    const getStyles = () => {
        const baseClasses = 'border rounded-lg p-4 flex items-start space-x-3 rtl:space-x-reverse';
        
        switch (severity) {
            case 'success':
                return {
                    container: cn(
                        baseClasses,
                        variant === 'filled' && 'bg-green-50 border-green-200 text-green-800',
                        variant === 'outlined' && 'bg-transparent border-green-500 text-green-700',
                        variant === 'standard' && 'bg-green-50 border-green-200 text-green-800'
                    ),
                    icon: 'text-green-600'
                };
            case 'warning':
                return {
                    container: cn(
                        baseClasses,
                        variant === 'filled' && 'bg-yellow-50 border-yellow-200 text-yellow-800',
                        variant === 'outlined' && 'bg-transparent border-yellow-500 text-yellow-700',
                        variant === 'standard' && 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    ),
                    icon: 'text-yellow-600'
                };
            case 'error':
                return {
                    container: cn(
                        baseClasses,
                        variant === 'filled' && 'bg-red-50 border-red-200 text-red-800',
                        variant === 'outlined' && 'bg-transparent border-red-500 text-red-700',
                        variant === 'standard' && 'bg-red-50 border-red-200 text-red-800'
                    ),
                    icon: 'text-red-600'
                };
            case 'info':
                return {
                    container: cn(
                        baseClasses,
                        variant === 'filled' && 'bg-blue-50 border-blue-200 text-blue-800',
                        variant === 'outlined' && 'bg-transparent border-blue-500 text-blue-700',
                        variant === 'standard' && 'bg-blue-50 border-blue-200 text-blue-800'
                    ),
                    icon: 'text-blue-600'
                };
            default:
                return {
                    container: cn(
                        baseClasses,
                        variant === 'filled' && 'bg-gray-50 border-gray-200 text-gray-800',
                        variant === 'outlined' && 'bg-transparent border-gray-500 text-gray-700',
                        variant === 'standard' && 'bg-gray-50 border-gray-200 text-gray-800'
                    ),
                    icon: 'text-gray-600'
                };
        }
    };

    const styles = getStyles();

    if (!isVisible) return null;

    return (
        <div className={cn(styles.container, className)}>
            <div className={cn('flex-shrink-0', styles.icon)}>
                {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className="font-bold mb-1">
                        {title}
                    </h4>
                )}
                <p className="text-sm">
                    {message}
                </p>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {action}
                {closable && onClose && (
                    <button
                        onClick={onClose}
                        className="opacity-70 hover:opacity-100 transition-opacity p-1 rounded"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert; 