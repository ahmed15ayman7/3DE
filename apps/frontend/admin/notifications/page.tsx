// "use client"
// import React, { useState } from 'react';
// import Card from '@/components/common/Card';
// import DataGrid from '@/components/common/DataGrid';
// import ActionButtons from '@/components/common/ActionButtons';

// export default function AdminNotifications() {

//     const [showNewNotificationForm, setShowNewNotificationForm] = useState(false);

//     const notificationStats = [
//         {
//             id: 1,
//             title: 'إجمالي الإشعارات',
//             value: '1,250',
//             change: '+15%',
//             trend: 'up',
//         },
//         {
//             id: 2,
//             title: 'الإشعارات النشطة',
//             value: '850',
//             change: '+8%',
//             trend: 'up',
//         },
//         {
//             id: 3,
//             title: 'الإشعارات المقرؤة',
//             value: '1,000',
//             change: '+12%',
//             trend: 'up',
//         },
//         {
//             id: 4,
//             title: 'الإشعارات المهمة',
//             value: '50',
//             change: '+5%',
//             trend: 'up',
//         },
//     ];

//     const notifications = [
//         {
//             id: 1,
//             title: 'تذكير بدفع الرسوم',
//             content: 'يرجى دفع رسوم الفصل الدراسي الثاني قبل نهاية الشهر',
//             type: 'مهم',
//             target: 'طلاب',
//             date: '2024-04-25',
//             status: 'نشط',
//             readCount: '850',
//         },
//         {
//             id: 2,
//             title: 'اجتماع أولياء الأمور',
//             content: 'سيتم عقد اجتماع أولياء الأمور يوم السبت القادم',
//             type: 'معلومة',
//             target: 'أولياء أمور',
//             date: '2024-04-24',
//             status: 'نشط',
//             readCount: '650',
//         },
//         {
//             id: 3,
//             title: 'تحديث المنهج',
//             content: 'تم تحديث منهج الرياضيات للصف الثالث',
//             type: 'تحديث',
//             target: 'معلمون',
//             date: '2024-04-23',
//             status: 'مكتمل',
//             readCount: '120',
//         },
//     ];

//     const columns = [
//         { field: 'title', headerName: 'العنوان', width: 200 },
//         { field: 'type', headerName: 'النوع', width: 100 },
//         { field: 'target', headerName: 'المستهدف', width: 120 },
//         { field: 'date', headerName: 'التاريخ', width: 150 },
//         { field: 'status', headerName: 'الحالة', width: 100 },
//         { field: 'readCount', headerName: 'عدد القراءات', width: 120 },
//         {
//             field: 'actions',
//             headerName: 'الإجراءات',
//             width: 200,
//             renderCell: (params: any) => (
//                 <ActionButtons
//                     showEdit={true}
//                     showDelete={true}
//                     showView={false}
//                     showExport={false}
//                     onEdit={() => console.log('Edit notification:', params.row)}
//                     onDelete={() => console.log('Delete notification:', params.row)}
//                 />
//             ),
//         },
//     ];

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">الإشعارات العامة</h1>
//                 <div className="flex gap-4">
//                     <button
//                         className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
//                         onClick={() => setShowNewNotificationForm(true)}
//                     >
//                         إشعار جديد
//                     </button>
//                     <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
//                         تصدير البيانات
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {notificationStats.map(stat => (
//                     <Card key={stat.id} title={stat.title}>
//                         <div className="flex justify-between items-start">
//                             <div>

//                                 <p className="text-3xl font-bold mt-2">{stat.value}</p>
//                             </div>
//                             <div className={`text-${stat.trend === 'up' ? 'green' : 'red'}-500`}>
//                                 {stat.change}
//                             </div>
//                         </div>
//                     </Card>
//                 ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                 <Card title={'توزيع الإشعارات حسب النوع'}>
//                     <h2 className="text-2xl font-semibold mb-4">توزيع الإشعارات حسب النوع</h2>
//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>مهم</span>
//                             <span className="font-medium">20%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>معلومة</span>
//                             <span className="font-medium">50%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>تحديث</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={'توزيع الإشعارات حسب المستهدف'}>

//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>طلاب</span>
//                             <span className="font-medium">40%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>معلمون</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>أولياء أمور</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={'إحصائيات القراءة'}>
//                     <h2 className="text-2xl font-semibold mb-4">إحصائيات القراءة</h2>
//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>متوسط وقت القراءة</span>
//                             <span className="font-medium">2.5 دقيقة</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>نسبة القراءة</span>
//                             <span className="font-medium">85%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>أعلى إشعار قراءة</span>
//                             <span className="font-medium">تذكير بدفع الرسوم</span>
//                         </div>
//                     </div>
//                 </Card>
//             </div>

//             <Card title={'قائمة الإشعارات'}>
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             placeholder={'بحث...'}
//                             className="px-4 py-2 border rounded-md"
//                         />
//                         <select className="px-4 py-2 border rounded-md">
//                             <option value="">جميع الأنواع</option>
//                             <option value="important">مهم</option>
//                             <option value="info">معلومة</option>
//                             <option value="update">تحديث</option>
//                         </select>
//                     </div>
//                 </div>
//                 <DataGrid
//                     columns={columns}
//                     rows={notifications}
//                     pageSize={10}
//                     checkboxSelection={true}
//                 />
//             </Card>

//             {showNewNotificationForm && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <Card className="w-full max-w-2xl" title={'إشعار جديد'}>
//                         <h2 className="text-2xl font-semibold mb-4">إشعار جديد</h2>
//                         <form className="space-y-4">
//                             <div>
//                                 <label className="block mb-2">العنوان</label>
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-md"
//                                     placeholder={'أدخل عنوان الإشعار'}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2">المحتوى</label>
//                                 <textarea
//                                     className="w-full px-4 py-2 border rounded-md"
//                                     rows={4}
//                                     placeholder={'أدخل محتوى الإشعار'}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2">النوع</label>
//                                 <select className="w-full px-4 py-2 border rounded-md">
//                                     <option value="important">مهم</option>
//                                     <option value="info">معلومة</option>
//                                     <option value="update">تحديث</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block mb-2">المستهدف</label>
//                                 <select className="w-full px-4 py-2 border rounded-md">
//                                     <option value="students">طلاب</option>
//                                     <option value="teachers">معلمون</option>
//                                     <option value="parents">أولياء أمور</option>
//                                     <option value="all">الجميع</option>
//                                 </select>
//                             </div>
//                             <div className="flex justify-end gap-4">
//                                 <button
//                                     type="button"
//                                     className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                                     onClick={() => setShowNewNotificationForm(false)}
//                                 >
//                                     إلغاء
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
//                                 >
//                                     إرسال
//                                 </button>
//                             </div>
//                         </form>
//                     </Card>
//                 </div>
//             )}
//         </div>
//     );
// } 

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page