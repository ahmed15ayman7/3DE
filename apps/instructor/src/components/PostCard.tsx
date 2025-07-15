'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post, Comment, User } from '@3de/interfaces';
import { Avatar, Button } from '@3de/ui';
import { MessageCircle, Heart, Share2, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import CommentBox from './CommentBox';

interface PostCardProps {
  post: Post & {
    author: User;
    comments: (Comment & { author?: User })[];
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  currentUser?: User;
  isLiked?: boolean;
  className?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  currentUser,
  isLiked = false,
  className = ''
}) => {
  const [showComments, setShowComments] = useState(false);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const isAuthor = currentUser?.id === post.author.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-custom border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={post.author.avatar}
              alt={`${post.author.firstName} ${post.author.lastName}`}
              size="md"
              fallback={`${post.author.firstName[0]}${post.author.lastName[0]}`}
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.author.firstName} {post.author.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </p>
            </div>
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
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
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
      </div>

      {/* Post Content */}
      <div className="p-4">
        {post.title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {post.title}
          </h2>
        )}
        <p className="text-gray-700 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
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
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{post.likesCount || 0}</span>
            </motion.button>

            {/* Comment Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">مشاركة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-100"
        >
          {/* Existing Comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Avatar
                    src={comment.author?.avatar}
                    alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'مستخدم مجهول'}
                    size="sm"
                    fallback={comment.author ? `${comment.author.firstName[0]}${comment.author.lastName[0]}` : 'م'}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'مستخدم مجهول'}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">
                        {comment.content}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Input */}
          <div className="p-4 border-t border-gray-100">
            <CommentBox
              onSubmit={handleComment}
              placeholder="اكتب تعليقاً..."
              currentUser={currentUser}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard; 