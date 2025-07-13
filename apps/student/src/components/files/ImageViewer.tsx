'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ZoomIn, ZoomOut, RotateCw, X } from 'lucide-react';
import { Button } from '@3de/ui';

interface ImageViewerProps {
  src: string;
  title: string;
  alt?: string;
}

export default function ImageViewer({ src, title, alt }: ImageViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = title;
    link.click();
  };

  const resetView = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <>
      {/* Thumbnail */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <img
          src={src}
          alt={alt || title}
          className="w-full h-48 object-cover rounded-lg shadow-sm"
        />
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-600 min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={scale >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetView}
                  >
                    إعادة تعيين
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="overflow-auto max-h-[80vh]">
                <img
                  src={src}
                  alt={alt || title}
                  className="w-full h-auto"
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 