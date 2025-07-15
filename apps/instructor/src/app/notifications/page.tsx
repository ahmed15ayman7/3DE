'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, Select, Switch, LoadingAnimation, Alert, Tabs } from '@3de/ui';
import { Search, Filter, Bell, Check, Star, Settings, CheckCheck } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead } from '../../hooks/useInstructorQueries';
import { Notification, NotificationSettings } from '@3de/interfaces';

const NotificationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('notifications');

  // Mock current user ID - في التطبيق الحقيقي سيتم الحصول عليه من السياق
  const currentUserId = 'instructor-1';

  // React Query hooks
  const { 
    data: notifications, 
    isLoading: notificationsLoading, 
    error: notificationsError,
    refetch: refetchNotifications
  } = useNotifications(currentUserId);
  
  const markAsReadMutation = useMarkNotificationAsRead();

  // Mock notification settings - في التطبيق الحقيقي سيتم جلبها من API
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    id: 'settings-1',
    userId: currentUserId,
    assignments: true,
    grades: true,
    messages: true,
    achievements: true,
    urgent: true,
    email: false,
    push: true,
    createdAt: new Date(),
    user: undefined
  });

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'جميع الإشعارات' },
    { value: 'unread', label: 'غير المقروءة' },
    { value: 'important', label: 'المهمة' },
    { value: 'quiz', label: 'الاختبارات' },
    { value: 'attendance', label: 'الحضور' },
    { value: 'assignment', label: 'المهام' },
    { value: 'system', label: 'النظام' },
    { value: 'achievement', label: 'الإنجازات' },
    { value: 'message', label: 'الرسائل' },
  ];

  // Event handlers
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!notifications?.data) return;

    const unreadNotifications = notifications.data.filter((notif: Notification) => !notif.read);
    
    try {
      await Promise.all(
        unreadNotifications.map((notif: Notification) => 
          markAsReadMutation.mutateAsync(notif.id)
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleSettingChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    // Here you would typically call an API to update the settings
  };

  // Filter notifications
  const filteredNotifications = notifications?.data?.filter((notification: Notification) => {
    const matchesSearch = notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = (() => {
      switch (selectedFilter) {
        case 'unread':
          return !notification.read;
        case 'important':
          return notification.isImportant;
        case 'all':
          return true;
        default:
          return notification.type === selectedFilter;
      }
    })();

    return matchesSearch && matchesFilter;
  }) || [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'attendance':
        return '📊';
      case 'assignment':
        return '📋';
      case 'system':
        return '⚙️';
      case 'achievement':
        return '🏆';
      case 'message':
        return '💬';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'blue';
      case 'attendance':
        return 'green';
      case 'assignment':
        return 'purple';
      case 'system':
        return 'gray';
      case 'achievement':
        return 'yellow';
      case 'message':
        return 'indigo';
      default:
        return 'blue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="ابحث في الإشعارات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            options={filterOptions}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleMarkAllAsRead}
          disabled={markAsReadMutation.isPending}
          icon={<CheckCheck className="w-4 h-4" />}
        >
          تحديد الكل كمقروء
        </Button>
      </div>

      {/* Notifications List */}
      {notificationsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingAnimation size="lg" text="جاري تحميل الإشعارات..." />
        </div>
      ) : notificationsError ? (
        <Alert variant="error" title="خطأ في تحميل الإشعارات">
          حدث خطأ أثناء تحميل الإشعارات. يرجى المحاولة مرة أخرى.
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetchNotifications()}
            className="mt-2"
          >
            إعادة المحاولة
          </Button>
        </Alert>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notification: Notification, index: number) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-custom border border-gray-200 p-6 ${
                !notification.read ? 'border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getNotificationColor(notification.type)}-100`}>
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {notification.isImportant && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDate(notification.createdAt.toString())}</span>
                      <span className={`px-2 py-1 rounded-full bg-${getNotificationColor(notification.type)}-100 text-${getNotificationColor(notification.type)}-800`}>
                        {filterOptions.find(opt => opt.value === notification.type)?.label || notification.type}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      disabled={markAsReadMutation.isPending}
                      icon={<Check className="w-4 h-4" />}
                    >
                      تحديد كمقروء
                    </Button>
                  )}
                  {notification.actionUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      عرض التفاصيل
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedFilter !== 'all' ? 'لا توجد إشعارات مطابقة' : 'لا توجد إشعارات'}
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedFilter !== 'all' 
              ? 'جرب تغيير معايير البحث أو التصفية' 
              : 'ستظهر إشعاراتك هنا عند وصولها'
            }
          </p>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-custom border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">إعدادات الإشعارات</h3>
        
        <div className="space-y-6">
          {/* Notification Types */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">أنواع الإشعارات</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">المهام والواجبات</label>
                <Switch
                  checked={notificationSettings.assignments}
                  onChange={(checked) => handleSettingChange('assignments', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">الدرجات والتقييمات</label>
                <Switch
                  checked={notificationSettings.grades}
                  onChange={(checked) => handleSettingChange('grades', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">الرسائل</label>
                <Switch
                  checked={notificationSettings.messages}
                  onChange={(checked) => handleSettingChange('messages', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">الإنجازات والجوائز</label>
                <Switch
                  checked={notificationSettings.achievements}
                  onChange={(checked) => handleSettingChange('achievements', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">الإشعارات العاجلة</label>
                <Switch
                  checked={notificationSettings.urgent}
                  onChange={(checked) => handleSettingChange('urgent', checked)}
                />
              </div>
            </div>
          </div>

          {/* Delivery Methods */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">طرق التسليم</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">البريد الإلكتروني</label>
                <Switch
                  checked={notificationSettings.email}
                  onChange={(checked) => handleSettingChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">إشعارات المتصفح</label>
                <Switch
                  checked={notificationSettings.push}
                  onChange={(checked) => handleSettingChange('push', checked)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <Button variant="primary">
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { 
      id: 'notifications', 
      label: 'الإشعارات', 
      icon: <Bell className="w-4 h-4" />,
      content: renderNotificationsTab()
    },
    { 
      id: 'settings', 
      label: 'الإعدادات', 
      icon: <Settings className="w-4 h-4" />,
      content: renderSettingsTab()
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">الإشعارات</h1>
              <p className="text-gray-600">تتبع جميع إشعاراتك ورسائلك المهمة</p>
            </div>
            {notifications?.data && (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-main">
                  {notifications.data.filter((n: Notification) => !n.read).length}
                </div>
                <div className="text-sm text-gray-500">غير مقروءة</div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs
          items={tabs}
          defaultActiveTab="notifications"
          variant="underline"
          fullWidth={false}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default NotificationsPage; 