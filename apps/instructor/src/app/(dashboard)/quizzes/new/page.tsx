'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  Clock,
  Award,
  Settings,
  Upload,
  X,
  Check,
  AlertCircle,
  FileText,
  Image,
  RadioIcon,
  CheckSquare,
} from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Button, Input, Textarea, Select, Badge, Tabs, Switch } from '@3de/ui'
import QuizForm from '../../../../components/QuizForm'
import QuestionCard from '../../../../components/QuestionCard'

// Validation schema
const quizSchema = z.object({
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
  questions: z.array(z.object({
    id: z.string().optional(),
    text: z.string().min(1, 'نص السؤال مطلوب'),
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'ESSAY', 'FILL_BLANK']),
    points: z.number().min(1, 'النقاط مطلوبة'),
    image: z.string().optional(),
    explanation: z.string().optional(),
    options: z.array(z.object({
      id: z.string().optional(),
      text: z.string().min(1, 'نص الخيار مطلوب'),
      isCorrect: z.boolean(),
    })).min(2, 'يجب إضافة خيارين على الأقل'),
  })).min(1, 'يجب إضافة سؤال واحد على الأقل'),
})

type QuizFormData = z.infer<typeof quizSchema>

const QUIZ_STEPS = [
  { id: 'basic', title: 'المعلومات الأساسية', icon: FileText },
  { id: 'settings', title: 'إعدادات الاختبار', icon: Settings },
  { id: 'questions', title: 'إضافة الأسئلة', icon: CheckSquare },
  { id: 'review', title: 'مراجعة وحفظ', icon: Eye },
]

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'اختيار من متعدد', icon: RadioIcon },
  { value: 'TRUE_FALSE', label: 'صح أم خطأ', icon: CheckSquare },
  { value: 'ESSAY', label: 'سؤال مقالي', icon: FileText },
  { value: 'FILL_BLANK', label: 'اكمل الفراغ', icon: FileText },
]

