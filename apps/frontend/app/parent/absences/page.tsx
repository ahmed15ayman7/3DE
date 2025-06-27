"use client"
import React, { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { notificationApi, attendanceApi } from '@/lib/api';
import { Notification, NotificationType, User } from '@shared/prisma';
import { useUser } from '@/hooks/useUser';

const Card = dynamic(() => import('@/components/common/Card'), { 
    loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> 
});
const Badge = dynamic(() => import('@/components/common/Badge'), { 
    loading: () => <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div> 
});
const Button = dynamic(() => import('@/components/common/Button'), { 
    loading: () => <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div> 
});
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { 
    loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> 
});
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { 
    loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> 
});
const Avatar = dynamic(() => import('@/components/common/Avatar'), { 
    loading: () => <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div> 
});
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { 
    loading: () => <div className="h-[400px] w-full bg-gray-200 rounded animate-pulse"></div> 
});

// بيانات وهمية للإشعارات
const mockNotifications: Partial<Notification>[] = [
    {
        id: '1',
        userId: '1',
        type: 'ABSENCE' as NotificationType,
        title: 'إشعار غياب',
        message: 'الطالب أحمد محمد غاب عن الحصة الأولى اليوم',
        actionUrl: '/parent/absences',
        urgent: true,
        isImportant: true,
        read: false,
        createdAt: new Date('2024-01-15T08:00:00Z'),
    },
    {
        id: '2',
        userId: '1',
        type: 'ABSENCE' as NotificationType,
        title: 'إشعار غياب متكرر',
        message: 'الطالب أحمد محمد غاب عن 3 حصص هذا الأسبوع',
        actionUrl: '/parent/absences',
        urgent: true,
        isImportant: true,
        read: false,
        createdAt: new Date('2024-01-14T08:00:00Z'),
    },
    {
        id: '3',
        userId: '1',
        type: 'ABSENCE' as NotificationType,
        title: 'إشعار غياب',
        message: 'الطالب فاطمة أحمد غابت عن الحصة الثانية أمس',
        actionUrl: '/parent/absences',
        urgent: false,
        isImportant: false,
        read: true,
        createdAt: new Date('2024-01-13T08:00:00Z'),
    },
];

// بيانات وهمية للإحصائيات
const mockStats = {
    totalAbsences: 15,
    thisWeek: 3,
    thisMonth: 8,
    unreadNotifications: 2,
};

// بيانات وهمية للطلاب
const mockStudents = [
    {
        id: '1',
        name: 'أحمد محمد',
        avatar: '/assets/images/avatar1.jpg',
        absences: 8,
        lastAbsence: '2024-01-15',
        grade: 'الصف الثالث',
        attendanceRate: 85,
    },
    {
        id: '2',
        name: 'فاطمة أحمد',
        avatar: '/assets/images/avatar2.jpg',
        absences: 7,
        lastAbsence: '2024-01-13',
        grade: 'الصف الثاني',
        attendanceRate: 90,
    },
];

