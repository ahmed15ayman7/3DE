'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button, Avatar, Dropdown, type DropdownItem } from '@3de/ui';
import { useAuth } from '@3de/auth';
import Image from 'next/image';

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({ isSidebarOpen, onToggleSidebar }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'الملف الشخصي', icon: User, href: '/profile' },
    { label: 'الإعدادات', icon: Settings, href: '/settings' },
    { label: 'تسجيل الخروج', icon: LogOut, onClick: logout },
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
            <div className="w-20 h-20 rounded-full flex items-center justify-center border border-white/30">
              {/* <span className="text-white font-bold text-lg">3DE</span> */}
              <Image src="/logo.png" alt="3DE" width={40} height={40} className="rounded-full object-cover w-full h-full" priority />
            </div>
            <span className="text-xl font-bold text-white">منصة الطالب</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="ghost" className="relative text-white hover:bg-white/20">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></span>
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
                      <span className="text-white font-semibold text-sm">{userInitial}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-white">
                    {user?.firstName ? user.firstName + ' ' + user.lastName : 'الطالب'}
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
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              <Button variant="ghost" className="justify-start text-white hover:bg-white/20">
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
                  <item.icon className="w-5 h-5 mr-3" />
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