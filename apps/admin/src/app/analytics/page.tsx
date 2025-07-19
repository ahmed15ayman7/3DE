'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BarChart,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Clock,
  Target,
  Activity,
  Eye,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  userApi, 
  courseApi, 
  enrollmentApi, 
  attendanceApi, 
  quizApi,
  achievementApi,
  lessonApi
} from '@3de/apis';
import { Button, Input } from '@3de/ui';

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30'); // Last 30 days
  const [filterType, setFilterType] = useState('ALL');

  // Fetch all data for analytics
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users-analytics'],
    queryFn: () => userApi.getAll(1, 1000, ''),
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses-analytics'],
    queryFn: () => courseApi.getAll(),
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments-analytics'],
    queryFn: () => enrollmentApi.getAll(),
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-analytics'],
    queryFn: () => attendanceApi.getAll(),
  });

  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements-analytics'],
    queryFn: () => achievementApi.getAll(),
  });

  const users = usersData?.data || [];
  const courses = coursesData?.data || [];
  const enrollments = enrollmentsData?.data || [];
  const attendance = attendanceData?.data || [];
  const achievements = achievementsData?.data || [];

  const students = users.filter(user => user.role === 'STUDENT');
  const instructors = users.filter(user => user.role === 'INSTRUCTOR');

  // Calculate key metrics
  const totalStudents = students.length;
  const totalInstructors = instructors.length;
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;

  // Attendance rate
  const totalAttendance = attendance.length;
  const presentAttendance = attendance.filter((a: any) => a.status === 'PRESENT').length;
  const attendanceRate = totalAttendance > 0 ? (presentAttendance / totalAttendance) * 100 : 0;

  // Course completion rate
  const completedEnrollments = enrollments.filter(e => e.progress === 100).length;
  const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

  // Active students (students with enrollments)
  const activeStudents = students.filter(student => 
    enrollments.some(enrollment => enrollment.userId === student.id)
  ).length;

  // Average course progress
  const averageProgress = totalEnrollments > 0 
    ? enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) / totalEnrollments 
    : 0;

  // Monthly enrollment trend (mock data for visualization)
  const monthlyData = [
    { month: 'يناير', enrollments: 45, completions: 12 },
    { month: 'فبراير', enrollments: 62, completions: 18 },
    { month: 'مارس', enrollments: 78, completions: 25 },
    { month: 'أبريل', enrollments: 85, completions: 32 },
    { month: 'مايو', enrollments: 92, completions: 41 },
    { month: 'يونيو', enrollments: 103, completions: 48 },
  ];

  // Top performing courses
  const coursePerformance = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
    const avgProgress = courseEnrollments.length > 0 
      ? courseEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / courseEnrollments.length 
      : 0;
    
    return {
      ...course,
      enrollmentCount: courseEnrollments.length,
      averageProgress: avgProgress
    };
  }).sort((a, b) => b.averageProgress - a.averageProgress).slice(0, 5);

  // Student engagement levels
  const engagementLevels = {
    high: students.filter(student => {
      const studentEnrollments = enrollments.filter(e => e.userId === student.id);
      const avgProgress = studentEnrollments.length > 0 
        ? studentEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / studentEnrollments.length 
        : 0;
      return avgProgress >= 80;
    }).length,
    medium: students.filter(student => {
      const studentEnrollments = enrollments.filter(e => e.userId === student.id);
      const avgProgress = studentEnrollments.length > 0 
        ? studentEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / studentEnrollments.length 
        : 0;
      return avgProgress >= 40 && avgProgress < 80;
    }).length,
    low: students.filter(student => {
      const studentEnrollments = enrollments.filter(e => e.userId === student.id);
      const avgProgress = studentEnrollments.length > 0 
        ? studentEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / studentEnrollments.length 
        : 0;
      return avgProgress < 40;
    }).length
  };

  const isLoading = usersLoading || coursesLoading || enrollmentsLoading || attendanceLoading || achievementsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">التحليلات والتقارير</h1>
          <p className="text-gray-600 mt-1">
            مراقبة الأداء والإحصائيات التفصيلية للمنصة
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-5 h-5 ml-2" />
            تصدير التقرير
          </Button>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="w-5 h-5 ml-2" />
            تحديث البيانات
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">آخر 7 أيام</option>
              <option value="30">آخر 30 يوم</option>
              <option value="90">آخر 3 أشهر</option>
              <option value="365">آخر سنة</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع التحليل</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">جميع البيانات</option>
              <option value="STUDENTS">الطلاب فقط</option>
              <option value="COURSES">الكورسات فقط</option>
              <option value="ENGAGEMENT">المشاركة فقط</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Filter className="w-4 h-4 ml-2" />
              تطبيق الفلاتر
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 ml-1" />
                +12% عن الشهر الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الكورسات النشطة</p>
              <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 ml-1" />
                +8% عن الشهر الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل الحضور</p>
              <p className="text-3xl font-bold text-gray-900">{attendanceRate.toFixed(1)}%</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="w-4 h-4 ml-1" />
                -3% عن الشهر الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">معدل الإكمال</p>
              <p className="text-3xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 ml-1" />
                +5% عن الشهر الماضي
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">اتجاه الاشتراكات الشهرية</h3>
            <BarChart className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-16">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(month.enrollments / 120) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-blue-600 font-medium">{month.enrollments}</span>
                  <span className="text-green-600">({month.completions} مكتمل)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Student Engagement Levels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">مستويات مشاركة الطلاب</h3>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-900">مشاركة عالية</p>
                <p className="text-sm text-green-600">80% فأكثر من التقدم</p>
              </div>
              <div className="text-2xl font-bold text-green-600">{engagementLevels.high}</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-semibold text-yellow-900">مشاركة متوسطة</p>
                <p className="text-sm text-yellow-600">40% - 79% من التقدم</p>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{engagementLevels.medium}</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-red-900">مشاركة منخفضة</p>
                <p className="text-sm text-red-600">أقل من 40% من التقدم</p>
              </div>
              <div className="text-2xl font-bold text-red-600">{engagementLevels.low}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performing Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">أفضل الكورسات أداءً</h3>
          <Award className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-700">الكورس</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">المستوى</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">الاشتراكات</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">متوسط التقدم</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">التقييم</th>
              </tr>
            </thead>
            <tbody>
              {coursePerformance.map((course, index) => (
                <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{course.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-48">{course.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {course.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">{course.enrollmentCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.averageProgress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(course.averageProgress)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 rounded-sm ${
                            i < Math.floor(course.averageProgress / 20) ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
          <p className="text-gray-600">طلاب نشطين</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : 0}% من إجمالي الطلاب
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Award className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
          <p className="text-gray-600">إنجازات محققة</p>
          <p className="text-sm text-gray-500 mt-1">
            متوسط {totalStudents > 0 ? (achievements.length / totalStudents).toFixed(1) : 0} إنجاز لكل طالب
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Activity className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{averageProgress.toFixed(1)}%</p>
          <p className="text-gray-600">متوسط التقدم</p>
          <p className="text-sm text-gray-500 mt-1">
            عبر جميع الكورسات والطلاب
          </p>
        </div>
      </motion.div>
    </div>
  );
} 