'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, BookOpen, Star } from 'lucide-react';
import { Avatar, Badge, Button } from '@3de/ui';
import { Instructor } from '@3de/interfaces';

interface InstructorCardProps {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      {/* Instructor Header */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar
          src={instructor.user?.avatar}
          alt={instructor.user?.firstName + ' ' + instructor.user?.lastName}
          size="lg"
          className="w-16 h-16"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {instructor.user?.firstName + ' ' + instructor.user?.lastName}
          </h3>
          <p className="text-gray-600 mb-2">{instructor.user?.email}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {instructor.rating || 0}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {instructor.courses?.length || 0} كورس
            </Badge>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {instructor.bio || 'لا يوجد وصف متاح'}
      </p>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {instructor.user?.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{instructor.user?.email}</span>
          </div>
        )}
        {instructor.user?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{instructor.user?.phone}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-primary-main">
            {instructor.courses?.length || 0}
          </div>
          <div className="text-xs text-gray-600">الكورسات</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary-main">
            {instructor.courses?.length || 0}
          </div>
          <div className="text-xs text-gray-600">الطلاب</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-primary-main">
            {instructor.experienceYears || 0}
          </div>
          <div className="text-xs text-gray-600">سنوات الخبرة</div>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/instructors/${instructor.id}`}>
        <Button className="w-full" variant="outline">
          <BookOpen className="w-4 h-4 ml-2" />
          عرض الكورسات
        </Button>
      </Link>
    </motion.div>
  );
} 