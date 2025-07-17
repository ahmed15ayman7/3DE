import React from 'react';
import { Course } from '@3de/interfaces';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Avatar } from './Avatar';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onBookmark?: (courseId: string) => void;
  isBookmarked?: boolean;
  showProgress?: boolean;
  progress?: number;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onBookmark,
  isBookmarked = false,
  showProgress = false,
  progress = 0,
  className = ''
}) => {
  const handleEnroll = () => {
    onEnroll?.(course.id);
  };

  const handleBookmark = () => {
    onBookmark?.(course.id);
  };

  const getInstructorName = () => {
    if (!course.instructors || course.instructors.length === 0) return 'غير محدد';
    const instructor = course.instructors[0];
    return `${instructor.user?.firstName || ''} ${instructor.user?.lastName || ''}`.trim() || 'غير محدد';
  };

  const getInstructorAvatar = () => {
    if (!course.instructors || course.instructors.length === 0) return '/placeholder-avatar.jpg';
    const instructor = course.instructors[0];
    return instructor.user?.avatar || '/placeholder-avatar.jpg';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-custom border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${className}`}
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
        
        {/* Bookmark Button */}
        {onBookmark && (
          <button
            onClick={handleBookmark}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          >
            <span className="text-white text-sm">
              {isBookmarked ? '★' : '☆'}
            </span>
          </button>
        )}

        {/* Course Level Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge variant="success" size="sm">
            {course.level}
          </Badge>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Instructor Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={getInstructorAvatar()}
            alt={getInstructorName()}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {getInstructorName()}
            </p>
            <p className="text-xs text-gray-500">المحاضر</p>
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <span>📚</span>
            <span>{course.lessons?.length || 0} درس</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏰</span>
            <span>4 ساعات</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{course.enrollments?.length || 0} طالب</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm font-medium text-gray-900">4.8</span>
          <span className="text-sm text-gray-500">(120 تقييم)</span>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">التقدم</span>
              <span className="text-sm font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-main h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {onEnroll && (
          <Button
            variant="primary"
            size="md"
            onClick={handleEnroll}
            fullWidth
          >
            {showProgress ? 'استكمال الكورس' : 'اشترك الآن'}
          </Button>
        )}
      </div>
    </div>
  );
}; 