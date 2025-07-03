'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Card, Typography, Dialog, IconButton, Chip, Tooltip, TextField, MenuItem, Rating } from '@mui/material';
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
const testimonialSchema = z.object({
    name: z.string().min(1, 'الاسم مطلوب'),
    feedback: z.string().min(1, 'التقييم مطلوب'),
    rating: z.number().min(1).max(5),
    image: z.string().optional(),
    videoUrl: z.string().optional(),
    courseId: z.string().optional(),
    academyId: z.string().min(1, 'الأكاديمية مطلوبة'),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

// تعريف أعمدة الجدول
const columns = [
    {
        field: 'name',
        headerName: 'الاسم',
        flex: 1,
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
        field: 'rating',
        headerName: 'التقييم',
        flex: 1,
        renderCell: (params: any) => (
            <Rating value={params.value} readOnly precision={0.5} />
        ),
    },
    {
        field: 'course',
        headerName: 'الدورة',
        flex: 1,
        renderCell: (params: any) => (
            params.row.course ? (
                <Chip
                    label={params.row.course.title}
                    color="primary"
                    size="small"
                    variant="outlined"
                />
            ) : (
                <Typography variant="body2" color="text.secondary">
                    -
                </Typography>
            )
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

export default function TestimonialsPage() {
    const [open, setOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
    const [isViewMode, setIsViewMode] = useState(false);

    const queryClient = useQueryClient();

    // جلب البيانات
    const { data: testimonials, isLoading } = useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const response = await fetch('/api/public-relations/testimonials');
            if (!response.ok) throw new Error('فشل في جلب البيانات');
            return response.json();
        },
    });

    // جلب المواد
    const { data: courses } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const response = await fetch('/api/courses');
            if (!response.ok) throw new Error('فشل في جلب المواد');
            return response.json();
        },
    });

    // إنشاء شهادة جديدة
    const createMutation = useMutation({
        mutationFn: async (data: TestimonialFormData) => {
            const response = await fetch('/api/public-relations/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('فشل في إنشاء الشهادة');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            setOpen(false);
            setSelectedTestimonial(null);
            toast.success('تم إنشاء الشهادة بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء إنشاء الشهادة');
        },
    });

    // تحديث شهادة
    const updateMutation = useMutation({
        mutationFn: async (data: { id: string; testimonial: TestimonialFormData }) => {
            const response = await fetch(`/api/public-relations/testimonials/${data.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data.testimonial),
            });
            if (!response.ok) throw new Error('فشل في تحديث الشهادة');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            setOpen(false);
            setSelectedTestimonial(null);
            toast.success('تم تحديث الشهادة بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء تحديث الشهادة');
        },
    });

    // حذف شهادة
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/public-relations/testimonials/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('فشل في حذف الشهادة');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['testimonials'] });
            toast.success('تم حذف الشهادة بنجاح');
        },
        onError: (error) => {
            toast.error('حدث خطأ أثناء حذف الشهادة');
        },
    });

    const handleView = (testimonial: any) => {
        setSelectedTestimonial(testimonial);
        setIsViewMode(true);
        setOpen(true);
    };

    const handleEdit = (testimonial: any) => {
        setSelectedTestimonial(testimonial);
        setIsViewMode(false);
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الشهادة؟')) {
            deleteMutation.mutate(id);
        }
    };

    const handleSubmit = (data: TestimonialFormData) => {
        if (selectedTestimonial) {
            updateMutation.mutate({ id: selectedTestimonial.id, testimonial: data });
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
                            الشهادات والتقديرات
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            إدارة شهادات وتقييمات الطلاب
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedTestimonial(null);
                            setIsViewMode(false);
                            setOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        إضافة شهادة جديدة
                    </Button>
                </Box>

                <DataGrid
                    rows={testimonials || []}
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
                    setSelectedTestimonial(null);
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
                        {isViewMode ? 'عرض الشهادة' : selectedTestimonial ? 'تعديل الشهادة' : 'إضافة شهادة جديدة'}
                    </Typography>

                    <Box className="space-y-4">
                        <TextField
                            fullWidth
                            label="الاسم"
                            value={selectedTestimonial?.name || ''}
                            onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, name: e.target.value })}
                            disabled={isViewMode}
                        />

                        <TextField
                            fullWidth
                            label="التقييم"
                            value={selectedTestimonial?.feedback || ''}
                            onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, feedback: e.target.value })}
                            disabled={isViewMode}
                            multiline
                            rows={4}
                        />

                        <Box className="flex items-center gap-2">
                            <Typography>التقييم:</Typography>
                            <Rating
                                value={selectedTestimonial?.rating || 0}
                                onChange={(_, value) => setSelectedTestimonial({ ...selectedTestimonial, rating: value })}
                                disabled={isViewMode}
                            />
                        </Box>

                        <TextField
                            fullWidth
                            select
                            label="الدورة"
                            value={selectedTestimonial?.courseId || ''}
                            onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, courseId: e.target.value })}
                            disabled={isViewMode}
                        >
                            <MenuItem value="">
                                <em>لا يوجد</em>
                            </MenuItem>
                            {courses?.map((course: any) => (
                                <MenuItem key={course.id} value={course.id}>
                                    {course.title}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="رابط الصورة"
                            value={selectedTestimonial?.image || ''}
                            onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, image: e.target.value })}
                            disabled={isViewMode}
                        />

                        <TextField
                            fullWidth
                            label="رابط الفيديو"
                            value={selectedTestimonial?.videoUrl || ''}
                            onChange={(e) => setSelectedTestimonial({ ...selectedTestimonial, videoUrl: e.target.value })}
                            disabled={isViewMode}
                        />
                    </Box>

                    <Box className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setOpen(false);
                                setSelectedTestimonial(null);
                                setIsViewMode(false);
                            }}
                        >
                            {isViewMode ? 'إغلاق' : 'إلغاء'}
                        </Button>
                        {!isViewMode && (
                            <Button
                                variant="contained"
                                onClick={() => handleSubmit(selectedTestimonial)}
                                disabled={createMutation.isPending || updateMutation.isPending}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? 'جاري الحفظ...'
                                    : selectedTestimonial
                                        ? 'حفظ التغييرات'
                                        : 'إضافة الشهادة'}
                            </Button>
                        )}
                    </Box>
                </motion.div>
            </Dialog>
        </motion.div>
    );
}