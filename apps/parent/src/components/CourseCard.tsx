'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, User, Star, Play, CheckCircle } from 'lucide-react';
import { Card, Progress } from '@3de/ui';

interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  instructor: string;
  duration: number;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  grade?: number;
  status: 'active' | 'completed' | 'pending';
  startDate: string;
  endDate: string;
}

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'active':
        return 'text-primary-main bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'active':
        return 'نشط';
      case 'pending':
        return 'في الانتظار';
      default:
        return 'غير محدد';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
            {course.image ? (
              <img 
                src={course.image} 
                alt={course.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <BookOpen className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {course.title}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {getStatusText(course.status)}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {course.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration} ساعة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">التقدم في الكورس</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {course.progress}%
            </span>
          </div>
          <Progress value={course.progress} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{course.completedLessons} درس مكتمل</span>
            <span>من {course.totalLessons} درس</span>
          </div>
        </div>

        {/* Grade Section */}
        {course.grade && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">الدرجة النهائية</span>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {course.grade}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            {course.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Play className="w-4 h-4 text-primary-main" />
            )}
            <span>
              {course.status === 'completed' ? 'تم الإكمال' : 'جاري التعلم'}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            {course.startDate} - {course.endDate}
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 