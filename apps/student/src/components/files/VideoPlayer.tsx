'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import { formatTime } from '@3de/auth';

interface VideoPlayerProps {
  src: string;
  lastWatched?: number; // بالثواني
  onProgress?: (progress: number,duration:number) => void;
  onComplete?: () => void;
}

export default function VideoPlayer({ src, lastWatched = 0, onProgress, onComplete }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const [showLastWatched, setShowLastWatched] = useState(true);
  const [duration, setDuration] = useState(0);
  // ⏪ ابدأ من آخر مشاهدة
  useEffect(() => {
    if (playerRef.current && lastWatched) {
      playerRef.current.seekTo(lastWatched, 'seconds');
    }
  }, [lastWatched]);


  return (
    <div className="space-y-3">

      <div className="aspect-video rounded-lg overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          src={src}
          controls
          width="100%"
          height="100%"
          onEnded={()=>{
            onComplete?.();
          }}
        />
      </div>

      {showLastWatched && lastWatched > 0 && (
        <p className="text-sm text-muted-foreground">
          بدأت من الدقيقة: <span className="font-medium">{formatTime(lastWatched)}</span>
        </p>
      )}
    </div>
  );
}
