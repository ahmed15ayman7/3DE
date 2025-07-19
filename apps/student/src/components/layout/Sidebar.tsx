'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Users, FileText, Bell, Settings, User, ChevronLeft, ChevronRight, Award ,Route,School } from 'lucide-react';
import { Button } from '@3de/ui';

const menuItems = [
  { label: 'الرئيسية', icon: Home, href: '/' },
  { label: 'الكورسات', icon: BookOpen, href: '/courses' },
  { label: 'المحاضرين', icon: School, href: '/instructors' },
  { label: 'الاختبارات', icon: FileText, href: '/exams' },
  { label: 'المجتمعات', icon: Users, href: '/communities' },
  { label: 'المسارات', icon: Route, href: '/paths' },
  { label: 'الشهادات', icon: Award, href: '/certificates' },
  { label: 'التنبيهات', icon: Bell, href: '/notifications' },
  { label: 'الملف الشخصي', icon: User, href: '/profile' },
  { label: 'الإعدادات', icon: Settings, href: '/settings' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export default function Sidebar({ isSidebarOpen, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: isSidebarOpen && !isMobile ? 256 : 72}}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`bg-white shadow-xl fixed top-24 right-0 z-40 ${isMobile ? 'translate-x-full':isSidebarOpen && isMobile ? 'translate-x-0' : 'translate-x-0'}`}
      style={{ height: 'calc(100vh - 96px)' }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b border-gray-200 min-h-[64px] relative ${isMobile ? '' : ''}`}>
          <AnimatePresence mode="wait">
            {isSidebarOpen && !isMobile ? (
              <motion.div
                key="logo-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="w-8 h-8 bg-primary-main rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3DE</span>
                </div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-bold text-gray-900 whitespace-nowrap"
                >
                  الطالب
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-only"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <div className="w-8 h-8 bg-primary-main rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3DE</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <Button
            variant="text"
            size="sm"
            onClick={onToggle}
            className="text-gray-700  hover:bg-gray-100 flex-shrink-0"
            aria-label={isSidebarOpen ? 'طي القائمة الجانبية' : 'فتح القائمة الجانبية'}
          >
            {isSidebarOpen ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href ||( pathname.startsWith(item.href) && item.href !== '/');

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 ${isSidebarOpen ? 'p-3 ' : 'p-2 py-3 justify-center'} rounded-lg cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-main text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence mode="wait">
                    {isSidebarOpen && !isMobile && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 min-h-[64px]">
          <AnimatePresence mode="wait">
            {isSidebarOpen && !isMobile ? (
              <motion.div
                key="footer-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-gray-500 text-center"
              >
                منصة 3DE التعليمية
              </motion.div>
            ) : (
              <motion.div
                key="footer-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center"
              >
                <div className="w-6 h-6 bg-primary-main rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
} 