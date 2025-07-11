// import React from 'react';
// import Card from '@/components/common/Card';
// import DataGrid from '@/components/common/DataGrid';

// export default function AdminFinance() {

//     const financialStats = [
//         {
//             id: 1,
//             title: 'الإيرادات الشهرية',
//             value: '250,000 ريال',
//             change: '+8%',
//             trend: 'up',
//         },
//         {
//             id: 2,
//             title: 'المصروفات الشهرية',
//             value: '150,000 ريال',
//             change: '+5%',
//             trend: 'up',
//         },
//         {
//             id: 3,
//             title: 'صافي الربح',
//             value: '100,000 ريال',
//             change: '+12%',
//             trend: 'up',
//         },
//         {
//             id: 4,
//             title: 'المدفوعات المتأخرة',
//             value: '25,000 ريال',
//             change: '-3%',
//             trend: 'down',
//         },
//     ];

//     const transactions = [
//         {
//             id: 1,
//             date: '2024-04-25',
//             type: 'إيراد',
//             description: 'رسوم طالب - أحمد محمد',
//             amount: '5,000 ريال',
//             status: 'مكتمل',
//             method: 'تحويل بنكي',
//         },
//         {
//             id: 2,
//             date: '2024-04-24',
//             type: 'مصروف',
//             description: 'رواتب المعلمين',
//             amount: '75,000 ريال',
//             status: 'مكتمل',
//             method: 'تحويل بنكي',
//         },
//         {
//             id: 3,
//             date: '2024-04-23',
//             type: 'إيراد',
//             description: 'رسوم طالب - سارة أحمد',
//             amount: '5,000 ريال',
//             status: 'مكتمل',
//             method: 'بطاقة ائتمان',
//         },
//     ];

//     const columns = [
//         { field: 'date', headerName: 'التاريخ', width: 150 },
//         { field: 'type', headerName: 'النوع', width: 100 },
//         { field: 'description', headerName: 'الوصف', width: 200 },
//         { field: 'amount', headerName: 'المبلغ', width: 150 },
//         { field: 'status', headerName: 'الحالة', width: 100 },
//         { field: 'method', headerName: 'طريقة الدفع', width: 150 },
//     ];

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">الإدارة المالية</h1>
//                 <div className="flex gap-4">
//                     <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
//                         تقرير مالي
//                     </button>
//                     <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
//                         تصدير البيانات
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {financialStats.map(stat => (
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

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//                 <Card title={'الإيرادات حسب المصدر'}>

//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>رسوم الطلاب</span>
//                             <span className="font-medium">70%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>الأنشطة</span>
//                             <span className="font-medium">20%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>مصادر أخرى</span>
//                             <span className="font-medium">10%</span>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={'المصروفات حسب النوع'}>

//                     <div className="space-y-2">
//                         <div className="flex justify-between">
//                             <span>رواتب المعلمين</span>
//                             <span className="font-medium">50%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>المصاريف التشغيلية</span>
//                             <span className="font-medium">30%</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span>مصروفات أخرى</span>
//                             <span className="font-medium">20%</span>
//                         </div>
//                     </div>
//                 </Card>
//                 <Card title={'المدفوعات المتأخرة'}>

//                     <div className="space-y-4">
//                         <div className="p-4 bg-red-50 rounded-md">
//                             <p className="font-medium">5 طلاب متأخرين في السداد</p>
//                             <p className="text-sm text-gray-600">إجمالي المبلغ: 25,000 ريال</p>
//                         </div>
//                         <button className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
//                             إرسال تذكير
//                         </button>
//                     </div>
//                 </Card>
//             </div>

//             <Card title={'آخر المعاملات'}>
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             placeholder={'بحث...'}
//                             className="px-4 py-2 border rounded-md"
//                         />
//                         <select className="px-4 py-2 border rounded-md">
//                             <option value="">جميع الأنواع</option>
//                             <option value="income">إيرادات</option>
//                             <option value="expense">مصروفات</option>
//                         </select>
//                     </div>
//                 </div>
//                 <DataGrid
//                     columns={columns}
//                     rows={transactions}
//                     pageSize={10}
//                     checkboxSelection={true}
//                 />
//             </Card>
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