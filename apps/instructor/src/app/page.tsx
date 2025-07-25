'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  ClipboardList,
  Award,
  TrendingUp,
  Calendar,
  Bell,
  MessageSquare,
  Plus,
  Eye,
  Download,
  BarChart3,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { Card, Button, Badge, Avatar, Skeleton, toast } from '@3de/ui'
import { instructorApi, courseApi, userApi } from '@3de/apis'
import { useRouter } from 'next/navigation'
import { useAuth } from '@3de/auth'

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`h-4 w-4 ml-1 ${
                trend === 'down' ? 'rotate-180' : ''
              }`} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </Card>
  </motion.div>
)

const QuickActionCard = ({ title, description, icon: Icon, onClick, color }: any) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card 
      className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary-main"
      onClick={onClick}
    >
      <div className="text-center">
        <div className={`inline-flex p-4 rounded-full ${color} mb-4`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Card>
  </motion.div>
)

const RecentActivity = ({ activities,router }: { activities: any[],router:any }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">الأنشطة الأخيرة</h3>
      <Button variant="ghost" size="sm" onClick={()=>router.push('/instructor/activities')}>
        <Eye className="h-4 w-4 ml-2" />
        عرض الكل
      </Button>
    </div>
    
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 gap-reverse p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className={`p-2 rounded-full ${activity.color}`}>
            <activity.icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-xs text-gray-500">{activity.time}</p>
          </div>
          {activity.badge && (
            <Badge variant="secondary" size="sm">
              {activity.badge}
            </Badge>
          )}
        </motion.div>
      ))}
    </div>
  </Card>
)

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('week')
  const router = useRouter()
  const { user } = useAuth()

  // جلب بيانات dashboard من API
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['instructor-dashboard', user?.id],
    queryFn: () => instructorApi.getDashboardData(user?.id as string),
    enabled: !!user?.id,
  })

  // استخدام البيانات من API أو القيم الافتراضية
  const statistics = dashboardData?.data?.statistics || {
    totalCourses: 0,
    totalStudents: 0,
    activeQuizzes: 0,
    averageProgress: 0,
  }

  const performanceMetrics = dashboardData?.data?.performanceMetrics || {
    assignmentCompletionRate: 0,
    attendanceRate: 0,
    successRate: 0,
    lessonWatchRate: 0,
  }

  const weeklyData = dashboardData?.data?.weeklyData || []
  const recentNotifications = dashboardData?.data?.recentNotifications || []
  const courseCompletionData = dashboardData?.data?.courseCompletionData || []

  // تحويل الإشعارات إلى تنسيق الأنشطة
  const recentActivities = recentNotifications.map((notification, index) => ({
    id: notification.id,
    title: notification.title || notification.message,
    time: new Date(notification.createdAt).toLocaleDateString('ar', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    icon: notification.type === 'ACHIEVEMENT' ? Award : 
          notification.type === 'ASSIGNMENT' ? ClipboardList :
          notification.type === 'MESSAGE' ? MessageSquare : Bell,
    color: notification.read ? 'bg-gray-500' : 'bg-primary-main',
    badge: notification.read ? undefined : 'جديد',
  }))

  // إنشاء بيانات إنجاز الكورسات للرسم البياني
  const pieChartData = (() => {
    if (!courseCompletionData.length) {
      return [
        { name: 'مكتمل', value: 0, color: '#10B981' },
        { name: 'قيد التقدم', value: 0, color: '#3B82F6' },
        { name: 'لم يبدأ', value: 0, color: '#F59E0B' },
      ]
    }

    const totals = courseCompletionData.reduce(
      (acc: any, course: any) => ({
        completed: acc.completed + course.completed,
        inProgress: acc.inProgress + course.inProgress,
        notStarted: acc.notStarted + course.notStarted,
      }),
      { completed: 0, inProgress: 0, notStarted: 0 }
    )

    const total = totals.completed + totals.inProgress + totals.notStarted
    
    if (total === 0) {
      return [
        { name: 'مكتمل', value: 0, color: '#10B981' },
        { name: 'قيد التقدم', value: 0, color: '#3B82F6' },
        { name: 'لم يبدأ', value: 0, color: '#F59E0B' },
      ]
    }

    return [
      { name: 'مكتمل', value: Math.round((totals.completed / total) * 100), color: '#10B981' },
      { name: 'قيد التقدم', value: Math.round((totals.inProgress / total) * 100), color: '#3B82F6' },
      { name: 'لم يبدأ', value: Math.round((totals.notStarted / total) * 100), color: '#F59E0B' },
    ]
  })()

  const quickActions = [
    {
      title: 'كورس جديد',
      description: 'إنشاء كورس تعليمي جديد',
      icon: Plus,
      color: 'bg-primary-main',
      onClick: () => console.log('New course'),
    },
    {
      title: 'اختبار جديد',
      description: 'إضافة اختبار لأحد الكورسات',
      icon: ClipboardList,
      color: 'bg-secondary-main',
      onClick: () => console.log('New quiz'),
    },
    {
      title: 'إضافة درس',
      description: 'إنشاء درس تعليمي جديد',
      icon: BookOpen,
      color: 'bg-accent-main',
      onClick: () => console.log('New lesson'),
    },
    {
      title: 'التقارير',
      description: 'عرض تقارير الأداء',
      icon: BarChart3,
      color: 'bg-warning-main',
      onClick: () => console.log('Reports'),
    },
  ]

  const handleDownload = () => {
    toast.success('  جاري تفعيل الميزة ')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-gray-600 mt-1">
            مرحباً بك في منصة إدارة التعليم الخاصة بك
          </p>
        </div>
        
        <div className="flex items-center gap-3 gap-reverse">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field max-w-32"
          >
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="year">هذا العام</option>
          </select>
          
          <Button variant="primary" className='px-2 ' onClick={()=>handleDownload()}>
            <Download className="h-4 w-4 ml-2 max-md:ml-0" />
           <span className="max-md:hidden">تحميل </span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="إجمالي الكورسات"
              value={statistics.totalCourses.toString()}
              icon={BookOpen}
              trend="up"
              trendValue={`${statistics.totalCourses} كورسات`}
              color="bg-primary-main"
            />
            <StatCard
              title="إجمالي الطلاب"
              value={statistics.totalStudents.toString()}
              icon={Users}
              trend="up"
              trendValue={`${statistics.totalStudents} طالب`}
              color="bg-secondary-main"
            />
            <StatCard
              title="الاختبارات النشطة"
              value={statistics.activeQuizzes.toString()}
              icon={ClipboardList}
              trend="up"
              trendValue={`${statistics.activeQuizzes} اختبار نشط`}
              color="bg-accent-main"
            />
            <StatCard
              title="معدل الإنجاز"
              value={`${statistics.averageProgress}%`}
              icon={Award}
              trend="up"
              trendValue={`معدل عام ${statistics.averageProgress}%`}
              color="bg-warning-main"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          إجراءات سريعة
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                نشاط هذا الأسبوع
              </h3>
              {!isLoading && (
                <div className="flex items-center gap-4 gap-reverse">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-main rounded-full ml-2"></div>
                    <span className="text-sm text-gray-600">الطلاب</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary-main rounded-full ml-2"></div>
                    <span className="text-sm text-gray-600">الاختبارات</span>
                  </div>
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="students" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quizzes" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Recent Activities */}
        <RecentActivity activities={recentActivities} router={router} />
      </div>

      {/* Course Completion and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            معدل إنجاز الكورسات
          </h3>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="w-full h-[250px] rounded-full mx-auto" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="mt-4 space-y-2">
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            مؤشرات الأداء
          </h3>
          
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    معدل مشاهدة الدروس
                  </span>
                  <span className="text-sm font-bold text-primary-main">
                    {performanceMetrics.lessonWatchRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-main h-2 rounded-full" style={{ width: `${performanceMetrics.lessonWatchRate}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    معدل إكمال الواجبات
                  </span>
                  <span className="text-sm font-bold text-secondary-main">
                    {performanceMetrics.assignmentCompletionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-secondary-main h-2 rounded-full" style={{ width: `${performanceMetrics.assignmentCompletionRate}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    معدل الحضور
                  </span>
                  <span className="text-sm font-bold text-accent-main">
                    {performanceMetrics.attendanceRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-accent-main h-2 rounded-full" style={{ width: `${performanceMetrics.attendanceRate}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    معدل النجاح في الاختبارات
                  </span>
                  <span className="text-sm font-bold text-warning-main">
                    {performanceMetrics.successRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-warning-main h-2 rounded-full" style={{ width: `${performanceMetrics.successRate}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
} 