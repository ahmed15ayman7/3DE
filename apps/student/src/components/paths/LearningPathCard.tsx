'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge, Progress } from '@3de/ui';
import { PathAvatars } from './PathAvatars';
import { BookOpen, Clock, Users, Target, ArrowRight } from 'lucide-react';
import { Path, Course, User } from '@3de/interfaces';

interface LearningPathCardProps {
  path: Path & { courses: Course[]; peers: User[] };
  onClick?: (pathId: string) => void;
  className?: string;
}

export const LearningPathCard: React.FC<LearningPathCardProps> = ({
  path,
  onClick,
  className = ''
}) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'مبتدئ';
      case 'intermediate':
        return 'متوسط';
      case 'advanced':
        return 'متقدم';
      default:
        return level;
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} دقيقة`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours} ساعة`;
    }
    return `${hours} ساعة و ${remainingMinutes} دقيقة`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={`cursor-pointer ${className}`}
      onClick={() => onClick?.(path.id)}
    >
      <Card className="p-6 space-y-4">
        {/* رأس المسار */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {path.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {path.description || 'لا يوجد وصف للمسار'}
            </p>
          </div>
          <Badge className={getLevelColor(path.level)}>
            {getLevelText(path.level)}
          </Badge>
        </div>

        {/* إحصائيات المسار */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>{path.courses?.length || 0} كورس</span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{formatTime(path.studyTime)}</span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Target className="w-4 h-4" />
            <span>{path.completedTasks}/{path.totalTasks} مهام</span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{path.peers?.length || 0} مشارك</span>
          </div>
        </div>

        {/* نسبة التقدم */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">نسبة التقدم</span>
            <span className="font-medium text-gray-900">
              {Math.round(path.progress)}%
            </span>
          </div>
          <Progress
            value={path.progress}
            className="h-2"
          />
        </div>

        {/* المشاركون */}
        {path.peers && path.peers.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">المشاركون</span>
              <span className="text-xs text-gray-500">
                {path.peers.length} شخص
              </span>
            </div>
            <PathAvatars
              users={path.peers}
              maxDisplay={5}
              size="sm"
            />
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-between">
            <span>الوقت المتبقي:</span>
            <span className="font-medium">
              {formatTime(path.remainingTime)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span>معدل المشاركة:</span>
            <span className="font-medium">
              {Math.round(path.engagement)}%
            </span>
          </div>
        </div>

        {/* زر الانتقال */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium">عرض تفاصيل المسار</span>
            <ArrowRight className="w-4 h-4 mr-1" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}; 