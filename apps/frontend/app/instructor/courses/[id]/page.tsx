'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });
import { courseApi, fileApi, lessonApi } from '@/lib/api';
import { Course, Lesson, LessonStatus, User, FileType, Quiz, File as FileModel, Enrollment, Submission, Question, Option } from '@shared/prisma';
const QuizDialog = dynamic(() => import('./components/QuizDialog'), { loading: () => <div></div> });
const QuizSubmissions = dynamic(() => import('./components/QuizSubmissions'), { loading: () => <div></div> });
import { useUser } from '@/hooks/useUser';
import { Play, FileText, Image, Music, File, Plus, Eye, Edit, Delete, CheckCircle, X, ChevronDown, ChevronUp, File as FileIcon, Clock, Lock, LockOpen, Video } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwnkplp6b';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

// let initialCourse: Course & {
//     lessons: (Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: (Question & { options: Option[] })[] })[] })[];
//     enrollments: (Enrollment & { user: User })[];
// } = {
//     id: 'js-course-1',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     academyId: 'academy-frontend',
//     title: 'مقدمة في JavaScript',
//     description: 'دورة شاملة للمبتدئين لتعلم أساسيات لغة JavaScript من البداية حتى الاحتراف.',
//     image: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*snTDISrdwI0rjx3xCzQq4Q.jpeg',
//     level: 'BEGINNER',
//     status: 'COMPLETED',
//     lessons: [
//         {
//             id: 'lesson-1',
//             title: 'مقدمة إلى JavaScript',
//             content: 'تعرف في هذه الدرس على تاريخ JavaScript، ولماذا تعتبر من أهم لغات الويب.',
//             files: [
//                 {
//                     id: 'video-1',
//                     name: 'ما هي JavaScript؟',
//                     url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
//                     type: 'VIDEO',
//                     createdAt: new Date(),
//                     lessonId: 'lesson-1',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: 'pdf-1',
//                     name: 'ملف مقدمة',
//                     url: 'https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1214/handouts/01-JavaScript-Intro.pdf',
//                     type: 'PDF',
//                     createdAt: new Date(),
//                     lessonId: 'lesson-1',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 }
//             ],
//             quizzes: [
//                 {
//                     id: 'quiz-1',
//                     title: 'اختبار المقدمة',
//                     description: 'اختبار المقدمة',
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     lessonId: 'lesson-1',
//                     timeLimit: 10,
//                     passingScore: 70,
//                     upComing: false,
//                     isCompleted: true,
//                     submissions: [],
//                     questions: [
//                         {
//                             id: 'question-1',
//                             createdAt: new Date(),
//                             type: 'MULTIPLE_CHOICE',
//                             quizId: 'quiz-1',
//                             text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
//                             options: [
//                                 {
//                                     id: 'option-1',
//                                     text: 'JavaScript',
//                                     isCorrect: true,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                     questionId: 'question-1',
//                                 },
//                                 {
//                                     id: 'option-2',
//                                     text: 'Python',
//                                     isCorrect: false,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                     questionId: 'question-1',
//                                 },
//                                 {
//                                     id: 'option-3',
//                                     text: 'Java',
//                                     isCorrect: false,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                     questionId: 'question-1',
//                                 },
//                                 {
//                                     id: 'option-4',
//                                     text: 'C++',
//                                     isCorrect: false,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                     questionId: 'question-1',
//                                 },
//                             ],
//                             isMultiple: true,
//                             points: 1,
//                             isAnswered: false,
//                         }
//                     ],
//                 }
//             ],
//             status: 'COMPLETED',
//             courseId: 'js-course-1',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: 'lesson-2',
//             title: 'المتغيرات وأنواع البيانات',
//             content: 'ستتعلم أنواع البيانات الأساسية مثل الأرقام، النصوص، البوليان، وكيفية تعريف المتغيرات باستخدام let و const.',
//             files: [
//                 {
//                     id: 'video-2',
//                     name: 'شرح المتغيرات وأنواع البيانات',
//                     url: 'https://www.youtube.com/embed/Bv_5Zv5c-Ts',
//                     type: 'VIDEO',
//                     createdAt: new Date(),
//                     lessonId: 'lesson-2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: 'doc-1',
//                     name: 'توثيق أنواع البيانات',
//                     url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
//                     type: 'DOCUMENT',
//                     createdAt: new Date(),
//                     lessonId: 'lesson-2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: 'audio-1',
//                     name: 'مراجعة صوتية للدرس',
//                     url: 'https://soundcloud.com/user-652361680/js-data-types-overview',
//                     type: 'AUDIO',
//                     createdAt: new Date(),
//                     lessonId: 'lesson-2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: 'pdf-2',
//                     name: 'ملف شرح إضافي',
//                     url: 'https://cs50.harvard.edu/weeks/0/notes/0.pdf',
//                     type: 'PDF',
//                     createdAt: new Date(),
//                     lessonId: 'lesson-2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 }
//             ],
//             quizzes: [
//                 {
//                     id: 'quiz-2',
//                     title: 'اختبار المتغيرات وأنواع البيانات',
//                     description: 'اختبار المتغيرات وأنواع البيانات',
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     lessonId: 'lesson-2',
//                     timeLimit: 10,
//                     passingScore: 70,
//                     upComing: false,
//                     isCompleted: false,
//                     submissions: [],
//                     questions: [
//                         {
//                             id: 'question-2',
//                             createdAt: new Date(),
//                             type: 'MULTIPLE_CHOICE',
//                             quizId: 'quiz-2',
//                             text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
//                             options: [],
//                             isMultiple: true,
//                             points: 1,
//                             isAnswered: false,
//                         }
//                     ],
//                 }
//             ],
//             status: 'IN_PROGRESS',
//             courseId: 'js-course-1',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         },
//         {
//             id: '2',
//             title: 'الدرس الثانية',
//             content: 'هذه هي الدرس الثانية',
//             files: [
//                 {
//                     id: '4',
//                     name: 'الملف الأول',
//                     url: 'https://www.youtube.com/embed/4fRvHVre3n0',
//                     type: 'VIDEO',
//                     createdAt: new Date(),
//                     lessonId: '2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: '5',
//                     name: 'الملف الثاني',
//                     url: 'https://www.google.com',
//                     type: 'IMAGE',
//                     createdAt: new Date(),
//                     lessonId: '2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: '6',
//                     name: 'الملف الثالث',
//                     url: 'https://docs.google.com/document/d/1zgkauCCOCzzUKDgfgyO2SUBQDbWCY9DfIs0Wp4Bs55U/edit?tab=t.0',
//                     type: 'DOCUMENT',
//                     createdAt: new Date(),
//                     lessonId: '2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: '7',
//                     name: 'الملف الثالث',
//                     url: 'https://soundcloud.com/beatlabaudio/stonebank-hard-essentials-vol-1-serum-2-presets?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
//                     type: 'AUDIO',
//                     createdAt: new Date(),
//                     lessonId: '2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 },
//                 {
//                     id: '8',
//                     name: 'الملف الثالث',
//                     url: 'https://drive.uqu.edu.sa/_/yhafeef/files/JAVA%20Basics.pdf',
//                     type: 'PDF',
//                     createdAt: new Date(),
//                     lessonId: '2',
//                     accountingEntryId: null,
//                     prRecordId: null,
//                     meetingId: null,
//                     adminRoleId: null,
//                     legalCaseId: null,
//                 }
//             ],
//             quizzes: [
//                 {
//                     id: 'quiz-3',
//                     title: 'اختبار الدرس الثانية',
//                     description: 'اختبار الدرس الثانية',
//                     createdAt: new Date(),
//                     updatedAt: new Date(),
//                     lessonId: '2',
//                     timeLimit: 10,
//                     passingScore: 70,
//                     upComing: false,
//                     isCompleted: false,
//                     submissions: [],
//                     questions: [
//                         {
//                             id: 'question-3',
//                             createdAt: new Date(),
//                             type: 'MULTIPLE_CHOICE',
//                             quizId: 'quiz-3',
//                             text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
//                             options: [
//                                 {
//                                     id: 'option-1',
//                                     text: 'JavaScript',
//                                     isCorrect: true,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                     questionId: 'question-3',
//                                 },
//                                 {
//                                     id: 'option-2',
//                                     text: 'Python',
//                                     isCorrect: false,
//                                     createdAt: new Date(),
//                                     updatedAt: new Date(),
//                                     questionId: 'question-3',
//                                 },
//                             ],
//                             isMultiple: true,
//                             points: 1,
//                             isAnswered: false,
//                         }
//                     ],
//                 }
//             ],
//             status: 'NOT_STARTED',
//             courseId: '1',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         }],

