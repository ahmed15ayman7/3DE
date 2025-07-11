"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { notificationApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Bell, Check, AlertTriangle, Trophy, Mail, Cog, ArrowRight, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Notification, NotificationSettings } from '@shared/prisma';
import { useUser } from '@/hooks/useUser';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div></div> });
const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div></div> });
const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div></div> });
const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div></div> });

const getNotificationsData = async (id: string) => {
    let { success, data } = await notificationApi.getAllByUserId(id);
    if (success) {
        return data;
    }
    return null;
};

const getNotificationsSettingsData = async (id: string) => {
    let { success, data } = await notificationApi.getSettingsByUserId(id);
    if (success) {
        return data;
    }
    return null;
};

const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'الواجب الأول',
        message: 'الواجب الأول هو الواجب الأول',
        userId: '1',
        type: 'ASSIGNMENT',
        isImportant: false,
        urgent: false,
        read: false,
        createdAt: new Date(),
        actionUrl: null,
        trainingScheduleId: null,
    },
    {
        id: '2',
        title: 'الواجب الثاني',
        message: 'الواجب الثاني هو الواجب الثاني',
        userId: '1',
        type: 'GRADE',
        isImportant: false,
        urgent: false,
        read: false,
        createdAt: new Date(),
        actionUrl: null,
        trainingScheduleId: null,
    }
];

