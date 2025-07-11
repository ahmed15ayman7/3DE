"use client";
import React, { useState } from 'react';
import {
    MenuIcon,
    Bell as NotificationsIcon,
    MessageCircle as MessageIcon,
    Languages as LanguageIcon,
    Moon as DarkModeIcon,
    Sun as LightModeIcon,
    User as PersonIcon,
    Settings as SettingsIcon,
    LogOut as LogoutIcon,
    X as CloseIcon,
} from 'lucide-react'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import authService from '@/lib/auth.service';
import { signOut } from 'next-auth/react';
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface NavbarProps {
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
        role: string;
    };
    role: string;
    notifications?: Array<{
        id: string;
        title: string;
        message: string;
        read: boolean;
    }>;
    messages?: Array<{
        id: string;
        sender: string;
        message: string;
        read: boolean;
    }>;
    showNotifications: boolean;
    showProfile: boolean;
    showSearch: boolean;
    links: Array<{
        label: string;
        href: string;
    }>;
}

const Navbar: React.FC<NavbarProps> = ({
    user,
    role,
    notifications = [],
    showNotifications = false,
    showProfile = false,
    showSearch = false,
    messages = [],
    links,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
    const [messagesAnchor, setMessagesAnchor] = useState<null | HTMLElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
        if (role === 'STUDENT') {
            router.push('/student/notifications');
        } else {
            setNotificationsAnchor(event.currentTarget);
        }
    };

    const handleMessagesClick = (event: React.MouseEvent<HTMLElement>) => {
        setMessagesAnchor(event.currentTarget);
    };

    const handleCloseNotifications = () => {
        setNotificationsAnchor(null);
    };

    const handleCloseMessages = () => {
        setMessagesAnchor(null);
    };

    const handleToggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        // يمكن إضافة منطق إضافي هنا لتغيير الثيم
    };

    const handleToggleLanguage = () => {
        // يمكن إضافة منطق إضافي هنا لتغيير اللغة
    };

    const handleLogout = async () => {
        try {
            await authService.clearTokens();
            signOut();
            router.push('/auth/signin');
        } catch (error) {
            signOut();
            router.push('/auth/signin');
            console.error('خطأ في تسجيل الخروج:', error);
        }
        handleMenuClose();
    };

    const drawer = (
        <LazyMotion features={domAnimation}>
            <m.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full bg-white shadow-lg"
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">القائمة</h2>
                        <button
                            onClick={handleDrawerToggle}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <CloseIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        {links.map((link, i) => (
                            <li key={i}>
                                <Link
                                    href={link.href}
                                    className={`block px-4 py-2 rounded-lg transition-colors ${
                                        pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
                                            ? 'bg-primary text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={handleDrawerToggle}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        {user && (
                            <>
                                <li>
                                    <Link
                                        href={`${role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : role === 'STUDENT' ? '/student' : role === "PARENT" ? '/parent' : ''}/profile`}
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        onClick={handleDrawerToggle}
                                    >
                                        <PersonIcon className="h-5 w-5 mr-3" />
                                        الملف الشخصي
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/settings"
                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        onClick={handleDrawerToggle}
                                    >
                                        <SettingsIcon className="h-5 w-5 mr-3" />
                                        الإعدادات
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <LogoutIcon className="h-5 w-5 mr-3" />
                                        تسجيل الخروج
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </m.div>
        </LazyMotion>
    );

    return (
        <LazyMotion features={domAnimation}>
            <m.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-50 bg-white text-primary-dark shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Mobile menu button */}
                        <button
                            onClick={handleDrawerToggle}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>

                        {/* Logo */}
                        <Link href="/" prefetch={true} className="flex items-center">
                            <img
                                src="/assets/images/logo.png"
                                alt="Logo"
                                className="h-12 w-auto mr-4 rounded-full"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex flex-1 justify-center gap-8 max-lg:gap-4">
                            {links.map((link, i) => (
                                <Link
                                    href={link.href}
                                    prefetch={true}
                                    key={i}
                                    className={`hover:underline border-2 rounded-lg px-4 py-2 transition-colors ${
                                        pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')
                                            ? 'bg-primary text-white border-primary'
                                            : 'border-transparent text-gray-700 hover:text-primary hover:border-primary'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center space-x-4">
                            {showNotifications && (
                                <button
                                    onClick={handleNotificationsClick}
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <NotificationsIcon className={`h-6 w-6 ${
                                        pathname === '/notifications' || (pathname.startsWith('/notifications') && pathname !== '/notifications')
                                            ? 'text-primary'
                                            : 'text-gray-600'
                                    }`} />
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {notifications.filter(n => !n.read).length}
                                        </span>
                                    )}
                                </button>
                            )}

                            <button
                                onClick={handleMessagesClick}
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <MessageIcon className="h-6 w-6 text-gray-600" />
                                {messages.filter(m => !m.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {messages.filter(m => !m.read).length}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={handleProfileMenuOpen}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="h-8 w-8 rounded-full object-cover"
                                                />
                                            ) : (
                                                user.firstName[0]
                                            )}
                                        </div>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {anchorEl && (
                                        <m.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                        >
                                            <Link
                                                href={`${role === 'ADMIN' ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : role === 'STUDENT' ? '/student' : role === "PARENT" ? '/parent' : ''}/profile/`}
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={handleMenuClose}
                                            >
                                                <PersonIcon className="h-4 w-4 mr-3" />
                                                الملف الشخصي
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                                onClick={handleMenuClose}
                                            >
                                                <SettingsIcon className="h-4 w-4 mr-3" />
                                                الإعدادات
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <LogoutIcon className="h-4 w-4 mr-3" />
                                                تسجيل الخروج
                                            </button>
                                        </m.div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    تسجيل الدخول
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications Dropdown */}
                {notificationsAnchor && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                        {notifications.map((notification, index) => (
                            <div
                                key={index}
                                className={`px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer ${
                                    !notification.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={handleCloseNotifications}
                            >
                                <div className={`font-medium ${!notification.read ? 'font-bold' : ''}`}>
                                    {notification.title}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="px-4 py-3 text-gray-500">
                                لا يوجد إشعارات
                            </div>
                        )}
                    </m.div>
                )}

                {/* Messages Dropdown */}
                {messagesAnchor && (
                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-4 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer ${
                                    !message.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={handleCloseMessages}
                            >
                                <div className={`font-medium ${!message.read ? 'font-bold' : ''}`}>
                                    {message.sender}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {message.message}
                                </div>
                            </div>
                        ))}
                        {messages.length === 0 && (
                            <div className="px-4 py-3 text-gray-500">
                                لا يوجد رسائل
                            </div>
                        )}
                    </m.div>
                )}

                {/* Mobile Drawer */}
                {mobileOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50"
                            onClick={handleDrawerToggle}
                        />
                        <div className="fixed right-0 top-0 h-full w-80 max-w-full">
                            {drawer}
                        </div>
                    </div>
                )}
            </m.nav>
        </LazyMotion>
    );
};

export default Navbar; 