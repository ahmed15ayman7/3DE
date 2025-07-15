'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Star, 
  Users, 
  BookOpen, 
  Award,
  MapPin,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  ExternalLink
} from 'lucide-react';
import { Button } from '@3de/ui';

interface InstructorCardProps {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  specializations: string[];
  rating?: number;
  totalStudents: number;
  totalCourses: number;
  experience: string;
  location?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  isVerified?: boolean;
  languages: string[];
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

export default function InstructorCard({
  id,
  name,
  title,
  bio,
  avatar,
  specializations,
  rating = 0,
  totalStudents,
  totalCourses,
  experience,
  location,
  email,
  socialLinks,
  isVerified = false,
  languages,
  className = '',
  variant = 'default',
}: InstructorCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`card group cursor-pointer ${
        isFeatured ? 'ring-2 ring-primary-main ring-offset-2' : ''
      } ${className}`}
    >
      <div className='hover:bg-primary-main/10 rounded-lg p-4'>
        <div className="card-body text-center">
          {/* Avatar */}
          <div className="relative mx-auto mb-4">
            <div className={`relative ${isCompact ? 'w-20 h-20' : 'w-24 h-24'} mx-auto`}>
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover rounded-full ring-4 ring-white shadow-lg"
              />
              
              {/* Verified Badge */}
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-main rounded-full flex items-center justify-center">
                  <Award className="text-white" size={12} />
                </div>
              )}
              
              {/* Online Status */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>

          {/* Name and Title */}
          <div className="mb-4">
            <h3 className={`font-bold text-text-primary group-hover:text-primary-main transition-colors duration-200 ${
              isCompact ? 'text-lg mb-1' : 'text-xl mb-2'
            }`}>
              {name}
            </h3>
            <p className="text-text-secondary text-sm">{title}</p>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center justify-center gap-1 gap-reverse mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary mr-1">({rating})</span>
            </div>
          )}

          {/* Bio */}
          {!isCompact && (
            <p className="text-text-secondary text-sm line-clamp-3 mb-4">
              {bio}
            </p>
          )}

          {/* Specializations */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {specializations.slice(0, isCompact ? 2 : 3).map((spec, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-primary-dark text-xs font-medium rounded-full"
                >
                  {spec}
                </span>
              ))}
              {specializations.length > (isCompact ? 2 : 3) && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  +{specializations.length - (isCompact ? 2 : 3)}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 gap-reverse text-text-secondary">
                <Users size={14} />
                <span>{totalStudents}</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">طالب</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 gap-reverse text-text-secondary">
                <BookOpen size={14} />
                <span>{totalCourses}</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">كورس</p>
            </div>
          </div>

          {/* Experience and Location */}
          <div className="mb-4 space-y-2">
            <div className="text-xs text-text-secondary">
              خبرة {experience}
            </div>
            {location && (
              <div className="flex items-center justify-center gap-1 gap-reverse text-xs text-text-secondary">
                <MapPin size={12} />
                <span>{location}</span>
              </div>
            )}
          </div>

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-text-secondary mb-1">اللغات:</p>
              <div className="flex flex-wrap gap-1 justify-center">
                {languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {socialLinks && (
            <div className="flex items-center justify-center gap-3 gap-reverse mb-4">
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-main transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin size={16} />
                </Link>
              )}
              {socialLinks.twitter && (
                  <Link
                  href={socialLinks.twitter ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-main transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Twitter size={16} />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary-main transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Instagram size={16} />
                </Link>
              )}
              {email && (
                <Link
                  href={`mailto:${email ?? ""}`}
                  className="text-text-secondary hover:text-primary-main transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail size={16} />
                </Link>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            size={isCompact ? "sm" : "md"}
            variant="outline"
            className="w-full group-hover:bg-primary-main group-hover:text-white group-hover:border-primary-main transition-all duration-200"
          >
            <span>عرض الملف الشخصي</span>
            <ExternalLink size={14} className="mr-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 