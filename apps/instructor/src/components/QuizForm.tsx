'use client';

import React, { useState, useRef } from 'react';
import { Button, Input, Textarea, Select, Card, Modal, Badge } from '@3de/ui';
import { Quiz, Question, Option } from '@3de/interfaces';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizFormProps {
  quiz?: Quiz;
  onSubmit: (quizData: Partial<Quiz>) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface QuestionFormData {
  id?: string;
  text: string;
  image?: string;
  type: 'multiple_choice' | 'true_false' | 'text' | 'file_upload';
  options: { text: string; isCorrect: boolean }[];
  points: number;
}

export const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: quiz?.title || '',
    description: quiz?.description || '',
    timeLimit: quiz?.timeLimit || 30,
    passingScore: quiz?.passingScore || 60,
    lessonId: quiz?.lessonId || '',
  });

  const [questions, setQuestions] = useState<QuestionFormData[]>(
    quiz?.questions?.map(q => ({
      id: q.id,
      text: q.text,
      image: q.image,
      type: q.type as any,
      options: q.options?.map(opt => ({
        text: opt.text,
        isCorrect: opt.isCorrect
      })) || [],
      points: q.points
    })) || []
  );

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionFormData | null>(null);
  const [questionForm, setQuestionForm] = useState<QuestionFormData>({
    text: '',
    type: 'multiple_choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    points: 1
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddQuestion = () => {
    setQuestionForm({
      text: '',
      type: 'multiple_choice',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      points: 1
    });
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  const handleEditQuestion = (index: number) => {
    const question = questions[index];
    setQuestionForm(question);
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveQuestion = () => {
    if (!questionForm.text.trim()) return;

    if (editingQuestion) {
      // تحديث السؤال الموجود
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? questionForm : q
      ));
    } else {
      // إضافة سؤال جديد
      setQuestions(prev => [...prev, {
        ...questionForm,
        id: Date.now().toString()
      }]);
    }

    setShowQuestionModal(false);
    setQuestionForm({
      text: '',
      type: 'multiple_choice',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      points: 1
    });
  };

  const handleQuestionChange = (field: string, value: any) => {
    setQuestionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    setQuestionForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const addOption = () => {
    setQuestionForm(prev => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }]
    }));
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length > 2) {
      setQuestionForm(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setQuestionForm(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('يجب إضافة سؤال واحد على الأقل');
      return;
    }

    const quizData = {
      ...formData,
      questions: questions.map(q => ({
        text: q.text,
        image: q.image,
        type: q.type,
        points: q.points,
        options: q.options
      }))
    };

    onSubmit(quizData as any);
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice': return 'اختيار متعدد';
      case 'true_false': return 'صحيح/خطأ';
      case 'text': return 'نص';
      case 'file_upload': return 'رفع ملف';
      default: return type;
    }
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto" padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {quiz ? 'تعديل الاختبار' : 'إنشاء اختبار جديد'}
            </h2>
            <p className="text-gray-600">
              {quiz ? 'قم بتعديل بيانات الاختبار والأسئلة' : 'أنشئ اختباراً جديداً وأضف الأسئلة'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="عنوان الاختبار"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="أدخل عنوان الاختبار"
                required
              />

              <div className="flex gap-4">
                <Input
                  label="المدة الزمنية (دقيقة)"
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                  placeholder="30"
                  min="1"
                  required
                />

                <Input
                  label="درجة النجاح (%)"
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value))}
                  placeholder="60"
                  min="1"
                  max="100"
                  required
                />
              </div>
            </div>

            <Textarea
              label="وصف الاختبار"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="أدخل وصفاً للاختبار"
              rows={3}
            />

            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  الأسئلة ({questions.length})
                </h3>
                <Button
                  type="button"
                  onClick={handleAddQuestion}
                  icon={<span>➕</span>}
                >
                  إضافة سؤال
                </Button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <AnimatePresence>
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              السؤال {index + 1}
                            </span>
                            <Badge variant="outline" size="sm">
                              {getQuestionTypeLabel(question.type)}
                            </Badge>
                            <Badge variant="secondary" size="sm">
                              {question.points} نقطة
                            </Badge>
                          </div>
                          
                          <p className="text-gray-900 mb-2">{question.text}</p>
                          
                          {question.image && (
                            <img 
                              src={question.image} 
                              alt="صورة السؤال"
                              className="w-20 h-20 object-cover rounded-md mb-2"
                            />
                          )}

                          {question.type === 'multiple_choice' && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div 
                                  key={optIndex}
                                  className={`text-sm px-2 py-1 rounded ${
                                    option.isCorrect 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-white text-gray-700'
                                  }`}
                                >
                                  {option.isCorrect && '✓ '}{option.text}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditQuestion(index)}
                            icon={<span>✏️</span>}
                          >
                            <></>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteQuestion(index)}
                            icon={<span>🗑️</span>}
                          >
                            <></>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>لم يتم إضافة أي أسئلة بعد</p>
                    <p className="text-sm">انقر على "إضافة سؤال" لإضافة السؤال الأول</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                loading={loading}
                disabled={questions.length === 0}
                className="flex-1"
              >
                {quiz ? 'حفظ التعديلات' : 'إنشاء الاختبار'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {/* Question Modal */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title={editingQuestion ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
        size="lg"
      >
        <div className="space-y-4">
          <Textarea
            label="نص السؤال"
            value={questionForm.text}
            onChange={(e) => handleQuestionChange('text', e.target.value)}
            placeholder="أدخل نص السؤال"
            rows={3}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="نوع السؤال"
              value={questionForm.type}
              onChange={(e) => handleQuestionChange('type', e.target.value)}
              options={[
                { value: 'multiple_choice', label: 'اختيار متعدد' },
                { value: 'true_false', label: 'صحيح/خطأ' },
                { value: 'text', label: 'نص' },
                { value: 'file_upload', label: 'رفع ملف' }
              ]}
            />

            <Input
              label="عدد النقاط"
              type="number"
              value={questionForm.points}
              onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة السؤال (اختيارية)
            </label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                icon={<span>📷</span>}
              >
                اختر صورة
              </Button>
              {questionForm.image && (
                <div className="relative">
                  <img 
                    src={questionForm.image} 
                    alt="صورة السؤال"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuestionChange('image', undefined)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Options for Multiple Choice */}
          {(questionForm.type === 'multiple_choice' || questionForm.type === 'true_false') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  الخيارات
                </label>
                {questionForm.type === 'multiple_choice' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    icon={<span>➕</span>}
                  >
                    إضافة خيار
                  </Button>
                )}
              </div>

              {questionForm.type === 'true_false' ? (
                <div className="space-y-2">
                  {[
                    { text: 'صحيح', value: 'true' },
                    { text: 'خطأ', value: 'false' }
                  ].map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="radio"
                        name="true_false_answer"
                        checked={questionForm.options[index]?.isCorrect || false}
                        onChange={() => {
                          const newOptions = [
                            { text: 'صحيح', isCorrect: index === 0 },
                            { text: 'خطأ', isCorrect: index === 1 }
                          ];
                          handleQuestionChange('options', newOptions);
                        }}
                        className="text-green-600"
                      />
                      <span className="flex-1">{option.text}</span>
                      <span className="text-sm text-gray-500">
                        {(questionForm.options[index]?.isCorrect) ? '✓ الإجابة الصحيحة' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                        className="text-green-600"
                      />
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                        placeholder={`الخيار ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-main"
                      />
                      {questionForm.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          icon={<span>🗑️</span>}
                        >
                          <></>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleSaveQuestion}
              disabled={!questionForm.text.trim()}
              className="flex-1"
            >
              {editingQuestion ? 'حفظ التعديلات' : 'إضافة السؤال'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowQuestionModal(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 