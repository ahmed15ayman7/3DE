"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, List, History, ChartLine } from 'lucide-react';

const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div>جاري التحميل...</div> });

const tabs = [
    { 
        value: 'calendar', 
        label: 'التقويم', 
        icon: <Calendar size={16} />,
        path: '/student/quizzes/calendar'
    },
    { 
        value: 'list', 
        label: 'القائمة', 
        icon: <List size={16} />,
        path: '/student/quizzes/list'
    },
    { 
        value: 'history', 
        label: 'السجل', 
        icon: <History size={16} />,
        path: '/student/quizzes/history'
    },
    { 
        value: 'analytics', 
        label: 'التحليل', 
        icon: <ChartLine size={16} />,
        path: '/student/quizzes/analytics'
    },
];

export default function QuizzesLayout({
    children,
    calendar,
    list,
    history,
    analytics,
}: {
    children: React.ReactNode;
    calendar: React.ReactNode;
    list: React.ReactNode;
    history: React.ReactNode;
    analytics: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    
    // تحديد التبويب النشط بناءً على المسار الحالي
    const getActiveTab = () => {
        if (pathname.includes('/calendar')) return 'calendar';
        if (pathname.includes('/list')) return 'list';
        if (pathname.includes('/history')) return 'history';
        if (pathname.includes('/analytics')) return 'analytics';
        return 'calendar'; // افتراضي
    };

    const activeTab = getActiveTab();

    const handleTabChange = (tabValue: string) => {
        const tab = tabs.find(t => t.value === tabValue);
        if (tab) {
            router.push(tab.path);
        }
    };

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
                    <h1 className="text-2xl font-bold">كويزاتي وواجباتي 📚</h1>
                    <p className="text-gray-600">
                        تابع تقدمك في الاختبارات والواجبات
                    </p>
                </div>
            </div>

            {/* التبويبات */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="flex space-x-1 p-1">
                    {tabs.map((tab) => (
                        <motion.div
                            key={tab.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant={activeTab === tab.value ? 'contained' : 'text'}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                                    activeTab === tab.value
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'hover:bg-gray-100 text-gray-600'
                                }`}
                                onClick={() => handleTabChange(tab.value)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* محتوى التبويبات */}
            <div className="min-h-[600px]">
                {activeTab === 'calendar' && calendar}
                {activeTab === 'list' && list}
                {activeTab === 'history' && history}
                {activeTab === 'analytics' && analytics}
            </div>
        </motion.div>
    );
} 