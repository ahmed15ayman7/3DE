'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Grid,
  List,
  SortAsc,
  SortDesc,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Filter
} from 'lucide-react';
import { userApi, enrollmentApi, achievementApi } from '@3de/apis';
import StudentCard from '../../components/StudentCard';
import { Button, Input } from '@3de/ui';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Fetch students data
  const { data: studentsData, isLoading, error } = useQuery({
    queryKey: ['students', page, limit, searchTerm],
    queryFn: () => userApi.getAll(page, limit, searchTerm),
  });

  // Fetch enrollments for stats
  const { data: enrollmentsData } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentApi.getAll(),
  });

  const allStudents = studentsData?.data || [];
  const students = allStudents.filter(user => user.role === 'STUDENT');
  const enrollments = enrollmentsData?.data || [];

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.email.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = fullName.includes(searchLower) || email.includes(searchLower);
      
      const matchesRole = roleFilter === 'ALL' || 
        (roleFilter === 'VERIFIED' && student.isVerified) ||
        (roleFilter === 'UNVERIFIED' && !student.isVerified);
      
      const matchesStatus = statusFilter === 'ALL' ||
        (statusFilter === 'ONLINE' && student.isOnline) ||
        (statusFilter === 'OFFLINE' && !student.isOnline);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];
      
      // Handle undefined/null values
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Calculate statistics
  const verifiedStudents = students.filter(s => s.isVerified).length;
  const onlineStudents = students.filter(s => s.isOnline).length;
  const totalEnrollments = enrollments.filter(e => 
    students.some(s => s.id === e.userId)
  ).length;
  const activeEnrollments = enrollments.filter(e => 
    e.status === 'ACTIVE' && students.some(s => s.id === e.userId)
  ).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل الطلاب</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">الطلاب</h1>
          <p className="text-gray-600 mt-1">
            إدارة ومراقبة الطلاب والدارسين ({filteredStudents.length} طالب)
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <Plus className="w-5 h-5 ml-2" />
          إضافة طالب جديد
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
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          <p className="text-gray-600">إجمالي الطلاب</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{verifiedStudents}</p>
          <p className="text-gray-600">طلاب متحققين</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Clock className="w-12 h-12 text-purple-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{onlineStudents}</p>
          <p className="text-gray-600">متصل الآن</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <BookOpen className="w-12 h-12 text-orange-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{activeEnrollments}</p>
          <p className="text-gray-600">اشتراكات نشطة</p>
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
              placeholder="البحث في الطلاب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الطلاب</option>
            <option value="VERIFIED">متحققين</option>
            <option value="UNVERIFIED">غير متحققين</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="ONLINE">متصل</option>
            <option value="OFFLINE">غير متصل</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="firstName">الاسم</option>
            <option value="email">البريد الإلكتروني</option>
            <option value="createdAt">تاريخ التسجيل</option>
            <option value="age">العمر</option>
          </select>

          {/* View Mode and Sort Order */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={sortOrder === 'asc' ? 'ترتيب تصاعدي' : 'ترتيب تنازلي'}
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={viewMode === 'grid' ? 'عرض القائمة' : 'عرض الشبكة'}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Students Grid/List */}
      {filteredStudents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center min-h-96"
        >
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد طلاب</h3>
            <p className="text-gray-500">لم يتم العثور على طلاب تطابق معايير البحث.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredStudents.map((student, index) => (
            <StudentCard
              key={student.id}
              student={{
                ...student,
                enrollments: enrollments.filter(e => e.userId === student.id).map(e => ({
                  ...e,
                  course: { id: '', title: 'كورس عام', description: '', level: '', status: 'ACTIVE', progress: 0, createdAt: new Date(), updatedAt: new Date() } as any
                })),
                achievements: [],
                badges: []
              }}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {students.length >= limit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2"
        >
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
          >
            السابق
          </Button>
          
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            صفحة {page}
          </span>
          
          <Button
            onClick={() => setPage(page + 1)}
            disabled={students.length < limit}
            variant="outline"
          >
            التالي
          </Button>
        </motion.div>
      )}
    </div>
  );
} 