//     enrollments: [
//         {
//             id: 'enroll-1',
//             userId: 'user-1',
//             courseId: 'js-course-1',
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             status: 'COMPLETED',
//             progress: 100,
//             user: {
//                 id: 'user-1',
//                 role: 'STUDENT',
//                 email: 'student@example.com',
//                 academyId: 'academy-frontend',
//                 createdAt: new Date(),
//                 updatedAt: new Date(),
//                 password: 'password',
//                 phone: '1234567890',
//                 firstName: 'John',
//                 lastName: 'Doe',
//                 age: 20,
//                 subRole: 'STUDENT',
//                 avatar: 'https://via.placeholder.com/150',
//                 isOnline: true,
//                 isVerified: true,
//             }
//         }
//     ]
// };


const InstructorCoursePage = ({ params }: { params: { id: string } }) => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] } | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileModel | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [lsessonStatus, setLsessonStatus] = useState<{ lessonId: string, status: LessonStatus } | null>(null);
    const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});
    const queryClient = useQueryClient();
    const [openQuizDialog, setOpenQuizDialog] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
    const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
    const [lessonEditMode, setLessonEditMode] = useState(false);
    const [lessonForm, setLessonForm] = useState<{ id?: string; title: string; content: string }>({ title: '', content: '' });
    const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; type: 'success' | 'error' }>({ open: false, msg: '', type: 'success' });
    const [loadingAction, setLoadingAction] = useState(false);
    const [fileDialogOpen, setFileDialogOpen] = useState(false);
    const [fileEditMode, setFileEditMode] = useState(false);
    const [fileForm, setFileForm] = useState<{ id?: string; name: string; type: FileType | ''; url: string; lessonId?: string }>({ name: '', type: '', url: '', lessonId: '' });
    const [selectedLessonForFile, setSelectedLessonForFile] = useState<any>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<{ file: FileModel, lesson: any } | null>(null);
    const { user } = useUser();
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState(false);

    const { data: courseResponse, isLoading: isCourseLoading ,refetch:refetchCourse } = useQuery({
        queryKey: ['course', params.id],
        queryFn: () => courseApi.getById(params.id),
    });

    const { data: lessonResponse, isLoading: isLessonLoading,refetch:refetchLesson } = useQuery({
        queryKey: ['lesson', params.id],
        queryFn: () => lessonApi.getById(params.id),
    });

    const toggleLessonStatus = useMutation({
        mutationFn: (lessonId: string) => lessonApi.update(lessonId, { ...selectedLesson!, status: selectedLesson?.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED' as LessonStatus }),
        onSuccess: () => {
            refetchCourse();
            refetchLesson();
            queryClient.invalidateQueries({ queryKey: ['lessons', params.id] });
        },
    });

    const handleLessonExpand = (lessonId: string) => {
        setExpandedLessons(prev => ({
            ...prev,
            [lessonId]: !prev[lessonId]
        }));
    };

    const getFileIcon = (type: FileType) => {
        switch (type) {
            case 'VIDEO':
                return <Play />;
            case 'PDF':
                return <FileText />;
            case 'IMAGE':
                return <Image />;
            case 'AUDIO':
                return <Music />;
            case 'DOCUMENT':
                return <File />;
            default:
                return <File />;
        }
    };

    const renderFilePreview = (file: FileModel) => {
        if (selectedQuiz) {
            return (
                <QuizSubmissions quizId={selectedQuiz} />
            );
        }

        return (
            <>
                <iframe
                    src={file.url}
                    style={{ width: '100%', height: '500px', border: 'none' }}
                    allowFullScreen
                />
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">
                            اختبارات الدرس
                        </h3>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                            onClick={() => setOpenQuizDialog(true)}
                        >
                            <Plus className="h-4 w-4" />
                            إضافة اختبار
                        </button>
                    </div>
                    {selectedLesson?.quizzes && selectedLesson.quizzes.length > 0 ? (
                        <div className="space-y-2">
                            {selectedLesson.quizzes.map((quiz) => (
                                <div key={quiz.id} className="flex items-center justify-between p-3 border rounded">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{quiz.title}</span>
                                        <span className="text-sm text-gray-600">{quiz.description}</span>
                                    </div>
                                    <button
                                        className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
                                        onClick={() => setSelectedQuiz(quiz.id)}
                                    >
                                        عرض النتائج
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded p-4 text-center">
                            لا توجد اختبارات لهذه الدرس
                        </div>
                    )}
                </div>
                <QuizDialog
                    open={openQuizDialog}
                    onClose={() => setOpenQuizDialog(false)}
                    lessonId={params.id}
                />
            </>
        );
    };

    const course = courseResponse?.data ;
    // const lesson = lessonResponse?.data ;

    const addLessonMutation = useMutation({
        mutationFn: (data: any) => lessonApi.create({ ...data, courseId: params.id }),
        onSuccess: () => {
            refetchLesson();
            refetchCourse();
            setSnackbar({ open: true, msg: 'تم إضافة الدرس بنجاح!', type: 'success' });
            setLessonDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء الإضافة!', type: 'error' }),
    });
    const editLessonMutation = useMutation({
        mutationFn: ({ id, data }: any) => lessonApi.update(id, data),
        onSuccess: () => {
            refetchCourse();
            refetchLesson();
            setSnackbar({ open: true, msg: 'تم تعديل الدرس بنجاح!', type: 'success' });
            setLessonDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء التعديل!', type: 'error' }),
    });

    const handleOpenAddLesson = () => {
        setLessonEditMode(false);
        setLessonForm({ title: '', content: '' });
        setLessonDialogOpen(true);
    };
    const handleOpenEditLesson = (lesson: any) => {
        setLessonEditMode(true);
        setLessonForm({ id: lesson.id, title: lesson.title, content: lesson.content });
        setLessonDialogOpen(true);
    };
    const handleSaveLesson = () => {
        setLoadingAction(true);
        if (lessonEditMode && lessonForm.id) {
            editLessonMutation.mutate({ id: lessonForm.id, data: { title: lessonForm.title, content: lessonForm.content } });
        } else {
            addLessonMutation.mutate({ title: lessonForm.title, content: lessonForm.content });
        }
        setLoadingAction(false);
    };

    const addFileMutation = useMutation({
        mutationFn: (data: Partial<FileModel>) => fileApi.create({ ...data, }),
        onSuccess: () => {
            refetchCourse();
            refetchLesson();
            setSnackbar({ open: true, msg: 'تم إضافة الملف بنجاح!', type: 'success' });
            setFileDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء إضافة الملف!', type: 'error' }),
    });
    const editFileMutation = useMutation({
        mutationFn: ({ id, data }: any) => fileApi.update(id, data),
        onSuccess: () => {
            refetchCourse();
            refetchLesson();
            setSnackbar({ open: true, msg: 'تم تعديل الملف بنجاح!', type: 'success' });
            setFileDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء تعديل الملف!', type: 'error' }),
    });

    const handleOpenAddFile = (lesson: any) => {
        setFileEditMode(false);
        setFileForm({ name: '', type: '', url: '', lessonId: lesson.id });
        setSelectedLessonForFile(lesson);
        setFileDialogOpen(true);
    };
    const handleOpenEditFile = (file: any, lesson: any) => {
        setFileEditMode(true);
        setFileForm({ id: file.id, name: file.name, type: file.type, url: file.url, lessonId: lesson.id });
        setSelectedLessonForFile(lesson);
        setFileDialogOpen(true);
    };
    const handleSaveFile = () => {
        setLoadingAction(true);;
        if (fileEditMode && fileForm.id) {

            editFileMutation.mutate({ id: fileForm.id, data: { name: fileForm.name, type: fileForm.type, url: fileForm.type === "VIDEO" ? `https://www.youtube.com/embed/${fileForm.url}` : fileForm.url } });
        } else {
            addFileMutation.mutate({ name: fileForm.name, type: fileForm.type as FileType, url:  fileForm.type === "VIDEO" ? `https://www.youtube.com/embed/${fileForm.url}` : fileForm.url, lessonId: fileForm.lessonId });
        }
        setLoadingAction(false);
    };

    const deleteFileMutation = useMutation({
        mutationFn: (id: string) => fileApi.delete(id),
        onSuccess: () => {
            refetchCourse();
            refetchLesson();
            setSnackbar({ open: true, msg: 'تم حذف الملف بنجاح!', type: 'success' });
            setDeleteDialogOpen(false);
            setFileToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء حذف الملف!', type: 'error' }),
    });
    const handleOpenDeleteFile = (file: FileModel, lesson: any) => {
        setFileToDelete({ file, lesson });
        setDeleteDialogOpen(true);
    };
    const handleConfirmDeleteFile = () => {
        if (fileToDelete?.file?.id) {
            deleteFileMutation.mutate(fileToDelete.file.id);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`);
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    setUploadProgress(Math.round((event.loaded / event.total) * 100));
                }
            };
            xhr.onload = () => {
                setUploading(false);
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText);
                    setFileForm((prev) => ({ ...prev, url: res.secure_url }));
                    setSnackbar({ open: true, msg: 'تم رفع الملف بنجاح!', type: 'success' });
                } else {
                    setSnackbar({ open: true, msg: 'فشل رفع الملف!', type: 'error' });
                }
            };
            xhr.onerror = () => {
                setUploading(false);
                setSnackbar({ open: true, msg: 'حدث خطأ أثناء رفع الملف!', type: 'error' });
            };
            xhr.send(formData);
        } catch (err) {
            setUploading(false);
            setSnackbar({ open: true, msg: 'حدث خطأ أثناء رفع الملف!', type: 'error' });
        }
    };

    const renderUploadedFilePreview = () => {
        if (!fileForm.url) return null;
        switch (fileForm.type) {
            case 'IMAGE':
                return <img src={fileForm.url} alt={fileForm.name} style={{ maxWidth: '100%', maxHeight: 200, margin: '10px 0' }} />;
            case 'PDF':
                return <iframe src={fileForm.url} style={{ width: '100%', height: 300, margin: '10px 0' }} title="pdf-preview" />;
            case 'AUDIO':
                return <audio controls src={fileForm.url} style={{ width: '100%', margin: '10px 0' }} />;
            case 'DOCUMENT':
                return <a href={fileForm.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', margin: '10px 0' }}>معاينة المستند</a>;
            default:
                return null;
        }
    };

    if (isCourseLoading || isLessonLoading) {
        return (
            <div className="space-y-6">
                <Skeleton height={40} width={300} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height={120} />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton height={300} />
                    <Skeleton height={300} />
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>لم يتم العثور على الكورس</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {/* عنوان الكورس */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">
                        {course.title}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                        {course.description}
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* القسم الرئيسي */}
                <div className="md:col-span-4">
                    {/* إحصائيات الكورس */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FileIcon className="h-5 w-5" /> إحصائيات الكورس
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white border rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-2">
                                        عدد الطلاب
                                    </h3>
                                    <p className="text-3xl font-bold">
                                        {course.enrollments?.length || 0}
                                    </p>
                                </div>
                                <div className="bg-white border rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-2">
                                        عدد الدروس
                                    </h3>
                                    <p className="text-3xl font-bold">
                                        {course.lessons.length}
                                    </p>
                                </div>
                                <div className="bg-white border rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-2">
                                        نسبة الإكمال
                                    </h3>
                                    <p className="text-3xl font-bold">
                                        {Math.round((course.lessons.filter(l => l.status === 'COMPLETED').length / course.lessons.length) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* قائمة الدروس */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Video /> الدروس
                                </h3>
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
                                    onClick={handleOpenAddLesson}
                                >
                                    <Plus className="h-4 w-4" />
                                    إضافة درس
                                </button>
                            </div>
                            <div className="space-y-2">
                                {course.lessons.map((lesson) => (
                                    <div key={lesson.id} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Play className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <h4 className="font-semibold">{lesson.title}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {lesson.files?.length || 0} ملفات مرفقة
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                                onClick={() => handleOpenEditLesson(lesson)}
                                            >
                                                تعديل
                                            </button>
                                            <button
                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                onClick={() => toggleLessonStatus.mutate(lesson.id)}
                                            >
                                                {lesson.status === 'COMPLETED' ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                            </button>
                                            <button
                                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                                onClick={() => handleLessonExpand(lesson.id)}
                                            >
                                                {expandedLessons[lesson.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </button>
                                            <button
                                                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                                onClick={() => handleOpenAddFile(lesson)}
                                            >
                                                <Plus className="h-4 w-4" />
                                                ملف جديد
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* القسم الجانبي */}
                <div className="md:col-span-8">
                    <motion.div
                        style={{ position: "sticky", top: "10vh", zIndex: 1000 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* تفاصيل الدرس المحددة */}
                        {selectedLesson && (
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                                {selectedFile && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">
                                            {selectedFile.name}
                                        </h4>
                                        {renderFilePreview(selectedFile)}
                                    </div>
                                )}
                                <h3 className="text-lg font-bold mb-4">
                                    تفاصيل الدرس
                                </h3>
                                <h4 className="text-md font-semibold mb-2">
                                    {selectedLesson.title}
                                </h4>
                                <p className="text-gray-600 mb-4">
                                    {selectedLesson.content}
                                </p>

                                <div className="mt-4">
                                    <h4 className="text-sm font-medium mb-2">
                                        الطلاب الذين شاهدوا الدرس
                                    </h4>
                                    <div className="flex -space-x-2">
                                        {course.enrollments?.slice(0, 4).map((enrollment) => (
                                            <div key={enrollment.user.id} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {enrollment.user?.firstName?.[0]}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* إحصائيات الطلاب */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-bold mb-4">
                                إحصائيات الطلاب
                            </h3>
                            {course.enrollments?.map((enrollment) => (
                                <div key={enrollment.id} className="mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm">
                                            {enrollment.user?.firstName} {enrollment.user?.lastName}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {Math.round(enrollment.progress)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${enrollment.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* نافذة إدارة الدروس */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${openDialog ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">إدارة الدروس</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {course.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 border rounded">
                                <div>
                                    <p className="font-medium">{lesson.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {lesson.status === 'COMPLETED' ? 'مكتملة' : lesson.status === 'IN_PROGRESS' ? "قيد التنفيذ" : "مغلقة"}
                                    </p>
                                </div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={lsessonStatus?.lessonId === lesson.id || lesson.status === 'COMPLETED' || lesson.status === 'IN_PROGRESS'}
                                        onChange={() => {
                                            setLsessonStatus({ lessonId: lesson.id, status: lesson.status === 'COMPLETED' || lesson.status === 'IN_PROGRESS' ? 'NOT_STARTED' : 'COMPLETED' as LessonStatus })
                                            console.log(lsessonStatus)
                                            toggleLessonStatus.mutate(lesson.id)
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm">
                                        {lesson.status === 'COMPLETED' ? 'مفتوحة' : lesson.status === 'IN_PROGRESS' ? "مفتوحة" : 'مغلقة'}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setOpenDialog(false)}
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialog إضافة/تعديل درس */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${lessonDialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <h2 className="text-xl font-bold mb-4">{lessonEditMode ? 'تعديل الدرس' : 'إضافة درس جديد'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">عنوان الدرس</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={lessonForm.title}
                                onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">محتوى الدرس</label>
                            <textarea
                                className="w-full border rounded p-2 min-h-[100px]"
                                value={lessonForm.content}
                                onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setLessonDialogOpen(false)}
                        >
                            إلغاء
                        </button>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleSaveLesson}
                            disabled={loadingAction}
                        >
                            {lessonEditMode ? 'حفظ التعديلات' : 'إضافة'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialog إضافة/تعديل ملف */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${fileDialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                    <h2 className="text-xl font-bold mb-4">{fileEditMode ? 'تعديل الملف' : 'إضافة ملف جديد'}</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">اسم الملف</label>
                            <input
                                type="text"
                                className="w-full border rounded p-2"
                                value={fileForm.name}
                                onChange={e => setFileForm({ ...fileForm, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">نوع الملف</label>
                            <select
                                className="w-full border rounded p-2"
                                value={fileForm.type}
                                onChange={e => setFileForm({ ...fileForm, type: e.target.value as FileType, url: '' })}
                            >
                                <option value="VIDEO">فيديو (رابط يوتيوب)</option>
                                <option value="PDF">PDF</option>
                                <option value="DOCUMENT">مستند</option>
                                <option value="IMAGE">صورة</option>
                                <option value="AUDIO">صوتي</option>
                            </select>
                        </div>
                        {/* رفع ملف حقيقي إذا لم يكن فيديو */}
                        {fileForm.type && fileForm.type !== 'VIDEO' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">اختر ملف للرفع</label>
                                <input
                                    type="file"
                                    accept={
                                        fileForm.type === 'PDF' ? 'application/pdf' :
                                        fileForm.type === 'IMAGE' ? 'image/*' :
                                        fileForm.type === 'AUDIO' ? 'audio/*' :
                                        fileForm.type === 'DOCUMENT' ? '.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.csv,.odt,.ods' :
                                        '*/*'
                                    }
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                    onChange={handleFileUpload}
                                />
                                {uploading && (
                                    <div className="w-full mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-700 mt-1">{uploadProgress}%</p>
                                    </div>
                                )}
                                {renderUploadedFilePreview()}
                            </div>
                        )}
                        {/* إدخال رابط للفيديو فقط */}
                        {fileForm.type === 'VIDEO' && (
                            <div>
                                <label className="block text-sm font-medium mb-2">ID الفيديو (YouTube Embed)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2"
                                    value={fileForm.url}
                                    onChange={e => setFileForm({ ...fileForm, url: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setFileDialogOpen(false)}
                        >
                            إلغاء
                        </button>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleSaveFile}
                            disabled={Boolean(loadingAction || uploading || (fileForm.type && fileForm.type !== 'VIDEO' && !fileForm.url))}
                        >
                            {fileEditMode ? 'حفظ التعديلات' : 'إضافة'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Dialog تأكيد حذف الملف */}
            <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ${deleteDialogOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                    <h2 className="text-xl font-bold mb-4">تأكيد حذف الملف</h2>
                    <div className="py-4">
                        <p>هل أنت متأكد أنك تريد حذف هذا الملف؟ لا يمكن التراجع عن هذه العملية.</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            إلغاء
                        </button>
                        <button
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            onClick={handleConfirmDeleteFile}
                            disabled={deleteFileMutation.isPending}
                        >
                            حذف
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
};

export default InstructorCoursePage; 