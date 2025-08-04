'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  User,
  Calendar,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { Button, Card } from '@3de/ui';
import { useEffect, useState } from 'react';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  featuredImage: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  isFeautred?: boolean;
  className?: string;
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
}

export default function BlogCard({
  id,
  title,
  excerpt,
  featuredImage,
  publishDate,
  readTime,
  category,
  tags,
  isFeautred = false,
  className = '',
  variant = 'default',
}: BlogCardProps) {
  const isCompact = variant === 'compact';
  const isHorizontal = variant === 'horizontal';
  const isFeatured = variant === 'featured' || isFeautred;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString||"");
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toString();
  };


  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={` group cursor-pointer ${
        isFeatured ? 'ring-2 ring-primary-main ring-offset-2' : ''
      } ${isHorizontal ? 'md:flex md:flex-row' : ''} ${className}`}
    >
      <Card padding='none' className='w-full h-full overflow-hidden'>
      <Link href={`/blogs/${id}`}>
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
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-center"
            >
              <p className="text-sm font-medium">اقرأ المقال</p>
              <ArrowLeft className="mx-auto mt-1" size={20} />
            </motion.div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-primary-main text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                مميز
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`card-body ${isHorizontal ? 'md:w-2/3' : ''}`}>
          {/* Meta Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 gap-reverse text-sm text-text-secondary">
              <Calendar size={14} />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1 gap-reverse text-sm text-text-secondary">
              <Clock size={14} />
              <span>{readTime}</span>
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

          {/* Excerpt */}
          {!isCompact && (
            <p className={`text-text-secondary line-clamp-3 mb-4 ${
              isFeatured ? 'text-base' : 'text-sm'
            }`}>
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0  && (
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



          {/* Read More Button (for featured variant) */}
          {isFeatured && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="md"
                className="group-hover:bg-primary-main group-hover:text-white group-hover:border-primary-main transition-all duration-200"
              >
                اقرأ المزيد
                <ArrowLeft size={16} className="mr-1" />
              </Button>
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
                text: excerpt,
                url: `/blogs/${id}`
              });
            }
          }}
        >
          <Share2 size={14} className="text-gray-600" />
        </button>
      </div>
      </Card>
    </motion.article>
  );
} 

export  function HijriDate() {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    const d = new Date()
    const formatted = d.toLocaleDateString('ar-EG-u-ca-islamic', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    setDate(formatted)
  }, [])

  return <span>{date}</span>
}
