'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Users,
  Clock,
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, Button, Badge, Avatar, Dropdown, Input, Skeleton } from '@3de/ui'
import { courseApi, instructorApi } from '@3de/apis'
import { Course, Instructor } from '@3de/interfaces'
import { useAuth } from '@3de/auth'

interface CourseCardProps {
  course: Course
  onEdit: (course: Course) => void
  onDelete: (course: Course) => void
}

const CourseCard = ({ course, onEdit, onDelete }: CourseCardProps) => {
  const menuItems = [
    {
      id: 'view',
      label: 'عرض التفاصيل',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => {},
    },
    {
      id: 'edit',
      label: 'تعديل',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(course),
    },
    {
      id: 'delete',
      label: 'حذف',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(course),
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'COMPLETED':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط'
      case 'PENDING':
        return 'قيد المراجعة'
      case 'COMPLETED':
        return 'مكتمل'
      default:
        return 'غير محدد'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Course Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary-main to-secondary-main">
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant={getStatusColor(course.status)} size="sm">
              {getStatusText(course.status)}
            </Badge>
          </div>
          
          {/* Actions Menu */}
          <div className="absolute top-4 left-4">
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm" className="bg-white/20 backdrop-blur-sm">
                  <MoreVertical className="h-4 w-4 text-white" />
                </Button>
              }
              items={menuItems}
              position="bottom-right"
            />
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Title */}
          <Link href={`/courses/${course.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-main transition-colors cursor-pointer truncate">
              {course.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1 gap-reverse">
              <BookOpen className="h-4 w-4" />
              <span>{course.lessons?.length || 0} درس</span>
            </div>
            <div className="flex items-center gap-1 gap-reverse">
              <Users className="h-4 w-4" />
              <span>{course.enrollments?.length || 0} طالب</span>
            </div>
            <div className="flex items-center gap-1 gap-reverse">
              <Clock className="h-4 w-4" />
              <span>{course.duration || 0} ساعة</span>
            </div>
          </div>

          {/* Level and Progress */}
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" size="sm">
              {course.level}
            </Badge>
            <div className="flex items-center gap-1 gap-reverse">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">التقدم الإجمالي</span>
              <span className="text-xs font-medium text-gray-900">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-main h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 gap-reverse">
            <Link href={`/courses/${course.id}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                <Eye className="h-4 w-4 ml-2" />
                عرض الكورس
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const CourseListItem = ({ course, onEdit, onDelete }: CourseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
  >
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 gap-reverse flex-1">
          {/* Course Image */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary-main to-secondary-main rounded-lg flex-shrink-0">
            {course.image && (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>

          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 gap-reverse mb-1">
              <Link href={`/courses/${course.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-main transition-colors cursor-pointer">
                  {course.title}
                </h3>
              </Link>
              <Badge variant="success" size="sm">
                نشط
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2 truncate">
              {course.description}
            </p>
            <div className="flex items-center gap-4 gap-reverse text-sm text-gray-500">
              <span className="flex items-center gap-1 gap-reverse">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons?.length || 0} درس</span>
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <Users className="h-4 w-4" />
                <span>{course.enrollments?.length || 0} طالب</span>
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <TrendingUp className="h-4 w-4" />
                <span>{course.progress}% مكتمل</span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 gap-reverse">
          <Link href={`/courses/${course.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 ml-2" />
              عرض
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Dropdown
            trigger={
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
            items={[
              {
                id: 'delete',
                label: 'حذف',
                icon: <Trash2 className="h-4 w-4" />,
                onClick: () => onDelete(course),
              },
            ]}
            position="bottom-left"
          />
        </div>
      </div>
    </Card>
  </motion.div>
)

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { user } = useAuth()

  const { data: courses,refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getByInstructorId(user?.id as string),
    enabled: !!user?.id,
  })
  useEffect(()=>{
    refetch()
  },[user,refetch])
  const filteredCourses = courses?.data?.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  console.log(filteredCourses)

  const handleEditCourse = (course: any) => {
    console.log('Edit course:', course.id)
  }

  const handleDeleteCourse = (course: any) => {
    console.log('Delete course:', course.id)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">كورساتي</h1>
          <p className="text-gray-600 mt-1">
            إدارة وتتبع جميع الكورسات التعليمية
          </p>
        </div>
        
        <Button variant="primary">
          <Plus className="h-5 w-5 ml-2" />
          كورس جديد
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الكورسات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 gap-reverse">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع المستويات</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="PENDING">قيد المراجعة</option>
              <option value="COMPLETED">مكتمل</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-primary-main text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors rounded-r-lg`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-primary-main text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors rounded-l-lg`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-primary-main mb-1">
            {courses?.data?.length}
          </div>
          <div className="text-sm text-gray-600">إجمالي الكورسات</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-secondary-main mb-1">
            {courses?.data?.filter((c: Course) => c.status === 'ACTIVE').length}
          </div>
          <div className="text-sm text-gray-600">كورسات نشطة</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-accent-main mb-1">
            {courses?.data?.reduce((acc: number, course: Course) => acc + (course.enrollments?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">إجمالي الطلاب</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-warning-main mb-1">
            {Math.round(courses?.data?.reduce((acc: number, course: Course) => acc + course.progress, 0) / courses?.data?.length)}%
          </div>
          <div className="text-sm text-gray-600">متوسط الإنجاز</div>
        </Card>
      </div>

      {/* Courses Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course: Course) => (
            <CourseListItem
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد كورسات
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedLevel !== 'all' || selectedStatus !== 'all'
              ? 'لا توجد كورسات تطابق المعايير المحددة'
              : 'ابدأ بإنشاء كورسك الأول'}
          </p>
          <Button variant="primary">
            <Plus className="h-5 w-5 ml-2" />
            إنشاء كورس جديد
          </Button>
        </Card>
      )}
    </div>
  )
} 