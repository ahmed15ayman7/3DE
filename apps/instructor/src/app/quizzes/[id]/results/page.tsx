'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Progress, Tabs, Input, Select } from '@3de/ui';
import { useQuizResults } from '../../../../hooks/useInstructorQueries';
import ChartBox from '../../../../components/ChartBox';

// Mock data للاختبار ونتائجه
const mockQuizResults = {
  quiz: {
    id: '1',
    title: 'اختبار البرمجة الكائنية',
    description: 'اختبار شامل حول مفاهيم البرمجة الكائنية',
    questions: 15,
    totalPoints: 150,
    duration: 60,
    dueDate: '2024-01-25',
    startDate: '2024-01-20',
    courseTitle: 'البرمجة المتقدمة',
    status: 'منتهي'
  },
  statistics: {
    totalSubmissions: 42,
    completedSubmissions: 38,
    pendingSubmissions: 4,
    averageScore: 78.5,
    highestScore: 95,
    lowestScore: 45,
    passRate: 85.7,
    averageTime: 48
  },
  results: [
    {
      id: '1',
      studentId: '1',
      studentName: 'أحمد محمد',
      studentEmail: 'ahmed@example.com',
      score: 95,
      percentage: 95,
      grade: 'A+',
      timeSpent: 52,
      submissionTime: '2024-01-22 14:30',
      status: 'مكتمل',
      answers: [
        { questionId: '1', answer: 'A', correct: true, points: 10 },
        { questionId: '2', answer: 'B', correct: true, points: 10 },
        { questionId: '3', answer: 'C', correct: false, points: 0 }
      ]
    },
    {
      id: '2',
      studentId: '2',
      studentName: 'فاطمة علي',
      studentEmail: 'fatima@example.com',
      score: 88,
      percentage: 88,
      grade: 'A',
      timeSpent: 45,
      submissionTime: '2024-01-22 16:15',
      status: 'مكتمل',
      answers: [
        { questionId: '1', answer: 'A', correct: true, points: 10 },
        { questionId: '2', answer: 'C', correct: false, points: 0 },
        { questionId: '3', answer: 'C', correct: true, points: 10 }
      ]
    },
    {
      id: '3',
      studentId: '3',
      studentName: 'محمد سعد',
      studentEmail: 'mohammed@example.com',
      score: 72,
      percentage: 72,
      grade: 'B+',
      timeSpent: 58,
      submissionTime: '2024-01-23 10:20',
      status: 'مكتمل',
      answers: [
        { questionId: '1', answer: 'B', correct: false, points: 0 },
        { questionId: '2', answer: 'B', correct: true, points: 10 },
        { questionId: '3', answer: 'C', correct: true, points: 10 }
      ]
    },
    {
      id: '4',
      studentId: '4',
      studentName: 'سارة خالد',
      studentEmail: 'sara@example.com',
      score: 0,
      percentage: 0,
      grade: 'لم يكمل',
      timeSpent: 0,
      submissionTime: null,
      status: 'لم يبدأ',
      answers: []
    }
  ],
  questions: [
    {
      id: '1',
      text: 'ما هو مفهوم الوراثة في البرمجة الكائنية؟',
      type: 'multiple_choice',
      options: ['انتقال خصائص من كلاس لآخر', 'إخفاء البيانات', 'تجميع الكائنات', 'لا شيء مما سبق'],
      correctAnswer: 'A',
      points: 10,
      difficulty: 'متوسط',
      correctAnswers: 35,
      wrongAnswers: 7
    },
    {
      id: '2',
      text: 'أي من التالي يُستخدم لإخفاء البيانات؟',
      type: 'multiple_choice',
      options: ['Public', 'Private', 'Static', 'Final'],
      correctAnswer: 'B',
      points: 10,
      difficulty: 'سهل',
      correctAnswers: 40,
      wrongAnswers: 2
    },
    {
      id: '3',
      text: 'ما هو Polymorphism؟',
      type: 'multiple_choice',
      options: ['الوراثة', 'التغليف', 'تعدد الأشكال', 'التجريد'],
      correctAnswer: 'C',
      points: 10,
      difficulty: 'صعب',
      correctAnswers: 28,
      wrongAnswers: 14
    }
  ]
};

