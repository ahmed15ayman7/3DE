'use client';
import { FileType, File } from '@3de/interfaces';
import VideoPlayer from './VideoPlayer';
import PDFViewer from './PDFViewer';
import AudioPlayer from './AudioPlayer';
import ImageViewer from './ImageViewer';

interface FileViewerProps {
  file:File;
  onProgress?: (progress: number,duration:number) => void;
  onComplete?: () => void;
}

export default function FileViewer({ file, onProgress, onComplete }: FileViewerProps) {
  const renderFileViewer = () => {
    switch (file.type) {
      case "VIDEO" as FileType:
        return (
          <VideoPlayer
            src={file.url}
            lastWatched={file.lastWatched ? file.lastWatched.getTime() : 0}
            onProgress={onProgress}
            onComplete={onComplete}
          />
          
        );
      
      case "PDF" as FileType:
        return (
          <PDFViewer
            src={file.url}
            title={file.name}
          />
        );
      
      case "AUDIO" as FileType:
        return (
          <AudioPlayer
            src={file.url}
            title={file.name}
            onProgress={onProgress}
            onComplete={onComplete}
          />
        );
      
      case "IMAGE" as FileType:
        return (
          <ImageViewer
            src={file.url}
            title={file.name}
            alt={file.name}
          />
        );
      
      case "DOCUMENT" as FileType:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{file.name}</h3>
              <p className="text-gray-600 mb-4">مستند قابل للتحميل</p>
              <a
                href={file.url}
                download={file.name}
                className="inline-flex items-center px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                تحميل الملف
              </a>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{file.name}</h3>
              <p className="text-gray-600 mb-4">نوع الملف غير مدعوم</p>
              <a
                href={file.url}
                download={file.name}
                className="inline-flex items-center px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                تحميل الملف
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderFileViewer()}
    </div>
  );
} 