'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  BookOpen, 
  Calendar, 
  Eye, 
  Edit,
  Star,
  TrendingUp 
} from 'lucide-react';
import Link from 'next/link';
import { Course, Enrollment, Instructor, User } from '@3de/interfaces';

interface CourseCardProps {
  course: Course & {
    instructors: (Instructor & { user: User })[];
    enrollments: (Enrollment & { user: User })[];
    lessons?: any[];
  };
  delay?: number;
}

export default function CourseCard({ course, delay = 0 }: CourseCardProps) {
  const enrollmentCount = course.enrollments?.length || 0;
  const lessonsCount = course.lessons?.length || 0;
  const progress = course.progress || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'نشط';
      case 'PENDING':
        return 'في الانتظار';
      case 'COMPLETED':
        return 'مكتمل';
      default:
        return 'غير محدد';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-r from-primary-main to-primary-dark">
        {course.image ? (
          <img 
            src={course.image} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-16 h-16 text-white opacity-60" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
            {getStatusText(course.status)}
          </span>
        </div>

        {/* Progress Badge */}
        {progress > 0 && (
          <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-800">
            {Math.round(progress)}% مكتمل
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Title and Level */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">{course.level}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {course.description}
          </p>
        </div>

                 {/* Instructors */}
        {course.instructors && course.instructors.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">المحاضرين:</p>
            <div className="flex flex-wrap gap-1">
              {course.instructors.slice(0, 2).map((instructor) => (
                <span
                  key={instructor.id}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {instructor.user?.firstName} {instructor.user?.lastName}
                </span>
              ))}
              {course.instructors.length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{course.instructors.length - 2} أخرى
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{enrollmentCount}</p>
            <p className="text-xs text-gray-500">طالب</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{lessonsCount}</p>
            <p className="text-xs text-gray-500">درس</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{course.duration || 0}</p>
            <p className="text-xs text-gray-500">ساعة</p>
          </div>
        </div>

        {/* Dates */}
        {course.startDate && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                تاريخ البدء: {new Date(course.startDate).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>
        )}

        {/* Price */}
        {course.price && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">السعر:</span>
              <span className="text-lg font-bold text-green-600">
                {course.price} ريال
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/courses/${course.id}`}
            className="flex-1 bg-gradient-to-r from-primary-main to-primary-dark text-white py-2 px-4 rounded-lg hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Link>
          
          <Link 
            href={`/courses/${course.id}/edit`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 