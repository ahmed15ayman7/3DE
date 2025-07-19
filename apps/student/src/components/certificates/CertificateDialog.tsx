'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Modal, Input, Textarea, Button, Alert, Select } from '@3de/ui';
import { Award, User, MapPin, Phone, FileText } from 'lucide-react';
import { courseApi } from '@3de/apis';
import { useQuery } from '@tanstack/react-query';
const certificateSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  address: z.string().min(5, 'العنوان يجب أن يكون على الأقل 5 أحرف'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح'),
  notes: z.string().optional(),
  courseId: z.string().optional(),
  points: z.number().optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

interface CertificateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificateFormData) => Promise<void>;
  courseTitle: string;
  isLoading?: boolean;
  userId?: string;
}

export const CertificateDialog: React.FC<CertificateDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  courseTitle,
  isLoading = false,
  userId
}) => {
  let { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => courseApi.getByStudentId(userId||""),
    enabled: !!userId
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      courseId: '',
      notes: '',
      points: 0
    }
  });

  const handleFormSubmit = async (data: CertificateFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting certificate request:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      // title="طلب شهادة"
      style={{overflowY: 'auto'}}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* رأس النموذج */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-primary-main" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            طلب شهادة إتمام الدورة
          </h3>
        </div>

        {/* نموذج البيانات */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 ">
          <div className="grid grid-cols-2 gap-4">
          <div className="max-sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              الاسم الكامل
            </label>
            <Input
              {...register('name')}
              placeholder="أدخل اسمك الكامل"
              error={errors.name?.message}
            />
          </div>

          <div className="max-sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              العنوان
            </label>
            <Input
              {...register('address')}
              placeholder="أدخل عنوانك"
              error={errors.address?.message}
            />
          </div>

          <div className="max-sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              رقم الهاتف
            </label>
            <Input
              {...register('phone')}
              placeholder="أدخل رقم هاتفك"
              error={errors.phone?.message}
            />
          </div>
          <div className="max-sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              اختر الكورس
            </label>
            <Select
              {...register('courseId')}
              onChange={(e) => {
                register('courseId').onChange(e);
                let course = courses?.data.find((course) => course.id === e.target.value);
                if(course){
                  setValue('points', 0);
                }
              }}
              options={courses?.data.map((course) => ({
                label: course.title,
                value: course.id
              })) || []}
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              ملاحظات إضافية (اختياري)
            </label>
            <Textarea
              {...register('notes')}
              placeholder="أضف أي ملاحظات إضافية..."
              rows={1}
            />
          </div>
          </div>

          {/* معلومات مهمة */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2 gap-reverse">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-primary-main text-xs font-bold">!</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">معلومات مهمة:</p>
                <ul className="space-y-1 text-xs">
                  <li>• سيتم مراجعة طلبك من قبل الإدارة</li>
                  <li>• ستتلقى إشعاراً عند الموافقة على الشهادة</li>
                  <li>• قد تستغرق العملية من 3-5 أيام عمل</li>
                </ul>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 gap-reverse pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              fullWidth
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              disabled={isLoading}
              fullWidth
              icon={<Award className="w-4 h-4" />}
            >
              {isLoading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </Button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}; 