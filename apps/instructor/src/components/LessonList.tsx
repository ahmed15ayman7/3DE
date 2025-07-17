'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  Circle,
  Video,
  Image,
  Music,
  File,
  Archive,
  Calendar,
  BookOpen,
} from 'lucide-react'
import { Card, Button, Badge, Progress, Tooltip } from '@3de/ui'
import { FileType,Lesson ,File as LessonFile } from '@3de/interfaces'



interface LessonListProps {
  lessons: Lesson[]
  selectedLesson: string | null
  onLessonSelect: (lessonId: string) => void
  onFileSelect: (file: LessonFile) => void
}

const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'VIDEO':
      return <Video className="h-4 w-4" />
    case 'PDF':
    case 'DOCUMENT':
      return <FileText className="h-4 w-4" />
    case 'IMAGE':
      return <Image className="h-4 w-4" />
    case 'AUDIO':
      return <Music className="h-4 w-4" />
    default:
      return <File className="h-4 w-4" />
  }
}

const getFileTypeColor = (type: FileType) => {
  switch (type) {
    case 'VIDEO':
      return 'text-red-500'
    case 'PDF':
    case 'DOCUMENT':
      return 'text-blue-500'
    case 'IMAGE':
      return 'text-green-500'
    case 'AUDIO':
      return 'text-purple-500'
    default:
      return 'text-gray-500'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'success'
    case 'IN_PROGRESS':
      return 'warning'
    case 'NOT_STARTED':
      return 'secondary'
    default:
      return 'primary'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'مكتمل'
    case 'IN_PROGRESS':
      return 'قيد التقدم'
    case 'NOT_STARTED':
      return 'لم يبدأ'
    default:
      return 'غير محدد'
  }
}

const LessonItem = ({
  lesson,
  isSelected,
  isExpanded,
  onToggle,
  onFileSelect,
}: {
  lesson: Lesson
  isSelected: boolean
  isExpanded: boolean
  onToggle: () => void
  onFileSelect: (file: LessonFile) => void
}) => {
  const [isLocked, setIsLocked] = useState(false)

  return (
    <motion.div
      layout
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      {/* Lesson Header */}
      <div
        className={`p-4 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'bg-primary-main text-white'
            : 'bg-white hover:bg-gray-50'
        }`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 gap-reverse flex-1">
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-medium truncate ${
                isSelected ? 'text-white' : 'text-gray-900'
              }`}>
                {lesson.title}
              </h3>
              <p className={`text-xs truncate mt-1 ${
                isSelected ? 'text-white/80' : 'text-gray-500'
              }`}>
                {lesson.files?.length} ملف
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 gap-reverse">
            <Badge 
              variant={getStatusColor(lesson.status)} 
              size="sm"
              className={isSelected ? 'bg-white/20 text-white' : ''}
            >
              {getStatusText(lesson.status)}
            </Badge>
            
            <Tooltip content={isLocked ? 'فتح الدرس' : 'قفل الدرس'}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLocked(!isLocked)
                }}
                className={`p-1 rounded transition-colors ${
                  isSelected
                    ? 'hover:bg-white/20'
                    : 'hover:bg-gray-100'
                }`}
              >
                {isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-xs ${
              isSelected ? 'text-white/80' : 'text-gray-600'
            }`}>
              التقدم
            </span>
            <span className={`text-xs font-medium ${
              isSelected ? 'text-white' : 'text-gray-900'
            }`}>
              {lesson.progress}%
            </span>
          </div>
          <div className={`w-full rounded-full h-1.5 ${
            isSelected ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isSelected ? 'bg-white' : 'bg-primary-main'
              }`}
              style={{ width: `${lesson.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Files List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="border-t border-gray-200"
          >
            <div className="p-3 bg-gray-50 space-y-2">
              {lesson.files?.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer hover:shadow-sm transition-all duration-200 ${
                    file.isCompleted ? 'border-l-4 border-l-green-500' : ''
                  }`}
                  onClick={() => onFileSelect(file)}
                >
                  <div className="flex items-center gap-3 gap-reverse flex-1">
                    <div className={`${getFileTypeColor(file.type as FileType)}`}>
                      {getFileIcon(file.type as FileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      {file.lastWatched && (
                        <p className="text-xs text-gray-500">
                          آخر مشاهدة: {new Date(file.lastWatched).toLocaleDateString('ar')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 gap-reverse">
                    {file.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                    
                    {file.type === 'VIDEO' && (
                      <Play className="h-4 w-4 text-primary-main" />
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(file.url, '_blank')
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
              
              {lesson.files?.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">لا توجد ملفات في هذا الدرس</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    إضافة ملف
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function LessonList({
  lessons,
  selectedLesson,
  onLessonSelect,
  onFileSelect,
}: LessonListProps) {
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set())

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons)
    if (expandedLessons.has(lessonId)) {
      newExpanded.delete(lessonId)
    } else {
      newExpanded.add(lessonId)
    }
    setExpandedLessons(newExpanded)
    onLessonSelect(lessonId)
  }

  const completedLessons = lessons.filter(l => l.status === 'COMPLETED').length
  const totalFiles = lessons.reduce((acc, lesson) => acc + (lesson.files?.length || 0), 0)
  const completedFiles = lessons.reduce(
    (acc, lesson) => acc + (lesson.files?.filter(f => f.isCompleted).length || 0),
    0
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            قائمة الدروس
          </h2>
          <Button variant="primary" size="sm">
            إضافة درس
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-primary-main">
              {completedLessons}/{lessons.length}
            </div>
            <div className="text-xs text-gray-600">دروس مكتملة</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-bold text-secondary-main">
              {completedFiles}/{totalFiles}
            </div>
            <div className="text-xs text-gray-600">ملفات مكتملة</div>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              التقدم الإجمالي
            </span>
            <span className="text-sm font-bold text-primary-main">
              {Math.round(lessons.reduce((acc, lesson) => acc + lesson.progress, 0) / lessons.length || 0)}%
            </span>
          </div>
          <Progress 
            value={lessons.reduce((acc, lesson) => acc + lesson.progress, 0) / lessons.length || 0}
            className="h-2"
          />
        </Card>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            lesson={lesson}
            isSelected={selectedLesson === lesson.id}
            isExpanded={expandedLessons.has(lesson.id)}
            onToggle={() => toggleLesson(lesson.id)}
            onFileSelect={onFileSelect}
          />
        ))}

        {lessons.length === 0 && (
          <Card className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد دروس
            </h3>
            <p className="text-gray-600 mb-4">
              ابدأ بإنشاء درسك الأول
            </p>
            <Button variant="primary">
              إضافة درس جديد
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
} 