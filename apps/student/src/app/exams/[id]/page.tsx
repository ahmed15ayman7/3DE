'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { quizApi, submissionApi } from '@3de/apis';
import Layout from '../../../components/layout/Layout';
import QuizQuestion from '../../../components/quiz/QuizQuestion';
import { Button, Progress, Alert, Card, Badge, Modal } from '@3de/ui';
import { Question, Quiz } from '@3de/interfaces';
import { useAuth } from '@3de/auth';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  EyeOff,
  RotateCcw,
  Play,
  Pause,
  StopCircle,
} from 'lucide-react';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { user } = useAuth();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

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
      setIsTimerRunning(false);
    },
    onError: (error) => {
      console.error('Failed to submit quiz:', error);
    },
  });

  // Timer effect
  useEffect(() => {
    if (isStarted && isTimerRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, isTimerRunning, timeLeft]);

  const handleStartQuiz = () => {
    setIsStarted(true);
    setIsTimerRunning(true);
    if (quiz?.data?.timeLimit) {
      setTimeLeft(quiz.data.timeLimit * 60); // Convert minutes to seconds
    }
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

  const handleAutoSubmit = () => {
    if (quiz) {
      submitQuizMutation.mutate({
        quizId: quiz.data.id,
        answers,
      });
    }
  };

  const handleSubmitQuiz = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    setShowConfirmSubmit(false);
    if (quiz) {
      submitQuizMutation.mutate({
        quizId: quiz.data.id,
        answers,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz?.data?.questions?.[currentQuestionIndex];
  const totalQuestions = quiz?.data?.questions?.length || 0;
  const progress = (currentQuestionIndex + 1) / totalQuestions * 100;
  const answeredQuestions = Object.keys(answers).length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

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
            الاختبار غير متاح
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
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {quiz.data.title}
              </h1>
              <p className="text-gray-600 text-lg">
                {quiz.data.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-main mb-2">
                  {totalQuestions}
                </div>
                <div className="text-sm text-gray-600">عدد الأسئلة</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-main mb-2">
                  {quiz.data.timeLimit ? `${quiz.data.timeLimit} دقيقة` : 'غير محدد'}
                </div>
                <div className="text-sm text-gray-600">الوقت المحدد</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary-main mb-2">
                  {quiz.data.passingScore || 60}%
                </div>
                <div className="text-sm text-gray-600">الدرجة المطلوبة</div>
              </Card>
            </div>

            {quiz.data.lesson && (
              <Card className="p-4 mb-6">
                <div className="text-sm text-gray-600">
                  <strong>الكورس:</strong> {quiz.data.lesson.course?.title}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>الدرس:</strong> {quiz.data.lesson.title}
                </div>
              </Card>
            )}

            <div className="text-center">
              <Button onClick={handleStartQuiz} size="lg" className="px-8">
                <Play className="w-5 h-5 ml-2" />
                بدء الاختبار
              </Button>
            </div>
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
              <CheckCircle className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              تم إرسال الاختبار بنجاح
            </h1>
            <p className="text-gray-600 mb-6">
              سيتم مراجعة إجاباتك وإعلامك بالنتيجة قريباً
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/exams')} fullWidth>
                العودة للاختبارات
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/exams/results`)} 
                fullWidth
              >
                عرض جميع النتائج
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {quiz.data.title}
              </h1>
              <p className="text-sm text-gray-500">
                السؤال {currentQuestionIndex + 1} من {totalQuestions}
              </p>
            </div>
            
            <div className="flex items-center gap-4 gap-reverse">
              {quiz.data.timeLimit && (
                <div className="flex items-center gap-2 gap-reverse">
                  <Clock className="w-5 h-5 text-red-500" />
                  <div className="text-right">
                    <div className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-xs text-gray-500">الوقت المتبقي</div>
                  </div>
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReview(!showReview)}
              >
                {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showReview ? 'إخفاء المراجعة' : 'مراجعة الإجابات'}
              </Button>
            </div>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 gap-reverse">
              <span className="flex items-center gap-1 gap-reverse">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {answeredQuestions} مجاب
              </span>
              <span className="flex items-center gap-1 gap-reverse">
                <XCircle className="w-4 h-4 text-red-500" />
                {unansweredQuestions} غير مجاب
              </span>
            </div>
            <div className="text-gray-500">
              {Math.round(progress)}% مكتمل
            </div>
          </div>
        </motion.div>

        {/* Review Panel */}
        {showReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              مراجعة الإجابات
            </h3>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {quiz.data.questions?.map((question: Question, index: number) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary-main text-white'
                      : answers[question.id]
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-red-100 text-red-700 border-2 border-red-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Question */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 gap-reverse">
                <Badge variant="outline" size="sm">
                  السؤال {currentQuestionIndex + 1}
                </Badge>
                <Badge variant="outline" size="sm">
                  {currentQuestion.points} نقطة
                </Badge>
              </div>
              {answers[currentQuestion.id] && (
                <Badge variant="success" size="sm">
                  تم الإجابة
                </Badge>
              )}
            </div>
            
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
          <div className="flex items-center gap-3 gap-reverse">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              السؤال السابق
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowReview(!showReview)}
            >
              <Eye className="w-4 h-4 ml-2" />
              مراجعة
            </Button>
          </div>

          <div className="flex items-center gap-3 gap-reverse">
            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={submitQuizMutation.isPending}
                loading={submitQuizMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                <StopCircle className="w-4 h-4 ml-2" />
                إنهاء الاختبار
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                السؤال التالي
                <ArrowLeft className="w-4 h-4 mr-2" />
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
                className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary-main text-white'
                    : answers[question.id]
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Confirm Submit Modal */}
      <Modal
        isOpen={showConfirmSubmit}
        onClose={() => setShowConfirmSubmit(false)}
        title="تأكيد إرسال الاختبار"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              هل أنت متأكد من إرسال الاختبار؟
            </h3>
            <p className="text-gray-600">
              لا يمكنك التراجع عن هذا الإجراء بعد الإرسال
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>الأسئلة المجاب عليها:</span>
              <span className="font-medium">{answeredQuestions} من {totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>الأسئلة غير المجاب عليها:</span>
              <span className="font-medium text-red-600">{unansweredQuestions}</span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
              fullWidth
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmSubmit}
              loading={submitQuizMutation.isPending}
              fullWidth
              className="bg-red-600 hover:bg-red-700"
            >
              تأكيد الإرسال
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
} 