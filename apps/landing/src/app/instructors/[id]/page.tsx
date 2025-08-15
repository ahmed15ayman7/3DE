'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Award } from 'lucide-react';
import { landingApi } from '@3de/apis';
import { Button, Badge, Avatar } from '@3de/ui';
import { Course } from '@3de/interfaces';

export default function InstructorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const instructorId = params.id as string;

  const { data: instructorData, isLoading, error } = useQuery({
    queryKey: ['instructor', instructorId],
    queryFn: () => landingApi.getInstructor(instructorId),
    enabled: !!instructorId
  });

  const instructor = instructorData?.data;

  if (isLoading) {
    return <p className="text-center py-20">جارٍ تحميل البيانات...</p>;
  }

  if (error || !instructor) {
    return <p className="text-center text-red-500 py-20">حدث خطأ في تحميل البيانات</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          {`${instructor.user?.firstName} ${instructor.user?.lastName}`}
        </h1>
      </motion.div>

      {/* Instructor Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start gap-6">
          <Avatar src={instructor.user?.avatar} alt={`${instructor.user?.firstName} ${instructor.user?.lastName}`} className="w-24 h-24" />
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-semibold">{instructor.title}</h2>
            {instructor.bio && <p className="text-gray-700">{instructor.bio}</p>}
            {instructor.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span>{instructor.rating}/5</span>
              </div>
            )}
            {instructor.experienceYears && (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-500" />
                <span>{instructor.experienceYears} سنوات خبرة</span>
              </div>
            )}
            {instructor.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{instructor.location}</span>
              </div>
            )}
            {instructor.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {instructor.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Courses Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">الكورسات ({instructor.courses?.length || 0})</h2>
        {instructor.courses?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructor.courses.map((course: Course, index: number) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-md p-4">
                {course.image && <img src={course.image} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-4" />}
                <h4 className="font-medium mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                <p className="text-sm font-semibold text-primary-main">السعر: {course.price} جنيه</p>
                <p className="text-sm text-gray-500">المدة: {course.duration}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">لا يوجد كورسات</p>
        )}
      </motion.div>
    </div>
  );
}
