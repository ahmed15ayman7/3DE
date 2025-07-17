'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button, Progress } from '@3de/ui';

interface AudioPlayerProps {
  src: string;
  title: string;
  onProgress?: (progress: number,duration:number) => void;
  onComplete?: () => void;
}

export default function AudioPlayer({ src, title, onProgress, onComplete }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const progress = (audio.currentTime / audio.duration) * 100;
      onProgress?.(progress,audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = value;
    setVolume(value);
    if (value === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress
          value={(currentTime / duration) * 100}
          onChange={handleSeek}
          className="h-2 cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={skipBackward}
          className="text-gray-600 hover:text-gray-900"
        >
          <SkipBack className="w-5 h-5" />
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={togglePlay}
          className="w-12 h-12 rounded-full"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={skipForward}
          className="text-gray-600 hover:text-gray-900"
        >
          <SkipForward className="w-5 h-5" />
        </Button>
      </div>

      {/* Volume and Speed Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="text-gray-600 hover:text-gray-900"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <div className="w-24">
            <Progress
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="h-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">السرعة:</span>
          <div className="flex gap-1">
            {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
              <Button
                key={rate}
                variant={playbackRate === rate ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePlaybackRateChange(rate)}
                className="text-xs px-2 py-1"
              >
                {rate}x
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 