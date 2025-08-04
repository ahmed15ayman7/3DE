'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  ArrowRight,
  Download,
  Filter,
  Calendar,
  Users,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Eye,
  FileText,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, Button, Badge, Select, Tabs } from '@3de/ui'
import { quizApi } from '@3de/apis'
import { Quiz } from '@3de/interfaces'

export default function QuizResultsPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string
  const [activeTab, setActiveTab] = useState('overview')
  const [timeFilter, setTimeFilter] = useState('all')

  const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizApi.getById(quizId),
    enabled: !!quizId,
  })

  const { data: results, isLoading: isLoadingResults } = useQuery({
    queryKey: ['quiz-results', quizId],
    queryFn: () => quizApi.getResults(quizId),
    enabled: !!quizId,
  })

  const quizData = quiz?.data
  const resultsData = results?.data

  if (isLoadingQuiz || isLoadingResults) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل النتائج...</p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          الاختبار غير موجود
        </h3>
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
  const averageScore = quizData.averageScore || 0
  const averageTime = quizData.submissions?.reduce((sum:number, s:any) => sum + (s.duration || 0), 0) / totalSubmissions || 0

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'success' as const, text: 'ممتاز' }
    if (score >= 80) return { variant: 'primary' as const, text: 'جيد جداً' }
    if (score >= 70) return { variant: 'warning' as const, text: 'جيد' }
    return { variant: 'danger' as const, text: 'ضعيف' }
  }

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
            <h1 className="text-2xl font-bold text-gray-900">
              نتائج اختبار: {quizData.title}
            </h1>
            <p className="text-gray-600">
              تحليل شامل لأداء الطلاب في هذا الاختبار
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 gap-reverse">
          <Select
            value={timeFilter}
            onChange={(value:any) => setTimeFilter(value)}
            options={[
              { value: 'all', label: 'جميع الفترات' },
              { value: 'week', label: 'آخر أسبوع' },
              { value: 'month', label: 'آخر شهر' },
              { value: 'quarter', label: 'آخر 3 أشهر' },
            ]}
          />
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            تصدير النتائج
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي المحاولات</p>
              <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
            </div>
            <div className="p-3 bg-primary-main rounded-full">
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
                {Math.round(averageScore)}%
              </p>
            </div>
            <div className="p-3 bg-accent-main rounded-full">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">متوسط الوقت</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(averageTime)} د
              </p>
            </div>
            <div className="p-3 bg-secondary-main rounded-full">
              <Clock className="h-6 w-6 text-white" />
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
              {/* Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    توزيع الدرجات
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>رسم بياني دائري للدرجات</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    معدل النجاح عبر الزمن
                  </h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>رسم بياني خطي للنجاح</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {passedSubmissions}
                    </div>
                    <div className="text-sm text-gray-600">نجح</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {passRate.toFixed(1)}% من إجمالي المحاولات
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {failedSubmissions}
                    </div>
                    <div className="text-sm text-gray-600">رسب</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(100 - passRate).toFixed(1)}% من إجمالي المحاولات
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {Math.round(averageScore)}%
                    </div>
                    <div className="text-sm text-gray-600">متوسط الدرجات</div>
                    <div className="text-xs text-gray-500 mt-1">
                      من أصل {quizData.passingScore || 0}% مطلوب للنجاح
                    </div>
                  </div>
                </Card>
              </div>
            </div> },
            { id: 'detailed', label: 'نتائج مفصلة',content: <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  نتائج الطلاب ({totalSubmissions})
                </h3>
                <div className="flex items-center gap-2 gap-reverse">
                  <span className="text-sm text-gray-500">ترتيب حسب:</span>
                  <Select
                    value="score"
                    onChange={() => {}}
                    options={[
                      { value: 'score', label: 'الدرجة' },
                      { value: 'date', label: 'التاريخ' },
                      { value: 'time', label: 'الوقت' },
                    ]}
                  />
                </div>
              </div>

              {quizData.submissions && quizData.submissions.length > 0 ? (
                <div className="space-y-4">
                  {quizData.submissions.map((submission:any) => {
                    const scoreBadge = getScoreBadge(submission.score)
                    return (
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
                                {submission.student?.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-3 gap-reverse">
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
                                  {submission.score}%
                                </div>
                                <Badge variant={scoreBadge.variant} size="sm">
                                  {scoreBadge.text}
                                </Badge>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-500">الوقت</div>
                                <div className="font-medium">{submission.duration || 0} د</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-gray-500">التاريخ</div>
                                <div className="font-medium">
                                  {new Date(submission.createdAt).toLocaleDateString('ar-EG')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد نتائج
                  </h3>
                  <p className="text-gray-600">
                    لم يقم أي طالب بحل هذا الاختبار بعد
                  </p>
                </div>
              )}
            </div> },
            { id: 'analytics', label: 'تحليلات',content: <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    تحليل الأداء
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>أعلى درجة</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>متوسط الدرجات</span>
                        <span>{Math.round(averageScore)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${averageScore}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>أدنى درجة</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    إحصائيات الوقت
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">متوسط الوقت المستغرق</span>
                      <span className="font-medium">{Math.round(averageTime)} دقيقة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">أسرع محاولة</span>
                      <span className="font-medium">5 دقائق</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">أبطأ محاولة</span>
                      <span className="font-medium">45 دقيقة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الحد الزمني</span>
                      <span className="font-medium">{quizData.timeLimit || 'غير محدود'} دقيقة</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  تحليل الاتجاهات
                </h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p>رسم بياني للاتجاهات الزمنية</p>
                  </div>
                </div>
              </Card>
            </div> },
            { id: 'questions', label: 'تحليل الأسئلة',content: <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                تحليل الأسئلة ({quizData.questions?.length || 0})
              </h3>

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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-sm text-gray-600">نسبة الإجابة الصحيحة</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">2.1</div>
                      <div className="text-sm text-gray-600">متوسط النقاط المكتسبة</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">45 ث</div>
                      <div className="text-sm text-gray-600">متوسط الوقت المستغرق</div>
                    </div>
                  </div>

                  {question.options && question.options.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">توزيع الإجابات:</h5>
                      <div className="space-y-2">
                        {question.options.map((option:any, optIndex:any) => (
                          <div key={option.id} className="flex items-center gap-3 gap-reverse">
                            <span className={`w-4 h-4 rounded-full ${option.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            <span className="text-sm text-gray-700 flex-1">{option.text}</span>
                            <span className="text-sm font-medium text-gray-900">65%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {(!quizData.questions || quizData.questions.length === 0) && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا توجد أسئلة
                  </h3>
                  <p className="text-gray-600">
                    لم يتم إضافة أسئلة لهذا الاختبار
                  </p>
                </div>
              )}
            </div> },
          ]}
        />

      </Card>
    </div>
  )
} 