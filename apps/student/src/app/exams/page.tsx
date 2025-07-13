'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { quizApi, submissionApi } from '@3de/apis';
import Layout from '../../components/layout/Layout';
import { CalendarExams } from '../../components/exams/CalendarExams';
import { ExamCard } from '../../components/exams/ExamCard';
import { TabsController } from '../../components/common/TabsController';
import { Card, Skeleton, Alert, Button } from '@3de/ui';
import { Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Quiz, Lesson, Course, Submission } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import { sanitizeApiResponse } from '../../lib/utils';

const tabs = [
  { id: 'calendar', label: 'تقويم الاختبارات', icon: <Calendar className="w-4 h-4" /> },
  { id: 'lessons', label: 'اختبارات الدروس', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'completed', label: 'الاختبارات المنتهية', icon: <CheckCircle className="w-4 h-4" /> }
];

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState('calendar');
  const { user } = useAuth();

  // جلب الاختبارات
  const { data: quizzesData, isLoading: quizzesLoading, error: quizzesError } = useQuery({
    queryKey: ['quizzes', 'student', user?.id],
    queryFn: () => quizApi.getByStudent(user?.id || ''),
    enabled: !!user?.id
  });

  // جلب النتائج
  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissions', 'student', user?.id],
    queryFn: () => submissionApi.getByUser(user?.id || ''),
    enabled: !!user?.id
  });

  const quizzes = sanitizeApiResponse(quizzesData?.data || []) as (Quiz & { lesson: Lesson & { course: Course } })[];
  const submissions = sanitizeApiResponse(submissionsData?.data || []) as Submission[];

  // تصنيف الاختبارات
  const activeQuizzes = quizzes.filter((quiz) => !quiz.isCompleted && !quiz.upComing);
  const upcomingQuizzes = quizzes.filter((quiz) => quiz.upComing);
  const completedQuizzes = quizzes.filter((quiz) => quiz.isCompleted);

  const handleStartExam = (quizId: string) => {
    // التنقل إلى صفحة الاختبار
    window.location.href = `/exams/${quizId}`;
  };

  const getSubmissionForQuiz = (quizId: string) => {
    return submissions.find((sub) => sub.quizId === quizId);
  };

  if (quizzesError) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="error" title="خطأ في تحميل البيانات">
            حدث خطأ أثناء تحميل الاختبارات. يرجى المحاولة مرة أخرى.
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* رأس الصفحة */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الاختبارات</h1>
          <p className="text-gray-600">
            تتبع اختباراتك وابدأ الاختبارات المتاحة
          </p>
        </motion.div>

        {/* التبويبات */}
        <div className="mb-8">
          <TabsController
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* محتوى التبويبات */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'calendar' && (
              <div>
                {quizzesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-64" />
                    ))}
                  </div>
                ) : (
                  <CalendarExams quizzes={quizzes} />
                )}
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="space-y-6">
                {/* الاختبارات النشطة */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    الاختبارات النشطة
                  </h2>
                  {quizzesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-48" />
                      ))}
                    </div>
                  ) : activeQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeQuizzes.map((quiz) => (
                        <ExamCard
                          key={quiz.id}
                          quiz={quiz}
                          onStartExam={handleStartExam}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد اختبارات نشطة
                      </h3>
                      <p className="text-gray-500">
                        لا توجد اختبارات متاحة للبدء في الوقت الحالي
                      </p>
                    </Card>
                  )}
                </div>

                {/* الاختبارات القادمة */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    الاختبارات القادمة
                  </h2>
                  {quizzesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-48" />
                      ))}
                    </div>
                  ) : upcomingQuizzes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingQuizzes.map((quiz) => (
                        <ExamCard
                          key={quiz.id}
                          quiz={quiz}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد اختبارات قادمة
                      </h3>
                      <p className="text-gray-500">
                        لا توجد اختبارات مجدولة في الوقت الحالي
                      </p>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'completed' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  الاختبارات المنتهية
                </h2>
                {submissionsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : completedQuizzes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedQuizzes.map((quiz) => {
                      const submission = getSubmissionForQuiz(quiz.id);
                      return (
                        <Card key={quiz.id} className="p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {quiz.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {quiz.lesson.title} - {quiz.lesson.course.title}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {submission?.score || 0}%
                              </div>
                              <div className="text-sm text-gray-500">
                                النتيجة
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>تاريخ الإكمال:</span>
                              <span>
                                {submission?.createdAt 
                                  ? new Date(submission.createdAt).toLocaleDateString('ar-SA')
                                  : 'غير محدد'
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>الوقت المستغرق:</span>
                              <span>
                                غير محدد
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <Button
                              variant="outline"
                              fullWidth
                              onClick={() => window.location.href = `/exams/${quiz.id}/result`}
                            >
                              عرض التفاصيل
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      لا توجد اختبارات منتهية
                    </h3>
                    <p className="text-gray-500">
                      لم تكمل أي اختبارات بعد
                    </p>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
} 