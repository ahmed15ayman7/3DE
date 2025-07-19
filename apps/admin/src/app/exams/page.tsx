'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus,
  Calendar,
  Clock,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Timer,
  Award,
  Filter,
  CalendarDays
} from 'lucide-react';
import { quizApi, courseApi, lessonApi, submissionApi } from '@3de/apis';
import { Button, Input, Modal, toast } from '@3de/ui';
import { Quiz, Course, Lesson, Submission, Question } from '@3de/interfaces';

export default function ExamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const queryClient = useQueryClient();

  // Fetch quizzes data
  const { data: quizzesData, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizApi.getActive(), // Using getActive as a general fetch
  });

  // Fetch courses for filter
  const { data: coursesData } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getAll(),
  });

  const quizzes = quizzesData?.data || [];
  const courses = coursesData?.data || [];

  // Delete quiz mutation
  const deleteQuizMutation = useMutation({
    mutationFn: (id: string) => quizApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الامتحان بنجاح');
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setShowDeleteModal(false);
      setSelectedQuiz(null);
    },
    onError: () => {
      toast.error('حدث خطأ أثناء حذف الامتحان');
    },
  });

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((quiz: any) => {
    const lesson = quiz.lesson;
    
    const matchesSearch = 
      quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = courseFilter === 'ALL' || quiz.courseId === courseFilter;
    
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && quiz.upComing === false && !quiz.isCompleted) ||
      (statusFilter === 'UPCOMING' && quiz.upComing === true) ||
      (statusFilter === 'COMPLETED' && quiz.isCompleted === true);
    
    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Statistics
  const totalQuizzes = quizzes.length;
  const upcomingQuizzes = quizzes.filter((q: any) => q.upComing).length;
  const activeQuizzes = quizzes.filter((q: any) => !q.upComing && !q.isCompleted).length;
  const completedQuizzes = quizzes.filter((q: any) => q.isCompleted).length;

  const getStatusIcon = (quiz: Quiz) => {
    if (quiz.isCompleted) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (quiz.upComing) return <Clock className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-blue-500" />;
  };

  const getStatusText = (quiz: Quiz) => {
    if (quiz.isCompleted) return 'مكتمل';
    if (quiz.upComing) return 'قادم';
    return 'نشط';
  };

  const getStatusColor = (quiz: Quiz) => {
    if (quiz.isCompleted) return 'bg-green-100 text-green-800';
    if (quiz.upComing) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const handleDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedQuiz) return;
    deleteQuizMutation.mutate(selectedQuiz.id);
  };

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
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
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
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">خطأ في تحميل الامتحانات</h3>
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
          <h1 className="text-3xl font-bold text-gray-900">الامتحانات</h1>
          <p className="text-gray-600 mt-1">
            إدارة ومراقبة الامتحانات والاختبارات ({filteredQuizzes.length} امتحان)
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline ml-1" />
              قائمة
            </button>
            
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline ml-1" />
              تقويم
            </button>
          </div>
          
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <Plus className="w-5 h-5 ml-2" />
            إنشاء امتحان جديد
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
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
          <p className="text-gray-600">إجمالي الامتحانات</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{upcomingQuizzes}</p>
          <p className="text-gray-600">امتحانات قادمة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <AlertCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{activeQuizzes}</p>
          <p className="text-gray-600">امتحانات نشطة</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{completedQuizzes}</p>
          <p className="text-gray-600">امتحانات مكتملة</p>
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
              placeholder="البحث في الامتحانات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Course Filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الكورسات</option>
            {courses.map((course: any) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="UPCOMING">قادم</option>
            <option value="ACTIVE">نشط</option>
            <option value="COMPLETED">مكتمل</option>
          </select>
        </div>
      </motion.div>

      {/* Content */}
      {viewMode === 'calendar' ? (
        // Calendar View
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="text-center py-12">
            <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">عرض التقويم</h3>
            <p className="text-gray-500">سيتم إضافة عرض التقويم قريباً</p>
          </div>
        </motion.div>
      ) : (
        // List View
        filteredQuizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center min-h-96"
          >
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد امتحانات</h3>
              <p className="text-gray-500">لم يتم العثور على امتحانات تطابق معايير البحث.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredQuizzes.map((quiz: any, index: any) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
              >
                {/* Quiz Header */}
                <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-white">
                      <h3 className="text-lg font-bold mb-1">{quiz.title}</h3>
                      <p className="text-blue-100 opacity-90 text-sm">
                        {quiz.lesson?.title || 'درس غير محدد'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(quiz)}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz)}`}>
                      {getStatusText(quiz)}
                    </span>
                  </div>
                </div>

                {/* Quiz Content */}
                <div className="p-6">
                  {/* Description */}
                  {quiz.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {quiz.description}
                      </p>
                    </div>
                  )}

                  {/* Quiz Details */}
                  <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{quiz.questions?.length || 0}</p>
                      <p className="text-xs text-gray-500">أسئلة</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Timer className="w-4 h-4 text-orange-500" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{quiz.timeLimit || 'بلا حد'}</p>
                      <p className="text-xs text-gray-500">دقيقة</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{quiz.passingScore || 'غير محدد'}%</p>
                      <p className="text-xs text-gray-500">درجة النجاح</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-purple-500" />
                      </div>
                      <p className="text-lg font-bold text-gray-900">{quiz.submissions?.length || 0}</p>
                      <p className="text-xs text-gray-500">محاولة</p>
                    </div>
                  </div>

                  {/* Statistics */}
                  {quiz.averageScore !== undefined && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">المتوسط العام</span>
                        <span className="text-lg font-bold text-blue-900">{quiz.averageScore.toFixed(1)}%</span>
                      </div>
                      
                      {quiz.failCount !== undefined && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-blue-700">عدد الإخفاقات</span>
                          <span className="text-sm font-medium text-blue-700">{quiz.failCount}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="mb-4 space-y-2 text-xs text-gray-500">
                    {quiz.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        بداية: {new Date(quiz.startDate).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                    
                    {quiz.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        نهاية: {new Date(quiz.endDate).toLocaleDateString('ar-SA')}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                    
                    <Button
                      onClick={() => {/* Edit quiz */}}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleDelete(quiz)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      )}

      {/* Quiz Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="تفاصيل الامتحان"
      >
        {selectedQuiz && (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedQuiz.title}
              </h3>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                {getStatusIcon(selectedQuiz)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedQuiz)}`}>
                  {getStatusText(selectedQuiz)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدرس</label>
                <p className="text-sm text-gray-900">{selectedQuiz.lesson?.title || 'غير محدد'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأسئلة</label>
                <p className="text-sm text-gray-900">{selectedQuiz.questions?.length || 0}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوقت المحدد</label>
                <p className="text-sm text-gray-900">{selectedQuiz.timeLimit ? `${selectedQuiz.timeLimit} دقيقة` : 'بلا حدود'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">درجة النجاح</label>
                <p className="text-sm text-gray-900">{selectedQuiz.passingScore ? `${selectedQuiz.passingScore}%` : 'غير محدد'}</p>
              </div>
            </div>
            
            {selectedQuiz.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedQuiz.description}
                </p>
              </div>
            )}
            
            {selectedQuiz.averageScore !== undefined && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">إحصائيات الأداء</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">المتوسط العام:</span>
                    <span className="font-bold text-blue-900 mr-2">{selectedQuiz.averageScore.toFixed(1)}%</span>
                  </div>
                  {selectedQuiz.failCount !== undefined && (
                    <div>
                      <span className="text-blue-700">عدد الإخفاقات:</span>
                      <span className="font-bold text-blue-900 mr-2">{selectedQuiz.failCount}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {(selectedQuiz.startDate || selectedQuiz.endDate) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">المواعيد</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {selectedQuiz.startDate && (
                    <p>البداية: {new Date(selectedQuiz.startDate).toLocaleString('ar-SA')}</p>
                  )}
                  {selectedQuiz.endDate && (
                    <p>النهاية: {new Date(selectedQuiz.endDate).toLocaleString('ar-SA')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="تأكيد الحذف"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">حذف الامتحان</p>
              <p className="text-sm text-gray-500">{selectedQuiz?.title}</p>
            </div>
          </div>
          
          <p className="text-gray-600">
            هل أنت متأكد من رغبتك في حذف هذا الامتحان؟ سيتم حذف جميع الأسئلة والمحاولات المرتبطة به. 
            هذا الإجراء لا يمكن التراجع عنه.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            
            <Button
              onClick={confirmDelete}
              disabled={deleteQuizMutation.isPending}
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