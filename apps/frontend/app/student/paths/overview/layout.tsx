'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Button from '@/components/common/Button';
import { Plus as FaPlus } from 'lucide-react';

const Tabs = dynamic(() => import('@/components/common/Tabs'), { 
    loading: () => <div className="h-10 bg-gray-200 rounded animate-pulse"></div> 
});

const tabs = [
    { value: 0, label: 'نظرة عامة', path: '/student/paths/overview' },
    { value: 1, label: 'المواد', path: '/student/paths/overview?type=courses' },
    { value: 2, label: 'التقدم', path: '/student/paths/overview?type=progress' },
    { value: 3, label: 'الزملاء', path: '/student/paths/overview?type=peers' },
];

export default function PathsOverviewLayout({
    children,
    overview,
    courses,
    progress,
    peers,
}: {
    children: React.ReactNode;
    overview: React.ReactNode;
    courses: React.ReactNode;
    progress: React.ReactNode;
    peers: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // const activeTab = searchParams.get('type') || 0;
    
    // تحديد التبويب النشط بناءً على المسار الحالي
    const getActiveTab = () => {
        if (searchParams.get('type') === 'courses') return 1;
        if (searchParams.get('type') === 'progress') return 2;
        if (searchParams.get('type') === 'peers') return 3;
        return 0;
    };

    const activeTab = getActiveTab();

    const handleTabChange = (value: number) => {
        const tab = tabs.find(t => t.value === value);
        if (tab) {
            router.push(tab.path);
        }
    };

    return (
        <div className="space-y-6">
            {/* العنوان والبحث */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">مساراتك الحالية 👋</h1>
                    <p className="text-gray-600">
                        تقدر تبدأ أو تتابع أي مسار تعلم يناسبك
                    </p>
                </div>
                <Button variant="contained" size="large">
                    انضم لمسار جديد
                </Button>
            </div>

            {/* التبويبات */}
            <Tabs
                value={Number(activeTab)}
                onChange={handleTabChange}
                tabs={tabs.map(tab => ({
                    value: tab.value,
                    label: tab.label,
                    content: <></>
                }))}
            />

            {/* المحتوى */}
            <div className="min-h-[400px]">
                {activeTab === 0 && overview}
                {activeTab === 1 && courses}
                {activeTab === 2 && progress}
                {activeTab === 3 && peers}
            </div>
        </div>
    );
} 