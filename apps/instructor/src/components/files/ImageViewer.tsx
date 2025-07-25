'use client';

import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from 'lucide-react';

interface ImageViewerProps {
  src: string;
  title?: string;
  onComplete?: () => void;
}

export default function ImageViewer({ src, title, onComplete }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Mark as viewed/complete when image loads
    if (imageLoaded && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // Mark complete after 1 second of viewing

      return () => clearTimeout(timer);
    }
  }, [imageLoaded, onComplete]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-gray-50 rounded-lg overflow-hidden">
        {/* Controls */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              disabled={zoom <= 0.25}
            >
              <ZoomOut size={16} />
            </button>
            
            <span className="text-sm text-gray-600 min-w-16 text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              disabled={zoom >= 3}
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRotate}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RotateCw size={16} />
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Maximize2 size={16} />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Download size={16} />
            </button>
            
            <button
              onClick={handleReset}
              className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              إعادة تعيين
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div 
          className={`overflow-auto bg-gray-100 ${
            isFullscreen 
              ? 'fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center' 
              : 'h-96'
          }`}
          onClick={isFullscreen ? toggleFullscreen : undefined}
        >
          <div className="flex items-center justify-center h-full p-4">
            <img
              src={src}
              alt={title || 'Image'}
              onLoad={handleImageLoad}
              className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-zoom-in"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
              onClick={!isFullscreen ? toggleFullscreen : undefined}
            />
          </div>
        </div>

        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">جاري تحميل الصورة...</p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Close Button */}
      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
} 