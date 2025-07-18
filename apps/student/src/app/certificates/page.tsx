'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Alert, Skeleton } from '@3de/ui';
import { CertificateCard } from '../../components/certificates/CertificateCard';
import { CertificateDialog } from '../../components/certificates/CertificateDialog';
import { Award, Download, Share2 } from 'lucide-react';
import { Certificate } from '@3de/interfaces';
import { certificateApi } from '@3de/apis';
import { useAuth } from '@3de/auth';
import Layout from '../../components/layout/Layout';

export default function CertificatesPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  // جلب الشهادات الموافق عليها
  const { data: certificates, isLoading, error } = useQuery({
    queryKey: ['certificates', 'approved'],
    queryFn: async () => {
      let certificates = await certificateApi.getByStudent(user?.id || '');
      return certificates.data as Certificate[];
    }
  });

  const handleDownload = async (certificateId: string) => {
    try {
      // محاكاة تحميل الشهادة
      console.log('Downloading certificate:', certificateId);
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const handleShare = async (certificateId: string) => {
    try {
      const certificate = certificates?.find(c => c.id === certificateId);
      if (certificate?.url) {
        if (navigator.share) {
          await navigator.share({
            title: certificate.title,
            text: `شهادة إتمام الدورة: ${certificate.title}`,
            url: certificate.url
          });
        } else {
          await navigator.clipboard.writeText(certificate.url);
        }
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  const handleRequestCertificate = async (data: any) => {
    try {
      // محاكاة إرسال طلب الشهادة
      console.log('Requesting certificate:', data);
    } catch (error) {
      console.error('Error requesting certificate:', error);
      throw error;
    }
  };

  if (error) {
    return (
      <Layout>
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" title="خطأ في تحميل الشهادات">
          حدث خطأ أثناء تحميل الشهادات. يرجى المحاولة مرة أخرى.
        </Alert>
      </div>
      </Layout>
    );
  }

  return (
    <Layout>
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* رأس الصفحة */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            شهاداتي
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            عرض جميع الشهادات التي حصلت عليها من الدورات المكتملة
          </p>
        </div>

        {/* محتوى الشهادات */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-96 rounded-lg" />
            ))}
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <CertificateCard
                  certificate={certificate}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد شهادات بعد
            </h3>
            <p className="text-gray-600 mb-6">
              اكمل الدورات لتحصل على شهادات الإتمام
            </p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Award className="w-4 h-4 mr-2" />
              طلب شهادة
            </button>
          </motion.div>
        )}

        {/* إحصائيات سريعة */}
        {certificates && certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-blue-500 to-primary-main rounded-lg p-6 text-white text-center">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{certificates.length}</div>
              <div className="text-sm opacity-90">إجمالي الشهادات</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white text-center">
              <Download className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {certificates.filter(c => c.url).length}
              </div>
              <div className="text-sm opacity-90">شهادات قابلة للتحميل</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white text-center">
              <Share2 className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {certificates.reduce((sum, c) => sum + (c.points || 0), 0)}
              </div>
              <div className="text-sm opacity-90">إجمالي النقاط</div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* نموذج طلب شهادة */}
      <CertificateDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleRequestCertificate}
        courseTitle="دورة جديدة"
      />
    </div>
    </Layout>
  );
} 