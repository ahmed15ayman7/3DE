'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@3de/interfaces';
import { Avatar, Button } from '@3de/ui';
import { Send } from 'lucide-react';

interface CommentBoxProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  currentUser?: User;
  className?: string;
  disabled?: boolean;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  onSubmit,
  placeholder = "اكتب تعليقاً...",
  currentUser,
  className = '',
  disabled = false
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${className}`}
    >
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        {/* Avatar */}
        {currentUser && (
          <Avatar
            src={currentUser.avatar}
            alt={`${currentUser.firstName} ${currentUser.lastName}`}
            size="sm"
            fallback={`${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`}
          />
        )}

        {/* Comment Input */}
        <div className="flex-1">
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isSubmitting}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={2}
              maxLength={500}
            />
            
            {/* Character count */}
            {content.length > 0 && (
              <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                {content.length}/500
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!content.trim() || isSubmitting}
              loading={isSubmitting}
              icon={<Send className="w-4 h-4" />}
              iconPosition="right"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default CommentBox; 