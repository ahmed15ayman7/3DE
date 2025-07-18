'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Download, Eye } from 'lucide-react'
import { Card, Button, Input, Select, Badge, Avatar, Pagination, Spinner, Progress } from '@3de/ui'
import { attendanceApi, courseApi, userApi } from '@3de/apis'
import { Attendance, User, Course } from '@3de/interfaces'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // جلب بيانات الحضور
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', selectedDate, selectedCourse],
    queryFn: () => {
      if (selectedDate && selectedCourse) {
        return attendanceApi.getByDateAndLesson(selectedDate, selectedCourse)
      } else if (selectedDate) {
        return attendanceApi.getByDate(selectedDate)
      }
      return attendanceApi.getAll()
    }
  })

  // جلب الكورسات
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getAll
  })

  // إحصائيات الحضور
  const getAttendanceStats = () => {
    if (!attendanceData?.data) return { present: 0, absent: 0, late: 0, total: 0 }
    
    const stats = attendanceData.data.reduce((acc: any, record: Attendance) => {
      acc.total += 1
      if (record.status === 'PRESENT') acc.present += 1
      else if (record.status === 'ABSENT') acc.absent += 1
      else if (record.status === 'LATE') acc.late += 1
      return acc
    }, { present: 0, absent: 0, late: 0, total: 0 })

    return stats
  }

  const stats = getAttendanceStats()
  const presentRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0

  // تصفية البيانات
  const filteredData = attendanceData?.data?.filter((record: Attendance & { student: User, lesson: { title: string } }) => {
    const matchesSearch = record.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === '' || record.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <Badge variant="success" className="text-xs">حاضر</Badge>
      case 'ABSENT':
        return <Badge variant="danger" className="text-xs">غائب</Badge>
      case 'LATE':
        return <Badge variant="warning" className="text-xs">متأخر</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">غير محدد</Badge>
    }
  }

  const handleUpdateStatus = async (attendanceId: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE') => {
    try {
      await attendanceApi.updateStatus(attendanceId, newStatus)
      // إعادة تحميل البيانات
      window.location.reload()
    } catch (error) {
      console.error('خطأ في تحديث حالة الحضور:', error)
    }
  }

  const exportAttendance = () => {
    // منطق تصدير البيانات
    const csvContent = "data:text/csv;charset=utf-8," 
      + "الاسم,الكورس,التاريخ,الحالة,الوقت\n"
      + filteredData.map((record: any) => 
          `${record.student?.firstName} ${record.student?.lastName},${record.lesson?.title},${format(new Date(record.createdAt), 'yyyy-MM-dd', { locale: ar })},${record.status},${format(new Date(record.createdAt), 'HH:mm', { locale: ar })}`
        ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `attendance_${selectedDate}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* العنوان والإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الحضور</h1>
            <p className="text-gray-600">تتبع وإدارة حضور الطلاب في الكورسات</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={exportAttendance}
              variant="outline"
              icon={<Download className="w-4 h-4" />}
            >
              تصدير البيانات
            </Button>
          </div>
        </div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">الحاضرون</p>
                  <p className="text-2xl font-bold">{stats.present}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">الغائبون</p>
                  <p className="text-2xl font-bold">{stats.absent}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">المتأخرون</p>
                  <p className="text-2xl font-bold">{stats.late}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-200" />
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
                  <p className="text-blue-100 text-sm font-medium">معدل الحضور</p>
                  <p className="text-2xl font-bold">{presentRate}%</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
              <div className="mt-3">
                <Progress value={presentRate} className="h-2 bg-blue-400" />
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* الفلاتر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الكورس</label>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                options={[
                  { value: '', label: 'جميع الكورسات' },
                  ...(coursesData?.data?.map(course => ({
                    value: course.id,
                    label: course.title
                  })) || [])
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
              <Input
                placeholder="البحث بالاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'جميع الحالات' },
                  { value: 'PRESENT', label: 'حاضر' },
                  { value: 'ABSENT', label: 'غائب' },
                  { value: 'LATE', label: 'متأخر' }
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
        </Card>
      </motion.div>

      {/* جدول الحضور */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">سجل الحضور</h3>
          </div>

          {attendanceLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطالب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكورس
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوقت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((record: any, index: number) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            src={record.student?.avatar}
                            fallback={`${record.student?.firstName} ${record.student?.lastName}`}
                            size="sm"
                            className="ml-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.student?.firstName} {record.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.lesson?.title || 'غير محدد'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.createdAt), 'yyyy-MM-dd', { locale: ar })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(record.createdAt), 'HH:mm', { locale: ar })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(record.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <div className="flex gap-2">
                          {record.status !== 'PRESENT' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(record.id, 'PRESENT')}
                              className="text-green-600 hover:text-green-700"
                            >
                              حاضر
                            </Button>
                          )}
                          {record.status !== 'ABSENT' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(record.id, 'ABSENT')}
                              className="text-red-600 hover:text-red-700"
                            >
                              غائب
                            </Button>
                          )}
                          {record.status !== 'LATE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(record.id, 'LATE')}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              متأخر
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد سجلات حضور</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    لم يتم العثور على سجلات حضور للفترة المحددة.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                showTotalItems
              />
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
} 