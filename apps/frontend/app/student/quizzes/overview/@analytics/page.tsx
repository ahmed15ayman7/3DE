'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { quizApi } from '@/lib/api';

// Dynamic imports للتحسين
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });

// API function
const getPerformanceData = async (user: any) => {
    let { status, data } = await quizApi.getPerformance(user.id);
    if (status >= 200 && status < 300) {
        return data;
    }
    return {
        strengths: [],
        improvements: []
    };
};

// بيانات افتراضية
const defaultPerformance = {
    strengths: [
        {
            title: 'قوة في البرمجة',
            description: 'أداء ممتاز في أسئلة البرمجة والمنطق',
        },
        {
            title: 'سرعة في الحل',
            description: 'إنجاز المهام في وقت قياسي',
        },
    ],
    improvements: [
        {
            title: 'تحسين في الرياضيات',
            description: 'الحاجة لمراجعة المفاهيم الرياضية الأساسية',
        },
        {
            title: 'دقة في الإجابات',
            description: 'التركيز على قراءة السؤال بعناية أكبر',
        },
    ]
};

export default function AnalyticsPage() {
    const { user, status } = useUser();

    // استعلام البيانات مع React Query
    const { data: performance, isLoading: isLoadingPerformance } = useQuery({
        queryKey: ['performance-analytics'],
        queryFn: () => getPerformanceData(user),
        enabled: status === 'authenticated',
        staleTime: 10 * 60 * 1000, // 10 دقائق
        gcTime: 20 * 60 * 1000, // 20 دقيقة
    });

    if (isLoadingPerformance) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton height={400} />
                <Skeleton height={400} />
            </div>
        );
    }

    const currentPerformance = performance || defaultPerformance;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* تحليل الأداء */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card title="تحليل الأداء">
                    <div className="space-y-6">
                        {currentPerformance.strengths.map((strength: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                className="p-4 bg-green-50 border border-green-200 rounded-lg"
                            >
                                <div className="flex items-start space-x-3">
                                    <Badge variant="dot" color="success">
                                        <span>قوة</span>
                                    </Badge>
                                    <div className="flex-1">
                                        <p className="font-medium text-green-800">{strength.title}</p>
                                        <p className="text-sm text-green-600 mt-1">{strength.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* نقاط التحسين */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card title="نقاط التحسين">
                    <div className="space-y-6">
                        {currentPerformance.improvements.map((improvement: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                            >
                                <div className="flex items-start space-x-3">
                                    <Badge variant="dot" color="warning">
                                        <span>تحسين</span>
                                    </Badge>
                                    <div className="flex-1">
                                        <p className="font-medium text-yellow-800">{improvement.title}</p>
                                        <p className="text-sm text-yellow-600 mt-1">{improvement.description}</p>
                                        <div className="mt-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                                            >
                                                عرض تمارين مقترحة
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* إحصائيات إضافية */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="lg:col-span-2"
            >
                <Card title="إحصائيات عامة">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">85%</p>
                            <p className="text-sm text-blue-600">متوسط الدرجات</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">24</p>
                            <p className="text-sm text-green-600">مهمة مكتملة</p>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <p className="text-2xl font-bold text-yellow-600">3</p>
                            <p className="text-sm text-yellow-600">مهام قيد الانتظار</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600">45</p>
                            <p className="text-sm text-purple-600">دقيقة متوسط الوقت</p>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
} 