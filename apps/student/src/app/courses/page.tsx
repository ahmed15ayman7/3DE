'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@3de/apis';
import Layout from '../../components/layout/Layout';
import CourseCard from '../../components/courses/CourseCard';
import { Button, Skeleton, Badge } from '@3de/ui';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Course } from '@3de/interfaces';
import { sanitizeApiResponse } from '../../lib/utils';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: coursesResponse, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data))
      };
    },
  });

  const courses = (coursesResponse as any)?.data || [];

  const categories = [
    { id: 'all', name: 'الكل' },
    { id: 'programming', name: 'البرمجة' },
    { id: 'design', name: 'التصميم' },
    { id: 'business', name: 'الأعمال' },
    { id: 'marketing', name: 'التسويق' },
    { id: 'languages', name: 'اللغات' },
  ];

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || course.status === category;
    return matchesSearch && matchesCategory;
  });

  const enrolledCourses = filteredCourses.filter((course: Course) => course.enrollments?.length && course.enrollments?.length > 0) || [];
  const availableCourses = filteredCourses.filter((course: Course) => course.enrollments?.length === 0) || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الكورسات</h1>
          <p className="text-gray-600">
            اكتشف مجموعة متنوعة من الكورسات التعليمية عالية الجودة
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الكورسات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between"
        >
          <p className="text-gray-600">
            تم العثور على {filteredCourses?.length || 0} كورس
          </p>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {enrolledCourses.length} مشترك
            </Badge>
            <Badge variant="outline">
              {availableCourses.length} متاح
            </Badge>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className={viewMode === 'grid' ? 'h-80' : 'h-32'} />
            ))}
          </div>
        )}

        {/* Courses */}
        {!isLoading && (
          <>
            {/* Enrolled Courses */}
            {enrolledCourses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">الكورسات المشترك فيها</h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {enrolledCourses.map((course: Course, index: number) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <CourseCard course={course} isEnrolled={true} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Available Courses */}
            {availableCourses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">الكورسات المتاحة</h2>
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {availableCourses.map((course: Course, index: number  ) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <CourseCard course={course} isEnrolled={false} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && (!filteredCourses || filteredCourses.length === 0) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد كورسات
            </h3>
            <p className="text-gray-600">
              {searchTerm || category !== 'all'
                ? 'جرب تغيير معايير البحث'
                : 'سيتم إضافة كورسات جديدة قريباً'
              }
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
} 