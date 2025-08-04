'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowRight,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  ClipboardList,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  Download,
  Share,
  Copy,
  BookOpen,
  Target,
  Timer,
  Repeat,
  EyeOff,
  Eye as EyeIcon,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Card, Button, Badge, Dropdown, Progress, Tabs } from '@3de/ui'
import { quizApi } from '@3de/apis'
import { Quiz } from '@3de/interfaces'

export default function QuizDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string
  const [activeTab, setActiveTab] = useState('overview')

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizApi.getById(quizId),
    enabled: !!quizId,
  })

  const { data: results } = useQuery({
    queryKey: ['quiz-results', quizId],
    queryFn: () => quizApi.getResults(quizId),
    enabled: !!quizId,
  })

  const quizData = quiz?.data

  const handleEdit = () => {
    router.push(`/quizzes/${quizId}/edit`)
  }

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
      try {
        await quizApi.delete(quizId)
        router.push('/quizzes')
      } catch (error) {
        console.error('Error deleting quiz:', error)
      }
    }
  }

  const handleViewResults = () => {
    router.push(`/quizzes/${quizId}/results`)
  }

  const menuItems = [
    {
      id: 'edit',
      label: 'تعديل',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit,
    },
    {
      id: 'results',
      label: 'عرض النتائج',
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: handleViewResults,
    },
    {
      id: 'share',
      label: 'مشاركة',
      icon: <Share className="h-4 w-4" />,
      onClick: () => {
        navigator.clipboard.writeText(window.location.href)
        alert('تم نسخ الرابط')
      },
    },
    {
      id: 'delete',
      label: 'حذف',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      className: 'text-red-600',
    },
  ]

  const getStatusColor = (isCompleted: boolean) => {
    return isCompleted ? 'success' : 'warning'
  }

  const getStatusText = (isCompleted: boolean) => {
    return isCompleted ? 'مكتمل' : 'مسودة'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل بيانات الاختبار...</p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          الاختبار غير موجود
        </h3>
        <p className="text-gray-600 mb-6">
          قد يكون الاختبار محذوفاً أو غير متاح
        </p>
        <Button onClick={() => router.push('/quizzes')} variant="primary">
          العودة للاختبارات
        </Button>
      </div>
    )
  }

  const totalSubmissions = quizData.submissions?.length || 0
  const passedSubmissions = quizData.submissions?.filter((s:any) => s.score >= (quizData.passingScore || 0)).length || 0
  const failedSubmissions = totalSubmissions - passedSubmissions
  const passRate = totalSubmissions > 0 ? (passedSubmissions / totalSubmissions) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 gap-reverse">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
          >
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة
          </Button>
          <div>
            <div className="flex items-center gap-2 gap-reverse mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {quizData.title}
              </h1>
              <Badge variant={getStatusColor(quizData.isCompleted)} size="sm">
                {getStatusText(quizData.isCompleted)}
              </Badge>
            </div>
            <p className="text-gray-600">
              {quizData.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 gap-reverse">
          <Button onClick={handleEdit} variant="outline">
            <Edit className="h-4 w-4 ml-2" />
            تعديل
          </Button>
          <Button onClick={handleViewResults} variant="primary">
            <BarChart3 className="h-4 w-4 ml-2" />
            النتائج
          </Button>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">عدد الأسئلة</p>
              <p className="text-2xl font-bold text-gray-900">
                {quizData.questions?.length || 0}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
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
                {Math.round(passRate)}%
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
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(quizData.averageScore || 0)}%
              </p>
            </div>
            <div className="p-3 bg-accent-main rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <Tabs
          defaultActiveTab={activeTab}
          onTabChange={(tabId:string) => setActiveTab(tabId)}
          items={[
            { id: 'overview', label: 'نظرة عامة', content: <div className="space-y-6">
              {/* Quiz Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    معلومات الاختبار
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">العنوان:</span>
                      <span className="font-medium">{quizData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوصف:</span>
                      <span className="font-medium">{quizData.description || 'لا يوجد وصف'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الكورس:</span>
                      <span className="font-medium">{quizData.course?.title || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الدرس:</span>
                      <span className="font-medium">{quizData.lesson?.title || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاريخ الإنشاء:</span>
                      <span className="font-medium">
                        {new Date(quizData.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    الإحصائيات
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>نسبة النجاح</span>
                        <span>{Math.round(passRate)}%</span>
                      </div>
                      <Progress value={passRate} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{passedSubmissions}</div>
                        <div className="text-sm text-green-600">نجح</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{failedSubmissions}</div>
                        <div className="text-sm text-red-600">رسب</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  أداء الطلاب
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>رسم بياني لأداء الطلاب</p>
                  </div>
                </div>
              </Card>
            </div>},
            { id: 'questions', label: 'الأسئلة', content:  <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  أسئلة الاختبار ({quizData.questions?.length || 0})
                </h3>
                <Badge variant="outline">
                  إجمالي النقاط: {quizData.questions?.reduce((sum:any, q:any) => sum + (q.points || 0), 0) || 0}
                </Badge>
              </div>

              {quizData.questions?.map((question:any, index:any) => (
                <Card key={question.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 gap-reverse">
                      <div className="w-8 h-8 bg-primary-main text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{question.text}</h4>
                        <div className="flex items-center gap-4 gap-reverse mt-1">
                          <Badge variant="outline" size="sm">
                            {question.type === 'MULTIPLE_CHOICE' ? 'اختيار من متعدد' :
                             question.type === 'TRUE_FALSE' ? 'صح أم خطأ' :
                             question.type === 'ESSAY' ? 'سؤال مقالي' : 'اكمل الفراغ'}
                          </Badge>
                          <span className="text-sm text-gray-500">{question.points} نقطة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {question.options && question.options.length > 0 && (
                    <div className="space-y-2">
                      {question.options.map((option:any, optIndex:any) => (
                        <div
                          key={option.id}
                          className={`flex items-center gap-2 gap-reverse p-3 rounded-lg border ${
                            option.isCorrect
                              ? 'bg-green-50 border-green-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className={option.isCorrect ? 'text-green-600' : 'text-gray-500'}>
                            {option.isCorrect ? '✓' : '○'}
                          </span>
                          <span className={option.isCorrect ? 'text-green-700' : 'text-gray-700'}>
                            {option.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>التوضيح:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </Card>
              ))}

              {(!quizData.questions || quizData.questions.length === 0) && (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد أسئلة
                  </h3>
                  <p className="text-gray-600">
                    لم يتم إضافة أسئلة لهذا الاختبار بعد
                  </p>
                </div>
              )}
            </div>},
            { id: 'settings', label: 'الإعدادات', content: <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    إعدادات الاختبار
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <Timer className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">الحد الزمني</span>
                      </div>
                      <span className="font-medium">{quizData.timeLimit || 'غير محدود'} دقيقة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <Target className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">درجة النجاح</span>
                      </div>
                      <span className="font-medium">{quizData.passingScore || 0}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <Repeat className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">عدد المحاولات</span>
                      </div>
                      <span className="font-medium">{quizData.maxAttempts || 'غير محدود'}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    خيارات إضافية
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">عرض النتائج فوراً</span>
                      </div>
                      <Badge variant={quizData.showResultsImmediately ? 'success' : 'secondary'} size="sm">
                        {quizData.showResultsImmediately ? 'مفعل' : 'معطل'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <ClipboardList className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">خلط الأسئلة</span>
                      </div>
                      <Badge variant={quizData.shuffleQuestions ? 'success' : 'secondary'} size="sm">
                        {quizData.shuffleQuestions ? 'مفعل' : 'معطل'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 gap-reverse">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">السماح بالمراجعة</span>
                      </div>
                      <Badge variant={quizData.allowReview ? 'success' : 'secondary'} size="sm">
                        {quizData.allowReview ? 'مفعل' : 'معطل'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div> },
            { id: 'submissions', label: 'المحاولات', content:    <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  محاولات الطلاب ({totalSubmissions})
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير النتائج
                </Button>
              </div>

              {quizData.submissions && quizData.submissions.length > 0 ? (
                <div className="space-y-4">
                  {quizData.submissions.map((submission:any) => (
                    <Card key={submission.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 gap-reverse">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-main to-secondary-main rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {submission.student?.firstName?.charAt(0) || 'ط'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {submission.student?.firstName} {submission.student?.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {new Date(submission.createdAt).toLocaleDateString('ar-EG')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {submission.score}%
                          </div>
                          <Badge
                            variant={submission.score >= (quizData.passingScore || 0) ? 'success' : 'danger'}
                            size="sm"
                          >
                            {submission.score >= (quizData.passingScore || 0) ? 'نجح' : 'رسب'}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد محاولات
                  </h3>
                  <p className="text-gray-600">
                    لم يقم أي طالب بحل هذا الاختبار بعد
                  </p>
                </div>
              )}
            </div>},
          ]}
        />
      </Card>
    </div>
  )
} 