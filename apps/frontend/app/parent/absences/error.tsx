"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { 
    loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> 
});
const Button = dynamic(() => import('@/components/common/Button'), { 
    loading: () => <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div> 
});

export default function AbsencesError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <EmptyState
                    title="حدث خطأ"
                    description="حدث خطأ أثناء تحميل بيانات الغياب. يرجى المحاولة مرة أخرى."
                    icon="⚠️"
                />
                <div className="mt-6 space-x-4 space-x-reverse">
                    <Button
                        variant="contained"
                        onClick={reset}
                        className="bg-primary-600 hover:bg-primary-700"
                    >
                        إعادة المحاولة
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => window.location.href = '/parent/dashboard'}
                    >
                        العودة للرئيسية
                    </Button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4 text-sm text-gray-600">
                        <summary className="cursor-pointer">تفاصيل الخطأ</summary>
                        <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                            {error.message}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
} 