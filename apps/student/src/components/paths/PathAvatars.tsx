'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@3de/ui';
import { Users } from 'lucide-react';
import { User } from '@3de/interfaces';

interface PathAvatarsProps {
  users: User[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PathAvatars: React.FC<PathAvatarsProps> = ({
  users,
  maxDisplay = 5,
  size = 'md',
  className = ''
}) => {
  const displayUsers = users.slice(0, maxDisplay);
  const remainingCount = users.length - maxDisplay;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-12 h-12 text-sm';
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  const getOverlapClasses = () => {
    switch (size) {
      case 'sm':
        return '-mr-2';
      case 'lg':
        return '-mr-3';
      default:
        return '-mr-2.5';
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        {displayUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            className={`relative ${index > 0 ? getOverlapClasses() : ''}`}
            style={{ zIndex: displayUsers.length - index }}
          >
            <Avatar
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              size={size}
              className="border-2 border-white shadow-sm"
            />
          </motion.div>
        ))}
        
        {remainingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: displayUsers.length * 0.1 }}
            className={`relative ${getOverlapClasses()}`}
            style={{ zIndex: 0 }}
          >
            <div className={`
              ${getSizeClasses()} 
              bg-gray-100 border-2 border-white rounded-full 
              flex items-center justify-center text-gray-600 font-medium
              shadow-sm
            `}>
              +{remainingCount}
            </div>
          </motion.div>
        )}
      </div>
      
      {users.length > 0 && (
        <div className="mr-3 text-sm text-gray-600">
          {users.length} مشارك
        </div>
      )}
    </div>
  );
}; 