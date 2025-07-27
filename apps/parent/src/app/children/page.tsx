'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../components/Layout';
import ChildCard from '../../components/ChildCard';
import { Card, Input } from '@3de/ui';
import { 
  Search, 
  Filter, 
  Plus,
  Users,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

// بيانات تجريبية للأبناء
const mockChildren = [
  {
    id: '1',
    name: 'أحمد محمد',
    grade: 'الثالث الثانوي',
    age: 17,
    attendance: 95,
    averageScore: 92,
    enrolledCourses: 4,
    completedCourses: 3,
    lastActivity: 'منذ ساعتين',
  },
  {
    id: '2',
    name: 'فاطمة أحمد',
    grade: 'الأول الثانوي',
    age: 15,
    attendance: 88,
    averageScore: 85,
    enrolledCourses: 3,
    completedCourses: 2,
    lastActivity: 'منذ يوم',
  },
  {
    id: '3',
    name: 'علي حسن',
    grade: 'الثاني الإعدادي',
    age: 13,
    attendance: 92,
    averageScore: 89,
    enrolledCourses: 2,
    completedCourses: 1,
    lastActivity: 'منذ 3 أيام',
  },
  {
    id: '4',
    name: 'سارة محمود',
    grade: 'الرابع الابتدائي',
    age: 10,
    attendance: 98,
    averageScore: 96,
    enrolledCourses: 1,
    completedCourses: 1,
    lastActivity: 'منذ 5 ساعات',
  },
];

export default function ChildrenPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [sortBy, setSortBy] = useState('name');

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

  const handleChildClick = (childId: string) => {
    router.push(`/parent/children/${childId}`);
  };

  const handleAddChild = () => {
    // هنا سيتم إضافة منطق إضافة طفل جديد
    console.log('إضافة طفل جديد');
  };

  // تصفية وترتيب الأبناء
  const filteredAndSortedChildren = mockChildren
    .filter(child => {
      const matchesSearch = child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           child.grade.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = selectedGrade === 'all' || child.grade === selectedGrade;
      return matchesSearch && matchesGrade;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'grade':
          return a.grade.localeCompare(b.grade);
        case 'attendance':
          return b.attendance - a.attendance;
        case 'score':
          return b.averageScore - a.averageScore;
        default:
          return 0;
      }
    });

  // إحصائيات عامة
  const stats = {
    totalChildren: mockChildren.length,
    averageAttendance: Math.round(mockChildren.reduce((sum, child) => sum + child.attendance, 0) / mockChildren.length),
    averageScore: Math.round(mockChildren.reduce((sum, child) => sum + child.averageScore, 0) / mockChildren.length),
    totalCourses: mockChildren.reduce((sum, child) => sum + child.enrolledCourses, 0),
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              الأبناء
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة ومتابعة أداء أبنائك التعليمي
            </p>
          </div>
          <button
            onClick={handleAddChild}
            className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طفل</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="w-6 h-6 text-primary-main dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الأبناء</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalChildren}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">معدل الحضور العام</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageAttendance}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">المعدل العام</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageScore}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الكورسات</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث بالاسم أو المرحلة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع المراحل</option>
              <option value="الرابع الابتدائي">الرابع الابتدائي</option>
              <option value="الثاني الإعدادي">الثاني الإعدادي</option>
              <option value="الأول الثانوي">الأول الثانوي</option>
              <option value="الثالث الثانوي">الثالث الثانوي</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="name">ترتيب بالاسم</option>
              <option value="grade">ترتيب بالمرحلة</option>
              <option value="attendance">ترتيب بالحضور</option>
              <option value="score">ترتيب بالدرجات</option>
            </select>
          </div>
        </Card>

        {/* Children Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              قائمة الأبناء ({filteredAndSortedChildren.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              انقر على أي طفل لعرض تفاصيله
            </p>
          </div>

          {filteredAndSortedChildren.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                جرب تغيير معايير البحث أو إضافة طفل جديد
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedChildren.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onClick={() => handleChildClick(child.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/parent/reports')}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
            >
              <Award className="w-5 h-5 text-primary-main" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">إنشاء تقرير شامل</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  تقرير عن أداء جميع الأبناء
                </p>
              </div>
            </button>
            <button
              onClick={() => router.push('/parent/courses')}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
            >
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">متابعة الكورسات</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  عرض جميع الكورسات المسجلة
                </p>
              </div>
            </button>
            <button
              onClick={handleAddChild}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right"
            >
              <Plus className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">إضافة طفل جديد</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  تسجيل طفل جديد للمتابعة
                </p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 