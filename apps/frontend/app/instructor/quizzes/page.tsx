"use client" 
import React, { useMemo, useState, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { quizApi, courseApi, submissionApi } from '@/lib/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Box, Grid, Typography, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, LinearProgress } from '@mui/material';
import { Add, FileDownload, Edit, Delete } from '@mui/icons-material';
import { motion } from 'framer-motion';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });

const QUESTION_TYPES = [
    { value: 'MULTIPLE_CHOICE', label: 'اختيار من متعدد' },
    { value: 'SHORT_ANSWER', label: 'إجابة قصيرة' },
];

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwnkplp6b';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

export default function InstructorQuizzes() {
    const { user } = useUser();
    const instructorId = user?.id;
    const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({ open: false, msg: '', type: 'success' });
    const queryClient = useQueryClient();
    // Dialogs & Forms
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [quizForm, setQuizForm] = useState<any>({ title: '', courseId: '', timeLimit: '', passingScore: '', status: 'ACTIVE' });
    const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    // إدارة الأسئلة
    const [questions, setQuestions] = useState<any[]>([]);
    const [questionForm, setQuestionForm] = useState<any>({ text: '', type: 'MULTIPLE_CHOICE', options: [''], answer: '' });
    const [editQuestionIndex, setEditQuestionIndex] = useState<number | null>(null);
    // استيراد الأسئلة
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // جلب بيانات الاختبارات
    const { data: quizzesData, isLoading: isQuizzesLoading } = useQuery({
        queryKey: ['instructor-quizzes', instructorId],
        queryFn: () => quizApi.getByInstructor(instructorId),
        enabled: !!instructorId,
        select: (res) => res.data,
    });
    // جلب بيانات الدورات
    const { data: coursesData } = useQuery({
        queryKey: ['instructor-courses', instructorId],
        queryFn: () => courseApi.getByInstructorId(instructorId),
        enabled: !!instructorId,
        select: (res) => res.data,
    });

    // إحصائيات سريعة
    const stats = useMemo(() => {
        if (!quizzesData) return { total: 0, active: 0, avg: '-' };
        const total = quizzesData.length;
        const active = quizzesData.filter((q: any) => q.status === 'ACTIVE' || q.status === 'نشط').length;
        // متوسط الدرجات (من نتائج الطلاب)
        let grades: number[] = [];
        quizzesData.forEach((q: any) => {
            if (q.submissions && q.submissions.length > 0) {
                grades = grades.concat(q.submissions.map((s: any) => s.score || 0));
            }
        });
        const avg = grades.length ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) + '%' : '-';
        return { total, active, avg };
    }, [quizzesData]);

    // الأعمدة
    const columns = [
        { field: 'title', headerName: 'عنوان الاختبار', width: 250 },
        { field: 'course', headerName: 'الدورة', width: 200, valueGetter: (row: any) => coursesData?.find((c: any) => c.id === row.courseId)?.title || '-' },
        { field: 'questions', headerName: 'عدد الأسئلة', width: 100, valueGetter: (row: any) => row.questions?.length || 0 },
        { field: 'duration', headerName: 'المدة (دقيقة)', width: 100, valueGetter: (row: any) => row.timeLimit || '-' },
        { field: 'passingGrade', headerName: 'درجة النجاح', width: 100, valueGetter: (row: any) => row.passingScore || '-' },
        { field: 'status', headerName: 'الحالة', width: 100 },
        { field: 'students', headerName: 'عدد الطلاب', width: 100, valueGetter: (row: any) => row.submissions?.length || 0 },
        { field: 'averageGrade', headerName: 'متوسط الدرجات', width: 100, valueGetter: (row: any) => {
            if (!row.submissions || row.submissions.length === 0) return '-';
            const avg = Math.round(row.submissions.reduce((acc: number, s: any) => acc + (s.score || 0), 0) / row.submissions.length);
            return avg + '%';
        } },
    ];

    // إدارة الأسئلة
    const handleAddQuestion = () => {
        if (!questionForm.text) return setSnackbar({ open: true, msg: 'يرجى إدخال نص السؤال', type: 'error' });
        if (questionForm.type === 'MULTIPLE_CHOICE' && (!questionForm.options || questionForm.options.length < 2)) {
            return setSnackbar({ open: true, msg: 'يجب إدخال خيارين على الأقل', type: 'error' });
        }
        if (editQuestionIndex !== null) {
            // تعديل سؤال
            const updated = [...questions];
            updated[editQuestionIndex] = { ...questionForm };
            setQuestions(updated);
            setEditQuestionIndex(null);
        } else {
            setQuestions([...questions, { ...questionForm }]);
        }
        setQuestionForm({ text: '', type: 'MULTIPLE_CHOICE', options: [''], answer: '' });
    };
    // حذف سؤال
    const handleDeleteQuestion = (idx: number) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };
    // تعديل سؤال
    const handleEditQuestion = (idx: number) => {
        setEditQuestionIndex(idx);
        setQuestionForm({ ...questions[idx] });
    };
    // إضافة خيار
    const handleAddOption = () => {
        setQuestionForm({ ...questionForm, options: [...(questionForm.options || []), ''] });
    };
    // تعديل خيار
    const handleOptionChange = (idx: number, value: string) => {
        const opts = [...(questionForm.options || [])];
        opts[idx] = value;
        setQuestionForm({ ...questionForm, options: opts });
    };
    // حذف خيار
    const handleDeleteOption = (idx: number) => {
        const opts = [...(questionForm.options || [])];
        opts.splice(idx, 1);
        setQuestionForm({ ...questionForm, options: opts });
    };
    // عند فتح Dialog تعديل، جلب الأسئلة من الاختبار
    const handleOpenEdit = (quiz: any) => {
        setEditMode(true);
        setQuizForm({
            id: quiz.id,
            title: quiz.title,
            courseId: quiz.courseId,
            timeLimit: quiz.timeLimit,
            passingScore: quiz.passingScore,
            status: quiz.status,
        });
        setQuestions(quiz.questions || []);
        setDialogOpen(true);
    };
    // عند فتح Dialog إضافة، إعادة تعيين الأسئلة
    const handleOpenAdd = () => {
        setEditMode(false);
        setQuizForm({ title: '', courseId: '', timeLimit: '', passingScore: '', status: 'ACTIVE' });
        setQuestions([]);
        setDialogOpen(true);
    };
    // عند الحفظ، أرسل الأسئلة مع بيانات الاختبار
    const handleSaveQuiz = () => {
        setLoadingAction(true);
        const data = { ...quizForm, questions };
        if (editMode && quizForm.id) {
            editQuizMutation.mutate({ id: quizForm.id, data });
        } else {
            addQuizMutation.mutate(data);
        }
        setLoadingAction(false);
    };

    // Mutations
    const addQuizMutation = useMutation({
        mutationFn: (data: any) => quizApi.create({ ...data, questions: [] }),
        onSuccess: () => {
            setSnackbar({ open: true, msg: 'تم إضافة الاختبار بنجاح!', type: 'success' });
            setDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['instructor-quizzes', instructorId] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء الإضافة!', type: 'error' }),
    });
    const editQuizMutation = useMutation({
        mutationFn: ({ id, data }: any) => quizApi.update(id, data),
        onSuccess: () => {
            setSnackbar({ open: true, msg: 'تم تعديل الاختبار بنجاح!', type: 'success' });
            setDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['instructor-quizzes', instructorId] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء التعديل!', type: 'error' }),
    });

    // رفع الملف على Cloudinary وقراءة الأسئلة
    const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImporting(true);
        setImportProgress(0);
        // رفع الملف
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    setImportProgress(Math.round((event.loaded / event.total) * 100));
                }
            };
            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText);
                    // قراءة الملف من Cloudinary
                    try {
                        const XLSX = (await import('xlsx')).default;
                        const response = await fetch(res.secure_url);
                        const blob = await response.blob();
                        const arrayBuffer = await blob.arrayBuffer();
                        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        // تحويل البيانات إلى أسئلة
                        // توقع: ["النص", "النوع", "الخيارات (مفصولة بفاصلة)", "الإجابة الصحيحة"]
                        const importedQuestions = data.slice(1).map((row: any) => {
                            return {
                                text: row[0] || '',
                                type: row[1] || 'MULTIPLE_CHOICE',
                                options: row[2] ? String(row[2]).split(',').map((s: string) => s.trim()) : [],
                                answer: row[3] || '',
                            };
                        }).filter(q => q.text);
                        setQuestions(prev => [...prev, ...importedQuestions]);
                        setSnackbar({ open: true, msg: 'تم استيراد الأسئلة بنجاح!', type: 'success' });
                        setImportDialogOpen(false);
                    } catch (err) {
                        setSnackbar({ open: true, msg: 'فشل قراءة الملف!', type: 'error' });
                    }
                } else {
                    setSnackbar({ open: true, msg: 'فشل رفع الملف!', type: 'error' });
                }
                setImporting(false);
            };
            xhr.onerror = () => {
                setImporting(false);
                setSnackbar({ open: true, msg: 'حدث خطأ أثناء رفع الملف!', type: 'error' });
            };
            xhr.send(formData);
        } catch (err) {
            setImporting(false);
            setSnackbar({ open: true, msg: 'حدث خطأ أثناء رفع الملف!', type: 'error' });
        }
    };

    return (
        <Box className="container mx-auto px-4 py-8">
            <Suspense fallback={<Skeleton height={40} width={300} />}>
            <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">إدارة الاختبارات</h1>
                    {(user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN') && (
                <div className="flex gap-4">
                            <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
                                إنشاء اختبار جديد
                            </Button>
                            <Button variant="outlined" startIcon={<FileDownload />} onClick={() => setImportDialogOpen(true)}>
                                استيراد أسئلة
                            </Button>
                        </div>
                    )}
                </div>
            </Suspense>

            <Grid container spacing={3} className="mb-8">
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card title="إجمالي الاختبارات">
                            <div className="text-4xl font-bold">{stats.total}</div>
                </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Card title="الاختبارات النشطة">
                            <div className="text-4xl font-bold">{stats.active}</div>
                </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
                        <Card title="متوسط الدرجات">
                            <div className="text-4xl font-bold">{stats.avg}</div>
                </Card>
                    </motion.div>
                </Grid>
            </Grid>

            <Box className="bg-white rounded-xl shadow p-4">
                {isQuizzesLoading ? (
                    <Skeleton height={300} />
                ) : (
            <DataGrid
                columns={columns}
                        rows={quizzesData || []}
                pageSize={10}
                checkboxSelection={true}
            />
                )}
            </Box>

            {/* Dialog إضافة/تعديل اختبار */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editMode ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</DialogTitle>
                <DialogContent>
                    {/* ... نموذج بيانات الاختبار ... */}
                    {/* إدارة الأسئلة */}
                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Typography variant="h6" className="mb-2">الأسئلة</Typography>
                        {questions.length === 0 && <Typography color="text.secondary">لا توجد أسئلة مضافة بعد.</Typography>}
                        <ul className="mb-4">
                            {questions.map((q, idx) => (
                                <li key={idx} className="flex items-center gap-2 mb-2">
                                    <span className="font-bold">{idx + 1}.</span>
                                    <span>{q.text}</span>
                                    <IconButton size="small" color="primary" onClick={() => handleEditQuestion(idx)}><Edit fontSize="small" /></IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(idx)}><Delete fontSize="small" /></IconButton>
                                </li>
                            ))}
                        </ul>
                        <Box className="mb-2">
                            <TextField
                                label="نص السؤال"
                                value={questionForm.text}
                                onChange={e => setQuestionForm({ ...questionForm, text: e.target.value })}
                                fullWidth
                                className="mb-2"
                            />
                            <TextField
                                label="نوع السؤال"
                                value={questionForm.type}
                                onChange={e => setQuestionForm({ ...questionForm, type: e.target.value, options: e.target.value === 'MULTIPLE_CHOICE' ? [''] : [], answer: '' })}
                                select
                                fullWidth
                                className="mb-2"
                            >
                                {QUESTION_TYPES.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                ))}
                            </TextField>
                            {/* خيارات السؤال */}
                            {questionForm.type === 'MULTIPLE_CHOICE' && (
                                <Box className="mb-2">
                                    <Typography variant="body2">الخيارات</Typography>
                                    {questionForm.options?.map((opt: string, idx: number) => (
                                        <Box key={idx} className="flex items-center gap-2 mb-1">
                                            <TextField
                                                value={opt}
                                                onChange={e => handleOptionChange(idx, e.target.value)}
                                                size="small"
                                                label={`خيار ${idx + 1}`}
                                            />
                                            <IconButton size="small" color="error" onClick={() => handleDeleteOption(idx)} disabled={questionForm.options.length <= 1}><Delete fontSize="small" /></IconButton>
                                        </Box>
                                    ))}
                                    <Button onClick={handleAddOption} size="small" variant="outlined" sx={{ mt: 1 }}>إضافة خيار</Button>
                                    <TextField
                                        label="الإجابة الصحيحة"
                                        value={questionForm.answer}
                                        onChange={e => setQuestionForm({ ...questionForm, answer: e.target.value })}
                                        size="small"
                                        fullWidth
                                        className="mt-2"
                                        placeholder="اكتب نص الخيار الصحيح بالضبط"
                                    />
                                </Box>
                            )}
                            {questionForm.type === 'SHORT_ANSWER' && (
                                <TextField
                                    label="الإجابة الصحيحة"
                                    value={questionForm.answer}
                                    onChange={e => setQuestionForm({ ...questionForm, answer: e.target.value })}
                                    size="small"
                                    fullWidth
                                    className="mb-2"
                                />
                            )}
                            <Button onClick={handleAddQuestion} variant="contained" color="primary" sx={{ mt: 2 }}>
                                {editQuestionIndex !== null ? 'حفظ التعديل' : 'إضافة السؤال'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSaveQuiz} variant="contained" color="primary" disabled={loadingAction}>
                        {editMode ? 'حفظ التعديلات' : 'إضافة'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog استيراد الأسئلة */}
            <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
                <DialogTitle>استيراد أسئلة من ملف Excel/CSV</DialogTitle>
                <DialogContent>
                    <Typography className="mb-2">يرجى اختيار ملف Excel أو CSV يحتوي على الأعمدة: نص السؤال، نوع السؤال، الخيارات (مفصولة بفاصلة)، الإجابة الصحيحة.</Typography>
                    <Button variant="outlined" component="label" disabled={importing}>
                        اختر ملف
                        <input type="file" accept=".xlsx,.xls,.csv" hidden ref={fileInputRef} onChange={handleImportFile} />
                    </Button>
                    {importing && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress variant="determinate" value={importProgress} />
                            <Typography variant="caption">جاري رفع الملف... {importProgress}%</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImportDialogOpen(false)}>إلغاء</Button>
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