'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Save,
  X,
  Clock,
  Award,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { Card, Button, Input, Textarea, Select, Switch } from '@3de/ui'

const quizFormSchema = z.object({
  title: z.string().min(1, 'عنوان الاختبار مطلوب'),
  description: z.string().min(1, 'وصف الاختبار مطلوب'),
  courseId: z.string().min(1, 'يجب اختيار كورس'),
  lessonId: z.string().optional(),
  timeLimit: z.number().min(1, 'الحد الزمني مطلوب').max(180, 'الحد الأقصى 180 دقيقة'),
  passingScore: z.number().min(1, 'درجة النجاح مطلوبة').max(100, 'الحد الأقصى 100%'),
  maxAttempts: z.number().min(1, 'عدد المحاولات مطلوب'),
  showResultsImmediately: z.boolean(),
  shuffleQuestions: z.boolean(),
  shuffleAnswers: z.boolean(),
  allowReview: z.boolean(),
})

type QuizFormData = z.infer<typeof quizFormSchema>

interface QuizFormProps {
  initialData?: Partial<QuizFormData>
  onSubmit: (data: QuizFormData) => void
  onCancel: () => void
  isLoading?: boolean
  submitLabel?: string
}

export default function QuizForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'حفظ الاختبار'
}: QuizFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      description: '',
      courseId: '',
      lessonId: '',
      timeLimit: 30,
      passingScore: 70,
      maxAttempts: 3,
      showResultsImmediately: true,
      shuffleQuestions: false,
      shuffleAnswers: false,
      allowReview: true,
      ...initialData,
    },
  })

  // Mock data for courses and lessons
  const mockCourses = [
    { value: '', label: 'اختر كورس...' },
    { value: '1', label: 'تطوير الويب بـ React' },
    { value: '2', label: 'JavaScript المتقدم' },
    { value: '3', label: 'Node.js و Express' },
  ]

  const mockLessons = [
    { value: '', label: 'اختر درس...' },
    { value: '1', label: 'مقدمة إلى React' },
    { value: '2', label: 'Components وProps' },
    { value: '3', label: 'State وEvent Handling' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 gap-reverse mb-6">
          <HelpCircle className="h-5 w-5 text-primary-main" />
          <h3 className="text-lg font-semibold text-gray-900">
            المعلومات الأساسية
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الاختبار *
            </label>
            <Input
              {...register('title')}
              placeholder="أدخل عنوان الاختبار"
              error={errors.title?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الاختبار *
            </label>
            <Textarea
              {...register('description')}
              placeholder="أدخل وصف مفصل للاختبار"
              rows={4}
              error={errors.description?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكورس *
              </label>
              <Select
                options={mockCourses}
                {...register('courseId')}
                error={errors.courseId?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الدرس (اختياري)
              </label>
              <Select
                options={mockLessons}
                {...register('lessonId')}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Quiz Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 gap-reverse mb-6">
          <Settings className="h-5 w-5 text-primary-main" />
          <h3 className="text-lg font-semibold text-gray-900">
            إعدادات الاختبار
          </h3>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline ml-1" />
                الحد الزمني (دقيقة) *
              </label>
              <Input
                type="number"
                min="1"
                max="180"
                {...register('timeLimit', { valueAsNumber: true })}
                placeholder="30"
                error={errors.timeLimit?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="h-4 w-4 inline ml-1" />
                درجة النجاح (%) *
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                {...register('passingScore', { valueAsNumber: true })}
                placeholder="70"
                error={errors.passingScore?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline ml-1" />
                عدد المحاولات المسموحة *
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                {...register('maxAttempts', { valueAsNumber: true })}
                placeholder="3"
                error={errors.maxAttempts?.message}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">
              إعدادات متقدمة
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      عرض النتائج فوراً
                    </label>
                    <p className="text-xs text-gray-500">
                      عرض النتائج للطلاب بعد انتهاء الاختبار مباشرة
                    </p>
                  </div>
                  <Switch
                    checked={watch('showResultsImmediately')}
                    onChange={(checked) => setValue('showResultsImmediately', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      خلط ترتيب الأسئلة
                    </label>
                    <p className="text-xs text-gray-500">
                      عرض الأسئلة بترتيب مختلف لكل طالب
                    </p>
                  </div>
                  <Switch
                    checked={watch('shuffleQuestions')}
                    onChange={(checked) => setValue('shuffleQuestions', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      خلط ترتيب الخيارات
                    </label>
                    <p className="text-xs text-gray-500">
                      عرض خيارات الأسئلة بترتيب مختلف
                    </p>
                  </div>
                  <Switch
                    checked={watch('shuffleAnswers')}
                    onChange={(checked) => setValue('shuffleAnswers', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      السماح بمراجعة الإجابات
                    </label>
                    <p className="text-xs text-gray-500">
                      السماح للطلاب بمراجعة إجاباتهم قبل التسليم
                    </p>
                  </div>
                  <Switch
                    checked={watch('allowReview')}
                    onChange={(checked) => setValue('allowReview', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 gap-reverse">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={isLoading}
        >
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isLoading}
          loading={isLoading}
        >
          <Save className="h-4 w-4 ml-2" />
          {submitLabel}
        </Button>
      </div>
    </form>
  )
} 