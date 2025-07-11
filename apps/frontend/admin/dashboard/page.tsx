// import React from 'react';
// import Card from '@/components/common/Card';
// import DataGrid from '@/components/common/DataGrid';
// import { GridColDef } from '@mui/x-data-grid';

// export default function AdminDashboard() {
//     const statistics = [
//         {
//             id: 1,
//             title: ('إجمالي الطلاب'),
//             value: '1,250',
//             change: '+5%',
//             trend: 'up',
//         },
//         {
//             id: 2,
//             title: ('إجمالي المعلمين'),
//             value: '45',
//             change: '+2%',
//             trend: 'up',
//         },
//         {
//             id: 3,
//             title: ('إجمالي أولياء الأمور'),
//             value: '850',
//             change: '+3%',
//             trend: 'up',
//         },
//         {
//             id: 4,
//             title: ('إجمالي الإيرادات'),
//             value: '250,000 ريال',
//             change: '+8%',
//             trend: 'up',
//         },
//     ];

//     const recentActivities = [
//         {
//             id: 1,
//             type: 'تسجيل',
//             description: 'تم تسجيل طالب جديد: أحمد محمد',
//             date: '2024-04-25',
//             time: '10:30 ص',
//         },
//         {
//             id: 2,
//             type: 'دفع',
//             description: 'تم استلام رسوم من ولي الأمر: محمد أحمد',
//             date: '2024-04-25',
//             time: '09:15 ص',
//         },
//         {
//             id: 3,
//             type: 'تحديث',
//             description: 'تم تحديث بيانات المعلم: أ. سارة خالد',
//             date: '2024-04-24',
//             time: '03:45 م',
//         },
//     ];

//     const columns: GridColDef[] = [
//         { field: 'type', headerName: ('النوع'), width: 100 },
//         { field: 'description', headerName: ('الوصف'), width: 300 },
//         { field: 'date', headerName: ('التاريخ'), width: 150 },
//         { field: 'time', headerName: ('الوقت'), width: 100 },
//     ];

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">{('لوحة التحكم')}</h1>
//                 <div className="flex gap-4">
//                     <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
//                         {('تقرير جديد')}
//                     </button>
//                     <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
//                         {('تصدير البيانات')}
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {statistics.map(stat => (
//                     <Card key={stat.id} title={stat.title}>
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-lg font-medium text-gray-600">{stat.title}</h3>
//                                 <p className="text-3xl font-bold mt-2">{stat.value}</p>
//                             </div>
//                             <div className={`text-${stat.trend === 'up' ? 'green' : 'red'}-500`}>
//                                 {stat.change}
//                             </div>
//                         </div>
//                     </Card>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                 <Card title={('آخر الأنشطة')}>
//                     <h2 className="text-2xl font-semibold mb-4">{('آخر الأنشطة')}</h2>
//                     <div style={{ height: 400, width: '100%' }}>
//                         <DataGrid
//                             columns={columns}
//                             rows={recentActivities}
//                             pageSize={5}
//                             checkboxSelection={true}
//                         />
//                     </div>
//                 </Card>
//                 <Card title={('التقويم')}>
//                     <h2 className="text-2xl font-semibold mb-4">{('التقويم')}</h2>
//                     <div className="p-4">
//                         {/* هنا سيتم إضافة مكون التقويم */}
//                         <p className="text-gray-500 text-center">{('سيتم إضافة التقويم قريباً')}</p>
//                     </div>
//                 </Card>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <Card title={('الإشعارات المهمة')}>
//                     <h2 className="text-2xl font-semibold mb-4">{('الإشعارات المهمة')}</h2>
//                     <div className="space-y-4">
//                         <div className="p-4 bg-yellow-50 rounded-md">
//                             <p className="font-medium">{('تذكير: موعد تسليم التقارير الشهرية')}</p>
//                             <p className="text-sm text-gray-600">{('الموعد النهائي: 30 أبريل 2024')}</p>
//                         </div>
//                         <div className="p-4 bg-red-50 rounded-md">
//                             <p className="font-medium">{('تنبيه: نظام الدفع متوقف حالياً')}</p>
//                             <p className="text-sm text-gray-600">{('سيتم إصلاحه خلال ساعتين')}</p>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={('المهام العاجلة')}>
//                     <div className="space-y-4">
//                         <div className="flex items-center justify-between p-4 bg-blue-50 rounded-md">
//                             <div>
//                                 <p className="font-medium">{('مراجعة طلبات التسجيل الجديدة')}</p>
//                                 <p className="text-sm text-gray-600">{('5 طلبات في الانتظار')}</p>
//                             </div>
//                             <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
//                                 {('عرض')}
//                             </button>
//                         </div>
//                         <div className="flex items-center justify-between p-4 bg-green-50 rounded-md">
//                             <div>
//                                 <p className="font-medium">{('تحديث جداول الحصص')}</p>
//                                 <p className="text-sm text-gray-600">{('مطلوب قبل نهاية اليوم')}</p>
//                             </div>
//                             <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
//                                 {('تحديث')}
//                             </button>
//                         </div>
//                     </div>
//                 </Card>
//             </div>
//         </div>
//     );
// } 

import React from 'react'

const Page = () => {
  return (
    <div>Page</div>
  )
}

export default Page