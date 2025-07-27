'use client';

import { motion } from 'framer-motion';
import { User, BookOpen, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card, Progress } from '@3de/ui';

interface Child {
  id: string;
  name: string;
  image?: string;
  grade: string;
  age: number;
  attendance: number;
  averageScore: number;
  enrolledCourses: number;
  completedCourses: number;
  lastActivity: string;
}

interface ChildCardProps {
  child: Child;
  onClick?: () => void;
}

export default function ChildCard({ child, onClick }: ChildCardProps) {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if (score >= 80) return 'text-primary-main bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 80) return 'text-primary-main';
    if (attendance >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-main to-purple-600 rounded-full flex items-center justify-center">
            {child.image ? (
              <img 
                src={child.image} 
                alt={child.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {child.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              الصف {child.grade} • {child.age} سنة
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(child.averageScore)}`}>
            {child.averageScore}%
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">الحضور</span>
            </div>
            <div className={`text-lg font-semibold ${getAttendanceColor(child.attendance)}`}>
              {child.attendance}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">الكورسات</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {child.enrolledCourses}
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">التقدم العام</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {Math.round((child.completedCourses / child.enrolledCourses) * 100)}%
              </span>
            </div>
            <Progress 
              value={(child.completedCourses / child.enrolledCourses) * 100} 
              className="h-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">معدل الحضور</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {child.attendance}%
              </span>
            </div>
            <Progress 
              value={child.attendance} 
              className="h-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Award className="w-4 h-4" />
            <span>آخر نشاط: {child.lastActivity}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              متقدم
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 