export default function StudentNotifications() {
    const [activeTab, setActiveTab] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<NotificationSettings>({
        id: '',
        userId: '',
        createdAt: new Date(),
        assignments: true,
        grades: true,
        messages: true,
        achievements: true,
        urgent: true,
        email: false,
        push: true
    });
    let router = useRouter();
    let { user, status } = useUser();

    // استعلامات البيانات
    const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => getNotificationsData(user?.id || ''),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? initialNotifications,
    });

    let { data: notificationsSettings, isLoading: isLoadingNotificationsSettings } = useQuery({
        queryKey: ['notificationsSettings'],
        queryFn: () => getNotificationsSettingsData(user?.id || ''),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData ?? null,
    });

    // طلب تحديث حالة الإشعار
    const { mutate: markAsRead } = useMutation({
        mutationFn: (id: string) => notificationApi.markAsRead(id),
    });

    // طلب تحديث الإعدادات
    const { mutate: updateSettings } = useMutation({
        mutationFn: (data: NotificationSettings) => notificationsSettings ? notificationApi.updateSettings(data) : notificationApi.createSettings(data),
        onSuccess: () => setShowSettings(false)
    });

    useEffect(() => {
        if (notificationsSettings) {
            setSettings({
                id: notificationsSettings.id,
                userId: notificationsSettings.userId,
                createdAt: notificationsSettings.createdAt,
                assignments: notificationsSettings.assignments,
                grades: notificationsSettings.grades,
                messages: notificationsSettings.messages,
                achievements: notificationsSettings.achievements,
                urgent: notificationsSettings.urgent,
                email: notificationsSettings.email,
                push: notificationsSettings.push
            });
        } else {
            setSettings((prev) => ({
                ...prev,
                userId: user?.id || '',
            }));
        }
    }, [notificationsSettings, user?.id]);

    if (isLoadingNotifications || isLoadingNotificationsSettings || status === "loading") {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} height={100} />
                    ))}
                </div>
            </div>
        );
    }

    // تصفية الإشعارات حسب التبويب النشط
    const filteredNotifications = (notifications || initialNotifications)?.filter(notification => {
        switch (activeTab) {
            case 1:
                return !notification.read;
            case 2:
                return notification.read;
            case 3:
                return notification.isImportant;
            default:
                return true;
        }
    });

    // الحصول على الإشعار العاجل
    const urgentNotification = (notifications || initialNotifications)?.find(n => n.urgent && !n.read);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* العنوان */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">الإشعارات</h1>
                    <p className="text-gray-600">تابع آخر التحديثات والإشعارات المهمة</p>
                </div>
                <Button variant="outline" onClick={() => setShowSettings(true)}>
                    <Cog className="h-4 w-4 mr-2" />
                    الإعدادات
                </Button>
            </div>

            {/* الإشعار العاجل */}
            {urgentNotification && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800">{urgentNotification.title}</h3>
                            <p className="text-sm text-red-600 mt-1">{urgentNotification.message}</p>
                            <div className="flex items-center space-x-2 mt-2">
                                <Button variant="outline" size="sm" onClick={() => markAsRead(urgentNotification.id)}>
                                    <Check className="h-4 w-4 mr-1" />
                                    تم القراءة
                                </Button>
                                {urgentNotification.actionUrl && (
                                    <Button variant="default" size="sm" onClick={() => router.push(urgentNotification.actionUrl!)}>
                                        <ArrowRight className="h-4 w-4 mr-1" />
                                        عرض التفاصيل
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                tabs={[
                    {
                        value: 0,
                        label: 'الكل',
                        content: (
                            <div className="space-y-4">
                                {filteredNotifications?.length === 0 ? (
                                    <EmptyState
                                        icon={<Bell className="text-gray-400 text-4xl" />}
                                        title="لا توجد إشعارات"
                                        description="لا توجد إشعارات جديدة لعرضها"
                                    />
                                ) : (
                                    filteredNotifications?.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Card title={notification.title} className={`${!notification.read ? 'border-l-4 border-primary-500' : ''}`}>
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-3 rounded-full ${notification.type === 'ASSIGNMENT' ? 'bg-blue-100' :
                                                        notification.type === 'GRADE' ? 'bg-green-100' :
                                                            notification.type === 'MESSAGE' ? 'bg-purple-100' :
                                                                'bg-yellow-100'
                                                        }`}>
                                                        {notification.type === 'ASSIGNMENT' ? <AlertTriangle className="text-blue-500" /> :
                                                            notification.type === 'GRADE' ? <Trophy className="text-green-500" /> :
                                                                notification.type === 'MESSAGE' ? <Mail className="text-purple-500" /> :
                                                                    <Bell className="text-yellow-500" />
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-700">{notification.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-sm text-gray-500">
                                                                {format(new Date(notification.createdAt), 'd MMMM yyyy HH:mm', { locale: ar })}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                {!notification.read && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        <Check className="h-4 w-4 mr-1" />
                                                                        تم القراءة
                                                                    </Button>
                                                                )}
                                                                {notification.actionUrl && (
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => router.push(notification.actionUrl!)}
                                                                    >
                                                                        <ArrowRight className="h-4 w-4 mr-1" />
                                                                        عرض التفاصيل
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )
                    },
                    {
                        value: 1,
                        label: 'غير المقروءة',
                        content: (
                            <div className="space-y-4">
                                {filteredNotifications?.length === 0 ? (
                                    <EmptyState
                                        icon={<Bell className="text-gray-400 text-4xl" />}
                                        title="لا توجد إشعارات غير مقروءة"
                                        description="جميع الإشعارات تم قراءتها"
                                    />
                                ) : (
                                    filteredNotifications?.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Card title={notification.title} className="border-l-4 border-primary-500">
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-3 rounded-full ${notification.type === 'ASSIGNMENT' ? 'bg-blue-100' :
                                                        notification.type === 'GRADE' ? 'bg-green-100' :
                                                            notification.type === 'MESSAGE' ? 'bg-purple-100' :
                                                                'bg-yellow-100'
                                                        }`}>
                                                        {notification.type === 'ASSIGNMENT' ? <AlertTriangle className="text-blue-500" /> :
                                                            notification.type === 'GRADE' ? <Trophy className="text-green-500" /> :
                                                                notification.type === 'MESSAGE' ? <Mail className="text-purple-500" /> :
                                                                    <Bell className="text-yellow-500" />
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-700">{notification.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-sm text-gray-500">
                                                                {format(new Date(notification.createdAt), 'd MMMM yyyy HH:mm', { locale: ar })}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => markAsRead(notification.id)}
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" />
                                                                    تم القراءة
                                                                </Button>
                                                                {notification.actionUrl && (
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => router.push(notification.actionUrl!)}
                                                                    >
                                                                        <ArrowRight className="h-4 w-4 mr-1" />
                                                                        عرض التفاصيل
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )
                    },
                    {
                        value: 2,
                        label: 'المقروءة',
                        content: (
                            <div className="space-y-4">
                                {filteredNotifications?.length === 0 ? (
                                    <EmptyState
                                        icon={<Bell className="text-gray-400 text-4xl" />}
                                        title="لا توجد إشعارات مقروءة"
                                        description="جميع الإشعارات غير مقروءة"
                                    />
                                ) : (
                                    filteredNotifications?.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Card title={notification.title}>
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-3 rounded-full ${notification.type === 'ASSIGNMENT' ? 'bg-blue-100' :
                                                        notification.type === 'GRADE' ? 'bg-green-100' :
                                                            notification.type === 'MESSAGE' ? 'bg-purple-100' :
                                                                'bg-yellow-100'
                                                        }`}>
                                                        {notification.type === 'ASSIGNMENT' ? <AlertTriangle className="text-blue-500" /> :
                                                            notification.type === 'GRADE' ? <Trophy className="text-green-500" /> :
                                                                notification.type === 'MESSAGE' ? <Mail className="text-purple-500" /> :
                                                                    <Bell className="text-yellow-500" />
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-700">{notification.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-sm text-gray-500">
                                                                {format(new Date(notification.createdAt), 'd MMMM yyyy HH:mm', { locale: ar })}
                                                            </span>
                                                            {notification.actionUrl && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => router.push(notification.actionUrl!)}
                                                                >
                                                                    <ArrowRight className="h-4 w-4 mr-1" />
                                                                    عرض التفاصيل
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )
                    },
                    {
                        value: 3,
                        label: 'المهمة',
                        content: (
                            <div className="space-y-4">
                                {filteredNotifications?.length === 0 ? (
                                    <EmptyState
                                        icon={<Bell className="text-gray-400 text-4xl" />}
                                        title="لا توجد إشعارات مهمة"
                                        description="لا توجد إشعارات مصنفة كمهمة"
                                    />
                                ) : (
                                    filteredNotifications?.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Card title={notification.title} className="border-l-4 border-yellow-500">
                                                <div className="flex items-start space-x-4">
                                                    <div className={`p-3 rounded-full ${notification.type === 'ASSIGNMENT' ? 'bg-blue-100' :
                                                        notification.type === 'GRADE' ? 'bg-green-100' :
                                                            notification.type === 'MESSAGE' ? 'bg-purple-100' :
                                                                'bg-yellow-100'
                                                        }`}>
                                                        {notification.type === 'ASSIGNMENT' ? <AlertTriangle className="text-blue-500" /> :
                                                            notification.type === 'GRADE' ? <Trophy className="text-green-500" /> :
                                                                notification.type === 'MESSAGE' ? <Mail className="text-purple-500" /> :
                                                                    <Bell className="text-yellow-500" />
                                                        }
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-gray-700">{notification.message}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-sm text-gray-500">
                                                                {format(new Date(notification.createdAt), 'd MMMM yyyy HH:mm', { locale: ar })}
                                                            </span>
                                                            <div className="flex items-center space-x-2">
                                                                {!notification.read && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => markAsRead(notification.id)}
                                                                    >
                                                                        <Check className="h-4 w-4 mr-1" />
                                                                        تم القراءة
                                                                    </Button>
                                                                )}
                                                                {notification.actionUrl && (
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => router.push(notification.actionUrl!)}
                                                                    >
                                                                        <ArrowRight className="h-4 w-4 mr-1" />
                                                                        عرض التفاصيل
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )
                    },
                ]}
            />
        </motion.div>
    );
}
