"use client"
import React, { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { notificationApi, attendanceApi } from '@/lib/api';
import { Notification, User } from '@shared/prisma';
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
const Progress = dynamic(() => import('@/components/common/Progress'), { 
    loading: () => <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div> 
});

// بيانات وهمية للطالب
const mockStudent = {
    id: '1',
    name: 'أحمد محمد',
    avatar: '/assets/images/avatar1.jpg',
    grade: 'الصف الثالث',
    totalAbsences: 8,
    thisWeek: 2,
    thisMonth: 5,
    attendanceRate: 85,
    lastAbsence: '2024-01-15',
    subjects: ['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية'],
};

// بيانات وهمية لتفاصيل الغياب
const mockAbsenceDetails = [
    {
        id: '1',
        date: '2024-01-15',
        subject: 'الرياضيات',
        lesson: 'الحصة الأولى',
        reason: 'غياب بدون عذر',
        teacher: 'أ. محمد أحمد',
        status: 'غير مبرر',
    },
    {
        id: '2',
        date: '2024-01-14',
        subject: 'العلوم',
        lesson: 'الحصة الثالثة',
        reason: 'مرض',
        teacher: 'أ. فاطمة علي',
        status: 'مبرر',
    },
    {
        id: '3',
        date: '2024-01-12',
        subject: 'اللغة العربية',
        lesson: 'الحصة الثانية',
        reason: 'غياب بدون عذر',
        teacher: 'أ. أحمد محمد',
        status: 'غير مبرر',
    },
    {
        id: '4',
        date: '2024-01-10',
        subject: 'اللغة الإنجليزية',
        lesson: 'الحصة الرابعة',
        reason: 'موعد طبي',
        teacher: 'أ. سارة أحمد',
        status: 'مبرر',
    },
];

// بيانات وهمية للإحصائيات الشهرية
const mockMonthlyStats = [
    { month: 'يناير', absences: 8, attendance: 85 },
    { month: 'ديسمبر', absences: 5, attendance: 90 },
    { month: 'نوفمبر', absences: 3, attendance: 95 },
    { month: 'أكتوبر', absences: 7, attendance: 88 },
];

export default function StudentAbsenceDetails() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const studentId = params.studentId as string;
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    // استعلام تفاصيل الغياب للطالب
    const { data: absenceDetails, isLoading: detailsLoading } = useQuery({
        queryKey: ['student-absence-details', studentId],
        queryFn: async () => {
            // في الواقع، ستحتاج إلى API خاص بالآباء للحصول على تفاصيل غياب أطفالهم
            return mockAbsenceDetails;
        },
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // استعلام إحصائيات الحضور للطالب
    const { data: attendanceStats, isLoading: statsLoading } = useQuery({
        queryKey: ['student-attendance-stats', studentId],
        queryFn: async () => {
            // في الواقع، ستحتاج إلى API خاص بالآباء
            return mockStudent;
        },
        enabled: !!studentId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const details = absenceDetails || mockAbsenceDetails;
    const student = attendanceStats || mockStudent;

    // تحويل البيانات إلى صيغة الجدول
    const tableData = details.map(detail => ({
        id: detail.id,
        date: detail.date,
        subject: detail.subject,
        lesson: detail.lesson,
        reason: detail.reason,
        teacher: detail.teacher,
        status: detail.status,
    }));

    const columns = [
        { field: 'date', headerName: 'التاريخ', width: 120 },
        { field: 'subject', headerName: 'المادة', width: 150 },
        { field: 'lesson', headerName: 'الحصة', width: 120 },
        { field: 'reason', headerName: 'السبب', width: 200 },
        { field: 'teacher', headerName: 'المعلم', width: 150 },
        { field: 'status', headerName: 'الحالة', width: 100 },
    ];

    if (detailsLoading || statsLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                    <Skeleton className="h-48" />
                </div>
                <Skeleton className="h-96" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* شريط التنقل */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    ← العودة
                </Button>
            </motion.div>

            {/* معلومات الطالب */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
            >
                <Card title={student.name} className="bg-gradient-to-r from-primary-50 to-primary-100">
                    <div className="flex items-center space-x-6 space-x-reverse">
                        <Avatar
                            src={student.avatar}
                            alt={student.name}
                            size="xl"
                        />
                        <div className="flex-1">
                            <p className="text-gray-600 mb-2">{student.grade}</p>
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <Badge variant="standard" color="primary">
                                    <span className="text-xs">معدل الحضور: {student.attendanceRate}%</span>
                                </Badge>
                                <Badge variant="standard" color={student.totalAbsences > 5 ? 'error' : 'warning'}>
                                    <span className="text-xs">
                                        إجمالي الغياب: {student.totalAbsences}
                                    </span>
                                </Badge>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* إحصائيات سريعة */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <Card title="هذا الأسبوع" className="bg-red-50 border-red-200 text-red-600">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{student.thisWeek}</div>
                        </div>
                </Card>
                <Card title="هذا الشهر" className="bg-orange-50 border-orange-200 text-orange-600">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{student.thisMonth}</div>
                    </div>
                </Card>
                <Card title="معدل الحضور" className="bg-blue-50 border-blue-200" >
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{student.attendanceRate}%</div>
                    </div>
                </Card>
            </motion.div>

            {/* معدل الحضور */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-8"
            >
                <Card title="معدل الحضور" className="bg-white">
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">معدل الحضور العام</span>
                                <span className="text-sm font-bold text-gray-900">{student.attendanceRate}%</span>
                            </div>
                            <Progress
                                value={student.attendanceRate}
                                color={student.attendanceRate >= 90 ? 'success' : student.attendanceRate >= 80 ? 'warning' : 'error'}
                            />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {student.subjects.map((subject, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-sm font-medium text-gray-700 mb-1">{subject}</div>
                                    <Progress
                                        value={85 + Math.random() * 15}
                                        color="primary"
                                        size="small"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* جدول تفاصيل الغياب */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card title="تفاصيل الغياب" className="bg-white">
                    {details.length === 0 ? (
                        <EmptyState
                            title="لا توجد سجلات غياب"
                            description="لا توجد سجلات غياب لهذا الطالب"
                            icon="📋"
                        />
                    ) : (
                        <DataGrid
                            rows={tableData}
                            columns={columns}
                            pageSize={10}

                        />
                    )}
                </Card>
            </motion.div>

            {/* الإحصائيات الشهرية */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8"
            >
                <Card title="الإحصائيات الشهرية" className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mockMonthlyStats.map((stat, index) => (
                            <div key={index} className="text-center p-4 border rounded-lg">
                                <div className="text-lg font-bold text-gray-900 mb-1">{stat.month}</div>
                                <div className="text-sm text-gray-600 mb-2">
                                    الغياب: {stat.absences}
                                </div>
                                <Progress
                                    value={stat.attendance}
                                    color={stat.attendance >= 90 ? 'success' : stat.attendance >= 80 ? 'warning' : 'error'}
                                    size="small"
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {stat.attendance}% حضور
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
} 