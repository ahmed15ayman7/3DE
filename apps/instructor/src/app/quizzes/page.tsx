'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@3de/ui';
import ChartBox, { BarChart, PieChart } from '../../components/ChartBox';
import { QuizCard } from '../../components/QuizCard';
import { Modal } from '@3de/ui';
import { QuizForm } from '../../components/QuizForm';

// Mock data - يجب استبدالها بـ API calls حقيقية
const mockQuizzes = [
  {
    id: '1',
    title: 'اختبار الرياضيات - الوحدة الأولى',
    description: 'اختبار تقييمي للوحدة الأولى في مادة الرياضيات',
    courseName: 'الرياضيات المتقدمة',
    questionsCount: 15,
    duration: 60,
    attempts: 45,
    averageScore: 78,
    status: 'active',
    passingScore: 70,
    createdAt: '2024-01-15',
    isScheduled: false,
    scheduledDate: null,
  },
  {
    id: '2',
    title: 'اختبار الفيزياء - قوانين نيوتن',
    description: 'اختبار شامل حول قوانين نيوتن في الحركة',
    courseName: 'الفيزياء العامة',
    questionsCount: 20,
    duration: 90,
    attempts: 32,
    averageScore: 82,
    status: 'scheduled',
    passingScore: 75,
    createdAt: '2024-01-10',
    isScheduled: true,
    scheduledDate: '2024-01-25',
  },
  {
    id: '3',
    title: 'اختبار البرمجة - JavaScript',
    description: 'اختبار عملي في أساسيات البرمجة بـ JavaScript',
    courseName: 'البرمجة للمبتدئين',
    questionsCount: 12,
    duration: 45,
    attempts: 67,
    averageScore: 75,
    status: 'completed',
    passingScore: 65,
    createdAt: '2024-01-05',
    isScheduled: false,
    scheduledDate: null,
  },
];

const QuizzesPage = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [filteredQuizzes, setFilteredQuizzes] = useState(mockQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // إحصائيات
  const totalQuizzes = quizzes.length;
  const activeQuizzes = quizzes.filter(q => q.status === 'active').length;
  const completedQuizzes = quizzes.filter(q => q.status === 'completed').length;
  const scheduledQuizzes = quizzes.filter(q => q.status === 'scheduled').length;
  const totalAttempts = quizzes.reduce((sum, quiz) => sum + quiz.attempts, 0);
  const averageScore = Math.round(quizzes.reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizzes.length);

  // تحديث الفلترة عند تغيير البحث أو الفلتر
  useEffect(() => {
    let filtered = quizzes;

    // فلترة بالبحث
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // فلترة بالحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quiz => quiz.status === statusFilter);
    }

    setFilteredQuizzes(filtered);
  }, [searchTerm, statusFilter, quizzes]);

  const handleCreateQuiz = (quizData: any) => {
    const newQuiz = {
      id: Date.now().toString(),
      ...quizData,
      attempts: 0,
      averageScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuizzes([newQuiz, ...quizzes]);
    setIsCreateModalOpen(false);
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/quizzes/${quizId}/edit`);
  };

  const handleViewResults = (quizId: string) => {
    router.push(`/quizzes/${quizId}/results`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const statisticsData = [
    { label: 'إجمالي الاختبارات', value: totalQuizzes, color: '#3B82F6', icon: '📝' },
    { label: 'الاختبارات النشطة', value: activeQuizzes, color: '#10B981', icon: '✅' },
    { label: 'الاختبارات المجدولة', value: scheduledQuizzes, color: '#F59E0B', icon: '⏰' },
    { label: 'الاختبارات المكتملة', value: completedQuizzes, color: '#6B7280', icon: '🏁' },
  ];

  const performanceData = [
    { label: 'إجمالي المحاولات', value: totalAttempts, color: '#8B5CF6', icon: '👥' },
    { label: 'متوسط الدرجات', value: `${averageScore}%`, color: '#EC4899', icon: '📊' },
  ];

  const chartData = quizzes.map(quiz => ({
    name: quiz.title.substring(0, 15) + '...',
    attempts: quiz.attempts,
    averageScore: quiz.averageScore,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الاختبارات</h1>
          <p className="text-gray-600">قم بإنشاء وإدارة اختبارات طلابك</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-primary-main text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          + إنشاء اختبار جديد
        </motion.button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quiz Statistics */}
        {statisticsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}

        {/* Performance Statistics */}
        {performanceData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + statisticsData.length) * 0.1 }}
            className="bg-white p-6 rounded-lg shadow-custom border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="محاولات الاختبارات"
          data={chartData as any}
          type="bar"
        />
        <ChartBox
          title="متوسط الدرجات"
          data={chartData as any}
          type="line"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-custom border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="البحث في الاختبارات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main"
          >
            <option value="all">جميع الاختبارات</option>
            <option value="active">نشط</option>
            <option value="scheduled">مجدول</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <QuizCard
              quiz={quiz as any}
              onEdit={handleEditQuiz as any}
              onViewResults={handleViewResults as any}
              onDelete={handleDeleteQuiz as any}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد اختبارات</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'لا توجد اختبارات تطابق معايير البحث'
              : 'ابدأ بإنشاء أول اختبار لطلابك'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-primary-main text-white rounded-lg font-medium"
            >
              إنشاء اختبار جديد
            </motion.button>
          )}
        </div>
      )}

      {/* Create Quiz Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="إنشاء اختبار جديد"
        size="xl"
      >
        <QuizForm onSubmit={handleCreateQuiz} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default QuizzesPage; 