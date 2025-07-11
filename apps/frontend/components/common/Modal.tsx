"use client"
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { X, Check, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
        color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
        startIcon?: React.ReactNode;
        endIcon?: React.ReactNode;
        disabled?: boolean;
    }>;
    type?: 'default' | 'success' | 'warning' | 'error' | 'info';
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
    disableEscapeKeyDown?: boolean;
    showCloseButton?: boolean;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({
    open,
    onClose,
    title,
    children,
    actions = [],
    type = 'default',
    maxWidth = 'sm',
    fullWidth = true,
    disableBackdropClick = false,
    disableEscapeKeyDown = false,
    showCloseButton = true,
    className = '',
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Check className="h-5 w-5 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            case 'info':
                return <Info className="h-5 w-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getMaxWidthClass = () => {
        switch (maxWidth) {
            case 'xs':
                return 'max-w-xs';
            case 'sm':
                return 'max-w-sm';
            case 'md':
                return 'max-w-md';
            case 'lg':
                return 'max-w-lg';
            case 'xl':
                return 'max-w-xl';
            default:
                return 'max-w-lg';
        }
    };

    const handleBackdropClick = () => {
        if (!disableBackdropClick) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape' && !disableEscapeKeyDown) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent 
                className={cn(
                    getMaxWidthClass(),
                    fullWidth && "w-full",
                    className
                )}
                onKeyDown={handleKeyDown}
            >
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {getIcon()}
                            <DialogTitle className="text-lg font-semibold">
                                {title}
                            </DialogTitle>
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">إغلاق</span>
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <DialogBody>
                    {children}
                </DialogBody>

                {actions.length > 0 && (
                    <DialogFooter>
                        <div className="flex items-center justify-end space-x-2">
                            {actions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant={action.variant || 'default'}
                                    onClick={action.onClick}
                                    disabled={action.disabled}
                                    className="ml-2 rtl:ml-0 rtl:mr-2"
                                >
                                    {action.startIcon && (
                                        <span className="mr-2">{action.startIcon}</span>
                                    )}
                                    {action.label}
                                    {action.endIcon && (
                                        <span className="ml-2">{action.endIcon}</span>
                                    )}
                                </Button>
                            ))}
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Modal; 