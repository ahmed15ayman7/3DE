'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../components/Layout';
import CourseCard from '../../components/CourseCard';
import { Card, Input } from '@3de/ui';
import { 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

// بيانات تجريبية للكورسات
const mockCourses = [
  {
    id: '1',
    title: 'الرياضيات المتقدمة',
    description: 'دورة شاملة في الرياضيات للمرحلة الثانوية',
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
    childName: 'أحمد محمد',
    childId: '1',
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
    childName: 'فاطمة أحمد',
    childId: '2',
  },
  {
    id: '4',
    title: 'العلوم',
    description: 'مفاهيم أساسية في العلوم',
    instructor: 'د. أحمد حسن',
    duration: 35,
    progress: 60,
    totalLessons: 18,
    completedLessons: 11,
    grade: undefined,
    status: 'active' as const,
    startDate: '2024-03-01',
    endDate: '2024-08-01',
    childName: 'علي حسن',
    childId: '3',
  },
  {
    id: '5',
    title: 'القراءة والكتابة',
    description: 'تطوير مهارات القراءة والكتابة',
    instructor: 'أ. نورا محمود',
    duration: 30,
    progress: 100,
    totalLessons: 15,
    completedLessons: 15,
    grade: 98,
    status: 'completed' as const,
    startDate: '2024-01-01',
    endDate: '2024-03-01',
    childName: 'سارة محمود',
    childId: '4',
  },
];

export default function CoursesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedChild, setSelectedChild] = useState('all');
  const [sortBy, setSortBy] = useState('title');

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

  // تصفية وترتيب الكورسات
  const filteredAndSortedCourses = mockCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
      const matchesChild = selectedChild === 'all' || course.childId === selectedChild;
      return matchesSearch && matchesStatus && matchesChild;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'progress':
          return b.progress - a.progress;
        case 'grade':
          return (b.grade || 0) - (a.grade || 0);
        case 'child':
          return a.childName.localeCompare(b.childName);
        default:
          return 0;
      }
    });

  // إحصائيات عامة
  const stats = {
    totalCourses: mockCourses.length,
    activeCourses: mockCourses.filter(c => c.status === 'active').length,
    completedCourses: mockCourses.filter(c => c.status === 'completed').length,
    averageProgress: Math.round(mockCourses.reduce((sum, course) => sum + course.progress, 0) / mockCourses.length),
    averageGrade: Math.round(mockCourses.filter(c => c.grade).reduce((sum, course) => sum + (course.grade || 0), 0) / mockCourses.filter(c => c.grade).length),
  };

  // قائمة الأبناء الفريدة
  const uniqueChildren = Array.from(new Set(mockCourses.map(course => ({ id: course.childId, name: course.childName }))));

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            الكورسات
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            متابعة تقدم أبنائك في الكورسات المسجلة
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-main dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الكورسات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الكورسات النشطة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.activeCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">الكورسات المكتملة</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">متوسط التقدم</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageProgress}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">متوسط الدرجات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageGrade}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              تصفية وبحث
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث في الكورسات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="completed">مكتمل</option>
              <option value="pending">في الانتظار</option>
            </select>
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع الأبناء</option>
              {uniqueChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="title">ترتيب بالعنوان</option>
              <option value="progress">ترتيب بالتقدم</option>
              <option value="grade">ترتيب بالدرجات</option>
              <option value="child">ترتيب بالطفل</option>
            </select>
          </div>
        </Card>

        {/* Courses Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              قائمة الكورسات ({filteredAndSortedCourses.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              انقر على أي كورس لعرض تفاصيله
            </p>
          </div>

          {filteredAndSortedCourses.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                جرب تغيير معايير البحث
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Course Progress Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ملخص التقدم حسب الطفل
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {uniqueChildren.map((child) => {
              const childCourses = mockCourses.filter(c => c.childId === child.id);
              const averageProgress = Math.round(childCourses.reduce((sum, course) => sum + course.progress, 0) / childCourses.length);
              const completedCourses = childCourses.filter(c => c.status === 'completed').length;
              
              return (
                <div key={child.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">{child.name}</h4>
                    <span className="text-sm text-gray-500">{childCourses.length} كورس</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">متوسط التقدم</span>
                      <span className="font-medium text-gray-900 dark:text-white">{averageProgress}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">الكورسات المكتملة</span>
                      <span className="font-medium text-gray-900 dark:text-white">{completedCourses}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Layout>
  );
} 