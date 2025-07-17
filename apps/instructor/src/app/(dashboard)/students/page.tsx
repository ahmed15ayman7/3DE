'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  Eye,
  MessageSquare,
  Award,
  TrendingUp,
  TrendingDown,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  Mail,
  Phone,
  Download,
  UserPlus,
} from 'lucide-react'
import Link from 'next/link'
import { Card, Button, Badge, Avatar, Dropdown, Progress, Tabs } from '@3de/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface StudentCardProps {
  student: any
  onViewProfile: (student: any) => void
  onSendMessage: (student: any) => void
}

const StudentCard = ({ student, onViewProfile, onSendMessage }: StudentCardProps) => {
  const menuItems = [
    {
      id: 'profile',
      label: 'عرض الملف الشخصي',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onViewProfile(student),
    },
    {
      id: 'message',
      label: 'إرسال رسالة',
      icon: <MessageSquare className="h-4 w-4" />,
      onClick: () => onSendMessage(student),
    },
    {
      id: 'performance',
      label: 'تقرير الأداء',
      icon: <TrendingUp className="h-4 w-4" />,
      onClick: () => {},
    },
  ]

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 60) return <TrendingUp className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Student Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 gap-reverse">
              <Avatar
                src={student.avatar}
                fallback={`${student.firstName[0]}${student.lastName[0]}`}
                size="lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{student.email}</p>
                <div className="flex items-center gap-2 gap-reverse mt-1">
                  <Badge variant="outline" size="sm">
                    {student.level}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    انضم {student.joinedDaysAgo} يوم مضى
                  </span>
                </div>
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

        {/* Student Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-main">
                {student.enrolledCourses}
              </div>
              <div className="text-xs text-gray-500">كورسات مسجل</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-main">
                {student.completedCourses}
              </div>
              <div className="text-xs text-gray-500">كورسات مكتملة</div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                التقدم الإجمالي
              </span>
              <span className="text-sm font-bold text-primary-main">
                {student.overallProgress}%
              </span>
            </div>
            <Progress value={student.overallProgress} className="h-2" />
          </div>

          {/* Performance Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">متوسط الدرجات:</span>
              <div className="flex items-center gap-1 gap-reverse">
                {getPerformanceIcon(student.averageScore)}
                <span className={`font-medium ${getPerformanceColor(student.averageScore)}`}>
                  {student.averageScore}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">معدل الحضور:</span>
              <span className="font-medium text-gray-900">
                {student.attendanceRate}%
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">آخر نشاط:</span>
              <span className="text-gray-500">
                {student.lastActivity}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 gap-reverse mt-4">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onViewProfile(student)}
            >
              <Eye className="h-4 w-4 ml-2" />
              عرض الملف
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(student)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

const StudentListItem = ({ student, onViewProfile, onSendMessage }: StudentCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.01 }}
  >
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 gap-reverse flex-1">
          <Avatar
            src={student.avatar}
            fallback={`${student.firstName[0]}${student.lastName[0]}`}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 gap-reverse mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </h3>
              <Badge variant="outline" size="sm">
                {student.level}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2">{student.email}</p>
            <div className="flex items-center gap-6 gap-reverse text-sm text-gray-500">
              <span className="flex items-center gap-1 gap-reverse">
                <BookOpen className="h-4 w-4" />
                <span>{student.enrolledCourses} كورس</span>
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <Award className="h-4 w-4" />
                <span>{student.averageScore}% متوسط</span>
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <Clock className="h-4 w-4" />
                <span>{student.lastActivity}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 gap-reverse">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {student.overallProgress}% مكتمل
            </div>
            <Progress value={student.overallProgress} className="w-24 h-2 mt-1" />
          </div>
          
          <div className="flex items-center gap-2 gap-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(student)}
            >
              <Eye className="h-4 w-4 ml-2" />
              عرض
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(student)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </motion.div>
)

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data
  const mockStudents = [
    {
      id: '1',
      firstName: 'أحمد',
      lastName: 'محمد',
      email: 'ahmed@example.com',
      avatar: '/student1.jpg',
      level: 'متوسط',
      enrolledCourses: 3,
      completedCourses: 1,
      overallProgress: 75,
      averageScore: 85,
      attendanceRate: 92,
      lastActivity: 'منذ ساعة واحدة',
      joinedDaysAgo: 45,
      status: 'active',
    },
    {
      id: '2',
      firstName: 'فاطمة',
      lastName: 'أحمد',
      email: 'fatima@example.com',
      avatar: '/student2.jpg',
      level: 'متقدم',
      enrolledCourses: 5,
      completedCourses: 3,
      overallProgress: 90,
      averageScore: 92,
      attendanceRate: 98,
      lastActivity: 'منذ 30 دقيقة',
      joinedDaysAgo: 120,
      status: 'active',
    },
    {
      id: '3',
      firstName: 'محمد',
      lastName: 'سالم',
      email: 'mohammed@example.com',
      avatar: '/student3.jpg',
      level: 'مبتدئ',
      enrolledCourses: 2,
      completedCourses: 0,
      overallProgress: 45,
      averageScore: 65,
      attendanceRate: 78,
      lastActivity: 'منذ 3 أيام',
      joinedDaysAgo: 15,
      status: 'inactive',
    },
  ]

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = selectedCourse === 'all' // Add course filtering logic
    const matchesLevel = selectedLevel === 'all' || student.level === selectedLevel
    const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus
    
    return matchesSearch && matchesCourse && matchesLevel && matchesStatus
  })

  const handleViewProfile = (student: any) => {
    console.log('View profile:', student.id)
  }

  const handleSendMessage = (student: any) => {
    console.log('Send message to:', student.id)
  }

  // Analytics data
  const performanceData = [
    { level: 'مبتدئ', count: 12, avgScore: 68 },
    { level: 'متوسط', count: 25, avgScore: 78 },
    { level: 'متقدم', count: 8, avgScore: 89 },
  ]

  const activeStudents = filteredStudents.filter(s => s.status === 'active').length
  const totalStudents = filteredStudents.length
  const averageProgress = Math.round(filteredStudents.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents)
  const averageScore = Math.round(filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents)

  const tabItems = [
    {
      id: 'all',
      label: 'جميع الطلاب',
      content: (
        <div className="space-y-6">
          {/* Filters and Search */}
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
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>

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

          {/* Students Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onViewProfile={handleViewProfile}
                  onSendMessage={handleSendMessage}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <StudentListItem
                  key={student.id}
                  student={student}
                  onViewProfile={handleViewProfile}
                  onSendMessage={handleSendMessage}
                />
              ))}
            </div>
          )}

          {filteredStudents.length === 0 && (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا يوجد طلاب
              </h3>
              <p className="text-gray-600">
                لا يوجد طلاب يطابقون المعايير المحددة
              </p>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'التحليلات',
      content: (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الطلاب</p>
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
                  <p className="text-sm font-medium text-gray-600">الطلاب النشطون</p>
                  <p className="text-2xl font-bold text-gray-900">{activeStudents}</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط التقدم</p>
                  <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
                </div>
                <div className="p-3 bg-accent-main rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">متوسط الدرجات</p>
                  <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                </div>
                <div className="p-3 bg-secondary-main rounded-full">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Performance by Level */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              الأداء حسب المستوى
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" name="عدد الطلاب" />
                <Bar dataKey="avgScore" fill="#10B981" name="متوسط الدرجات" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Performers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              أفضل الطلاب أداءً
            </h3>
            <div className="space-y-4">
              {filteredStudents
                .sort((a, b) => b.averageScore - a.averageScore)
                .slice(0, 5)
                .map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 gap-reverse">
                      <div className="text-lg font-bold text-primary-main">
                        #{index + 1}
                      </div>
                      <Avatar
                        src={student.avatar}
                        fallback={`${student.firstName[0]}${student.lastName[0]}`}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {student.enrolledCourses} كورسات
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        {student.averageScore}%
                      </p>
                      <p className="text-sm text-gray-500">
                        متوسط الدرجات
                      </p>
                    </div>
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلاب</h1>
          <p className="text-gray-600 mt-1">
            متابعة وإدارة أداء الطلاب المسجلين
          </p>
        </div>
        
        <div className="flex gap-3 gap-reverse">
          <Button variant="outline">
            <Download className="h-5 w-5 ml-2" />
            تصدير البيانات
          </Button>
          <Button variant="primary">
            <UserPlus className="h-5 w-5 ml-2" />
            إضافة طالب
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          items={tabItems}
          defaultActiveTab="all"
          variant="underline"
          fullWidth
        />
      </Card>
    </div>
  )
} 