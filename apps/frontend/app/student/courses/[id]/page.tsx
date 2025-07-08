"use client";

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Rating,
    IconButton,
    Paper,
    Divider,
    Collapse,
    ListItemButton,
    LinearProgress,
    Button,
} from '@mui/material';
import {
    PlayCircle,
    Clock,
    School,
    Star,
    User as UserIcon,
    Video as VideoIcon,
    FileText,
    ChevronDown,
    ChevronUp,
    Image,
    FileAudio,
    File,
    Video,
} from 'lucide-react';
import { courseApi } from '@/lib/api';
import { Course, Lesson, FileType, File as FileModel, Enrollment, Quiz, Submission, Question, User, Option } from '@shared/prisma';
import dynamic from 'next/dynamic';
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
import QuizSidebar from './components/QuizSidebar';

// let initialCourse: Course & {
//     lessons: (Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: (Question & { options: Option[] })[] })[] })[];
//     enrollments: (Enrollment & { user: User })[];
// } = {
//     id: 'js-course-1',
//     status: 'COMPLETED',
//     createdAt: new Date(),
//     updatedAt: new Date(),
//     academyId: 'academy-frontend',
//     title: 'مقدمة في JavaScript',
//     description: 'دورة شاملة للمبتدئين لتعلم أساسيات لغة JavaScript من البداية حتى الاحتراف.',
//     image: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*snTDISrdwI0rjx3xCzQq4Q.jpeg',
//     level: 'BEGINNER',
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
//                             isMultiple: true,
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

//                             points: 1,
//                             isAnswered: false,
//                             isMultiple: true,
                           
                            
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
//                             points: 1,
//                             isAnswered: false,
//                             isMultiple: true,
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


let getCourse = async (id: string) => {
    const course = await courseApi.getById(id);
    return course.data;
}

const CoursePage = ({ params }: { params: { id: string } }) => {
    const [selectedLesson, setSelectedLesson] = useState<Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] } | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileModel | null>(null);
    const [expandedLessons, setExpandedLessons] = useState<{ [key: string]: boolean }>({});
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

    const { data: courseData, isLoading: isCourseLoading } = useQuery({
        queryKey: ['course', params.id],
        queryFn: () => getCourse(params.id),
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
                return <VideoIcon />;
            case 'PDF':
                return <FileText />;
            case 'IMAGE':
                return <Image />;
            case 'AUDIO':
                return <FileAudio />;
            case 'DOCUMENT':
                return <File />;
            default:
                return <File />;
        }
    };

    const renderFilePreview = (file: FileModel) => {
        switch (file.type) {
            case 'VIDEO':
                return (
                    <Box sx={{ mt: 2 }}>
                        {selectedQuiz ? (
                            <QuizSidebar quizId={selectedQuiz} lessonId={selectedLesson?.id || ''} />
                        ) : (
                            <>
                                <iframe
                                    width="100%"
                                    className="h-[50vh]"
                                    src={file.url}
                                    title={file.name}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                {selectedLesson?.quizzes && selectedLesson.quizzes.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            اختبارات الدرس
                                        </Typography>
                                        <List className="w-full">
                                            {selectedLesson.quizzes.map((quiz) => (
                                                <ListItem key={quiz.id} style={{ justifyContent: "space-between" }} className="flex items-center w-full">
                                                    <ListItemText
                                                        className="flex flex-col justify-center items-start"
                                                        primary={quiz.title}
                                                        secondary={quiz.description}
                                                    />
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => setSelectedQuiz(quiz.id)}
                                                    >
                                                        بدء الاختبار
                                                    </Button>
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                );
            case 'PDF':
                return (
                    <Box sx={{ mt: 2, height: '500px' }}>
                        <iframe
                            width="100%"
                            height="100%"
                            src={file.url}
                            title={file.name}
                        />
                    </Box>
                );
            case 'IMAGE':
                return (
                    <Box sx={{ mt: 2 }}>
                        <img
                            src={file.url}
                            alt={file.name}
                            style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }}
                        />
                    </Box>
                );
            case 'AUDIO':
                return (
                    <Box sx={{ mt: 2 }}>
                        <audio controls style={{ width: '100%' }}>
                            <source src={file.url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </Box>
                );
            case 'DOCUMENT':
                return (
                    <Box sx={{ mt: 2 }}>
                        <iframe
                            width="100%"
                            height="500px"
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(file.url)}&embedded=true`}
                            title={file.name}
                        />
                    </Box>
                );
            default:
                return null;
        }
    };

    if (isCourseLoading) {
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
    let course = courseData;
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
                    {/* معلومات الكورس */}
                    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            معلومات الكورس
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VideoIcon color="primary" />
                                <Typography>
                                    عدد الدروس: {course.lessons?.length || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <UserIcon color="primary" />
                                <Typography>
                                    عدد الطلاب: {course.enrollments?.length || 0}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <School color="primary" />
                                <Typography>
                                    المستوى: {course.level || 'جميع المستويات'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                    {/* مقدمة الكورس */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FileText /> مقدمة الكورس
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {course.description}
                            </Typography>
                        </Paper>
                    </motion.div>

                    {/* قائمة الدروس */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VideoIcon /> الدروس
                            </Typography>
                            <List>
                                {course.lessons?.map((lesson) => (
                                    <Box key={lesson.id}>
                                        <ListItem
                                            button
                                            selected={selectedLesson?.id === lesson.id}
                                            disabled={lesson.status === 'NOT_STARTED'}
                                            onClick={() => {
                                                if (lesson.status === 'NOT_STARTED') return
                                                setSelectedLesson(lesson as unknown as Lesson & { files: FileModel[], quizzes: (Quiz & { submissions: Submission[], questions: Question[] })[] });
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
                                                <PlayCircle />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={lesson.title}
                                                secondary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                        <Clock fontSize="small" />
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
                                            {/* <IconButton onClick={() => handleLessonExpand(lesson.id)}> */}
                                            {expandedLessons[lesson.id] ? <ChevronDown /> : <ChevronUp />}
                                            {/* </IconButton> */}
                                        </ListItem>
                                        <Collapse in={expandedLessons[lesson.id]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
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
                                                    </ListItemButton>
                                                ))}
                                            </List>
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
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ position: "sticky", top: "10vh", zIndex: 1000 }}
                    >


                        {/* تفاصيل الدرس المحددة */}
                        {selectedLesson && (
                            <Paper elevation={3} sx={{ p: 3 }} >
                                {selectedFile && (
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom>
                                            {selectedFile.name}
                                        </Typography>
                                        {renderFilePreview(selectedFile)}
                                    </Box>
                                )}
                                <Typography variant="h6" gutterBottom className={"mt-5"}>
                                    تفاصيل الدرس
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    {selectedLesson.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {selectedLesson.content}
                                </Typography>
                            </Paper>
                        )}

                        {/* تقدم الطالب */}
                        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                تقدمك في الكورس
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">
                                        الدروس المكتملة
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {Math.round((course.lessons?.filter(l => l.status === 'COMPLETED').length || 0) / (course.lessons?.length || 1) * 100)}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={(course.lessons?.filter(l => l.status === 'COMPLETED').length || 0) / (course.lessons?.length || 1) * 100}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default function CoursePageS({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<Skeleton />}>
            <CoursePage params={params} />
        </Suspense>
    );
}