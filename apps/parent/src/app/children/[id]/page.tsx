'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../../components/Layout';
import CourseCard from '../../../components/CourseCard';
import { Card, Progress } from '@3de/ui';
import { 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  Award,
  Clock,
  User,
  Download,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// بيانات تجريبية للطفل
const mockChildData = {
  id: '1',
  name: 'أحمد محمد',
  grade: 'الثالث الثانوي',
  age: 17,
  image: '/api/placeholder/150/150',
  attendance: 95,
  averageScore: 92,
  totalCourses: 4,
  completedCourses: 3,
  totalLessons: 120,
  completedLessons: 98,
  lastActivity: 'منذ ساعتين',
  courses: [
    {
      id: '1',
      title: 'الخانكةيات المتقدمة',
      description: 'دورة شاملة في الخانكةيات للمرحلة الثانوية',
      instructor: 'د. محمد أحمد',
      duration: 60,
      progress: 85,
      totalLessons: 30,
      completedLessons: 25,
      grade: 92,
      status: 'active' as const,
      startDate: '2024-01-15',
      endDate: '2024-06-15',
    },
    {
      id: '2',
      title: 'الفيزياء',
      description: 'أساسيات الفيزياء والحركة',
      instructor: 'د. فاطمة علي',
      duration: 45,
      progress: 100,
      totalLessons: 25,
      completedLessons: 25,
      grade: 95,
      status: 'completed' as const,
      startDate: '2023-09-01',
      endDate: '2024-01-15',
    },
    {
      id: '3',
      title: 'اللغة الإنجليزية',
      description: 'تحسين مهارات اللغة الإنجليزية',
      instructor: 'أ. سارة محمد',
      duration: 40,
      progress: 70,
      totalLessons: 20,
      completedLessons: 14,
      grade: 88,
      status: 'active' as const,
      startDate: '2024-02-01',
      endDate: '2024-07-01',
    },
  ],
  attendanceHistory: [
    { date: '2024-03-01', status: 'present' },
    { date: '2024-03-02', status: 'present' },
    { date: '2024-03-03', status: 'absent' },
    { date: '2024-03-04', status: 'present' },
    { date: '2024-03-05', status: 'present' },
    { date: '2024-03-06', status: 'late' },
    { date: '2024-03-07', status: 'present' },
    { date: '2024-03-08', status: 'present' },
  ],
  recentGrades: [
    { subject: 'الخانكةيات', grade: 92, date: '2024-03-01' },
    { subject: 'الفيزياء', grade: 95, date: '2024-02-28' },
    { subject: 'اللغة الإنجليزية', grade: 88, date: '2024-02-25' },
    { subject: 'الكيمياء', grade: 90, date: '2024-02-20' },
  ],
};

export default function ChildDetails() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [childData, setChildData] = useState(mockChildData);

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

  const handleCourseClick = (courseId: string) => {
    router.push(`/parent/courses/${courseId}`);
  };

  const handleExportReport = () => {
    // هنا سيتم إضافة منطق تصدير التقرير
    console.log('تصدير تقرير الطفل');
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'absent':
        return 'bg-red-500';
      case 'late':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-primary-main';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
                {childData.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                الصف {childData.grade} • {childData.age} سنة
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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">معدل الحضور</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {childData.attendance}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-main dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">المعدل العام</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {childData.averageScore}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الكورسات المكتملة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {childData.completedCourses}/{childData.totalCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الدروس المكتملة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {childData.completedLessons}/{childData.totalLessons}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                الكورسات المسجلة
              </h2>
              <button
                onClick={() => router.push('/parent/courses')}
                className="text-primary-main hover:text-primary-main text-sm font-medium"
              >
                عرض الكل
              </button>
            </div>
            <div className="space-y-4">
              {childData.courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Grades */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                الدرجات الأخيرة
              </h3>
              <div className="space-y-3">
                {childData.recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{grade.subject}</p>
                      <p className="text-sm text-gray-500">{grade.date}</p>
                    </div>
                    <div className={`text-lg font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Attendance Calendar */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                سجل الحضور (آخر 8 أيام)
              </h3>
              <div className="grid grid-cols-8 gap-2">
                {childData.attendanceHistory.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${getAttendanceColor(day.status)}`} />
                    <p className="text-xs text-gray-500">
                      {new Date(day.date).toLocaleDateString('ar-SA', { day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>حاضر</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>غائب</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>متأخر</span>
                </div>
              </div>
            </Card>

            {/* Performance Insights */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                تحليل الأداء
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">أداء ممتاز</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      يتجاوز المعدل العام للفصل
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">تحسين مطلوب</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      في مادة اللغة الإنجليزية
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