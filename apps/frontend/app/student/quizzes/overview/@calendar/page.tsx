"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { quizApi, assignmentApi } from '@/lib/api';

// Dynamic imports للتحسين
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

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

export default function CalendarPage() {
    const { user, status } = useUser();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // استعلامات البيانات مع React Query
    const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
        queryKey: ['quizzes-calendar'],
        queryFn: () => getQuizzesData(user),
        enabled: status === 'authenticated',
        staleTime: 5 * 60 * 1000, // 5 دقائق
        gcTime: 10 * 60 * 1000, // 10 دقائق
    });

    const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignments-calendar'],
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

    // تصفية المهام حسب التاريخ المحدد
    const tasksForSelectedDate = allTasks.filter(task =>
        format(new Date(task.dueDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    if (isLoadingQuizzes || isLoadingAssignments) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton height={400} />
                <Skeleton height={400} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* التقويم */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card title="تقويم المهام">
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 30 }, (_, i) => {
                            const date = new Date();
                            date.setDate(date.getDate() + i);
                            const tasks = allTasks.filter(task =>
                                format(new Date(task.dueDate), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                            );
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: i * 0.02 }}
                                    className={`p-2 rounded-lg cursor-pointer ${
                                        format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                                            ? 'bg-primary-100'
                                            : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => setSelectedDate(date)}
                                >
                                    <p className="text-sm text-center">
                                        {format(date, 'd', { locale: ar })}
                                    </p>
                                    {tasks.length > 0 && (
                                        <div className="flex justify-center mt-2">
                                            <Badge 
                                                variant="dot" 
                                                color={tasks.some((t: any) => t.status === 'pending') ? 'warning' : 'success'}
                                            >
                                                <span>{tasks.length}</span>
                                            </Badge>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>

            {/* مهام اليوم المحدد */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card title={`مهام ${format(selectedDate, 'd MMMM yyyy', { locale: ar })}`}>
                    <div className="space-y-4">
                        {tasksForSelectedDate.length > 0 ? (
                            tasksForSelectedDate.map((task, index) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                    className="p-4 border rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{task.title}</p>
                                            <p className="text-sm text-gray-600">{task.courseTitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge 
                                                variant={task.type === 'quiz' ? 'standard' : 'dot'} 
                                                color={task.type === 'quiz' ? 'primary' : 'info'}
                                            >
                                                <span>{task.type === 'quiz' ? 'كويز' : 'واجب'}</span>
                                            </Badge>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                className="mt-2"
                                            >
                                                {task.status === 'pending' ? 'حل' : 'مراجعة'}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <EmptyState
                                title="لا توجد مهام في هذا اليوم"
                                description="يمكنك اختيار يوم آخر لعرض المهام"
                            />
                        )}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
} 