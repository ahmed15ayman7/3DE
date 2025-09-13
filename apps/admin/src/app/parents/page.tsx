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
  GraduationCap,
  Users,
} from 'lucide-react';
import { parentApi } from '@3de/apis';
import { Button, Input } from '@3de/ui';
import AddParentModal from '../../components/dialogs/AddParent';
import { Parent } from '@3de/interfaces';
import ParentCard from '../../components/parentCard';

export default function ParentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('user.firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(0);
  const limit = 12;
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  // Fetch instructors data
  const { data: parentsData, isLoading, error, refetch } = useQuery({
    queryKey: ['parents', page, limit, searchTerm],
    queryFn: () => parentApi.getAll(searchTerm, limit, page),
  });

    const parents = parentsData?.data.data || [];

  // Filter and sort instructors
  const filteredParents = parents
    .filter((parent: Parent) => {
      const fullName = `${parent.user?.firstName || ''} ${parent.user?.lastName || ''}`.toLowerCase();
      const email = parent.user?.email?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();
      
      return fullName.includes(searchLower) || 
             email.includes(searchLower) || 
             fullName.includes(searchLower);
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      if (sortBy.includes('.')) {
        const [obj, prop] = sortBy.split('.');
        aValue = (a as any)[obj]?.[prop];
        bValue = (b as any)[obj]?.[prop];
      } else {
        aValue = (a as any)[sortBy];
        bValue = (b as any)[sortBy];
      }
      
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
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل المحاضرين</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">الوليين</h1>
          <p className="text-gray-600 mt-1">
            إدارة ومراقبة الوليين ({filteredParents.length} ولي)
          </p>
        </div>
        
        <Button className="bg-gradient-to-r from-primary-main to-primary-dark text-white" onClick={() => setShowAddParentModal(true)}>
          <Plus className="w-5 h-5 ml-2" />
          إضافة ولي جديد
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
          <GraduationCap className="w-12 h-12 text-primary-main mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{parentsData?.data.total}</p>
          <p className="text-gray-600">إجمالي الوليين</p>
        </div>

        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            {parents.reduce((sum, parent) => sum + (parent.children?.length || 0), 0)}
          </p>
          <p className="text-gray-600">إجمالي الأبناء</p>
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
              placeholder="البحث في الوليين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <option value="user.firstName">الاسم</option>
            <option value="user.email">البريد الإلكتروني</option>
            <option value="user.phone">الهاتف</option>
            <option value="user.location">الموقع</option>
            <option value="user.createdAt">تاريخ الانضمام</option>
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

      {/* Parents Grid/List */}
      {filteredParents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center min-h-96"
        >
          <div className="text-center">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا يوجد وليين</h3>
            <p className="text-gray-500">لم يتم العثور على وليين تطابق معايير البحث.</p>
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
          {filteredParents.map((parent, index) => (
            <ParentCard
              key={parent.id}
              parent={parent}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {filteredParents.length >= limit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2"
        >
          <Button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            variant="outline"
          >
            السابق
          </Button>
          
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            صفحة {page + 1}
          </span>
          
          <Button
            onClick={() => setPage(page + 1)}
            disabled={filteredParents.length < limit}
            variant="outline"
          >
            التالي
          </Button>
        </motion.div>
      )}
      <AddParentModal
        isOpen={showAddParentModal}
        onClose={() => setShowAddParentModal(false)}
        refetch={() => refetch()}
      />
    </div>
  );
} 