'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar, Tabs, Progress, Modal, Input, Textarea, LoadingAnimation, Alert } from '@3de/ui';
import { 
  useInstructorCourses, 
  useCourseStudents, 
  useCreatePost, 
  useCourse, 
  useCourseLessons, 
  useCourseQuizzes,
  useCreateQuiz 
} from '../../../hooks/useInstructorQueries';
import ChartBox from '../../../components/ChartBox';
import { useAuth } from '@3de/auth';
import { Quiz } from '@3de/interfaces';

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<any>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    urgent: false
  });
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    questions: 5,
    duration: 15,
    lessonId: ''
  });

  // API Queries
  const { data: courseResponse, isLoading: courseLoading, error: courseError } = useCourse(courseId);
  const { data: studentsResponse, isLoading: studentsLoading } = useCourseStudents(courseId);
  const { data: lessonsResponse, isLoading: lessonsLoading } = useCourseLessons(courseId);
  const { data: quizzesResponse, isLoading: quizzesLoading } = useCourseQuizzes(courseId);

  // Mutations
  const createPostMutation = useCreatePost();
  const createQuizMutation = useCreateQuiz();

  // Extract data from responses
  const course = courseResponse?.data;
  const students = studentsResponse?.data || [];
  const lessons = lessonsResponse?.data || [];
  const quizzes = quizzesResponse?.data || [];

  // تحديد الدرس الأول كافتراضي
  useEffect(() => {
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].id);
      if (lessons[0].files && lessons[0].files.length > 0) {
        setCurrentFile(lessons[0].files[0]);
      }
    }
  }, [lessons, selectedLessonId]);

  const handleCreateAnnouncement = async () => {
    try {
      await createPostMutation.mutateAsync({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        urgent: newAnnouncement.urgent
      });
      setNewAnnouncement({ title: '', content: '', urgent: false });
      setIsAnnouncementModalOpen(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const quizData = {
        title: newQuiz.title,
        description: newQuiz.description,
        lessonId: newQuiz.lessonId,
        questions: Array.from({ length: newQuiz.questions }, (_, index) => ({
          text: `سؤال ${index + 1}`,
          type: 'multiple_choice',
          options: [
            { text: 'الخيار الأول', isCorrect: true },
            { text: 'الخيار الثاني', isCorrect: false },
            { text: 'الخيار الثالث', isCorrect: false },
            { text: 'الخيار الرابع', isCorrect: false }
          ],
          isMultiple: false,
          points: 1,
          isAnswered: false
        })),
        timeLimit: newQuiz.duration,
        passingScore: 60,
        upComing: false,
        isCompleted: false
      };

      await createQuizMutation.mutateAsync(quizData);
      setNewQuiz({ title: '', description: '', questions: 5, duration: 15, lessonId: '' });
      setIsQuizModalOpen(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    const selectedLesson = lessons.find(lesson => lesson.id === lessonId);
    if (selectedLesson?.files && selectedLesson.files.length > 0) {
      setCurrentFile(selectedLesson.files[0]);
    } else {
      setCurrentFile(null);
    }
  };

  const handleFileSelect = (file: any) => {
    setCurrentFile(file);
  };

  // مكون عارض الملفات
  const FileViewer = ({ file }: { file: any }) => {
    if (!file) return null;

    if (file.type === 'VIDEO') {
      return (
        <div className="w-full">
          <video 
            controls 
            className="w-full h-64 bg-black rounded-lg"
            poster="/placeholder-video.jpg"
          >
            <source src={file.url} type="video/mp4" />
            متصفحك لا يدعم تشغيل الفيديو
          </video>
        </div>
      );
    }

    if (file.type === 'PDF' || file.type === 'DOCUMENT') {
      return (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{file.name}</h3>
          <Button variant="outline" onClick={() => window.open(file.url, '_blank')}>
            تحميل الملف
          </Button>
        </div>
      );
    }

    return null;
  };

  // Loading state
  if (courseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation size="lg" text="جاري تحميل بيانات الكورس..." />
      </div>
    );
  }

  // Error state
  if (courseError || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert variant="error" title="خطأ في تحميل البيانات">
          <p>عذراً، حدث خطأ أثناء تحميل بيانات الكورس. يرجى المحاولة مرة أخرى.</p>
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              العودة
            </Button>
            <Button variant="primary" onClick={() => window.location.reload()}>
              إعادة المحاولة
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // بيانات الرسوم البيانية
  const progressData = students.map(student => ({
    name: student.user?.firstName + ' ' + student.user?.lastName,
    value: student.progress || 0,
    label: student.user?.firstName + ' ' + student.user?.lastName
  }));

  const gradeDistribution = [
    { name: 'A+', value: 0 },
    { name: 'A', value: 0 },
    { name: 'A-', value: 0 },
    { name: 'B+', value: 0 },
    { name: 'B', value: 0 }
  ];

  const overviewTab = (
    <div className="space-y-6">
      {/* معلومات الكورس الأساسية */}
      <Card padding="lg">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">
              {course.image ? (
                <img src={course.image} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {course.title.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 max-w-2xl">{course.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 {course.startDate ? new Date(course.startDate).toLocaleDateString('ar-EG') : 'غير محدد'}</span>
                <span>📊 {course.level}</span>
                <span>💰 {course.price || 0} ريال</span>
              </div>
            </div>
          </div>
          <Badge 
            variant={course.status === 'ACTIVE' ? 'success' : 'warning'}
            size="lg"
          >
            {course.status === 'ACTIVE' ? 'نشط' : course.status}
          </Badge>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{students.length}</div>
            <div className="text-sm text-gray-600">طالب مسجل</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{course.progress || 0}%</div>
            <div className="text-sm text-gray-600">نسبة التقدم</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{lessons.length}</div>
            <div className="text-sm text-gray-600">عدد الدروس</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">{quizzes.length}</div>
            <div className="text-sm text-gray-600">عدد الاختبارات</div>
          </div>
        </div>
      </Card>

      {/* الرسوم البيانية */}
      {!studentsLoading && progressData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartBox
            title="تقدم الطلاب"
            type="bar"
            data={progressData}
            className="h-80"
          />
          <ChartBox
            title="توزيع الدرجات"
            type="pie"
            data={gradeDistribution as any}
            className="h-80"
          />
        </div>
      )}
    </div>
  );

  const studentsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          الطلاب المسجلين ({students.length})
        </h3>
        <Button variant="outline">تصدير قائمة الطلاب</Button>
      </div>

      {studentsLoading ? (
        <LoadingAnimation text="جاري تحميل بيانات الطلاب..." />
      ) : students.length === 0 ? (
        <Alert variant="info" title="لا يوجد طلاب">
          لم يتم تسجيل أي طالب في هذا الكورس بعد.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {students.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar
                    src={enrollment.user?.avatar}
                    fallback={`${enrollment.user?.firstName} ${enrollment.user?.lastName}`}
                    size="lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {enrollment.user?.firstName} {enrollment.user?.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{enrollment.user?.email}</p>
                    <p className="text-xs text-gray-500">
                      انضم في {new Date(enrollment.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{enrollment.progress || 0}%</div>
                  <div className="text-sm text-gray-500">التقدم</div>
                  <Progress value={enrollment.progress || 0} size="sm" className="w-20 mt-2" />
                </div>
                
                <div className="text-center">
                  <Badge 
                    variant={enrollment.status === 'COMPLETED' ? 'success' : 'info'}
                  >
                    {enrollment.status === 'COMPLETED' ? 'مكتمل' : 'قيد التقدم'}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    آخر تحديث: {new Date(enrollment.updatedAt).toLocaleDateString('ar-EG')}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/students/${enrollment.user?.id}`)}
                  >
                    عرض الملف
                  </Button>
                  <Button size="sm" variant="ghost">
                    إرسال رسالة
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const lessonsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          الدروس ({lessons.length})
        </h3>
        <Button>إضافة درس جديد</Button>
      </div>

      {lessonsLoading ? (
        <LoadingAnimation text="جاري تحميل الدروس..." />
      ) : lessons.length === 0 ? (
        <Alert variant="info" title="لا توجد دروس">
          لم يتم إضافة أي دروس لهذا الكورس بعد.
        </Alert>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} padding="lg" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                    <p className="text-sm text-gray-600">{lesson.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                      <span>📹 فيديو</span>
                      <span>📅 {new Date(lesson.createdAt).toLocaleDateString('ar-EG')}</span>
                      <span>📁 {lesson.files?.length || 0} ملف</span>
                      <span>📝 {lesson.quizzes?.length || 0} اختبار</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={lesson.status === 'COMPLETED' ? 'success' : 'info'}
                    size="sm"
                  >
                    {lesson.status === 'COMPLETED' ? 'مكتمل' : 'قيد التقدم'}
                  </Badge>
                  <Button size="sm" variant="outline">تعديل</Button>
                  <Button size="sm" variant="ghost">عرض</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  // Tab جديد لمعاينة المحتوى
  const contentPreviewTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">معاينة محتوى الكورس</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => {
              setNewQuiz(prev => ({ ...prev, lessonId: selectedLessonId || '' }));
              setIsQuizModalOpen(true);
            }}
            disabled={!selectedLessonId}
          >
            إضافة اختبار للدرس
          </Button>
          <Button variant="outline">إضافة ملف</Button>
        </div>
      </div>

      {lessonsLoading ? (
        <LoadingAnimation text="جاري تحميل الدروس..." />
      ) : lessons.length === 0 ? (
        <Alert variant="info" title="لا توجد دروس">
          لم يتم إضافة أي دروس لهذا الكورس بعد.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* قائمة الدروس */}
          <div className="lg:col-span-2">
            <Card padding="none">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">قائمة الدروس</h4>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedLessonId === lesson.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleLessonSelect(lesson.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        selectedLessonId === lesson.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 text-sm">{lesson.title}</h5>
                        <p className="text-xs text-gray-500 mt-1">{lesson.content}</p>
                        
                        {/* ملفات الدرس */}
                        {lesson.files && lesson.files.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {lesson.files.map((file) => (
                              <div
                                key={file.id}
                                className={`text-xs p-2 rounded cursor-pointer ${
                                  currentFile?.id === file.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileSelect(file);
                                }}
                              >
                                📄 {file.name}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* اختبارات الدرس */}
                        {lesson.quizzes && lesson.quizzes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {lesson.quizzes.map((quiz: any) => (
                              <div key={quiz.id} className="text-xs p-2 bg-green-100 text-green-800 rounded">
                                📝 {quiz.title} ({quiz.questions?.length || 0} أسئلة)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* عارض المحتوى */}
          <div className="lg:col-span-3">
            <Card padding="none">
              <div className="p-4 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900">
                  {currentFile ? currentFile.name : 'اختر ملفاً لعرضه'}
                </h4>
                {selectedLessonId && (
                  <p className="text-sm text-gray-600 mt-1">
                    الدرس: {lessons.find(l => l.id === selectedLessonId)?.title}
                  </p>
                )}
              </div>
              <div className="p-6">
                {currentFile ? (
                  <FileViewer file={currentFile} />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      اختر ملفاً لعرض المحتوى
                    </h3>
                    <p className="text-gray-600">
                      اختر درساً وملفاً من القائمة على اليسار لمعاينة المحتوى
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* معلومات الدرس المحدد */}
            {selectedLessonId && (
              <Card padding="lg" className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-4">تفاصيل الدرس</h4>
                {(() => {
                  const selectedLesson = lessons.find(l => l.id === selectedLessonId);
                  return selectedLesson ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">تاريخ الإنشاء:</span>
                          <span className="mr-2 font-medium">
                            {new Date(selectedLesson.createdAt).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">عدد الملفات:</span>
                          <span className="mr-2 font-medium">{selectedLesson.files?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">عدد الاختبارات:</span>
                          <span className="mr-2 font-medium">{selectedLesson.quizzes?.length || 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">الحالة:</span>
                          <Badge variant="success" size="sm" className="mr-2">
                            منشور
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            تعديل الدرس
                          </Button>
                          <Button size="sm" variant="outline">
                            إضافة ملف
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="primary"
                          onClick={() => {
                            setNewQuiz(prev => ({ ...prev, lessonId: selectedLessonId }));
                            setIsQuizModalOpen(true);
                          }}
                        >
                          إضافة اختبار
                        </Button>
                      </div>
                    </div>
                  ) : null;
                })()}
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const quizzesTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          الاختبارات ({quizzes.length})
        </h3>
        <Button onClick={() => router.push('/quizzes/new')}>
          إنشاء اختبار جديد
        </Button>
      </div>

      {quizzesLoading ? (
        <LoadingAnimation text="جاري تحميل الاختبارات..." />
      ) : quizzes.length === 0 ? (
        <Alert variant="info" title="لا توجد اختبارات">
          لم يتم إنشاء أي اختبارات لهذا الكورس بعد.
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz:Quiz) => (
            <Card key={quiz.id} padding="lg" hover>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                  <Badge 
                    variant={quiz.isCompleted ? 'success' : 'warning'}
                    size="sm"
                  >
                    {quiz.isCompleted ? 'مكتمل' : 'قيد التقدم'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>عدد الأسئلة:</span>
                    <span>{quiz.questions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مدة الاختبار:</span>
                    <span>{quiz.timeLimit || 0} دقيقة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الدرجة المطلوبة:</span>
                    <span>{quiz.passingScore || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ الإنشاء:</span>
                    <span>{new Date(quiz.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/quizzes/${quiz.id}/results`)}
                  >
                    عرض النتائج
                  </Button>
                  <Button size="sm" variant="ghost">
                    تعديل
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const announcementsTab = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">الإعلانات</h3>
        <Button onClick={() => setIsAnnouncementModalOpen(true)}>
          إضافة إعلان جديد
        </Button>
      </div>

      <Alert variant="info" title="لا توجد إعلانات">
        لم يتم إنشاء أي إعلانات لهذا الكورس بعد.
      </Alert>
    </div>
  );

  const tabItems = [
    { id: 'overview', label: 'نظرة عامة', content: overviewTab, icon: '📊' },
    { id: 'content', label: 'معاينة المحتوى', content: contentPreviewTab, icon: '👁️' },
    { id: 'students', label: 'الطلاب', content: studentsTab, icon: '👥' },
    { id: 'lessons', label: 'الدروس', content: lessonsTab, icon: '📚' },
    { id: 'quizzes', label: 'الاختبارات', content: quizzesTab, icon: '📝' },
    { id: 'announcements', label: 'الإعلانات', content: announcementsTab, icon: '📢' }
  ];

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            ← العودة
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">تفاصيل الكورس</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            معاينة الكورس
          </Button>
          <Button variant="outline">
            تعديل الكورس
          </Button>
          <Button variant="primary">
            إعدادات الكورس
          </Button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <Card padding="none">
        <Tabs
          items={tabItems}
          defaultActiveTab="overview"
          onTabChange={setActiveTab}
          className="p-6"
        />
      </Card>

      {/* Modal لإضافة إعلان */}
      <Modal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        title="إضافة إعلان جديد"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="عنوان الإعلان *"
            value={newAnnouncement.title}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            placeholder="أدخل عنوان الإعلان"
          />

          <Textarea
            label="محتوى الإعلان *"
            value={newAnnouncement.content}
            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
            placeholder="أدخل محتوى الإعلان"
            rows={4}
          />

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="urgent"
              checked={newAnnouncement.urgent}
              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, urgent: e.target.checked }))}
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
            />
            <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
              إعلان عاجل
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsAnnouncementModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateAnnouncement}
              disabled={!newAnnouncement.title.trim() || !newAnnouncement.content.trim()}
              loading={createPostMutation.isPending}
            >
              نشر الإعلان
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal لإضافة اختبار */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title="إضافة اختبار جديد"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="عنوان الاختبار *"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
            placeholder="أدخل عنوان الاختبار"
          />

          <Textarea
            label="وصف الاختبار"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
            placeholder="أدخل وصف الاختبار (اختياري)"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="عدد الأسئلة *"
              type="number"
              value={newQuiz.questions}
              onChange={(e) => setNewQuiz(prev => ({ ...prev, questions: parseInt(e.target.value) || 0 }))}
              min="1"
              max="50"
            />

            <Input
              label="مدة الاختبار (بالدقائق) *"
              type="number"
              value={newQuiz.duration}
              onChange={(e) => setNewQuiz(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              min="5"
              max="180"
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📝 سيتم ربط هذا الاختبار بالدرس: {lessons.find(l => l.id === newQuiz.lessonId)?.title || 'غير محدد'}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsQuizModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleCreateQuiz}
              disabled={!newQuiz.title.trim() || newQuiz.questions <= 0 || newQuiz.duration <= 0}
              loading={createQuizMutation.isPending}
            >
              إنشاء الاختبار
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseDetailPage; 