export default function AbsencesPage() {
    const { user } = useUser();
    const router = useRouter();
    const [selectedStudent, setSelectedStudent] = useState<string>('all');
    const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent'>('all');

    // استعلام الإشعارات
    const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
        queryKey: ['parent-notifications', user?.id],
        queryFn: () => notificationApi.getAllByUserId(user?.id || ''),
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000, // 5 دقائق
        gcTime: 10 * 60 * 1000, // 10 دقائق
    });

    // استعلام إحصائيات الغياب
    const { data: attendanceStats, isLoading: statsLoading } = useQuery({
        queryKey: ['parent-attendance-stats', user?.id],
        queryFn: async () => {
            // في الواقع، ستحتاج إلى API خاص بالآباء للحصول على إحصائيات أطفالهم
            return mockStats;
        },
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const notifications = notificationsData?.data || mockNotifications;
    const stats = attendanceStats || mockStats;

    // تصفية الإشعارات
    const filteredNotifications = notifications.filter(notification => {
        if (filterType === 'unread') return !notification.read;
        if (filterType === 'urgent') return notification.urgent;
        return true;
    });

    // تحويل الإشعارات إلى صيغة الجدول
    const tableData = filteredNotifications.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        date: new Date(notification.createdAt || new Date()).toLocaleDateString('ar-SA'),
        status: notification.read ? 'مقروء' : 'غير مقروء',
        urgent: notification.urgent,
        important: notification.isImportant,
    }));

    const columns = [
        { field: 'title', headerName: 'العنوان', width: 200 },
        { field: 'message', headerName: 'الرسالة', width: 300 },
        { field: 'date', headerName: 'التاريخ', width: 120 },
        { field: 'status', headerName: 'الحالة', width: 100 },
        { field: 'urgent', headerName: 'عاجل', width: 80 },
        { field: 'important', headerName: 'مهم', width: 80 },
    ];

    const handleStudentClick = (studentId: string) => {
        router.push(`/parent/absences/${studentId}`);
    };

    if (notificationsLoading || statsLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* العنوان */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">مراقبة الغياب</h1>
                <p className="text-gray-600">تابع إشعارات الغياب لأطفالك</p>
            </motion.div>

            {/* إحصائيات سريعة */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <Card title="" className="bg-red-50 border-red-200">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.totalAbsences}</div>
                        <div className="text-sm text-red-600">إجمالي الغياب</div>
                    </div>
                </Card>
                <Card title="" className="bg-orange-50 border-orange-200">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{stats.thisWeek}</div>
                        <div className="text-sm text-orange-600">هذا الأسبوع</div>
                    </div>
                </Card>
                <Card title="" className="bg-blue-50 border-blue-200">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.thisMonth}</div>
                        <div className="text-sm text-blue-600">هذا الشهر</div>
                    </div>
                </Card>
                <Card title="" className="bg-green-50 border-green-200">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.unreadNotifications}</div>
                        <div className="text-sm text-green-600">إشعارات جديدة</div>
                    </div>
                </Card>
            </motion.div>

            {/* الطلاب */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
            >
                <Card title="أطفالك" className="bg-primary-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockStudents.map((student) => (
                            <div
                                key={student.id}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                                    selectedStudent === student.id
                                        ? 'border-primary-500 bg-primary-100'
                                        : 'border-gray-200 hover:border-primary-300'
                                }`}
                                onClick={() => setSelectedStudent(student.id)}
                            >
                                <div className="flex items-center space-x-4 space-x-reverse">
                                    <Avatar
                                        src={student.avatar}
                                        alt={student.name}
                                        size="lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                        <p className="text-sm text-gray-600 mb-1">{student.grade}</p>
                                        <p className="text-sm text-gray-600">
                                            عدد مرات الغياب: {student.absences}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            آخر غياب: {student.lastAbsence}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            معدل الحضور: {student.attendanceRate}%
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <Badge
                                            variant="standard"
                                            color={student.absences > 5 ? 'error' : 'warning'}
                                        >
                                            <span className="text-xs">
                                                {student.absences > 5 ? 'كثير الغياب' : 'غياب عادي'}
                                            </span>
                                        </Badge>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleStudentClick(student.id)}
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* فلاتر */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6"
            >
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant={filterType === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setFilterType('all')}
                        size="small"
                    >
                        جميع الإشعارات
                    </Button>
                    <Button
                        variant={filterType === 'unread' ? 'contained' : 'outlined'}
                        onClick={() => setFilterType('unread')}
                        size="small"
                    >
                        غير المقروءة
                    </Button>
                    <Button
                        variant={filterType === 'urgent' ? 'contained' : 'outlined'}
                        onClick={() => setFilterType('urgent')}
                        size="small"
                    >
                        عاجلة
                    </Button>
                </div>
            </motion.div>

            {/* جدول الإشعارات */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card title="إشعارات الغياب" className="bg-white">
                    {filteredNotifications.length === 0 ? (
                        <EmptyState
                            title="لا توجد إشعارات"
                            description="لا توجد إشعارات غياب حالياً"
                            icon="📋"
                        />
                    ) : (
                        <DataGrid
                            rows={tableData}
                            columns={columns}
                            pageSize={10}
                            checkboxSelection={false}
                        />
                    )}
                </Card>
            </motion.div>
        </div>
    );
} 