'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, CheckSquare } from 'lucide-react';
import { Radio as RadioComponent, Checkbox } from '@3de/ui';
import { Question } from '@3de/interfaces';

interface QuizQuestionProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
  currentAnswer?: string | string[];
}

export default function QuizQuestion({ 
  question, 
  onAnswer, 
  currentAnswer 
}: QuizQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    currentAnswer ? (Array.isArray(currentAnswer) ? currentAnswer : [currentAnswer]) : []
  );

  const handleAnswerChange = (value: string, checked: boolean) => {
    let newAnswers: string[];

    if (question.isMultiple) {
      if (checked) {
        newAnswers = [...selectedAnswers, value];
      } else {
        newAnswers = selectedAnswers.filter(answer => answer !== value);
      }
    } else {
      newAnswers = [value];
    }

    setSelectedAnswers(newAnswers);
    onAnswer(question.isMultiple ? newAnswers : newAnswers[0] || '');
  };

  const isAnswerSelected = (value: string) => {
    return selectedAnswers.includes(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      {/* Question Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            السؤال {question.id}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">النقاط:</span>
            <span className="text-sm font-medium text-primary-main">
              {question.points}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <p className="text-gray-900 leading-relaxed">
            {question.text}
          </p>
        </div>

        {/* Question Image */}
        {question.image && (
          <div className="mb-4">
            <img
              src={question.image}
              alt="صورة السؤال"
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              isAnswerSelected(option.id)
                ? 'border-primary-main bg-primary-main/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => handleAnswerChange(option.id, !isAnswerSelected(option.id))}
          >
            <div className="flex items-center gap-3">
              {question.isMultiple ? (
                <Checkbox
                  checked={isAnswerSelected(option.id)}
                  onChange={(checked: boolean) => handleAnswerChange(option.id, checked)}
                  className="flex-shrink-0"
                />
              ) : (
                <RadioComponent
                  id={option.id}
                  name={option.id}
                  value={option.id}
                  checked={isAnswerSelected(option.id)}
                  onChange={() => handleAnswerChange(option.id, true)}
                  className="flex-shrink-0"
                />
              )}
              
              <div className="flex-1">
                <span className="text-gray-900">
                  {option.text}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Question Type Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {question.isMultiple ? (
            <>
              <CheckSquare className="w-4 h-4" />
              <span>اختيار متعدد</span>
            </>
          ) : (
            <>
              <Radio className="w-4 h-4" />
              <span>اختيار واحد</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
} 