'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Avatar, Button, Badge } from '@3de/ui';
import { Heart, MessageCircle, Share, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Post, User, Comment } from '@3de/interfaces';
import { Comment as CommentComponent } from './Comment';

interface PostCardProps {
  post: Post & { author: User; comments: Comment[] };
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onShare?: (postId: string) => void;
  isLiked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  isLiked = false
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const handleSubmitComment = () => {
    if (commentContent.trim() && onComment) {
      onComment(post.id, commentContent);
      setCommentContent('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="p-6">
        {/* رأس المنشور */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 gap-reverse">
            <Avatar
              src={post.author.avatar}
              alt={`${post.author.firstName} ${post.author.lastName}`}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.author.firstName} {post.author.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* محتوى المنشور */}
        <div className="mb-4">
          {post.title && (
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {post.title}
            </h4>
          )}
          <p className="text-gray-700 leading-relaxed">
            {post.content}
          </p>
          {post.image && (
              <div className="w-full h-96 mt-4 bg-gray-200 rounded-lg overflow-hidden">
                <img src={post.image} alt="Post Image" className="w-full h-full object-cover" />
              </div>
            )}
        </div>

        {/* إحصائيات المنشور */}
        <div className="flex items-center justify-between py-3 border-t border-b border-gray-100 mb-4">
          <div className="flex items-center gap-4 gap-reverse text-sm text-gray-500">
            <span>{post.likesCount} إعجاب</span>
            <span>{post.comments?.length || 0} تعليق</span>
          </div>
        </div>

        {/* أزرار التفاعل */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 gap-reverse">
            <Button
              variant={isLiked ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onLike?.(post.id)}
              icon={<Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />}
            >
              {isLiked ? 'أعجبني' : 'إعجاب'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              icon={<MessageCircle className="w-4 h-4" />}
            >
              تعليق
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              icon={<Share className="w-4 h-4" />}
            >
              مشاركة
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            icon={showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          >
            {showComments ? 'إخفاء التعليقات' : 'عرض التعليقات'}
          </Button>
        </div>

        {/* قسم التعليقات */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* إضافة تعليق جديد */}
              <div className="flex gap-2 gap-reverse">
                <input
                  type="text"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="اكتب تعليقك..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={!commentContent.trim()}
                  size="sm"
                >
                  إرسال
                </Button>
              </div>

              {/* قائمة التعليقات */}
              <div className="space-y-3">
                {post.comments?.map((comment) => (
                  <CommentComponent key={comment.id} comment={comment as Comment & { author: User }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}; 