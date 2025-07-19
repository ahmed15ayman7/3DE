'use client';

import { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({ src, title, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      if (onProgress) {
        onProgress(progress, video.duration);
      }

      // Mark as complete when 90% watched
      if (progress >= 90 && onComplete) {
        onComplete();
      }
    };

    const handleEnded = () => {
      if (onComplete) {
        onComplete();
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <video
        ref={videoRef}
        className="w-full rounded-lg shadow-lg"
        controls
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        <source src={src} type="video/ogg" />
        متصفحك لا يدعم تشغيل الفيديو.
      </video>
    </div>
  );
} 