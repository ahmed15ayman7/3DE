'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { submissionApi } from '@3de/apis';
import Layout from '../../../../components/layout/Layout';
import { Card, Button, Badge, Progress, Alert } from '@3de/ui';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle,
  Eye,
  Download,
  Share,
  BookOpen,
  Target,
  Timer,
  TrendingUp,
  BarChart3,
  FileText,
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

export default function ExamResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const submissionId = params.id as string;
  const { user } = useAuth();
  const [showAnswers, setShowAnswers] = useState(false);

  const { data: submissionData, isLoading } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => submissionApi.getById(submissionId),
    enabled: !!submissionId,
  });

  const submission = submissionData?.data as SubmissionWithDetails;

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

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!submission) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="error" title="خطأ">
            النتيجة غير متاحة
          </Alert>
        </div>
      </Layout>
    );
  }

  const scoreBadge = getScoreBadge(submission.score || 0);
  const totalQuestions = submission.quiz.questions?.length || 0;
  const correctAnswers = submission.answers?.filter((answer: any) => answer.isCorrect).length || 0;
  const wrongAnswers = totalQuestions - correctAnswers;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 gap-reverse mb-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                نتيجة اختبار: {submission.quiz.title}
              </h1>
              <p className="text-gray-600">
                تفاصيل شاملة عن أدائك في هذا الاختبار
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 gap-reverse">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 ml-2" />
              تصدير النتيجة
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 ml-2" />
              مشاركة
            </Button>
          </div>
        </motion.div>

        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 text-center">
            <div className="text-6xl font-bold mb-4" style={{ color: getScoreColor(submission.score || 0) }}>
              {submission.score || 0}%
            </div>
            <Badge variant={scoreBadge.variant} size="lg" className="mb-2">
              {scoreBadge.text}
            </Badge>
            <p className="text-sm text-gray-600">الدرجة النهائية</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">الحالة</p>
                <Badge variant={submission.passed ? 'success' : 'danger'} size="lg">
                  {submission.passed ? 'نجح' : 'رسب'}
                </Badge>
              </div>
              <div className="p-3 bg-primary-main rounded-full">
                {submission.passed ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : (
                  <XCircle className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>الدرجة المطلوبة:</span>
                <span className="font-medium">{submission.quiz.passingScore || 60}%</span>
              </div>
              <div className="flex justify-between">
                <span>الفرق:</span>
                <span className={`font-medium ${submission.passed ? 'text-green-600' : 'text-red-600'}`}>
                  {((submission.score || 0) - (submission.quiz.passingScore || 60)).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">الوقت المستغرق</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submission.timeLimit ? `${submission.timeLimit} دقيقة` : 'غير محدد'}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <Timer className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              تاريخ الإكمال: {new Date(submission.createdAt).toLocaleDateString('ar-EG',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
            </div>
          </Card>
        </motion.div>

        {/* Quiz Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">معلومات الاختبار</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">عنوان الاختبار:</span>
                  <span className="font-medium">{submission.quiz.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الكورس:</span>
                  <span className="font-medium">{submission.quiz.lesson?.course?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الدرس:</span>
                  <span className="font-medium">{submission.quiz.lesson?.title}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد الأسئلة:</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الإجابات الصحيحة:</span>
                  <span className="font-medium text-green-600">{correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الإجابات الخاطئة:</span>
                  <span className="font-medium text-red-600">{wrongAnswers}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Performance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">تحليل الأداء</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>نسبة الإجابات الصحيحة</span>
                  <span>{totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%</span>
                </div>
                <Progress value={totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-green-600">إجابة صحيحة</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                  <div className="text-sm text-red-600">إجابة خاطئة</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Questions Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">مراجعة الأسئلة</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAnswers(!showAnswers)}
              >
                {showAnswers ? <Eye className="w-4 h-4 ml-2" /> : <FileText className="w-4 h-4 ml-2" />}
                {showAnswers ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              </Button>
            </div>

            {showAnswers ? (
              <div className="space-y-4">
                {submission.quiz.questions?.map((question: any, index: number) => {
                  const userAnswer = submission.answers?.find((answer: any) => answer.questionId === question.id);
                  const isCorrect = userAnswer?.isCorrect;
                  
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 gap-reverse">
                          <Badge variant="outline" size="sm">
                            السؤال {index + 1}
                          </Badge>
                          <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                            {isCorrect ? 'صحيح' : 'خاطئ'}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{question.points} نقطة</span>
                      </div>
                      
                      <p className="text-gray-900 mb-3">{question.text}</p>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2">
                          {question.options.map((option: any) => (
                            <div
                              key={option.id}
                              className={`p-2 rounded border ${
                                option.isCorrect
                                  ? 'border-green-300 bg-green-100'
                                  : userAnswer?.selectedOptionId === option.id && !option.isCorrect
                                  ? 'border-red-300 bg-red-100'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 gap-reverse">
                                <span className={option.isCorrect ? 'text-green-600' : 'text-gray-500'}>
                                  {option.isCorrect ? '✓' : '○'}
                                </span>
                                <span className={option.isCorrect ? 'text-green-700' : 'text-gray-700'}>
                                  {option.text}
                                </span>
                                {userAnswer?.selectedOptionId === option.id && !option.isCorrect && (
                                  <Badge variant="danger" size="sm">إجابتك</Badge>
                                )}
                                {option.isCorrect && (
                                  <Badge variant="success" size="sm">الإجابة الصحيحة</Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  اضغط على "عرض التفاصيل" لمراجعة إجاباتك
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 gap-reverse"
        >
          <Button onClick={() => router.push('/exams/results')} variant="outline">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للنتائج
          </Button>
          <Button onClick={() => router.push('/exams')}>
            <BookOpen className="w-4 h-4 ml-2" />
            الذهاب للاختبارات
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
} 