'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input, Textarea, Button, Select, Card } from '@3de/ui';
import { useCreateCourse } from '../../../hooks/useInstructorQueries';

interface CourseFormData {
  title: string;
  description: string;
  level: string;
  duration: string;
  price: number;
  category: string;
  prerequisites: string[];
  learningOutcomes: string[];
  image: string;
  maxStudents: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published';
}

const NewCoursePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    level: 'مبتدئ',
    duration: '',
    price: 0,
    category: '',
    prerequisites: [''],
    learningOutcomes: [''],
    image: '📚',
    maxStudents: 50,
    startDate: '',
    endDate: '',
    status: 'draft'
  });

  const createCourseMutation = useCreateCourse();

  const categories = [
    { value: 'برمجة', label: 'البرمجة' },
    { value: 'تصميم', label: 'التصميم' },
    { value: 'تسويق', label: 'التسويق' },
    { value: 'أعمال', label: 'إدارة الأعمال' },
    { value: 'علوم', label: 'العلوم' },
    { value: 'لغات', label: 'اللغات' }
  ];

  const levels = [
    { value: 'مبتدئ', label: 'مبتدئ' },
    { value: 'متوسط', label: 'متوسط' },
    { value: 'متقدم', label: 'متقدم' }
  ];

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: 'prerequisites' | 'learningOutcomes', index: number, value: string) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const addArrayItem = (field: 'prerequisites' | 'learningOutcomes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'prerequisites' | 'learningOutcomes', index: number) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      const courseData = {
        ...formData,
        status: isDraft ? 'draft' as const : 'published' as const,
        prerequisites: formData.prerequisites.filter(p => p.trim() !== ''),
        learningOutcomes: formData.learningOutcomes.filter(o => o.trim() !== '')
      };

      await createCourseMutation.mutateAsync({ courseData, instructorId: '1' });
      router.push('/courses');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">المعلومات الأساسية</h2>
            
            <Input
              label="عنوان الكورس *"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="أدخل عنوان الكورس"
            />

            <Textarea
              label="وصف الكورس *"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="أدخل وصف شامل للكورس"
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="الفئة *"
                options={categories}
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />

              <Select
                label="المستوى *"
                options={levels}
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="المدة *"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="مثال: 8 أسابيع"
              />

              <Input
                type="number"
                label="السعر (ريال) *"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                min="0"
              />

              <Input
                type="number"
                label="الحد الأقصى للطلاب"
                value={formData.maxStudents}
                onChange={(e) => handleInputChange('maxStudents', parseInt(e.target.value) || 50)}
                min="1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="date"
                label="تاريخ البداية"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />

              <Input
                type="date"
                label="تاريخ النهاية"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أيقونة الكورس
              </label>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{formData.image}</div>
                <Input
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="أدخل emoji أو رمز"
                  className="w-32"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">المتطلبات المسبقة</h2>
            
            <div className="space-y-4">
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    value={prerequisite}
                    onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                    placeholder={`متطلب ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('prerequisites', index)}
                    >
                      حذف
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('prerequisites')}
                className="w-full"
              >
                + إضافة متطلب آخر
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">أهداف التعلم</h2>
            
            <div className="space-y-4">
              {formData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Textarea
                    value={outcome}
                    onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                    placeholder={`هدف التعلم ${index + 1}`}
                    rows={2}
                    className="flex-1"
                  />
                  {formData.learningOutcomes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem('learningOutcomes', index)}
                    >
                      حذف
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem('learningOutcomes')}
                className="w-full"
              >
                + إضافة هدف آخر
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">مراجعة الكورس</h2>
            
            <Card padding="lg">
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-6xl">{formData.image}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title}</h3>
                  <p className="text-gray-600 mb-4">{formData.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📚 {formData.category}</span>
                    <span>📊 {formData.level}</span>
                    <span>⏱️ {formData.duration}</span>
                    <span>💰 {formData.price} ريال</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">المتطلبات المسبقة</h4>
                  <ul className="space-y-1">
                    {formData.prerequisites.filter(p => p.trim() !== '').map((prerequisite, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {prerequisite}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">أهداف التعلم</h4>
                  <ul className="space-y-1">
                    {formData.learningOutcomes.filter(o => o.trim() !== '').map((outcome, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formData.maxStudents}</div>
                    <div className="text-sm text-gray-600">الحد الأقصى للطلاب</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formData.startDate || 'غير محدد'}</div>
                    <div className="text-sm text-gray-600">تاريخ البداية</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formData.endDate || 'غير محدد'}</div>
                    <div className="text-sm text-gray-600">تاريخ النهاية</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{formData.price} ريال</div>
                    <div className="text-sm text-gray-600">السعر</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ تأكد من مراجعة جميع البيانات قبل إنشاء الكورس. يمكنك حفظ الكورس كمسودة للعمل عليه لاحقاً.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.description.trim() && 
               formData.category && formData.level && formData.duration.trim();
      case 2:
        return formData.prerequisites.some(p => p.trim() !== '');
      case 3:
        return formData.learningOutcomes.some(o => o.trim() !== '');
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="p-2"
          >
            ← العودة
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء كورس جديد</h1>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center space-x-8">
          {[
            { step: 1, title: 'المعلومات الأساسية' },
            { step: 2, title: 'المتطلبات المسبقة' },
            { step: 3, title: 'أهداف التعلم' },
            { step: 4, title: 'مراجعة وإنشاء' },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center space-x-2 ${
                currentStep >= item.step ? 'text-primary-main' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= item.step
                    ? 'bg-primary-main text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {item.step}
              </div>
              <span className="text-sm font-medium">{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-custom border border-gray-200 p-8"
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          السابق
        </Button>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/courses')}
          >
            إلغاء
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceedToNextStep()}
            >
              التالي
            </Button>
          ) : (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={!canProceedToNextStep()}
                loading={createCourseMutation.isPending}
              >
                حفظ كمسودة
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={!canProceedToNextStep()}
                loading={createCourseMutation.isPending}
              >
                نشر الكورس
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCoursePage; 