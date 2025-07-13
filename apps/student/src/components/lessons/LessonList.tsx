'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Play, CheckCircle, Lock } from 'lucide-react';
import { Progress, Badge } from '@3de/ui';
import { Lesson, File } from '@3de/interfaces';

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  onFileSelect: (file: File) => void;
}

export default function LessonList({ 
  lessons, 
  currentLessonId, 
  onLessonSelect, 
  onFileSelect 
}: LessonListProps) {
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const isLessonCompleted = (lesson: Lesson) => {
    return lesson.progress === 100;
  };

  const isLessonLocked = (lesson: Lesson, index: number) => {
    if (index === 0) return false;
    const previousLesson = lessons[index - 1];
    return !isLessonCompleted(previousLesson);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'VIDEO':
        return <Play className="w-4 h-4" />;
      case 'PDF':
        return <span className="text-red-500 font-bold">PDF</span>;
      case 'AUDIO':
        return <span className="text-blue-500 font-bold">🎵</span>;
      case 'IMAGE':
        return <span className="text-green-500 font-bold">🖼️</span>;
      default:
        return <span className="text-gray-500 font-bold">📄</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">قائمة الدروس</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {lessons.map((lesson, index) => {
          const isExpanded = expandedLessons.includes(lesson.id);
          const isCompleted = isLessonCompleted(lesson);
          const isLocked = isLessonLocked(lesson, index);
          const isCurrent = currentLessonId === lesson.id;

          return (
            <div key={lesson.id} className="p-4">
              {/* Lesson Header */}
              <div 
                className={`flex items-center justify-between cursor-pointer ${
                  isLocked ? 'opacity-50' : ''
                }`}
                onClick={() => !isLocked && onLessonSelect(lesson.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${
                      isCurrent ? 'text-primary-main' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {lesson.files?.length || 0} ملف
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center space-x-3">
                  <div className="w-20">
                    <Progress 
                      value={lesson.progress || 0} 
                      className="h-1"
                    />
                  </div>
                  <span className="text-xs text-gray-500 min-w-[40px]">
                    {Math.round(lesson.progress || 0)}%
                  </span>
                  
                  {/* Expand Button */}
                  {lesson.files && lesson.files.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLesson(lesson.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Files List */}
              <AnimatePresence>
                {isExpanded && lesson.files && lesson.files.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pl-8"
                  >
                    <div className="space-y-2">
                      {lesson.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => onFileSelect(file)}
                        >
                          {getFileIcon(file.type ||"pdf")}
                          <span className="text-sm text-gray-700 flex-1">
                            {file.name}
                          </span>
                          {file.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
} 