'use client';

import { useState } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Grid, List, SortAsc, SortDesc, Plus, KeyRound, CheckCircle, XCircle } from 'lucide-react';
import { enrollmentApi , courseApi } from '@3de/apis';
import { Button, Input, Select, Autocomplete, Modal, toast } from '@3de/ui';
import { Pagination } from '@3de/ui/components/Pagination';
import { Table, TableColumn } from '@3de/ui';
import type { EnrollmentCode } from '@3de/interfaces';
import type { Course } from '@3de/interfaces';

export default function EnrollmentCodesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'code' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [courseId, setCourseId] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [count, setCount] = useState(1);

  // Fetch Codes
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['enrollmentCodes', search, courseId, page, itemsPerPage],
    queryFn: () => enrollmentApi.getAllEnrollmentCodes(search, itemsPerPage, (page - 1) * itemsPerPage, courseId),
    placeholderData: keepPreviousData,
  });

  const codes = data?.data.data || [];
  const totalPages = data?.data.totalPages || 1;
  const totalItems = data?.data.total || 0;

  // Fetch Courses for Filter & Modal
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });
  const courses: Course[] = coursesData?.data || [];

  const createCodesMutation = useMutation({
    mutationFn: async () => {
      const promises = Array.from({ length: count }).map(() =>
        enrollmentApi.createEnrollmentCode({ courseId: selectedCourse, isUsed: false }),
      );
      return Promise.all(promises);
    },
    onMutate: () => {
      toast.loading('جاري إنشاء الأكواد...');
    },
    onSuccess: () => {
      setIsAddDialogOpen(false);
      toast.dismiss();
      toast.success('تم إنشاء الأكواد بنجاح');
      setCount(1);
      refetch();
    },
    onError: () => {
      toast.dismiss();
      toast.error('خطأ في إنشاء الأكواد');
    },
  });
  const sortedCodes = codes.sort((a, b) => {
    const aVal = (a as any)[sortBy] || '';
    const bVal = (b as any)[sortBy] || '';
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const columns: TableColumn<EnrollmentCode>[] = [
    { key: 'code', header: 'الكود', render: (v) => <span className="font-mono">{v}</span> },
    { key: 'course', header: 'الكورس', render: (_v, r) => r.course?.title || '—' },
    { key: 'usedBy', header: 'الطالب', render: (_v, r) => r.usedBy ? r.usedBy?.firstName + ' ' + r.usedBy?.lastName : '—' },
    { key: 'isUsed', header: 'الحالة', render: (v) => (v ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />) },
    { key: 'createdAt', header: 'تاريخ الإنشاء', render: (v) => new Date(v).toLocaleString() },
  ];

  if (error) return <div className="p-6 text-red-500">خطأ في تحميل الأكواد</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">أكواد الكورسات</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-gradient-to-r from-primary-main to-primary-dark text-white">
          <Plus className="w-5 h-5 ml-2" /> إنشاء أكواد
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-6 grid gap-4 lg:grid-cols-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input placeholder="بحث عن كود..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
        </div>
        <Autocomplete value={courseId} onSelect={(e) => setCourseId(e as string)} options={courses.map((c) => ({ label: c.title, value: c.id }))} />
        <div className="flex gap-2">
          <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} variant="outline">
            {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
          </Button>
          <Button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} variant="outline">
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </Button>
        </div>
      </motion.div>
      {isLoading && <div className="p-6">جاري التحميل...</div>}
      {error && <div className="p-6 text-red-500">خطأ في تحميل الأكواد</div>}
      {codes.length === 0 && viewMode === 'grid' && <div className="p-6 text-center">لا يوجد أكواد</div>}

      {/* View */}
      {viewMode === 'list' ? (
        <Table data={sortedCodes} columns={columns} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCodes.map((code) => (
            <motion.div key={code.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-xl p-4 flex flex-col">
              <div className="flex justify-between">
                <KeyRound className="text-primary-main" />
                <span className="text-sm text-gray-500">{new Date(code.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-lg font-mono mt-2">{code.code}</div>
              <div className="mt-2 text-sm">الكورس: {code.course?.title || '—'}</div>
              <div className="mt-2 text-sm">الطالب: {code.usedBy ? code.usedBy?.firstName + ' ' + code.usedBy?.lastName : '—'}</div>
              <div className="mt-2 text-sm">{code.isUsed ? 'مستخدم' : 'غير مستخدم'}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
    {totalPages > 1 &&  <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(p) => setPage(p)}
        onItemsPerPageChange={setItemsPerPage}
        showItemsPerPage
        showTotalItems
      />}

      {/* Add Codes Dialog */}
      <Modal isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900">إنشاء أكواد جديدة</h2>
        </div>
          <div className="space-y-4">
            <Autocomplete value={selectedCourse} onSelect={(e) => setSelectedCourse(e as string)} options={courses.map((c) => ({ label: c.title, value: c.id }))} />
            <Input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              placeholder="عدد الأكواد"
            />
            <Button disabled={!selectedCourse || count < 1} onClick={() => createCodesMutation.mutate()}>
              إنشاء
            </Button>
          </div>

      </Modal>
    </div>
  );
}
