'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Modal } from '@3de/ui';
import { Calendar, Clock, BookOpen, User } from 'lucide-react';
import { Quiz, Lesson, Course } from '@3de/interfaces';

interface CalendarExamsProps {
  quizzes: (Quiz & { lesson: Lesson & { course: Course } })[];
}

interface ExamEvent {
  id: string;
  title: string;
  lesson: Lesson & { course: Course };
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'upcoming';
  duration: number;
}

export const CalendarExams: React.FC<CalendarExamsProps> = ({ quizzes }) => {
  const [selectedExam, setSelectedExam] = useState<ExamEvent | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // تحويل الاختبارات إلى أحداث تقويم
  const examEvents: ExamEvent[] = quizzes.map(quiz => ({
    id: quiz.id,
    title: quiz.title,
    lesson: quiz.lesson,
    startDate: new Date(quiz.createdAt),
    endDate: new Date(quiz.createdAt.getTime() + (quiz.timeLimit || 60) * 60000),
    status: quiz.isCompleted ? 'completed' : quiz.upComing ? 'upcoming' : 'active',
    duration: quiz.timeLimit || 60
  }));

  // الحصول على أيام الشهر الحالي
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // إضافة أيام فارغة في البداية
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // إضافة أيام الشهر
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  // الحصول على الاختبارات في يوم معين
  const getExamsForDay = (date: Date) => {
    return examEvents.filter(exam => {
      const examDate = new Date(exam.startDate);
      return examDate.getDate() === date.getDate() &&
             examDate.getMonth() === date.getMonth() &&
             examDate.getFullYear() === date.getFullYear();
    });
  };

  const days = getDaysInMonth(currentDate);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'upcoming':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'منتهي';
      case 'upcoming':
        return 'قادم';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس التقويم */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">تقويم الاختبارات</h2>
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ‹
          </button>
          <span className="text-lg font-semibold">
            {currentDate.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ›
          </button>
        </div>
      </div>

      {/* أيام الأسبوع */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* التقويم */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const examsForDay = day ? getExamsForDay(day) : [];
          const isToday = day && day.toDateString() === new Date().toDateString();

          return (
            <motion.div
              key={index}
              className={`min-h-[120px] p-2 border rounded-lg ${
                isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              } ${!day ? 'bg-gray-50' : ''}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {examsForDay.slice(0, 2).map(exam => (
                      <motion.div
                        key={exam.id}
                        className={`p-1 rounded text-xs cursor-pointer ${
                          getStatusColor(exam.status)
                        } text-white`}
                        onClick={() => setSelectedExam(exam)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {exam.title}
                      </motion.div>
                    ))}
                    {examsForDay.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{examsForDay.length - 2} المزيد
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Modal تفاصيل الاختبار */}
      <Modal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title="تفاصيل الاختبار"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{selectedExam.title}</h3>
              <Badge
                variant={selectedExam.status === 'active' ? 'success' : selectedExam.status === 'completed' ? 'primary' : 'warning'}
              >
                {getStatusText(selectedExam.status)}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">الدرس: {selectedExam.lesson.title}</span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">الكورس: {selectedExam.lesson.course.title}</span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">المدة: {selectedExam.duration} دقيقة</span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  تاريخ البدء: {selectedExam.startDate.toLocaleDateString('ar-SA')}
                </span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  تاريخ النهاية: {selectedExam.endDate.toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>

            {selectedExam.status === 'active' && (
              <div className="pt-4 border-t">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  ابدأ الاختبار الآن
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}; 