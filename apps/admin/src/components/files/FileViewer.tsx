'use client';

import { useState, useEffect } from 'react';
import { File } from '@3de/interfaces';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import ImageViewer from './ImageViewer';
import PDFViewer from './PDFViewer';

interface FileViewerProps {
  file: File;
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
}

export default function FileViewer({ file, onProgress, onComplete }: FileViewerProps) {
  const [progress, setProgress] = useState(0);

  const handleProgress = (prog: number, duration: number = 0) => {
    setProgress(prog);
    if (onProgress) {
      onProgress(prog, duration);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  useEffect(() => {
    // Reset progress when file changes
    setProgress(0);
  }, [file.id]);

  const renderFileContent = () => {
    switch (file.type) {
      case 'VIDEO':
        return (
          <VideoPlayer
            src={file.url}
            title={file.name}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />
        );
      case 'AUDIO':
        return (
          <AudioPlayer
            src={file.url}
            title={file.name}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />
        );
      case 'IMAGE':
        return (
          <ImageViewer
            src={file.url}
            title={file.name}
            onComplete={handleComplete}
          />
        );
      case 'PDF':
        return (
          <PDFViewer
            src={file.url}
            title={file.name}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />
        );
      case 'DOCUMENT':
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{file.name}</h3>
            <p className="text-gray-600 mb-4">ملف مستند</p>
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleComplete}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              تحميل الملف
            </a>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{file.name}</h3>
            <p className="text-gray-600 mb-4">نوع ملف غير مدعوم</p>
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleComplete}
            >
              فتح الملف
            </a>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderFileContent()}
    </div>
  );
} 