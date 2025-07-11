"use client"
import React, { useState } from 'react';
import {
    Bell,
    CheckCircle,
    AlertCircle,
    Info,
    AlertTriangle,
} from 'lucide-react';
import Button from './Button';

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
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-l-4 border-green-500';
            case 'error':
                return 'bg-red-50 border-l-4 border-red-500';
            case 'warning':
                return 'bg-yellow-50 border-l-4 border-yellow-500';
            case 'info':
                return 'bg-blue-50 border-l-4 border-blue-500';
            default:
                return '';
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="show notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={handleClose}
                    />
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 max-h-96 rounded-lg shadow-lg bg-white border border-gray-200 z-50 overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">
                                    الإشعارات
                                </h3>
                                {unreadCount > 0 && onMarkAllAsRead && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            onMarkAllAsRead();
                                            handleClose();
                                        }}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        تحديث الكل
                                    </Button>
                                )}
                            </div>

                            {notifications.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    لا يوجد إشعارات
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
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
                                                ${!notification.read ? 'bg-gray-50' : ''}
                                                ${getTypeColor(notification.type)}
                                                p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors
                                            `}
                                        >
                                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getTypeIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {notification.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {notifications.length > 0 && onClearAll && (
                                <>
                                    <div className="border-t border-gray-200 my-2" />
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            onClearAll();
                                            handleClose();
                                        }}
                                        className="w-full text-gray-600 hover:text-gray-700"
                                    >
                                        مسح الكل
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationDropdown; 