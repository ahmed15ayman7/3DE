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
import { Instructor, User as UserType, Course, Parent } from '@3de/interfaces';
import { Avatar } from '@3de/ui';

interface ParentCardProps {
  parent: Parent ;
  delay?: number;
}

export default function ParentCard({ parent, delay = 0 }: ParentCardProps) {
  const totalChildren = parent.children?.length || 0;

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
            {parent.user?.avatar ? (
              <img 
                src={parent.user.avatar} 
                alt={`${parent.user.firstName} ${parent.user.lastName}`}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-primary-main" />
            )}
          </div>
          
          <div className="text-white">
            <h3 className="text-xl font-bold mb-1">
              {parent.user?.firstName} {parent.user?.lastName}
            </h3>
            
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          {/* <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
            {instructor.user?.isOnline ? 'متاح' : 'غير متاح'}
          </span> */}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Bio */}
        <div className="flex items-center gap-2 justify-between">
        {parent.user?.isOnline ? <span className="bg-green-500 text-white h-2 w-2 rounded-full"></span> : <span className="bg-red-500 text-white h-2 w-2 rounded-full"></span>}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {parent.user?.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="truncate">{parent.user.email}</span>
            </div>
          )}
          
          {parent.user?.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-green-500" />
              <span>{parent.user.phone}</span>
            </div>
          )}
          
          {parent.user?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{parent.user.location}</span>
            </div>
          )}
        </div>


        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-gray-900">{totalChildren}</p>
            <p className="text-xs text-gray-500">طالب</p>
          </div>
          
        </div>

        {/* Latest Children */}
        {parent.children && parent.children.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">أحدث الأبناء:</p>
            <div className="space-y-1">
              {parent.children.slice(0, 2).map((child) => (
                <div key={child.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary-main rounded-full"></div>
                  <Avatar
                  fallback={child.user?.firstName.charAt(0)}
                    src={child.user?.avatar}
                    alt={`${child.user?.firstName} ${child.user?.lastName}`}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-gray-600 truncate">{child.user?.firstName} {child.user?.lastName}</span>
                  {/* <span className="text-xs text-gray-400">
                    ({course.user?.email || 0} أبناء)
                  </span> */}
                </div>
              ))}
              {parent.children.length > 2 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  +{parent.children.length - 2} أبناء آخر
                </p>
              )}
            </div>
          </div>
        )}


        {/* Join Date */}
        {parent.user?.createdAt && (
          <div className="mb-4 text-xs text-gray-500">
            <Calendar className="w-3 h-3 inline ml-1" />
            انضم في: {new Date(parent.user.createdAt).toLocaleDateString('ar-EG')}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link 
            href={`/parents/${parent.id}`}
            className="flex-1 bg-gradient-to-r from-primary-main to-primary-dark text-white py-2 px-4 rounded-lg hover:shadow-md transition-shadow flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            عرض التفاصيل
          </Link>
          
          <Link 
            href={`/parents/${parent.id}/edit`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 