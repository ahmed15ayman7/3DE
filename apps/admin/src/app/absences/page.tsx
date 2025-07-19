'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Calendar,
  User,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  Edit,
  Users,
  TrendingDown,
  CalendarDays
} from 'lucide-react';
import { attendanceApi, userApi, courseApi, lessonApi } from '@3de/apis';
import { Button, Input, Modal, toast } from '@3de/ui';
import { Attendance, User as UserType, Course, Lesson } from '@3de/interfaces';

export default function AbsencesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch attendance data
  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => attendanceApi.getAll(),
  });

  // Fetch students for filter
  const { data: studentsData } = useQuery({
    queryKey: ['students'],
    queryFn: () => userApi.getAll(1, 100, ''),
  });

  // Fetch courses for filter
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });

  const attendance = attendanceData?.data || [];
  const students = studentsData?.data?.filter(user => user.role === 'STUDENT') || [];
  const courses = coursesData?.data || [];

  // Update attendance status mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      attendanceApi.updateStatus(id, status as any),
    onSuccess: () => {
      toast.success('تم تحديث حالة الحضور بنجاح');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setShowEditModal(false);
      setSelectedAttendance(null);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الحضور');
    },
  });

  // Filter attendance records
  const filteredAttendance = attendance.filter((record: any) => {
    const student = record.student;
    const lesson = record.lesson;
    
    const matchesSearch = 
      student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStudent = studentFilter === 'ALL' || record.studentId === studentFilter;
    const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter;
    const matchesDate = !dateFilter || 
      new Date(record.createdAt).toDateString() === new Date(dateFilter).toDateString();
    
    // Course filter through lesson
    const matchesCourse = courseFilter === 'ALL' || lesson?.courseId === courseFilter;
    
    return matchesSearch && matchesStudent && matchesStatus && matchesDate && matchesCourse;
  });

  // Statistics
  const totalAbsences = attendance.filter((a: any) => a.status === 'ABSENT').length;
  const totalLate = attendance.filter((a: any) => a.status === 'LATE').length;
  const totalPresent = attendance.filter((a: any) => a.status === 'PRESENT').length;
  const attendanceRate = attendance.length > 0 
    ? ((totalPresent / attendance.length) * 100).toFixed(1)
    : '0';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ABSENT':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'LATE':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'حاضر';
      case 'ABSENT':
        return 'غائب';
      case 'LATE':
        return 'متأخر';
      default:
        return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'اسم الطالب',
      'البريد الإلكتروني',
      'الدرس',
      'الكورس',
      'الحالة',
      'الطريقة',
      'التاريخ'
    ];

    const csvData = filteredAttendance.map((record: any) => [
      `${record.student?.firstName || ''} ${record.student?.lastName || ''}`,
      record.student?.email || '',
      record.lesson?.title || '',
      '', // We'll need to get course from lesson
      getStatusText(record.status),
      record.method || '',
      new Date(record.createdAt).toLocaleDateString('ar-SA')
    ]);

    const csvContent = [headers, ...csvData]
      .map((row: any) => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('تم تصدير البيانات بنجاح');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل بيانات الحضور</h3>
          <p className="text-gray-500">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الغياب والحضور</h1>
          <p className="text-gray-600 mt-1">
            مراقبة وإدارة حضور الطلاب ({filteredAttendance.length} سجل)
          </p>
        </div>
        
        <Button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="w-5 h-5 ml-2" />
          تصدير Excel
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalPresent}</p>
          <p className="text-gray-600">حاضر</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalAbsences}</p>
          <p className="text-gray-600">غائب</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalLate}</p>
          <p className="text-gray-600">متأخر</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <TrendingDown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
          <p className="text-gray-600">معدل الحضور</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في سجلات الحضور..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Student Filter */}
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الطلاب</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الكورسات</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="PRESENT">حاضر</option>
            <option value="ABSENT">غائب</option>
            <option value="LATE">متأخر</option>
          </select>

          {/* Date Filter */}
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </motion.div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطالب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الدرس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطريقة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendance.map((record: any) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {record.student?.firstName?.[0] || 'T'}
                        </span>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {record.student?.firstName} {record.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.student?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.lesson?.title || 'درس غير محدد'}
                    </div>
                    <div className="text-sm text-gray-500">
                      الكورس: {record.lesson?.course?.title || 'غير محدد'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      {record.method === 'FACE_ID' && <User className="w-4 h-4 text-blue-500" />}
                      {record.method === 'QR_CODE' && <BookOpen className="w-4 h-4 text-green-500" />}
                      <span>{record.method || 'يدوي'}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(record.createdAt).toLocaleDateString('ar-SA')}
                      <br />
                      <Clock className="w-4 h-4 text-gray-400" />
                      {new Date(record.createdAt).toLocaleTimeString('ar-SA')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAttendance(record);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <select
                        value={record.status}
                        onChange={(e) => updateAttendanceMutation.mutate({
                          id: record.id,
                          status: e.target.value
                        })}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={updateAttendanceMutation.isPending}
                      >
                        <option value="PRESENT">حاضر</option>
                        <option value="ABSENT">غائب</option>
                        <option value="LATE">متأخر</option>
                      </select>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAttendance.length === 0 && (
          <div className="text-center py-12">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد سجلات حضور</h3>
            <p className="text-gray-500">لم يتم العثور على سجلات تطابق معايير البحث.</p>
          </div>
        )}
      </motion.div>

      {/* Edit Attendance Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="تحديث حالة الحضور"
      >
        {selectedAttendance && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedAttendance.student?.firstName} {selectedAttendance.student?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedAttendance.lesson?.title}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة الحضور
              </label>
              <select
                value={selectedAttendance.status}
                onChange={(e) => {
                  setSelectedAttendance({
                    ...selectedAttendance,
                    status: e.target.value
                  });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PRESENT">حاضر</option>
                <option value="ABSENT">غائب</option>
                <option value="LATE">متأخر</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
              >
                إلغاء
              </Button>
              
              <Button
                onClick={() => {
                  updateAttendanceMutation.mutate({
                    id: selectedAttendance.id,
                    status: selectedAttendance.status
                  });
                }}
                disabled={updateAttendanceMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                حفظ التغييرات
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 