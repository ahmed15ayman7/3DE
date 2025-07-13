'use client';

import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Alert, Skeleton, Select } from '@3de/ui';
import { LearningPathCard } from '../../components/paths/LearningPathCard';
import { InfiniteLoader } from '../../components/common/InfiniteLoader';
import { BookOpen, Filter, Search } from 'lucide-react';
import { Path, Course, User } from '@3de/interfaces';
import { useRouter } from 'next/navigation';
import { pathApi } from '@3de/apis';

interface PathWithRelations extends Path {
  courses: Course[];
  peers: User[];
}

export default function PathsPage() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // جلب مسارات التعلم مع pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['paths', selectedLevel, searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      // محاكاة API call
      const paths = await pathApi.getAll(pageParam, 10, searchQuery);
      return {
        paths: paths.data as PathWithRelations[],
        nextPage: pageParam < 3 ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1
  });

  const allPaths = data?.pages.flatMap(page => page.paths) || [];

  const handlePathClick = (pathId: string) => {
    router.push(`/paths/${pathId}`);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
  };

  const filteredPaths = allPaths.filter(path => {
    const matchesLevel = selectedLevel === 'all' || path.level === selectedLevel;
    const matchesSearch = path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         path.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="خطأ في تحميل المسارات">
          حدث خطأ أثناء تحميل مسارات التعلم. يرجى المحاولة مرة أخرى.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مسارات التعلم
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف مسارات التعلم المنظمة وابدأ رحلتك التعليمية
          </p>
        </div>

        {/* أدوات البحث والتصفية */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* البحث */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ابحث في المسارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* تصفية المستوى */}
            <div className="sm:w-48">
              <select
                value={selectedLevel}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع المستويات</option>
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
              </select>
            </div>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredPaths.length}</div>
              <div className="text-sm text-gray-600">إجمالي المسارات</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredPaths.filter(p => p.level === 'beginner').length}
              </div>
              <div className="text-sm text-gray-600">مبتدئ</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredPaths.filter(p => p.level === 'intermediate').length}
              </div>
              <div className="text-sm text-gray-600">متوسط</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredPaths.filter(p => p.level === 'advanced').length}
              </div>
              <div className="text-sm text-gray-600">متقدم</div>
            </div>
          </div>
        </div>

        {/* قائمة المسارات */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-lg" />
            ))}
          </div>
        ) : filteredPaths.length > 0 ? (
          <InfiniteLoader
            onLoadMore={fetchNextPage}
            hasMore={hasNextPage}
            isLoading={isFetchingNextPage}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <LearningPathCard
                    path={path}
                    onClick={handlePathClick}
                  />
                </motion.div>
              ))}
            </div>
          </InfiniteLoader>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد مسارات متاحة
            </h3>
            <p className="text-gray-600">
              جرب تغيير معايير البحث أو التصفية
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 