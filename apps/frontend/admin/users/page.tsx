// "use client"
// import React from 'react';
// import Card from '@/components/common/Card';
// import DataGrid from '@/components/common/DataGrid';
// import ActionButtons from '@/components/common/ActionButtons';

// export default function AdminUsers() {

//     const users = [
//         {
//             id: 1,
//             name: 'أحمد محمد',
//             email: 'ahmed@example.com',
//             role: 'طالب',
//             grade: 'الصف الثالث',
//             status: 'نشط',
//             joinDate: '2024-01-15',
//         },
//         {
//             id: 2,
//             name: 'أ. سارة خالد',
//             email: 'sara@example.com',
//             role: 'معلم',
//             subject: 'اللغة العربية',
//             status: 'نشط',
//             joinDate: '2023-09-01',
//         },
//         {
//             id: 3,
//             name: 'محمد أحمد',
//             email: 'mohamed@example.com',
//             role: 'ولي أمر',
//             children: '2',
//             status: 'نشط',
//             joinDate: '2024-02-20',
//         },
//     ];

//     const columns = [
//         { field: 'name', headerName: 'الاسم', width: 150 },
//         { field: 'email', headerName: 'البريد الإلكتروني', width: 200 },
//         { field: 'role', headerName: 'الدور', width: 100 },
//         { field: 'status', headerName: 'الحالة', width: 100 },
//         { field: 'joinDate', headerName: 'تاريخ الانضمام', width: 150 },
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
//                     onEdit={() => console.log('Edit user:', params.row)}
//                     onDelete={() => console.log('Delete user:', params.row)}
//                 />
//             ),
//         },
//     ];

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
//                 <div className="flex gap-4">
//                     <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600">
//                         إضافة مستخدم
//                     </button>
//                     <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">
//                         تصدير البيانات
//                     </button>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                 <Card title="إجمالي المستخدمين">
//                     <div className="text-4xl font-bold">1,250</div>
//                     <p className="text-green-500">+5% عن الشهر الماضي</p>
//                 </Card>
//                 <Card title="المستخدمين النشطين">
//                     <div className="text-4xl font-bold">1,100</div>
//                     <p className="text-green-500">+3% عن الشهر الماضي</p>
//                 </Card>
//                 <Card title="طلبات التسجيل الجديدة">
//                     <div className="text-4xl font-bold">25</div>
//                     <p className="text-blue-500">5 طلبات في الانتظار</p>
//                 </Card>
//             </div>

//             <Card title="قائمة المستخدمين">
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             placeholder="بحث..."
//                             className="px-4 py-2 border rounded-md"
//                         />
//                         <select className="px-4 py-2 border rounded-md">
//                             <option value="">جميع الأدوار</option>
//                             <option value="student">طلاب</option>
//                             <option value="teacher">معلمون</option>
//                             <option value="parent">أولياء أمور</option>
//                         </select>
//                     </div>
//                 </div>
//                 <DataGrid
//                     columns={columns}
//                     rows={users}
//                     pageSize={10}
//                     checkboxSelection={true}
//                 />
//             </Card>

//             <div className="mt-8">
//                 <h2 className="text-2xl font-semibold mb-4">إحصائيات المستخدمين</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Card title="توزيع المستخدمين حسب الدور">
//                         <div className="space-y-2">
//                             <div className="flex justify-between">
//                                 <span>طلاب</span>
//                                 <span className="font-medium">60%</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span>معلمون</span>
//                                 <span className="font-medium">20%</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span>أولياء أمور</span>
//                                 <span className="font-medium">20%</span>
//                             </div>
//                         </div>
//                     </Card>
//                     <Card title="نشاط المستخدمين">
//                         <div className="space-y-2">
//                             <div className="flex justify-between">
//                                 <span>مستخدمون نشطون اليوم</span>
//                                 <span className="font-medium">850</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span>مستخدمون جدد هذا الشهر</span>
//                                 <span className="font-medium">125</span>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span>مستخدمون غير نشطين</span>
//                                 <span className="font-medium">150</span>
//                             </div>
//                         </div>
//                     </Card>
//                 </div>
//             </div>
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