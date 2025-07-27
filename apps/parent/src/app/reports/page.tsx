'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@3de/auth';
import Layout from '../../components/Layout';
import { Card } from '@3de/ui';
import { 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Filter,
  Eye
} from 'lucide-react';

// بيانات تجريبية للتقارير
const mockReports = [
  {
    id: '1',
    title: 'تقرير شهري - مارس 2024',
    type: 'monthly',
    childName: 'أحمد محمد',
    date: '2024-03-31',
    status: 'completed',
    summary: {
      attendance: 95,
      averageScore: 92,
      completedCourses: 3,
      totalLessons: 120,
      completedLessons: 98,
    }
  },
  {
    id: '2',
    title: 'تقرير فصلي - الفصل الثاني',
    type: 'semester',
    childName: 'فاطمة أحمد',
    date: '2024-02-28',
    status: 'completed',
    summary: {
      attendance: 88,
      averageScore: 85,
      completedCourses: 2,
      totalLessons: 80,
      completedLessons: 65,
    }
  },
  {
    id: '3',
    title: 'تقرير سنوي - 2023',
    type: 'yearly',
    childName: 'علي حسن',
    date: '2023-12-31',
    status: 'completed',
    summary: {
      attendance: 92,
      averageScore: 89,
      completedCourses: 4,
      totalLessons: 150,
      completedLessons: 120,
    }
  },
];

const reportTypes = [
  { value: 'all', label: 'جميع التقارير' },
  { value: 'monthly', label: 'تقارير شهرية' },
  { value: 'semester', label: 'تقارير فصول' },
  { value: 'yearly', label: 'تقارير سنوية' },
  { value: 'custom', label: 'تقارير مخصصة' },
];

export default function ReportsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedChild, setSelectedChild] = useState('all');
  const [dateRange, setDateRange] = useState('last-month');

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

  const handleGenerateReport = () => {
    // هنا سيتم إضافة منطق إنشاء التقرير
    console.log('إنشاء تقرير جديد');
  };

  const handleDownloadReport = (reportId: string) => {
    // هنا سيتم إضافة منطق تحميل التقرير
    console.log('تحميل التقرير:', reportId);
  };

  const handleViewReport = (reportId: string) => {
    // هنا سيتم إضافة منطق عرض التقرير
    console.log('عرض التقرير:', reportId);
  };

  const filteredReports = mockReports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (selectedChild !== 'all' && report.childName !== selectedChild) return false;
    return true;
  });

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              التقارير
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              عرض وتصدير تقارير أداء الأبناء
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>إنشاء تقرير جديد</span>
          </button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              تصفية التقارير
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                نوع التقرير
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الطفل
              </label>
              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="all">جميع الأبناء</option>
                <option value="أحمد محمد">أحمد محمد</option>
                <option value="فاطمة أحمد">فاطمة أحمد</option>
                <option value="علي حسن">علي حسن</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                الفترة الزمنية
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="last-week">آخر أسبوع</option>
                <option value="last-month">آخر شهر</option>
                <option value="last-semester">آخر فصل</option>
                <option value="last-year">آخر سنة</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.childName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewReport(report.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadReport(report.id)}
                    className="p-2 text-primary-main hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Report Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">معدل الحضور</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {report.summary.attendance}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">المعدل العام</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {report.summary.averageScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">الكورسات المكتملة</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {report.summary.completedCourses}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">الدروس المكتملة</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {report.summary.completedLessons}/{report.summary.totalLessons}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500">
                  {new Date(report.date).toLocaleDateString('ar-SA')}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600 dark:text-green-400">
                    مكتمل
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-primary-main dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي التقارير</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredReports.length}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">تقارير هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">معدل التحسن</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">+12%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">أفضل أداء</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Report Templates */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            قوالب التقارير الجاهزة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right">
              <BarChart3 className="w-5 h-5 text-primary-main" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">تقرير الأداء الشامل</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">يشمل جميع المؤشرات</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">تقرير الحضور</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">تفاصيل الحضور والغياب</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-right">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">تقرير الكورسات</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">تقدم في الكورسات</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
} 