'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div></div> });
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Button,
    Chip,
    Avatar,
    AvatarGroup,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Divider,
    Card,
    CardContent,
    LinearProgress,
    Collapse,
    ListItemButton,
    Alert,
    TextField,
    CircularProgress,
    Snackbar,
    MenuItem,
} from '@mui/material';
import {
    PlayCircleOutline,
    AccessTime,
    School,
    Person,
    VideoLibrary,
    Description,
    Lock,
    LockOpen,
    Visibility,
    Edit,
    Delete,
    CheckCircle,
    Cancel,
    ExpandLess,
    ExpandMore,
    PictureAsPdf,
    Image,
    AudioFile,
    Description as DescriptionIcon,
    VideoFile,
    Add,
} from '@mui/icons-material';
import { courseApi, lessonApi } from '@/lib/api';
import { Course, Lesson, LessonStatus, User, FileType, Quiz, File as FileModel, Enrollment, Submission, Question, Option } from '@shared/prisma';
const QuizDialog = dynamic(() => import('./components/QuizDialog'), { loading: () => <div></div> });
const QuizSubmissions = dynamic(() => import('./components/QuizSubmissions'), { loading: () => <div></div> });
import MuiAlert from '@mui/material/Alert';
import { useUser } from '@/hooks/useUser';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwnkplp6b';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

