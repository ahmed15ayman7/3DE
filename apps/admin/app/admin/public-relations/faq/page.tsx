'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Card, Typography, Dialog, IconButton, Chip, Tooltip, TextField, MenuItem } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { z } from 'zod';
let handleView = (value: any) => {
    console.log('handleView', value);
}
let handleEdit = (value: any) => {
    console.log('handleEdit', value);
}
let handleDelete = (value: any) => {
    console.log('handleDelete', value);
}
// تعريف مخطط التحقق من صحة البيانات
const faqSchema = z.object({
    question: z.string().min(1, 'السؤال مطلوب'),
    answer: z.string().min(1, 'الإجابة مطلوبة'),
    category: z.string().min(1, 'الفئة مطلوبة'),
    isActive: z.boolean().default(true),
});

type FaqFormData = z.infer<typeof faqSchema>;

// تعريف أعمدة الجدول
const columns = [
    {
        field: 'question',
        headerName: 'السؤال',
        flex: 2,
        renderCell: (params: any) => (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {params.value}
            </motion.div>
        ),
    },
    {
        field: 'category',
        headerName: 'الفئة',
        flex: 1,
        renderCell: (params: any) => (
            <Chip
                label={params.value}
                color="primary"
                size="small"
                variant="outlined"
            />
        ),
    },
    {
        field: 'isActive',
        headerName: 'الحالة',
        flex: 1,
        renderCell: (params: any) => (
            <Chip
                label={params.value ? 'نشط' : 'غير نشط'}
                color={params.value ? 'success' : 'error'}
                size="small"
            />
        ),
    },
    {
        field: 'actions',
        headerName: 'الإجراءات',
        flex: 1,
        renderCell: (params: any) => (
            <Box className="flex gap-2">
                <Tooltip title="عرض">
                    <IconButton
                        onClick={() => handleView(params.row)}
                        size="small"
                        className="text-blue-600 hover:bg-blue-50"
                    >
                        <VisibilityIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="تعديل">
                    <IconButton
                        onClick={() => handleEdit(params.row)}
                        size="small"
                        className="text-blue-600 hover:bg-blue-50"
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="حذف">
                    <IconButton
                        onClick={() => handleDelete(params.row.id)}
                        size="small"
                        className="text-red-600 hover:bg-red-50"
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
    },
];

const categories = [
    'عام',
    'التسجيل والقبول',
    'البرامج والمواد',
    'الرسوم والدفع',
    'الخدمات الطلابية',
    'التخرج والشهادات',
];

export default function FaqPage() {
    const [open, setOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<any>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const queryClient = useQueryClient();

    // جلب البيانات
    const { data: faqs, isLoading } = useQuery({
        queryKey: ['faqs'],
        queryFn: async () => {
            const response = await fetch('/api/public-relations/faqs');
            if (!response.ok) throw new Error('فشل في جلب البيانات');
            return response.json();
        },
    });

    // إنشاء سؤال جديد
    const createMutation = useMutation({
        mutationFn: async (data: FaqFormData) => {
            const response = await fetch('/api/public-relations/faqs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('فشل في إنشاء السؤال');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            setOpen(false);
            setSelectedFaq(null);
            toast.success('تم إنشاء السؤال بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء إنشاء السؤال');
        },
    });

    // تحديث سؤال
    const updateMutation = useMutation({
        mutationFn: async (data: { id: string; faq: FaqFormData }) => {
            const response = await fetch(`/api/public-relations/faqs/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.faq),
            });
            if (!response.ok) throw new Error('فشل في تحديث السؤال');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            setOpen(false);
            setSelectedFaq(null);
            toast.success('تم تحديث السؤال بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء تحديث السؤال');
        },
    });

    // حذف سؤال
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/public-relations/faqs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('فشل في حذف السؤال');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast.success('تم حذف السؤال بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء حذف السؤال');
        },
    });

    // تبديل حالة السؤال
    const toggleActiveMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/public-relations/faqs/${id}/toggle-active`, {
                method: 'PATCH',
            });
            if (!response.ok) throw new Error('فشل في تغيير حالة السؤال');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['faqs'] });
            toast.success('تم تغيير حالة السؤال بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء تغيير حالة السؤال');
        },
    });

    const handleView = (faq: any) => {
        setSelectedFaq(faq);
        setIsViewMode(true);
        setOpen(true);
    };

    const handleEdit = (faq: any) => {
        setSelectedFaq(faq);
        setIsViewMode(false);
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSubmit = (data: FaqFormData) => {
        if (selectedFaq) {
            updateMutation.mutate({ id: selectedFaq.id, faq: data });
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6"
        >
            <Card className="p-6 shadow-lg">
                <Box className="mb-6 flex items-center justify-between">
                    <Box>
                        <Typography variant="h5" className="mb-2 font-bold text-gray-800">
                            الأسئلة الشائعة
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            إدارة الأسئلة الشائعة وإجاباتها
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedFaq(null);
                            setIsViewMode(false);
                            setOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        إضافة سؤال جديد
                    </Button>
                </Box>

                <DataGrid
                    rows={faqs || []}
                    columns={columns}
                    loading={isLoading}
                    autoHeight
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    className="bg-white"
                    disableRowSelectionOnClick
                />
            </Card>

            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedFaq(null);
                    setIsViewMode(false);
                }}
                maxWidth="md"
                fullWidth
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                >
                    <Typography variant="h6" className="mb-4 font-bold text-gray-800">
                        {isViewMode ? 'عرض السؤال' : selectedFaq ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
                    </Typography>

                    <Box className="space-y-4">
                        <TextField
                            fullWidth
                            label="السؤال"
                            value={selectedFaq?.question || ''}
                            onChange={(e) => setSelectedFaq({ ...selectedFaq, question: e.target.value })}
                            disabled={isViewMode}
                            multiline
                            rows={2}
                        />

                        <TextField
                            fullWidth
                            label="الإجابة"
                            value={selectedFaq?.answer || ''}
                            onChange={(e) => setSelectedFaq({ ...selectedFaq, answer: e.target.value })}
                            disabled={isViewMode}
                            multiline
                            rows={4}
                        />

                        <TextField
                            fullWidth
                            select
                            label="الفئة"
                            value={selectedFaq?.category || ''}
                            onChange={(e) => setSelectedFaq({ ...selectedFaq, category: e.target.value })}
                            disabled={isViewMode}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>

                        {!isViewMode && (
                            <Box className="flex items-center gap-2">
                                <Typography>الحالة:</Typography>
                                <Chip
                                    label={selectedFaq?.isActive ? 'نشط' : 'غير نشط'}
                                    color={selectedFaq?.isActive ? 'success' : 'error'}
                                    onClick={() => {
                                        if (selectedFaq) {
                                            toggleActiveMutation.mutate(selectedFaq.id);
                                        }
                                    }}
                                    className="cursor-pointer"
                                />
                            </Box>
                        )}
                    </Box>

                    <Box className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                                setSelectedFaq(null);
                                setIsViewMode(false);
                            }}
                        >
                            {isViewMode ? 'إغلاق' : 'إلغاء'}
                        </Button>
                        {!isViewMode && (
                            <Button
                                variant="contained"
                                onClick={() => handleSubmit(selectedFaq)}
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? 'جاري الحفظ...'
                                    : selectedFaq
                                        ? 'حفظ التغييرات'
                                        : 'إضافة السؤال'}
                            </Button>
                        )}
                    </Box>
                </motion.div>
            </Dialog>
        </motion.div>
    );
}
