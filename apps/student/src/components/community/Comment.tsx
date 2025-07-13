'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@3de/ui';
import { Heart, Reply } from 'lucide-react';
import { Comment as CommentType, User } from '@3de/interfaces';

interface CommentProps {
  comment: CommentType & { author: User };
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  isLiked?: boolean;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onLike,
  onReply,
  isLiked = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex space-x-3 space-x-reverse"
    >
      <Avatar
        src={comment.author.avatar}
        alt={`${comment.author.firstName} ${comment.author.lastName}`}
        size="sm"
      />
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 text-sm">
              {comment.author.firstName} {comment.author.lastName}
            </h4>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('ar-SA', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed">
            {comment.content}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 space-x-reverse mt-2">
          <button
            onClick={() => onLike?.(comment.id)}
            className={`flex items-center space-x-1 space-x-reverse text-xs transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>0</span>
          </button>
          
          <button
            onClick={() => onReply?.(comment.id)}
            className="flex items-center space-x-1 space-x-reverse text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Reply className="w-3 h-3" />
            <span>رد</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}; 