let initialCourse: Course & {
    lessons: (Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: (Question & { options: Option[] })[] })[] })[];
    enrollments: (Enrollment & { user: User })[];
} = {
    id: 'js-course-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    academyId: 'academy-frontend',
    title: 'مقدمة في JavaScript',
    description: 'دورة شاملة للمبتدئين لتعلم أساسيات لغة JavaScript من البداية حتى الاحتراف.',
    image: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*snTDISrdwI0rjx3xCzQq4Q.jpeg',
    level: 'BEGINNER',
    status: 'COMPLETED',
    lessons: [
        {
            id: 'lesson-1',
            title: 'مقدمة إلى JavaScript',
            content: 'تعرف في هذه الدرس على تاريخ JavaScript، ولماذا تعتبر من أهم لغات الويب.',
            files: [
                {
                    id: 'video-1',
                    name: 'ما هي JavaScript؟',
                    url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
                    type: 'VIDEO',
                    createdAt: new Date(),
                    lessonId: 'lesson-1',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: 'pdf-1',
                    name: 'ملف مقدمة',
                    url: 'https://web.stanford.edu/class/archive/cs/cs106a/cs106a.1214/handouts/01-JavaScript-Intro.pdf',
                    type: 'PDF',
                    createdAt: new Date(),
                    lessonId: 'lesson-1',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                }
            ],
            quizzes: [
                {
                    id: 'quiz-1',
                    title: 'اختبار المقدمة',
                    description: 'اختبار المقدمة',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lessonId: 'lesson-1',
                    timeLimit: 10,
                    passingScore: 70,
                    upComing: false,
                    isCompleted: true,
                    submissions: [],
                    questions: [
                        {
                            id: 'question-1',
                            createdAt: new Date(),
                            type: 'MULTIPLE_CHOICE',
                            quizId: 'quiz-1',
                            text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
                            options: [
                                {
                                    id: 'option-1',
                                    text: 'JavaScript',
                                    isCorrect: true,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    questionId: 'question-1',
                                },
                                {
                                    id: 'option-2',
                                    text: 'Python',
                                    isCorrect: false,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    questionId: 'question-1',
                                },
                                {
                                    id: 'option-3',
                                    text: 'Java',
                                    isCorrect: false,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    questionId: 'question-1',
                                },
                                {
                                    id: 'option-4',
                                    text: 'C++',
                                    isCorrect: false,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    questionId: 'question-1',
                                },
                            ],
                            isMultiple: true,
                            points: 1,
                            isAnswered: false,
                        }
                    ],
                }
            ],
            status: 'COMPLETED',
            courseId: 'js-course-1',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 'lesson-2',
            title: 'المتغيرات وأنواع البيانات',
            content: 'ستتعلم أنواع البيانات الأساسية مثل الأرقام، النصوص، البوليان، وكيفية تعريف المتغيرات باستخدام let و const.',
            files: [
                {
                    id: 'video-2',
                    name: 'شرح المتغيرات وأنواع البيانات',
                    url: 'https://www.youtube.com/embed/Bv_5Zv5c-Ts',
                    type: 'VIDEO',
                    createdAt: new Date(),
                    lessonId: 'lesson-2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: 'doc-1',
                    name: 'توثيق أنواع البيانات',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures',
                    type: 'DOCUMENT',
                    createdAt: new Date(),
                    lessonId: 'lesson-2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: 'audio-1',
                    name: 'مراجعة صوتية للدرس',
                    url: 'https://soundcloud.com/user-652361680/js-data-types-overview',
                    type: 'AUDIO',
                    createdAt: new Date(),
                    lessonId: 'lesson-2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: 'pdf-2',
                    name: 'ملف شرح إضافي',
                    url: 'https://cs50.harvard.edu/weeks/0/notes/0.pdf',
                    type: 'PDF',
                    createdAt: new Date(),
                    lessonId: 'lesson-2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                }
            ],
            quizzes: [
                {
                    id: 'quiz-2',
                    title: 'اختبار المتغيرات وأنواع البيانات',
                    description: 'اختبار المتغيرات وأنواع البيانات',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lessonId: 'lesson-2',
                    timeLimit: 10,
                    passingScore: 70,
                    upComing: false,
                    isCompleted: false,
                    submissions: [],
                    questions: [
                        {
                            id: 'question-2',
                            createdAt: new Date(),
                            type: 'MULTIPLE_CHOICE',
                            quizId: 'quiz-2',
                            text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
                            options: [],
                            isMultiple: true,
                            points: 1,
                            isAnswered: false,
                        }
                    ],
                }
            ],
            status: 'IN_PROGRESS',
            courseId: 'js-course-1',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: '2',
            title: 'الدرس الثانية',
            content: 'هذه هي الدرس الثانية',
            files: [
                {
                    id: '4',
                    name: 'الملف الأول',
                    url: 'https://www.youtube.com/embed/4fRvHVre3n0',
                    type: 'VIDEO',
                    createdAt: new Date(),
                    lessonId: '2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: '5',
                    name: 'الملف الثاني',
                    url: 'https://www.google.com',
                    type: 'IMAGE',
                    createdAt: new Date(),
                    lessonId: '2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: '6',
                    name: 'الملف الثالث',
                    url: 'https://docs.google.com/document/d/1zgkauCCOCzzUKDgfgyO2SUBQDbWCY9DfIs0Wp4Bs55U/edit?tab=t.0',
                    type: 'DOCUMENT',
                    createdAt: new Date(),
                    lessonId: '2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: '7',
                    name: 'الملف الثالث',
                    url: 'https://soundcloud.com/beatlabaudio/stonebank-hard-essentials-vol-1-serum-2-presets?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing',
                    type: 'AUDIO',
                    createdAt: new Date(),
                    lessonId: '2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                },
                {
                    id: '8',
                    name: 'الملف الثالث',
                    url: 'https://drive.uqu.edu.sa/_/yhafeef/files/JAVA%20Basics.pdf',
                    type: 'PDF',
                    createdAt: new Date(),
                    lessonId: '2',
                    accountingEntryId: null,
                    prRecordId: null,
                    meetingId: null,
                    adminRoleId: null,
                    legalCaseId: null,
                }
            ],
            quizzes: [
                {
                    id: 'quiz-3',
                    title: 'اختبار الدرس الثانية',
                    description: 'اختبار الدرس الثانية',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    lessonId: '2',
                    timeLimit: 10,
                    passingScore: 70,
                    upComing: false,
                    isCompleted: false,
                    submissions: [],
                    questions: [
                        {
                            id: 'question-3',
                            createdAt: new Date(),
                            type: 'MULTIPLE_CHOICE',
                            quizId: 'quiz-3',
                            text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
                            options: [
                                {
                                    id: 'option-1',
                                    text: 'JavaScript',
                                    isCorrect: true,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    questionId: 'question-3',
                                },
                                {
                                    id: 'option-2',
                                    text: 'Python',
                                    isCorrect: false,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    questionId: 'question-3',
                                },
                            ],
                            isMultiple: true,
                            points: 1,
                            isAnswered: false,
                        }
                    ],
                }
            ],
            status: 'NOT_STARTED',
            courseId: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
        }],

    enrollments: [
        {
            id: 'enroll-1',
            userId: 'user-1',
            courseId: 'js-course-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'COMPLETED',
            progress: 100,
            user: {
                id: 'user-1',
                role: 'STUDENT',
                email: 'student@example.com',
                academyId: 'academy-frontend',
                createdAt: new Date(),
                updatedAt: new Date(),
                password: 'password',
                phone: '1234567890',
                firstName: 'John',
                lastName: 'Doe',
                age: 20,
                subRole: 'STUDENT',
                avatar: 'https://via.placeholder.com/150',
                isOnline: true,
                isVerified: true,
            }
        }
    ]
};


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

    const { data: courseResponse, isLoading: isCourseLoading } = useQuery({
        queryKey: ['course', params.id],
        queryFn: () => courseApi.getById(params.id),
    });

    const { data: lessonResponse, isLoading: isLessonLoading } = useQuery({
        queryKey: ['lesson', params.id],
        queryFn: () => lessonApi.getById(params.id),
    });

    const toggleLessonStatus = useMutation({
        mutationFn: (lessonId: string) => lessonApi.update(lessonId, { ...selectedLesson!, status: selectedLesson?.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED' as LessonStatus }),
        onSuccess: () => {
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
                return <VideoFile />;
            case 'PDF':
                return <PictureAsPdf />;
            case 'IMAGE':
                return <Image />;
            case 'AUDIO':
                return <AudioFile />;
            case 'DOCUMENT':
                return <DescriptionIcon />;
            default:
                return <DescriptionIcon />;
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
                <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            اختبارات الدرس
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setOpenQuizDialog(true)}
                        >
                            إضافة اختبار
                        </Button>
                    </Box>
                    {selectedLesson?.quizzes && selectedLesson.quizzes.length > 0 ? (
                        <List>
                            {selectedLesson.quizzes.map((quiz) => (
                                <ListItem key={quiz.id} style={{ justifyContent: "space-between" }} className="flex items-center w-full">
                                    <ListItemText
                                        className="flex flex-col justify-center items-start"
                                        primary={quiz.title}
                                        secondary={quiz.description}
                                    />
                                    <Button
                                        variant="outlined"
                                        onClick={() => setSelectedQuiz(quiz.id)}
                                    >
                                        عرض النتائج
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Alert severity="info">
                            لا توجد اختبارات لهذه الدرس
                        </Alert>
                    )}
                </Box>
                <QuizDialog
                    open={openQuizDialog}
                    onClose={() => setOpenQuizDialog(false)}
                    lessonId={params.id}
                />
            </>
        );
    };

    const course = courseResponse?.data || initialCourse;
    const lesson = lessonResponse?.data || initialCourse.lessons[0];

    const addLessonMutation = useMutation({
        mutationFn: (data: any) => lessonApi.create({ ...data, courseId: params.id }),
        onSuccess: () => {
            setSnackbar({ open: true, msg: 'تم إضافة الدرس بنجاح!', type: 'success' });
            setLessonDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء الإضافة!', type: 'error' }),
    });
    const editLessonMutation = useMutation({
        mutationFn: ({ id, data }: any) => lessonApi.update(id, data),
        onSuccess: () => {
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
        mutationFn: (data: any) => lessonApi.getFiles(data.lessonId).then(() => lessonApi.create({ ...data, courseId: params.id })),
        onSuccess: () => {
            setSnackbar({ open: true, msg: 'تم إضافة الملف بنجاح!', type: 'success' });
            setFileDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['course', params.id] });
        },
        onError: () => setSnackbar({ open: true, msg: 'حدث خطأ أثناء إضافة الملف!', type: 'error' }),
    });
    const editFileMutation = useMutation({
        mutationFn: ({ id, data }: any) => lessonApi.update(id, data),
        onSuccess: () => {
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
        setLoadingAction(true);
        fileForm.url = fileForm.type === "VIDEO" ? `https://www.youtube.com/embed/${fileForm.url}` : fileForm.url;
        if (fileEditMode && fileForm.id) {

            editFileMutation.mutate({ id: fileForm.id, data: { name: fileForm.name, type: fileForm.type, url: fileForm.url } });
        } else {
            addFileMutation.mutate({ name: fileForm.name, type: fileForm.type, url: fileForm.url, lessonId: fileForm.lessonId });
        }
        setLoadingAction(false);
    };

    const deleteFileMutation = useMutation({
        mutationFn: (id: string) => lessonApi.delete(id),
        onSuccess: () => {
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography>لم يتم العثور على الكورس</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4, position: "relative" }}>
            {/* عنوان الكورس */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        {course.title}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        {course.description}
                    </Typography>
                </Box>
            </motion.div>

            <Grid container spacing={4}>
                {/* القسم الرئيسي */}
                <Grid item xs={12} md={4}>
                    {/* إحصائيات الكورس */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Description /> إحصائيات الكورس
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                عدد الطلاب
                                            </Typography>
                                            <Typography variant="h3">
                                                {course.enrollments?.length || 0}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                عدد الدروس
                                            </Typography>
                                            <Typography variant="h3">
                                                {course.lessons.length}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                نسبة الإكمال
                                            </Typography>
                                            <Typography variant="h3">
                                                {Math.round((course.lessons.filter(l => l.status === 'COMPLETED').length / course.lessons.length) * 100)}%
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>

                    {/* قائمة الدروس */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <VideoLibrary /> الدروس
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={handleOpenAddLesson}
                                >
                                    إضافة درس
                                </Button>
                            </Box>
                            <List>
                                {course.lessons.map((lesson) => (
                                    <Box key={lesson.id}>
                                        <ListItem
                                            button
                                            selected={selectedLesson?.id === lesson.id}
                                            onClick={() => {
                                                setSelectedLesson(lesson as Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] });
                                                handleLessonExpand(lesson.id);
                                            }}
                                            sx={{
                                                mb: 1,
                                                borderRadius: 1,
                                                '&:hover': {
                                                    backgroundColor: 'action.hover',
                                                },
                                            }}
                                        >
                                            <ListItemIcon>
                                                <PlayCircleOutline />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={lesson.title}
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <AccessTime fontSize="small" />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {lesson.files?.length || 0} ملفات مرفقة
                                                        </Typography>
                                                        <Chip
                                                            size="small"
                                                            label={lesson.status === 'COMPLETED' ? 'مكتملة' : lesson.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : ' مغلقه'}
                                                            color={lesson.status === 'COMPLETED' ? 'success' : lesson.status === 'IN_PROGRESS' ? 'warning' : "error"}
                                                        />
                                                    </Box>
                                                }
                                            />
                                            <IconButton color="primary" onClick={e => { e.stopPropagation(); handleOpenEditLesson(lesson); }}><Edit /></IconButton>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLessonStatus.mutate(lesson.id);
                                                }}
                                            >
                                                {lesson.status === 'COMPLETED' ? <LockOpen /> : lesson.status === 'IN_PROGRESS' ? <LockOpen /> : <Lock />}
                                            </IconButton>
                                            <IconButton onClick={() => handleLessonExpand(lesson.id)}>
                                                {expandedLessons[lesson.id] ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                            <IconButton color="primary" onClick={e => { e.stopPropagation(); handleOpenAddFile(lesson); }}><Add /></IconButton>
                                        </ListItem>
                                        <Collapse in={expandedLessons[lesson.id]} timeout="auto" unmountOnExit>
                                            {lesson.files?.map((file) => (
                                                <ListItemButton
                                                    key={file.id}
                                                    sx={{ pl: 4 }}
                                                    onClick={() => setSelectedFile(file)}
                                                >
                                                    <ListItemIcon>
                                                        {getFileIcon(file.type)}
                                                    </ListItemIcon>
                                                    <ListItemText primary={file.name} />
                                                    <IconButton color="primary" onClick={e => { e.stopPropagation(); handleOpenEditFile(file, lesson); }}><Edit /></IconButton>
                                                    <IconButton color="error" onClick={e => { e.stopPropagation(); handleOpenDeleteFile(file, lesson); }}><Delete /></IconButton>
                                                </ListItemButton>
                                            ))}
                                        </Collapse>
                                    </Box>
                                ))}
                            </List>
                        </Paper>
                    </motion.div>
                </Grid>

                {/* القسم الجانبي */}
                <Grid item xs={12} md={8}>
                    <motion.div
                        style={{ position: "sticky", top: "10vh", zIndex: 1000 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* تفاصيل الدرس المحددة */}
                        {selectedLesson && (
                            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                                {selectedFile && (
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {selectedFile.name}
                                        </Typography>
                                        {renderFilePreview(selectedFile)}
                                    </Box>
                                )}
                                <Typography variant="h6" gutterBottom>
                                    تفاصيل الدرس
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    {selectedLesson.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {selectedLesson.content}
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        الطلاب الذين شاهدوا الدرس
                                    </Typography>
                                    <AvatarGroup max={4}>
                                        {course.enrollments?.map((enrollment) => (
                                            <Avatar key={enrollment.user.id} alt={enrollment.user?.firstName}>
                                                {enrollment.user?.firstName?.[0]}
                                            </Avatar>
                                        ))}
                                    </AvatarGroup>
                                </Box>
                            </Paper>
                        )}

                        {/* إحصائيات الطلاب */}
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                إحصائيات الطلاب
                            </Typography>
                            {course.enrollments?.map((enrollment) => (
                                <Box key={enrollment.id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">
                                            {enrollment.user?.firstName} {enrollment.user?.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {Math.round(enrollment.progress)}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={enrollment.progress}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            ))}
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>

            {/* نافذة إدارة الدروس */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>إدارة الدروس</DialogTitle>
                <DialogContent>
                    <List>
                        {course.lessons.map((lesson) => (
                            <ListItem key={lesson.id}>
                                <ListItemText
                                    primary={lesson.title}
                                    secondary={lesson.status === 'COMPLETED' ? 'مكتملة' : lesson.status === 'IN_PROGRESS' ? "قيد التنفيذ" : "مغلقة"}
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={lsessonStatus?.lessonId === lesson.id || lesson.status === 'COMPLETED' || lesson.status === 'IN_PROGRESS'}
                                            onChange={() => {
                                                setLsessonStatus({ lessonId: lesson.id, status: lesson.status === 'COMPLETED' || lesson.status === 'IN_PROGRESS' ? 'NOT_STARTED' : 'COMPLETED' as LessonStatus })
                                                console.log(lsessonStatus)
                                                toggleLessonStatus.mutate(lesson.id)
                                            }}
                                        />
                                    }
                                    label={lesson.status === 'COMPLETED' ? 'مفتوحة' : lesson.status === 'IN_PROGRESS' ? "مفتوحة" : 'مغلقة'}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>إغلاق</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog إضافة/تعديل درس */}
            <Dialog open={lessonDialogOpen} onClose={() => setLessonDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{lessonEditMode ? 'تعديل الدرس' : 'إضافة درس جديد'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="عنوان الدرس"
                        value={lessonForm.title}
                        onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="وصف الدرس"
                        value={lessonForm.content}
                        onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                        fullWidth
                        className="mb-4"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLessonDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSaveLesson} variant="contained" color="primary" disabled={loadingAction}>
                        {lessonEditMode ? 'حفظ التعديلات' : 'إضافة'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog إضافة/تعديل ملف */}
            <Dialog open={fileDialogOpen} onClose={() => setFileDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{fileEditMode ? 'تعديل الملف' : 'إضافة ملف جديد'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="اسم الملف"
                        value={fileForm.name}
                        onChange={e => setFileForm({ ...fileForm, name: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="نوع الملف"
                        value={fileForm.type}
                        onChange={e => setFileForm({ ...fileForm, type: e.target.value as FileType, url: '' })}
                        select
                        fullWidth
                        className="mb-4"
                    >
                        <MenuItem value="VIDEO">فيديو (رابط يوتيوب)</MenuItem>
                        <MenuItem value="PDF">PDF</MenuItem>
                        <MenuItem value="DOCUMENT">مستند</MenuItem>
                        <MenuItem value="IMAGE">صورة</MenuItem>
                        <MenuItem value="AUDIO">صوتي</MenuItem>
                    </TextField>
                    {/* رفع ملف حقيقي إذا لم يكن فيديو */}
                    {fileForm.type && fileForm.type !== 'VIDEO' && (
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                disabled={uploading}
                                sx={{ mb: 1 }}
                            >
                                اختر ملف للرفع
                                <input
                                    type="file"
                                    accept={
                                        fileForm.type === 'PDF' ? 'application/pdf' :
                                        fileForm.type === 'IMAGE' ? 'image/*' :
                                        fileForm.type === 'AUDIO' ? 'audio/*' :
                                        fileForm.type === 'DOCUMENT' ? '.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.csv,.odt,.ods' :
                                        '*/*'
                                    }
                                    hidden
                                    onChange={handleFileUpload}
                                />
                            </Button>
                            {uploading && (
                                <Box sx={{ width: '100%', mb: 1 }}>
                                    <LinearProgress variant="determinate" value={uploadProgress} />
                                    <Typography variant="caption">جاري رفع الملف... {uploadProgress}%</Typography>
                                </Box>
                            )}
                            {renderUploadedFilePreview()}
                        </Box>
                    )}
                    {/* إدخال رابط للفيديو فقط */}
                    {fileForm.type === 'VIDEO' && (
                        <TextField
                            label="رابط الفيديو (YouTube Embed)"
                            value={fileForm.url}
                            onChange={e => setFileForm({ ...fileForm, url: e.target.value })}
                            fullWidth
                            className="mb-4"
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFileDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleSaveFile} variant="contained" color="primary" disabled={Boolean(loadingAction || uploading || (fileForm.type && fileForm.type !== 'VIDEO' && !fileForm.url))}>
                        {fileEditMode ? 'حفظ التعديلات' : 'إضافة'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog تأكيد حذف الملف */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>تأكيد حذف الملف</DialogTitle>
                <DialogContent>
                    <Typography>هل أنت متأكد أنك تريد حذف هذا الملف؟ لا يمكن التراجع عن هذه العملية.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleConfirmDeleteFile} color="error" variant="contained" disabled={deleteFileMutation.isPending}>
                        حذف
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.type} sx={{ width: '100%' }}>
                    {snackbar.msg}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default InstructorCoursePage; 