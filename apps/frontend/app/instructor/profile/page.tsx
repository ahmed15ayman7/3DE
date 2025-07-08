'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { instructorApi, certificateApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div>جاري التحميل...</div> });
const StatsCard = dynamic(() => import('@/components/common/StatsCard'), { loading: () => <div>جاري التحميل...</div> });
const Skeleton = dynamic(() => import('@/components/common/Skeleton'), { loading: () => <div className="my-8"><div className="skeleton-shimmer h-32 w-full rounded-xl mb-4" /><div className="skeleton-shimmer h-32 w-full rounded-xl" /></div> });

export default function InstructorProfile() {
    const { user } = useUser();
    // بيانات المحاضر
    const { data: instructorData, isLoading: isLoadingInstructor } = useQuery({
        queryKey: ['instructor-profile', user?.id],
        queryFn: () => instructorApi.getById(user?.id),
        enabled: !!user?.id,
        select: res => res.data,
    });
    // الدورات
    const { data: courses, isLoading: isLoadingCourses } = useQuery({
        queryKey: ['instructor-courses', user?.id],
        queryFn: () => instructorApi.getCourses(user?.id),
        enabled: !!user?.id,
        select: res => res.data,
    });
    // الشهادات
    const { data: certificates, isLoading: isLoadingCertificates } = useQuery({
        queryKey: ['instructor-certificates', user?.id],
        queryFn: () => certificateApi.getByStudent(user?.id),
        enabled: !!user?.id,
        select: res => res.data,
    });
    // إحصائيات
    const stats = [
        {
            label: 'إجمالي الطلاب',
            value: courses ? courses.reduce((acc, c) => acc + (c.enrollments?.length || 0), 0) : '-',
            color: 'primary' as const,
            },
            {
            label: 'عدد المواد',
            value: courses ? courses.length : '-',
            color: 'info' as const,
            },
    ];
    // Dialog تعديل الملف الشخصي (اختياري)
    const [editOpen, setEditOpen] = React.useState(false);
    const [editForm, setEditForm] = React.useState<any>({});
    const handleOpenEdit = () => {
        setEditForm({
            name: `${instructorData?.user?.firstName || ''} ${instructorData?.user?.lastName || ''}`.trim(),
            email: instructorData?.user?.email,
            phone: instructorData?.user?.phone,
            specialization: instructorData?.title,
            bio: instructorData?.user?.profile?.bio || '',
        });
        setEditOpen(true);
    };
    // أنيميشن
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };
    return (
        <Box className="container mx-auto px-4 py-8">
            <Suspense fallback={<Skeleton height={40} width={300} />}>
                <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
                        <Button variant="contained" color="primary" onClick={handleOpenEdit}>
                            تعديل الملف الشخصي
                        </Button>
            </div>
                </motion.div>
            </Suspense>
            <Grid container spacing={4} className="mb-8">
                <Grid item xs={12} md={4}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card title="الإحصائيات">
                            <StatsCard stats={stats} animate={true} />
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Card title="الشهادات">
                            {isLoadingCertificates ? <Skeleton height={120} /> : (
                        <div className="space-y-4">
                                    {certificates && certificates.length ? certificates.map((cert: any) => (
                                        <motion.div key={cert.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="border-b pb-4">
                                            <h3 className="font-medium">{cert.title}</h3>
                                            <p className="text-gray-600">{cert.issuer || cert.description}</p>
                                            <p className="text-sm text-gray-500">{cert.earnedAt?.split('T')[0]}</p>
                                        </motion.div>
                                    )) : <Typography color="text.secondary">لا توجد شهادات</Typography>}
                            </div>
                            )}
                    </Card>
                    </motion.div>
                </Grid>
                <Grid item xs={12} md={8}>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <Card title="">
                            {isLoadingInstructor ? <Skeleton height={200} /> : (
                                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                                        👨‍🏫
                                        </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold">{`${instructorData?.user?.firstName || ''} ${instructorData?.user?.lastName || ''}`.trim()}</h2>
                                        <p className="text-gray-600">{instructorData?.title || '-'}</p>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4">
                <div>
                                    <h3 className="font-medium mb-2">البريد الإلكتروني</h3>
                                    <p>{instructorData?.user?.email || '-'}</p>
                                </div>
                            <div>
                                    <h3 className="font-medium mb-2">رقم الهاتف</h3>
                                    <p>{instructorData?.user?.phone || '-'}</p>
                            </div>
                            <div>
                                    <h3 className="font-medium mb-2">نبذة عني</h3>
                                    <p>-</p>
                            </div>
                        </div>
                    </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <Card title="المواد التدريبية">
                            {isLoadingCourses ? <Skeleton height={120} /> : (
                                <div className="space-y-4">
                                    {courses && courses.length ? courses.map((course: any) => (
                                        <motion.div key={course.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="border-b pb-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium">{course.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">({course.enrollments?.length || 0} طالب)</span>
                </div>
            </div>
                                        </motion.div>
                                    )) : <Typography color="text.secondary">لا توجد مواد</Typography>}
        </div>
                            )}
                        </Card>
                    </motion.div>
                </Grid>
            </Grid>
            {/* Dialog تعديل الملف الشخصي */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>تعديل الملف الشخصي</DialogTitle>
                <DialogContent>
                    <TextField
                        label="الاسم"
                        value={editForm.name || ''}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="البريد الإلكتروني"
                        value={editForm.email || ''}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="رقم الهاتف"
                        value={editForm.phone || ''}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="التخصص"
                        value={editForm.specialization || ''}
                        onChange={e => setEditForm({ ...editForm, specialization: e.target.value })}
                        fullWidth
                        className="mb-4"
                    />
                    <TextField
                        label="نبذة عني"
                        value={editForm.bio || ''}
                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                        fullWidth
                        multiline
                        minRows={3}
                        className="mb-4"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>إلغاء</Button>
                    <Button variant="contained" color="primary" onClick={() => setEditOpen(false)}>حفظ</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 