'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import { Button, Card, Progress, Skeleton } from '@3de/ui';
import { useQuery } from '@tanstack/react-query';
import { courseApi, instructorApi, userApi } from '@3de/apis';
import CourseCard from '../components/courses/CourseCard';
import InstructorCard from '../components/instructors/InstructorCard';
import Layout from '../components/layout/Layout';
import { useAuth } from '@3de/auth';
import { Course, Instructor, Lesson } from '@3de/interfaces';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'instructors'>('courses');
  const { user } = useAuth();
  
  // Fetch data
  const { data: coursesResponse, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await courseApi.getAll();
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data))
      };
    },
  });

  const { data: instructorsResponse, isLoading: instructorsLoading } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await instructorApi.getAll(0, 5, "");
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data))
      };
    },
  });

  const { data: statsResponse, isLoading: statsLoading } = useQuery({
    queryKey: ['student-stats'],
    queryFn: async () => {
      const response = await userApi.getProfile(user?.id || "");
      return {
        ...response,
        data: JSON.parse(JSON.stringify(response.data))
      };
    },
  });

  const courses = (coursesResponse as any)?.data || [];
  const instructors = (instructorsResponse as any)?.data || [];
  const stats = (statsResponse as any)?.data;

  const enrolledCourses = courses.filter((course: Course) => course.enrollments?.length && course.enrollments?.length > 0) || [];
  const availableCourses = courses.filter((course: Course) => course.enrollments?.length === 0) || [];

  const statsCards = [
    {
      title: 'الكورسات المشترك فيها',
      value: stats?.enrollments?.length || 0,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'الدروس المكتملة',
      value: stats?.lessons?.filter((lesson: Lesson) => lesson.status === "COMPLETED").length || 0,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'النقاط المكتسبة',
      value: stats?.achievements?.length || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'المحاضرين',
      value: instructors?.length || 0,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-main to-secondary-main rounded-xl p-6 text-white"
        >
          <h1 className="text-2xl font-bold mb-2">مرحباً بك في منصة 3DE التعليمية</h1>
          <p className="text-white/90">
            استكشف الكورسات المتاحة وتعلم من أفضل المحاضرين
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24" />
            ))
          ) : (
            statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Progress Overview */}
        {statsLoading ? (
          <Skeleton className="h-32" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">التقدم العام</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">إجمالي التقدم</span>
                    <span className="text-sm text-gray-500">
                      {(() => {
                        const completedLessons = stats?.lessons?.filter((lesson: Lesson) => lesson.status === "COMPLETED").length || 0;
                        const totalLessons = stats?.lessons?.length || 1;
                        return Math.round((completedLessons / totalLessons) * 100);
                      })()}%
                    </span>
                  </div>
                  <Progress 
                    value={(() => {
                      const completedLessons = stats?.lessons?.filter((lesson: Lesson) => lesson.status === "COMPLETED").length || 0;
                      const totalLessons = stats?.lessons?.length || 1;
                      return Math.round((completedLessons / totalLessons) * 100);
                    })()} 
                    className="h-2" 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">الكورسات المكتملة</p>
                    <p className="text-lg font-semibold text-primary-main">
                      {stats?.createdCourses?.length || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">الساعات الدراسية</p>
                    <p className="text-lg font-semibold text-primary-main">
                      {stats?.lessons?.filter((lesson: Lesson) => lesson.status === "COMPLETED").length || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">المعدل العام</p>
                    <p className="text-lg font-semibold text-primary-main">
                      {stats?.achievements?.length || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'courses'
                ? 'border-primary-main text-primary-main'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            الكورسات
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'instructors'
                ? 'border-primary-main text-primary-main'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            المحاضرين
          </button>
        </div>

        {/* Content */}
        {activeTab === 'courses' ? (
          <div className="space-y-6">
            {/* Enrolled Courses */}
            {enrolledCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">الكورسات المشترك فيها</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={index} className="h-80" />
                    ))
                  ) : (
                    enrolledCourses.map((course: Course, index: number) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <CourseCard course={course} isEnrolled={true} />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Available Courses */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">الكورسات المتاحة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-80" />
                  ))
                ) : (
                  availableCourses.map((course: Course, index: number) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CourseCard course={course} isEnrolled={false} />
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">المحاضرين</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorsLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-64" />
                ))
              ) : (
                instructors?.map((instructor: Instructor, index: number) => (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <InstructorCard instructor={instructor} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
