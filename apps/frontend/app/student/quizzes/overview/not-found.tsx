import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div>جاري التحميل...</div> });

export default function QuizzesOverflowNotFound() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card title="الصفحة غير موجودة">
                <div className="text-center space-y-4">
                    <div className="text-gray-500 text-6xl">🔍</div>
                    <h2 className="text-xl font-bold text-gray-800">الصفحة غير موجودة</h2>
                    <p className="text-gray-600">
                        عذراً، الصفحة التي تبحث عنها غير موجودة في قسم الكويزات والواجبات
                    </p>
                    <div className="flex space-x-2 justify-center">
                        <Link href="/student/quizzes/overflow/calendar">
                            <Button variant="default">
                                العودة للتقويم
                            </Button>
                        </Link>
                        <Link href="/student/dashboard">
                            <Button variant="outline">
                                العودة للرئيسية
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
} 