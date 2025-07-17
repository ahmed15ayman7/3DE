'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '@3de/ui';
import { Clock, BookOpen, User, Calendar, Play } from 'lucide-react';
import { Quiz, Lesson, Course } from '@3de/interfaces';

interface ExamCardProps {
  quiz: Quiz & { lesson: Lesson & { course: Course } };
  onStartExam?: (quizId: string) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ quiz, onStartExam }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'upcoming':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'تم إنهاؤه';
      case 'upcoming':
        return 'غير متاح';
      default:
        return 'غير محدد';
    }
  };

  const getStatus = () => {
    if (quiz.isCompleted) return 'completed';
    if (quiz.upComing) return 'upcoming';
    return 'active';
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {quiz.title}
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              {quiz.description || 'لا يوجد وصف للاختبار'}
            </p>
          </div>
          <Badge variant={getStatusColor(status)}>
            {getStatusText(status)}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>الدرس: {quiz.lesson.title}</span>
          </div>

          <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>الكورس: {quiz.lesson.course.title}</span>
          </div>

          <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>المدة: {quiz.timeLimit || 60} دقيقة</span>
          </div>

          <div className="flex items-center gap-2 gap-reverse text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>تاريخ الإنشاء: {new Date(quiz.createdAt).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>

        {status === 'active' && onStartExam && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => onStartExam(quiz.id)}
              variant="primary"
              fullWidth
              icon={<Play className="w-4 h-4" />}
            >
              ابدأ الآن
            </Button>
          </div>
        )}

        {status === 'completed' && (
          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                تم الإنجاز
              </div>
              <div className="text-sm text-gray-500">
                تم إكمال هذا الاختبار بنجاح
              </div>
            </div>
          </div>
        )}

        {status === 'upcoming' && (
          <div className="pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-500">
                سيتم إتاحة هذا الاختبار قريباً
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}; 