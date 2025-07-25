'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
}

export default function AudioPlayer({ src, title, onProgress, onComplete }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const progress = (audio.currentTime / audio.duration) * 100;
      
      if (onProgress) {
        onProgress(progress, audio.duration);
      }

      // Mark as complete when 90% listened
      if (progress >= 90 && onComplete) {
        onComplete();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) {
        onComplete();
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value);
    
    if (audio) {
      audio.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {title && (
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">{title}</h3>
      )}

      {/* Waveform Visualization Placeholder */}
      <div className="mb-6 h-20 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg flex items-center justify-center">
        <div className="flex items-end space-x-1 h-12">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-blue-500 rounded-t transition-all duration-200 ${
                (currentTime / duration) * 40 > i ? 'opacity-100' : 'opacity-30'
              }`}
              style={{
                height: `${Math.random() * 100}%`,
                minHeight: '4px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div 
          className="w-full h-2 bg-gray-300 rounded-full cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-200"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={() => skip(-10)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          disabled={isLoading}
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-0.5" />
          )}
        </button>

        <button
          onClick={() => skip(10)}
          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          disabled={isLoading}
        >
          <RotateCw size={20} />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
} 