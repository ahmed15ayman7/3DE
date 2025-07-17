'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Plus,
  Upload,
  X,
  GripVertical,
  RadioIcon,
  CheckSquare,
  FileText,
  Edit3,
  Image as ImageIcon,
  HelpCircle,
} from 'lucide-react'
import { Card, Button, Input, Textarea, Select, Badge, Switch } from '@3de/ui'

interface QuestionOption {
  id?: string
  text: string
  isCorrect: boolean
}

interface Question {
  id?: string
  text: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY' | 'FILL_BLANK'
  points: number
  image?: string
  explanation?: string
  options: QuestionOption[]
}

interface QuestionCardProps {
  question: Question
  index: number
  onUpdate: (question: Question) => void
  onDelete: () => void
  register: any
  errors?: any
}

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'اختيار من متعدد', icon: RadioIcon },
  { value: 'TRUE_FALSE', label: 'صح أم خطأ', icon: CheckSquare },
  { value: 'ESSAY', label: 'سؤال مقالي', icon: FileText },
  { value: 'FILL_BLANK', label: 'اكمل الفراغ', icon: Edit3 },
]

export default function QuestionCard({ 
  question, 
  index, 
  onUpdate, 
  onDelete, 
  register, 
  errors 
}: QuestionCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [imagePreview, setImagePreview] = useState(question.image || '')

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({ ...question, ...updates })
  }

  const updateOption = (optionIndex: number, updates: Partial<QuestionOption>) => {
    const newOptions = [...question.options]
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates }
    updateQuestion({ options: newOptions })
  }

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      text: '',
      isCorrect: false,
    }
    updateQuestion({ options: [...question.options, newOption] })
  }

  const removeOption = (optionIndex: number) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_, index) => index !== optionIndex)
      updateQuestion({ options: newOptions })
    }
  }

  const setCorrectAnswer = (optionIndex: number) => {
    const newOptions = question.options.map((option, index) => ({
      ...option,
      isCorrect: index === optionIndex
    }))
    updateQuestion({ options: newOptions })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setImagePreview(imageUrl)
        updateQuestion({ image: imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const renderQuestionTypeSpecificFields = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                الخيارات (اختر الإجابة الصحيحة)
              </label>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة خيار
              </Button>
            </div>
            
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <motion.div
                  key={option.id || optionIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 gap-reverse p-3 border rounded-lg"
                >
                  <input
                    type="radio"
                    name={`question-${index}-correct`}
                    checked={option.isCorrect}
                    onChange={() => setCorrectAnswer(optionIndex)}
                    className="text-primary-main focus:ring-primary-main"
                  />
                  
                  <div className="flex-1">
                    <Input
                      value={option.text}
                      onChange={(e) => updateOption(optionIndex, { text: e.target.value })}
                      placeholder={`الخيار ${optionIndex + 1}`}
                      error={errors?.options?.[optionIndex]?.text?.message}
                    />
                  </div>
                  
                  {question.options.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(optionIndex)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              الإجابة الصحيحة
            </label>
            <div className="flex gap-4 gap-reverse">
              <label className="flex items-center gap-2 gap-reverse">
                <input
                  type="radio"
                  name={`question-${index}-tf`}
                  checked={question.options[0]?.isCorrect === true}
                  onChange={() => updateQuestion({
                    options: [
                      { id: 'true', text: 'صح', isCorrect: true },
                      { id: 'false', text: 'خطأ', isCorrect: false },
                    ]
                  })}
                  className="text-primary-main focus:ring-primary-main"
                />
                <span className="text-sm text-gray-700">صح</span>
              </label>
              <label className="flex items-center gap-2 gap-reverse">
                <input
                  type="radio"
                  name={`question-${index}-tf`}
                  checked={question.options[0]?.isCorrect === false}
                  onChange={() => updateQuestion({
                    options: [
                      { id: 'true', text: 'صح', isCorrect: false },
                      { id: 'false', text: 'خطأ', isCorrect: true },
                    ]
                  })}
                  className="text-primary-main focus:ring-primary-main"
                />
                <span className="text-sm text-gray-700">خطأ</span>
              </label>
            </div>
          </div>
        )

      case 'ESSAY':
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              معايير التقييم (اختياري)
            </label>
            <Textarea
              value={question.explanation || ''}
              onChange={(e) => updateQuestion({ explanation: e.target.value })}
              placeholder="أدخل معايير التقييم أو النقاط المهمة التي يجب تغطيتها في الإجابة"
              rows={3}
            />
          </div>
        )

      case 'FILL_BLANK':
        return (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              الإجابات المقبولة
            </label>
            <p className="text-xs text-gray-500">
              ضع ___ في النص أعلاه للإشارة للفراغ، ثم أدخل الإجابات المقبولة هنا
            </p>
            
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={option.id || optionIndex} className="flex items-center gap-3 gap-reverse">
                  <Input
                    value={option.text}
                    onChange={(e) => updateOption(optionIndex, { text: e.target.value })}
                    placeholder={`إجابة مقبولة ${optionIndex + 1}`}
                  />
                  {question.options.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(optionIndex)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              onClick={addOption}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-2" />
              إضافة إجابة بديلة
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    return QUESTION_TYPES.find(t => t.value === type)?.label || type
  }

  const getQuestionTypeIcon = (type: string) => {
    const typeData = QUESTION_TYPES.find(t => t.value === type)
    return typeData?.icon || HelpCircle
  }

  const TypeIcon = getQuestionTypeIcon(question.type)

  return (
    <Card className="overflow-hidden">
      {/* Question Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 gap-reverse">
            <div className="flex items-center gap-2 gap-reverse">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <TypeIcon className="h-5 w-5 text-primary-main" />
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                السؤال {index + 1}
              </h4>
              <p className="text-xs text-gray-500">
                {getQuestionTypeLabel(question.type)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 gap-reverse">
            <Badge variant="outline" size="sm">
              {question.points} نقطة
            </Badge>
            
            <Button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              variant="ghost"
              size="sm"
            >
              {isCollapsed ? 'توسيع' : 'طي'}
            </Button>
            
            <Button
              type="button"
              onClick={onDelete}
              variant="ghost"
              size="sm"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 space-y-6">
              {/* Basic Question Info */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع السؤال
                  </label>
                  <Select
                    options={QUESTION_TYPES.map(type => ({
                      value: type.value,
                      label: type.label
                    }))}
                    value={question.type}
                    onChange={(e) => {
                      const newType = e.target.value as Question['type']
                      let newOptions = question.options
                      
                      // Reset options based on question type
                      if (newType === 'TRUE_FALSE') {
                        newOptions = [
                          { id: 'true', text: 'صح', isCorrect: true },
                          { id: 'false', text: 'خطأ', isCorrect: false },
                        ]
                      } else if (newType === 'ESSAY') {
                        newOptions = []
                      } else if (newType === 'FILL_BLANK') {
                        newOptions = [{ id: 'answer-1', text: '', isCorrect: true }]
                      } else if (newType === 'MULTIPLE_CHOICE' && question.options.length < 2) {
                        newOptions = [
                          { id: 'opt-1', text: '', isCorrect: true },
                          { id: 'opt-2', text: '', isCorrect: false },
                        ]
                      }
                      
                      updateQuestion({ type: newType, options: newOptions })
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    النقاط
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={question.points}
                    onChange={(e) => updateQuestion({ points: parseInt(e.target.value) || 1 })}
                    error={errors?.points?.message}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نص السؤال *
                </label>
                <Textarea
                  value={question.text}
                  onChange={(e) => updateQuestion({ text: e.target.value })}
                  placeholder="أدخل نص السؤال..."
                  rows={3}
                  error={errors?.text?.message}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة السؤال (اختياري)
                </label>
                
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="صورة السؤال"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        updateQuestion({ image: '' })
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        اضغط لتحميل صورة
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG أو JPEG
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {/* Question Type Specific Fields */}
              {renderQuestionTypeSpecificFields()}

              {/* Explanation */}
              {question.type !== 'ESSAY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    شرح الإجابة (اختياري)
                  </label>
                  <Textarea
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion({ explanation: e.target.value })}
                    placeholder="شرح يظهر للطلاب بعد الإجابة على السؤال"
                    rows={2}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
} 