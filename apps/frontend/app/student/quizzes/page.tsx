"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { quizApi, assignmentApi } from '@/lib/api';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, List, History, ChartLine } from 'lucide-react';

// Dynamic imports للتحسين
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div>جاري التحميل...</div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div>جاري التحميل...</div> });
const Tabs = dynamic(() => import('@/components/common/Tabs'), { loading: () => <div>جاري التحميل...</div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div>جاري التحميل...</div> });
const Tooltip = dynamic(() => import('@/components/common/Tooltip'), { loading: () => <div>جاري التحميل...</div> });
const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div>جاري التحميل...</div> });
const Avatar = dynamic(() => import('@/components/common/Avatar'), { loading: () => <div>جاري التحميل...</div> });
const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { loading: () => <div>جاري التحميل...</div> });
const Progress = dynamic(() => import('@/components/common/Progress'), { loading: () => <div>جاري التحميل...</div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div>جاري التحميل...</div> });

interface IQuiz {
    activeQuiz: any,
    quizzes: any[],
    assignments: any[],
    performance: {
        strengths: { title: string; description: string }[],
        improvements: { title: string; description: string }[]
    }
}

const initialData: IQuiz = {
    activeQuiz: {
        id: '',
        title: 'امتحان في html',
        description: 'امتحان في html علي جزئية التصميم',
        lessonId: '',
        timeLimit: 10,
        passingScore: 50,
        upComing: false,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    quizzes: [],
    assignments: [],
    performance: {
        strengths: [],
        improvements: []
    }
};

const getActiveQuizData = async (user: any) => {
    let { status, data } = await quizApi.getActive();
    if (status >= 200 && status < 300) {
        return data;
    }
    return null;
};

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

const getPerformanceData = async (user: any) => {
    let { status, data } = await quizApi.getPerformance(user.id);
    if (status >= 200 && status < 300) {
        return data;
    }
    return { strengths: [], improvements: [] };
};

export default function StudentQuizzes() {
    const { user, status } = useUser();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedQuiz, setSelectedQuiz] = useState(initialData.activeQuiz);

    // استعلامات البيانات مع React Query
    const { data: activeQuiz, isLoading: isLoadingActiveQuiz } = useQuery({
        queryKey: ['activeQuiz'],
        queryFn: () => getActiveQuizData(user),
        enabled: !!user,
    });
    const { data: quizzes, isLoading: isLoadingQuizzes } = useQuery({
        queryKey: ['quizzes'],
        queryFn: () => getQuizzesData(user),
        enabled: !!user,
    });
    const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
        queryKey: ['assignments'],
        queryFn: () => getAssignmentsData(user),
        enabled: !!user,
    });
    const { data: performance, isLoading: isLoadingPerformance } = useQuery({
        queryKey: ['performance'],
        queryFn: () => getPerformanceData(user),
        enabled: !!user,
    });

    if (isLoadingActiveQuiz || isLoadingQuizzes || isLoadingAssignments || isLoadingPerformance) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} height={300} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Tabs */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                tabs={[
                    {
                        value: 0,
                        label: 'الكويزات',
                        icon: <List />,
                        content: (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(quizzes ?? []).map((quiz: any, index: number) => (
                                    <Card key={quiz.id} title={quiz.title} className="h-full">
                                        <div className="space-y-2">
                                            <p className="text-gray-600">{quiz.description}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="standard" color="primary">
                                                    <span>كويز</span>
                                                </Badge>
                                                <Badge variant="dot" color={quiz.isCompleted ? 'success' : 'warning'}>
                                                    <span>{quiz.isCompleted ? 'مكتمل' : 'قيد الانتظار'}</span>
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>تاريخ: {format(new Date(quiz.createdAt), 'd MMMM yyyy', { locale: ar })}</span>
                                                <span>المدة: {quiz.timeLimit} دقيقة</span>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                {quiz.isCompleted ? 'مراجعة' : 'حل الكويز'}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )
                    },
                    {
                        value: 1,
                        label: 'الواجبات',
                        icon: <History />,
                        content: (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(assignments ?? []).map((assignment: any, index: number) => (
                                    <Card key={assignment.id} title={assignment.title} className="h-full">
                                        <div className="space-y-2">
                                            <p className="text-gray-600">{assignment.description}</p>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="standard" color="info">
                                                    <span>واجب</span>
                                                </Badge>
                                                <Badge variant="dot" color={assignment.isCompleted ? 'success' : 'warning'}>
                                                    <span>{assignment.isCompleted ? 'مكتمل' : 'قيد الانتظار'}</span>
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span>تاريخ: {format(new Date(assignment.createdAt), 'd MMMM yyyy', { locale: ar })}</span>
                                                <span>عدد الأسئلة: {assignment.questionsCount}</span>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                {assignment.isCompleted ? 'مراجعة' : 'حل الواجب'}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )
                    },
                    {
                        value: 2,
                        label: 'تحليل الأداء',
                        icon: <ChartLine />,
                        content: (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card title="نقاط القوة" className="h-full">
                                    <div className="space-y-2">
                                        {(performance?.strengths ?? []).length === 0 && <p className="text-gray-500">لا توجد بيانات</p>}
                                        {(performance?.strengths ?? []).map((item: any, idx: number) => (
                                            <div key={idx} className="p-2 bg-green-50 rounded-lg">
                                                <p className="font-bold text-green-700">{item.title}</p>
                                                <p className="text-sm text-green-600">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                <Card title="نقاط التحسين" className="h-full">
                                    <div className="space-y-2">
                                        {(performance?.improvements ?? []).length === 0 && <p className="text-gray-500">لا توجد بيانات</p>}
                                        {(performance?.improvements ?? []).map((item: any, idx: number) => (
                                            <div key={idx} className="p-2 bg-yellow-50 rounded-lg">
                                                <p className="font-bold text-yellow-700">{item.title}</p>
                                                <p className="text-sm text-yellow-600">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        )
                    },
                ]}
            />

            {/* محتوى التبويبات */}
            <div className="min-h-[400px]">
                {activeTab === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(quizzes ?? []).map((quiz: any, index: number) => (
                            <Card key={quiz.id} title={quiz.title} className="h-full">
                                <div className="space-y-2">
                                    <p className="text-gray-600">{quiz.description}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="standard" color="primary">
                                            <span>كويز</span>
                                        </Badge>
                                        <Badge variant="dot" color={quiz.isCompleted ? 'success' : 'warning'}>
                                            <span>{quiz.isCompleted ? 'مكتمل' : 'قيد الانتظار'}</span>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>تاريخ: {format(new Date(quiz.createdAt), 'd MMMM yyyy', { locale: ar })}</span>
                                        <span>المدة: {quiz.timeLimit} دقيقة</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        {quiz.isCompleted ? 'مراجعة' : 'حل الكويز'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {activeTab === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(assignments ?? []).map((assignment: any, index: number) => (
                            <Card key={assignment.id} title={assignment.title} className="h-full">
                                <div className="space-y-2">
                                    <p className="text-gray-600">{assignment.description}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="standard" color="info">
                                            <span>واجب</span>
                                        </Badge>
                                        <Badge variant="dot" color={assignment.isCompleted ? 'success' : 'warning'}>
                                            <span>{assignment.isCompleted ? 'مكتمل' : 'قيد الانتظار'}</span>
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>تاريخ: {format(new Date(assignment.createdAt), 'd MMMM yyyy', { locale: ar })}</span>
                                        <span>عدد الأسئلة: {assignment.questionsCount}</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        {assignment.isCompleted ? 'مراجعة' : 'حل الواجب'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {activeTab === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="نقاط القوة" className="h-full">
                            <div className="space-y-2">
                                {(performance?.strengths ?? []).length === 0 && <p className="text-gray-500">لا توجد بيانات</p>}
                                {(performance?.strengths ?? []).map((item: any, idx: number) => (
                                    <div key={idx} className="p-2 bg-green-50 rounded-lg">
                                        <p className="font-bold text-green-700">{item.title}</p>
                                        <p className="text-sm text-green-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card title="نقاط التحسين" className="h-full">
                            <div className="space-y-2">
                                {(performance?.improvements ?? []).length === 0 && <p className="text-gray-500">لا توجد بيانات</p>}
                                {(performance?.improvements ?? []).map((item: any, idx: number) => (
                                    <div key={idx} className="p-2 bg-yellow-50 rounded-lg">
                                        <p className="font-bold text-yellow-700">{item.title}</p>
                                        <p className="text-sm text-yellow-600">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </motion.div>
    );
}