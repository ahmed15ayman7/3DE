'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../components/Layout';
import ChildCard from '../components/ChildCard';
import { Card } from '@3de/ui';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Award,
  BarChart3,
  Download,
  Bell
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
];

// إحصائيات عامة
const stats = [
  {
    title: 'إجمالي الأبناء',
    value: '3',
    icon: Users,
    color: 'text-primary-main bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  },
  {
    title: 'الكورسات النشطة',
    value: '9',
    icon: BookOpen,
    color: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
  },
  {
    title: 'معدل الحضور',
    value: '91.7%',
    icon: Calendar,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
  },
  {
    title: 'المعدل العام',
    value: '88.7%',
    icon: TrendingUp,
    color: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300',
  },
];

export default function ParentDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [recentNotifications] = useState([
    {
      id: '1',
      title: 'تم إكمال كورس الخانكةيات',
      message: 'أحمد أكمل كورس الخانكةيات بنجاح',
      time: 'منذ ساعتين',
      type: 'success',
    },
    {
      id: '2',
      title: 'تذكير بموعد الاختبار',
      message: 'اختبار اللغة الإنجليزية غداً',
      time: 'منذ 4 ساعات',
      type: 'warning',
    },
    {
      id: '3',
      title: 'تقرير شهري جديد',
      message: 'تم إصدار التقرير الشهري لأداء الأبناء',
      time: 'منذ يوم',
      type: 'info',
    },
  ]);

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

  const handleExportReport = () => {
    // هنا سيتم إضافة منطق تصدير التقرير
    console.log('تصدير التقرير');
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              مرحباً، {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              نظرة عامة على أداء أبنائك التعليمي
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>تصدير التقرير</span>
            </button>
            <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Children Cards */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                أداء الأبناء
              </h2>
              <button
                onClick={() => router.push('/parent/children')}
                className="text-primary-main hover:text-primary-main text-sm font-medium"
              >
                عرض الكل
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockChildren.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  onClick={() => handleChildClick(child.id)}
                />
              ))}
            </div>
          </div>

          {/* Notifications Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                الإشعارات الأخيرة
              </h2>
              <button className="text-primary-main hover:text-primary-main text-sm font-medium">
                عرض الكل
              </button>
            </div>
            <div className="space-y-4">
              {recentNotifications.map((notification) => (
                <Card key={notification.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      'bg-primary-main'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            إجراءات سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/parent/reports')}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <BarChart3 className="w-5 h-5 text-primary-main" />
              <span className="text-gray-900 dark:text-white">عرض التقارير</span>
            </button>
            <button
              onClick={() => router.push('/parent/courses')}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-green-600" />
              <span className="text-gray-900 dark:text-white">متابعة الكورسات</span>
            </button>
            <button
              onClick={() => router.push('/parent/settings')}
              className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-gray-900 dark:text-white">الإعدادات</span>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
