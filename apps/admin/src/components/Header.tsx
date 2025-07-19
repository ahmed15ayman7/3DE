'use client';

import { useState } from 'react';
import { useAuth } from '@3de/auth';
import { Bell, User, Menu, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
  isCollapsed: boolean;
}

export default function Header({ onMenuClick, isMobile, isCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header 
      className={`bg-white border-b border-gray-200 shadow-sm transition-all duration-300 z-20 ${
        isMobile ? 'fixed top-0 left-0 right-0' : 
        isCollapsed ? 'fixed top-0 right-[72px] left-0' : 'fixed top-0 right-[280px] left-0'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button for mobile or title */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">لوحة التحكم الإدارية</h1>
            <p className="text-sm text-gray-500">أكاديمية 3DE التعليمية</p>
          </div>
        </div>

        {/* Right side - User info and notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">الإشعارات</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">طلب شهادة جديد</p>
                      <p className="text-xs text-gray-500 mt-1">أحمد محمد طلب شهادة إتمام الكورس</p>
                      <p className="text-xs text-blue-500 mt-1">منذ 5 دقائق</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">تسجيل جديد</p>
                      <p className="text-xs text-gray-500 mt-1">فاطمة علي انضمت إلى كورس البرمجة</p>
                      <p className="text-xs text-blue-500 mt-1">منذ 10 دقائق</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm font-medium text-gray-800">اختبار مكتمل</p>
                      <p className="text-xs text-gray-500 mt-1">سارة حسن أكملت اختبار الوحدة الأولى</p>
                      <p className="text-xs text-blue-500 mt-1">منذ 15 دقيقة</p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                      عرض جميع الإشعارات
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary-main to-primary-dark rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <User className="w-4 h-4" />
                      الملف الشخصي
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                      الإعدادات
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
} 