'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input, Textarea, Button, Select } from '@3de/ui';

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points: number;
  options?: string[];
  correctAnswer: string | number;
  image?: string;
}

interface QuizFormData {
  title: string;
  description: string;
  courseId: string;
  duration: number;
  passingScore: number;
  isScheduled: boolean;
  scheduledDate?: string;
  questions: Question[];
}

const NewQuizPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    courseId: '',
    duration: 60,
    passingScore: 70,
    isScheduled: false,
    scheduledDate: '',
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    text: '',
    type: 'multiple_choice',
    points: 1,
    options: ['', '', '', ''],
    correctAnswer: '',
    image: '',
  });

  // Mock courses data
  const courses = [
    { value: '1', label: 'الرياضيات المتقدمة' },
    { value: '2', label: 'الفيزياء العامة' },
    { value: '3', label: 'البرمجة للمبتدئين' },
    { value: '4', label: 'الكيمياء الأساسية' },
  ];

  const handleBasicInfoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (field: string, value: any) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) return;

    const newQuestion: Question = {
      ...currentQuestion,
      id: Date.now().toString(),
    };

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset current question
    setCurrentQuestion({
      id: '',
      text: '',
      type: 'multiple_choice',
      points: 1,
      options: ['', '', '', ''],
      correctAnswer: '',
      image: '',
    });
  };

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSubmit = async () => {
    try {
      // هنا سيتم إرسال البيانات إلى API
      console.log('Quiz Data:', formData);
      
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">المعلومات الأساسية</h2>
            
            <Input
              label="عنوان الاختبار *"
              value={formData.title}
              onChange={(e) => handleBasicInfoChange('title', e.target.value)}
              placeholder="أدخل عنوان الاختبار"
            />

            <Textarea
              label="وصف الاختبار"
              value={formData.description}
              onChange={(e) => handleBasicInfoChange('description', e.target.value)}
              placeholder="أدخل وصف مختصر للاختبار"
              rows={3}
            />

            <Select
              label="الكورس *"
              options={courses}
              value={formData.courseId}
              onChange={(e) => handleBasicInfoChange('courseId', e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="مدة الاختبار (بالدقائق) *"
                value={formData.duration}
                onChange={(e) => handleBasicInfoChange('duration', parseInt(e.target.value))}
                min="1"
              />

              <Input
                type="number"
                label="درجة النجاح (%) *"
                value={formData.passingScore}
                onChange={(e) => handleBasicInfoChange('passingScore', parseInt(e.target.value))}
                min="1"
                max="100"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isScheduled"
                checked={formData.isScheduled}
                onChange={(e) => handleBasicInfoChange('isScheduled', e.target.checked)}
                className="w-4 h-4 text-primary-main rounded border-gray-300 focus:ring-primary-main"
              />
              <label htmlFor="isScheduled" className="text-sm font-medium text-gray-700">
                جدولة الاختبار لتاريخ محدد
              </label>
            </div>

            {formData.isScheduled && (
              <Input
                type="datetime-local"
                label="تاريخ ووقت الاختبار"
                value={formData.scheduledDate}
                onChange={(e) => handleBasicInfoChange('scheduledDate', e.target.value)}
              />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">الأسئلة</h2>
              <span className="text-sm text-gray-600">
                {formData.questions.length} سؤال مضاف
              </span>
            </div>

            {/* إضافة سؤال جديد */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">إضافة سؤال جديد</h3>
              
              <div className="space-y-4">
                <Select
                  label="نوع السؤال"
                  options={[
                    { value: 'multiple_choice', label: 'اختيار من متعدد' },
                    { value: 'true_false', label: 'صح أم خطأ' },
                    { value: 'short_answer', label: 'إجابة قصيرة' },
                    { value: 'essay', label: 'مقالي' },
                  ]}
                  value={currentQuestion.type}
                  onChange={(e) => handleQuestionChange('type', e.target.value)}
                />

                <Textarea
                  label="نص السؤال *"
                  value={currentQuestion.text}
                  onChange={(e) => handleQuestionChange('text', e.target.value)}
                  placeholder="أدخل نص السؤال"
                  rows={3}
                />

                <Input
                  type="number"
                  label="النقاط"
                  value={currentQuestion.points}
                  onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                  min="1"
                />

                {/* خيارات للأسئلة متعددة الخيارات */}
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">الخيارات</label>
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={index}
                          checked={currentQuestion.correctAnswer === index}
                          onChange={() => handleQuestionChange('correctAnswer', index)}
                          className="w-4 h-4 text-primary-main"
                        />
                        <Input
                          placeholder={`الخيار ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* خيارات لأسئلة صح/خطأ */}
                {currentQuestion.type === 'true_false' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">الإجابة الصحيحة</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tfAnswer"
                          value="true"
                          checked={currentQuestion.correctAnswer === 'true'}
                          onChange={() => handleQuestionChange('correctAnswer', 'true')}
                          className="w-4 h-4 text-primary-main mr-2"
                        />
                        صح
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="tfAnswer"
                          value="false"
                          checked={currentQuestion.correctAnswer === 'false'}
                          onChange={() => handleQuestionChange('correctAnswer', 'false')}
                          className="w-4 h-4 text-primary-main mr-2"
                        />
                        خطأ
                      </label>
                    </div>
                  </div>
                )}

                {/* إجابة للأسئلة القصيرة */}
                {currentQuestion.type === 'short_answer' && (
                  <Input
                    label="الإجابة الصحيحة"
                    value={currentQuestion.correctAnswer as string}
                    onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                    placeholder="أدخل الإجابة الصحيحة"
                  />
                )}

                <Button
                  onClick={addQuestion}
                  disabled={!currentQuestion.text.trim()}
                  className="w-full"
                >
                  إضافة السؤال
                </Button>
              </div>
            </div>

            {/* قائمة الأسئلة المضافة */}
            {formData.questions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">الأسئلة المضافة</h3>
                {formData.questions.map((question, index) => (
                  <div key={question.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {index + 1}. {question.text}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          النوع: {question.type === 'multiple_choice' ? 'اختيار من متعدد' :
                                 question.type === 'true_false' ? 'صح أم خطأ' :
                                 question.type === 'short_answer' ? 'إجابة قصيرة' : 'مقالي'}
                          {' '}| النقاط: {question.points}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">مراجعة الاختبار</h2>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">تفاصيل الاختبار</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">الكورس</p>
                  <p className="font-medium">
                    {courses.find(c => c.value === formData.courseId)?.label || 'غير محدد'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">المدة</p>
                  <p className="font-medium">{formData.duration} دقيقة</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">درجة النجاح</p>
                  <p className="font-medium">{formData.passingScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">عدد الأسئلة</p>
                  <p className="font-medium">{formData.questions.length} سؤال</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">إجمالي النقاط</p>
                  <p className="font-medium">
                    {formData.questions.reduce((sum, q) => sum + q.points, 0)} نقطة
                  </p>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">الوصف</p>
                  <p className="font-medium">{formData.description}</p>
                </div>
              )}

              {formData.isScheduled && formData.scheduledDate && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">موجدول لـ</p>
                  <p className="font-medium">
                    {new Date(formData.scheduledDate).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ تأكد من مراجعة جميع البيانات قبل إنشاء الاختبار. لن يمكن تعديل بعض الإعدادات بعد البدء.
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
        return formData.title.trim() && formData.courseId;
      case 2:
        return formData.questions.length > 0;
      case 3:
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
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← العودة
          </button>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء اختبار جديد</h1>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center space-x-8">
          {[
            { step: 1, title: 'المعلومات الأساسية' },
            { step: 2, title: 'الأسئلة' },
            { step: 3, title: 'مراجعة وإنشاء' },
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
            onClick={() => router.push('/quizzes')}
          >
            إلغاء
          </Button>

          {currentStep < 3 ? (
            <Button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceedToNextStep()}
            >
              التالي
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceedToNextStep()}
            >
              إنشاء الاختبار
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewQuizPage; 