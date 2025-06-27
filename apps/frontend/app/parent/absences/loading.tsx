import React from 'react';
import dynamic from 'next/dynamic';

const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { 
    loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> 
});

export default function AbsencesLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* عنوان تحميل */}
            <div className="mb-8">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* إحصائيات تحميل */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>

            {/* طلاب تحميل */}
            <div className="mb-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            </div>

            {/* فلاتر تحميل */}
            <div className="mb-6">
                <div className="flex gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24" />
                    ))}
                </div>
            </div>

            {/* جدول تحميل */}
            <Skeleton className="h-96" />
        </div>
    );
} 