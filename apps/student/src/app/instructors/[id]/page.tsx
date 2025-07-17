'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { instructorApi, courseApi } from '@3de/apis';
import Layout from '../../../components/layout/Layout';
import CourseCard from '../../../components/courses/CourseCard';
import { Button, Card, Avatar, Badge, Progress, Skeleton } from '@3de/ui';
import { Mail, Phone, MapPin, Star, Users, BookOpen, Clock } from 'lucide-react';
import { Course } from '@3de/interfaces';

export default function InstructorPage() {
  const params = useParams();
  const instructorId = params.id as string;

  const { data: instructor, isLoading: instructorLoading } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: () => instructorApi.getById(instructorId),
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-courses', instructorId],
    queryFn: () => courseApi.getByInstructorId(instructorId),
  });

  if (instructorLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!instructor) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المحاضر غير موجود</h1>
          <p className="text-gray-600">عذراً، المحاضر المطلوب غير متاح</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Instructor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-main to-secondary-main rounded-xl p-6 text-white"
        >
          <div className="flex items-start gap-6">
            <Avatar
              src={instructor.data.user.avatar}
              alt={instructor.data.user.firstName + ' ' + instructor.data.user.lastName}
              size="xl"
              className="w-24 h-24"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{instructor.data.user.firstName + ' ' + instructor.data.user.lastName}</h1>
              <p className="text-xl text-white/90 mb-4">{instructor.data.title}</p>
              <p className="text-white/80 mb-4">{instructor.data.bio}</p>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span>{instructor.data.rating} تقييم</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{instructor.data.courses.length} طالب</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{instructor.data.courses.length} كورس</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{instructor.data.experienceYears} سنوات خبرة</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Instructor Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل</h2>
              
              <div className="space-y-4">
                {instructor.data.user.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="font-medium">{instructor.data.user.email}</p>
                    </div>
                  </div>
                )}

                {instructor.data.user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">رقم الهاتف</p>
                      <p className="font-medium">{instructor.data.user.phone}</p>
                    </div>
                  </div>
                )}

                {instructor.data.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">الموقع</p>
                      <p className="font-medium">{instructor.data.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المهارات</h3>
                <div className="flex flex-wrap gap-2">
                  {instructor.data.skills?.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Stats and Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-main">
                    {instructor.data.courses.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">الكورسات</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-main">
                    {instructor.data.courses.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">الطلاب</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-main">
                    {instructor.data.rating || 0}
                  </div>
                  <div className="text-sm text-gray-600">التقييم</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">معدل رضا الطلاب</span>
                  <span className="text-sm text-gray-500">{instructor.data.rating || 0}%</span>
                </div>
                <Progress value={instructor.data.rating || 0} className="h-2" />
              </div>
            </Card>

            {/* Courses */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">الكورسات</h2>
              
              {coursesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-48" />
                  ))}
                </div>
              ) : courses && courses.data && courses.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.data.map((course: Course, index: number) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CourseCard course={course} isEnrolled={false} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    لا توجد كورسات متاحة
                  </h3>
                  <p className="text-gray-600">
                    هذا المحاضر لم ينشر أي كورسات بعد
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 