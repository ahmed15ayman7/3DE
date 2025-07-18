'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Trophy, Star, Award, Target, TrendingUp, Users, Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Card, Button, Input, Select, Badge, Avatar, Modal, Spinner, Progress } from '@3de/ui'
import { achievementApi, userApi, badgeApi, certificateApi } from '@3de/apis'
import { Achievement, Badge as BadgeType, Certificate, User } from '@3de/interfaces'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [activeTab, setActiveTab] = useState('achievements')

  // جلب البيانات
  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: achievementApi.getAll
  })

  const { data: badgesData, isLoading: badgesLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: badgeApi.getAll
  })

  const { data: certificatesData, isLoading: certificatesLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: certificateApi.getAll
  })

  // إحصائيات الإنجازات
  const getAchievementStats = () => {
    const achievements = achievementsData?.data || []
    const badges = badgesData?.data || []
    const certificates = certificatesData?.data || []

    return {
      totalAchievements: achievements.length,
      totalBadges: badges.length,
      totalCertificates: certificates.length,
      newThisMonth: achievements.filter((a: Achievement) => {
        const createdDate = new Date(a.createdAt)
        const currentDate = new Date()
        return createdDate.getMonth() === currentDate.getMonth() && 
               createdDate.getFullYear() === currentDate.getFullYear()
      }).length
    }
  }

  const stats = getAchievementStats()

  // تصفية البيانات
  const getFilteredData = () => {
    let data: any[] = []
    
    switch (activeTab) {
      case 'achievements':
        data = achievementsData?.data || []
        break
      case 'badges':
        data = badgesData?.data || []
        break
      case 'certificates':
        data = certificatesData?.data || []
        break
    }

    return data.filter((item: any) => {
      const matchesSearch = item.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === '' || item.type === typeFilter
      return matchesSearch && matchesType
    })
  }

  const filteredData = getFilteredData()

  const getAchievementBadge = (type: string) => {
    const typeMap: { [key: string]: { variant: any, label: string } } = {
      'COURSE_COMPLETION': { variant: 'success', label: 'إكمال كورس' },
      'PERFECT_QUIZ': { variant: 'primary', label: 'اختبار مثالي' },
      'STREAK': { variant: 'warning', label: 'تتابع' },
      'PARTICIPATION': { variant: 'info', label: 'مشاركة' },
      'IMPROVEMENT': { variant: 'secondary', label: 'تحسن' },
    }
    
    const config = typeMap[type] || { variant: 'secondary', label: type }
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'COURSE_COMPLETION':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'PERFECT_QUIZ':
        return <Star className="w-5 h-5 text-blue-500" />
      case 'STREAK':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'PARTICIPATION':
        return <Users className="w-5 h-5 text-purple-500" />
      default:
        return <Award className="w-5 h-5 text-gray-500" />
    }
  }

  const handleCreateAchievement = () => {
    setSelectedAchievement(null)
    setIsModalOpen(true)
  }

  const handleEditAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement)
    setIsModalOpen(true)
  }

  const tabs = [
    { id: 'achievements', label: 'الإنجازات', icon: Award },
    { id: 'badges', label: 'الشارات', icon: Star },
    { id: 'certificates', label: 'الشهادات', icon: Trophy },
  ]

  const isLoading = achievementsLoading || badgesLoading || certificatesLoading

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الإنجازات</h1>
            <p className="text-gray-600">تتبع وإدارة إنجازات وشارات الطلاب</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleCreateAchievement}
              icon={<Plus className="w-4 h-4" />}
            >
              إنجاز جديد
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">إجمالي الإنجازات</p>
                  <p className="text-2xl font-bold">{stats.totalAchievements}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">الشارات</p>
                  <p className="text-2xl font-bold">{stats.totalBadges}</p>
                </div>
                <Star className="w-8 h-8 text-blue-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">الشهادات</p>
                  <p className="text-2xl font-bold">{stats.totalCertificates}</p>
                </div>
                <Award className="w-8 h-8 text-purple-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">جديد هذا الشهر</p>
                  <p className="text-2xl font-bold">{stats.newThisMonth}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-200" />
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* التبويبات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative inline-flex items-center px-6 py-4 text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 ml-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* الفلاتر */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                <Input
                  placeholder="البحث بالاسم أو النوع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { value: '', label: 'جميع الأنواع' },
                    { value: 'COURSE_COMPLETION', label: 'إكمال كورس' },
                    { value: 'PERFECT_QUIZ', label: 'اختبار مثالي' },
                    { value: 'STREAK', label: 'تتابع' },
                    { value: 'PARTICIPATION', label: 'مشاركة' },
                    { value: 'IMPROVEMENT', label: 'تحسن' },
                  ]}
                />
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  icon={<Filter className="w-4 h-4" />}
                  fullWidth
                >
                  تطبيق الفلاتر
                </Button>
              </div>
            </div>
          </div>

          {/* المحتوى */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          {getAchievementIcon(item.type)}
                          <div className="mr-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.title || `إنجاز ${item.type}`}
                            </h3>
                            {getAchievementBadge(item.type)}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditAchievement(item)}
                            icon={<Edit className="w-4 h-4" />}
                          >
                            <span></span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<Eye className="w-4 h-4" />}
                          >
                            <span></span>
                          </Button>
                        </div>
                      </div>

                      {/* معلومات الطالب */}
                      {item.user && (
                        <div className="flex items-center mb-4">
                          <Avatar
                            src={item.user.avatar}
                            fallback={`${item.user.firstName} ${item.user.lastName}`}
                            size="sm"
                            className="ml-3"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.user.firstName} {item.user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{item.user.email}</p>
                          </div>
                        </div>
                      )}

                      {/* الوصف */}
                      <p className="text-sm text-gray-600 mb-4">
                        {item.description || 'وصف الإنجاز غير متوفر'}
                      </p>

                      {/* النقاط */}
                      {item.points && (
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-500">النقاط:</span>
                          <span className="text-lg font-bold text-blue-600">{item.points}</span>
                        </div>
                      )}

                      {/* التاريخ */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>تاريخ الحصول</span>
                        <span>{format(new Date(item.earnedAt || item.createdAt), 'yyyy-MM-dd', { locale: ar })}</span>
                      </div>

                      {/* شريط التقدم للشهادات */}
                      {activeTab === 'certificates' && item.isApproved !== undefined && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">الحالة:</span>
                            <Badge variant={item.isApproved ? 'success' : 'warning'}>
                              {item.isApproved ? 'معتمدة' : 'قيد المراجعة'}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredData.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد إنجازات</h3>
                <p className="mt-1 text-sm text-gray-500">
                  لم يتم العثور على إنجازات للمعايير المحددة.
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* مودال إنشاء/تعديل الإنجاز */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAchievement ? 'تعديل الإنجاز' : 'إنجاز جديد'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
            <Input placeholder="عنوان الإنجاز" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
            <Select
              options={[
                { value: 'COURSE_COMPLETION', label: 'إكمال كورس' },
                { value: 'PERFECT_QUIZ', label: 'اختبار مثالي' },
                { value: 'STREAK', label: 'تتابع' },
                { value: 'PARTICIPATION', label: 'مشاركة' },
                { value: 'IMPROVEMENT', label: 'تحسن' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الطالب</label>
            <Select
              options={[
                { value: '', label: 'اختر الطالب' },
                // سيتم جلب قائمة الطلاب من API
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">النقاط</label>
            <Input type="number" placeholder="عدد النقاط" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button fullWidth>
              {selectedAchievement ? 'تحديث' : 'إنشاء'}
            </Button>
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => setIsModalOpen(false)}
            >
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
} 