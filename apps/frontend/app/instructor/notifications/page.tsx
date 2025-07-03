"use client"
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { notificationApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Select, MenuItem, Typography, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });

export default function InstructorNotifications() {
    const { user } = useUser();
    const userId = user?.id;
    const queryClient = useQueryClient();
    const [typeFilter, setTypeFilter] = useState('all');
    const [readFilter, setReadFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, msg: '', type: 'success' });
    const [selected, setSelected] = useState<any>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // جلب الإشعارات الحقيقية
    const { data, isLoading } = useQuery({
        queryKey: ['instructor-notifications', userId],
        queryFn: () => notificationApi.getAllByUserId(userId),
        enabled: !!userId,
        select: (res) => res.data,
    });

    // تمييز الكل كمقروء
    const markAllAsRead = useMutation({
        mutationFn: () => notificationApi.markAllAsRead(),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instructor-notifications', userId] })
    });
    // حذف الكل
    const deleteAll = useMutation({
        mutationFn: async () => {
            if (!data) return;
            await Promise.all(data.map((n: any) => notificationApi.delete(n.id)));
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['instructor-notifications', userId] })
    });

    // تجهيز البيانات مع البحث والتصفية
    const notifications = useMemo(() => {
        if (!data) return [];
        let filtered = data;
        if (typeFilter !== 'all') filtered = filtered.filter((n: any) => n.type === typeFilter);
        if (readFilter === 'unread') filtered = filtered.filter((n: any) => !n.read);
        if (readFilter === 'read') filtered = filtered.filter((n: any) => n.read);
        if (search) filtered = filtered.filter((n: any) => n.title?.includes(search) || n.message?.includes(search));
        return filtered.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type,
            date: n.createdAt?.slice(0, 10),
            time: n.createdAt?.slice(11, 16),
            read: n.read,
            action: n.actionUrl ? 'عرض' : '-',
        }));
    }, [data, typeFilter, readFilter, search]);

    const columns = [
        { field: 'title', headerName: 'العنوان', width: 200 },
        { field: 'message', headerName: 'الرسالة', width: 300 },
        { field: 'type', headerName: 'النوع', width: 100 },
        { field: 'date', headerName: 'التاريخ', width: 150 },
        { field: 'time', headerName: 'الوقت', width: 100 },
        { field: 'read', headerName: 'تم القراءة', width: 100 },
        { field: 'action', headerName: 'الإجراء', width: 100 },
        {
            field: 'details',
            headerName: 'تفاصيل',
            width: 90,
            renderCell: (params: any) => (
                <Button size="small" variant="outlined" onClick={() => { setSelected(params.row); setDialogOpen(true); }}>
                    عرض
                </Button>
            )
        },
    ];

    // تصدير إلى Excel
    const handleExport = () => {
        if (!notifications.length) return;
        const ws = XLSX.utils.json_to_sheet(notifications);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Notifications');
        XLSX.writeFile(wb, 'notifications.xlsx');
        setSnackbar({ open: true, msg: 'تم تصدير الإشعارات بنجاح', type: 'success' });
    };

    // تحديث Snackbar عند نجاح العمليات
    React.useEffect(() => {
        if (markAllAsRead.isSuccess) setSnackbar({ open: true, msg: 'تم تمييز الكل كمقروء', type: 'success' });
        if (deleteAll.isSuccess) setSnackbar({ open: true, msg: 'تم حذف جميع الإشعارات', type: 'success' });
    }, [markAllAsRead.isSuccess, deleteAll.isSuccess]);

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">الإشعارات</h1>
                <div className="flex gap-4">
                        <Button variant="contained" color="primary" onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
                            {markAllAsRead.isPending ? <CircularProgress size={18} /> : 'تمييز الكل كمقروء'}
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => deleteAll.mutate()} disabled={deleteAll.isPending}>
                            {deleteAll.isPending ? <CircularProgress size={18} /> : 'حذف الكل'}
                        </Button>
                        <Button variant="outlined" color="info" onClick={handleExport}>
                            تصدير Excel
                        </Button>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title='إجمالي الإشعارات'>
                    <div className="text-4xl font-bold">{isLoading ? <CircularProgress size={32} /> : data?.length || 0}</div>
                </Card>
                <Card title='الإشعارات غير المقروءة'>
                    <div className="text-4xl font-bold">{isLoading ? <CircularProgress size={32} /> : data?.filter((n: any) => !n.read).length || 0}</div>
                </Card>
                <Card title='الإشعارات اليوم'>
                    <div className="text-4xl font-bold">{isLoading ? <CircularProgress size={32} /> : data?.filter((n: any) => n.createdAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length || 0}</div>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                    <h2 className="text-2xl font-semibold">قائمة الإشعارات</h2>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="بحث بالعنوان أو الرسالة..."
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <Select value={readFilter} onChange={e => setReadFilter(e.target.value)} size="small">
                            <MenuItem value="all">جميع الإشعارات</MenuItem>
                            <MenuItem value="unread">غير مقروء</MenuItem>
                            <MenuItem value="read">مقروء</MenuItem>
                        </Select>
                        <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} size="small">
                            <MenuItem value="all">جميع الأنواع</MenuItem>
                            <MenuItem value="ASSIGNMENT">واجب</MenuItem>
                            <MenuItem value="GRADE">درجة</MenuItem>
                            <MenuItem value="MESSAGE">رسالة</MenuItem>
                            <MenuItem value="ACHIEVEMENT">إنجاز</MenuItem>
                            <MenuItem value="URGENT">هام</MenuItem>
                            <MenuItem value="EVENT">فعالية</MenuItem>
                            <MenuItem value="ABSENCE">غياب</MenuItem>
                        </Select>
                    </div>
                </div>
                <DataGrid
                    columns={columns}
                    rows={notifications}
                    pageSize={10}
                    checkboxSelection={true}
                    loading={isLoading}
                />
            </motion.div>
            {/* Dialog معاينة التفاصيل */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>تفاصيل الإشعار</DialogTitle>
                <DialogContent>
                    {selected && (
                        <Box className="space-y-2">
                            <Typography variant="h6">{selected.title}</Typography>
                            <Typography variant="body1">{selected.message}</Typography>
                            <Typography variant="body2">النوع: {selected.type}</Typography>
                            <Typography variant="body2">التاريخ: {selected.date} {selected.time}</Typography>
                            <Typography variant="body2">تم القراءة: {selected.read ? 'نعم' : 'لا'}</Typography>
                            {selected.action !== '-' && <Button variant="contained" color="primary" className="mt-2">{selected.action}</Button>}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>إغلاق</Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.type as any} variant="filled">
                    {snackbar.msg}
                </Alert>
            </Snackbar>
        </div>
    );
} 