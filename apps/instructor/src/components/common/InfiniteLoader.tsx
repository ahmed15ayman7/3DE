'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@3de/ui';

interface InfiniteLoaderProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const InfiniteLoader: React.FC<InfiniteLoaderProps> = ({
  onLoadMore,
  hasMore,
  isLoading,
  children,
  className = ''
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    const element = loadingRef.current;
    if (element) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        root: null,
        rootMargin: '20px',
        threshold: 0.1,
      });

      observerRef.current.observe(element);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <motion.div
          ref={loadingRef}
          className="flex justify-center items-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 gap-reverse">
              <Spinner size="sm" />
              <span className="text-gray-600">جاري التحميل...</span>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              اسحب للتحميل المزيد
            </div>
          )}
        </motion.div>
      )}
      
      {!hasMore && (
        <motion.div
          className="text-center py-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          تم الوصول لنهاية المحتوى
        </motion.div>
      )}
    </div>
  );
}; 