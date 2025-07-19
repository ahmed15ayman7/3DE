'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Clock,
  Users,
  ClipboardList,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, Button, Badge, Dropdown, Progress, Tabs } from '@3de/ui'
import { quizApi, courseApi } from '@3de/apis'
import { Quiz } from '@3de/interfaces'
import { useAuth } from '@3de/auth'

interface QuizCardProps {
  quiz: Quiz
  onEdit: (quiz: Quiz) => void
  onDelete: (quiz: Quiz) => void
  onViewResults: (quiz: Quiz) => void
}

const QuizCard = ({ quiz, onEdit, onDelete, onViewResults }: QuizCardProps) => {
  const menuItems = [
    {
      id: 'view',
      label: 'عرض التفاصيل',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => {},
    },
    {
      id: 'results',
      label: 'عرض النتائج',
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: () => onViewResults(quiz),
    },
    {
      id: 'edit',
      label: 'تعديل',
      icon: <Edit className="h-4 w-4" />,
      onClick: () => onEdit(quiz),
    },
    {
      id: 'delete',
      label: 'حذف',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(quiz),
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'DRAFT':
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
      case 'DRAFT':
        return 'مسودة'
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
        {/* Quiz Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 gap-reverse mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {quiz.title}
                </h3>
                <Badge variant={getStatusColor(quiz.isCompleted ? 'COMPLETED' : 'DRAFT')} size="sm">
                  {getStatusText(quiz.isCompleted ? 'COMPLETED' : 'DRAFT')}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {quiz.description}
              </p>

              <div className="flex items-center gap-4 gap-reverse text-sm text-gray-500">
                <span className="flex items-center gap-1 gap-reverse">
                  <ClipboardList className="h-4 w-4" />
                  <span>{quiz.questions?.length || 0} سؤال</span>
                </span>
                <span className="flex items-center gap-1 gap-reverse">
                  <Users className="h-4 w-4" />
                  <span>{quiz.submissions?.length || 0} محاولة</span>
                </span>
                <span className="flex items-center gap-1 gap-reverse">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.timeLimit || 'غير محدود'} دقيقة</span>
                </span>
              </div>
            </div>

            <Dropdown
              trigger={
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              }
              items={menuItems}
              position="bottom-left"
            />
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {quiz.passingScore || 0}
              </div>
              <div className="text-xs text-gray-500">نجح</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {quiz.failCount || 0}
              </div>
              <div className="text-xs text-gray-500">رسب</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-main">
                {Math.round(quiz.averageScore || 0)}%
              </div>
              <div className="text-xs text-gray-500">متوسط الدرجات</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 gap-reverse">
            <Button variant="primary" size="sm" className="flex-1">
              <Eye className="h-4 w-4 ml-2" />
              عرض الاختبار
            </Button>
            <Button variant="outline" size="sm" onClick={() => onViewResults(quiz)}>
              <BarChart3 className="h-4 w-4 ml-2" />
              النتائج
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(quiz)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          {/* Course Info */}
          {quiz.course && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                الكورس: <span className="font-medium">{quiz.course?.title}</span>
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

const QuizListItem = ({ quiz, onEdit, onDelete, onViewResults }: QuizCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
  >
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 gap-reverse flex-1">
          {/* Quiz Icon */}
          <div className="w-12 h-12 bg-gradient-to-br from-primary-main to-secondary-main rounded-lg flex items-center justify-center flex-shrink-0">
            <ClipboardList className="h-6 w-6 text-white" />
          </div>

          {/* Quiz Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 gap-reverse mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {quiz.title}
              </h3>
              <Badge variant={quiz.isCompleted ? 'success' : 'danger'} size="sm">
                {quiz.isCompleted ? 'مكتمل' : 'مسودة'}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2 truncate">
              {quiz.description}
            </p>
            <div className="flex items-center gap-4 gap-reverse text-sm text-gray-500">
              <span className="flex items-center gap-1 gap-reverse">
                <ClipboardList className="h-4 w-4" />
                <span>{quiz.questions?.length || 0} سؤال</span>
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <Users className="h-4 w-4" />
                <span>{quiz.submissions?.length || 0} محاولة</span>
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <TrendingUp className="h-4 w-4" />
                <span>{Math.round(quiz.averageScore || 0)}% متوسط</span>
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 gap-reverse">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 ml-2" />
            عرض
          </Button>
          <Button variant="outline" size="sm" onClick={() => onViewResults(quiz)}>
            <BarChart3 className="h-4 w-4 ml-2" />
            النتائج
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(quiz)}>
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
                onClick: () => onDelete(quiz),
              },
            ]}
            position="bottom-left"
          />
        </div>
      </div>
    </Card>
  </motion.div>
)
let getQuizzes=async(userId:string)=>{
  let response=await quizApi.getByStudent(userId)
  return response.data
}
export default function QuizzesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { user } = useAuth()
  const { data: quizzes } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => getQuizzes(user?.id as string),
  })

  const filteredQuizzes = quizzes?.filter((quiz: Quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchQuery.toLowerCase()) 
    return matchesSearch
  })

  const handleEditQuiz = (quiz: Quiz) => {
    console.log('Edit quiz:', quiz.id)
  }

  const handleDeleteQuiz = (quiz: Quiz) => {
    console.log('Delete quiz:', quiz.id)
  }

  const handleViewResults = (quiz: Quiz) => {
    console.log('View results:', quiz.id)
  }

  const totalSubmissions = quizzes?.data?.reduce((acc:number, quiz:Quiz) => acc + (quiz.submissions?.length || 0), 0)
  const totalPassed = quizzes?.data?.reduce((acc:number, quiz:Quiz) => acc + (quiz.passingScore || 0), 0) || 0
  const totalFailed = quizzes?.data?.reduce((acc:number, quiz:Quiz) => acc + (quiz.failCount || 0), 0) || 0
  const averageScore = quizzes?.data?.reduce((acc:number, quiz:Quiz) => acc + (quiz.averageScore || 0), 0) / quizzes?.data?.length || 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الاختبارات</h1>
          <p className="text-gray-600 mt-1">
            إنشاء وإدارة الاختبارات التعليمية
          </p>
        </div>
        
        <div className="flex gap-3 gap-reverse">
          <Link href="/quizzes/new">
            <Button variant="primary">
              <Plus className="h-5 w-5 ml-2" />
              اختبار جديد
            </Button>
          </Link>
          <Link href="/quizzes/results">
            <Button variant="outline">
              <BarChart3 className="h-5 w-5 ml-2" />
              النتائج
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الاختبارات</p>
              <p className="text-2xl font-bold text-gray-900">{quizzes?.data?.length || 0}</p>
            </div>
            <div className="p-3 bg-primary-main rounded-full">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المحاولات</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubmissions || 0}</p>
            </div>
            <div className="p-3 bg-secondary-main rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">نسبة النجاح</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSubmissions && totalSubmissions > 0 ? Math.round((totalPassed / totalSubmissions) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط الدرجات</p>
              <p className="text-2xl font-bold text-gray-900">{averageScore && Math.round(averageScore)}%</p>
            </div>
            <div className="p-3 bg-accent-main rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
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
                placeholder="البحث في الاختبارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 gap-reverse">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع الكورسات</option>
              <option value="تطوير الويب بـ React">React</option>
              <option value="JavaScript المتقدم">JavaScript</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="all">جميع الحالات</option>
              <option value="ACTIVE">نشط</option>
              <option value="DRAFT">مسودة</option>
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

      {/* Quizzes Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes?.map((quiz:Quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onEdit={handleEditQuiz}
              onDelete={handleDeleteQuiz}
              onViewResults={handleViewResults}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuizzes?.map((quiz:Quiz) => (
            <QuizListItem
              key={quiz.id}
              quiz={quiz}
              onEdit={handleEditQuiz}
              onDelete={handleDeleteQuiz}
              onViewResults={handleViewResults}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredQuizzes?.length === 0 && (
        <Card className="p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            لا توجد اختبارات
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCourse !== 'all' || selectedStatus !== 'all'
              ? 'لا توجد اختبارات تطابق المعايير المحددة'
              : 'ابدأ بإنشاء اختبارك الأول'}
          </p>
          <Link href="/quizzes/new">
            <Button variant="primary">
              <Plus className="h-5 w-5 ml-2" />
              إنشاء اختبار جديد
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
} 