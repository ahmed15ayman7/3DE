'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Badge } from '@3de/ui';
import { QRCode } from '../common/QRCode';
import { Award, ExternalLink, Copy, Download, Star } from 'lucide-react';
import { Certificate } from '@3de/interfaces';

interface CertificateCardProps {
  certificate: Certificate;
  onDownload?: (certificateId: string) => void;
  onShare?: (certificateId: string) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  certificate,
  onDownload,
  onShare
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (certificate.url) {
      try {
        await navigator.clipboard.writeText(certificate.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  };

  const handleVisitLink = () => {
    if (certificate.url) {
      window.open(certificate.url, '_blank');
    }
  };

  // const getLevelColor = (type: string) => {
  //   switch (type.toLowerCase()) {
  //     case 'beginner':
  //       return 'bg-green-100 text-green-800';
  //     case 'intermediate':
  //       return 'bg-yellow-100 text-yellow-800';
  //     case 'advanced':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="p-6 space-y-6">
        {/* رأس الشهادة */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {certificate.title}
          </h3>
          <p className="text-gray-600 mb-3">
            {certificate.name}
          </p>
          <div className="flex items-center justify-center gap-2 gap-reverse">
            <Badge variant="primary">
              {certificate.type}
            </Badge>
            <div className="flex items-center gap-1 gap-reverse text-yellow-600">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{certificate.points} نقطة</span>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="text-center">
            <QRCode
              value={certificate.url || `https://3de.com/certificates/${certificate.id}`}
              size={120}
              className="mb-3"
            />
            <p className="text-xs text-gray-500">
              امسح الرمز للتحقق من الشهادة
            </p>
          </div>
        </div>

        {/* تفاصيل الشهادة */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">تاريخ الإصدار:</span>
            <span className="font-medium">
              {new Date(certificate.earnedAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">رقم الشهادة:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {certificate.id.slice(-8).toUpperCase()}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">الحالة:</span>
            <Badge variant="success">
              موافق عليها
            </Badge>
          </div>
        </div>

        {/* أزرار الإجراءات */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          {/* زر نسخ الرابط */}
          <Button
            onClick={handleCopyLink}
            variant="outline"
            fullWidth
            icon={<Copy className="w-4 h-4" />}
          >
            {copied ? 'تم النسخ!' : 'نسخ رابط الشهادة'}
          </Button>

          {/* زر زيارة الرابط */}
          {certificate.url && (
            <Button
              onClick={handleVisitLink}
              variant="primary"
              fullWidth
              icon={<ExternalLink className="w-4 h-4" />}
            >
              زيارة الشهادة
            </Button>
          )}

          {/* زر التحميل */}
          {onDownload && (
            <Button
              onClick={() => onDownload(certificate.id)}
              variant="ghost"
              fullWidth
              icon={<Download className="w-4 h-4" />}
            >
              تحميل الشهادة
            </Button>
          )}

          {/* زر المشاركة */}
          {onShare && (
            <Button
              onClick={() => onShare(certificate.id)}
              variant="ghost"
              fullWidth
              icon={<ExternalLink className="w-4 h-4" />}
            >
              مشاركة الشهادة
            </Button>
          )}
        </div>

        {/* ملاحظات إضافية */}
        {certificate.notes && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <strong>ملاحظات:</strong> {certificate.notes}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}; 