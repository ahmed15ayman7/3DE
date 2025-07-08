"use client"
import React, { useMemo, useState, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { enrollmentApi, courseApi, userApi } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Grid, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { Add, FileDownload, Edit, Delete, Visibility } from '@mui/icons-material';
import { motion } from 'framer-motion';

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
                    <>
                        <IconButton color="info" onClick={() => handleOpenDetails(params.row)}><Visibility /></IconButton>
                        <IconButton color="primary" onClick={() => handleOpenEdit(params.row)}><Edit /></IconButton>
                        <IconButton color="error" onClick={() => handleOpenDelete(params.row)}><Delete /></IconButton>
                    </>
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
        XLSX.writeFile(wb, 'students.xlsx');
        setSnackbar({ open: true, msg: 'تم تصدير البيانات بنجاح!', type: 'success' });
    };

    return (
        <Box className="container mx-auto px-4 py-8">
            <Suspense fallback={<Skeleton height={40} width={300} />}>
            <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">الطلاب</h1>
                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                <div className="flex gap-4">
                            <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
                                إضافة طالب
                            </Button>
                            <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExportExcel}>
                                تصدير البيانات
                            </Button>
                        </div>
                    )}
                </div>
            </Suspense>
            <Grid container spacing={3} className="mb-8">
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card title="إجمالي الطلاب">
                            <div className="text-4xl font-bold">{stats.total}</div>
                </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Card title="متوسط التقدم">
                            <div className="text-4xl font-bold">{stats.avgProgress}</div>
                </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                        <Card title="متوسط الدرجات">
                            <div className="text-4xl font-bold">{stats.avgGrade}</div>
                </Card>
                    </motion.div>
                </Grid>
            </Grid>
            <Box className="bg-white rounded-xl shadow p-4">
                {isStudentsLoading ? (
                    <Skeleton height={300} />
                ) : (
                    <>
                        <Box className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <TextField
                                label="بحث بالاسم أو البريد أو الدورة"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full md:w-1/3"
                            />
                            <TextField
                                label="تصفية حسب الدورة"
                                value={courseFilter}
                                onChange={e => setCourseFilter(e.target.value)}
                                select
                                className="w-full md:w-1/4"
                            >
                                <MenuItem value="">الكل</MenuItem>
                                {coursesData?.map((course: any) => (
                                    <MenuItem key={course.id} value={course.title}>{course.title}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
            <DataGrid
                columns={columns}
                rows={students}
                pageSize={10}
                checkboxSelection={true}
            />
                    </>
                )}
            </Box>
            {/* Dialog إضافة/تعديل طالب */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'تعديل الطالب' : 'إضافة طالب جديد'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="اسم الطالب"
                        value={studentForm.name}
                        onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="البريد الإلكتروني"
                        value={studentForm.email}
                        onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="الدورة"
                        value={studentForm.course}
                        onChange={e => setStudentForm({ ...studentForm, course: e.target.value })}
                        select
                        fullWidth
                        className="mb-4"
                    >
                        {coursesData?.map((course: any) => (
                            <MenuItem key={course.id} value={course.title}>{course.title}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="التقدم (%)"
                        value={studentForm.progress}
                        onChange={e => setStudentForm({ ...studentForm, progress: e.target.value })}
                        type="number"
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="الدرجة (%)"
                        value={studentForm.grade}
                        onChange={e => setStudentForm({ ...studentForm, grade: e.target.value })}
                        type="number"
                        fullWidth
                        className="mb-4"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSaveStudent} variant="contained" color="primary">
                        {editMode ? 'حفظ التعديلات' : 'إضافة'}
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Dialog تأكيد حذف */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>تأكيد حذف الطالب</DialogTitle>
                <DialogContent>
                    <Typography>هل أنت متأكد أنك تريد حذف هذا الطالب؟ لا يمكن التراجع عن هذه العملية.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Dialog تفاصيل الطالب */}
            <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>تفاصيل الطالب</DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Box>
                            <Typography variant="h6">{selectedStudent.name}</Typography>
                            <Typography color="text.secondary">{selectedStudent.email}</Typography>
                            <Typography>الدورة: {selectedStudent.course}</Typography>
                            <Typography>التقدم: {selectedStudent.progress}%</Typography>
                            <Typography>الدرجة: {selectedStudent.grade}</Typography>
                            <Typography>آخر نشاط: {selectedStudent.lastActivity}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsDialogOpen(false)}>إغلاق</Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </Box>
    );
} 