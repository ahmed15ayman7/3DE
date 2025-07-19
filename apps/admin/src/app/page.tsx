'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCheck, 
  TrendingUp, 
  Award,
  Calendar,
  BarChart3 
} from 'lucide-react';
import { userApi, courseApi, instructorApi, enrollmentApi } from '@3de/apis';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change, 
  delay = 0 
}: { 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  change?: string; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && (
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {change}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  // Fetch dashboard data
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', 1, 10, ''],
    queryFn: () => userApi.getAll(1, 10, ''),
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });

  const { data: instructorsData, isLoading: instructorsLoading } = useQuery({
    queryKey: ['instructors', 0, 10, ''],
    queryFn: () => instructorApi.getAll(0, 10, ''),
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentApi.getAll(),
  });

  // Quick stats data
  const stats = [
    {
      title: 'إجمالي الطلاب',
      value: usersData?.data?.length || 0,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      change: '+12% هذا الشهر',
    },
    {
      title: 'الكورسات النشطة',
      value: coursesData?.data?.length || 0,
      icon: BookOpen,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      change: '+8% هذا الشهر',
    },
    {
      title: 'المحاضرين',
      value: instructorsData?.data?.length || 0,
      icon: GraduationCap,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      change: '+3 محاضر جديد',
    },
    {
      title: 'الاشتراكات النشطة',
      value: enrollmentsData?.data?.length || 0,
      icon: UserCheck,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      change: '+15% هذا الشهر',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'enrollment',
      message: 'أحمد محمد انضم إلى كورس "البرمجة بـ React"',
      time: 'منذ 5 دقائق',
      icon: UserCheck,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'certificate',
      message: 'فاطمة علي طلبت شهادة إتمام كورس "تطوير الويب"',
      time: 'منذ 10 دقائق',
      icon: Award,
      color: 'text-yellow-600',
    },
    {
      id: 3,
      type: 'course',
      message: 'د. سارة أضافت درس جديد في كورس "قواعد البيانات"',
      time: 'منذ 15 دقيقة',
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      id: 4,
      type: 'exam',
      message: 'محمد حسن أكمل اختبار الوحدة الثالثة بدرجة 95%',
      time: 'منذ 20 دقيقة',
      icon: Calendar,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-1">نظرة عامة على نشاط الأكاديمية</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">آخر تحديث</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">النشاط الأخير</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              عرض الكل
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
          
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-primary-main to-primary-dark text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              إضافة كورس جديد
            </button>
            
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5" />
              إضافة محاضر
            </button>
            
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              إدارة الطلاب
            </button>
            
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5" />
              عرض التقارير
            </button>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">إحصائيات الاشتراكات</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">الرسم البياني قريباً</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">معدل إكمال الكورسات</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">الرسم البياني قريباً</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
