'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { quizApi, assignmentApi } from '@/lib/api';

// Dynamic imports للتحسين
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div ></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div className="h-[50vh] w-full bg-gray-200 rounded animate-pulse"></div> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div> });
const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

// API functions
const getQuizzesData = async (user: any) => {
    let { status, data } = await quizApi.getByStudent(user.id);
    if (status >= 200 && status < 300) {
        return data;
    }
    return [];
};

const getAssignmentsData = async (user: any) => {
    let { status, data } = await assignmentApi.getByStudent(user.id);
    if (status >= 200 && status < 300) {
        return data;
    }
    return [];
};

export default function HistoryPage() {
    const { user, status } = useUser();

    // استعلامات البيانات مع React Query
    const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
        queryKey: ['quizzes-history'],
        queryFn: () => getQuizzesData(user),
        enabled: status === 'authenticated',
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignments-history'],
        queryFn: () => getAssignmentsData(user),
        enabled: status === 'authenticated',
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // دمج الكويزات والواجبات المكتملة فقط
    const completedTasks = [
        ...(quizzes?.filter((q: any) => q.status === 'completed').map((q: any) => ({ ...q, type: 'quiz' })) || []),
        ...(assignments?.filter((a: any) => a.status === 'completed').map((a: any) => ({ ...a, type: 'assignment' })) || [])
    ].sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    if (isLoadingQuizzes || isLoadingAssignments) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <Skeleton height={400} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card title="سجل النتائج">
                <DataGrid
                    rows={completedTasks}
                    columns={[
                        {
                            field: 'title',
                            headerName: 'اسم المهمة',
                            renderCell: (row: any) => (
                                <div className="flex items-center space-x-2">
                                    <Avatar src={row.courseImage} size="sm" />
                                    <span>{row.title}</span>
                                </div>
                            )
                        },
                        {
                            field: 'type',
                            headerName: 'النوع',
                            renderCell: (row: any) => (
                                <Badge 
                                    variant={row.type === 'quiz' ? 'standard' : 'dot'} 
                                    color={row.type === 'quiz' ? 'primary' : 'info'}
                                >
                                    <span>{row.type === 'quiz' ? 'كويز' : 'واجب'}</span>
                                </Badge>
                            )
                        },
                        {
                            field: 'completedAt',
                            headerName: 'تاريخ الإنجاز',
                            renderCell: (row: any) => (
                                <span>
                                    {format(new Date(row.completedAt), 'd MMMM yyyy', { locale: ar })}
                                </span>
                            )
                        },
                        {
                            field: 'score',
                            headerName: 'الدرجة',
                            renderCell: (row: any) => (
                                <span className="font-bold">{row.score}%</span>
                            )
                        },
                        {
                            field: 'timeSpent',
                            headerName: 'الوقت المستغرق',
                            renderCell: (row: any) => (
                                <span>{row.timeSpent} دقيقة</span>
                            )
                        },
                        {
                            field: 'feedback',
                            headerName: 'ملاحظات',
                            renderCell: (row: any) => (
                                row.feedback ? (
                                    <Tooltip title={row.feedback}>
                                        <span className="text-gray-600 cursor-pointer">عرض الملاحظات</span>
                                    </Tooltip>
                                ) : (
                                    <span className="text-gray-400">لا توجد ملاحظات</span>
                                )
                            )
                        },
                        {
                            field: 'actions',
                            headerName: 'الإجراءات',
                            renderCell: (row: any) => (
                                <Button
                                    variant="outline"
                                    size="sm"
                                >
                                    استعراض الحل
                                </Button>
                            ),
                        },
                    ]}
                />
            </Card>
        </motion.div>
    );
} 