const QuizResultsPage = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // فلترة وترتيب النتائج
  const filteredResults = mockQuizResults.results
    .filter(result => {
      const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || result.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'score') {
        comparison = a.score - b.score;
      } else if (sortBy === 'name') {
        comparison = a.studentName.localeCompare(b.studentName);
      } else if (sortBy === 'time') {
        comparison = a.timeSpent - b.timeSpent;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  // بيانات الرسوم البيانية
  const scoreDistribution = [
    { name: '90-100', value: mockQuizResults.results.filter(r => r.percentage >= 90).length },
    { name: '80-89', value: mockQuizResults.results.filter(r => r.percentage >= 80 && r.percentage < 90).length },
    { name: '70-79', value: mockQuizResults.results.filter(r => r.percentage >= 70 && r.percentage < 80).length },
    { name: '60-69', value: mockQuizResults.results.filter(r => r.percentage >= 60 && r.percentage < 70).length },
    { name: 'أقل من 60', value: mockQuizResults.results.filter(r => r.percentage < 60 && r.percentage > 0).length },
  ];

  const questionDifficulty = mockQuizResults.questions.map(q => ({
    name: q.text.substring(0, 30) + '...',
    value: Math.round((q.correctAnswers / (q.correctAnswers + q.wrongAnswers)) * 100),
    label: q.text
  }));

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'success';
    if (grade === 'A-' || grade === 'B+') return 'warning';
    if (grade === 'B' || grade === 'B-') return 'info';
    if (grade === 'لم يكمل') return 'danger';
    return 'secondary';
  };

  const getStatusColor = (status: string) => {
    if (status === 'مكتمل') return 'success';
    if (status === 'قيد التقدم') return 'warning';
    if (status === 'لم يبدأ') return 'danger';
    return 'secondary';
  };

  const overviewTab = (
    <div className="space-y-6">
      {/* إحصائيات عامة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-blue-600">{mockQuizResults.statistics.totalSubmissions}</div>
          <div className="text-sm text-gray-600">إجمالي المحاولات</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-green-600">{mockQuizResults.statistics.averageScore}%</div>
          <div className="text-sm text-gray-600">متوسط الدرجات</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-purple-600">{mockQuizResults.statistics.passRate}%</div>
          <div className="text-sm text-gray-600">نسبة النجاح</div>
        </Card>
        <Card padding="lg" className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{mockQuizResults.statistics.averageTime} د</div>
          <div className="text-sm text-gray-600">متوسط الوقت</div>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartBox
          title="توزيع الدرجات"
          type="pie"
          data={scoreDistribution as any}
          className="h-80"
        />
        <ChartBox
          title="صعوبة الأسئلة (نسبة الإجابات الصحيحة)"
          type="bar"
          data={questionDifficulty}
          className="h-80"
        />
      </div>

      {/* تفاصيل الاختبار */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">تفاصيل الاختبار</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">العنوان:</span>
              <span className="font-medium">{mockQuizResults.quiz.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الكورس:</span>
              <span className="font-medium">{mockQuizResults.quiz.courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">عدد الأسئلة:</span>
              <span className="font-medium">{mockQuizResults.quiz.questions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">إجمالي النقاط:</span>
              <span className="font-medium">{mockQuizResults.quiz.totalPoints}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">مدة الاختبار:</span>
              <span className="font-medium">{mockQuizResults.quiz.duration} دقيقة</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ البداية:</span>
              <span className="font-medium">{mockQuizResults.quiz.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ الانتهاء:</span>
              <span className="font-medium">{mockQuizResults.quiz.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الحالة:</span>
              <Badge variant="success">{mockQuizResults.quiz.status}</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const studentsTab = (
    <div className="space-y-6">
      {/* فلاتر البحث */}
      <Card padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="البحث عن طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
          <Select
            label="الحالة"
            options={[
              { value: 'all', label: 'جميع الحالات' },
              { value: 'مكتمل', label: 'مكتمل' },
              { value: 'قيد التقدم', label: 'قيد التقدم' },
              { value: 'لم يبدأ', label: 'لم يبدأ' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            label="ترتيب حسب"
            options={[
              { value: 'score', label: 'الدرجة' },
              { value: 'name', label: 'الاسم' },
              { value: 'time', label: 'الوقت' }
            ]}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
          <Select
            label="الترتيب"
            options={[
              { value: 'desc', label: 'تنازلي' },
              { value: 'asc', label: 'تصاعدي' }
            ]}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          />
        </div>
      </Card>

      {/* قائمة الطلاب */}
      <div className="space-y-4">
        {filteredResults.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card padding="lg" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {result.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{result.studentName}</h4>
                    <p className="text-sm text-gray-600">{result.studentEmail}</p>
                    {result.submissionTime && (
                      <p className="text-xs text-gray-500">تم التسليم في: {result.submissionTime}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.score}</div>
                    <div className="text-sm text-gray-500">النقاط</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{result.percentage}%</div>
                    <div className="text-sm text-gray-500">النسبة</div>
                    <Progress value={result.percentage} size="sm" className="w-20 mt-1" />
                  </div>

                  <div className="text-center">
                    <Badge variant={getGradeColor(result.grade)}>
                      {result.grade}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {result.timeSpent > 0 ? `${result.timeSpent} د` : '-'}
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge variant={getStatusColor(result.status)} size="sm">
                      {result.status}
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    {result.status === 'مكتمل' && (
                      <Button size="sm" variant="outline">
                        عرض الإجابات
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      إرسال ملاحظة
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <Card padding="lg" className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
          <p className="text-gray-600">لا توجد نتائج تطابق معايير البحث المحددة</p>
        </Card>
      )}
    </div>
  );

  const questionsTab = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {mockQuizResults.questions.map((question, index) => (
          <Card key={question.id} padding="lg">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    السؤال {index + 1}: {question.text}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>النقاط: {question.points}</span>
                    <span>الصعوبة: {question.difficulty}</span>
                    <span>النوع: {question.type === 'multiple_choice' ? 'اختيار متعدد' : question.type}</span>
                  </div>
                </div>
                <Badge 
                  variant={question.difficulty === 'سهل' ? 'success' : 
                          question.difficulty === 'متوسط' ? 'warning' : 'danger'}
                  size="sm"
                >
                  {question.difficulty}
                </Badge>
              </div>

              {question.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">الخيارات:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`p-2 rounded border text-sm ${
                          String.fromCharCode(65 + optionIndex) === question.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {String.fromCharCode(65 + optionIndex) === question.correctAnswer && (
                          <span className="mr-2 text-green-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{question.correctAnswers}</div>
                  <div className="text-sm text-gray-600">إجابات صحيحة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{question.wrongAnswers}</div>
                  <div className="text-sm text-gray-600">إجابات خاطئة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((question.correctAnswers / (question.correctAnswers + question.wrongAnswers)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">نسبة النجاح</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const tabItems = [
    { id: 'overview', label: 'نظرة عامة', content: overviewTab, icon: '📊' },
    { id: 'students', label: 'نتائج الطلاب', content: studentsTab, icon: '👥' },
    { id: 'questions', label: 'تحليل الأسئلة', content: questionsTab, icon: '📝' }
  ];

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            ← العودة
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">نتائج الاختبار</h1>
            <p className="text-gray-600">{mockQuizResults.quiz.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            تصدير النتائج
          </Button>
          <Button variant="outline">
            إرسال التغذية الراجعة
          </Button>
          <Button variant="primary">
            نشر الدرجات
          </Button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <Card padding="none">
        <Tabs
          items={tabItems}
          defaultActiveTab="overview"
          onTabChange={setActiveTab}
          className="p-6"
        />
      </Card>
    </div>
  );
};

export default QuizResultsPage; 