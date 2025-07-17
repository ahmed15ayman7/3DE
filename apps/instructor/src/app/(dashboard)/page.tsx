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
import { Card, Button, Badge, Avatar, Skeleton } from '@3de/ui'
import { instructorApi, courseApi, userApi } from '@3de/apis'

// Mock data for charts
const weeklyData = [
  { name: 'السبت', students: 24, quizzes: 3 },
  { name: 'الأحد', students: 28, quizzes: 2 },
  { name: 'الاثنين', students: 32, quizzes: 4 },
  { name: 'الثلاثاء', students: 18, quizzes: 1 },
  { name: 'الأربعاء', students: 42, quizzes: 5 },
  { name: 'الخميس', students: 35, quizzes: 3 },
  { name: 'الجمعة', students: 15, quizzes: 1 },
]

const courseCompletionData = [
  { name: 'مكتمل', value: 65, color: '#10B981' },
  { name: 'قيد التقدم', value: 25, color: '#3B82F6' },
  { name: 'لم يبدأ', value: 10, color: '#F59E0B' },
]

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

const RecentActivity = ({ activities }: { activities: any[] }) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">الأنشطة الأخيرة</h3>
      <Button variant="ghost" size="sm">
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

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      title: 'طالب جديد انضم لكورس React',
      time: 'منذ 5 دقائق',
      icon: Users,
      color: 'bg-green-500',
      badge: 'جديد',
    },
    {
      id: 2,
      title: 'تم إنجاز اختبار JavaScript',
      time: 'منذ 15 دقيقة',
      icon: ClipboardList,
      color: 'bg-blue-500',
    },
    {
      id: 3,
      title: 'رسالة جديدة من طالب',
      time: 'منذ 30 دقيقة',
      icon: MessageSquare,
      color: 'bg-purple-500',
      badge: '3',
    },
    {
      id: 4,
      title: 'تم إضافة درس جديد',
      time: 'منذ ساعة واحدة',
      icon: BookOpen,
      color: 'bg-orange-500',
    },
  ]

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
          
          <Button variant="primary">
            <Download className="h-4 w-4 ml-2" />
            تحميل التقرير
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي الكورسات"
          value="12"
          icon={BookOpen}
          trend="up"
          trendValue="+2 هذا الشهر"
          color="bg-primary-main"
        />
        <StatCard
          title="إجمالي الطلاب"
          value="248"
          icon={Users}
          trend="up"
          trendValue="+15 هذا الأسبوع"
          color="bg-secondary-main"
        />
        <StatCard
          title="الاختبارات النشطة"
          value="8"
          icon={ClipboardList}
          trend="up"
          trendValue="+3 اختبارات جديدة"
          color="bg-accent-main"
        />
        <StatCard
          title="معدل الإنجاز"
          value="85%"
          icon={Award}
          trend="up"
          trendValue="+5% هذا الشهر"
          color="bg-warning-main"
        />
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
            </div>
            
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
          </Card>
        </div>

        {/* Recent Activities */}
        <RecentActivity activities={recentActivities} />
      </div>

      {/* Course Completion and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Completion */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            معدل إنجاز الكورسات
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={courseCompletionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {courseCompletionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {courseCompletionData.map((item, index) => (
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
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            مؤشرات الأداء
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  معدل رضا الطلاب
                </span>
                <span className="text-sm font-bold text-primary-main">
                  4.8/5
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-main h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  معدل إكمال الواجبات
                </span>
                <span className="text-sm font-bold text-secondary-main">
                  92%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-secondary-main h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  معدل الحضور
                </span>
                <span className="text-sm font-bold text-accent-main">
                  88%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-accent-main h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  معدل النجاح في الاختبارات
                </span>
                <span className="text-sm font-bold text-warning-main">
                  85%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-warning-main h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 