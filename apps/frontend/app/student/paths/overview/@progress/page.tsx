'use client';

import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { pathApi } from '@/lib/api';
import { Path, Course, Milestone, User, CourseStatus } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Progress = dynamic(() => import('@/components/common/Progress'), { loading: () => <div className='h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse'></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div className='h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse'></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div className='h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse'></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Stepper = dynamic(() => import('@/components/common/Stepper'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

let getPathsData = async () => {
    let { success, data } = await pathApi.getAll();
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
        progress: 75,
        completedTasks: 15,
        remainingTime: 8,
        studyTime: 25,
        totalTasks: 20,
        engagement: 85,
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
                status: CourseStatus.ACTIVE,
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
                status: CourseStatus.PENDING,
            },
        ],
        milestones: [
            {
                id: '1',
                title: 'إكمال كورس Python',
                description: 'تم إكمال كورس Python بنجاح',
                status: 'COMPLETED',
                createdAt: new Date(),
                pathId: '1',
            },
            {
                id: '2',
                title: 'بدء كورس Machine Learning',
                description: 'تم بدء كورس Machine Learning',
                status: 'IN_PROGRESS',
                createdAt: new Date(),
                pathId: '1',
            },
            {
                id: '3',
                title: 'إكمال كورس Data Science',
                description: 'إكمال كورس Data Science',
                status: 'NOT_STARTED',
                createdAt: new Date(),
                pathId: '1',
            },
        ],
        peers: [],
    },
    {
        id: '2',
        title: 'مسار تعلم frontend',
        description: 'مسار تعلم frontend',
        level: '2',
        progress: 45,
        completedTasks: 8,
        remainingTime: 15,
        studyTime: 18,
        totalTasks: 18,
        engagement: 70,
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
                status: CourseStatus.ACTIVE,
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
                status: CourseStatus.PENDING,
            },
        ],
        milestones: [
            {
                id: '4',
                title: 'إكمال كورس HTML',
                description: 'تم إكمال كورس HTML بنجاح',
                status: 'COMPLETED',
                createdAt: new Date(),
                pathId: '2',
            },
            {
                id: '5',
                title: 'بدء كورس CSS',
                description: 'تم بدء كورس CSS',
                status: 'IN_PROGRESS',
                createdAt: new Date(),
                pathId: '2',
            },
            {
                id: '6',
                title: 'إكمال كورس JavaScript',
                description: 'إكمال كورس JavaScript',
                status: 'NOT_STARTED',
                createdAt: new Date(),
                pathId: '2',
            },
        ],
        peers: [],
    },
];

export default function PathsProgressPage() {
    // استعلامات البيانات مع خيارات التخزين المؤقت
    const { data: paths, isLoading: isLoadingPaths } = useQuery({
        queryKey: ['paths'],
        queryFn: () => getPathsData(),
        staleTime: 5 * 60 * 1000, // 5 دقائق
        gcTime: 10 * 60 * 1000, // 10 دقائق
        // placeholderData: keepPreviousData,
    });

    const pathsData = paths || initialPaths;

    // حساب الإحصائيات الإجمالية
    const totalProgress = pathsData.reduce((acc, path) => acc + path.progress, 0) / pathsData.length;
    const totalCompletedTasks = pathsData.reduce((acc, path) => acc + path.completedTasks, 0);
    const totalTasks = pathsData.reduce((acc, path) => acc + path.totalTasks, 0);
    const totalStudyTime = pathsData.reduce((acc, path) => acc + path.studyTime, 0);
    const totalRemainingTime = pathsData.reduce((acc, path) => acc + path.remainingTime, 0);

    if (isLoadingPaths) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} height={120} />
                    ))}
                </div>
            </div>
        );
    }

    if (!pathsData.length) {
        return (
            <EmptyState
                title="لا توجد مسارات حالية"
                description="لم يتم العثور على أي مسارات لتتبع التقدم"
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
                <h2 className="text-xl font-bold mb-2">التقدم والإنجازات</h2>
                <p className="text-gray-600">
                    تتبع تقدمك في جميع المسارات والإنجازات المحققة
                </p>
            </div>

            {/* الإحصائيات الإجمالية */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card title="التقدم الإجمالي" className="bg-primary-50">
                    <div className="space-y-2">
                        <p className="text-2xl font-bold">{Math.round(totalProgress)}%</p>
                        <Progress value={totalProgress} max={100} size="small" />
                    </div>
                </Card>
                <Card title="المهام المكتملة" className="bg-success-50">
                    <p className="text-2xl font-bold">{totalCompletedTasks}</p>
                    <p className="text-sm text-gray-600">من أصل {totalTasks} مهمة</p>
                </Card>
                <Card title="وقت الدراسة" className="bg-info-50">
                    <p className="text-2xl font-bold">{totalStudyTime} ساعة</p>
                    <p className="text-sm text-gray-600">متبقي {totalRemainingTime} ساعة</p>
                </Card>
                <Card title="المسارات النشطة" className="bg-warning-50">
                    <p className="text-2xl font-bold">{pathsData.length}</p>
                    <p className="text-sm text-gray-600">مسار نشط</p>
                </Card>
            </div>

            {/* تفاصيل التقدم لكل مسار */}
            <div className="space-y-6">
                {pathsData.map((path, index) => (
                    <motion.div
                        key={path.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card title={path.title}>
                            <div className="space-y-6">
                                {/* شريط التقدم الرئيسي */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">التقدم العام</span>
                                        <span className="text-sm text-gray-600">{path.progress}%</span>
                                    </div>
                                    <Progress value={path.progress} max={100} showLabel />
                                </div>

                                {/* إحصائيات المسار */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold">{path.completedTasks}</p>
                                        <p className="text-sm text-gray-600">مهام مكتملة</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold">{path.studyTime}</p>
                                        <p className="text-sm text-gray-600">ساعات دراسة</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold">{path.remainingTime}</p>
                                        <p className="text-sm text-gray-600">ساعات متبقية</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold">{path.engagement}%</p>
                                        <p className="text-sm text-gray-600">نسبة التفاعل</p>
                                    </div>
                                </div>

                                {/* مراحل المسار */}
                                <div>
                                    <h4 className="font-medium mb-3">مراحل المسار</h4>
                                    <Stepper
                                        steps={path.milestones.map((milestone) => ({
                                            label: milestone.title || '',
                                            description: milestone.description || '',
                                            completed: milestone.status === 'COMPLETED',
                                        }))}
                                    />
                                </div>

                                {/* تقدم المواد */}
                                <div>
                                    <h4 className="font-medium mb-3">تقدم المواد</h4>
                                    <div className="space-y-3">
                                        {path.courses.map((course) => (
                                            <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3 space-x-reverse">
                                                    <Badge 
                                                        variant="standard" 
                                                        color={
                                                            course.status === CourseStatus.COMPLETED ? 'success' : 
                                                            course.status === CourseStatus.ACTIVE ? 'warning' : 'info'
                                                        }
                                                    >
                                                        <span className="text-xs">
                                                            {course.status === CourseStatus.COMPLETED ? 'مكتمل' : 
                                                            course.status === CourseStatus.ACTIVE ? 'قيد التقدم' : 'لم يبدأ'}
                                                        </span>
                                                    </Badge>
                                                    <span className="font-medium">{course.title}</span>
                                                </div>
                                                <Button variant="text" size="small">
                                                    عرض التفاصيل
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
} 