export default function NewQuizPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
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
      questions: [],
    },
  })

  const { fields: questions, append: addQuestion, remove: removeQuestion, update: updateQuestion } = useFieldArray({
    control,
    name: 'questions',
  })

  const watchedQuestions = watch('questions')
  const totalPoints = watchedQuestions.reduce((sum, q) => sum + (q.points || 0), 0)

  // Mock data for courses and lessons
  const mockCourses = [
    { value: '1', label: 'تطوير الويب بـ React' },
    { value: '2', label: 'JavaScript المتقدم' },
    { value: '3', label: 'Node.js و Express' },
  ]

  const mockLessons = [
    { value: '1', label: 'مقدمة إلى React' },
    { value: '2', label: 'Components وProps' },
    { value: '3', label: 'State وEvent Handling' },
  ]

  const handleNext = async () => {
    const stepFields = getStepFields(currentStep)
    const isValid = await trigger(stepFields)
    
    if (isValid && currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepFields = (step: number) => {
    switch (step) {
      case 0:
        return ['title', 'description', 'courseId', 'lessonId'] as const
      case 1:
        return ['timeLimit', 'passingScore', 'maxAttempts'] as const
      case 2:
        return ['questions'] as const
      default:
        return []
    }
  }

  const addNewQuestion = () => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      text: '',
      type: 'MULTIPLE_CHOICE' as const,
      points: 1,
      image: '',
      explanation: '',
      options: [
        { id: `opt-1-${Date.now()}`, text: '', isCorrect: true },
        { id: `opt-2-${Date.now()}`, text: '', isCorrect: false },
      ],
    }
    addQuestion(newQuestion)
  }

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true)
    try {
      console.log('Quiz data:', data)
      // Here you would call the API to create the quiz
      // await quizApi.create(data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      router.push('/quizzes')
    } catch (error) {
      console.error('Error creating quiz:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  options={[{ value: '', label: 'اختر درس...' }, ...mockLessons]}
                  {...register('lessonId')}
                />
              </div>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الزمني (دقيقة) *
                </label>
                <Input
                  type="number"
                  {...register('timeLimit', { valueAsNumber: true })}
                  placeholder="30"
                  error={errors.timeLimit?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  درجة النجاح (%) *
                </label>
                <Input
                  type="number"
                  {...register('passingScore', { valueAsNumber: true })}
                  placeholder="70"
                  error={errors.passingScore?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد المحاولات المسموحة *
                </label>
                <Input
                  type="number"
                  {...register('maxAttempts', { valueAsNumber: true })}
                  placeholder="3"
                  error={errors.maxAttempts?.message}
                />
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إعدادات إضافية
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
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

                <div className="flex items-center justify-between">
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

                <div className="flex items-center justify-between">
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

                <div className="flex items-center justify-between">
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
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  أسئلة الاختبار
                </h3>
                <p className="text-gray-600">
                  العدد: {questions.length} | إجمالي النقاط: {totalPoints}
                </p>
              </div>
              
              <Button onClick={addNewQuestion} variant="primary">
                <Plus className="h-4 w-4 ml-2" />
                إضافة سؤال
              </Button>
            </div>

            {questions.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد أسئلة
                </h3>
                <p className="text-gray-600 mb-6">
                  ابدأ بإضافة أسئلة لاختبارك
                </p>
                <Button onClick={addNewQuestion} variant="primary">
                  <Plus className="h-5 w-5 ml-2" />
                  إضافة سؤال
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id || index}
                    question={question}
                    index={index}
                    onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                    onDelete={() => removeQuestion(index)}
                    register={register}
                    errors={errors.questions?.[index]}
                  />
                ))}
              </div>
            )}

            {errors.questions && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
                  <p className="text-red-700 text-sm">
                    {errors.questions.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                مراجعة الاختبار
              </h3>
              <p className="text-gray-600">
                تأكد من صحة جميع المعلومات قبل حفظ الاختبار
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quiz Info */}
              <Card className="lg:col-span-2 p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  معلومات الاختبار
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">العنوان: </span>
                    <span className="text-sm text-gray-900">{watch('title')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">الوصف: </span>
                    <span className="text-sm text-gray-900">{watch('description')}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">عدد الأسئلة: </span>
                    <span className="text-sm text-gray-900">{questions.length} سؤال</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">إجمالي النقاط: </span>
                    <span className="text-sm text-gray-900">{totalPoints} نقطة</span>
                  </div>
                </div>
              </Card>

              {/* Quiz Settings */}
              <Card className="p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  الإعدادات
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">الحد الزمني:</span>
                    <span className="text-gray-900">{watch('timeLimit')} دقيقة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">درجة النجاح:</span>
                    <span className="text-gray-900">{watch('passingScore')}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">المحاولات:</span>
                    <span className="text-gray-900">{watch('maxAttempts')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">عرض النتائج:</span>
                    <span className="text-gray-900">
                      {watch('showResultsImmediately') ? 'فوري' : 'يدوي'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Questions Preview */}
            <Card className="p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                معاينة الأسئلة
              </h4>
              
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-900">
                        السؤال {index + 1}
                      </h5>
                      <Badge variant="outline" size="sm">
                        {question.points} نقطة
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{question.text}</p>
                    {question.options && question.options.length > 0 && (
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2 gap-reverse text-xs">
                            <span className={option.isCorrect ? 'text-green-600' : 'text-gray-500'}>
                              {option.isCorrect ? '✓' : '○'}
                            </span>
                            <span className={option.isCorrect ? 'text-green-700' : 'text-gray-600'}>
                              {option.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 gap-reverse">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="sm"
        >
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إنشاء اختبار جديد</h1>
          <p className="text-gray-600">
            اتبع الخطوات لإنشاء اختبار تعليمي شامل
          </p>
        </div>
      </div>

      {/* Steps Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {QUIZ_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === index
            const isCompleted = currentStep > index
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isActive
                      ? 'bg-primary-main border-primary-main text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                
                <div className="mr-3 text-right">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-primary-main' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>

                {index < QUIZ_STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                >
                  <ArrowRight className="h-4 w-4 ml-2" />
                  السابق
                </Button>
              )}
            </div>

            <div className="flex gap-3 gap-reverse">
              {currentStep < QUIZ_STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="primary"
                >
                  التالي
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ الاختبار
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
} 