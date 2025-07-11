import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { quizApi } from '@/lib/api';
import { Option, Question, Quiz } from '@shared/prisma';
import { AnimatePresence, motion } from 'framer-motion';

interface QuizDialogProps {
    open: boolean;
    onClose: () => void;
    lessonId: string;
}

const emptyQuestion = (): Question & { options: Option[] } => ({
    id: `${Math.random().toString(36).substring(2, 15)}`,
    type: '',
    points: 0,
    isAnswered: false,
    quizId: '',
    createdAt: new Date(),
    text: '',
    options: [],
    isMultiple: false,
});

export default function QuizDialog({ open, onClose, lessonId }: QuizDialogProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<(Question & { options: Option[] })[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question & { options: Option[] }>(emptyQuestion());
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState<{ title?: string; description?: string; question?: string; options?: string }>({});
    const queryClient = useQueryClient();
    const optionInputRef = useRef<HTMLInputElement>(null);

    const createQuizMutation = useMutation({
        mutationFn: (data: Quiz & { questions: (Question & { options: Option[] })[] }) => quizApi.create({ ...data, lessonId }),
        onMutate: () => setLoading(true),
        onSuccess: () => {
            setSnackbar({ open: true, message: 'تم حفظ الاختبار بنجاح', severity: 'success' });
            queryClient.invalidateQueries({ queryKey: ['quizzes', lessonId] });
            handleReset();
            onClose();
        },
        onError: () => {
            setSnackbar({ open: true, message: 'حدث خطأ أثناء الحفظ', severity: 'error' });
        },
        onSettled: () => setLoading(false),
    });

    const handleReset = () => {
        setTitle('');
        setDescription('');
        setQuestions([]);
        setCurrentQuestion(emptyQuestion());
        setEditingIndex(null);
        setValidation({});
    };

    const validateQuestion = (q: Question & { options: Option[] }) => {
        if (!q.text.trim()) return 'يجب كتابة نص السؤال';
        if (q.options.length < 2) return 'يجب إضافة خيارين على الأقل';
        if (q.options.some(opt => !opt.text.trim())) return 'لا يمكن ترك خيار فارغ';
        if (!q.options.some(opt => opt.isCorrect)) return 'حدد الإجابة الصحيحة';
        return '';
    };

    const handleAddOrEditQuestion = () => {
        const error = validateQuestion(currentQuestion);
        if (error) {
            setValidation({ ...validation, question: error });
            setSnackbar({ open: true, message: error, severity: 'error' });
            return;
        }
        setValidation({ ...validation, question: undefined });
        if (editingIndex !== null) {
            const updated = [...questions];
            updated[editingIndex] = currentQuestion;
            setQuestions(updated);
            setEditingIndex(null);
        } else {
            setQuestions([...questions, currentQuestion]);
        }
        setCurrentQuestion(emptyQuestion());
    };

    const handleEditQuestion = (index: number) => {
        setCurrentQuestion(questions[index]);
        setEditingIndex(index);
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
        if (editingIndex === index) {
            setCurrentQuestion(emptyQuestion());
            setEditingIndex(null);
        }
    };

    const handleAddOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, { id: `${Math.random()}`, text: '', isCorrect: false, createdAt: new Date(), questionId: '', updatedAt: new Date() }],
        });
        setTimeout(() => optionInputRef.current?.focus(), 100);
    };

    const handleRemoveOption = (idx: number) => {
        setCurrentQuestion({
            ...currentQuestion,
            options: currentQuestion.options.filter((_, i) => i !== idx),
        });
    };

    const handleOptionTextChange = (idx: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[idx] = { ...newOptions[idx], text: value };
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleOptionCorrectChange = (idx: number, checked: boolean) => {
        let newOptions = [...currentQuestion.options];
        if (currentQuestion.isMultiple || newOptions.filter(opt => opt.isCorrect).length > 1) {
            newOptions[idx] = { ...newOptions[idx], isCorrect: checked };
        } else {
            newOptions = newOptions.map((opt, i) => ({ ...opt, isCorrect: i === idx ? checked : false }));
        }
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const handleSubmit = () => {
        let valid = true;
        const v: typeof validation = {};
        if (!title.trim()) {
            v.title = 'يجب كتابة عنوان للاختبار';
            valid = false;
        }
        if (!description.trim()) {
            v.description = 'يجب كتابة وصف للاختبار';
            valid = false;
        }
        if (questions.length === 0) {
            v.question = 'أضف سؤالًا واحدًا على الأقل';
            valid = false;
        }
        setValidation(v);
        if (!valid) {
            setSnackbar({ open: true, message: 'يرجى استكمال جميع الحقول المطلوبة', severity: 'error' });
            return;
        }
        createQuizMutation.mutate({
            title,
            description,
            questions,
            lessonId,
            id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            timeLimit: 0,
            passingScore: 0,
            upComing: false,
            isCompleted: false,
        });
    };

    // Reset form on close
    const handleDialogClose = () => {
        handleReset();
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all ${open ? '' : 'hidden'}`} dir="rtl">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
                <button onClick={handleDialogClose} className="absolute left-4 top-4 text-gray-500 hover:text-red-500 text-xl font-bold">×</button>
                <h2 className="text-xl font-bold mb-4 text-right">إضافة اختبار جديد</h2>
                <div className="grid gap-4 mb-4">
                    <div>
                        <input
                            type="text"
                            className={`w-full border rounded p-2 ${validation.title ? 'border-red-500' : ''}`}
                            placeholder="عنوان الاختبار"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                        {validation.title && <p className="text-red-500 text-xs mt-1">{validation.title}</p>}
                    </div>
                    <div>
                        <textarea
                            className={`w-full border rounded p-2 ${validation.description ? 'border-red-500' : ''}`}
                            placeholder="وصف الاختبار"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={2}
                        />
                        {validation.description && <p className="text-red-500 text-xs mt-1">{validation.description}</p>}
                    </div>
                </div>
                <hr className="my-4" />
                <h3 className="font-bold mb-2 text-right">الأسئلة</h3>
                <AnimatePresence>
                    {questions.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="text-center text-gray-500 my-2">لا توجد أسئلة مضافة بعد</p>
                        </motion.div>
                    )}
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                        >
                            <div className="border rounded p-3 mb-2 bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">{index + 1}. {question.text}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEditQuestion(index)} className="text-blue-600 hover:underline text-xs">تعديل</button>
                                        <button onClick={() => handleRemoveQuestion(index)} className="text-red-600 hover:underline text-xs">حذف</button>
                                    </div>
                                </div>
                                <ul className="list-disc pr-5">
                                    {question.options.map((opt, idx) => (
                                        <li key={opt.id} className={opt.isCorrect ? 'text-green-700 font-bold' : ''}>
                                            {opt.text} {opt.isCorrect && <span className="ml-2 text-green-500">✔</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="border rounded p-4 my-4">
                    <h4 className="font-bold mb-2">{editingIndex !== null ? 'تعديل سؤال' : 'إضافة سؤال جديد'}</h4>
                    <input
                        type="text"
                        className={`w-full border rounded p-2 mb-2 ${validation.question ? 'border-red-500' : ''}`}
                        placeholder="نص السؤال"
                        value={currentQuestion.text}
                        onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                    />
                    <div className="flex flex-col gap-2 mb-2">
                        {currentQuestion.options.map((opt, idx) => (
                            <div key={opt.id} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    className="border rounded p-2 flex-1"
                                    placeholder={`الخيار ${idx + 1}`}
                                    value={opt.text}
                                    onChange={e => handleOptionTextChange(idx, e.target.value)}
                                    ref={idx === currentQuestion.options.length - 1 ? optionInputRef : undefined}
                                />
                                <input
                                    type="checkbox"
                                    checked={opt.isCorrect}
                                    onChange={e => handleOptionCorrectChange(idx, e.target.checked)}
                                />
                                <span className="text-xs">صحيح</span>
                                <button onClick={() => handleRemoveOption(idx)} className="text-red-500 text-xs">حذف</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddOption} className="bg-gray-200 hover:bg-gray-300 rounded px-3 py-1 text-xs font-bold mb-2">إضافة خيار</button>
                    {validation.question && <p className="text-red-500 text-xs mt-1">{validation.question}</p>}
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleAddOrEditQuestion}
                            className="bg-blue-600 text-white rounded px-4 py-1 font-bold hover:bg-blue-700"
                            disabled={loading}
                        >
                            {editingIndex !== null ? 'حفظ التعديل' : 'إضافة السؤال'}
                        </button>
                        {editingIndex !== null && (
                            <button
                                onClick={() => { setCurrentQuestion(emptyQuestion()); setEditingIndex(null); }}
                                className="bg-gray-300 text-gray-800 rounded px-4 py-1 font-bold hover:bg-gray-400"
                            >
                                إلغاء
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={handleDialogClose}
                        className="bg-gray-300 text-gray-800 rounded px-4 py-2 font-bold hover:bg-gray-400"
                        disabled={loading}
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white rounded px-4 py-2 font-bold hover:bg-green-700"
                        disabled={loading}
                    >
                        حفظ الاختبار
                    </button>
                </div>
                {snackbar.open && (
                    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg ${snackbar.severity === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'}`}>
                        {snackbar.message}
                    </div>
                )}
            </div>
        </div>
    );
} 