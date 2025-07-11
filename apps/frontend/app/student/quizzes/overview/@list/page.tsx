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
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div className=""></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div className="h-[50vh] w-full bg-gray-200 rounded animate-pulse"></div> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse"></div>});

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

export default function ListPage() {
    const { user, status } = useUser();

    // استعلامات البيانات مع React Query
    const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
        queryKey: ['quizzes-list'],
        queryFn: () => getQuizzesData(user),
        enabled: status === 'authenticated',
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignments-list'],
        queryFn: () => getAssignmentsData(user),
        enabled: status === 'authenticated',
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // دمج الكويزات والواجبات
    const allTasks = [
        ...(quizzes?.map((q: any) => ({ ...q, type: 'quiz' })) || []),
        ...(assignments?.map((a: any) => ({ ...a, type: 'assignment' })) || [])
    ].sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

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
            <Card title="قائمة المهام">
                <DataGrid
                    rows={allTasks}
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
                            field: 'dueDate',
                            headerName: 'موعد التسليم',
                            renderCell: (row: any) => (
                                <span>
                                    {format(new Date(row.dueDate), 'd MMMM yyyy', { locale: ar })}
                                </span>
                            )
                        },
                        {
                            field: 'status',
                            headerName: 'الحالة',
                            renderCell: (row: any) => (
                                <Badge
                                    variant="dot"
                                    color={
                                        row.status === 'pending' ? 'warning' :
                                        row.status === 'completed' ? 'success' :
                                        row.status === 'late' ? 'error' : 'info'
                                    }
                                >
                                    <span>
                                        {row.status === 'pending' ? 'قيد الانتظار' :
                                         row.status === 'completed' ? 'مكتمل' :
                                         row.status === 'late' ? 'متأخر' : 'قيد التصحيح'}
                                    </span>
                                </Badge>
                            )
                        },
                        {
                            field: 'score',
                            headerName: 'الدرجة',
                            renderCell: (row: any) => (
                                row.score ? (
                                    <span className="font-bold">{row.score}%</span>
                                ) : (
                                    <span className="text-gray-500">-</span>
                                )
                            )
                        },
                        {
                            field: 'actions',
                            headerName: 'الإجراءات',
                            renderCell: (row: any) => (
                                <div className="flex space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                    >
                                        {row.status === 'pending' ? 'حل' : 'مراجعة'}
                                    </Button>
                                    {row.status === 'completed' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                        >
                                            إعادة تصحيح
                                        </Button>
                                    )}
                                </div>
                            ),
                        },
                    ]}
                />
            </Card>
        </motion.div>
    );
} 