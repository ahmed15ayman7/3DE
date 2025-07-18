'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Play } from 'lucide-react';
import { Button, Badge, Progress } from '@3de/ui';
import { Course } from '@3de/interfaces';

interface CourseCardProps {
  userId: string;
  course: Course;
  isEnrolled?: boolean;
}

export default function CourseCard({ userId, course, isEnrolled = false }: CourseCardProps) {
  const progress = (course.lessons?.filter((lesson: any) => lesson.WatchedLesson?.some((watched: any) => watched.userId === userId)).length || 0) / (course.lessons?.length || 1) * 100 || 0;
  console.log(progress);
  // تحويل التاريخ إلى string إذا كان Date object
  const formatDate = (date: any) => {
    if (!date) return 'غير محدد';
    if (typeof date === 'string') {
      return new Date(date).toLocaleDateString('ar-SA');
    }
    if (date instanceof Date) {
      return date.toLocaleDateString('ar-SA');
    }
    return 'غير محدد';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-main to-secondary-main">
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        )}
        {/* <div className="absolute inset-0 bg-black bg-opacity-20" /> */}
        <div className="absolute top-4 right-4">
          <Badge variant={isEnrolled ? 'primary' : 'outline'}>
            {isEnrolled ? 'مشترك' : 'متاح'}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(course.startDate)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrollments?.length || 0} طالب</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.lessons?.length || 0} درس</span>
          </div>
        </div>

        {/* Progress Bar */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">التقدم</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full" variant={isEnrolled ? 'primary' : 'outline'}>
            <Play className="w-4 h-4 ml-2" />
            {isEnrolled ? 'استكمال الكورس' : 'الالتحاق بالكورس'}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
} 