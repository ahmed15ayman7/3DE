'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  MessageSquare,
  Moon,
  Sun,
} from 'lucide-react'
import { Avatar, Dropdown, Badge } from '@3de/ui'
import { useAuth } from '@3de/auth'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  let { user, logout } = useAuth()
  const router = useRouter()
  const userMenuItems = [
    {
      id: 'profile',
      label: 'حسابي',
      icon: <User className="h-4 w-4" />,
      onClick: () => router.push('/profile'),
    },
    {
      id: 'messages',
      label: 'الإعدادات',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push('/settings'),
    },
    {
      id: 'divider',
      label: '',
      divider: true,
    },
    {
      id: 'logout',
      label: 'تسجيل الخروج',
      icon: <LogOut className="h-4 w-4" />,
      onClick: () => logout(),
    },
  ]

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4 gap-reverse">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Page title - could be dynamic */}
          {/* <div>
            <h1 className="text-xl font-semibold text-gray-900">
              لوحة التحكم
            </h1>
            <p className="text-sm text-gray-500">
              مرحباً بك، أحمد محمد
            </p>
          </div> */}
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في الكورسات، الطلاب، المواد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent bg-gray-50"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 gap-reverse">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-gray-600" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => {
              router.push('/notifications')
            }}>
              <div className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {(user?.notifications?.filter(notification => notification.read === false)?.length || 0) > 0 && <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {user?.notifications?.filter(notification => notification.read === false).length}
                </motion.span>}
              </div>
            </button>
          </div>

          {/* Messages */}
          {/* <div className="relative">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <div className="relative">
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary-main text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
                >
                  3
                </motion.span>
              </div>
            </button>
          </div> */}

          {/* User menu */}
          <Dropdown
            trigger={
              <button className="flex items-center gap-2 gap-reverse hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <Avatar
                  src={user?.avatar}
                  fallback={user?.firstName?.charAt(0)}
                  size="sm"
                />
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    محاضر
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            }
            items={userMenuItems}
            position="bottom-left"
          />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent bg-gray-50"
          />
        </div>
      </div>
    </header>
  )
} 