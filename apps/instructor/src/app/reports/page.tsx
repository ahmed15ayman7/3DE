'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Select, Input, Badge } from '@3de/ui';
import ChartBox from '../../components/ChartBox';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Mock data للتقارير
  const reportsData = {
    overview: {
      totalStudents: 156,
      activeCourses: 8,
      completedCourses: 12,
      totalRevenue: 185000,
      averageRating: 4.7,
      completionRate: 78
    },
    trends: [
      { name: 'يناير', students: 120, revenue: 145000, courses: 6 },
      { name: 'فبراير', students: 135, revenue: 162000, courses: 7 },
      { name: 'مارس', students: 148, revenue: 178000, courses: 8 },
      { name: 'أبريل', students: 156, revenue: 185000, courses: 8 }
    ],
    topCourses: [
      { name: 'البرمجة المتقدمة', students: 45, revenue: 54000, rating: 4.9 },
      { name: 'JavaScript للمبتدئين', students: 38, revenue: 38000, rating: 4.8 },
      { name: 'React الأساسيات', students: 32, revenue: 32000, rating: 4.7 },
      { name: 'قواعد البيانات', students: 28, revenue: 28000, rating: 4.6 }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التقارير والإحصائيات</h1>
          <p className="text-gray-600">تحليل شامل لأداء الكورسات والطلاب</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">تصدير التقرير</Button>
          <Button>إنشاء تقرير مخصص</Button>
        </div>
      </div>

      {/* Filters */}
      <Card padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="الفترة الزمنية"
            options={[
              { value: 'week', label: 'آخر أسبوع' },
              { value: 'month', label: 'آخر شهر' },
              { value: 'quarter', label: 'آخر ربع' },
              { value: 'year', label: 'آخر سنة' }
            ]}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />
          <Select
            label="نوع التقرير"
            options={[
              { value: 'overview', label: 'نظرة عامة' },
              { value: 'courses', label: 'تقرير الكورسات' },
              { value: 'students', label: 'تقرير الطلاب' },
              { value: 'financial', label: 'التقرير المالي' }
            ]}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          />
          <Input
            type="date"
            label="من تاريخ"
          />
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card padding="md" className="text-center">
          <div className="text-3xl font-bold text-blue-600">{reportsData.overview.totalStudents}</div>
          <div className="text-sm text-gray-600">إجمالي الطلاب</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-3xl font-bold text-green-600">{reportsData.overview.activeCourses}</div>
          <div className="text-sm text-gray-600">الكورسات النشطة</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-3xl font-bold text-purple-600">{reportsData.overview.completedCourses}</div>
          <div className="text-sm text-gray-600">الكورسات المكتملة</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{reportsData.overview.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">الإيرادات (ريال)</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-3xl font-bold text-red-600">{reportsData.overview.averageRating}</div>
          <div className="text-sm text-gray-600">متوسط التقييم</div>
        </Card>
        <Card padding="md" className="text-center">
          <div className="text-3xl font-bold text-indigo-600">{reportsData.overview.completionRate}%</div>
          <div className="text-sm text-gray-600">معدل الإنجاز</div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="اتجاه الطلاب الشهري"
          type="line"
          data={reportsData.trends.map(item => ({ name: item.name, value: item.students, label: item.name }))}
          className="h-80"
        />
        <ChartBox
          title="الإيرادات الشهرية"
          type="bar"
          data={reportsData.trends.map(item => ({ name: item.name, value: item.revenue, label: item.name }))}
          className="h-80"
        />
      </div>

      {/* Top Courses */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">أفضل الكورسات أداءً</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 text-sm font-medium text-gray-600">الكورس</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">عدد الطلاب</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">الإيرادات</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">التقييم</th>
                <th className="text-right py-3 text-sm font-medium text-gray-600">الأداء</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.topCourses.map((course, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100"
                >
                  <td className="py-4 font-medium text-gray-900">{course.name}</td>
                  <td className="py-4 text-gray-600">{course.students}</td>
                  <td className="py-4 text-gray-600">{course.revenue.toLocaleString()} ريال</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="text-gray-900">{course.rating}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge variant="success">ممتاز</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage; 