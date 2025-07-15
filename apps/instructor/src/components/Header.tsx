'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'طالب جديد',
    message: 'تم تسجيل أحمد محمد في كورس البرمجة',
    time: 'منذ 5 دقائق',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    title: 'اختبار جديد',
    message: 'تم إرسال اختبار جديد في الرياضيات',
    time: 'منذ ساعة',
    read: false,
    type: 'success'
  },
  {
    id: '3',
    title: 'تأخير في التسليم',
    message: 'سارة أحمد لم تسلم الواجب في الموعد',
    time: 'منذ ساعتين',
    read: true,
    type: 'warning'
  },
];

export function Header({ className = '' }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'الرئيسية';
      case '/courses':
        return 'الكورسات';
      case '/quizzes':
        return 'الاختبارات';
      case '/students':
        return 'الطلاب';
      case '/attendance':
        return 'الحضور';
      case '/achievements':
        return 'الإنجازات';
      case '/communities':
        return 'المجتمعات';
      case '/notifications':
        return 'الإشعارات';
      case '/settings':
        return 'الإعدادات';
      default:
        return 'منصة 3DE';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <header className={`
      bg-white shadow-sm border-b border-gray-200 
      px-6 py-4 flex items-center justify-between
      ${className}
    `}>
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-sm text-gray-500">مرحباً بك في لوحة التحكم</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="البحث..."
            className="
              px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent
              w-64
            "
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              relative p-2 text-gray-600 hover:text-gray-900 
              hover:bg-gray-100 rounded-lg transition-colors
            "
          >
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
              <span className="
                absolute -top-1 -right-1 bg-red-500 text-white 
                text-xs rounded-full w-5 h-5 flex items-center justify-center
              ">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="
              absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg 
              border border-gray-200 z-50 max-h-96 overflow-y-auto
            ">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">الإشعارات</h3>
              </div>
              <div className="py-2">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100
                      ${!notification.read ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <Link
                  href="/notifications"
                  className="text-sm text-primary-main hover:text-primary-dark"
                  onClick={() => setShowNotifications(false)}
                >
                  عرض جميع الإشعارات
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">د. محمد أحمد</p>
              <p className="text-xs text-gray-500">محاضر</p>
            </div>
            <div className="w-8 h-8 bg-primary-main rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">م</span>
            </div>
            <span className="text-gray-400">▼</span>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="
              absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
              border border-gray-200 z-50
            ">
              <div className="py-2">
                <Link
                  href="/profile"
                  className="
                    block px-4 py-2 text-sm text-gray-700 
                    hover:bg-gray-100 transition-colors
                  "
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="mr-3">👤</span>
                  الملف الشخصي
                </Link>
                <Link
                  href="/settings"
                  className="
                    block px-4 py-2 text-sm text-gray-700 
                    hover:bg-gray-100 transition-colors
                  "
                  onClick={() => setShowUserMenu(false)}
                >
                  <span className="mr-3">⚙️</span>
                  الإعدادات
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="
                    block w-full text-right px-4 py-2 text-sm text-red-600 
                    hover:bg-red-50 transition-colors
                  "
                  onClick={() => {
                    setShowUserMenu(false);
                    // Handle logout
                  }}
                >
                  <span className="mr-3">🚪</span>
                  تسجيل الخروج
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        ></div>
      )}
    </header>
  );
} 