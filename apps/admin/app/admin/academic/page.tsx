'use client';

import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicApi } from '@/lib/api';
import { PermissionGuard } from '@/components/PermissionGuard';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

let initialacademicData = [
    {
        id: '1',
        title: 'اجتماع المديرية',
        description: 'اجتماع المديرية',
        type: 'MEETING',
        priority: 'HIGH',
        assignedTo: 'محمد حسين',
        dueDate: '2025-01-01',
        instructor: 'محمد حسين',
        startDate: '2025-01-01',
        endDate: '2025-01-01',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByAdminId: '1',
        updatedByAdminId: '1',
        academyId: '1',
        createdByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
        updatedByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
    },
    {
        id: '2',
        title: 'اجتماع المديرية',
        description: 'اجتماع المديرية',
        type: 'MEETING',
        priority: 'HIGH',
        assignedTo: 'محمد حسين',
        dueDate: '2025-01-01',
        instructor: 'محمد حسين',
        startDate: '2025-01-01',
        endDate: '2025-01-01',
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByAdminId: '1',
        updatedByAdminId: '1',
        academyId: '1',
        createdByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
        updatedByAdmin: {
            id: '1',
            name: 'محمد حسين',
        },
    },
]

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export default function AcademicPage() {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [tabValue, setTabValue] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        level: '',
        instructor: '',
        startDate: '',
        endDate: '',
        status: 'PENDING',
    });
    const queryClient = useQueryClient();

    const { data: academicData } = useQuery({
        queryKey: ['academic'],
        queryFn: () => academicApi.getAll('academy-id'),
    });

    const addCourseMutation = useMutation({
        mutationFn: (data: any) => academicApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic'] });
            setOpen(false);
            setFormData({
                title: '',
                description: '',
                type: '',
                level: '',
                instructor: '',
                startDate: '',
                endDate: '',
                status: 'PENDING',
            });
        },
    });

    const updateCourseMutation = useMutation({
        mutationFn: (data: any) => academicApi.update(selectedItem?.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic'] });
            setOpen(false);
            setSelectedItem(null);
            setFormData({
                title: '',
                description: '',
                type: '',
                level: '',
                instructor: '',
                startDate: '',
                endDate: '',
                status: 'PENDING',
            });
        },
    });

    const deleteCourseMutation = useMutation({
        mutationFn: (id: string) => academicApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['academic'] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItem) {
            updateCourseMutation.mutate({
                ...formData,
                academyId: 'academy-id',
                updatedByAdminId: 'admin-id',
            });
        } else {
            addCourseMutation.mutate({
                ...formData,
                academyId: 'academy-id',
                createdByAdminId: 'admin-id',
            });
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            type: item.type,
            level: item.level,
            instructor: item.instructor,
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status,
        });
        setOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            deleteCourseMutation.mutate(id);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'IN_PROGRESS':
                return 'info';
            case 'PENDING':
                return 'warning';
            case 'COMPLETED':
                return 'default';
            case 'CANCELLED':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'نشط';
            case 'IN_PROGRESS':
                return 'قيد التنفيذ';
            case 'PENDING':
                return 'قيد الانتظار';
            case 'COMPLETED':
                return 'مكتمل';
            case 'CANCELLED':
                return 'ملغي';
            default:
                return status;
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'COURSE':
                return 'دورة';
            case 'WORKSHOP':
                return 'ورشة عمل';
            case 'SEMINAR':
                return 'ندوة';
            case 'TRAINING':
                return 'تدريب';
            default:
                return type;
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'BEGINNER':
                return 'مبتدئ';
            case 'INTERMEDIATE':
                return 'متوسط';
            case 'ADVANCED':
                return 'متقدم';
            default:
                return level;
        }
    };

    const filteredItems = (academicData?.data ?? initialacademicData).filter((item: any) => {
        switch (tabValue) {
            case 0:
                return item.status === 'PENDING';
            case 1:
                return item.status === 'ACTIVE';
            case 2:
                return item.status === 'IN_PROGRESS';
            case 3:
                return item.status === 'COMPLETED';
            case 4:
                return item.status === 'CANCELLED';
            default:
                return true;
        }
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">الشؤون الأكاديمية</Typography>
                <PermissionGuard requiredPermissions={['manageAcademic']}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedItem(null);
                            setFormData({
                                title: '',
                                description: '',
                                type: '',
                                level: '',
                                instructor: '',
                                startDate: '',
                                endDate: '',
                                status: 'PENDING',
                            });
                            setOpen(true);
                        }}
                    >
                        إضافة برنامج أكاديمي
                    </Button>
                </PermissionGuard>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="قيد الانتظار" />
                    <Tab label="نشط" />
                    <Tab label="قيد التنفيذ" />
                    <Tab label="مكتمل" />
                    <Tab label="ملغي" />
                </Tabs>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>العنوان</TableCell>
                            <TableCell>النوع</TableCell>
                            <TableCell>المستوى</TableCell>
                            <TableCell>المدرس</TableCell>
                            <TableCell>تاريخ البدء</TableCell>
                            <TableCell>تاريخ الانتهاء</TableCell>
                            <TableCell>الحالة</TableCell>
                            <TableCell>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredItems?.map((item: any) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getTypeText(item.type)}
                                        color="primary"
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{getLevelText(item.level)}</TableCell>
                                <TableCell>{item.instructor}</TableCell>
                                <TableCell>
                                    {format(new Date(item.startDate), 'PPP', { locale: arSA })}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(item.endDate), 'PPP', { locale: arSA })}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(item.status)}
                                        color={getStatusColor(item.status) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <PermissionGuard requiredPermissions={['manageAcademic']}>
                                        <IconButton size="small" onClick={() => handleEdit(item)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </PermissionGuard>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedItem ? 'تعديل البرنامج الأكاديمي' : 'إضافة برنامج أكاديمي جديد'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="العنوان"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="الوصف"
                                    multiline
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="النوع"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                    required
                                >
                                    <option value="COURSE">دورة</option>
                                    <option value="WORKSHOP">ورشة عمل</option>
                                    <option value="SEMINAR">ندوة</option>
                                    <option value="TRAINING">تدريب</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="المستوى"
                                    value={formData.level}
                                    onChange={(e) =>
                                        setFormData({ ...formData, level: e.target.value })
                                    }
                                    required
                                >
                                    <option value="BEGINNER">مبتدئ</option>
                                    <option value="INTERMEDIATE">متوسط</option>
                                    <option value="ADVANCED">متقدم</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="المدرب"
                                    value={formData.instructor}
                                    onChange={(e) =>
                                        setFormData({ ...formData, instructor: e.target.value })
                                    }
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="الحالة"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({ ...formData, status: e.target.value })
                                    }
                                    required
                                >
                                    <option value="PENDING">قيد الانتظار</option>
                                    <option value="ACTIVE">نشط</option>
                                    <option value="IN_PROGRESS">قيد التنفيذ</option>
                                    <option value="COMPLETED">مكتمل</option>
                                    <option value="CANCELLED">ملغي</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="تاريخ البدء"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, startDate: e.target.value })
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="تاريخ الانتهاء"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) =>
                                        setFormData({ ...formData, endDate: e.target.value })
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained">
                            {selectedItem ? 'تحديث' : 'إضافة'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
} 