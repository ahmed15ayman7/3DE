"use client"
import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Typography,
    Divider,
    Button,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: string;
    read: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationDropdownProps {
    notifications: Notification[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
    onClearAll?: () => void;
    className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
    className = '',
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="text-success-main" />;
            case 'error':
                return <ErrorIcon className="text-error-main" />;
            case 'warning':
                return <WarningIcon className="text-warning-main" />;
            case 'info':
                return <InfoIcon className="text-info-main" />;
            default:
                return null;
        }
    };

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'bg-success-light ';
            case 'error':
                return 'bg-error-light ';
            case 'warning':
                return 'bg-warning-light ';
            case 'info':
                return 'bg-info-light ';
            default:
                return '';
        }
    };

    return (
        <Box className={className}>
            <IconButton
                onClick={handleClick}
                className="relative"
                aria-label="show notifications"
            >
                <Badge
                    badgeContent={unreadCount}
                    color="error"
                    className="text-gray-600 "
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className="mt-2"
                PaperProps={{
                    className: `
            w-80
            max-h-96
            rounded-lg
            shadow-lg
            bg-white
          `,
                }}
            >
                <Box className="p-4">
                    <Box className="flex items-center justify-between mb-4">
                        <Typography variant="h6" className="font-medium">
                            الإشعارات
                        </Typography>
                        {unreadCount > 0 && onMarkAllAsRead && (
                            <Button
                                size="small"
                                onClick={() => {
                                    onMarkAllAsRead();
                                    handleClose();
                                }}
                                className="text-primary-main"
                            >
                                تحديث الكل
                            </Button>
                        )}
                    </Box>

                    {notifications.length === 0 ? (
                        <Typography
                            variant="body2"
                            className="text-gray-500  text-center py-4"
                        >
                            لا يوجد إشعارات
                        </Typography>
                    ) : (
                        <Box className="space-y-2">
                            {notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={() => {
                                        if (!notification.read && onMarkAsRead) {
                                            onMarkAsRead(notification.id);
                                        }
                                        if (notification.action) {
                                            notification.action.onClick();
                                        }
                                        handleClose();
                                    }}
                                    className={`
                    ${!notification.read ? 'bg-gray-50 ' : ''}
                    ${getTypeColor(notification.type)}
                    p-3
                    rounded-lg
                    mb-2
                  `}
                                >
                                    <Box className="flex items-start space-x-3 rtl:space-x-reverse">
                                        <Box className="flex-shrink-0 mt-1">
                                            {getTypeIcon(notification.type)}
                                        </Box>
                                        <Box className="flex-1 min-w-0">
                                            <Typography
                                                variant="subtitle2"
                                                className="font-medium mb-1"
                                            >
                                                {notification.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                className="text-gray-600  mb-1"
                                            >
                                                {notification.message}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                className="text-gray-500 "
                                            >
                                                {notification.timestamp}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Box>
                    )}

                    {notifications.length > 0 && onClearAll && (
                        <>
                            <Divider className="my-2" />
                            <Button
                                fullWidth
                                onClick={() => {
                                    onClearAll();
                                    handleClose();
                                }}
                                    className="text-gray-600 "
                            >
                                مسح الكل
                            </Button>
                        </>
                    )}
                </Box>
            </Menu>
        </Box>
    );
};

export default NotificationDropdown; 