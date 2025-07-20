'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  Award,
  Bell,
  Settings,
  Users2,
  MessageSquare,
  BarChart3,
  X,
  GraduationCap,
  Calendar,
} from 'lucide-react'
import { Avatar } from '@3de/ui'
import { useAuth } from '@3de/auth'
import { useEffect, useState } from 'react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}



export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const pathname = usePathname()
  let { user } = useAuth()
  let [menuItems,setMenuItems] = useState<any[]>([])
  useEffect(() => {
    setMenuItems([
      {
        title: 'الرئيسية',
        icon: LayoutDashboard,
        href: '/',
        badge: null,
      },
      {
        title: 'كورساتي',
        icon: BookOpen,
        href: '/courses',
        badge: null,
      },
      {
        title: 'الاختبارات',
        icon: ClipboardList,
        href: '/quizzes',
        badge: 3,
      },
      {
        title: 'نتائج الاختبارات',
        icon: BarChart3,
        href: '/quizzes/results',
        badge: null,
      },
      {
        title: 'الطلاب',
        icon: Users,
        href: '/students',
        badge: null,
      },
      {
        title: 'الحضور',
        icon: Calendar,
        href: '/attendance',
        badge: 2,
      },
      {
        title: 'الإنجازات',
        icon: Award,
        href: '/achievements',
        badge: user?.achievements?.length || null,
      },
      {
        title: 'المجتمعات',
        icon: Users2,
        href: '/communities',
        badge: user?.Community?.length || null,
      },
      {
        title: 'الإشعارات',
        icon: Bell,
        href: '/notifications',
        badge: user?.notifications?.filter(notification => notification.read === false)?.length || null,
      },
      {
        title: 'الإعدادات',
        icon: Settings,
        href: '/settings',
        badge: null,
      },
    ])
  }, [user])
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: isMobile ? '100%' : 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={isMobile ? 'closed' : 'open'}
      animate={isMobile ? (isOpen ? 'open' : 'closed') : 'open'}
      className={`
        ${isMobile ? 'fixed right-0 top-0 z-30 h-full' : 'relative'}
        w-64 bg-white shadow-lg border-l border-gray-200 flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 gap-reverse">
          <div className="w-8 h-8 bg-primary-main rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">3DE</h2>
            <p className="text-xs text-gray-500">لوحة المحاضر</p>
          </div>
        </div>
        
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 gap-reverse">
          <Avatar
            src={user?.avatar}
            fallback={user?.firstName?.charAt(0)}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
                {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-primary-main text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-main'
                  }
                `}
              >
                <div className="flex items-center gap-3 gap-reverse">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </div>
                
                {item.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      px-2 py-1 text-xs rounded-full font-medium
                      ${active
                        ? 'bg-white/20 text-white'
                        : 'bg-primary-main text-white'
                      }
                    `}
                  >
                    {item.badge}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            أكاديمية 3DE © 2024
          </p>
          <p className="text-xs text-gray-400 mt-1">
            الإصدار 1.0.0
          </p>
        </div>
      </div>
    </motion.aside>
  )
} 