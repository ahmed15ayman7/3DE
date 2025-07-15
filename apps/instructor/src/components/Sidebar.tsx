'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'الرئيسية', href: '/', icon: '🏠' },
  { id: 'courses', label: 'الكورسات', href: '/courses', icon: '📚' },
  { id: 'quizzes', label: 'الاختبارات', href: '/quizzes', icon: '📝' },
  { id: 'students', label: 'الطلاب', href: '/students', icon: '👥' },
  { id: 'attendance', label: 'الحضور', href: '/attendance', icon: '✅' },
  { id: 'achievements', label: 'الإنجازات', href: '/achievements', icon: '🏆' },
  { id: 'communities', label: 'المجتمعات', href: '/communities', icon: '💬', badge: 3 },
  { id: 'notifications', label: 'الإشعارات', href: '/notifications', icon: '🔔', badge: 5 },
  { id: 'settings', label: 'الإعدادات', href: '/settings', icon: '⚙️' },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`
        bg-white shadow-lg border-l border-gray-200 
        flex flex-col h-screen relative z-10 transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-70'}
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-main rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🎓</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">3DE</h1>
                <p className="text-sm text-gray-500">لوحة المحاضر</p>
              </div>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">
              {isCollapsed ? '←' : '→'}
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                w-full flex items-center p-3 rounded-lg transition-all duration-200
                hover:bg-gray-100 group relative
                ${isActive 
                  ? 'bg-primary-main text-white shadow-lg' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
            >
              <span className="text-xl flex-shrink-0">
                {item.icon}
              </span>
              
              {!isCollapsed && (
                <div className="mr-3 flex items-center justify-between w-full">
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-primary-main text-white'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Collapsed state tooltip */}
              {isCollapsed && (
                <div className="
                  absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-sm 
                  rounded opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none whitespace-nowrap z-50
                ">
                  {item.label}
                  {item.badge && (
                    <span className="mr-2 px-1 bg-primary-main rounded text-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 منصة 3DE التعليمية
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 