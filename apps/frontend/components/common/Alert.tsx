"use client"
import React from 'react';
import {
    Alert as MuiAlert,
    AlertTitle,
    IconButton,
    Collapse,
    Box,
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

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

    const getIcon = () => {
        if (icon) return icon;
        switch (severity) {
            case 'success':
                return <CheckCircleIcon fontSize="inherit" />;
            case 'warning':
                return <WarningIcon fontSize="inherit" />;
            case 'error':
                return <ErrorIcon fontSize="inherit" />;
            case 'info':
                return <InfoIcon fontSize="inherit" />;
            default:
                return null;
        }
    };

    const getBackgroundColor = () => {
        switch (severity) {
            case 'success':
                return 'bg-success-light ';
            case 'warning':
                return 'bg-warning-light ';
            case 'error':
                return 'bg-error-light ';
            case 'info':
                return 'bg-info-light ';
            default:
                return 'bg-gray-100 ';
        }
    };

    const getTextColor = () => {
        switch (severity) {
            case 'success':
                return 'text-success-dark ';
            case 'warning':
                return 'text-warning-dark ';
            case 'error':
                return 'text-error-dark ';
            case 'info':
                return 'text-info-dark ';
            default:
                return 'text-gray-800 ';
        }
    };

    const getBorderColor = () => {
        switch (severity) {
            case 'success':
                return 'border-success-main ';
            case 'warning':
                return 'border-warning-main ';
            case 'error':
                return 'border-error-main ';
            case 'info':
                return 'border-info-main ';
            default:
                return 'border-gray-300 ';
        }
    };

    return (
        <Collapse in={show}>
            <MuiAlert
                severity={severity}
                variant={variant}
                icon={getIcon()}
                action={
                    <Box className="flex items-center space-x-2 rtl:space-x-reverse">
                        {action}
                        {closable && onClose && (
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={onClose}
                                className="opacity-70 hover:opacity-100"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                }
                className={`${getBackgroundColor()} ${getTextColor()} ${getBorderColor()} border rounded-lg p-4 ${className}`}
                sx={{
                    '& .MuiAlert-icon': {
                        color: 'inherit',
                    },
                    '& .MuiAlert-message': {
                        color: 'inherit',
                    },
                }}
            >
                {title && (
                    <AlertTitle className={`${getTextColor()} font-bold mb-1`}>
                        {title}
                    </AlertTitle>
                )}
                <Box className={`${getTextColor()} text-sm`}>
                    {message}
                </Box>
            </MuiAlert>
        </Collapse>
    );
};

export default Alert; 