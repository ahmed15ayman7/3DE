'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Input, Select, Modal, Textarea } from '@3de/ui';
import { useRouter } from 'next/navigation';

interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration: number;
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  viewsCount: number;
  completionsCount: number;
  studentsCount: number;
  completionRate: number;
}

const LessonsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mock data للدروس
  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'مقدمة في البرمجة الكائنية',
      description: 'تعرف على المفاهيم الأساسية للبرمجة الكائنية وأهميتها',
      courseId: '1',
      courseName: 'البرمجة المتقدمة',
      type: 'video',
      duration: 45,
      status: 'published',
      publishDate: '2024-01-15',
      viewsCount: 120,
      completionsCount: 98,
      studentsCount: 120,
      completionRate: 82
    },
    {
      id: '2',
      title: 'الكلاسات والكائنات',
      description: 'كيفية إنشاء واستخدام الكلاسات والكائنات في البرمجة',
      courseId: '1',
      courseName: 'البرمجة المتقدمة',
      type: 'video',
      duration: 60,
      status: 'published',
      publishDate: '2024-01-18',
      viewsCount: 105,
      completionsCount: 89,
      studentsCount: 120,
      completionRate: 74
    },
    {
      id: '3',
      title: 'اختبار الوحدة الأولى',
      description: 'اختبار تقييمي للوحدة الأولى في البرمجة الكائنية',
      courseId: '1',
      courseName: 'البرمجة المتقدمة',
      type: 'quiz',
      duration: 30,
      status: 'published',
      publishDate: '2024-01-22',
      viewsCount: 95,
      completionsCount: 85,
      studentsCount: 120,
      completionRate: 71
    },
    {
      id: '4',
      title: 'مشروع عملي: نظام إدارة المكتبة',
      description: 'مشروع عملي لتطبيق مفاهيم البرمجة الكائنية',
      courseId: '1',
      courseName: 'البرمجة المتقدمة',
      type: 'assignment',
      duration: 120,
      status: 'draft',
      publishDate: '',
      viewsCount: 0,
      completionsCount: 0,
      studentsCount: 120,
      completionRate: 0
    }
  ];

  const courses = [
    { value: 'all', label: 'جميع الكورسات' },
    { value: '1', label: 'البرمجة المتقدمة' },
    { value: '2', label: 'JavaScript للمبتدئين' },
    { value: '3', label: 'React الأساسيات' }
  ];

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'published', label: 'منشور' },
    { value: 'draft', label: 'مسودة' },
    { value: 'archived', label: 'مؤرشف' }
  ];

  // فلترة الدروس
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter;
    const matchesCourse = courseFilter === 'all' || lesson.courseId === courseFilter;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'text': return '📄';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      default: return '📚';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'video': return 'فيديو';
      case 'text': return 'نص';
      case 'quiz': return 'اختبار';
      case 'assignment': return 'مهمة';
      default: return type;
    }
  };

  // إحصائيات سريعة
  const totalLessons = lessons.length;
  const publishedLessons = lessons.filter(l => l.status === 'published').length;
  const draftLessons = lessons.filter(l => l.status === 'draft').length;
  const averageCompletionRate = Math.round(
    lessons.reduce((sum, lesson) => sum + lesson.completionRate, 0) / lessons.length
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الدروس</h1>
          <p className="text-gray-600">إنشاء وإدارة محتوى الدروس التعليمية</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">استيراد محتوى</Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + إنشاء درس جديد
          </Button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-blue-600">{totalLessons}</div>
          <div className="text-sm text-gray-600">إجمالي الدروس</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-green-600">{publishedLessons}</div>
          <div className="text-sm text-gray-600">الدروس المنشورة</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{draftLessons}</div>
          <div className="text-sm text-gray-600">المسودات</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-purple-600">{averageCompletionRate}%</div>
          <div className="text-sm text-gray-600">متوسط الإنجاز</div>
        </Card>
      </div>

      {/* فلاتر البحث */}
      <Card padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="البحث في الدروس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
          <Select
            label="الكورس"
            options={courses}
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          />
          <Select
            label="الحالة"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCourseFilter('all');
              setStatusFilter('all');
            }}
            className="mt-auto"
          >
            إعادة تعيين
          </Button>
        </div>
      </Card>

      {/* قائمة الدروس */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card padding="lg" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">
                    {getTypeIcon(lesson.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                      <Badge variant={getStatusColor(lesson.status)} size="sm">
                        {getStatusText(lesson.status)}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {getTypeText(lesson.type)}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{lesson.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>📚 {lesson.courseName}</span>
                      <span>⏱️ {lesson.duration} دقيقة</span>
                      <span>👁️ {lesson.viewsCount} مشاهدة</span>
                      <span>✅ {lesson.completionsCount} إنجاز</span>
                      {lesson.publishDate && (
                        <span>📅 {lesson.publishDate}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{lesson.completionRate}%</div>
                    <div className="text-xs text-gray-500">معدل الإنجاز</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/lessons/${lesson.id}`)}
                    >
                      عرض
                    </Button>
                    <Button size="sm" variant="ghost">
                      تعديل
                    </Button>
                    <Button size="sm" variant="ghost">
                      ⋮
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* حالة فارغة */}
      {filteredLessons.length === 0 && (
        <Card padding="lg" className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دروس</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
              ? 'لا توجد دروس تطابق معايير البحث'
              : 'ابدأ بإنشاء أول درس لك'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && courseFilter === 'all' && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              إنشاء درس جديد
            </Button>
          )}
        </Card>
      )}

      {/* Modal إنشاء درس جديد */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إنشاء درس جديد"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="عنوان الدرس *"
            placeholder="أدخل عنوان الدرس"
          />

          <Textarea
            label="وصف الدرس *"
            placeholder="أدخل وصف مختصر للدرس"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="الكورس *"
              options={courses.filter(c => c.value !== 'all')}
            />

            <Select
              label="نوع الدرس *"
              options={[
                { value: 'video', label: 'فيديو' },
                { value: 'text', label: 'نص' },
                { value: 'quiz', label: 'اختبار' },
                { value: 'assignment', label: 'مهمة' }
              ]}
            />
          </div>

          <Input
            type="number"
            label="مدة الدرس (بالدقائق)"
            placeholder="45"
            min="1"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button variant="outline">
              حفظ كمسودة
            </Button>
            <Button>
              إنشاء ونشر
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LessonsPage; 