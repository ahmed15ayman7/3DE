'use client';

import React from 'react';
import { Card, Badge, Button, Avatar, Dropdown } from '@3de/ui';
import { Quiz, Submission } from '@3de/interfaces';
import { motion } from 'framer-motion';

interface QuizCardProps {
  quiz: Quiz & {
    submissions?: Submission[];
    _count?: {
      submissions: number;
      questions: number;
    };
  };
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  onView?: (quiz: Quiz) => void;
  onViewResults?: (quiz: Quiz) => void;
  className?: string;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onEdit,
  onDelete,
  onView,
  onViewResults,
  className = ''
}) => {
  const submissionsCount = quiz._count?.submissions || quiz.submissions?.length || 0;
  const questionsCount = quiz._count?.questions || quiz.questions?.length || 0;
  const averageScore = quiz.submissions?.length 
    ? quiz.submissions.reduce((acc, sub) => acc + (sub.score || 0), 0) / quiz.submissions.length
    : 0;

  const passedCount = quiz.submissions?.filter(sub => (sub.score || 0) >= (quiz.passingScore || 60)).length || 0;
  const passRate = submissionsCount > 0 ? (passedCount / submissionsCount) * 100 : 0;

  const getStatusBadge = () => {
    const now = new Date();
    const createdAt = new Date(quiz.createdAt);
    const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 7) {
      return <Badge variant="success" size="sm">جديد</Badge>;
    }
    
    if (quiz.upComing) {
      return <Badge variant="warning" size="sm">قادم</Badge>;
    }

    return <Badge variant="secondary" size="sm">نشط</Badge>;
  };

  const dropdownItems = [
    {
      id: 'view',
      label: 'عرض التفاصيل',
      icon: <span>👁️</span>,
      onClick: () => onView?.(quiz)
    },
    {
      id: 'edit',
      label: 'تعديل',
      icon: <span>✏️</span>,
      onClick: () => onEdit?.(quiz)
    },
    {
      id: 'results',
      label: 'النتائج',
      icon: <span>📊</span>,
      onClick: () => onViewResults?.(quiz)
    },
    {
      id: 'divider',
      label: '',
      divider: true,
      onClick: () => {}
    },
    {
      id: 'delete',
      label: 'حذف',
      icon: <span>🗑️</span>,
      onClick: () => onDelete?.(quiz)
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        hover
        className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${className}`}
        onClick={() => onView?.(quiz)}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge()}
                <Badge variant="outline" size="sm">
                  {questionsCount} سؤال
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                {quiz.title}
              </h3>
              
              {quiz.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {quiz.description}
                </p>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <Dropdown
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<span>⋮</span>}
                  >
                    <span></span>
                  </Button>
                }
                items={dropdownItems}
                position="bottom-right"
              />
            </div>
          </div>

          {/* Quiz Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">⏰</span>
              <span className="text-gray-700">{quiz.timeLimit} دقيقة</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500">🎯</span>
              <span className="text-gray-700">{quiz.passingScore}% للنجاح</span>
            </div>
          </div>

          {/* Statistics */}
          {submissionsCount > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">المشاركات</span>
                <span className="font-medium text-gray-900">{submissionsCount}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">متوسط الدرجات</span>
                <span className="font-medium text-gray-900">{averageScore.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">معدل النجاح</span>
                <span className={`font-medium ${
                  passRate >= 70 ? 'text-green-600' : 
                  passRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {passRate.toFixed(1)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>نجح {passedCount}</span>
                  <span>رسب {submissionsCount - passedCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${passRate}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {new Date(quiz.createdAt).toLocaleDateString('ar-SA')}
            </div>
            
            <div className="flex gap-2">
              {onViewResults && submissionsCount > 0 && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewResults(quiz)}
                    icon={<span>📊</span>}
                  >
                    النتائج
                  </Button>
                </div>
              )}
              
              {onEdit && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEdit(quiz)}
                    icon={<span>✏️</span>}
                  >
                    تعديل
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// مكون لعرض قائمة الاختبارات
interface QuizListProps {
  quizzes: Quiz[];
  loading?: boolean;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  onView?: (quiz: Quiz) => void;
  onViewResults?: (quiz: Quiz) => void;
  emptyMessage?: string;
  className?: string;
}

export const QuizList: React.FC<QuizListProps> = ({
  quizzes,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onViewResults,
  emptyMessage = 'لا توجد اختبارات',
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="h-64 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          ابدأ بإنشاء اختبارك الأول لتقييم طلابك
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {quizzes.map((quiz) => (
        <QuizCard
          key={quiz.id}
          quiz={quiz}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onViewResults={onViewResults}
        />
      ))}
    </div>
  );
}; 