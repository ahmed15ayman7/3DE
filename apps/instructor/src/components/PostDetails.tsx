'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post, Comment, User } from '@3de/interfaces';
import { Avatar, Button, Modal } from '@3de/ui';
import { MessageCircle, Heart, Share2, MoreHorizontal, Edit, Trash2, ArrowLeft } from 'lucide-react';
import CommentBox from './CommentBox';

interface PostDetailsProps {
  post: Post & {
    author: User;
    comments: (Comment & { author?: User })[];
  };
  isOpen: boolean;
  onClose: () => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  currentUser?: User;
  isLiked?: boolean;
  className?: string;
}

const PostDetails: React.FC<PostDetailsProps> = ({
  post,
  isOpen,
  onClose,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  currentUser,
  isLiked = false,
  className = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike?.(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = (content: string) => {
    onComment?.(post.id, content);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const isAuthor = currentUser?.id === post.author.id;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-white rounded-lg shadow-xl max-w-4xl w-full h-[80vh] overflow-hidden ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={<ArrowLeft className="w-5 h-5" />}
            >
              {''}
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">تفاصيل المنشور</h2>
          </div>

          {/* Post Menu */}
          {isAuthor && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMenu(!showMenu)}
                icon={<MoreHorizontal className="w-4 h-4" />}
              >
                {''}
              </Button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
                >
                  <button
                    onClick={() => {
                      onEdit?.(post.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.(post.id);
                      setShowMenu(false);
                      onClose();
                    }}
                    className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Post Content */}
          <div className="flex-shrink-0 p-6 border-b border-gray-100">
            {/* Author Info */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar
                src={post.author.avatar}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                size="lg"
                fallback={`${post.author.firstName[0]}${post.author.lastName[0]}`}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Post Title and Content */}
            {post.title && (
              <h1 className="text-xl font-bold text-gray-900 mb-3">
                {post.title}
              </h1>
            )}
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Post Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-6">
                {/* Like Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center space-x-2 transition-colors ${
                    isLiked
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{post.likesCount || 0}</span>
                </motion.button>

                {/* Comment Count */}
                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="w-6 h-6" />
                  <span className="font-medium">{post.comments?.length || 0}</span>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => onShare?.(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="font-medium">مشاركة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                التعليقات ({post.comments?.length || 0})
              </h3>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-6">
                  {post.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3"
                    >
                      <Avatar
                        src={comment.author?.avatar}
                        alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'مستخدم مجهول'}
                        size="md"
                        fallback={comment.author ? `${comment.author.firstName[0]}${comment.author.lastName[0]}` : 'م'}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-lg px-4 py-3">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'مستخدم مجهول'}
                          </h4>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">لا توجد تعليقات بعد</p>
                  <p className="text-sm text-gray-400 mt-1">كن أول من يعلق على هذا المنشور</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50">
              <CommentBox
                onSubmit={handleComment}
                placeholder="اكتب تعليقاً..."
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PostDetails; 