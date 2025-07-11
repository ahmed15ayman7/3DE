"use client"
import React, { useMemo, useState, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { enrollmentApi, courseApi, userApi } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Download, Edit, Delete, Eye } from 'lucide-react';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });

export default function InstructorStudents() {
    const { user } = useUser();
    const instructorId = user?.id;
    const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({ open: false, msg: '', type: 'success' });
    const queryClient = useQueryClient();

    // جلب بيانات الدورات للمحاضر
    const { data: coursesData } = useQuery({
        queryKey: ['instructor-courses', instructorId],
        queryFn: () => courseApi.getByInstructorId(instructorId),
        enabled: !!instructorId,
        select: (res) => res.data,
    });
    // جلب بيانات الطلاب (الملتحقين بدورات المحاضر)
    const { data: enrollmentsData, isLoading: isStudentsLoading } = useQuery({
        queryKey: ['instructor-students', instructorId],
        queryFn: async () => {
            if (!coursesData) return [];
            // اجمع كل الطلاب من جميع الدورات
            const all = await Promise.all(
                coursesData.map((course: any) => courseApi.getStudents(course.id))
            );
            // دمج النتائج في مصفوفة واحدة
            return all.flatMap((res: any) => res.data || []);
        },
        enabled: !!coursesData,
    });

    // بحث وتصفية
    const [search, setSearch] = useState('');
    const [courseFilter, setCourseFilter] = useState('');

    // تجهيز بيانات الطلاب للجدول مع البحث والتصفية
    const students = useMemo(() => {
        if (!enrollmentsData) return [];
        let filtered = enrollmentsData.map((enrollment: any) => ({
            id: enrollment.user?.id,
            enrollmentId: enrollment.id,
            name: `${enrollment.user?.firstName || ''} ${enrollment.user?.lastName || ''}`.trim(),
            email: enrollment.user?.email,
            course: coursesData?.find((c: any) => c.id === enrollment.courseId)?.title || '-',
            courseId: enrollment.courseId,
            progress: Math.round(enrollment.progress || 0),
            lastActivity: enrollment.updatedAt ? enrollment.updatedAt.split('T')[0] : '-',
            grade: enrollment.grade ? `${enrollment.grade}%` : '-',
        }));
        if (search) {
            filtered = filtered.filter(s =>
                s.name.includes(search) ||
                s.email?.includes(search) ||
                s.course?.includes(search)
            );
        }
        if (courseFilter) {
            filtered = filtered.filter(s => s.course === courseFilter);
        }
        return filtered;
    }, [enrollmentsData, coursesData, search, courseFilter]);

    // إحصائيات سريعة
    const stats = useMemo(() => {
        if (!students.length) return { total: 0, avgProgress: '-', avgGrade: '-' };
        const total = students.length;
        const avgProgress = Math.round(students.reduce((acc, s) => acc + (s.progress || 0), 0) / total) + '%';
        const validGrades = students.filter(s => s.grade && s.grade !== '-');
        const avgGrade = validGrades.length ? Math.round(validGrades.reduce((acc, s) => acc + parseInt(s.grade), 0) / validGrades.length) + '%' : '-';
        return { total, avgProgress, avgGrade };
    }, [students]);

    // Dialogs & Forms
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [studentForm, setStudentForm] = useState<any>({ name: '', email: '', course: '', progress: '', grade: '' });
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    // فتح Dialog إضافة
    const handleOpenAdd = () => {
        setEditMode(false);
        setStudentForm({ name: '', email: '', course: '', progress: '', grade: '' });
        setDialogOpen(true);
    };
    // فتح Dialog تعديل
    const handleOpenEdit = (student: any) => {
        setEditMode(true);
        setStudentForm({ ...student });
        setDialogOpen(true);
    };
    // فتح Dialog حذف
    const handleOpenDelete = (student: any) => {
        setSelectedStudent(student);
        setDeleteDialogOpen(true);
    };
    // فتح Dialog تفاصيل
    const handleOpenDetails = (student: any) => {
        setSelectedStudent(student);
        setDetailsDialogOpen(true);
    };
    // إضافة طالب جديد فعلياً
    const handleSaveStudent = async () => {
        try {
            if (!studentForm.name || !studentForm.email || !studentForm.course) {
                setSnackbar({ open: true, msg: 'يرجى تعبئة جميع الحقول', type: 'error' });
                return;
            }
            const courseObj = coursesData.find((c: any) => c.title === studentForm.course);
            if (!courseObj) {
                setSnackbar({ open: true, msg: 'الدورة غير موجودة', type: 'error' });
                return;
            }
            let userId = null;
            if (!editMode) {
                // تحقق إذا كان المستخدم موجود مسبقاً
                let user = null;
                // جلب كل الطلاب ثم البحث بالإيميل
                const allUsers = enrollmentsData?.map((en: any) => en.user) || [];
                user = allUsers.find((u: any) => u?.email === studentForm.email);
                if (!user) {
                    setSnackbar({ open: true, msg: 'الطالب غير موجود', type: 'error' });
                    return;
                }
                userId = user.id;

                await enrollmentApi.create({ userId, courseId: courseObj.id });
                setSnackbar({ open: true, msg: 'تم إضافة الطالب بنجاح', type: 'success' });
            } else {
                // تعديل بيانات الطالب (الاسم/الإيميل)
                await userApi.updateProfile({
                    firstName: studentForm.name.split(' ')[0],
                    lastName: studentForm.name.split(' ').slice(1).join(' '),
                    email: studentForm.email,
                });
                // تعديل التقدم فقط (بدون grade)
                await enrollmentApi.update(selectedStudent.enrollmentId, {
                    progress: Number(studentForm.progress),
                });
                setSnackbar({ open: true, msg: 'تم تعديل بيانات الطالب', type: 'success' });
            }
            setDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['instructor-students', instructorId] });
        } catch (e) {
            setSnackbar({ open: true, msg: 'حدث خطأ أثناء الحفظ', type: 'error' });
        }
    };
    // حذف طالب فعلياً
    const handleConfirmDelete = async () => {
        try {
            await enrollmentApi.delete(selectedStudent.enrollmentId);
            setSnackbar({ open: true, msg: 'تم حذف الطالب بنجاح', type: 'success' });
            setDeleteDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['instructor-students', instructorId] });
        } catch (e) {
            setSnackbar({ open: true, msg: 'حدث خطأ أثناء الحذف', type: 'error' });
        }
    };

    // الأعمدة مع إجراءات
    const columns = [
        { field: 'name', headerName: 'اسم الطالب', width: 200 },
        { field: 'email', headerName: 'البريد الإلكتروني', width: 200 },
        { field: 'course', headerName: 'الدورة', width: 200 },
        { field: 'progress', headerName: 'التقدم', width: 100 },
        { field: 'lastActivity', headerName: 'آخر نشاط', width: 150 },
        { field: 'grade', headerName: 'الدرجة', width: 100 },
        {
            field: 'actions',
            headerName: 'إجراءات',
            width: 120,
            renderCell: (params: any) => (
                (user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                    <div className="flex gap-1">
                        <button
                            className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                            onClick={() => handleOpenDetails(params.row)}
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                        <button
                            className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                            onClick={() => handleOpenEdit(params.row)}
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                        <button
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            onClick={() => handleOpenDelete(params.row)}
                        >
                            <Delete className="h-4 w-4" />
                        </button>
                    </div>
                )
            ),
        },
    ];

    // تصدير البيانات إلى Excel
    const handleExportExcel = async () => {
        if (!students.length) return setSnackbar({ open: true, msg: 'لا توجد بيانات للتصدير', type: 'error' });
        const XLSX = (await import('xlsx')).default;
        const exportData = students.map(({ id, ...rest }) => rest); // بدون id
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'الطلاب');
        XLSX.writeFile(wb, `طلاب_المحاضر_${new Date().toISOString().split('T')[0]}.xlsx`);
        setSnackbar({ open: true, msg: 'تم تصدير البيانات بنجاح', type: 'success' });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* العنوان والإحصائيات */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">إدارة الطلاب</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">إجمالي الطلاب</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">متوسط التقدم</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.avgProgress}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">متوسط الدرجات</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.avgGrade}</p>
                    </div>
                </div>
            </div>

            {/* أدوات البحث والتصفية */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">البحث</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="البحث بالاسم أو الإيميل أو الدورة..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">تصفية بالدورة</label>
                        <select
                            className="w-full border rounded p-2"
                            value={courseFilter}
                            onChange={e => setCourseFilter(e.target.value)}
                        >
                            <option value="">جميع الدورات</option>
                            {coursesData?.map((course: any) => (
                                <option key={course.id} value={course.title}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                            onClick={handleExportExcel}
                        >
                            <Download className="h-4 w-4" />
                            تصدير Excel
                        </button>
                    </div>
                </div>
            </div>

            {/* جدول الطلاب */}
            {isStudentsLoading ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <Skeleton variant="rectangular" height={400} />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <DataGrid
                        columns={columns}
                        rows={students}
                        pageSize={10}
                        checkboxSelection={false}
                    />
                </div>
            )}

            {/* Dialog إضافة/تعديل طالب */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${dialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h2 className="text-xl font-bold mb-4">{editMode ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">اسم الطالب</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={studentForm.name}
                                onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                className="w-full border rounded p-2"
                                value={studentForm.email}
                                onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">الدورة</label>
                            <select
                                className="w-full border rounded p-2"
                                value={studentForm.course}
                                onChange={e => setStudentForm({ ...studentForm, course: e.target.value })}
                            >
                                <option value="">اختر الدورة</option>
                                {coursesData?.map((course: any) => (
                                    <option key={course.id} value={course.title}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">التقدم (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full border rounded p-2"
                                value={studentForm.progress}
                                onChange={e => setStudentForm({ ...studentForm, progress: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setDialogOpen(false)}
                        >
                            إلغاء
                        </button>
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            onClick={handleSaveStudent}
                        >
                            {editMode ? 'حفظ التعديلات' : 'إضافة الطالب'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialog حذف طالب */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${deleteDialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h2 className="text-xl font-bold mb-4">تأكيد الحذف</h2>
                    <p className="mb-6">هل أنت متأكد من حذف الطالب "{selectedStudent?.name}"؟</p>
                    <div className="flex justify-end gap-2">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            إلغاء
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleConfirmDelete}
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialog تفاصيل الطالب */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${detailsDialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h2 className="text-xl font-bold mb-4">تفاصيل الطالب</h2>
                    {selectedStudent && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium">الاسم</label>
                                <p className="text-gray-700">{selectedStudent.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">البريد الإلكتروني</label>
                                <p className="text-gray-700">{selectedStudent.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">الدورة</label>
                                <p className="text-gray-700">{selectedStudent.course}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">التقدم</label>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${selectedStudent.progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{selectedStudent.progress}%</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">آخر نشاط</label>
                                <p className="text-gray-700">{selectedStudent.lastActivity}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">الدرجة</label>
                                <p className="text-gray-700">{selectedStudent.grade}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setDetailsDialogOpen(false)}
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>

            {/* Snackbar */}
            {snackbar.open && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className={`rounded border px-4 py-3 shadow-lg ${snackbar.type === "error" ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}`}>
                        <p className={`font-bold ${snackbar.type === "error" ? "text-red-700" : "text-green-700"}`}>
                            {snackbar.msg}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 