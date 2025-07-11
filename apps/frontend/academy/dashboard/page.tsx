"use client"
import React from 'react';
import dynamic from 'next/dynamic';
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div>جاري التحميل...</div> });

export default function AcademyDashboard() {
    const stats = [
        {
            id: 1,
            title: ('إجمالي المدارس'),
            value: '25',
            change: '+3',
            trend: 'up',
        },
        {
            id: 2,
            title: ('إجمالي الفرق'),
            value: '120',
            change: '+15',
            trend: 'up',
        },
        {
            id: 3,
            title: ('الأحداث القادمة'),
            value: '8',
            change: '+2',
            trend: 'up',
        },
        {
            id: 4,
            title: ('التقارير المعلقة'),
            value: '12',
            change: '-5',
            trend: 'down',
        },
    ];

    const teams = [
        {
            id: 1,
            name: ('فريق الرياض'),
            school: ('مدرسة الرياض النموذجية'),
            members: '15',
            status: ('نشط'),
            lastActivity: '2024-04-25',
        },
        {
            id: 2,
            name: ('فريق جدة'),
            school: ('مدرسة جدة الدولية'),
            members: '12',
            status: ('نشط'),
            lastActivity: '2024-04-24',
        },
        {
            id: 3,
            name: ('فريق الدمام'),
            school: ('مدرسة الدمام الأهلية'),
            members: '10',
            status: ('غير نشط'),
            lastActivity: '2024-04-20',
        },
    ];

    const events = [
        {
            id: 1,
            title: ('مسابقة البرمجة'),
            date: '2024-05-15',
            location: ('مدرسة الرياض النموذجية'),
            status: ('قادم'),
            participants: '50',
        },
        {
            id: 2,
            title: ('ورشة عمل الروبوتات'),
            date: '2024-05-20',
            location: ('مدرسة جدة الدولية'),
            status: ('قادم'),
            participants: '30',
        },
        {
            id: 3,
            title: ('معرض المشاريع'),
            date: '2024-05-25',
            location: ('مدرسة الدمام الأهلية'),
            status: ('قادم'),
            participants: '40',
        },
    ];

    const reports = [
        {
            id: 1,
            school: ('مدرسة الرياض النموذجية'),
            type: ('أداء الفرق'),
            date: '2024-04-25',
            status: ('مكتمل'),
            actions: ('عرض'),
        },
        {
            id: 2,
            school: ('مدرسة جدة الدولية'),
            type: ('تقييم الأحداث'),
            date: '2024-04-24',
            status: ('مكتمل'),
            actions: ('عرض'),
        },
        {
            id: 3,
            school: ('مدرسة الدمام الأهلية'),
            type: ('تقرير الميزانية'),
            date: '2024-04-23',
            status: ('معلق'),
            actions: ('مراجعة'),
        },
    ];

    const teamColumns = [
        { field: 'name', headerName: ('اسم الفريق'), width: 200 },
        { field: 'school', headerName: ('المدرسة'), width: 200 },
        { field: 'members', headerName: ('عدد الأعضاء'), width: 150 },
        { field: 'status', headerName: ('الحالة'), width: 150 },
        { field: 'lastActivity', headerName: ('آخر نشاط'), width: 150 },
        {
            field: 'actions',
            headerName: ('الإجراءات'),
            width: 200,
            renderCell: (params:any) => (
                <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        {('عرض')}
                    </button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                        {('تعديل')}
                    </button>
                </div>
            ),
        },
    ];

    const eventColumns = [
        { field: 'title', headerName: ('العنوان'), width: 200 },
        { field: 'date', headerName: ('التاريخ'), width: 150 },
        { field: 'location', headerName: ('المكان'), width: 200 },
        { field: 'status', headerName: ('الحالة'), width: 150 },
        { field: 'participants', headerName: ('عدد المشاركين'), width: 150 },
        {
            field: 'actions',
            headerName: ('الإجراءات'),
            width: 200,
            renderCell: (params:any) => (
                <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        {('عرض')}
                    </button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                        {('تعديل')}
                    </button>
                </div>
            ),
        },
    ];

    const reportColumns = [
        { field: 'school', headerName: ('المدرسة'), width: 200 },
        { field: 'type', headerName: ('نوع التقرير'), width: 200 },
        { field: 'date', headerName: ('التاريخ'), width: 150 },
        { field: 'status', headerName: ('الحالة'), width: 150 },
        {
            field: 'actions',
            headerName: ('الإجراءات'),
            width: 200,
            renderCell: (params:any) => (
                <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        {('عرض')}
                    </button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                        {('تحميل')}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{('لوحة تحكم الأكاديمية')}</h1>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                        {('فريق جديد')}
                    </button>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                        {('حدث جديد')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(stat => (
                    <Card key={stat.id} title=''>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
                                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                            </div>
                            <div className={`text-${stat.trend === 'up' ? 'green' : 'red'}-500`}>
                                {stat.change}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card title=''>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">{('الفرق')}</h2>
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                            {('إضافة فريق')}
                        </button>
                    </div>
                    <DataGrid
                        columns={teamColumns}
                        rows={teams}
                        pageSize={5}
                        checkboxSelection={true}
                    />
                </Card>

                <Card title=''>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">{('الأحداث القادمة')}</h2>
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                            {('إضافة حدث')}
                        </button>
                    </div>
                    <DataGrid
                        columns={eventColumns}
                        rows={events}
                        pageSize={5}
                        checkboxSelection={true}
                    />
                </Card>
            </div>

            <Card title=''>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">{('تقارير المدارس')}</h2>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
                            {('تقرير جديد')}
                        </button>
                        <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                            {('تصدير الكل')}
                        </button>
                    </div>
                </div>
                <DataGrid
                    columns={reportColumns}
                    rows={reports}
                    pageSize={5}
                    checkboxSelection={true}
                />
            </Card>
        </div>
    );
} 