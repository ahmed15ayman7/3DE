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
  BookOpen
} from 'lucide-react';
import { courseApi } from '@3de/apis';
import CourseCard from '../../components/CourseCard';
import { Button, Input } from '@3de/ui';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch courses data
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });

  const courses = coursesData?.data || [];

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || course.status === statusFilter;
      const matchesLevel = levelFilter === 'ALL' || course.level === levelFilter;
      
      return matchesSearch && matchesStatus && matchesLevel;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a] as any;
      let bValue = b[sortBy as keyof typeof b] as any;
      
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

  // Get unique levels for filter
  const uniqueLevels = [...new Set(courses.map(course => course.level))];

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
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
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
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل الكورسات</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">الكورسات</h1>
          <p className="text-gray-600 mt-1">
            إدارة ومراقبة جميع الكورسات التعليمية ({filteredCourses.length} كورس)
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-primary-main to-primary-dark text-white">
          <Plus className="w-5 h-5 ml-2" />
          إضافة كورس جديد
        </Button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="البحث في الكورسات..."
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
            <option value="COMPLETED">مكتمل</option>
          </select>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <option value="ALL">جميع المستويات</option>
            {uniqueLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <option value="title">العنوان</option>
            <option value="createdAt">تاريخ الإنشاء</option>
            <option value="startDate">تاريخ البدء</option>
            <option value="progress">التقدم</option>
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

      {/* Courses Grid/List */}
      {filteredCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center min-h-96"
        >
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد كورسات</h3>
            <p className="text-gray-500">لم يتم العثور على كورسات تطابق معايير البحث.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredCourses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                instructors: course.instructors || [],
                enrollments: course.enrollments || [],
                lessons: course.lessons || []
              } as any}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
} 