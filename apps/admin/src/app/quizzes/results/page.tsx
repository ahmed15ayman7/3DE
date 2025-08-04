'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Search,
  Eye,
  Calendar,
  Award,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { Card, Button, Badge, Avatar, Tabs, Progress } from '@3de/ui'

export default function QuizResultsPage() {
  const router = useRouter()
  const [selectedQuiz, setSelectedQuiz] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('month')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for quiz results
  const mockQuizzes = [
    { value: 'all', label: 'جميع الاختبارات' },
    { value: '1', label: 'اختبار أساسيات React' },
    { value: '2', label: 'اختبار JavaScript المتقدم' },
    { value: '3', label: 'اختبار Node.js' },
  ]

  const mockResults = [
    {
      id: '1',
      student: {
        name: 'أحمد محمد',
        avatar: '/student1.jpg',
        email: 'ahmed@example.com',
      },
      quiz: 'اختبار أساسيات React',
      score: 85,
      totalPoints: 100,
      passingScore: 70,
      passed: true,
      timeSpent: 32,
      timeLimit: 45,
      submittedAt: new Date('2024-01-15T10:30:00'),
      attempts: 1,
      answers: [
        { questionId: '1', isCorrect: true, points: 5 },
        { questionId: '2', isCorrect: false, points: 0 },
        { questionId: '3', isCorrect: true, points: 5 },
      ],
    },
    {
      id: '2',
      student: {
        name: 'فاطمة أحمد',
        avatar: '/student2.jpg',
        email: 'fatima@example.com',
      },
      quiz: 'اختبار أساسيات React',
      score: 92,
      totalPoints: 100,
      passingScore: 70,
      passed: true,
      timeSpent: 28,
      timeLimit: 45,
      submittedAt: new Date('2024-01-15T11:15:00'),
      attempts: 1,
      answers: [
        { questionId: '1', isCorrect: true, points: 5 },
        { questionId: '2', isCorrect: true, points: 5 },
        { questionId: '3', isCorrect: true, points: 5 },
      ],
    },
    {
      id: '3',
      student: {
        name: 'محمد سالم',
        avatar: '/student3.jpg',
        email: 'mohammed@example.com',
      },
      quiz: 'اختبار JavaScript المتقدم',
      score: 65,
      totalPoints: 100,
      passingScore: 70,
      passed: false,
      timeSpent: 55,
      timeLimit: 60,
      submittedAt: new Date('2024-01-16T14:20:00'),
      attempts: 2,
      answers: [
        { questionId: '1', isCorrect: false, points: 0 },
        { questionId: '2', isCorrect: true, points: 5 },
        { questionId: '3', isCorrect: false, points: 0 },
      ],
    },
  ]

  // Analytics data
  const scoreDistribution = [
    { range: '90-100', count: 5, color: '#10B981' },
    { range: '80-89', count: 8, color: '#3B82F6' },
    { range: '70-79', count: 12, color: '#F59E0B' },
    { range: '60-69', count: 6, color: '#EF4444' },
    { range: '0-59', count: 3, color: '#6B7280' },
  ]

  const timeAnalysis = [
    { quiz: 'React أساسيات', avgTime: 32, maxTime: 45 },
    { quiz: 'JavaScript متقدم', avgTime: 48, maxTime: 60 },
    { quiz: 'Node.js', avgTime: 25, maxTime: 30 },
  ]

  const passRateData = [
    { month: 'يناير', passed: 28, failed: 7 },
    { month: 'فبراير', passed: 32, failed: 5 },
    { month: 'مارس', passed: 25, failed: 8 },
    { month: 'أبريل', passed: 30, failed: 6 },
  ]

  const filteredResults = mockResults.filter(result => {
    const matchesQuiz = selectedQuiz === 'all' || result.quiz.includes(selectedQuiz)
    const matchesSearch = result.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.student.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesQuiz && matchesSearch
  })

  const totalStudents = filteredResults.length
  const passedStudents = filteredResults.filter(r => r.passed).length
  const failedStudents = totalStudents - passedStudents
  const averageScore = Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / totalStudents)
  const passRate = Math.round((passedStudents / totalStudents) * 100)

  const tabItems = [
    {
      id: 'overview',
      label: 'نظرة عامة',
      content: (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المشاركين</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <div className="p-3 bg-primary-main rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                  <p className="text-2xl font-bold text-gray-900">{passRate}%</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط الدرجات</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                </div>
                <div className="p-3 bg-accent-main rounded-full">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الطلاب الناجحون</p>
                  <p className="text-2xl font-bold text-gray-900">{passedStudents}</p>
                </div>
                <div className="p-3 bg-secondary-main rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                توزيع الدرجات
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ range, count }) => `${range}: ${count}`}
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Pass Rate Trend */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                اتجاه معدل النجاح
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={passRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="passed" fill="#10B981" name="ناجح" />
                  <Bar dataKey="failed" fill="#EF4444" name="راسب" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'detailed',
      label: 'النتائج التفصيلية',
      content: (
        <div className="space-y-6">
          {/* Filters */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="البحث بالاسم أو البريد الإلكتروني..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 gap-reverse">
                <select
                  value={selectedQuiz}
                  onChange={(e) => setSelectedQuiz(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {mockQuizzes.map(quiz => (
                    <option key={quiz.value} value={quiz.value}>
                      {quiz.label}
                    </option>
                  ))}
                </select>

                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تصدير
                </Button>
              </div>
            </div>
          </Card>

          {/* Results Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطالب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاختبار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدرجة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوقت المستغرق
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ التسليم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResults.map((result) => (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={result.student.avatar}
                            fallback={result.student.name.split(' ').map(n => n[0]).join('')}
                            size="sm"
                          />
                          <div className="mr-3">
                            <div className="text-sm font-medium text-gray-900">
                              {result.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.quiz}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {result.score}%
                          </span>
                          <div className="mr-3 w-16">
                            <Progress 
                              value={result.score} 
                              className="h-2"
                              color={result.passed ? 'success' : 'danger'}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={result.passed ? 'success' : 'danger'}
                          size="sm"
                          className="flex items-center gap-1 gap-reverse w-fit"
                        >
                          {result.passed ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          <span>{result.passed ? 'ناجح' : 'راسب'}</span>
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-1 gap-reverse">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{result.timeSpent} دقيقة</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.submittedAt.toLocaleDateString('ar')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 ml-2" />
                          التفاصيل
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {filteredResults.length === 0 && (
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600">
                لا توجد نتائج تطابق المعايير المحددة
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'تحليلات متقدمة',
      content: (
        <div className="space-y-6">
          {/* Time Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              تحليل الوقت المستغرق
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#3B82F6" name="متوسط الوقت" />
                <Bar dataKey="maxTime" fill="#E5E7EB" name="الحد الأقصى" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Question Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              تحليل الأسئلة الأكثر صعوبة
            </h3>
            <div className="space-y-4">
              {[
                { question: 'ما هو Virtual DOM في React؟', correctRate: 45, difficulty: 'صعب' },
                { question: 'شرح مفهوم State في React', correctRate: 67, difficulty: 'متوسط' },
                { question: 'كيفية استخدام useEffect', correctRate: 78, difficulty: 'سهل' },
                { question: 'الفرق بين var و let', correctRate: 89, difficulty: 'سهل' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {item.question}
                    </p>
                    <div className="flex items-center gap-2 gap-reverse">
                      <Progress value={item.correctRate} className="w-32 h-2" />
                      <span className="text-sm text-gray-600">{item.correctRate}% صحيح</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.correctRate > 80 ? 'success' :
                      item.correctRate > 60 ? 'warning' : 'danger'
                    }
                    size="sm"
                  >
                    {item.difficulty}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
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
          العودة
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            نتائج الاختبارات والتحليلات
          </h1>
          <p className="text-gray-600">
            تحليل شامل لأداء الطلاب في الاختبارات
          </p>
        </div>
      </div>

      {/* Time Frame Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              فترة التحليل
            </h3>
            <p className="text-gray-600">
              اختر الفترة الزمنية لعرض النتائج
            </p>
          </div>
          
          <div className="flex gap-2 gap-reverse">
            {[
              { value: 'week', label: 'هذا الأسبوع' },
              { value: 'month', label: 'هذا الشهر' },
              { value: 'quarter', label: 'هذا الربع' },
              { value: 'year', label: 'هذا العام' },
            ].map((period) => (
              <Button
                key={period.value}
                onClick={() => setSelectedTimeframe(period.value)}
                variant={selectedTimeframe === period.value ? 'primary' : 'outline'}
                size="sm"
              >
                {period.label}
              </Button>
            ))}
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