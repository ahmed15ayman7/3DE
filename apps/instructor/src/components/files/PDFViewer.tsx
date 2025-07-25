'use client';

import { useState, useEffect } from 'react';
import { Download, ExternalLink, FileText, ZoomIn, ZoomOut } from 'lucide-react';

interface PDFViewerProps {
  src: string;
  title?: string;
  onProgress?: (progress: number, duration: number) => void;
  onComplete?: () => void;
}

export default function PDFViewer({ src, title, onProgress, onComplete }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewProgress, setViewProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (viewProgress < 100) {
        const newProgress = viewProgress + 10;
        setViewProgress(newProgress);
        
        if (onProgress) {
          onProgress(newProgress, 100);
        }

        if (newProgress >= 90 && onComplete) {
          onComplete();
        }
      }
    }, 2000); // Simulate reading progress

    return () => clearInterval(timer);
  }, [viewProgress, onProgress, onComplete]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const openInNewTab = () => {
    window.open(src, '_blank');
  };

  if (error) {
    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        )}
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">خطأ في تحميل الملف</h3>
          <p className="text-red-700 mb-4">لا يمكن عرض ملف PDF في المتصفح</p>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              تحميل الملف
            </button>
            
            <button
              onClick={openInNewTab}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              فتح في تبويب جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">ملف PDF</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="تحميل"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={openInNewTab}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="فتح في تبويب جديد"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* PDF Embed */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">جاري تحميل المستند...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={`${src}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-96 border-0"
            onLoad={handleLoad}
            onError={handleError}
            title={title || 'PDF Document'}
          />
        </div>

        {/* Progress Bar */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>تقدم القراءة</span>
            <span>{viewProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${viewProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 