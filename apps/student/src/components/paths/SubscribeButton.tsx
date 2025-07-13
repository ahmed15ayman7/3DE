'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Alert } from '@3de/ui';
import { BookOpen, Check, Users } from 'lucide-react';

interface SubscribeButtonProps {
  pathId: string;
  isSubscribed?: boolean;
  onSubscribe: (pathId: string) => Promise<void>;
  onUnsubscribe?: (pathId: string) => Promise<void>;
  className?: string;
}

export const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  pathId,
  isSubscribed = false,
  onSubscribe,
  onUnsubscribe,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onSubscribe(pathId);
    } catch (err) {
      setError('حدث خطأ أثناء الاشتراك في المسار');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!onUnsubscribe) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await onUnsubscribe(pathId);
    } catch (err) {
      setError('حدث خطأ أثناء إلغاء الاشتراك');
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
        {isSubscribed ? (
          <Button
            onClick={handleUnsubscribe}
            disabled={isLoading}
            variant="outline"
            icon={isLoading ? undefined : <Check className="w-4 h-4" />}
            loading={isLoading}
            fullWidth
          >
            {isLoading ? 'جاري الإلغاء...' : 'مشترك بالفعل'}
          </Button>
        ) : (
          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            variant="primary"
            icon={isLoading ? undefined : <BookOpen className="w-4 h-4" />}
            loading={isLoading}
            fullWidth
          >
            {isLoading ? 'جاري الاشتراك...' : 'اشترك في المسار'}
          </Button>
        )}
      </motion.div>
    </div>
  );
}; 