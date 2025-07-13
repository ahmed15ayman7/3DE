'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export const QRCode: React.FC<QRCodeProps> = ({ 
  value, 
  size = 128, 
  className = '' 
}) => {
  // إنشاء QR Code بسيط باستخدام Canvas
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // مسح Canvas
    ctx.clearRect(0, 0, size, size);

    // رسم خلفية بيضاء
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // رسم إطار
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, size, size);

    // إنشاء نمط QR بسيط (نمط تجريبي)
    const cellSize = size / 25;
    ctx.fillStyle = '#000000';

    // رسم النمط الأساسي للـ QR
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // نمط تجريبي بسيط
        const shouldFill = (i + j) % 3 === 0 || 
                          (i === 0 || i === 24 || j === 0 || j === 24) ||
                          (i >= 8 && i <= 16 && j >= 8 && j <= 16);
        
        if (shouldFill) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
      }
    }

    // إضافة النص في الأسفل
    ctx.fillStyle = '#6b7280';
    ctx.font = `${Math.max(8, size / 20)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('QR Code', size / 2, size - 5);

  }, [value, size]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-block ${className}`}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-200 rounded-lg"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </motion.div>
  );
}; 