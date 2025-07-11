"use client"
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@/hooks/useUser';
import { notificationApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const Card = dynamic(() => import('@/components/common/Card'), { loading: () => <div></div> });
const DataGrid = dynamic(() => import('@/components/common/DataGrid'), { loading: () => <div></div> });
const Button = dynamic(() => import('@/components/common/Button'), { loading: () => <div></div> });
const Modal = dynamic(() => import('@/components/common/Modal'), { loading: () => <div></div> });
const Alert = dynamic(() => import('@/components/common/Alert'), { loading: () => <div></div> });


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
                <Button size="sm" variant="outline" onClick={() => { setSelected(params.row); setDialogOpen(true); }}>
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
                        <Button variant="default" onClick={() => markAllAsRead.mutate()} disabled={markAllAsRead.isPending}>
                            {markAllAsRead.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تمييز الكل كمقروء'}
                        </Button>
                        <Button variant="outline" onClick={() => deleteAll.mutate()} disabled={deleteAll.isPending}>
                            {deleteAll.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حذف الكل'}
                        </Button>
                        <Button variant="outline" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            تصدير Excel
                        </Button>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card title='إجمالي الإشعارات'>
                    <div className="text-4xl font-bold">{isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : data?.length || 0}</div>
                </Card>
                <Card title='الإشعارات غير المقروءة'>
                    <div className="text-4xl font-bold">{isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : data?.filter((n: any) => !n.read).length || 0}</div>
                </Card>
                <Card title='الإشعارات اليوم'>
                    <div className="text-4xl font-bold">{isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : data?.filter((n: any) => n.createdAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length || 0}</div>
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
                        <select value={readFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReadFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="all">جميع الإشعارات</option>
                            <option value="unread">غير مقروء</option>
                            <option value="read">مقروء</option>
                        </select>
                        <select value={typeFilter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                            <option value="all">جميع الأنواع</option>
                            <option value="ASSIGNMENT">واجب</option>
                            <option value="GRADE">درجة</option>
                            <option value="MESSAGE">رسالة</option>
                            <option value="ACHIEVEMENT">إنجاز</option>
                            <option value="URGENT">هام</option>
                            <option value="EVENT">فعالية</option>
                            <option value="ABSENCE">غياب</option>
                        </select>
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
            <Modal open={dialogOpen} onClose={() => setDialogOpen(false)} title="تفاصيل الإشعار">
                {selected && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">{selected.title}</h3>
                        <p className="text-gray-700">{selected.message}</p>
                        <p className="text-sm text-gray-600">النوع: {selected.type}</p>
                        <p className="text-sm text-gray-600">التاريخ: {selected.date} {selected.time}</p>
                        <p className="text-sm text-gray-600">تم القراءة: {selected.read ? 'نعم' : 'لا'}</p>
                        {selected.action !== '-' && <Button variant="default" className="mt-2">{selected.action}</Button>}
                    </div>
                )}
                <div className="flex justify-end mt-6">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>إغلاق</Button>
                </div>
            </Modal>
            {/* Snackbar */}
            {snackbar.open && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                    <div className={`px-4 py-2 rounded-md ${snackbar.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        <div className="flex items-center justify-between">
                            <span>{snackbar.msg}</span>
                            <button onClick={() => setSnackbar({ ...snackbar, open: false })} className="ml-2 text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 