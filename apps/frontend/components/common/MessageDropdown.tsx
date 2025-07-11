"use client"
import React, { useState } from 'react';
import {
    MessageCircle,
    Send,
    Check,
    CheckCircle,
} from 'lucide-react';
import Button from './Button';
import Avatar from './Avatar';

interface Message {
    id: string;
    sender: {
        id: string;
        name: string;
        avatar?: string;
    };
    content: string;
    timestamp: string;
    read: boolean;
    type: 'text' | 'image' | 'file';
    attachment?: {
        url: string;
        name?: string;
        size?: string;
    };
}

interface MessageDropdownProps {
    messages: Message[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
    onClearAll?: () => void;
    onViewAll?: () => void;
    className?: string;
}

const MessageDropdown: React.FC<MessageDropdownProps> = ({
    messages,
    onMarkAsRead,
    onMarkAllAsRead,
    onClearAll,
    onViewAll,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = messages.filter((m) => !m.read).length;

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="show messages"
            >
                <MessageCircle className="w-6 h-6" />
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
                                    الرسائل
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

                            {messages.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    لا يوجد رسائل
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            onClick={() => {
                                                if (!message.read && onMarkAsRead) {
                                                    onMarkAsRead(message.id);
                                                }
                                                handleClose();
                                            }}
                                            className={`
                                                ${!message.read ? 'bg-gray-50' : ''}
                                                p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors
                                            `}
                                        >
                                            <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                                <Avatar
                                                    src={message.sender.avatar}
                                                    alt={message.sender.name}
                                                    name={message.sender.name}
                                                    size="sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-sm font-medium">
                                                            {message.sender.name}
                                                        </h4>
                                                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                            <span className="text-xs text-gray-500">
                                                                {formatTime(message.timestamp)}
                                                            </span>
                                                            {message.read ? (
                                                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                                            ) : (
                                                                <Check className="w-4 h-4 text-gray-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1 line-clamp-2">
                                                        {message.content}
                                                    </p>
                                                    {message.attachment && (
                                                        <div className="flex items-center space-x-1 rtl:space-x-reverse mt-1">
                                                            <Send className="w-3 h-3 text-gray-400" />
                                                            <span className="text-xs text-gray-500">
                                                                {message.attachment.name || 'مرفق'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {(messages.length > 0 || onViewAll) && (
                                <>
                                    <div className="border-t border-gray-200 my-2" />
                                    <div className="flex items-center justify-between">
                                        {messages.length > 0 && onClearAll && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    onClearAll();
                                                    handleClose();
                                                }}
                                                className="text-gray-600 hover:text-gray-700"
                                            >
                                                مسح الكل
                                            </Button>
                                        )}
                                        {onViewAll && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    onViewAll();
                                                    handleClose();
                                                }}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                عرض الكل
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MessageDropdown; 