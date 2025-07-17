'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  FileText,
  Image as ImageIcon,
  Music,
  File,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { Card, Button, Progress, Badge } from '@3de/ui'
import { FileType,Lesson ,File as LessonFile } from '@3de/interfaces'





interface LessonFileViewerProps {
  file: LessonFile | null
  lesson: Lesson | null
}

const VideoPlayer = ({ file }: { file: LessonFile }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime
      const total = videoRef.current.duration
      setCurrentTime(current)
      setProgress((current / total) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isYouTube = file.url.includes('youtube.com') || file.url.includes('youtu.be')

  if (isYouTube) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
        <iframe
          src={file.url}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={file.url} type="video/mp4" />
        المتصفح لا يدعم تشغيل الفيديو
      </video>

      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="flex items-center gap-2 gap-reverse">
            <span className="text-white text-sm min-w-0">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1">
              <Progress
                value={progress}
                className="h-1 bg-white/20"
              />
            </div>
            <span className="text-white text-sm min-w-0">
              {formatTime(duration)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 gap-reverse">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

              <div className="flex items-center gap-2 gap-reverse">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16"
                />
              </div>
            </div>

            <Button
              onClick={() => videoRef.current?.requestFullscreen()}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PDFViewer = ({ file }: { file: LessonFile }) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200">
      <iframe
        src={`${file.url}#toolbar=1&navpanes=1&scrollbar=1`}
        className="w-full h-full min-h-[600px]"
        title={file.name}
      />
    </div>
  )
}

const ImageViewer = ({ file }: { file: LessonFile }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const [scale, setScale] = useState(1)

  return (
    <div className="relative">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 gap-reverse">
          <Button
            onClick={() => setScale(scale * 1.2)}
            variant="outline"
            size="sm"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setScale(scale / 1.2)}
            variant="outline"
            size="sm"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setScale(1)}
            variant="outline"
            size="sm"
          >
            إعادة تعيين
          </Button>
        </div>
      </div>

      <div className="flex justify-center overflow-auto max-h-[600px]">
        <img
          src={file.url}
          alt={file.name}
          className="rounded-lg shadow-lg transition-transform duration-200"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </div>
  )
}

const AudioPlayer = ({ file }: { file: LessonFile }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const total = audioRef.current.duration
      setCurrentTime(current)
      setProgress((current / total) * 100)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-8">
      <div className="text-center mb-6">
        <Music className="h-16 w-16 text-purple-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {file.name}
        </h3>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={file.url} />
        المتصفح لا يدعم تشغيل الصوت
      </audio>

      <div className="space-y-4">
        <div className="flex items-center justify-center">
          <Button
            onClick={togglePlay}
            variant="primary"
            size="lg"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-3 gap-reverse">
          <span className="text-sm text-gray-600 min-w-0">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1">
            <Progress value={progress} className="h-2" />
          </div>
          <span className="text-sm text-gray-600 min-w-0">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </Card>
  )
}

const DocumentViewer = ({ file }: { file: LessonFile }) => {
  return (
    <Card className="p-8 text-center">
      <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {file.name}
      </h3>
      <p className="text-gray-600 mb-6">
        اضغط للتحميل أو العرض في نافذة جديدة
      </p>
      <div className="flex items-center justify-center gap-3 gap-reverse">
        <Button
          onClick={() => window.open(file.url, '_blank')}
          variant="primary"
        >
          <ExternalLink className="h-4 w-4 ml-2" />
          فتح في نافذة جديدة
        </Button>
        <Button
          onClick={() => {
            const link = document.createElement('a')
            link.href = file.url
            link.download = file.name
            link.click()
          }}
          variant="outline"
        >
          <Download className="h-4 w-4 ml-2" />
          تحميل
        </Button>
      </div>
    </Card>
  )
}

export default function LessonFileViewer({ file, lesson }: LessonFileViewerProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (file) {
      setLoading(true)
      // Simulate loading time
      const timer = setTimeout(() => setLoading(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [file])

  if (!file && !lesson) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            اختر درساً لعرض المحتوى
          </h3>
          <p className="text-gray-600">
            حدد درساً من القائمة لعرض الملفات والمحتوى
          </p>
        </div>
      </Card>
    )
  }

  if (!file && lesson) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {lesson.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {lesson.content}
          </p>
          <p className="text-sm text-gray-500">
            اختر ملفاً من قائمة الدرس لعرضه هنا
          </p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-main mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل الملف...</p>
        </div>
      </Card>
    )
  }

  const renderFileContent = () => {
    if (!file) return null

    switch (file.type) {
      case 'VIDEO':
        return <VideoPlayer file={file} />
      case 'PDF':
        return <PDFViewer file={file} />
      case 'IMAGE':
        return <ImageViewer file={file} />
      case 'AUDIO':
        return <AudioPlayer file={file} />
      case 'DOCUMENT':
      default:
        return <DocumentViewer file={file} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* File Header */}
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 gap-reverse">
            <div className="p-2 bg-primary-main rounded-lg">
              {file?.type === 'VIDEO' && <Play className="h-5 w-5 text-white" />}
              {file?.type === 'PDF' && <FileText className="h-5 w-5 text-white" />}
              {file?.type === 'IMAGE' && <ImageIcon className="h-5 w-5 text-white" />}
              {file?.type === 'AUDIO' && <Music className="h-5 w-5 text-white" />}
              {file?.type === 'DOCUMENT' && <File className="h-5 w-5 text-white" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {file?.name}
              </h3>
              <p className="text-sm text-gray-500">
                من درس: {lesson?.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 gap-reverse">
            {file?.isCompleted ? (
              <Badge variant="success" className="flex items-center gap-1 gap-reverse">
                <CheckCircle className="h-3 w-3" />
                <span>مكتمل</span>
              </Badge>
            ) : (
              <Badge variant="warning" className="flex items-center gap-1 gap-reverse">
                <Clock className="h-3 w-3" />
                <span>قيد المشاهدة</span>
              </Badge>
            )}

            <Button
              onClick={() => window.open(file?.url, '_blank')}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 ml-2" />
              تحميل
            </Button>
          </div>
        </div>

        {file?.lastWatched && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              آخر مشاهدة: {new Date(file.lastWatched).toLocaleString('ar')}
            </p>
          </div>
        )}
      </Card>

      {/* File Content */}
      <Card className="flex-1 p-6">
        {renderFileContent()}
      </Card>
    </div>
  )
} 