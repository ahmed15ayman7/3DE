'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  BookOpen, 
  Award, 
  Calendar,
  Eye, 
  Edit,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { User as UserType, Enrollment, Course, Achievement, Badge } from '@3de/interfaces';

interface StudentCardProps {
  student: UserType & {
    enrollments: (Enrollment & { course: Course })[];
    achievements: Achievement[];
    badges: Badge[];
  };
  delay?: number;
}

export default function StudentCard({ student, delay = 0 }: StudentCardProps) {
  const enrollmentCount = student.enrollments?.length || 0;
  const activeEnrollments = student.enrollments?.filter(e => e.status === 'ACTIVE').length || 0;
  const completedCourses = student.enrollments?.filter(e => e.progress === 100).length || 0;
  const averageProgress = enrollmentCount > 0 
    ? student.enrollments.reduce((sum, enrollment) => sum + (enrollment.progress || 0), 0) / enrollmentCount 
    : 0;

  const getStatusColor = (isOnline: boolean, isVerified: boolean) => {
    if (isOnline && isVerified) return 'bg-green-100 text-green-800';
    if (isVerified) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (isOnline: boolean, isVerified: boolean) => {
    if (isOnline && isVerified) return 'نشط ومتصل';
    if (isVerified) return 'متحقق';
    return 'في انتظار التحقق';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            {student.avatar ? (
              <img 
                src={student.avatar} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <div className="text-white">
            <h3 className="text-lg font-bold mb-1">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-blue-100 opacity-90 mb-2 text-sm">
              {student.email}
            </p>
            
            {/* Progress */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">
                التقدم العام: {Math.round(averageProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.isOnline, student.isVerified)}`}>
            {getStatusText(student.isOnline, student.isVerified)}
          </span>
        </div>

        {/* Verification Icon */}
        <div className="absolute bottom-4 left-4">
          {student.isVerified ? (
            <CheckCircle className="w-5 h-5 text-green-300" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-300" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {student.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-500" />
              <span>{student.phone}</span>
            </div>
          )}
          
          {student.age && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>{student.age} سنة</span>
            </div>
          )}
          
          {student.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{student.location}</span>
            </div>
          )}
        </div>

        {/* Role & Sub Role */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {student.role}
            </span>
            {student.subRole && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {student.subRole}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{enrollmentCount}</p>
            <p className="text-xs text-gray-500">كورسات</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{activeEnrollments}</p>
            <p className="text-xs text-gray-500">نشط</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{completedCourses}</p>
            <p className="text-xs text-gray-500">مكتمل</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Award className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{student.achievements?.length || 0}</p>
            <p className="text-xs text-gray-500">إنجاز</p>
          </div>
        </div>

        {/* Recent Courses */}
        {student.enrollments && student.enrollments.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">أحدث الكورسات:</p>
            <div className="space-y-1">
              {student.enrollments.slice(0, 2).map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between text-sm">
                                     <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${
                       enrollment.status === 'ACTIVE' ? 'bg-green-500' :
                       (enrollment.progress === 100) ? 'bg-blue-500' : 'bg-yellow-500'
                     }`}></div>
                     <span className="text-gray-600 truncate max-w-32">
                       {enrollment.course?.title || 'كورس غير محدد'}
                     </span>
                   </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(enrollment.progress || 0)}%
                  </span>
                </div>
              ))}
              {student.enrollments.length > 2 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  +{student.enrollments.length - 2} كورس آخر
                </p>
              )}
            </div>
          </div>
        )}

        {/* Badges */}
        {student.badges && student.badges.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">الشارات:</p>
            <div className="flex flex-wrap gap-1">
              {student.badges.slice(0, 3).map((badge) => (
                <span
                  key={badge.id}
                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  <Award className="w-3 h-3" />
                  {badge.title}
                </span>
              ))}
              {student.badges.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{student.badges.length - 3} أخرى
                </span>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">التقدم العام</span>
            <span className="font-medium">{Math.round(averageProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${averageProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Join Date */}
        <div className="mb-4 text-xs text-gray-500">
          <Calendar className="w-3 h-3 inline ml-1" />
          انضم في: {new Date(student.createdAt).toLocaleDateString('ar-SA')}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/students/${student.id}`}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Link>
          
          <Link 
            href={`/students/${student.id}/edit`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 