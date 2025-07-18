'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { notificationApi } from '@3de/apis';
import Layout from '../../components/layout/Layout';
import { Button, Card, Badge, Skeleton } from '@3de/ui';
import { Bell, Check, Trash2, BookOpen, Users, Award } from 'lucide-react';
import { Notification } from '@3de/interfaces';
import { sanitizeApiResponse } from '../../lib/utils';
import Pagination from '../../components/common/Pagination';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('unread');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data: notificationsResponse, isLoading } = useQuery({
    queryKey: ['notifications', page, limit, search],
    queryFn: async () => {
      const response = await notificationApi.getAll(page, limit, search);
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data))
      };
    },
  });

  const notifications = (notificationsResponse as any)?.data || [];

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      // Refetch notifications
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-5 h-5" />;
      case 'social':
        return <Users className="w-5 h-5" />;
      case 'achievement':
        return <Award className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'course':
        return 'text-blue-600 bg-blue-100';
      case 'social':
        return 'text-green-600 bg-green-100';
      case 'achievement':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter((notification: Notification) => !notification.read).length || 0;

  const handlePrevious = () => {
    setPage(page - 1);
  };

  const handleNext = () => {
    setPage(page + 1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">التنبيهات</h1>
              <p className="text-gray-600">
                {unreadCount} تنبيه جديد
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                تحديد الكل كمقروء
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
                حذف الكل
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4"
        >
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            الكل ({notifications?.length || 0})
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            غير المقروءة ({unreadCount})
          </Button>
          <Button
            variant={filter === 'read' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            المقروءة ({(notifications?.length || 0) - unreadCount})
          </Button>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications?.map((notification: Notification, index: number) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-4 ${!notification.read ? 'border-primary-main bg-primary-main/5' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{new Date(notification.createdAt).toLocaleDateString('ar-EG')}</span>
                          <span>{new Date(notification.createdAt).toLocaleTimeString('ar-EG')}</span>
                          {notification.type && (
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsReadMutation.mutate(notification.id)}
                            disabled={markAsReadMutation.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Pagination */}
        {notifications && notifications.length && notifications.length > 0 && (
          <Pagination
            currentPage={page}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={page > 0}
            hasNext={notifications.length === limit}
          />
        )}
        
        {/* Empty State */}
        {!isLoading && (!filteredNotifications || filteredNotifications.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Bell className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد تنبيهات
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'ستظهر هنا جميع التنبيهات الجديدة'
                : filter === 'unread'
                ? 'لا توجد تنبيهات غير مقروءة'
                : 'لا توجد تنبيهات مقروءة'
              }
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
} 