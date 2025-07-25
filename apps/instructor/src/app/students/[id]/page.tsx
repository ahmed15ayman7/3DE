'use client'

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  MessageSquare,
  Edit,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, Button, Badge, Avatar, Progress, Tabs } from '@3de/ui'
import { useAuth } from '@3de/auth'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '@3de/apis'
import { Enrollment, Submission, Achievement, Lesson } from '@3de/interfaces'
let getStudent=async(id:string)=>{
  let {data} = await userApi.getById(id)
  return data
}
export default function StudentProfilePage({params}:{params:Promise<{id:string}>}) {
  const router = useRouter()
  const studentId = use(params).id as string
  // Progress over time data
  const progressData = [
    { week: 'الأسبوع 1', progress: 10 },
    { week: 'الأسبوع 2', progress: 25 },
    { week: 'الأسبوع 3', progress: 40 },
    { week: 'الأسبوع 4', progress: 55 },
    { week: 'الأسبوع 5', progress: 70 },
    { week: 'الأسبوع 6', progress: 75 },
  ]

  // Activity data
  const activityData = [
    { day: 'السبت', hours: 3 },
    { day: 'الأحد', hours: 2 },
    { day: 'الاثنين', hours: 4 },
    { day: 'الثلاثاء', hours: 1 },
    { day: 'الأربعاء', hours: 5 },
    { day: 'الخميس', hours: 3 },
    { day: 'الجمعة', hours: 2 },
  ]
  let {data:student} = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudent(studentId),
    enabled: !!studentId,
  })
  const tabItems = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      content: (
        <div className="space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                المعلومات الشخصية
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 gap-reverse">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">البريد الإلكتروني</p>
                    <p className="text-sm text-gray-900">{student?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 gap-reverse">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">رقم الهاتف</p>
                    <p className="text-sm text-gray-900">{student?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 gap-reverse">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">تاريخ الميلاد</p>
                    <p className="text-sm text-gray-900">
                      {new Date(student?.age||'').toLocaleDateString('ar')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 gap-reverse">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">العنوان</p>
                    <p className="text-sm text-gray-900">{student?.location}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إحصائيات سريعة
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">إجمالي الكورسات</span>
                  <span className="text-lg font-bold text-primary-main">
                    {student?.enrollments?.length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">الكورسات المكتملة</span>
                  <span className="text-lg font-bold text-green-600">
                    {student?.enrollments?.filter((enrollment:Enrollment) => enrollment?.course?.status==='COMPLETED').length}
                  </span>
                </div>
{/*                 
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ساعات الدراسة</span>
                  <span className="text-lg font-bold text-accent-main">
                    {student?.totalStudyHours}
                  </span>
                </div> */}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">الشهادات</span>
                  <span className="text-lg font-bold text-secondary-main">
                    {student?.Certificate?.length}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                تطور الأداء
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                النشاط الأسبوعي
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              الإنجازات والشهادات
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student?.achievements.map((achievement:Achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl ml-3">{achievement.value}</div>
                  <div>
                    <p className="font-medium text-gray-900">{achievement.isNew ? 'جديد' : 'قديم'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.createdAt||'').toLocaleDateString('ar')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'courses',
      label: 'الكورسات',
      content: (
        <div className="space-y-4">
          {student?.enrollments.map((enrollment:Enrollment) => (
            <Card key={enrollment.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {enrollment?.course?.title}
                  </h3>
                  <div className="flex items-center gap-4 gap-reverse mt-1">
                    <Badge 
                      variant={enrollment?.course?.status === 'COMPLETED' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {enrollment?.course?.status}
                    </Badge>
                    {/* <span className="text-sm text-gray-500">
                      آخر وصول: {enrollment?.lastAccessed}
                    </span> */}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-main">
                    {enrollment?.progress}
                  </div>
                  <div className="text-sm text-gray-500">التقدير</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {enrollment?.progress}%
                  </div>
                  <div className="text-xs text-gray-500">نسبة الإنجاز</div>
                  <Progress value={enrollment?.progress} className="mt-2" />
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {enrollment?.course?.lessons?.filter((lesson:Lesson) => lesson.status==='COMPLETED').length}/{enrollment?.course?.lessons?.length}
                  </div>
                  <div className="text-xs text-gray-500">الدروس المكتملة</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {enrollment?.course?.duration} دقيقة
                  </div>
                  <div className="text-xs text-gray-500">وقت الدراسة</div>
                </div>
              </div>

              <div className="flex gap-2 gap-reverse">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 ml-2" />
                  عرض التفاصيل
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تقرير الأداء
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'quizzes',
      label: 'نتائج الاختبارات',
      content: (
        <div className="space-y-4">
          {student?.Submission?.map((submission:Submission) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {submission.quiz?.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">النتيجة</p>
                      <p className="text-lg font-bold text-primary-main">
                        {submission.score}/100
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">الحالة</p>
                      <Badge
                        variant={submission.passed ? 'success' : 'danger'}
                        size="sm"
                        className="flex items-center gap-1 gap-reverse w-fit"
                      >
                        {submission.passed ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        <span>{submission.passed ? 'ناجح' : 'راسب'}</span>
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">الوقت المستغرق</p>
                      <p className="text-sm font-medium text-gray-900">
                        {submission.timeLimit} دقيقة
                      </p>
                    </div>
                    
                    {/* <div>
                      <p className="text-sm text-gray-600">عدد المحاولات</p>
                      <p className="text-sm font-medium text-gray-900">
                        {quiz.attemptsCount}
                      </p>
                    </div> */}
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(submission.createdAt||'').toLocaleDateString('ar')}
                  </p>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 ml-2" />
                    التفاصيل
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ]


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 gap-reverse">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للطلاب
        </Button>
      </div>

      {/* Student Profile Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 gap-reverse">
            <Avatar
              src={student?.avatar}
              fallback={`${student?.firstName[0]}${student?.lastName[0]}`}
              size="xl"
            />
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {student?.firstName} {student?.lastName}
              </h1>
              <p className="text-gray-600 mb-2">{student?.email}</p>
              
              <div className="flex items-center gap-4 gap-reverse">
                <Badge variant={student?.isOnline ? 'success' : 'danger'} size="sm">
                  {student?.isOnline ? 'متصل' : 'غير متصل'}
                </Badge>
                {/* <Badge variant="outline" size="sm">
                  {student?.level}
                </Badge> */}
                <span className="text-sm text-gray-500">
                  انضم في {new Date(student?.createdAt||'').toLocaleDateString('ar')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 gap-reverse">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 ml-2" />
              إرسال رسالة
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 ml-2" />
              تحميل التقرير
            </Button>
            <Button variant="primary">
              <Edit className="h-4 w-4 ml-2" />
              تعديل البيانات
            </Button>
          </div>
        </div>

        {/* Quick Progress */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-main mb-1">
              {student?.enrollments?.reduce((acc, enrollment) => acc + enrollment.progress, 0) || 0 / (student?.enrollments?.length || 1)}%
            </div>
            <div className="text-sm text-gray-600">التقدم الإجمالي</div>
            <Progress value={student?.enrollments?.reduce((acc, enrollment) => acc + enrollment.progress, 0) || 0 / (student?.enrollments?.length || 1)} className="mt-2" />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {student?.Submission?.reduce((acc, submission) => acc + (submission.score || 0), 0) || 0 / (student?.Submission?.length || 1)}%
            </div>
            <div className="text-sm text-gray-600">متوسط الدرجات</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-main mb-1">
              {student?.Attendance?.reduce((acc, attendance) => acc + (attendance.status==='PRESENT' ? 1 : 0), 0) || 0 / (student?.Attendance?.length || 1)}%
            </div>
            <div className="text-sm text-gray-600">معدل الحضور</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-main mb-1">
              {student?.enrollments?.reduce((acc, enrollment) => acc + (enrollment.course?.duration || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">ساعات الدراسة</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabItems}
          defaultActiveTab="overview"
          variant="underline"
          fullWidth
        />
      </Card>
    </div>
  )
} 