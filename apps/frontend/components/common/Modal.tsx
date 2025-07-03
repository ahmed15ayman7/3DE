"use client"
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import {
    Close as CloseIcon,
    Check as CheckIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'text' | 'contained' | 'outlined';
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
                return <CheckIcon className="text-success-main" />;
            case 'warning':
                return <WarningIcon className="text-warning-main" />;
            case 'error':
                return <ErrorIcon className="text-error-main" />;
            case 'info':
                return <InfoIcon className="text-info-main" />;
            default:
                return null;
        }
    };

    const getColor = (actionColor?: string) => {
        switch (actionColor) {
            case 'primary':
                return 'primary';
            case 'secondary':
                return 'secondary';
            case 'error':
                return 'error';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            case 'success':
                return 'success';
            default:
                return 'primary';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={maxWidth}
            fullWidth={fullWidth}
            disableEscapeKeyDown={disableEscapeKeyDown}
            className={`rtl:font-arabic ${className}`}
            PaperProps={{
                className: 'bg-white  text-primary-dark  rounded-lg',
            }}
        >
            <DialogTitle className="flex justify-between items-center p-4 border-b border-gray-200 ">
                <Box className="flex items-center space-x-2 rtl:space-x-reverse">
                    {getIcon()}
                    <Typography variant="h6" className="font-bold">
                        {title}
                    </Typography>
                </Box>
                {showCloseButton && (
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                        className="text-gray-500 hover:text-gray-700 "
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent className="p-4">
                {children}
            </DialogContent>

            {actions.length > 0 && (
                    <DialogActions className="p-4 border-t border-gray-200 ">
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || 'contained'}
                            color={getColor(action.color)}
                            onClick={action.onClick}
                            startIcon={action.startIcon}
                            endIcon={action.endIcon}
                            disabled={action.disabled}
                            className="ml-2 rtl:ml-0 rtl:mr-2"
                        >
                            {action.label}
                        </Button>
                    ))}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default Modal; 