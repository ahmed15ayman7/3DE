'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, 
  Users, 
  Play, 
  Star, 
  BookOpen,
  Award,
  Calendar,
  User
} from 'lucide-react';
import { Button } from '@3de/ui';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: {
    name: string;
    avatar?: string;
  };
  duration: string;
  lessons: number;
  students: number;
  rating?: number;
  price?: number;
  originalPrice?: number;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  category: string;
  isNew?: boolean;
  isFree?: boolean;
  progress?: number; // For enrolled students
  startDate?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

const levelColors = {
  'مبتدئ': 'bg-green-100 text-green-800',
  'متوسط': 'bg-yellow-100 text-yellow-800',
  'متقدم': 'bg-red-100 text-red-800',
};

export default function CourseCard({
  id,
  title,
  description,
  image,
  instructor,
  duration,
  lessons,
  students,
  rating = 0,
  price,
  originalPrice,
  level,
  category,
  isNew = false,
  isFree = false,
  progress,
  startDate,
  className = '',
  variant = 'default',
}: CourseCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`card group cursor-pointer min-h-[85vh] max-h-[85vh] ${
        isFeatured ? 'ring-2 ring-primary-main ring-offset-2 ' : ''
      } ${className}`}
    >
      <Link href={`/courses/${id}`}>
        {/* Image Container */}
        <div className={`relative overflow-hidden ${isCompact ? 'h-40' : 'h-48'}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Play className="text-white ml-0.5" size={20} />
            </motion.div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            {isNew && (
              <span className="px-2 py-1 bg-primary-main text-white text-xs font-medium rounded-full">
                جديد
              </span>
            )}
            {isFree && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                مجاني
              </span>
            )}
            {isFeatured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                مميز
              </span>
            )}
          </div>

          {/* Level Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColors[level]}`}>
              {level}
            </span>
          </div>

          {/* Progress Bar (for enrolled students) */}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div 
                className="h-full bg-primary-main transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="card-body flex flex-col justify-between">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary-main font-medium">{category}</span>
            {rating > 0 && (
              <div className="flex items-center gap-1 gap-reverse">
                <Star className="text-yellow-400 fill-current" size={14} />
                <span className="text-sm text-text-secondary">{rating}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-text-primary line-clamp-2 group-hover:text-primary-main transition-colors duration-200 ${
            isCompact ? 'text-base mb-2' : 'text-lg mb-3'
          }`}>
            {title}
          </h3>

          {/* Description */}
          {!isCompact && (
            <p className="text-text-secondary text-sm line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* Instructor */}
          <div className="flex items-center gap-2 gap-reverse mb-4">
            {instructor.avatar ? (
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={12} className="text-gray-500" />
              </div>
            )}
            <span className="text-sm text-text-secondary">{instructor.name}</span>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 gap-4 text-sm text-text-secondary ${
            isCompact ? 'mb-3' : 'mb-4'
          }`}>
            <div className="flex items-center gap-1 gap-reverse">
              <BookOpen size={14} />
              <span>{lessons} درس</span>
            </div>
            <div className="flex items-center gap-1 gap-reverse">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1 gap-reverse">
              <Users size={14} />
              <span>{students} طالب</span>
            </div>
            {startDate && (
              <div className="flex items-center gap-1 gap-reverse">
                <Calendar size={14} />
                <span>{startDate}</span>
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 gap-reverse">
              {isFree ? (
                <span className="text-lg font-bold text-green-600">مجاني</span>
              ) : price ? (
                <div className="flex items-center gap-2 gap-reverse">
                  <span className="text-lg font-bold text-primary-main">
                    {price} ر.س
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-text-secondary line-through">
                      {originalPrice} ر.س
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-text-secondary">السعر عند التواصل</span>
              )}
            </div>

            {progress !== undefined ? (
              <Button size="sm" variant="outline">
                متابعة ({progress}%)
              </Button>
            ) : (
              <Button 
                size={isCompact ? "sm" : "md"} 
                className="bg-gradient-primary hover:opacity-90"
              >
                {isFree ? 'ابدأ الآن' : 'اشتراك'}
              </Button>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 