// "use client"
// import React, { useState } from 'react';
// import Card from '@/components/common/Card';
// import DataGrid from '@/components/common/DataGrid';
// import ActionButtons from '@/components/common/ActionButtons';

// export default function AdminReports() {

//     const [showNewReportForm, setShowNewReportForm] = useState(false);

//     const reportStats = [
//         {
//             id: 1,
//             title: 'إجمالي التقارير',
//             value: '250',
//             change: '+15%',
//             trend: 'up',
//         },
//         {
//             id: 2,
//             title: 'تقارير هذا الشهر',
//             value: '45',
//             change: '+8%',
//             trend: 'up',
//         },
//         {
//             id: 3,
//             title: 'تقارير الطلاب',
//             value: '120',
//             change: '+12%',
//             trend: 'up',
//         },
//         {
//             id: 4,
//             title: 'تقارير المعلمين',
//             value: '85',
//             change: '+5%',
//             trend: 'up',
//         },
//     ];

//     const reports = [
//         {
//             id: 1,
//             title: 'تقرير أداء الطلاب',
//             type: 'أداء',
//             target: 'طلاب',
//             date: '2024-04-25',
//             status: 'مكتمل',
//             views: '850',
//         },
//         {
//             id: 2,
//             title: 'تقرير حضور المعلمين',
//             type: 'حضور',
//             target: 'معلمون',
//             date: '2024-04-24',
//             status: 'مكتمل',
//             views: '650',
//         },
//         {
//             id: 3,
//             title: 'تقرير المالية',
//             type: 'مالية',
//             target: 'إدارة',
//             date: '2024-04-23',
//             status: 'مكتمل',
//             views: '120',
//         },
//     ];

//     const columns = [
//         { field: 'title', headerName: 'العنوان', width: 200 },
//         { field: 'type', headerName: 'النوع', width: 100 },
//         { field: 'target', headerName: 'المستهدف', width: 120 },
//         { field: 'date', headerName: 'التاريخ', width: 150 },
//         { field: 'status', headerName: 'الحالة', width: 100 },
//         { field: 'views', headerName: 'عدد المشاهدات', width: 120 },
//         {
//             field: 'actions',
//             headerName: 'الإجراءات',
//             width: 200,
//             renderCell: (params: any) => (
//                 <ActionButtons
//                     showView={true}
//                     showExport={true}
//                     showEdit={false}
//                     showDelete={false}
//                     onView={() => console.log('View report:', params.row)}
//                     onExport={() => console.log('Export report:', params.row)}
//                 />
//             ),
//         },
//     ];

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">التقارير</h1>
//                 <div className="flex gap-4">
//                     <button
//                         className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
//                         onClick={() => setShowNewReportForm(true)}
//                     >
//                         تقرير جديد
//                     </button>
//                     <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
//                         تصدير الكل
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {reportStats.map(stat => (
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
//                 <Card title={'توزيع التقارير حسب النوع'}>
//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>أداء</span>
//                             <span className="font-medium">40%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>حضور</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>مالية</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={'توزيع التقارير حسب المستهدف'}>
//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>طلاب</span>
//                             <span className="font-medium">50%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>معلمون</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>إدارة</span>
//                             <span className="font-medium">20%</span>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={'إحصائيات المشاهدة'}>
//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>متوسط المشاهدات</span>
//                             <span className="font-medium">540</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>أعلى تقرير مشاهدة</span>
//                             <span className="font-medium">تقرير أداء الطلاب</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>نسبة التصدير</span>
//                             <span className="font-medium">75%</span>
//                         </div>
//                     </div>
//                 </Card>
//             </div>

//             <Card title={'قائمة التقارير'}>
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             placeholder={'بحث...'}
//                             className="px-4 py-2 border rounded-md"
//                         />
//                         <select className="px-4 py-2 border rounded-md">
//                             <option value="">جميع الأنواع</option>
//                             <option value="performance">أداء</option>
//                             <option value="attendance">حضور</option>
//                             <option value="finance">مالية</option>
//                         </select>
//                     </div>
//                 </div>
//                 <DataGrid
//                     columns={columns}
//                     rows={reports}
//                     pageSize={10}
//                     checkboxSelection={true}
//                 />
//             </Card>

//             {showNewReportForm && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <Card className="w-full max-w-2xl" title={'تقرير جديد'}>
//                         <form className="space-y-4">
//                             <div>
//                                 <label className="block mb-2">عنوان التقرير</label>
//                                 <input
//                                     type="text"
//                                     className="w-full px-4 py-2 border rounded-md"
//                                     placeholder={'أدخل عنوان التقرير'}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block mb-2">نوع التقرير</label>
//                                 <select className="w-full px-4 py-2 border rounded-md">
//                                     <option value="performance">أداء</option>
//                                     <option value="attendance">حضور</option>
//                                     <option value="finance">مالية</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block mb-2">المستهدف</label>
//                                 <select className="w-full px-4 py-2 border rounded-md">
//                                     <option value="students">طلاب</option>
//                                     <option value="teachers">معلمون</option>
//                                     <option value="admin">إدارة</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block mb-2">الفترة الزمنية</label>
//                                 <div className="flex gap-2">
//                                     <input
//                                         type="date"
//                                         className="w-full px-4 py-2 border rounded-md"
//                                     />
//                                     <span className="flex items-center">إلى</span>
//                                     <input
//                                         type="date"
//                                         className="w-full px-4 py-2 border rounded-md"
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex justify-end gap-4">
//                                 <button
//                                     type="button"
//                                     className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                                     onClick={() => setShowNewReportForm(false)}
//                                 >
//                                     إلغاء
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
//                                 >
//                                     إنشاء
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