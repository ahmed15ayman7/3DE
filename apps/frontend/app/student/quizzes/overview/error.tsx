'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div>جاري التحميل...</div> });

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function QuizzesOverflowError({ error, reset }: ErrorProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card title="خطأ في التحميل" className="max-w-md">
                <div className="text-center space-y-4">
                    <div className="text-red-500 text-6xl">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800">حدث خطأ</h2>
                    <p className="text-gray-600">
                        عذراً، حدث خطأ أثناء تحميل صفحة الكويزات والواجبات
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="text-left">
                            <summary className="cursor-pointer text-sm text-gray-500">
                                تفاصيل الخطأ
                            </summary>
                            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                                {error.message}
                            </pre>
                        </details>
                    )}
                    <div className="flex space-x-2 justify-center">
                        <Button
                            variant="default"
                            onClick={reset}
                        >
                            إعادة المحاولة
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/student/dashboard'}
                        >
                            العودة للرئيسية
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
} 