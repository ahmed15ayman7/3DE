'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Download,
  UserCheck,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  FileText,
  Users,
  BookOpen
} from 'lucide-react';
import { enrollmentApi, userApi, courseApi } from '@3de/apis';
import { Button, Input, Modal, toast } from '@3de/ui';
import { Enrollment, User, Course } from '@3de/interfaces';

export default function EnrollmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedEnrollment, setSelectedEnrollment] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const limit = 20;

  const queryClient = useQueryClient();

  // Fetch enrollments data
  const { data: enrollmentsData, isLoading, error } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentApi.getAll(),
  });

  // Fetch courses for filter
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });

  const enrollments = enrollmentsData?.data || [];
  const courses = coursesData?.data || [];

  // Delete enrollment mutation
  const deleteEnrollmentMutation = useMutation({
    mutationFn: (id: string) => enrollmentApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الاشتراك بنجاح');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      setShowDeleteModal(false);
      setSelectedEnrollment(null);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الاشتراك');
    },
  });

  // Update enrollment status mutation
  const updateEnrollmentMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      enrollmentApi.update(id, { status: status as any }),
    onSuccess: () => {
      toast.success('تم تحديث حالة الاشتراك بنجاح');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
    onError: () => {
      toast.error('حدث خطأ أثناء تحديث الاشتراك');
    },
  });

  // Filter enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    const student = enrollment.user;
    const course = enrollment.course;
    
    const matchesSearch = 
      student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || enrollment.status === statusFilter;
    const matchesCourse = courseFilter === 'ALL' || enrollment.courseId === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedEnrollments = filteredEnrollments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEnrollments.length / limit);

  // Statistics
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE').length;
  const pendingEnrollments = enrollments.filter(e => e.status === 'PENDING').length;
  const cancelledEnrollments = enrollments.filter(e => e.status === 'CANCELLED').length;
  const averageProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length 
    : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'PENDING':
        return 'في الانتظار';
      case 'CANCELLED':
        return 'ملغى';
      default:
        return 'غير محدد';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const headers = [
      'اسم الطالب',
      'البريد الإلكتروني',
      'الكورس',
      'الحالة',
      'التقدم',
      'تاريخ التسجيل',
      'آخر تحديث'
    ];

    const csvData = filteredEnrollments.map(enrollment => [
      `${enrollment.user?.firstName || ''} ${enrollment.user?.lastName || ''}`,
      enrollment.user?.email || '',
      enrollment.course?.title || '',
      getStatusText(enrollment.status),
      `${Math.round(enrollment.progress || 0)}%`,
      new Date(enrollment.createdAt).toLocaleDateString('ar-SA'),
      new Date(enrollment.updatedAt).toLocaleDateString('ar-SA')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `enrollments_${new Date().toISOString().split('T')[0]}.csv`);
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
            {[...Array(5)].map((_, i) => (
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
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل الاشتراكات</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">الاشتراكات</h1>
          <p className="text-gray-600 mt-1">
            إدارة ومراقبة اشتراكات الطلاب في الكورسات ({filteredEnrollments.length} اشتراك)
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-5 h-5 ml-2" />
            تصدير Excel
          </Button>
          
          <Button className="bg-gradient-to-r from-primary-main to-primary-dark text-white">
            <Plus className="w-5 h-5 ml-2" />
            اشتراك جديد
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <UserCheck className="w-12 h-12 text-primary-main mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
          <p className="text-gray-600">إجمالي الاشتراكات</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{activeEnrollments}</p>
          <p className="text-gray-600">اشتراكات نشطة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{pendingEnrollments}</p>
          <p className="text-gray-600">في الانتظار</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{cancelledEnrollments}</p>
          <p className="text-gray-600">ملغية</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في الاشتراكات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="ACTIVE">نشط</option>
            <option value="PENDING">في الانتظار</option>
            <option value="CANCELLED">ملغى</option>
          </select>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <option value="ALL">جميع الكورسات</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Enrollments Table */}
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
                  الكورس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التقدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEnrollments.map((enrollment) => (
                <motion.tr
                  key={enrollment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {enrollment.user?.firstName?.[0] || 'T'}
                        </span>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.user?.firstName} {enrollment.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.course?.title || 'كورس غير محدد'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {enrollment.course?.level}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(enrollment.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                        {getStatusText(enrollment.status)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">
                        {Math.round(enrollment.progress || 0)}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(enrollment.createdAt).toLocaleDateString('ar-SA')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {/* View details */}}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <select
                        value={enrollment.status}
                        onChange={(e) => updateEnrollmentMutation.mutate({
                          id: enrollment.id,
                          status: e.target.value
                        })}
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        disabled={updateEnrollmentMutation.isPending}
                      >
                        <option value="ACTIVE">نشط</option>
                        <option value="PENDING">في الانتظار</option>
                        <option value="CANCELLED">ملغى</option>
                      </select>
                      
                      <button
                        onClick={() => {
                          setSelectedEnrollment(enrollment.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredEnrollments.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد اشتراكات</h3>
            <p className="text-gray-500">لم يتم العثور على اشتراكات تطابق معايير البحث.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                عرض {startIndex + 1} إلى {Math.min(endIndex, filteredEnrollments.length)} من {filteredEnrollments.length} اشتراك
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  السابق
                </Button>
                
                <span className="flex items-center px-3 py-1 text-sm text-gray-600">
                  {page} من {totalPages}
                </span>
                
                <Button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  التالي
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            هل أنت متأكد من رغبتك في حذف هذا الاشتراك؟ هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            
            <Button
              onClick={() => selectedEnrollment && deleteEnrollmentMutation.mutate(selectedEnrollment)}
              disabled={deleteEnrollmentMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 