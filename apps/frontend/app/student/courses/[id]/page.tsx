"use client";

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
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

const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="h-[200px] w-[200px] bg-gray-200 rounded-2xl animate-pulse"></div> });
const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div /> });
const Badge = dynamic(() => import('@/components/common/Badge'), { loading: () => <div /> });
const Progress = dynamic(() => import('@/components/common/Progress'), { loading: () => <div /> });
import QuizSidebar from './components/QuizSidebar';

let getCourse = async (id: string) => {
    const response = await courseApi.getById(id);
    return response.data;
};

const CoursePage = ({ params }: { params: { id: string } }) => {
    const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
    const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', params.id],
        queryFn: () => getCourse(params.id),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const handleLessonExpand = (lessonId: string) => {
        const newExpanded = new Set(expandedLessons);
        if (newExpanded.has(lessonId)) {
            newExpanded.delete(lessonId);
        } else {
            newExpanded.add(lessonId);
        }
        setExpandedLessons(newExpanded);
    };

    const getFileIcon = (type: FileType) => {
        switch (type) {
            case 'VIDEO':
                return <Video className="w-5 h-5 text-red-500" />;
            case 'AUDIO':
                return <FileAudio className="w-5 h-5 text-blue-500" />;
            case 'PDF':
                return <FileText className="w-5 h-5 text-red-600" />;
            case 'DOCUMENT':
                return <File className="w-5 h-5 text-green-500" />;
            case 'IMAGE':
                return <Image className="w-5 h-5 text-purple-500" />;
            default:
                return <File className="w-5 h-5 text-gray-500" />;
        }
    };

    const renderFilePreview = (file: FileModel) => {
        if (file.type === 'VIDEO' && file.url.includes('youtube.com')) {
            const videoId = file.url.split('embed/')[1];
            return (
                <div className="aspect-video w-full">
                    <iframe
                        src={file.url}
                        title={file.name}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                    />
                </div>
            );
        }
        return (
            <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                {getFileIcon(file.type)}
                <span className="mr-3 text-sm">{file.name}</span>
                <Button variant="outline" size="sm">
                    عرض
                </Button>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton height={300} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Skeleton height={400} />
                    </div>
                    <div>
                        <Skeleton height={400} />
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">لم يتم العثور على الدورة</h2>
                <p className="text-gray-600">الدورة المطلوبة غير موجودة أو تم حذفها.</p>
            </div>
        );
    }

    const completedLessons = course.lessons?.filter(lesson => lesson.status === 'COMPLETED').length || 0;
    const totalLessons = course.lessons?.length || 0;
    const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Course Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
                <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                    <img
                        src={course.image || 'https://via.placeholder.com/800x300'}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto">{course.description}</p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <Badge variant="standard">
                                <span>{course.level}</span>
                            </Badge>
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="mr-1">4.8</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{course.lessons?.length || 0} درس</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <UserIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-600">
                                {course.enrollments?.length || 0} طالب مسجل
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Progress Section */}
                    <Card title="تقدمك في الدورة">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">التقدم العام</span>
                                <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                            </div>
                            <Progress
                                value={completedLessons}
                                max={totalLessons}
                                showLabel
                                label={`${completedLessons} من ${totalLessons} درس مكتمل`}
                            />
                        </div>
                    </Card>

                    {/* Lessons Section */}
                    <Card title="الدروس">
                        <div className="space-y-4">
                            {course.lessons?.map((lesson, index) => (
                                <motion.div
                                    key={lesson.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="border rounded-lg overflow-hidden"
                                >
                                    <div
                                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleLessonExpand(lesson.id)}
                                    >
                                        <div className="flex items-center space-x-3 space-x-reverse">
                                            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-semibold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                                                <p className="text-sm text-gray-600">{lesson.content}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <Badge variant="standard">
                                                <span>{lesson.status}</span>
                                            </Badge>
                                            {expandedLessons.has(lesson.id) ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>

                                    {expandedLessons.has(lesson.id) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-4 border-t"
                                        >
                                            <div className="space-y-4">
                                                {/* Files */}
                                                {lesson.files && lesson.files.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3">الملفات المرفقة</h4>
                                                        <div className="space-y-2">
                                                            {lesson.files.map((file) => (
                                                                <div key={file.id}>
                                                                    {renderFilePreview(file)}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Quizzes */}
                                                {lesson.quizzes && lesson.quizzes.length > 0 && (
                                                    <div>
                                                        <h4 className="font-semibold mb-3">الاختبارات</h4>
                                                        <div className="space-y-2">
                                                            {lesson.quizzes.map((quiz) => (
                                                                <div
                                                                    key={quiz.id}
                                                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                                                    onClick={() => setSelectedQuiz(quiz.id)}
                                                                >
                                                                    <div className="flex items-center space-x-2 space-x-reverse">
                                                                        <FileText className="w-5 h-5 text-blue-500" />
                                                                        <span className="font-medium">{quiz.title}</span>
                                                                    </div>
                                                                    <Badge variant="standard">
                                                        <span>{quiz.isCompleted ? 'مكتمل' : 'غير مكتمل'}</span>
                                                    </Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Course Info */}
                    <Card title="معلومات الدورة">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">المستوى</span>
                                <Badge variant="standard">
                                    <span>{course.level}</span>
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">عدد الدروس</span>
                                <span className="font-semibold">{course.lessons?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">الحالة</span>
                                <Badge variant="standard">
                                    <span>{course.status}</span>
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Quiz Sidebar */}
                    {selectedQuiz && (
                        <QuizSidebar quizId={selectedQuiz} lessonId="" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default function CoursePageS({ params }: { params: { id: string } }) {
    return (
        <Suspense fallback={<Skeleton />}>
            <CoursePage params={params} />
        </Suspense>
    );
}