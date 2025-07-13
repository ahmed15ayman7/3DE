'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { courseApi, lessonApi } from '@3de/apis';
import Layout from '../../../components/layout/Layout';
import LessonList from '../../../components/lessons/LessonList';
import FileViewer from '../../../components/files/FileViewer';
import { Skeleton } from '@3de/ui';
import { Lesson, File, Instructor } from '@3de/interfaces';

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id as string;
  
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Fetch course data
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseApi.getById(courseId),
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: () => lessonApi.getByCourse(courseId),
  });

  // Set first lesson as current when lessons load
  useEffect(() => {
    if (lessons && lessons.data && lessons.data.length > 0 && !currentLessonId) {
      setCurrentLessonId(lessons.data[0].id);
      if (lessons.data[0].files && lessons.data[0].files.length > 0) {
        setCurrentFile(lessons.data[0].files[0] as File);
      }
    }
  }, [lessons, currentLessonId]);

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    const selectedLesson = lessons?.data?.find((lesson: Lesson) => lesson.id === lessonId);
    if (selectedLesson?.files && selectedLesson.files.length > 0) {
      setCurrentFile(selectedLesson.files[0] as File);
    } else {
      setCurrentFile(null);
    }
  };

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
  };

  const handleFileProgress = async (progress: number) => {
    if (currentLessonId && progress >= 90) {
      // Update lesson progress when file is almost complete
      try {
        await lessonApi.update(currentLessonId, { progress: progress });
        // Refetch lessons to update progress
        // You might want to use queryClient.invalidateQueries here
      } catch (error) {
        console.error('Failed to update lesson progress:', error);
      }
    }
  };

  const handleFileComplete = async () => {
    if (currentLessonId) {
      try {
        await lessonApi.update(currentLessonId, { progress: 100 });
        // Refetch lessons to update progress
        // You might want to use queryClient.invalidateQueries here
      } catch (error) {
        console.error('Failed to update lesson progress:', error);
      }
    }
  };

  if (courseLoading || lessonsLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!course || !lessons) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الكورس غير موجود</h1>
          <p className="text-gray-600">عذراً، الكورس المطلوب غير متاح</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start space-x-4">
            {course.data.image && (
              <img
                src={course.data.image}
                alt={course.data.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.data.title}</h1>
              <p className="text-gray-600 mb-4">{course.data.description}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <span>{lessons.data.length} درس</span>
                <span>{course.data.startDate?.toLocaleDateString() || 'غير محدد'}</span>
                <span>{course.data.instructors?.map((instructor: Instructor) => instructor.user?.firstName + ' ' + instructor.user?.lastName).join(', ') || 'غير محدد'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Lessons List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <LessonList
                lessons={lessons.data as Lesson[]}
                currentLessonId={currentLessonId || undefined}
                onLessonSelect={handleLessonSelect}
                onFileSelect={handleFileSelect}
              />
            </motion.div>
          </div>

          {/* File Viewer */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {currentFile ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentFile.name}
                    </h3>
                  </div>
                  <div className="p-4">
                    <FileViewer
                      file={currentFile  as File}
                      onProgress={handleFileProgress}
                      onComplete={handleFileComplete}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    اختر درساً لعرض المحتوى
                  </h3>
                  <p className="text-gray-600">
                    اختر درساً من القائمة على اليسار لبدء التعلم
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 