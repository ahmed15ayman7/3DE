'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Select, Switch } from '@3de/ui';

// Types
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'quiz' | 'attendance' | 'assignment' | 'system' | 'achievement' | 'message';
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  actionUrl?: string;
  relatedUser?: string;
  relatedCourse?: string;
}

interface NotificationSettings {
  assignments: boolean;
  grades: boolean;
  messages: boolean;
  achievements: boolean;
  urgent: boolean;
  email: boolean;
  push: boolean;
  courseUpdates: boolean;
  studentActivity: boolean;
  systemAlerts: boolean;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'اختبار جديد مطلوب مراجعته',
    message: 'تم تقديم اختبار جديد من طالب أحمد محمد في كورس الرياضيات',
    type: 'quiz',
    isRead: false,
    isImportant: true,
    createdAt: '2024-01-20T10:30:00',
    relatedUser: 'أحمد محمد',
    relatedCourse: 'الرياضيات المتقدمة',
  },
  {
    id: '2',
    title: 'تحديث حضور الطلاب',
    message: 'تم تسجيل حضور 15 طالب في درس الفيزياء اليوم',
    type: 'attendance',
    isRead: true,
    isImportant: false,
    createdAt: '2024-01-20T09:15:00',
    relatedCourse: 'الفيزياء العامة',
  },
  {
    id: '3',
    title: 'رسالة جديدة من طالب',
    message: 'سارة خالد أرسلت رسالة حول استفسار في المنهج',
    type: 'message',
    isRead: false,
    isImportant: false,
    createdAt: '2024-01-19T16:45:00',
    relatedUser: 'سارة خالد',
  },
  {
    id: '4',
    title: 'إنجاز جديد للطالب',
    message: 'فاطمة علي حصلت على شارة "متفوق أكاديمياً"',
    type: 'achievement',
    isRead: true,
    isImportant: false,
    createdAt: '2024-01-19T14:20:00',
    relatedUser: 'فاطمة علي',
  },
  {
    id: '5',
    title: 'تحديث النظام',
    message: 'تم إضافة ميزات جديدة لإدارة الاختبارات',
    type: 'system',
    isRead: false,
    isImportant: true,
    createdAt: '2024-01-18T12:00:00',
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    assignments: true,
    grades: true,
    messages: true,
    achievements: true,
    urgent: true,
    email: false,
    push: true,
    courseUpdates: true,
    studentActivity: true,
    systemAlerts: true,
  });

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !notification.isRead) ||
      (filter === 'important' && notification.isImportant);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesType && matchesSearch;
  });

  // Statistics
  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const importantCount = notifications.filter(n => n.isImportant).length;
  const todayCount = notifications.filter(n => {
    const today = new Date().toDateString();
    const notificationDate = new Date(n.createdAt).toDateString();
    return today === notificationDate;
  }).length;

  const typeOptions = [
    { value: 'all', label: 'جميع الأنواع' },
    { value: 'quiz', label: 'اختبارات' },
    { value: 'attendance', label: 'حضور' },
    { value: 'assignment', label: 'واجبات' },
    { value: 'message', label: 'رسائل' },
    { value: 'achievement', label: 'إنجازات' },
    { value: 'system', label: 'النظام' },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '📝';
      case 'attendance': return '✅';
      case 'assignment': return '📋';
      case 'message': return '💬';
      case 'achievement': return '🏆';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'attendance': return 'bg-green-100 text-green-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      case 'message': return 'bg-yellow-100 text-yellow-800';
      case 'achievement': return 'bg-orange-100 text-orange-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const toggleImportant = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isImportant: !notification.isImportant }
        : notification
    ));
  };

  const handleSettingChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإشعارات</h1>
          <p className="text-gray-600">تابع آخر التحديثات والأنشطة المهمة</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            ⚙️ الإعدادات
          </Button>
          <Button onClick={markAllAsRead} disabled={unreadCount === 0}>
            تحديد الكل كمقروء
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الإشعارات</p>
              <p className="text-2xl font-bold text-gray-900">{totalNotifications}</p>
            </div>
            <div className="text-3xl">🔔</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">غير مقروءة</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <div className="text-3xl">📬</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">مهمة</p>
              <p className="text-2xl font-bold text-orange-600">{importantCount}</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">اليوم</p>
              <p className="text-2xl font-bold text-blue-600">{todayCount}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </motion.div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white rounded-lg shadow-custom border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الإشعارات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">أنواع الإشعارات</h3>
              {Object.entries({
                assignments: 'الواجبات',
                grades: 'الدرجات',
                messages: 'الرسائل',
                achievements: 'الإنجازات',
                urgent: 'الإشعارات العاجلة'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  <Switch
                    checked={notificationSettings[key as keyof NotificationSettings]}
                    onChange={(checked) => handleSettingChange(key as keyof NotificationSettings, checked)}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">طرق التوصيل</h3>
              {Object.entries({
                email: 'البريد الإلكتروني',
                push: 'إشعارات المتصفح'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  <Switch
                    checked={notificationSettings[key as keyof NotificationSettings]}
                    onChange={(checked) => handleSettingChange(key as keyof NotificationSettings, checked)}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">التحديثات</h3>
              {Object.entries({
                courseUpdates: 'تحديثات الكورسات',
                studentActivity: 'نشاط الطلاب',
                systemAlerts: 'تنبيهات النظام'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  <Switch
                    checked={notificationSettings[key as keyof NotificationSettings]}
                    onChange={(checked) => handleSettingChange(key as keyof NotificationSettings, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-custom border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في الإشعارات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />

          <Select
            label="التصفية"
            options={[
              { value: 'all', label: 'جميع الإشعارات' },
              { value: 'unread', label: 'غير مقروءة' },
              { value: 'important', label: 'المهمة' },
            ]}
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          />

          <Select
            label="النوع"
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />

          <div className="flex items-end">
            <Button variant="outline" fullWidth>
              تصفية متقدمة
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-custom border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            الإشعارات ({filteredNotifications.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(notification.type)}`}>
                      <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {notification.isImportant && (
                        <span className="text-yellow-500">⭐</span>
                      )}
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatTime(notification.createdAt)}</span>
                      {notification.relatedUser && (
                        <>
                          <span>•</span>
                          <span>{notification.relatedUser}</span>
                        </>
                      )}
                      {notification.relatedCourse && (
                        <>
                          <span>•</span>
                          <span>{notification.relatedCourse}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        تحديد كمقروء
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleImportant(notification.id)}
                    >
                      {notification.isImportant ? '⭐' : '☆'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إشعارات</h3>
              <p className="text-gray-600">
                {searchTerm || filter !== 'all' || typeFilter !== 'all'
                  ? 'لا توجد إشعارات تطابق معايير البحث'
                  : 'لا توجد إشعارات جديدة'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 