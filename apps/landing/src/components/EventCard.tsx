'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Tag,
  ExternalLink,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react';
import { Button } from '@3de/ui';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  featuredImage: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: {
    type: 'online' | 'offline' | 'hybrid';
    venue?: string;
    address?: string;
    city?: string;
  };
  organizer: {
    name: string;
    avatar?: string;
    organization?: string;
  };
  category: string;
  tags: string[];
  maxAttendees?: number;
  currentAttendees: number;
  price?: number;
  isFree: boolean;
  isBookmarked?: boolean;
  isPast?: boolean;
  registrationDeadline?: string;
  className?: string;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

export default function EventCard({
  id,
  title,
  description,
  featuredImage,
  startDate,
  endDate,
  startTime,
  endTime,
  location,
  organizer,
  category,
  tags,
  maxAttendees,
  currentAttendees,
  price,
  isFree,
  isBookmarked = false,
  isPast = false,
  registrationDeadline,
  className = '',
  variant = 'default',
}: EventCardProps) {
  const isCompact = variant === 'compact';
  const isHorizontal = variant === 'horizontal';
  const isFeatured = variant === 'featured';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('ar-SA', { month: 'short' }),
      weekday: date.toLocaleDateString('ar-SA', { weekday: 'short' }),
      full: date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const startDateFormatted = formatDate(startDate);
  const isFullyBooked = maxAttendees && currentAttendees >= maxAttendees;
  const isSoldOut = isFullyBooked && !isFree;

  const getLocationIcon = () => {
    switch (location.type) {
      case 'online':
        return '🌐';
      case 'offline':
        return '📍';
      case 'hybrid':
        return '🔄';
      default:
        return '📍';
    }
  };

  const getLocationText = () => {
    switch (location.type) {
      case 'online':
        return 'عبر الإنترنت';
      case 'offline':
        return location.venue || location.address || location.city || 'مكان محدد';
      case 'hybrid':
        return 'حضوري وعن بُعد';
      default:
        return 'مكان محدد';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={`card group cursor-pointer relative overflow-hidden ${
        isFeatured ? 'ring-2 ring-primary-main ring-offset-2' : ''
      } ${isHorizontal ? 'md:flex md:flex-row' : ''} ${
        isPast ? 'opacity-75' : ''
      } ${className}`}
    >
      <Link href={`/events/${id}`}>
        {/* Date Badge */}
        <div className={`absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 text-center min-w-[60px] ${
          isPast ? 'bg-gray-100' : 'bg-white'
        }`}>
          <div className={`text-2xl font-bold ${isPast ? 'text-gray-500' : 'text-primary-main'}`}>
            {startDateFormatted.day}
          </div>
          <div className={`text-xs font-medium ${isPast ? 'text-gray-400' : 'text-text-secondary'}`}>
            {startDateFormatted.month}
          </div>
          <div className={`text-xs ${isPast ? 'text-gray-400' : 'text-text-secondary'}`}>
            {startDateFormatted.weekday}
          </div>
        </div>

        {/* Image Container */}
        <div className={`relative overflow-hidden ${
          isHorizontal 
            ? 'md:w-1/3 h-48 md:h-auto' 
            : isCompact 
              ? 'h-40' 
              : isFeatured 
                ? 'h-64' 
                : 'h-48'
        }`}>
          <img
            src={featuredImage}
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
              isPast ? 'grayscale' : ''
            }`}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-center"
            >
              <p className="text-sm font-medium">
                {isPast ? 'عرض التفاصيل' : 'تسجيل الحضور'}
              </p>
              <ExternalLink className="mx-auto mt-1" size={20} />
            </motion.div>
          </div>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {isPast && (
              <span className="px-2 py-1 bg-gray-600 text-white text-xs font-medium rounded-full">
                انتهى
              </span>
            )}
            {isSoldOut && !isPast && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                مكتمل
              </span>
            )}
            {isFree && !isPast && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                مجاني
              </span>
            )}
            {isFeatured && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                مميز
              </span>
            )}
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-text-primary text-xs font-medium rounded-full">
              {getLocationIcon()} {location.type === 'online' ? 'أونلاين' : 'حضوري'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`card-body ${isHorizontal ? 'md:w-2/3' : ''}`}>
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary-main font-medium">{category}</span>
            <div className="flex items-center gap-2 gap-reverse">
              {/* Bookmark Button */}
              <button
                className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 ${
                  isBookmarked ? 'text-primary-main' : 'text-gray-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle bookmark
                }}
              >
                <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-text-primary line-clamp-2 group-hover:text-primary-main transition-colors duration-200 mb-3 ${
            isFeatured 
              ? 'text-xl md:text-2xl' 
              : isCompact 
                ? 'text-base' 
                : 'text-lg'
          }`}>
            {title}
          </h3>

          {/* Description */}
          {!isCompact && (
            <p className={`text-text-secondary line-clamp-2 mb-4 ${
              isFeatured ? 'text-base' : 'text-sm'
            }`}>
              {description}
            </p>
          )}

          {/* Event Details */}
          <div className="space-y-2 mb-4 text-sm">
            {/* Date and Time */}
            <div className="flex items-center gap-2 gap-reverse text-text-secondary">
              <Calendar size={14} />
              <span>{startDateFormatted.full}</span>
              {endDate && endDate !== startDate && (
                <span>- {formatDate(endDate).full}</span>
              )}
            </div>

            <div className="flex items-center gap-2 gap-reverse text-text-secondary">
              <Clock size={14} />
              <span>{startTime}</span>
              {endTime && <span>- {endTime}</span>}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 gap-reverse text-text-secondary">
              <MapPin size={14} />
              <span>{getLocationText()}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && !isCompact && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 gap-reverse px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  <Tag size={10} />
                  <span>{tag}</span>
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Organizer and Attendees */}
          <div className="flex items-center justify-between mb-4">
            {/* Organizer */}
            <div className="flex items-center gap-2 gap-reverse">
              {organizer.avatar ? (
                <img
                  src={organizer.avatar}
                  alt={organizer.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={12} className="text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-text-primary">{organizer.name}</p>
                {organizer.organization && (
                  <p className="text-xs text-text-secondary">{organizer.organization}</p>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div className="flex items-center gap-1 gap-reverse text-sm text-text-secondary">
              <Users size={14} />
              <span>{currentAttendees}</span>
              {maxAttendees && <span>/ {maxAttendees}</span>}
            </div>
          </div>

          {/* Price and Registration */}
          <div className="flex items-center justify-between">
            <div>
              {isFree ? (
                <span className="text-lg font-bold text-green-600">مجاني</span>
              ) : price ? (
                <span className="text-lg font-bold text-primary-main">
                  {price} ر.س
                </span>
              ) : (
                <span className="text-sm text-text-secondary">السعر عند التسجيل</span>
              )}
            </div>

            {isPast ? (
              <Button variant="outline" size={isCompact ? "sm" : "md"} disabled>
                انتهى الحدث
              </Button>
            ) : isFullyBooked ? (
              <Button variant="outline" size={isCompact ? "sm" : "md"} disabled>
                مكتمل
              </Button>
            ) : (
              <Button 
                size={isCompact ? "sm" : "md"}
                className="bg-gradient-primary hover:opacity-90"
              >
                سجل الآن
              </Button>
            )}
          </div>

          {/* Registration Deadline */}
          {registrationDeadline && !isPast && (
            <div className="mt-2 text-xs text-text-secondary">
              آخر موعد للتسجيل: {formatDate(registrationDeadline).full}
            </div>
          )}
        </div>
      </Link>

      {/* Share Button */}
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle share functionality
            if (navigator.share) {
              navigator.share({
                title: title,
                text: description,
                url: `/events/${id}`
              });
            }
          }}
        >
          <Share2 size={14} className="text-gray-600" />
        </button>
      </div>
    </motion.div>
  );
} 