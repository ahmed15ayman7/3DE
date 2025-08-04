'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { submissionApi } from '@3de/apis';
import Layout from '../../../components/layout/Layout';
import { Card, Button, Badge, Skeleton, Alert, Tabs } from '@3de/ui';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Download,
  Grid3X3,
  List,
  Search,
  Filter,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Submission, Quiz, User } from '@3de/interfaces';
import { useAuth } from '@3de/auth';

type SubmissionWithDetails = Submission & {
  user: User;
  quiz: Quiz & {
    questions: any[];
    lesson: any & {
      course: any;
    };
  };
};

export default function ExamResultsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['submissions', 'student', user?.id],
    queryFn: () => submissionApi.getByUser(user?.id || ''),
    enabled: !!user?.id,
  });

  const submissions = (submissionsData?.data || []) as SubmissionWithDetails[];

  // Filter submissions
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = submission.quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.quiz.lesson?.course?.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'passed' && submission.passed) ||
                         (statusFilter === 'failed' && !submission.passed);

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const passedSubmissions = submissions.filter(s => s.passed).length;
  const failedSubmissions = totalSubmissions - passedSubmissions;
  const averageScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0) / totalSubmissions || 0;
  const highestScore = Math.max(...submissions.map(s => s.score || 0));
  const lowestScore = Math.min(...submissions.map(s => s.score || 0));

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'success' as const, text: 'ممتاز' };
    if (score >= 80) return { variant: 'primary' as const, text: 'جيد جداً' };
    if (score >= 70) return { variant: 'warning' as const, text: 'جيد' };
    return { variant: 'danger' as const, text: 'ضعيف' };
  };

  const handleViewDetails = (submissionId: string) => {
    router.push(`/exams/results/${submissionId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">نتائج الامتحانات</h1>
              <p className="text-gray-600">
                تتبع أداءك في جميع الاختبارات
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              تصدير النتائج
            </Button>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الاختبارات</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
              </div>
              <div className="p-3 bg-primary-main rounded-full">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الاختبارات الناجحة</p>
                <p className="text-2xl font-bold text-green-600">{passedSubmissions}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">متوسط الدرجات</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(averageScore)}%</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">نسبة النجاح</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الاختبارات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 gap-reverse">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="all">جميع النتائج</option>
                <option value="passed">نجح</option>
                <option value="failed">رسب</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-primary-main text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors rounded-r-lg`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 ${
                    viewMode === 'table'
                      ? 'bg-primary-main text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  } transition-colors rounded-l-lg`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission) => {
                const scoreBadge = getScoreBadge(submission.score || 0);
                return (
                  <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {submission.quiz.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {submission.quiz.lesson?.course?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {submission.quiz.lesson?.title}
                        </p>
                      </div>
                      <Badge variant={scoreBadge.variant} size="sm">
                        {scoreBadge.text}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">الدرجة:</span>
                        <span className={`text-lg font-bold ${getScoreColor(submission.score || 0)}`}>
                          {submission.score || 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">الحالة:</span>
                        <Badge variant={submission.passed ? 'success' : 'danger'} size="sm">
                          {submission.passed ? 'نجح' : 'رسب'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">التاريخ:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(submission.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleViewDetails(submission.id)}
                      variant="outline"
                      fullWidth
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاختبار
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكورس
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الدرس
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الدرجة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الحالة
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
                    {filteredSubmissions.map((submission) => {
                      const scoreBadge = getScoreBadge(submission.score || 0);
                      return (
                        <tr key={submission.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {submission.quiz.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {submission.quiz.lesson?.course?.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {submission.quiz.lesson?.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`text-sm font-bold ${getScoreColor(submission.score || 0)}`}>
                                {submission.score || 0}%
                              </span>
                              <Badge variant={scoreBadge.variant} size="sm" className="mr-2">
                                {scoreBadge.text}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={submission.passed ? 'success' : 'danger'} size="sm">
                              {submission.passed ? 'نجح' : 'رسب'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(submission.createdAt).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              onClick={() => handleViewDetails(submission.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Eye className="w-4 h-4 ml-1" />
                              عرض
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {filteredSubmissions.length === 0 && (
            <Card className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد نتائج
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'لا توجد نتائج تطابق المعايير المحددة'
                  : 'لم تكمل أي اختبارات بعد'}
              </p>
              <Button onClick={() => router.push('/exams')}>
                <ArrowRight className="w-4 h-4 ml-2" />
                الذهاب للاختبارات
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    </Layout>
  );
} 