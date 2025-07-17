'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  CheckCircle,
  Search,
  MoreVertical,
  Users,
  MessageSquare,
  Award,
  BookOpen,
  AlertCircle,
  Settings,
  Trash2,
  Archive,
  Eye,
  EyeOff,
  File,
  Trophy,
} from 'lucide-react'
import { Card, Button, Badge, Avatar, Dropdown, Tabs } from '@3de/ui'
import { notificationApi } from '@3de/apis'
import { useAuth } from '@3de/auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Notification } from '@3de/interfaces'
import { useRouter } from 'next/navigation'


const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}) => {
  const router = useRouter()
  const getIcon = () => {
    switch (notification.type) {
      case 'ASSIGNMENT':
        return <File className="h-5 w-5 text-blue-500" />
      case 'MESSAGE':
          return <MessageSquare className="h-5 w-5 text-green-500" />
      case 'ACHIEVEMENT':
        return <Trophy className="h-5 w-5 text-purple-500" />
      case 'URGENT':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      case 'EVENT':
        return <Settings className="h-5 w-5 text-gray-500" />
      case 'ABSENCE':
        return <Award className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getBgColor = () => {
    if (notification.isImportant) return 'bg-red-50 border-red-200'
    if (!notification.read) return 'bg-blue-50 border-blue-200'
    return 'bg-white border-gray-200'
  }

  const menuItems = [
    {
      id: 'read',
      label: notification.read ? 'تعيين كغير مقروء' : 'تعيين كمقروء',
      icon: notification.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />,
      onClick: () => onMarkAsRead(notification.id),
    },
    {
      id: 'archive',
      label: 'أرشفة',
      icon: <Archive className="h-4 w-4" />,
      onClick: () => {},
    },
    {
      id: 'delete',
      label: 'حذف',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(notification.id),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getBgColor()}`}
    >
      <div className="flex items-start gap-4 gap-reverse">
        {/* Notification Icon */}
        <div className="flex-shrink-0">
          {notification.user?.avatar ? (
            <Avatar src={notification.user?.avatar} fallback="?" size="sm" />
          ) : (
            <div className="p-2 bg-gray-100 rounded-full">
              {getIcon()}
            </div>
          )}
        </div>

        {/* Notification Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 gap-reverse mb-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                {notification.isImportant && (
                  <Badge variant="danger" size="sm">
                    مهم
                  </Badge>
                )}
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {notification.message}
              </p>
              
              <p className="text-xs text-gray-500">
                {notification.createdAt.toLocaleString()}
              </p>
            </div>

            <Dropdown
              trigger={
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
              items={menuItems}
              position="bottom-left"
            />
          </div>

          {/* Action Button */}
          {notification.actionUrl && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(notification.actionUrl as string)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getAllByUserId(user?.id as string),
    enabled: !!user?.id,
  })
  useEffect(()=>{
    refetch()
  },[user,refetch])
  let markAsRead=useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      refetch()
    }
  })
  let deleteNotification=useMutation({
    mutationFn: (id: string) => notificationApi.delete(id),
    onSuccess: () => {
      refetch()
    }
  })
  let markAllAsRead=useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      refetch()
    }
  })
  const filteredNotifications = notifications?.data?.filter((notification: Notification) => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'urgent' && notification.urgent) ||
                         (filter === 'important' && notification.isImportant) ||
                         (filter === notification.type)
    
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  const unreadCount = notifications?.data?.filter((n: Notification) => !n.read).length
  const importantCount = notifications?.data?.filter((n: Notification) => n.isImportant).length


  const tabItems = [
    {
      id: 'all',
      label: `جميع الإشعارات (${notifications?.data?.length})`,
      content: (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotifications?.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead.mutate}
                onDelete={deleteNotification.mutate}
              />
            ))}
          </AnimatePresence>

          {filteredNotifications?.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد إشعارات
              </h3>
              <p className="text-gray-600">
                {searchQuery || filter !== 'all' 
                  ? 'لا توجد إشعارات تطابق المعايير المحددة'
                  : 'ستظهر الإشعارات الجديدة هنا'
                }
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'إعدادات الإشعارات',
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              تخصيص الإشعارات
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 gap-reverse">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">الطلاب الجدد</h4>
                    <p className="text-sm text-gray-600">إشعار عند انضمام طلاب جدد</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary-main" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 gap-reverse">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">الرسائل الجديدة</h4>
                    <p className="text-sm text-gray-600">إشعار عند تلقي رسائل</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary-main" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 gap-reverse">
                  <Award className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">نتائج الاختبارات</h4>
                    <p className="text-sm text-gray-600">إشعار عند تسليم الاختبارات</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary-main" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 gap-reverse">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">تحديثات الكورسات</h4>
                    <p className="text-sm text-gray-600">إشعارات حول الكورسات والدروس</p>
                  </div>
                </div>
                <input type="checkbox" className="rounded text-primary-main" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 gap-reverse">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">تحديثات النظام</h4>
                    <p className="text-sm text-gray-600">إشعارات النظام والتحديثات</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-primary-main" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              طرق التنبيه
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">إشعارات المتصفح</span>
                <input type="checkbox" defaultChecked className="rounded text-primary-main" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">الإشعارات الصوتية</span>
                <input type="checkbox" className="rounded text-primary-main" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">البريد الإلكتروني</span>
                <input type="checkbox" defaultChecked className="rounded text-primary-main" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700">الرسائل النصية</span>
                <input type="checkbox" className="rounded text-primary-main" />
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-600 mt-1">
            متابعة جميع التحديثات والأنشطة المهمة
          </p>
        </div>

        <div className="flex items-center gap-3 gap-reverse">
          {unreadCount && unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead.mutate}>
              <CheckCircle className="h-4 w-4 ml-2" />
              تعيين الكل كمقروء ({unreadCount})
            </Button>
          )}
          {/* <Button variant="outline" onClick={() => {}}>
            <Trash2 className="h-4 w-4 ml-2" />
            مسح الكل
          </Button> */}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {notifications?.data?.length}
          </div>
          <div className="text-sm text-gray-600">إجمالي الإشعارات</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {unreadCount}
          </div>
          <div className="text-sm text-gray-600">غير مقروءة</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {importantCount}
          </div>
          <div className="text-sm text-gray-600">مهمة</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
              {notifications?.data?.filter((n: Notification) => n.read).length}
          </div>
          <div className="text-sm text-gray-600">مقروءة</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الإشعارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 gap-reverse">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع الإشعارات</option>
              <option value="unread">غير مقروءة</option>
              <option value="important">مهمة</option>
              <option value="student">الطلاب</option>
              <option value="message">الرسائل</option>
              <option value="quiz">الاختبارات</option>
              <option value="course">الكورسات</option>
              <option value="system">النظام</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabItems}
          defaultActiveTab="all"
          variant="underline"
          fullWidth
        />
      </Card>
    </div>
  )
} 