'use client';

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
  lastWatched?: number;
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({
  src,
  lastWatched = 0,
  onProgress,
  onComplete
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (lastWatched) {
            videoRef.current!.currentTime = lastWatched;
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari
        videoRef.current.src = src;
      }
    }
  }, [src, lastWatched]);

  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        controls
        width="100%"
        height="100%"
        onEnded={() => onComplete?.()}
        onTimeUpdate={(e) => {
          const currentTime = (e.target as HTMLVideoElement).currentTime;
          const duration = (e.target as HTMLVideoElement).duration;
          onProgress?.(currentTime, duration);
        }}
      />
    </div>
  );
}
