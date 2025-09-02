'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../../components/Layout';
import { Card, Progress } from '@3de/ui';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  User, 
  Star,
  CheckCircle,
  Play,
  Calendar,
  Award,
  Download,
  BarChart3
} from 'lucide-react';

// بيانات تجريبية للكورس
const mockCourseData = {
  id: '1',
  title: 'الخانكةيات المتقدمة',
  description: 'دورة شاملة في الخانكةيات للمرحلة الثانوية تغطي جميع المواضيع الأساسية والمتقدمة',
  instructor: 'د. محمد أحمد',
  duration: 60,
  progress: 85,
  totalLessons: 30,
  completedLessons: 25,
  grade: 92,
  status: 'active' as const,
  startDate: '2024-01-15',
  endDate: '2024-06-15',
  childName: 'أحمد محمد',
  childId: '1',
  lessons: [
    {
      id: '1',
      title: 'مقدمة في الجبر',
      duration: 45,
      status: 'completed',
      completedAt: '2024-01-20',
      grade: 95,
    },
    {
      id: '2',
      title: 'المعادلات الخطية',
      duration: 60,
      status: 'completed',
      completedAt: '2024-01-25',
      grade: 88,
    },
    {
      id: '3',
      title: 'المعادلات التربيعية',
      duration: 75,
      status: 'completed',
      completedAt: '2024-02-01',
      grade: 92,
    },
    {
      id: '4',
      title: 'الدوال',
      duration: 90,
      status: 'in-progress',
      completedAt: null,
      grade: null,
    },
    {
      id: '5',
      title: 'المشتقات',
      duration: 120,
      status: 'not-started',
      completedAt: null,
      grade: null,
    },
  ],
  assignments: [
    {
      id: '1',
      title: 'واجب الجبر الأول',
      dueDate: '2024-01-30',
      submittedAt: '2024-01-28',
      grade: 90,
      status: 'submitted',
    },
    {
      id: '2',
      title: 'واجب المعادلات',
      dueDate: '2024-02-15',
      submittedAt: '2024-02-12',
      grade: 85,
      status: 'submitted',
    },
    {
      id: '3',
      title: 'واجب الدوال',
      dueDate: '2024-03-01',
      submittedAt: null,
      grade: null,
      status: 'pending',
    },
  ],
  quizzes: [
    {
      id: '1',
      title: 'اختبار الجبر',
      date: '2024-01-25',
      grade: 92,
      totalQuestions: 20,
      correctAnswers: 18,
    },
    {
      id: '2',
      title: 'اختبار المعادلات',
      date: '2024-02-10',
      grade: 88,
      totalQuestions: 25,
      correctAnswers: 22,
    },
  ],
};

export default function CourseDetails() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [courseData, setCourseData] = useState(mockCourseData);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-main"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const handleExportReport = () => {
    // هنا سيتم إضافة منطق تصدير التقرير
    console.log('تصدير تقرير الكورس');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'text-primary-main bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'not-started':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'in-progress':
        return 'قيد التنفيذ';
      case 'not-started':
        return 'لم يبدأ';
      default:
        return 'غير محدد';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {courseData.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {courseData.childName} • {courseData.instructor}
              </p>
            </div>
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير التقرير</span>
          </button>
        </div>

        {/* Course Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Info */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-main to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {courseData.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {courseData.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{courseData.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{courseData.duration} ساعة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{courseData.startDate} - {courseData.endDate}</span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(courseData.status)}`}>
                  {getStatusText(courseData.status)}
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">التقدم في الكورس</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {courseData.progress}%
                  </span>
                </div>
                <Progress value={courseData.progress} className="h-3 mb-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{courseData.completedLessons} درس مكتمل</span>
                  <span>من {courseData.totalLessons} درس</span>
                </div>
              </div>

              {/* Grade Section */}
              {courseData.grade && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">الدرجة النهائية</span>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {courseData.grade}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Lessons */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                الدروس ({courseData.lessons.length})
              </h3>
              <div className="space-y-3">
                {courseData.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {lesson.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : lesson.status === 'in-progress' ? (
                        <Play className="w-5 h-5 text-primary-main" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h4>
                        <p className="text-sm text-gray-500">{lesson.duration} دقيقة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {lesson.grade && (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {lesson.grade}%
                        </span>
                      )}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                        {getStatusText(lesson.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Assignments */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                الواجبات ({courseData.assignments.length})
              </h3>
              <div className="space-y-3">
                {courseData.assignments.map((assignment) => (
                  <div key={assignment.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                      {assignment.title}
                    </h4>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>تاريخ الاستحقاق: {assignment.dueDate}</span>
                      {assignment.grade && (
                        <span className="font-medium text-gray-900 dark:text-white">
                          {assignment.grade}%
                        </span>
                      )}
                    </div>
                    <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                      assignment.status === 'submitted' ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' :
                      'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {assignment.status === 'submitted' ? 'تم التسليم' : 'في الانتظار'}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quizzes */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                الاختبارات ({courseData.quizzes.length})
              </h3>
              <div className="space-y-3">
                {courseData.quizzes.map((quiz) => (
                  <div key={quiz.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                      {quiz.title}
                    </h4>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>التاريخ:</span>
                        <span>{quiz.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الدرجة:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{quiz.grade}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الإجابات الصحيحة:</span>
                        <span>{quiz.correctAnswers}/{quiz.totalQuestions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                تحليل الأداء
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">أداء ممتاز</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      يتجاوز المعدل العام للكورس
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-primary-main" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">معدل إكمال عالي</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((courseData.completedLessons / courseData.totalLessons) * 100)}% من الدروس مكتملة
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
} 