'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Alert } from '@3de/ui';
import { Users, Check, X } from 'lucide-react';

interface JoinButtonProps {
  communityId: string;
  isMember: boolean;
  onJoin: (communityId: string) => Promise<void>;
  onLeave: (communityId: string) => Promise<void>;
  className?: string;
}

export const JoinButton: React.FC<JoinButtonProps> = ({
  communityId,
  isMember,
  onJoin,
  onLeave,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onJoin(communityId);
    } catch (err) {
      setError('حدث خطأ أثناء الانضمام للمجتمع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeave = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onLeave(communityId);
    } catch (err) {
      setError('حدث خطأ أثناء مغادرة المجتمع');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Alert variant="error" title="خطأ">
            {error}
          </Alert>
        </motion.div>
      )}

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isMember ? (
          <Button
            onClick={handleLeave}
            disabled={isLoading}
            variant="outline"
            icon={isLoading ? undefined : <X className="w-4 h-4" />}
            loading={isLoading}
            fullWidth
          >
            {isLoading ? 'جاري المغادرة...' : 'مغادرة المجتمع'}
          </Button>
        ) : (
          <Button
            onClick={handleJoin}
            disabled={isLoading}
            variant="primary"
            icon={isLoading ? undefined : <Users className="w-4 h-4" />}
            loading={isLoading}
            fullWidth
          >
            {isLoading ? 'جاري الانضمام...' : 'انضمام للمجتمع'}
          </Button>
        )}
      </motion.div>
    </div>
  );
}; 