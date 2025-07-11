"use client" 
import React, { useMemo, useState, Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { quizApi, courseApi, submissionApi } from '@/lib/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Download, Edit, Delete } from 'lucide-react';

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
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setImportProgress(progress);
                }
            };
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    // هنا يمكن إضافة منطق قراءة الملف واستخراج الأسئلة
                    setSnackbar({ open: true, msg: 'تم رفع الملف بنجاح!', type: 'success' });
                } else {
                    setSnackbar({ open: true, msg: 'فشل في رفع الملف!', type: 'error' });
                }
                setImporting(false);
            };
            xhr.onerror = () => {
                setSnackbar({ open: true, msg: 'فشل في رفع الملف!', type: 'error' });
                setImporting(false);
            };
            xhr.send(formData);
        } catch (error) {
            setSnackbar({ open: true, msg: 'فشل في رفع الملف!', type: 'error' });
            setImporting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* العنوان والإحصائيات */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">إدارة الاختبارات</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">إجمالي الاختبارات</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">الاختبارات النشطة</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-2">متوسط الدرجات</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.avg}</p>
                    </div>
                </div>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">الاختبارات</h2>
                <div className="flex gap-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                        onClick={() => setImportDialogOpen(true)}
                    >
                        <Download className="h-4 w-4" />
                        استيراد
                    </button>
                    <button
                        className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                        onClick={handleOpenAdd}
                    >
                        <Plus className="h-4 w-4" />
                        إضافة اختبار
                    </button>
                </div>
            </div>

            {/* جدول الاختبارات */}
            {isQuizzesLoading ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <Skeleton variant="rectangular" height={400} />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <DataGrid
                        columns={columns}
                        rows={quizzesData || []}
                        pageSize={10}
                        checkboxSelection={false}
                    />
                </div>
            )}

            {/* Dialog إضافة/تعديل اختبار */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${dialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">{editMode ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">عنوان الاختبار</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={quizForm.title}
                                onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">الدورة</label>
                            <select
                                className="w-full border rounded p-2"
                                value={quizForm.courseId}
                                onChange={e => setQuizForm({ ...quizForm, courseId: e.target.value })}
                            >
                                <option value="">اختر الدورة</option>
                                {coursesData?.map((course: any) => (
                                    <option key={course.id} value={course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">المدة (دقيقة)</label>
                            <input
                                type="number"
                                className="w-full border rounded p-2"
                                value={quizForm.timeLimit}
                                onChange={e => setQuizForm({ ...quizForm, timeLimit: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">درجة النجاح</label>
                            <input
                                type="number"
                                className="w-full border rounded p-2"
                                value={quizForm.passingScore}
                                onChange={e => setQuizForm({ ...quizForm, passingScore: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* إدارة الأسئلة */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-bold mb-4">الأسئلة</h3>
                        
                        {/* إضافة سؤال جديد */}
                        <div className="bg-gray-50 p-4 rounded mb-4">
                            <h4 className="font-semibold mb-3">{editQuestionIndex !== null ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">نص السؤال</label>
                                    <textarea
                                        className="w-full border rounded p-2"
                                        rows={2}
                                        value={questionForm.text}
                                        onChange={e => setQuestionForm({ ...questionForm, text: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">نوع السؤال</label>
                                    <select
                                        className="w-full border rounded p-2"
                                        value={questionForm.type}
                                        onChange={e => setQuestionForm({ ...questionForm, type: e.target.value })}
                                    >
                                        {QUESTION_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {questionForm.type === 'MULTIPLE_CHOICE' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">الخيارات</label>
                                        {questionForm.options?.map((option: string, idx: number) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 border rounded p-2"
                                                    value={option}
                                                    onChange={e => handleOptionChange(idx, e.target.value)}
                                                    placeholder={`الخيار ${idx + 1}`}
                                                />
                                                <button
                                                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                                    onClick={() => handleDeleteOption(idx)}
                                                >
                                                    <Delete className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                                            onClick={handleAddOption}
                                        >
                                            إضافة خيار
                                        </button>
                                    </div>
                                )}
                                
                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        onClick={handleAddQuestion}
                                    >
                                        {editQuestionIndex !== null ? 'حفظ التعديل' : 'إضافة السؤال'}
                                    </button>
                                    {editQuestionIndex !== null && (
                                        <button
                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                            onClick={() => {
                                                setEditQuestionIndex(null);
                                                setQuestionForm({ text: '', type: 'MULTIPLE_CHOICE', options: [''], answer: '' });
                                            }}
                                        >
                                            إلغاء
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* قائمة الأسئلة */}
                        <div className="space-y-2">
                            {questions.map((question, idx) => (
                                <div key={idx} className="border rounded p-3 bg-white">
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-medium">{idx + 1}. {question.text}</h5>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                                                onClick={() => handleEditQuestion(idx)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                                onClick={() => handleDeleteQuestion(idx)}
                                            >
                                                <Delete className="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">النوع: {QUESTION_TYPES.find(t => t.value === question.type)?.label}</p>
                                    {question.type === 'MULTIPLE_CHOICE' && question.options && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">الخيارات:</p>
                                            <ul className="list-disc list-inside text-sm">
                                                {question.options.map((option: string, optIdx: number) => (
                                                    <li key={optIdx}>{option}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
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
                            onClick={handleSaveQuiz}
                            disabled={loadingAction}
                        >
                            {editMode ? 'حفظ التعديلات' : 'إضافة الاختبار'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialog استيراد الملفات */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${importDialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h2 className="text-xl font-bold mb-4">استيراد الأسئلة</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">اختر ملف Excel أو CSV</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="w-full border rounded p-2"
                                onChange={handleImportFile}
                            />
                        </div>
                        {importing && (
                            <div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${importProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">جاري الرفع... {importProgress}%</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setImportDialogOpen(false)}
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