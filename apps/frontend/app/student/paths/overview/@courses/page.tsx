'use client';

import React, { Suspense } from 'react';
import {  useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { pathApi, courseApi } from '@/lib/api';
import { Path, Course, Milestone, User } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });
const Progress = dynamic(() => import('@/components/common/Progress'), { loading: () => <div></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div></div> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div></div> });

let getPathsData = async () => {
    let { success, data } = await pathApi.getAll();
    if (success) {
        return data;
    }
    return null;
}

let getCoursesData = async () => {
    let { success, data } = await courseApi.getAll();
    if (success) {
        return data;
    }
    return null;
}

let initialPaths: (Path & { courses: Course[], milestones: Milestone[], peers: User[] })[] = [
    {
        id: '1',
        title: 'مسار تعلم deep Learning ',
        description: 'مسار التعلم',
        level: '1',
        progress: 50,
        completedTasks: 10,
        remainingTime: 10,
        studyTime: 10,
        totalTasks: 10,
        engagement: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        courses: [
            {
                id: '1',
                title: 'كورس python',
                description: ' كورس python هو كورس يعلمك كيفية البرمجة بلغة البايثون',
                image: 'https://via.placeholder.com/150',
                createdAt: new Date(),
                updatedAt: new Date(),
                academyId: '1',
                level: '1',
                status: 'COMPLETED',
            },
            {
                id: '2',
                title: 'كورس Machine Learning',
                description: ' كورس Machine Learning هو كورس يعلمك كيفية التعلم الآلي',
                image: 'https://via.placeholder.com/150',
                createdAt: new Date(),
                updatedAt: new Date(),
                academyId: '1',
                level: '1',
                status: 'COMPLETED',
            },
            {
                id: '3',
                title: 'كورس Data Science',
                description: ' كورس Data Science هو كورس يعلمك كيفية التعلم الآلي',
                image: 'https://via.placeholder.com/150',
                createdAt: new Date(),
                updatedAt: new Date(),
                academyId: '1',
                level: '1',
                status: 'COMPLETED',
            },
        ],
        milestones: [],
        peers: [],
    },
    {
        id: '2',
        title: 'مسار تعلم frontend',
        description: 'مسار تعلم frontend',
        level: '2',
        progress: 50,
        completedTasks: 10,
        remainingTime: 10,
        studyTime: 10,
        totalTasks: 10,
        engagement: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
        courses: [
            {
                id: '4',
                title: ' كورس html',
                description: ' كورس html هو كورس يعلمك كيفية البرمجة بلغة البايثون',
                image: 'https://via.placeholder.com/150',
                academyId: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
                level: '1',
                status: 'COMPLETED',
            },
            {
                id: '5',
                title: ' كورس css',
                description: ' كورس css هو كورس يعلمك كيفية البرمجة بلغة البايثون',
                image: 'https://via.placeholder.com/150',
                academyId: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
                level: '1',
                status: 'COMPLETED',
            },
            {
                id: '6',
                title: ' كورس js',
                description: ' كورس js هو كورس يعلمك كيفية البرمجة بلغة البايثون',
                image: 'https://via.placeholder.com/150',
                academyId: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
                level: '1',
                status: 'COMPLETED',
            },
        ],
        milestones: [],
        peers: [],
    },
];

export default function PathsCoursesPage() {
    // استعلامات البيانات مع خيارات التخزين المؤقت
    const { data: paths, isLoading: isLoadingPaths } = useQuery({
        queryKey: ['paths'],
        queryFn: () => getPathsData(),
        staleTime: 5 * 60 * 1000, // 5 دقائق
        gcTime: 10 * 60 * 1000, // 10 دقائق
        // placeholderData: keepPreviousData,
    });

    const { data: courses, isLoading: isLoadingCourses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getCoursesData(),
        staleTime: 5 * 60 * 1000, // 5 دقائق
        gcTime: 10 * 60 * 1000, // 10 دقائق
        // placeholderData: keepPreviousData,
    });

    // تجميع جميع المواد من المسارات
    const allCourses = (paths || initialPaths)?.flatMap(path => 
        path.courses.map(course => ({
            ...course,
            pathTitle: path.title,
            pathLevel: path.level,
        }))
    ) || [];

    if (isLoadingPaths || isLoadingCourses) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height={80} />
                    ))}
                </div>
            </div>
        );
    }

    if (!allCourses.length) {
        return (
            <EmptyState
                title="لا توجد دورات حالية"
                description="لم يتم العثور على أي دورات في المسارات"
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* العنوان */}
            <div>
                <h2 className="text-xl font-bold mb-2">المواد في المسارات</h2>
                <p className="text-gray-600">
                    جميع المواد المتاحة في مساراتك الحالية
                </p>
            </div>

            {/* جدول المواد */}
            <Card title="المواد" className="bg-primary-50">
                <DataGrid
                    rows={allCourses}
                    columns={[
                        {
                            field: 'title',
                            headerName: 'اسم الدورة',
                            renderCell: (row: any) => (
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Avatar src={row.image || ''} size="sm" />
                                    <div>
                                        <div className="font-medium">{row.title}</div>
                                        <div className="text-sm text-gray-500">{row.description}</div>
                                    </div>
                                </div>
                            )
                        },
                        {
                            field: 'pathTitle',
                            headerName: 'المسار',
                            renderCell: (row: any) => (
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <Badge variant="standard" color="primary">
                                        {row.pathTitle}
                                    </Badge>
                                    <span className="text-sm text-gray-500">مستوى {row.pathLevel}</span>
                                </div>
                            )
                        },
                        {
                            field: 'status',
                            headerName: 'الحالة',
                            renderCell: (row: any) => (
                                <Badge 
                                    variant="standard" 
                                    color={row.status === 'COMPLETED' ? 'success' : 'warning'}
                                >
                                    <span className="text-xs">
                                        {row.status === 'COMPLETED' ? 'مكتمل' : 'قيد التقدم'}
                                    </span>
                                </Badge>
                            )
                        },
                        {
                            field: 'progress',
                            headerName: 'نسبة الإنجاز',
                            renderCell: (row: any) => (
                                <Progress
                                    value={row.progress || 0}
                                    max={100}
                                    size="small"
                                    showLabel
                                />
                            )
                        },
                        {
                            field: 'actions',
                            headerName: 'الإجراءات',
                            renderCell: (row: any) => (
                                <div className="flex space-x-2 space-x-reverse">
                                    <Button variant="text" size="small">
                                        عرض
                                    </Button>
                                    <Button variant="contained" size="small">
                                        ابدأ الآن
                                    </Button>
                                </div>
                            ),
                        },
                    ]}
                />
            </Card>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="إجمالي المواد" className="bg-primary-50">
                    <p className="text-2xl font-bold">{allCourses.length}</p>
                </Card>
                <Card title="المواد المكتملة" className="bg-success-50">
                    <p className="text-2xl font-bold">
                        {allCourses.filter(course => course.status === 'COMPLETED').length}
                    </p>
                </Card>
                <Card title="المسارات النشطة" className="bg-info-50">
                    <p className="text-2xl font-bold">
                        {(paths || initialPaths)?.length || 0}
                    </p>
                </Card>
            </div>
        </motion.div>
    );
} 