'use client'

import { useState, useEffect, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'
import {
  ArrowRight,
  Users,
  BookOpen,
  Clock,
  Play,
  FileText,
  Image,
  Music,
  Video,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Settings,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Calendar,
  Award,
  TrendingUp,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, Button, Badge, Avatar, Progress, Tabs, Dropdown } from '@3de/ui'
import { courseApi, lessonApi, fileApi } from '@3de/apis'
import { Course, Lesson, FileType } from '@3de/interfaces'
import LessonList from '../../../../components/LessonList'
import LessonFileViewer from '../../../../components/LessonFileViewer'
let getCourse=async(id:string):Promise<Course> =>{
  let course=await courseApi.getById(id)
  return course.data
}
export default function CourseDetailsPage({params}:{params: Promise<{id: string}>}) {
  const courseId = use(params).id
  
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('lessons')
  let {data:course,refetch}=useQuery({
    queryKey: ['course',courseId],
    queryFn: () => getCourse(courseId),
    enabled: !!courseId,
  })
  const tabItems = [
    {
      id: 'lessons',
      label: 'الدروس والمحتوى',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-300px)]">
          {/* Lessons List - 40% */}
          <div className="lg:col-span-2">
            <LessonList
              lessons={course?.lessons || []}
              selectedLesson={selectedLesson}
              onLessonSelect={setSelectedLesson}
              onFileSelect={setSelectedFile}
            />
          </div>
          
          {/* File Viewer - 60% */}
          <div className="lg:col-span-3">
            <LessonFileViewer
              file={selectedFile}
              lesson={course?.lessons?.find(l => l.id === selectedLesson) || null}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'students',
      label: 'الطلاب المسجلين',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              الطلاب ({course?.enrollments?.length})
            </h3>
            <Button variant="outline" size="sm">
              تصدير قائمة الطلاب
            </Button>
          </div>
          
          <div className="grid gap-4">
            {course?.enrollments?.map((enrollment, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 gap-reverse">
                    <Avatar
                      fallback={`${enrollment.user?.firstName[0]}${enrollment.user?.lastName[0]}`}
                      size="md"
                    />
                    <div>
                      <p className="font-medium">
                        {enrollment.user?.firstName} {enrollment.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        انضم منذ {index + 1} أسبوع
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 gap-reverse">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {Math.floor(Math.random() * 100)}% مكتمل
                      </p>
                      <p className="text-xs text-gray-500">
                        آخر نشاط: اليوم
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'التحليلات والإحصائيات',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-primary-main mb-2">
              {course?.enrollments?.length}
            </div>
            <div className="text-sm text-gray-600">طالب مسجل</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-secondary-main mb-2">
              {course?.lessons?.length}
            </div>
            <div className="text-sm text-gray-600">إجمالي الدروس</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-accent-main mb-2">
              {course?.progress}%
            </div>
            <div className="text-sm text-gray-600">متوسط الإنجاز</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-warning-main mb-2">
              4.8
            </div>
            <div className="text-sm text-gray-600">تقييم الكورس</div>
          </Card>
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'إعدادات الكورس',
      content: (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">إعدادات عامة</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الكورس
                </label>
                <input
                  type="text"
                  value={course?.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الكورس
                </label>
                <textarea
                    value={course?.description}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
                />
              </div>
              <div className="flex gap-4 gap-reverse">
                <Button variant="primary">
                  حفظ التغييرات
                </Button>
                <Button variant="outline">
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ]
  
  useEffect(()=>{
    refetch()
  },[courseId,refetch])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 gap-reverse">
        <Link href="/courses">
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة للكورسات
          </Button>
        </Link>
      </div>

      {/* Course Info */}
      <Card className="overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-primary-main to-secondary-main">
          {course?.image && (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
              <p className="text-white/90 mb-4">{course?.description}</p>
              <div className="flex items-center gap-6 gap-reverse">
                <div className="flex items-center gap-2 gap-reverse">
                  <Users className="h-4 w-4" />
                  <span>{course?.enrollments?.length} طالب</span>
                </div>
                <div className="flex items-center gap-2 gap-reverse">
                  <BookOpen className="h-4 w-4" />
                  <span>{course?.lessons?.length} درس</span>
                </div>
                <div className="flex items-center gap-2 gap-reverse">
                  <Clock className="h-4 w-4" />
                  <span>{course?.duration} ساعة</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 gap-reverse">
              <Avatar
                src={course?.instructors?.[0]?.user?.avatar}
                fallback="أ ت"
                size="lg"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {course?.instructors?.[0]?.user?.firstName} {course?.instructors?.[0]?.user?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {course?.instructors?.[0]?.title}
                </p>
                <p className="text-xs text-gray-400">
                  {course?.instructors?.[0]?.experienceYears} سنوات خبرة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 gap-reverse">
              <Badge variant="success">{course?.level}</Badge>
              <Button variant="primary">
                <Plus className="h-4 w-4 ml-2" />
                إضافة درس جديد
              </Button>
              <Dropdown
                trigger={
                  <Button variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                }
                items={[
                  {
                    id: 'edit',
                    label: 'تعديل الكورس',
                    icon: <Settings className="h-4 w-4" />,
                    onClick: () => {},
                  },
                  {
                    id: 'export',
                    label: 'تصدير البيانات',
                    icon: <Download className="h-4 w-4" />,
                    onClick: () => {},
                  },
                ]}
              />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                تقدم الكورس الإجمالي
              </span>
              <span className="text-sm font-bold text-primary-main">
                  {course?.progress}%
              </span>
            </div>
            <Progress value={course?.progress || 0} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabItems}
          defaultActiveTab="lessons"
          variant="underline"
          fullWidth
        />
      </Card>
    </div>
  )
} 