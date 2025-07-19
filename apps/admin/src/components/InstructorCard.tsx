'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  BookOpen, 
  Users, 
  Star, 
  Calendar,
  Eye, 
  Edit,
  Mail,
  Phone,
  Award,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { Instructor, User as UserType, Course } from '@3de/interfaces';

interface InstructorCardProps {
  instructor: Instructor & {
    user: UserType;
    courses: Course[];
  };
  delay?: number;
}

export default function InstructorCard({ instructor, delay = 0 }: InstructorCardProps) {
  const coursesCount = instructor.courses?.length || 0;
  const totalStudents = instructor.courses?.reduce((sum, course) => 
    sum + (course.enrollments?.length || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary-main to-primary-dark p-6">
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
            {instructor.user?.avatar ? (
              <img 
                src={instructor.user.avatar} 
                alt={`${instructor.user.firstName} ${instructor.user.lastName}`}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-primary-main" />
            )}
          </div>
          
          <div className="text-white">
            <h3 className="text-xl font-bold mb-1">
              {instructor.user?.firstName} {instructor.user?.lastName}
            </h3>
            <p className="text-primary-light opacity-90 mb-2">
              {instructor.title || 'محاضر'}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <span className="text-sm">{instructor.rating || 'جديد'}</span>
              {instructor.experienceYears && (
                <span className="text-sm opacity-75 mr-2">
                  · {instructor.experienceYears} سنوات خبرة
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-medium">
            {instructor.user?.isOnline ? 'متاح' : 'غير متاح'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Bio */}
        {instructor.bio && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {instructor.bio}
            </p>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {instructor.user?.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="truncate">{instructor.user.email}</span>
            </div>
          )}
          
          {instructor.user?.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-500" />
              <span>{instructor.user.phone}</span>
            </div>
          )}
          
          {instructor.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{instructor.location}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {instructor.skills && instructor.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">المهارات:</p>
            <div className="flex flex-wrap gap-1">
              {instructor.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {instructor.skills.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{instructor.skills.length - 3} أخرى
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{coursesCount}</p>
            <p className="text-xs text-gray-500">كورس</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{totalStudents}</p>
            <p className="text-xs text-gray-500">طالب</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{instructor.rating || '0'}</p>
            <p className="text-xs text-gray-500">تقييم</p>
          </div>
        </div>

        {/* Latest Courses */}
        {instructor.courses && instructor.courses.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">أحدث الكورسات:</p>
            <div className="space-y-1">
              {instructor.courses.slice(0, 2).map((course) => (
                <div key={course.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary-main rounded-full"></div>
                  <span className="text-gray-600 truncate">{course.title}</span>
                  <span className="text-xs text-gray-400">
                    ({course.enrollments?.length || 0} طالب)
                  </span>
                </div>
              ))}
              {instructor.courses.length > 2 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  +{instructor.courses.length - 2} كورس آخر
                </p>
              )}
            </div>
          </div>
        )}

        {/* Academy */}
        {instructor.academy && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">
                أكاديمية: {instructor.academy.name}
              </span>
            </div>
          </div>
        )}

        {/* Join Date */}
        {instructor.user?.createdAt && (
          <div className="mb-4 text-xs text-gray-500">
            <Calendar className="w-3 h-3 inline ml-1" />
            انضم في: {new Date(instructor.user.createdAt).toLocaleDateString('ar-SA')}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/instructors/${instructor.id}`}
            className="flex-1 bg-gradient-to-r from-primary-main to-primary-dark text-white py-2 px-4 rounded-lg hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Link>
          
          <Link 
            href={`/instructors/${instructor.id}/edit`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 