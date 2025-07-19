'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  Users,
  GraduationCap,
  UserCheck,
  Award,
  FileText,
  Calendar,
  BarChart3,
  ClipboardList,
  UserX,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { title: 'لوحة التحكم', href: '/', icon: Home },
  { title: 'الكورسات', href: '/courses', icon: BookOpen },
  { title: 'المحاضرين', href: '/instructors', icon: GraduationCap },
  { title: 'الطلاب', href: '/students', icon: Users },
  { title: 'الاشتراكات', href: '/enrollments', icon: UserCheck },
  { title: 'الشهادات', href: '/certificates', icon: Award },
  { title: 'الغيابات', href: '/absences', icon: UserX },
  { title: 'الإنجازات', href: '/achievements', icon: Award },
  { title: 'التقييمات', href: '/submissions', icon: FileText },
  { title: 'الاختبارات', href: '/exams', icon: Calendar },
  { title: 'التحليلات', href: '/analytics', icon: BarChart3 },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isCollapsed, onToggle, isMobile, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '72px' },
    mobile: { x: 0 },
    mobileHidden: { x: '100%' },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial="mobileHidden"
              animate="mobile"
              exit="mobileHidden"
              variants={sidebarVariants}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full bg-gradient-to-b from-primary-main to-primary-dark text-white z-50 w-80 shadow-lg"
            >
              <div className="flex items-center justify-between p-6 border-b border-primary-light/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-primary-main font-bold text-lg">3</span>
                  </div>
                  <span className="text-xl font-bold">3DE Admin</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary-light/20 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-white text-primary-main shadow-md'
                              : 'text-white hover:bg-primary-light/20'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed top-0 right-0 h-full bg-gradient-to-b from-primary-main to-primary-dark text-white z-30 shadow-lg"
    >
      <div className="flex items-center justify-between p-6 border-b border-primary-light/20">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-main font-bold text-lg">3</span>
              </div>
              <span className="text-xl font-bold">3DE Admin</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={onToggle}
          className="p-2 hover:bg-primary-light/20 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-primary-main shadow-md'
                      : 'text-white hover:bg-primary-light/20'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="font-medium"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
} 