'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { quizApi, submissionApi } from '@3de/apis';
import Layout from '../../../components/layout/Layout';
import QuizQuestion from '../../../components/quiz/QuizQuestion';
import { Button, Progress, Alert } from '@3de/ui';
  import { Question } from '@3de/interfaces';
import { useAuth } from '@3de/auth';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch quiz data
  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizApi.getById(quizId),
  });

  const submitQuizMutation = useMutation({
    mutationFn: (data: { quizId: string; answers: Record<string, string | string[]> }) =>
      submissionApi.create({quizId:data.quizId,userId:user?.id || "", answers:data.answers}),
    onSuccess: (data) => {
      setIsSubmitted(true);
      // Handle success - show results or redirect
    },
    onError: (error) => {
      console.error('Failed to submit quiz:', error);
    },
  });

  const handleStartQuiz = () => {
    setIsStarted(true);
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.data?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (quiz) {
      submitQuizMutation.mutate({
        quizId: quiz.data.id,
        answers,
      });
    }
  };

  const currentQuestion = quiz?.data?.questions?.[currentQuestionIndex];
  const totalQuestions = quiz?.data?.questions?.length || 0;
  const progress = (currentQuestionIndex + 1) / totalQuestions * 100;
  const answeredQuestions = Object.keys(answers).length;

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Alert variant="error" title="خطأ">
            الاختبار غير متاح لهذا الكورس
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!isStarted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              اختبار {quiz.data.title}
            </h1>
            <p className="text-gray-600 mb-6">
              {quiz.data.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-main">
                  {totalQuestions}
                </div>
                <div className="text-sm text-gray-600">عدد الأسئلة</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-main">
                  {quiz.data.timeLimit || 'غير محدد'}
                </div>
                <div className="text-sm text-gray-600">الوقت المحدد</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-main">
                  {quiz.data.passingScore || 60}%
                </div>
                <div className="text-sm text-gray-600">الدرجة المطلوبة</div>
              </div>
            </div>

            <Button onClick={handleStartQuiz} size="lg">
              بدء الاختبار
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (isSubmitted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
          >
            <div className="text-green-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              تم إرسال الاختبار بنجاح
            </h1>
            <p className="text-gray-600 mb-6">
              سيتم مراجعة إجاباتك وإعلامك بالنتيجة قريباً
            </p>
            <Button onClick={() => router.push(`/exams`)}>
              العودة للاختبارات
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {quiz.data.title}
            </h1>
            <div className="text-sm text-gray-500">
              السؤال {currentQuestionIndex + 1} من {totalQuestions}
            </div>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>الأسئلة المجاب عليها: {answeredQuestions}</span>
            <span>الأسئلة المتبقية: {totalQuestions - answeredQuestions}</span>
          </div>
        </motion.div>

        {/* Question */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <QuizQuestion
              question={currentQuestion}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              currentAnswer={answers[currentQuestion.id]}
            />
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            السؤال السابق
          </Button>

          <div className="flex items-center gap-2">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={submitQuizMutation.isPending}
                loading={submitQuizMutation.isPending}
              >
                إنهاء الاختبار
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                السؤال التالي
              </Button>
            )}
          </div>
        </motion.div>

        {/* Question Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            التنقل بين الأسئلة
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {quiz.data.questions?.map((question: Question, index: number) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary-main text-white'
                    : answers[question.id]
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
} 