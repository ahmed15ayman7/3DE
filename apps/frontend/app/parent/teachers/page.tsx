"use client" 
import React from 'react';
import dynamic from 'next/dynamic';
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div>جاري التحميل...</div> });

export default function ParentTeachers() {
    const teachers = [
        {
            id: 1,
            name: 'أ. محمد أحمد',
            subject: 'الرياضيات',
            grade: 'الصف الثالث',
            email: 'mohamed.ahmed@school.com',
            phone: '0123456789',
            availability: 'متاح',
            lastMeeting: '2024-04-20',
        },
        {
            id: 2,
            name: 'أ. سارة خالد',
            subject: 'اللغة العربية',
            grade: 'الصف الأول',
            email: 'sara.khaled@school.com',
            phone: '0123456788',
            availability: 'متاح',
            lastMeeting: '2024-04-18',
        },
    ];

    const messages = [
        {
            id: 1,
            teacher: 'أ. محمد أحمد',
            subject: 'تقدم الطالب في الرياضيات',
            date: '2024-04-25',
            status: 'غير مقروء',
            priority: 'عاجل',
        },
        {
            id: 2,
            teacher: 'أ. سارة خالد',
            subject: 'نتيجة اختبار اللغة العربية',
            date: '2024-04-24',
            status: 'مقروء',
            priority: 'عادي',
        },
    ];

    const columns = [
        { field: 'teacher', headerName: ('المعلم'), width: 150 },
        { field: 'subject', headerName: ('الموضوع'), width: 200 },
        { field: 'date', headerName: ('التاريخ'), width: 150 },
        { field: 'status', headerName: ('الحالة'), width: 100 },
        { field: 'priority', headerName: ('الأولوية'), width: 100 },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{('التواصل مع المدرسين')}</h1>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                    {('رسالة جديدة')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {teachers.map(teacher => (
                    <Card key={teacher.id} title={teacher.name}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                {/* <h2 className="text-2xl font-bold">{teacher.name}</h2> */}
                                <p className="text-gray-600">{teacher.subject} - {teacher.grade}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-${teacher.availability === 'متاح' ? 'green' : 'red'}-600`}>
                                    {teacher.availability}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {('آخر اجتماع')}: {teacher.lastMeeting}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium mb-1">{('البريد الإلكتروني')}</h3>
                                <p className="text-lg">{teacher.email}</p>
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">{('رقم الهاتف')}</h3>
                                <p className="text-lg">{teacher.phone}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                                {('إرسال رسالة')}
                            </button>
                            <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                                {('طلب اجتماع')}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">{('الرسائل')}</h2>
                <DataGrid
                    columns={columns}
                    rows={messages}
                    pageSize={10}
                    checkboxSelection={true}
                />
            </div>
        </div>
    );
} 