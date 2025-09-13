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
import { userApi, courseApi, instructorApi, enrollmentApi, notificationApi } from '@3de/apis';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddCourse from '../components/dialogs/AddCourse';
import AddInstructor from '../components/dialogs/AddInstructor';
import { useAuth } from '@3de/auth';

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
  const router = useRouter();
  let [isADDCOURSEDialogOpen, setIsADDCOURSEDialogOpen] = useState(false);
  let [isADDINSTRUCTORDialogOpen, setIsADDINSTRUCTORDialogOpen] = useState(false);
  const { user } = useAuth();
  // Fetch dashboard data
  const { data: usersData, isLoading: usersLoading, refetch: usersRefetch } = useQuery({
    queryKey: ['users', 1, 10, ''],
    queryFn: () => userApi.getAll(1, 10, '',true),
  });
  const { data: notificationsData, isLoading: notificationsLoading, refetch: notificationsRefetch } = useQuery({
    queryKey: ['notifications',user?.id],
    queryFn: () => notificationApi.getAllByUserId(user?.id ?? "",0,10,""),
    enabled: !!user?.id,
  });
  const { data: coursesData, isLoading: coursesLoading, refetch: coursesRefetch } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });

  const { data: instructorsData, isLoading: instructorsLoading, refetch: instructorsRefetch } = useQuery({
    queryKey: ['instructors', 0, 10, ''],
    queryFn: () => instructorApi.getAll(0, 10, ''),
  });

  const { data: enrollmentsData, isLoading: enrollmentsLoading, refetch: enrollmentsRefetch } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentApi.getAll(),
  });
  const formatDate = (date: any) => {
    if (!date) return 'غير محدد';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('ar-EG');
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('ar-EG');
    }
    return 'غير محدد';
  };
  // Quick stats data
  let notifications=notificationsData?.data.data?.map((activity, index:number) => {
    return {
      ...activity,
      icon: activity.type === 'ASSIGNMENT' ? UserCheck : activity.type === 'GRADE' ? Award : activity.type === 'MESSAGE' ? BookOpen : activity.type === 'ACHIEVEMENT' ? UserCheck : activity.type === 'URGENT' ? Award : activity.type === 'EVENT' ? BookOpen : activity.type === 'ABSENCE' ? BookOpen : UserCheck,
      color: activity.type === 'ASSIGNMENT' ? 'bg-green-500' : activity.type === 'GRADE' ? 'bg-yellow-500' : activity.type === 'MESSAGE' ? 'bg-blue-500' : activity.type === 'ACHIEVEMENT' ? 'bg-purple-500' : activity.type === 'URGENT' ? 'bg-red-500' : activity.type === 'EVENT' ? 'bg-orange-500' : activity.type === 'ABSENCE' ? 'bg-blue-500' : 'bg-purple-500',
    }
  })
  
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
              {formatDate(new Date())}
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
            <button className="text-sm text-primary-main hover:text-primary-dark font-medium" onClick={() => router.push('/notifications')}>
              عرض الكل
            </button>
          </div>
          
          <div className="space-y-4">
            {notifications?.map((activity, index:number) => (
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
                  <p className="text-xs text-gray-500 mt-1">{new Date(activity.createdAt).toLocaleDateString('ar-EG',{hour:'2-digit',minute:'2-digit'})}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {notifications?.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">لا يوجد نشاط حدث</p>
            </div>
          )}
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
            <button className="w-full bg-gradient-to-r from-primary-main to-primary-dark text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 cursor-pointer" onClick={() => setIsADDCOURSEDialogOpen(true)}>
              <BookOpen className="w-5 h-5" />
              إضافة كورس جديد
            </button>
            
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 cursor-pointer" onClick={() => setIsADDINSTRUCTORDialogOpen(true)} >
              <GraduationCap className="w-5 h-5" />
              إضافة محاضر
            </button>
            
            <button className="w-full bg-gradient-to-r from-secondary-main to-primary-main text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 cursor-pointer" onClick={() => router.push('/students')}>
              <Users className="w-5 h-5" />
              إدارة الطلاب
            </button>
            
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2 cursor-pointer">
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
      <AddCourse isOpen={isADDCOURSEDialogOpen} onClose={() => setIsADDCOURSEDialogOpen(false)} refetch={()=>{instructorsRefetch();usersRefetch();coursesRefetch();enrollmentsRefetch()}} />
      <AddInstructor isOpen={isADDINSTRUCTORDialogOpen} onClose={() => setIsADDINSTRUCTORDialogOpen(false)} refetch={()=>{instructorsRefetch();usersRefetch();coursesRefetch();enrollmentsRefetch()}} />
    </div>
  );
}
