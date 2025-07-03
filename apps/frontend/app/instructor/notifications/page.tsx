"use client"
import React from 'react';
import dynamic from 'next/dynamic';
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });
export default function InstructorNotifications() {

    const notifications = [
        {
            id: 1,
            title: 'طلب انضمام جديد',
            message: 'طلب أحمد محمد الانضمام إلى دورة البرمجة بلغة Python',
            type: 'success',
            date: '2024-04-25',
            time: '09:00',
            read: false,
            action: 'قبول',
        },
        {
            id: 2,
            title: 'تذكير بموعد الاختبار',
            message: 'اختبار الوحدة الأولى في دورة تطوير تطبيقات الويب غداً الساعة 10 صباحاً',
            type: 'warning',
            date: '2024-04-24',
            time: '15:30',
            read: true,
            action: 'عرض التفاصيل',
        },
        {
            id: 3,
            title: 'تقرير الحضور',
            message: 'تم رفع تقرير الحضور لليوم 2024-04-23',
            type: 'info',
            date: '2024-04-23',
            time: '16:45',
            read: true,
            action: 'عرض التقرير',
        },
        {
            id: 4,
            title: 'تنبيه مهم',
            message: 'تم تغيير موعد الدرس القادمة إلى يوم الخميس',
            type: 'error',
            date: '2024-04-22',
            time: '11:20',
            read: false,
            action: 'تأكيد',
        },
    ];

    const columns = [
        { field: 'title', headerName: ('العنوان'), width: 200 },
        { field: 'message', headerName: ('الرسالة'), width: 300 },
        { field: 'type', headerName: ('النوع'), width: 100 },
        { field: 'date', headerName: ('التاريخ'), width: 150 },
        { field: 'time', headerName: ('الوقت'), width: 100 },
        { field: 'read', headerName: ('تم القراءة'), width: 100 },
        { field: 'action', headerName: ('الإجراء'), width: 100 },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{('الإشعارات')}</h1>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                        {('تمييز الكل كمقروء')}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        {('حذف الكل')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title='إجمالي الإشعارات'>
                    <div className="text-4xl font-bold">{notifications.length}</div>
                </Card>
                <Card title='الإشعارات غير المقروءة'>
                    <div className="text-4xl font-bold">
                        {notifications.filter(n => !n.read).length}
                    </div>
                </Card>
                <Card title='الإشعارات اليوم'>
                    <div className="text-4xl font-bold">
                        {notifications.filter(n => n.date === '2024-04-25').length}
                    </div>
                </Card>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{('قائمة الإشعارات')}</h2>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">{('جميع الإشعارات')}</option>
                            <option value="unread">{('غير مقروء')}</option>
                            <option value="today">{('اليوم')}</option>
                            <option value="week">{('الأسبوع')}</option>
                            <option value="month">{('الشهر')}</option>
                        </select>
                        <select className="px-3 py-2 border border-gray-300 rounded-md">
                            <option value="all">{('جميع الأنواع')}</option>
                            <option value="success">{('نجاح')}</option>
                            <option value="warning">{('تحذير')}</option>
                            <option value="info">{('معلومات')}</option>
                            <option value="error">{('خطأ')}</option>
                        </select>
                    </div>
                </div>
                <DataGrid
                    columns={columns}
                    rows={notifications}
                    pageSize={10}
                    checkboxSelection={true}
                />
            </div>
        </div>
    );
} 