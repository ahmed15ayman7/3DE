import { useState } from 'react';
import dynamic from 'next/dynamic';
import { CheckCircle, X as Cancel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizApi } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Quiz, Question, Option } from '@shared/prisma';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div /> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div /> });
const Alert = dynamic(() => import('@/components/common/Alert'), { loading: () => <div /> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div /> });

interface QuizSidebarProps {
    quizId: string;
    lessonId: string;
}

interface QuizResponse {
    data: Quiz & {
        questions: Question[];
    };
}

interface SubmissionRequest {
    answers: { questionId: string, optionId: string, isMultipleChoice: boolean }[];
}

interface SubmissionResponse {
    data: {
        score: number;
    };
}

let initialQuiz: Quiz & { questions: (Question & { options: Option[] })[] } = {
    id: 'quiz-1',
    title: 'اختبار المقدمة',
    description: 'اختبار المقدمة',
    createdAt: new Date(),
    updatedAt: new Date(),
    lessonId: 'lesson-1',
    timeLimit: 10,
    passingScore: 70,
    upComing: false,
    isCompleted: true,
    questions: [
        {
            id: 'question-1',
            createdAt: new Date(),
            type: 'MULTIPLE_CHOICE',
            quizId: 'quiz-1',
            text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
            isMultiple: false,
            options: [
                {
                    id: 'option-1',
                    text: 'JavaScript',
                    isCorrect: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
                {
                    id: 'option-2',
                    text: 'Python',
                    isCorrect: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
                {
                    id: 'option-3',
                    text: 'Java',
                    isCorrect: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
                {
                    id: 'option-4',
                    text: 'C++',
                    isCorrect: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
            ],
            points: 1,
            isAnswered: false,
        },
        {
            id: 'question-2',
            createdAt: new Date(),
            type: 'MULTIPLE_CHOICE',
            quizId: 'quiz-1',
            isMultiple: true,
            text: 'ما هي اللغة التي تستخدم لبرمجة الويب؟',
            options: [
                {
                    id: 'option-1',
                    text: 'JavaScript',
                    isCorrect: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
                {
                    id: 'option-2',
                    text: 'Python',
                    isCorrect: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
                {
                    id: 'option-3',
                    text: 'Java',
                    isCorrect: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
                {
                    id: 'option-4',
                    text: 'C++',
                    isCorrect: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    questionId: 'question-1',
                },
            ],
            points: 1,
            isAnswered: false,
        },
    ],
};

export default function QuizSidebar({ quizId, lessonId }: QuizSidebarProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string[] }>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);

    const { data: quiz, isLoading } = useQuery<QuizResponse>({
        queryKey: ['quiz', quizId],
        queryFn: () => quizApi.getById(quizId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    const { mutate: submitQuiz, isPending: isSubmitting } = useMutation<SubmissionResponse, Error, SubmissionRequest>({
        mutationFn: (data) => quizApi.submit(quizId, data),
        onSuccess: (response) => {
            setScore(response.data.score);
            setSubmitted(true);
        },
    });

    const handleAnswerChange = (questionId: string, optionId: string, isMultipleChoice: boolean) => {
        if (isMultipleChoice) {
            setSelectedAnswers(prev => ({
                ...prev,
                [questionId]: prev[questionId]?.includes(optionId)
                    ? prev[questionId].filter(id => id !== optionId)
                    : [...(prev[questionId] || []), optionId]
            }));
        } else {
            setSelectedAnswers(prev => ({
                ...prev,
                [questionId]: [optionId]
            }));
        }
    };

    const handleSubmit = () => {
        const answers = Object.entries(selectedAnswers).map(([questionId, optionIds]) => ({
            questionId,
            optionId: optionIds[0],
            isMultipleChoice: (quiz?.data?.questions || initialQuiz.questions).find(q => q.id === questionId)?.isMultiple || false
        }));

        submitQuiz({ answers });
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton height={100} />
                <Skeleton height={200} />
                <Skeleton height={200} />
            </div>
        );
    }

    const quizData = quiz?.data || initialQuiz;
    const totalQuestions = quizData.questions.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;

    return (
        <div className="space-y-4">
            <Card title={quizData.title} className="bg-white shadow-lg">
                <div className="space-y-4">
                    <p className="text-gray-600">{quizData.description}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                        <span>الأسئلة: {answeredQuestions}/{totalQuestions}</span>
                        <span>الوقت: {quizData.timeLimit} دقيقة</span>
                    </div>

                                         {submitted && score !== null && (
                         <Alert 
                             title={`النتيجة: ${score}%`}
                             message={score >= (quizData.passingScore || 70) ? 'مبروك! لقد نجحت في الاختبار' : 'حاول مرة أخرى'}
                             variant="standard"
                         />
                     )}

                    {!submitted && (
                        <div className="space-y-6">
                            {quizData.questions.map((question, index) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="border rounded-lg p-4 bg-gray-50"
                                >
                                    <h3 className="font-semibold mb-3">
                                        السؤال {index + 1}: {question.text}
                                    </h3>
                                    
                                                                         <div className="space-y-2">
                                         {(question as any).options?.map((option: any) => (
                                            <label
                                                key={option.id}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    selectedAnswers[question.id]?.includes(option.id)
                                                        ? 'bg-primary-50 border-primary-500'
                                                        : 'bg-white border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type={question.isMultiple ? 'checkbox' : 'radio'}
                                                    name={question.id}
                                                    value={option.id}
                                                    checked={selectedAnswers[question.id]?.includes(option.id) || false}
                                                    onChange={() => handleAnswerChange(question.id, option.id, question.isMultiple)}
                                                    className="mr-3"
                                                />
                                                <span className="flex-1">{option.text}</span>
                                            </label>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-sm text-gray-600">
                                    {answeredQuestions === totalQuestions ? (
                                        <span className="text-green-600 flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            جميع الأسئلة مجاب عليها
                                        </span>
                                    ) : (
                                        <span className="text-orange-600 flex items-center">
                                            <Cancel className="w-4 h-4 mr-1" />
                                            {totalQuestions - answeredQuestions} أسئلة متبقية
                                        </span>
                                    )}
                                </span>
                                
                                <Button
                                    variant="default"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || answeredQuestions < totalQuestions}
                                >
                                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الإجابات'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
} 