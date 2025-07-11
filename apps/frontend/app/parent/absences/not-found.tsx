"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const EmptyState = dynamic(() => import('@/components/common/EmptyState'), { 
    loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> 
});
const Button = dynamic(() => import('@/components/common/Button'), { 
    loading: () => <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div> 
});

export default function AbsencesNotFound() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <EmptyState
                    title="الصفحة غير موجودة"
                    description="عذراً، صفحة الغياب المطلوبة غير موجودة."
                    icon="🔍"
                />
                <div className="mt-6">
                    <Button
                        variant="default"
                        onClick={() => window.location.href = '/parent/dashboard'}
                        className="bg-primary-600 hover:bg-primary-700"
                    >
                        العودة للرئيسية
                    </Button>
                </div>
            </div>
        </div>
    );
} 