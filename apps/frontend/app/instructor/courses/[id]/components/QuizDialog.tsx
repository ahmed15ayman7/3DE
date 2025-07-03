import { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Checkbox,
    Snackbar,
    Alert,
    useTheme,
    Stack,
    Tooltip,
    Slide,
    Skeleton,
} from '@mui/material';
import { Delete, Add, Edit, Close } from '@mui/icons-material';
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
    const theme = useTheme();
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
        <Dialog open={open} onClose={handleDialogClose} maxWidth="md" fullWidth dir="rtl">
            <DialogTitle sx={{ textAlign: 'right', fontWeight: 'bold' }}>إضافة اختبار جديد
                <IconButton onClick={handleDialogClose} sx={{ position: 'absolute', left: 8, top: 8 }}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="عنوان الاختبار"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!validation.title}
                        helperText={validation.title}
                        sx={{ direction: 'rtl' }}
                    />
                    <TextField
                        fullWidth
                        label="وصف الاختبار"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!validation.description}
                        helperText={validation.description}
                        multiline
                        rows={2}
                        sx={{ direction: 'rtl' }}
                    />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
                    الأسئلة
                </Typography>
                <AnimatePresence>
                    {questions.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Typography color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                                لا توجد أسئلة مضافة بعد
                            </Typography>
                        </motion.div>
                    )}
                    {questions.map((question, index) => (
                        <motion.div
                            key={question.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ListItem sx={{ bgcolor: theme.palette.grey[100], borderRadius: 2, mb: 1 }}
                                secondaryAction={
                                    <>
                                        <Tooltip title="تعديل السؤال">
                                            <IconButton edge="end" onClick={() => handleEditQuestion(index)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="حذف السؤال">
                                            <IconButton edge="end" color="error" onClick={() => handleRemoveQuestion(index)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                            >
                                
                                <ListItemText
                                    primary={<b>{question.text}</b>}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2">
                                                عدد الخيارات: {question.options.length} | إجابات صحيحة: {question.options.filter(o => o.isCorrect).length}
                                            </Typography>
                                        </>
                                    }
                                    sx={{ textAlign: 'center' }}
                                />
                            </ListItem>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'right' }}>
                    {editingIndex !== null ? 'تعديل سؤال' : 'إضافة سؤال جديد'}
                </Typography>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="نص السؤال"
                        value={currentQuestion.text}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                        error={!!validation.question}
                        helperText={validation.question}
                        sx={{ direction: 'rtl' }}
                    />
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>متعدد الاختيار</Typography>
                        <Checkbox
                            checked={currentQuestion.isMultiple || currentQuestion.options.filter(opt => opt.isCorrect).length > 1}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, isMultiple: e.target.checked })}
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Button variant="contained" color="primary" onClick={handleAddOption}>
                            إضافة خيار
                        </Button>
                    </Stack>
                    <AnimatePresence>
                        {currentQuestion.options.map((option, idx) => (
                            <motion.div
                                key={option.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <TextField
                                        inputRef={idx === currentQuestion.options.length - 1 ? optionInputRef : undefined}
                                        fullWidth
                                        label={`الخيار ${String.fromCharCode(65 + idx)}`}
                                        value={option.text}
                                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                                        sx={{ direction: 'rtl' }}
                                    />
                                    <Tooltip title="الإجابة الصحيحة">
                                        <Checkbox
                                            checked={option.isCorrect}
                                            onChange={(e) => handleOptionCorrectChange(idx, e.target.checked)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="حذف الخيار">
                                        <IconButton color="error" onClick={() => handleRemoveOption(idx)}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        variant={editingIndex !== null ? 'contained' : 'outlined'}
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddOrEditQuestion}
                        disabled={loading}
                    >
                        {editingIndex !== null ? 'تحديث السؤال' : 'إضافة السؤال'}
                    </Button>
                    {editingIndex !== null && (
                        <Button variant="text" color="secondary" onClick={() => {
                            setCurrentQuestion(emptyQuestion());
                            setEditingIndex(null);
                        }}>
                            إلغاء التعديل
                        </Button>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', flexDirection: 'row-reverse' }}>
                <Button onClick={handleDialogClose} disabled={loading}>إلغاء</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !title || !description || questions.length === 0}
                >
                    {loading ? <Skeleton width={40} /> : 'حفظ'}
                </Button>
            </DialogActions>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                TransitionComponent={Slide}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
} 