'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button, Avatar, Dropdown, type DropdownItem } from '@3de/ui';
import { useAuth } from '@3de/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const menuItems = [
    {
      id: 'profile',
      label: 'حسابي',
      icon: <User className="h-4 w-4" />,
      onClick: () => router.push('/profile'),
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      id: 'logout',
      label: ' خروج',
      icon: <LogOut className="h-4 w-4" />,
      onClick: logout,
    },
  ];

  // إنشاء Avatar للمستخدم
  const userInitial = user?.firstName?.charAt(0)?.toUpperCase() || 'ط';

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-l from-[#249491] to-[#1d706e] shadow-lg fixed top-0 w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center" onClick={() => window.location.href = '/'}>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary-main to-secondary-main font-bold text-xl">
                3DE
              </span>
            </div>

            {/* <span className="text-xl font-bold text-white">منصة الطالب</span> */}
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                onClick={() => router.push('/notifications')}
                variant="ghost"
                className="relative text-white hover:bg-white/20"
              >
                <Bell className="w-5 h-5" />
                {(user?.notifications?.filter((notification: any) => notification.read === false).length || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></span>
                )}
              </Button>
            </motion.div>

            <Dropdown
              trigger={
                <div className="flex items-center gap-2 cursor-pointer">
                  {user?.avatar ? (
                    <Avatar
                      src={user.avatar}
                      alt={user.firstName + ' ' + user.lastName || 'User'}
                      size="sm"
                      className="border-2 border-white/30"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-secondary-main rounded-full flex items-center justify-center border-2 border-white/30">
                      <span className="text-white font-semibold text-sm">
                        {userInitial}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">
                    {user?.firstName
                      ? user.firstName + ' ' + user.lastName
                      : 'الطالب'}
                  </span>
                </div>
              }
              items={menuItems as unknown as DropdownItem[]}
            />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 py-4"
          >
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => router.push('/notifications')}
                variant="ghost"
                className="justify-start text-white hover:bg-white/20"
              >
                <Bell className="w-5 h-5 mr-3" />
                التنبيهات
              </Button>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="justify-start text-white hover:bg-white/20"
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
